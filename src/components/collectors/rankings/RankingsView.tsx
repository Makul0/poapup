// src/components/collectors/rankings/RankingsView.tsx
'use client'

import { EventSeriesCard } from './EventSeriesCard'
import type { RankingsResult, TopCollector } from '@/types/rankings'

interface RankingsViewProps {
  initialData: RankingsResult
}

export function RankingsView({ initialData }: RankingsViewProps) {
  const jupGroup = initialData.groups.find(g => g.name === "J.U.P Planetary Calls")
  
  if (!jupGroup) return null

  return (
    <div className="space-y-8">
      <EventSeriesCard
        name={jupGroup.name}
        description={jupGroup.description}
        totalPoaps={jupGroup.stats.totalPoaps}
        uniqueEvents={jupGroup.stats.uniqueEvents}
        collectors={jupGroup.stats.topCollectors.map(collector => ({
          wallet: collector.wallet,
          totalPoaps: collector.count,
          rank: collector.rank,
          events: collector.events
        }))}
      />
    </div>
  )
}