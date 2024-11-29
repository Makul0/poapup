'use client'

import { useEffect, useState } from 'react'
import { CollectorRanking } from '@/services/rankings'
import { RankingsTable } from '@/components/collectors/rankings/rankings-table'
import { useToast } from '@/hooks/useToast'

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading rankings...</p>
    </div>
  )
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<CollectorRanking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchRankings() {
      try {
        const response = await fetch('/api/rankings')
        if (!response.ok) {
          throw new Error('Failed to fetch rankings')
        }
        const data = await response.json()
        setRankings(data)
      } catch (error) {
        console.error('Error fetching rankings:', error)
        showToast({
          title: 'Error',
          description: 'Failed to load rankings. Please try again later.',
          type: 'error'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRankings()
  }, [showToast])

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">POAP Collector Rankings</h1>
      {rankings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No rankings available yet.</p>
        </div>
      ) : (
        <RankingsTable rankings={rankings} />
      )}
    </div>
  )
}