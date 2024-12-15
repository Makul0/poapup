// src/components/collectors/rankings/CollectionCard.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { EventsList } from './EventsList'
import { TopCollectors } from './TopCollectors'
import type { CollectionGroup } from '@/services/rankings'

interface CollectionCardProps {
  collection: CollectionGroup
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Collection Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {isExpanded ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          )}
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900">
              {collection.name}
            </h2>
            <p className="text-sm text-gray-500">
              {collection.stats.totalPoaps} POAPs • {collection.stats.uniqueEvents} Events
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Most Active: {collection.stats.mostActiveMonth}</span>
          <ChevronRightIcon className="h-4 w-4" />
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Collection Stats */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total POAPs
                  </h3>
                  <p className="mt-1 text-2xl font-semibold text-blue-600">
                    {collection.stats.totalPoaps}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Unique Events
                  </h3>
                  <p className="mt-1 text-2xl font-semibold text-purple-600">
                    {collection.stats.uniqueEvents}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Peak Month
                  </h3>
                  <p className="mt-1 text-2xl font-semibold text-green-600">
                    {collection.stats.mostActiveMonth}
                  </p>
                </div>
              </div>
            </div>

            {/* Events and Top Collectors */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Events List - Takes up 2 columns */}
                <div className="lg:col-span-2">
                  <EventsList events={collection.events} />
                </div>

                {/* Top Collectors - Takes up 1 column */}
                <div>
                  <TopCollectors 
                    collectors={collection.stats.topCollectors} 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}