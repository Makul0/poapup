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

/**
 * Initialize cache with rankings prefix for better organization.
 * We use a 5-minute cache to balance freshness and performance.
 */
const cache = new Cache('rankings:')

/**
 * Number of collections to load per page.
 * Kept small for better performance and faster initial page loads.
 */
const ITEMS_PER_PAGE = 20

export class RankingsService {
  /**
   * Fetches paginated and grouped rankings data.
   * This is the main method for getting collection rankings.
   * It handles caching, pagination, and data transformation.
   * 
   * @param page - The page number to fetch (1-based)
   * @returns A RankingsResult containing grouped collections with their stats
   */
  static async getGroupedRankings(page = 1): Promise<RankingsResult> {
    const cacheKey = `page:${page}`
    
    try {
      const cached = await cache.get<RankingsResult>(cacheKey)
      if (cached) return cached

      const collections = await prisma.collection.findMany({
        where: { 
          isActive: true,
          Poap: { some: {} }
        },
        include: {
          events: {
            orderBy: { startDate: 'desc' },
            include: {
              poaps: {
                include: { holders: true }
              }
            }
          },
          Poap: {
            include: { holders: true }
          }
        },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        orderBy: { totalPoaps: 'desc' }
      })

      const totalCollections = await prisma.collection.count({
        where: { 
          isActive: true,
          Poap: { some: {} }
        }
      })

      const groups = await Promise.all(
        collections.map(async (collection) => {
          const eventGroups: EventGroup[] = collection.events.map(event => {
            const poapData: PoapData[] = event.poaps.map(poap => ({
              id: poap.id,
              name: poap.name,
              description: poap.description,
              image: poap.image,
              collectors: poap.holders.length,
              mintDate: poap.createdAt
            }))

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

          const stats = await this.getCollectionStats({
            ...collection,
            poaps: collection.Poap
          })

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

      const result: RankingsResult = {
        groups,
        pagination: {
          currentPage: page,
          hasMore: page * ITEMS_PER_PAGE < totalCollections,
          totalPages: Math.ceil(totalCollections / ITEMS_PER_PAGE)
        }
      }

      await cache.set(cacheKey, result, 300)
      return result

    } catch (error) {
      console.error('Error fetching rankings:', error)
      throw new Error('Failed to fetch rankings: ' + 
        (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  /**
   * Gets detailed statistics for a collection.
   * Calculates top collectors and monthly activity patterns.
   * 
   * @param collection - The collection with its relationships
   * @returns Collection statistics including top collectors
   */
  private static async getCollectionStats(
    collection: CollectionWithRelations
  ): Promise<RankingStats> {
    try {
      if (!collection.poaps?.length) {
        return {
          totalPoaps: 0,
          uniqueEvents: collection.events?.length || 0,
          mostActiveMonth: 'No activity',
          topCollectors: []
        }
      }

      const monthlyActivity = collection.events.reduce((counts, event) => {
        const month = event.startDate.toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })
        counts[month] = (counts[month] || 0) + event.poaps.length
        return counts
      }, {} as Record<string, number>)

      const mostActiveMonth = Object.entries(monthlyActivity)
        .sort(([,a], [,b]) => b - a)
        [0]?.[0] || 'No activity'

      const collectorCounts = collection.poaps.reduce((counts, poap) => {
        poap.holders?.forEach(holder => {
          counts[holder.walletAddress] = (counts[holder.walletAddress] || 0) + 1
        })
        return counts
      }, {} as Record<string, number>)

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
      return {
        totalPoaps: 0,
        uniqueEvents: 0,
        mostActiveMonth: 'Error calculating',
        topCollectors: []
      }
    }
  }

  /**
   * Gets top collectors across all collections.
   * Provides a global leaderboard of POAP collectors.
   * 
   * @param limit - Maximum number of collectors to return
   * @returns Array of top collectors with their stats
   */
  static async getGlobalTopCollectors(limit = 100) {
    const cacheKey = `global:top-collectors:${limit}`

    return cache.getOrSet(cacheKey, async () => {
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
    }, 300)
  }

  /**
   * Gets rankings and statistics for a specific wallet address.
   * Shows all collections and POAPs a wallet has collected.
   * 
   * @param walletAddress - The wallet address to get rankings for
   * @returns Detailed collection holdings for the wallet
   */
  static async getWalletRankings(walletAddress: string) {
    const cacheKey = `wallet:${walletAddress}`

    return cache.getOrSet(cacheKey, async () => {
      const holdings = await prisma.poapHolder.findMany({
        where: { walletAddress },
        include: {
          poap: {
            include: {
              collection: true,
              event: true
            }
          }
        }
      })

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
    }, 300)
  }

  /**
   * Invalidates all rankings caches.
   * Call this when significant changes occur to collections or POAPs.
   */
  static async invalidateCache() {
    await cache.delete('*')
  }
}