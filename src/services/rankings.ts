// src/services/rankings.ts
import { prisma } from '@/lib/prisma'
import { Cache } from '@/lib/cache'
import type { Prisma } from '@prisma/client'
import type { 
  RankingStats, 
  CollectionGroup,
  EventGroup,
  PoapData,
  RankingsResult,
  CollectionWithRelations 
} from '@/types/rankings'

// Initialize cache with rankings prefix for better organization
const cache = new Cache('rankings:')

// Number of items to load per page - kept small for better performance
const ITEMS_PER_PAGE = 20

export class RankingsService {
  /**
   * Fetches paginated and grouped rankings data
   * This is the main method for getting collection rankings
   * 
   * @param page - The page number to fetch (1-based)
   * @returns A RankingsResult containing grouped collections with their stats
   */
  static async getGroupedRankings(page = 1): Promise<RankingsResult> {
    const cacheKey = `page:${page}`
    
    try {
      // Try to get from cache first for better performance
      const cached = await cache.get<RankingsResult>(cacheKey)
      if (cached) return cached

      // Fetch active collections with their relationships
      // We use Prisma's powerful include system to get all needed data in one query
      const collections = await prisma.collection.findMany({
        where: { 
          isActive: true,
          // Only get collections that have POAPs
          poaps: {
            some: {}
          }
        },
        include: {
          events: {
            orderBy: {
              startDate: 'desc'
            },
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
          }
        },
        // Handle pagination
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        // Order collections by total POAPs for relevance
        orderBy: {
          totalPoaps: 'desc'
        }
      })

      // Get total count for pagination
      const totalCollections = await prisma.collection.count({
        where: { 
          isActive: true,
          poaps: { some: {} }
        }
      })

      // Transform collections into our group structure
      const groups = await Promise.all(
        collections.map(async (collection) => {
          // Transform events into our EventGroup structure
          const eventGroups: EventGroup[] = collection.events.map(event => {
            // Transform POAPs into our PoapData structure
            const poapData: PoapData[] = event.poaps.map(poap => ({
              id: poap.id,
              name: poap.name,
              description: poap.description,
              image: poap.image,
              collectors: poap.holders.length,
              mintDate: poap.createdAt
            }))

            // Calculate unique collectors for this event
            const uniqueCollectors = new Set(
              event.poaps.flatMap(p => p.holders.map(h => h.walletAddress))
            ).size

            return {
              id: event.id,
              name: event.name,
              startDate: event.startDate,
              endDate: event.endDate,
              poaps: poapData,
              totalPoaps: event.poaps.length,
              uniqueCollectors
            }
          })

          // Calculate collection statistics
          const stats = await this.getCollectionStats(collection)

          // Return the complete collection group
          return {
            id: collection.id,
            name: collection.name,
            description: collection.description,
            mintAuthority: collection.mintAuthority,
            events: eventGroups,
            stats
          }
        })
      )

      // Create the final result with pagination info
      const result: RankingsResult = {
        groups,
        pagination: {
          currentPage: page,
          hasMore: page * ITEMS_PER_PAGE < totalCollections,
          totalPages: Math.ceil(totalCollections / ITEMS_PER_PAGE)
        }
      }

      // Cache the result for 5 minutes
      // We use a relatively short cache time since rankings can change frequently
      await cache.set(cacheKey, result, 300)

      return result

    } catch (error) {
      console.error('Error fetching rankings:', error)
      throw new Error('Failed to fetch rankings')
    }
  }

  /**
   * Gets detailed statistics for a collection
   * This includes calculating top collectors and monthly activity
   * 
   * @param collection - The collection with its relationships
   * @returns Collection statistics including top collectors
   */
  private static async getCollectionStats(
    collection: CollectionWithRelations
  ): Promise<RankingStats> {
    try {
      // Calculate monthly activity by grouping POAPs by month
      const monthlyActivity = collection.events.reduce((counts, event) => {
        const month = event.startDate.toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })
        counts[month] = (counts[month] || 0) + event.poaps.length
        return counts
      }, {} as Record<string, number>)

