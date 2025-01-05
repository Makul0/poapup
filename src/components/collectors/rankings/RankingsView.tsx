// src/components/collectors/rankings/RankingsView.tsx
'use client'

import { EventSeriesCard } from './EventSeriesCard'
import type { RankingsResult, TopCollector } from '@/types/rankings'

interface RankingsViewProps {
  initialData: RankingsResult
}

export function RankingsView({ initialData }: RankingsViewProps) {
  // Find all event groups
  const jupGroup = initialData.groups.find(g => g.name === "J.U.P Planetary Calls")
  const solanaGroup = initialData.groups.find(g => g.name === "Solana Ecosystem Calls") 
  const dvinGroup = initialData.groups.find(g => g.name === "dVIN Labs")
  const dilliGroup = initialData.groups.find(g => g.name === "Dilli Hackerhouse")
  const sillyGroup = initialData.groups.find(g => g.name === "$SILLY Dragon in Dubai")

  return (
    <div className="space-y-8">
      {/* J.U.P Planetary Calls */}
      {jupGroup && (
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
      )}

      {/* Solana Ecosystem Calls */}
      {solanaGroup && (
        <EventSeriesCard
          name={solanaGroup.name}  
          description={solanaGroup.description}
          totalPoaps={solanaGroup.stats.totalPoaps}
          uniqueEvents={solanaGroup.stats.uniqueEvents}
          collectors={solanaGroup.stats.topCollectors.map(collector => ({
            wallet: collector.wallet,
            totalPoaps: collector.count,
            rank: collector.rank,
            events: collector.events
          }))}
        />
      )}

      {/* dVIN Labs */}
      {dvinGroup && (
        <EventSeriesCard
          name={dvinGroup.name}
          description={dvinGroup.description}
          totalPoaps={dvinGroup.stats.totalPoaps}
          uniqueEvents={dvinGroup.stats.uniqueEvents}
          collectors={dvinGroup.stats.topCollectors.map(collector => ({
            wallet: collector.wallet,
            totalPoaps: collector.count,
            rank: collector.rank,
            events: collector.events
          }))}
        />
      )}

      {/* Dilli Hackerhouse */}
      {dilliGroup && (
        <EventSeriesCard
          name={dilliGroup.name}
          description={dilliGroup.description}
          totalPoaps={dilliGroup.stats.totalPoaps}
          uniqueEvents={dilliGroup.stats.uniqueEvents}
          collectors={dilliGroup.stats.topCollectors.map(collector => ({
            wallet: collector.wallet,
            totalPoaps: collector.count,
            rank: collector.rank,
            events: collector.events
          }))}
        />
      )}

      {/* $SILLY Dragon in Dubai */}
      {sillyGroup && (
        <EventSeriesCard
          name={sillyGroup.name}
          description={sillyGroup.description}
          totalPoaps={sillyGroup.stats.totalPoaps}
          uniqueEvents={sillyGroup.stats.uniqueEvents}
          collectors={sillyGroup.stats.topCollectors.map(collector => ({
            wallet: collector.wallet,
            totalPoaps: collector.count,
            rank: collector.rank,
            events: collector.events
          }))}
        />
      )}
    </div>
  )
}