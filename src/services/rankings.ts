// src/services/rankings.ts
import { prisma } from '@/lib/prisma'
import { Cache } from '@/lib/cache'
import type { RankingsResult } from '@/types/rankings'
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

export class RankingsService {
  public static async getGroupedRankings(
    page: number,
    filters?: RankingsFilter
  ): Promise<RankingsResult> {
    try {
      // Validate page number
      const validPage = Math.max(1, page)
      const cacheKey = `page:${validPage}:${JSON.stringify(filters)}`
      
      // Try cache first
      const cached = await cache.get<RankingsResult>(cacheKey)
      if (cached) return cached

      // Build where clause more safely
      const where: any = {}
      if (filters?.collectionId) {
        where.id = filters.collectionId
      }
      if (filters?.eventId) {
        where.events = { 
          some: { id: filters.eventId } 
        }
      }

      // Fetch collections with proper error handling
      const collections = await prisma.collection.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          events: {
            select: {
              id: true,
              name: true,
              month: true,
              year: true,
              startDate: true,
              endDate: true,
              poaps: {
                select: {
                  id: true,
                  name: true,
                  holders: {
                    select: {
                      walletAddress: true,
                      acquiredAt: true
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              events: true,
              poaps: true // Changed from Poap to poaps to match schema
            }
          }
        },
        skip: (validPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE
      })

      // Transform data with null checks
      const result: RankingsResult = {
        groups: collections.map(collection => ({
          id: collection.id,
          name: collection.name,
          description: collection.description ?? '',
          events: collection.events?.map(event => ({
            name: event.name,
            month: event.month,
            year: event.year,
            poaps: event.poaps?.map(poap => ({
              holder: {
                walletAddress: poap.holders[0]?.walletAddress ?? ''
              }
            })) ?? []
          })) ?? [],
          stats: {
            totalPoaps: collection._count.poaps ?? 0,
            uniqueEvents: collection._count.events ?? 0,
            mostActiveMonth: this.getMostActiveMonth(collection.events ?? []),
            topCollectors: this.calculateCollectorStats(collection.events ?? [])
          }
        }))
      }

      // Cache the result
      await cache.set(cacheKey, result, CACHE_TIME)

      return result

    } catch (error) {
      console.error('Error fetching rankings:', error)
      throw error
    }
  }

  /**
   * Calculate the most active month from events
   */
  private static getMostActiveMonth(events: any[]): string {
    if (!events?.length) return 'No activity'

    const monthCounts = events.reduce((acc, event) => {
      const key = `${event.month} ${event.year}`
      acc[key] = (acc[key] || 0) + (event.poaps?.length || 0)
      return acc
    }, {} as Record<string, number>)

    const [mostActive] = Object.entries(monthCounts)
      .sort(([, a], [, b]) => b - a)

    return mostActive?.[0] || 'No activity'
  }

  /**
   * Calculate collector statistics from events
   */
  private static calculateCollectorStats(events: any[]) {
    const collectors = new Map<string, {
      count: number,
      events: Set<string>,
      eventDetails: Array<{ name: string; month: string; year: number }>
    }>()

    // Process events and their POAPs
    events.forEach(event => {
      if (!event.poaps) return // Skip if no POAPs

      event.poaps.forEach((poap: any) => {
        if (!poap.holders) return // Skip if no holders

        poap.holders.forEach((holder: any) => {
          const current = collectors.get(holder.walletAddress) || {
            count: 0,
            events: new Set<string>(),
            eventDetails: []
          }

          current.count++

          if (!current.events.has(event.id)) {
            current.events.add(event.id)
            current.eventDetails.push({
              name: event.name,
              month: event.month,
              year: event.year
            })
          }

          collectors.set(holder.walletAddress, current)
        })
      })
    })

    // Convert to array and sort by count
    return Array.from(collectors.entries())
      .map(([wallet, data]) => ({
        wallet,
        count: data.count,
        events: Array.from(data.eventDetails)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((collector, index) => ({
        ...collector,
        rank: index + 1
      }))
  }
}

export default RankingsService