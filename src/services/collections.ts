// src/services/collections.ts
import { prisma } from '@/lib/prisma'
import { Helius } from 'helius-sdk'
import { Cache } from '@/lib/cache'
import { env } from '@/lib/env'
import type { Collection, Event, Poap, CreatorAccess, PoapHolder, Prisma } from '@prisma/client'

// Initialize Helius SDK and cache
const helius = new Helius(env.HELIUS_API_KEY)
const cache = new Cache('collections:')

// Types for collection management
interface CreateCollectionInput {
  name: string
  description?: string
  mintAuthority: string  // Solana public key
  isOfficial?: boolean
  website?: string
  twitter?: string
  discord?: string
  logo?: string        // IPFS/Arweave URI
}

interface UpdateCollectionInput extends Partial<CreateCollectionInput> {
  id: string
}

interface CreateEventInput {
  name: string
  description?: string
  startDate: Date
  endDate: Date
  eventType?: 'VIRTUAL' | 'IN_PERSON' | 'HYBRID'
  location?: string
  maxSupply?: number
  website?: string
  coverImage?: string
}

interface SyncOptions {
  forceUpdate?: boolean
  updateStats?: boolean
}

export class CollectionService {
  /**
   * Creates a new POAP collection with initial creator access
   */
  static async createCollection(
    input: CreateCollectionInput,
    creatorWallet: string
  ): Promise<Collection> {
    return prisma.$transaction(async (tx) => {
      // Create the collection
      const collection = await tx.collection.create({
        data: {
          ...input,
          isActive: true
        }
      })

      // Grant admin access to creator
      await tx.creatorAccess.create({
        data: {
          collectionId: collection.id,
          walletAddress: creatorWallet,
          role: 'ADMIN',
          isActive: true,
          canCreateEvents: true,
          canMintPoaps: true,
          canEditDetails: true
        }
      })

      // Clear cache
      await cache.delete(`collection:${input.mintAuthority}`)

      return collection
    })
  }

  /**
   * Updates an existing collection's details after checking permissions
   */
  static async updateCollection(
    input: UpdateCollectionInput,
    updaterWallet: string
  ): Promise<Collection> {
    // Check permissions
    const hasAccess = await this.checkAccess(input.id, updaterWallet, 'MODERATOR')
    if (!hasAccess) {
      throw new Error('Not authorized to update collection')
    }

    // Update collection
    const collection = await prisma.collection.update({
      where: { id: input.id },
      data: {
        ...input,
        updatedAt: new Date()
      }
    })

    // Clear cache
    await cache.delete(`collection:${collection.mintAuthority}`)

    return collection
  }

  /**
   * Creates a new event in a collection after checking permissions
   */
  static async createEvent(
    collectionId: string,
    data: CreateEventInput,
    creatorWallet: string
  ): Promise<Event> {
    // Check permissions
    const access = await this.getCreatorAccess(collectionId, creatorWallet)
    if (!access?.canCreateEvents) {
      throw new Error('Not authorized to create events')
    }

    return prisma.event.create({
      data: {
        ...data,
        collection: { connect: { id: collectionId } }
      }
    })
  }

