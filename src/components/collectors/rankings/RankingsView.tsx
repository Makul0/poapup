// src/components/collectors/rankings/RankingsView.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { EventSeriesCard } from './EventSeriesCard'

interface WalletStats {
  wallet: string
  events: {
    name: string
    month: string
    year: number
  }[]
  totalPoaps: number
}

interface RankingsViewProps {
  initialData: {
    groups: Array<{
      id: string
      name: string
      description: string
      events: Array<{
        name: string
        month: string
        year: number
        poaps: Array<{
          holder: {
            walletAddress: string
          }
        }>
      }>
      stats: {
        totalPoaps: number
        uniqueEvents: number
      }
    }>
  }
}

export function RankingsView({ initialData }: RankingsViewProps) {
  const jupGroup = initialData.groups.find(g => g.name === "J.U.P Planetary Calls")
  
  if (!jupGroup) return null

  // Aggregate POAPs per wallet
  const walletStats = jupGroup.events.reduce((acc: WalletStats[], event) => {
    event.poaps.forEach(poap => {
      const wallet = poap.holder.walletAddress
      let stats = acc.find(s => s.wallet === wallet)
      
      if (!stats) {
        stats = {
          wallet,
          events: [],
          totalPoaps: 0
        }
        acc.push(stats)
      }

      // Add event if not already tracked for this wallet
      if (!stats.events.find(e => e.name === event.name)) {
        stats.events.push({
          name: event.name,
          month: event.month,
          year: event.year
        })
        stats.totalPoaps++
      }
    })
    return acc
  }, [])

  // Sort by number of events attended
  const sortedStats = walletStats
    .sort((a, b) => b.totalPoaps - a.totalPoaps)
    .map((stats, index) => ({
      wallet: stats.wallet,
      rank: index + 1,
      totalPoaps: stats.totalPoaps,
      events: stats.events
    }))

  return (
    <EventSeriesCard
      name={jupGroup.name}
      description={jupGroup.description}
      totalPoaps={jupGroup.stats.totalPoaps}
      uniqueEvents={jupGroup.stats.uniqueEvents}
      collectors={sortedStats}
    />
  )
}