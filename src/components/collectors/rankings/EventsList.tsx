// src/components/collectors/rankings/EventsList.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, ChevronRightIcon, UsersIcon } from '@heroicons/react/24/outline'
import type { EventGroup } from '@/services/rankings'

interface EventsListProps {
  events: EventGroup[]
}

export function EventsList({ events }: EventsListProps) {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Events</h3>
      
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.name} className="border border-gray-200 rounded-lg">
            {/* Month Header */}
            <button
              onClick={() => setExpandedMonth(
                expandedMonth === event.name ? null : event.name
              )}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                {expandedMonth === event.name ? (
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                )}
                <h4 className="font-medium text-gray-900">{event.name}</h4>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{event.totalPoaps} POAPs</span>
                <div className="flex items-center space-x-1">
                  <UsersIcon className="h-4 w-4" />
                  <span>{event.uniqueCollectors}</span>
                </div>
              </div>
            </button>

            {/* POAPs Grid */}
            <AnimatePresence>
              {expandedMonth === event.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {event.poaps.map(poap => (
                      <div
                        key={poap.id}
                        className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        {/* POAP Image */}
                        <img
                          src={poap.image}
                          alt={poap.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                            <h5 className="font-medium text-sm">
                              {poap.name}
                            </h5>
                            <p className="text-xs mt-1">
                              {poap.collectors} Collectors
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No events found</p>
        </div>
      )}
    </div>
  )
}