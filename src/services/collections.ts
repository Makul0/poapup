// src/services/collections.ts

import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Cache } from '@/lib/cache'
import type { 
  Collection, 
  CollectionWithRelations,
  CollectionInput,
  CollectionFilters,
  CollectionAnalytics,
  Event,
  EventType,
  CreatorRole
} from '@/types/rankings'

/**
 * Cache configuration for different data types with appropriate TTLs
 */
const CACHE_PREFIX = 'collections:'
const CACHE_TTL = {
  COLLECTION: 3600,      // 1 hour for basic collection data
  LIST: 1800,           // 30 minutes for collection lists
  ANALYTICS: 7200,      // 2 hours for analytics data
  RELATIONS: 900        // 15 minutes for related data
}

export class CollectionsService {
  private static cache = new Cache(CACHE_PREFIX)

  /**
   * Creates a new collection with validated input and proper defaults
   */
  public static async create(data: CollectionInput): Promise<Collection> {
    try {
      // Create collection with all necessary fields and defaults
      const collection = await prisma.collection.create({
        data: {
          name: data.name,
          description: data.description,
          symbol: data.symbol,
          website: data.website,
          twitter: data.twitter,
          discord: data.discord,
          logo: data.logo,
          isOfficial: data.isOfficial ?? false,
          isActive: data.isActive ?? true,
          isVerified: false,
          totalPoaps: 0,
          uniqueHolders: 0,
          merkleTree: data.merkleTree,
          maxDepth: data.maxDepth,
          maxBufferSize: data.maxBufferSize,
          canopyDepth: data.canopyDepth
        },
        // Include relationships for complete data
        include: {
          events: {
            include: {
              poaps: {
                include: {
                  holders: true
                }
              }
            }
          },
          poaps: {
            include: {
              holders: true
            }
          },
          creatorAccess: true
        }
      })

      // Clear any existing caches for this collection
      await this.clearCollectionCaches(collection.id)

      return this.transformCollectionResponse(collection)
    } catch (error) {
      console.error('Error creating collection:', error)
      throw new Error('Failed to create collection')
    }
  }