      // Find the month with the most activity
      const mostActiveMonth = Object.entries(monthlyActivity)
        .sort(([,a], [,b]) => b - a)
        [0]?.[0] || 'No activity'

      // Calculate collector rankings
      // First, count POAPs per collector
      const collectorCounts = collection.poaps.reduce((counts, poap) => {
        poap.holders.forEach(holder => {
          counts[holder.walletAddress] = (counts[holder.walletAddress] || 0) + 1
        })
        return counts
      }, {} as Record<string, number>)

      // Then sort collectors and take top 10
      const topCollectors = Object.entries(collectorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([wallet, count], index) => ({
          wallet,
          count,
          rank: index + 1
        }))

      return {
        totalPoaps: collection.poaps.length,
        uniqueEvents: collection.events.length,
        mostActiveMonth,
        topCollectors
      }
    } catch (error) {
      console.error('Error calculating collection stats:', error)
      throw new Error('Failed to calculate collection statistics')
    }
  }

  /**
   * Gets top collectors across all collections
   * This provides a global leaderboard of POAP collectors
   * 
   * @param limit - Maximum number of collectors to return
   * @returns Array of top collectors with their stats
   */
  static async getGlobalTopCollectors(limit = 100) {
    const cacheKey = `global:top-collectors:${limit}`

    return cache.getOrSet(cacheKey, async () => {
      // Use Prisma's groupBy to efficiently count POAPs per wallet
      const holders = await prisma.poapHolder.groupBy({
        by: ['walletAddress'],
        _count: {
          poapId: true
        },
        orderBy: {
          _count: {
            poapId: 'desc'
          }
        },
        take: limit
      })

      return holders.map((holder, index) => ({
        rank: index + 1,
        wallet: holder.walletAddress,
        count: holder._count.poapId
      }))
    }, 300) // Cache for 5 minutes
  }

  /**
   * Gets rankings and statistics for a specific wallet address
   * This shows all collections and POAPs a wallet has collected
   * 
   * @param walletAddress - The wallet address to get rankings for
   * @returns Detailed collection holdings for the wallet
   */
  static async getWalletRankings(walletAddress: string) {
    const cacheKey = `wallet:${walletAddress}`

    return cache.getOrSet(cacheKey, async () => {
      // Get all POAPs held by this wallet
      const holdings = await prisma.poapHolder.findMany({
        where: {
          walletAddress
        },
        include: {
          poap: {
            include: {
              collection: true,
              event: true
            }
          }
        }
      })

      // Group POAPs by collection
      const collectionHoldings = holdings.reduce((groups, holding) => {
        const collectionId = holding.poap.collectionId
        if (!groups[collectionId]) {
          groups[collectionId] = {
            collection: holding.poap.collection,
            poaps: []
          }
        }
        groups[collectionId].poaps.push(holding.poap)
        return groups
      }, {} as Record<string, { 
        collection: Prisma.CollectionGetPayload<{}>,
        poaps: Array<Prisma.PoapGetPayload<{ include: { event: true } }>>
      }>)

      // Calculate statistics for each collection
      return Object.values(collectionHoldings).map(({ collection, poaps }) => ({
        collectionId: collection.id,
        collectionName: collection.name,
        totalPoaps: poaps.length,
        firstPoapDate: new Date(Math.min(...poaps.map(p => p.createdAt.getTime()))),
        latestPoapDate: new Date(Math.max(...poaps.map(p => p.createdAt.getTime()))),
        uniqueEvents: new Set(poaps.map(p => p.eventId)).size,
        poaps: poaps.map(poap => ({
          id: poap.id,
          name: poap.name,
          image: poap.image,
          eventName: poap.event.name,
          mintDate: poap.createdAt
        }))
      }))
    }, 300) // Cache for 5 minutes
  }

  /**
   * Invalidates all rankings caches
   * Call this when significant changes occur to collections or POAPs
   */
  static async invalidateCache() {
    await cache.delete('*')
  }
}