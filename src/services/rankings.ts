import { prisma } from '@/lib/prisma'
import { Cache } from '@/lib/cache'
import type { 
  RankingStats, 
  CollectionGroup,
  EventGroup,
  PoapData,
  RankingsResult,
  CollectionWithRelations 
} from '@/types/rankings'
import { z } from 'zod'

// Cache configuration
const cache = new Cache('rankings:')
const ITEMS_PER_PAGE = 20
const CACHE_TIME = 300 // 5 minutes

// Input validation schema
const RankingsFilterSchema = z.object({
  collectionId: z.string().optional(),
  eventId: z.string().optional()
})

type RankingsFilter = z.infer<typeof RankingsFilterSchema>

export interface CollectionGroup {
  id: string
  name: string
  description: string
  events: Array<{
    name: string
    date: string
    participantCount: number
  }>
  stats: {
    totalPoaps: number
    uniqueEvents: number
    mostActiveMonth: string
    topCollectors: Array<{
      wallet: string
      count: number
      rank: number
    }>
  }
}

interface RankingsResult {
  groups: CollectionGroup[]
}

export class RankingsService {
  /**
   * Fetches paginated and grouped rankings data with optional filtering.
   */
  public static async getGroupedRankings(
    page: number,
    filters?: {
      collectionId?: string
      eventId?: string
    }
  ): Promise<RankingsResult> {
    const cacheKey = `page:${page}:${JSON.stringify(filters)}`
    
    try {
      const cached = await cache.get<RankingsResult>(cacheKey)
      if (cached) return cached
  
      // Fetch data from your database
      const groups = await prisma.collection.findMany({
        where: {
          id: filters?.collectionId,
          events: {
            some: filters?.eventId ? { id: filters.eventId } : undefined
          }
        },
        select: {
          id: true,
          name: true,
          description: true,
          events: {
            select: {
              name: true,
              month: true,
              year: true,
              poaps: {
                select: {
                  holders: {
                    select: {
                      walletAddress: true
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              poaps: true,
              events: true
            }
          }
        }
      })

      return {
        groups: groups.map(group => ({
          id: group.id,
          name: group.name,
          description: group.description,
          events: group.events.map(event => ({
            name: event.name,
            month: event.month,
            year: event.year,
            poaps: event.poaps.map(poap => ({
              holder: {
                walletAddress: poap.holders[0]?.walletAddress || ''
              }
            }))
          })),
          stats: {
            totalPoaps: group._count.poaps,
            uniqueEvents: group._count.events,
            mostActiveMonth: this.getMostActiveMonth(group.events),
            topCollectors: this.getTopCollectors(group)
          }
        }))
      }

    } catch (error) {
      console.error('Error fetching rankings:', error)
      throw new Error('Failed to fetch rankings: ' + 
        (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  /**
   * Transforms a database event into an EventGroup structure
   */
  private static transformEventToGroup(event: any): EventGroup {
    const poapData = event.poaps.map((poap: any): PoapData => ({
      id: poap.id,
      name: poap.name,
      description: poap.description,
      image: poap.image,
      collectors: poap.holders.length,
      mintDate: poap.createdAt
    }))

    return {
      id: event.id,
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      poaps: poapData,
      totalPoaps: event.poaps.length,
      uniqueCollectors: new Set(
        event.poaps.flatMap((p: any) => 
          p.holders.map((h: any) => h.walletAddress)
        )
      ).size
    }
  }

  /**
   * Calculates detailed statistics for a collection
   */
  private static async getCollectionStats(
    collection: CollectionWithRelations
  ): Promise<RankingStats> {
    try {
      if (!collection.Poap?.length) {
        return {
          totalPoaps: 0,
          uniqueEvents: collection.events?.length || 0,
          mostActiveMonth: 'No activity',
          topCollectors: []
        }
      }

      // Calculate monthly activity
      const monthlyActivity = collection.events.reduce((counts, event) => {
        const month = event.startDate.toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })
        counts[month] = (counts[month] || 0) + event.poaps.length
        return counts
      }, {} as Record<string, number>)

      // Get most active month
      const mostActiveMonth = Object.entries(monthlyActivity)
        .sort(([,a], [,b]) => b - a)
        [0]?.[0] || 'No activity'

      // Calculate collector rankings
      const collectorCounts = collection.Poap.reduce((counts, poap) => {
        poap.holders?.forEach(holder => {
          counts[holder.walletAddress] = (counts[holder.walletAddress] || 0) + 1
        })
        return counts
      }, {} as Record<string, number>)

      // Get top collectors
      const topCollectors = Object.entries(collectorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([wallet, count], index) => ({
          wallet,
          count,
          rank: index + 1
        }))

      return {
        totalPoaps: collection.Poap.length,
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
   * Invalidates all rankings caches
   */
  public static async invalidateCache(): Promise<void> {
    await cache.delete('*')
  }

  private static getMostActiveMonth(events: any[]): string {
    if (!events.length) return 'No activity'
    const monthCounts = events.reduce((acc, event) => {
      const key = `${event.month} ${event.year}`
      acc[key] = (acc[key] || 0) + event.poaps.length
      return acc
    }, {})
    const [mostActive] = Object.entries(monthCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
    return mostActive?.[0] || 'No activity'
  }

  private static getTopCollectors(group: any): Array<{
    wallet: string;
    count: number;
    rank: number;
    events?: Array<{ name: string; month: string; year: number }>;
  }> {
    const collectors = group.events.reduce((acc: Record<string, any>, event: any) => {
      event.poaps.forEach((poap: any) => {
        poap.holders.forEach((holder: any) => {
          if (!acc[holder.walletAddress]) {
            acc[holder.walletAddress] = {
              count: 0,
              events: []
            }
          }
          acc[holder.walletAddress].count++
          if (!acc[holder.walletAddress].events.find((e: any) => e.name === event.name)) {
            acc[holder.walletAddress].events.push({
              name: event.name,
              month: event.month,
              year: event.year
            })
          }
        })
      })
      return acc
    }, {})

    return Object.entries(collectors)
      .sort(([, a], [, b]) => (b as any).count - (a as any).count)
      .slice(0, 10)
      .map(([wallet, data], index) => ({
        wallet,
        count: data.count,
        rank: index + 1,
        events: data.events
      }))
  }
}

export default RankingsService