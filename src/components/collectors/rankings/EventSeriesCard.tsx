// src/components/collectors/rankings/EventSeriesCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { truncateAddress } from '@/utils/address'
import type { TopCollector } from '@/types/rankings'

interface Props {
  name: string
  description: string
  totalPoaps: number
  uniqueEvents: number
  collectors: TopCollector[]
}

export function EventSeriesCard({
  name,
  description,
  totalPoaps,
  uniqueEvents,
  collectors,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{name}</h2>
            <p className="mt-1 text-gray-600">{description}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">Total Events</span>
            <p className="text-3xl font-bold text-gray-900">{uniqueEvents}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Stat label="Total POAPs" value={totalPoaps} />
          <Stat label="Unique Events" value={uniqueEvents} />
          <Stat label="Total Collectors" value={collectors.length} />
        </div>
      </div>

      <motion.div
        animate={{ height: isExpanded ? "auto" : 0 }}
        initial={false}
        className="overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Top Collectors by Event Attendance
          </h3>
          <div className="space-y-3">
            {collectors.map((collector) => (
              <div
                key={collector.wallet}
                className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-700">
                      #{collector.rank}
                    </span>
                    <Link
                      href={`https://solana.fm/address/${collector.wallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {truncateAddress(collector.wallet)}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">
                      {collector.totalPoaps}
                    </span>
                    <span className="text-gray-500">events</span>
                  </div>
                </div>
                {collector.events && (
                  <div className="mt-2 ml-10 text-sm text-gray-500">
                    {collector.events.map((event) => (
                      <div key={event.name}>
                        {event.month} {event.year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
      >
        {isExpanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
