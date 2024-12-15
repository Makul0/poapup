'use client'

import { motion } from 'framer-motion'
import { TrophyIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { truncateAddress } from '@/utils/address'

interface Collector {
  wallet: string
  count: number
}

interface TopCollectorsProps {
  collectors: Collector[]
}

export function TopCollectors({ collectors }: TopCollectorsProps) {
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 0: return 'text-yellow-500' // Gold
      case 1: return 'text-gray-400'   // Silver
      case 2: return 'text-amber-600'  // Bronze
      default: return 'text-gray-400'
    }
  }

  // Get the appropriate medal emoji based on rank
  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return ''
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <TrophyIcon className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">Top Collectors</h3>
        </div>
      </div>

      {/* Collectors List */}
      <div className="divide-y divide-gray-200">
        {collectors.map((collector, index) => (
          <motion.div
            key={collector.wallet}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              {/* Rank and Wallet */}
              <div className="flex items-center space-x-3">
                <span className={`font-bold ${getMedalColor(index)}`}>
                  {getMedalEmoji(index)}
                </span>
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {truncateAddress(collector.wallet)}
                  </span>
                </div>
              </div>

              {/* POAP Count */}
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {collector.count} POAPs
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {collectors.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500">
          <p>No collectors found</p>
        </div>
      )}
    </div>
  )
}