  /**
   * Updates an existing collection with partial data
   */
  public static async update(
    id: string, 
    data: Partial<CollectionInput>
  ): Promise<Collection> {
    try {
      const collection = await prisma.collection.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          symbol: data.symbol,
          website: data.website,
          twitter: data.twitter,
          discord: data.discord,
          logo: data.logo,
          isOfficial: data.isOfficial,
          isActive: data.isActive,
          merkleTree: data.merkleTree,
          maxDepth: data.maxDepth,
          maxBufferSize: data.maxBufferSize,
          canopyDepth: data.canopyDepth
        },
        include: {
          events: {
            include: {
              poaps: {
                include: {
                  holders: true
                }
              }
            }
          },
          poaps: {
            include: {
              holders: true
            }
          },
          creatorAccess: true
        }
      })

      await this.clearCollectionCaches(collection.id)

      return this.transformCollectionResponse(collection)
    } catch (error) {
      console.error('Error updating collection:', error)
      throw new Error('Failed to update collection')
    }
  }

  /**
   * Retrieves a collection by ID with optional related data
   */
  public static async getById(
    id: string,
    includeRelations = false
  ): Promise<Collection | CollectionWithRelations | null> {
    try {
      const cacheKey = `collection:${id}${includeRelations ? ':relations' : ''}`
      const cached = await this.cache.get(cacheKey)
      if (cached) return cached as Collection | CollectionWithRelations

      const collection = await prisma.collection.findUnique({
        where: { id },
        include: includeRelations ? {
          events: {
            include: {
              poaps: {
                include: {
                  holders: true
                }
              }
            }
          },
          poaps: {
            include: {
              holders: true
            }
          },
          creatorAccess: true
        } : {
          events: true,
          poaps: true
        }
      })

      if (!collection) return null

      const transformed = this.transformCollectionResponse(collection)
      await this.cache.set(
        cacheKey, 
        transformed, 
        includeRelations ? CACHE_TTL.RELATIONS : CACHE_TTL.COLLECTION
      )

      return transformed
    } catch (error) {
      console.error('Error fetching collection:', error)
      throw new Error('Failed to fetch collection')
    }
  }

  /**
   * Retrieves all collections with filters and pagination
   */
  public static async getAll(
    filters?: CollectionFilters,
    page = 1,
    limit = 20
  ): Promise<{ items: Collection[]; total: number }> {
    try {
      const cacheKey = `collections:${JSON.stringify(filters)}:${page}:${limit}`
      const cached = await this.cache.get(cacheKey)
      if (cached) return cached as { items: Collection[]; total: number }

      const where: Prisma.CollectionWhereInput = {
        isOfficial: filters?.isOfficial,
        isActive: filters?.isActive,
        ...(filters?.search && {
          OR: [
            {
              name: {
                contains: filters.search,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: filters.search,
                mode: 'insensitive'
              }
            }
          ]
        })
      }

      const [items, total] = await Promise.all([
        prisma.collection.findMany({
          where,
          orderBy: { name: 'asc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            events: {
              include: {
                poaps: true
              }
            },
            poaps: true
          }
        }),
        prisma.collection.count({ where })
      ])

      const transformedItems = items.map(item => 
        this.transformCollectionResponse(item)
      )

      const result = { items: transformedItems, total }
      await this.cache.set(cacheKey, result, CACHE_TTL.LIST)

      return result
    } catch (error) {
      console.error('Error fetching collections:', error)
      throw new Error('Failed to fetch collections')
    }
  }

  /**
   * Helper method to transform Prisma response to our domain types
   */
  private static transformCollectionResponse(
    prismaCollection: any
  ): Collection {
    return {
      id: prismaCollection.id,
      createdAt: prismaCollection.createdAt,
      updatedAt: prismaCollection.updatedAt,
      name: prismaCollection.name,
      description: prismaCollection.description,
      symbol: prismaCollection.symbol,
      website: prismaCollection.website,
      twitter: prismaCollection.twitter,
      discord: prismaCollection.discord,
      logo: prismaCollection.logo,
      isOfficial: prismaCollection.isOfficial,
      isActive: prismaCollection.isActive,
      isVerified: prismaCollection.isVerified,
      totalPoaps: prismaCollection.totalPoaps,
      uniqueHolders: prismaCollection.uniqueHolders,
      lastEventDate: prismaCollection.lastEventDate,
      merkleTree: prismaCollection.merkleTree,
      maxDepth: prismaCollection.maxDepth,
      maxBufferSize: prismaCollection.maxBufferSize,
      canopyDepth: prismaCollection.canopyDepth,
      events: prismaCollection.events?.map(this.transformEventResponse) ?? [],
      poaps: prismaCollection.poaps ?? []
    }
  }

  /**
   * Helper method to transform Event responses
   */
  private static transformEventResponse(event: any): Event {
    return {
      id: event.id,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      name: event.name,
      description: event.description,
      eventType: event.eventType as EventType,
      startDate: event.startDate,
      endDate: event.endDate,
      month: event.month,
      year: event.year,
      location: event.location,
      maxSupply: event.maxSupply,
      mintPrice: event.mintPrice,
      mintAuthority: event.mintAuthority,
      website: event.website,
      coverImage: event.coverImage,
      isActive: event.isActive,
      isClosed: event.isClosed,
      collectionId: event.collectionId,
      poaps: event.poaps ?? []
    }
  }

  /**
   * Helper method to clear collection-related caches
   */
  private static async clearCollectionCaches(id: string): Promise<void> {
    const keys = [
      `collection:${id}`,
      `collection:${id}:relations`,
      `collection:${id}:analytics`,
      'collections:*'
    ]
    await Promise.all(keys.map(key => this.cache.delete(key)))
  }
}