  /**
   * Mints a new POAP to an event after checking permissions
   */
  static async mintPoap(
    eventId: string,
    data: Omit<Prisma.PoapCreateInput, 'event' | 'collection'>,
    minterWallet: string
  ): Promise<Poap> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { collection: true }
    })

    if (!event) throw new Error('Event not found')

    // Check permissions
    const access = await this.getCreatorAccess(event.collectionId, minterWallet)
    if (!access?.canMintPoaps) {
      throw new Error('Not authorized to mint POAPs')
    }

    // Check event is active and not closed
    if (!event.isActive || event.isClosed) {
      throw new Error('Event is not active or has been closed')
    }

    // Check max supply if set
    if (event.maxSupply) {
      const currentSupply = await prisma.poap.count({
        where: { eventId }
      })
      if (currentSupply >= event.maxSupply) {
        throw new Error('Event has reached maximum supply')
      }
    }

    // Create POAP with holder
    return prisma.poap.create({
      data: {
        ...data,
        event: { connect: { id: eventId } },
        collection: { connect: { id: event.collectionId } }
      }
    })
  }

  /**
   * Syncs POAPs from Helius for a collection
   */
  static async syncPoaps(
    collectionId: string,
    options: { forceUpdate?: boolean } = {}
  ) {
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId }
    })

    if (!collection) throw new Error('Collection not found')

    // Check cache unless force update
    if (!options.forceUpdate) {
      const cached = await cache.get(`collection:poaps:${collectionId}`)
      if (cached) return JSON.parse(cached)
    }

    // Fetch assets from Helius
    const assets = await helius.rpc.getAssetsByGroup({
      groupKey: "collection",
      groupValue: collection.mintAuthority,
      page: 1,
      limit: 1000 // Max per request
    })

    if (!assets?.items?.length) return []

    // Process assets in batches of 100
    const batchSize = 100
    const poaps: Poap[] = []

    for (let i = 0; i < assets.items.length; i += batchSize) {
      const batch = assets.items.slice(i, i + batchSize)
      
      // Create/update POAPs and events in transaction
      const results = await prisma.$transaction(
        batch.map(asset => {
          const eventDate = new Date(
            asset.content?.metadata?.eventDate || 
            asset.mintedDate
          )

          // Find or create event for this month
          return prisma.event.upsert({
            where: {
              id: `${collection.id}:${eventDate.getMonth()}:${eventDate.getFullYear()}`
            },
            create: {
              name: `${collection.name} - ${eventDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric'
              })}`,
              startDate: eventDate,
              endDate: new Date(eventDate.getTime() + 24 * 60 * 60 * 1000),
              collection: { connect: { id: collection.id } }
            },
            update: {},
          }).then(event => {
            // Create/update POAP and holder
            return prisma.poap.upsert({
              where: { assetId: asset.id },
              create: {
                name: asset.content.metadata.name,
                description: asset.content.metadata.description,
                image: asset.content.files[0]?.uri || '',
                assetId: asset.id,
                mintAddress: asset.id,
                collection: { connect: { id: collection.id } },
                event: { connect: { id: event.id } },
                holders: {
                  create: {
                    walletAddress: asset.ownership.owner,
                    acquiredAt: new Date(asset.mintedDate)
                  }
                }
              },
              update: {
                holders: {
                  upsert: {
                    where: {
                      poapId_walletAddress: {
                        poapId: asset.id,
                        walletAddress: asset.ownership.owner
                      }
                    },
                    create: {
                      walletAddress: asset.ownership.owner,
                      acquiredAt: new Date(asset.mintedDate)
                    },
                    update: {}
                  }
                }
              }
            })
          })
        })
      )

      poaps.push(...results)
    }

    // Cache results for 5 minutes
    await cache.set(
      `collection:poaps:${collectionId}`, 
      JSON.stringify(poaps),
      300
    )

    return poaps
  }

  /**
   * Get creator access details for a collection
   */
  private static async getCreatorAccess(
    collectionId: string,
    walletAddress: string
  ): Promise<CreatorAccess | null> {
    return prisma.creatorAccess.findUnique({
      where: {
        collectionId_walletAddress: {
          collectionId,
          walletAddress
        }
      }
    })
  }

  /**
   * Check if a wallet has specific access to a collection
   */
  static async checkAccess(
    collectionId: string, 
    walletAddress: string,
    requiredRole: Prisma.CreatorRole = 'CREATOR'
  ): Promise<boolean> {
    const access = await this.getCreatorAccess(collectionId, walletAddress)
    if (!access || !access.isActive) return false
    
    // ADMIN role has all permissions
    if (access.role === 'ADMIN') return true

    // Check if role meets required level
    const roles: Prisma.CreatorRole[] = ['CREATOR', 'MODERATOR', 'ADMIN']
    const requiredLevel = roles.indexOf(requiredRole)
    const actualLevel = roles.indexOf(access.role)
    
    return actualLevel >= requiredLevel
  }

  /**
   * Get collection statistics
   */
  static async getCollectionStats(collectionId: string) {
    const cacheKey = `collection:stats:${collectionId}`

    return cache.getOrSet(cacheKey, async () => {
      const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
        include: {
          events: true,
          poaps: {
            include: {
              holders: true
            }
          }
        }
      })

      if (!collection) throw new Error('Collection not found')

      // Calculate unique holders
      const uniqueHolders = new Set(
        collection.poaps.flatMap(p => 
          p.holders.map(h => h.walletAddress)
        )
      )

      // Calculate most active month
      const monthCounts = collection.events.reduce((counts, event) => {
        const month = event.startDate.toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })
        counts[month] = (counts[month] || 0) + 1
        return counts
      }, {} as Record<string, number>)

      const mostActiveMonth = Object.entries(monthCounts)
        .sort(([,a], [,b]) => b - a)
        [0]?.[0]

      return {
        totalPoaps: collection.poaps.length,
        uniqueHolders: uniqueHolders.size,
        uniqueEvents: collection.events.length,
        mostActiveMonth
      }
    }, 300) // Cache for 5 minutes
  }
}