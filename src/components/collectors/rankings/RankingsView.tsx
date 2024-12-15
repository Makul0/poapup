// src/components/collectors/rankings/RankingsView.tsx
'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { CollectionCard } from './CollectionCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { RankingsResult } from '@/services/rankings'
import { useToast } from '@/hooks/useToast'

interface RankingsViewProps {
  initialData: RankingsResult
}

export function RankingsView({ initialData }: RankingsViewProps) {
  // State management
  const [rankings, setRankings] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const { showToast } = useToast()

  // Infinite scroll setup
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  })

  // Load more data when scrolling
  useEffect(() => {
    if (inView && !isLoading && rankings.pagination.hasMore) {
      loadMoreRankings()
    }
  }, [inView])

  // Function to load more rankings
  const loadMoreRankings = async () => {
    try {
      setIsLoading(true)
      const nextPage = page + 1
      
      const response = await fetch(`/api/rankings?page=${nextPage}`)
      if (!response.ok) throw new Error('Failed to load more rankings')
      
      const data: RankingsResult = await response.json()

      setRankings(prev => ({
        groups: [...prev.groups, ...data.groups],
        pagination: data.pagination
      }))
      setPage(nextPage)

    } catch (error) {
      console.error('Error loading rankings:', error)
      showToast({
        title: 'Error',
        description: 'Failed to load more rankings',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">POAP Rankings</h1>
        <p className="mt-2 text-lg text-gray-600">
          Discover the most active collectors and recent events across all POAP collections
        </p>
      </header>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {rankings.groups.map((collection, index) => (
            <motion.div
              key={collection.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.1 
              }}
            >
              <CollectionCard collection={collection} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Infinite scroll trigger */}
        <div ref={ref} className="py-8 flex justify-center">
          {isLoading && <LoadingSpinner />}
        </div>

        {/* No more results indicator */}
        {!isLoading && !rankings.pagination.hasMore && rankings.groups.length > 0 && (
          <p className="text-center text-gray-500 py-8">
            No more collections to load
          </p>
        )}

        {/* Empty state */}
        {rankings.groups.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">
              No Collections Found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              There are no POAP collections to display at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}