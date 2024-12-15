// src/components/collectors/rankings/StatsCard.tsx
'use client'

import type { IconType } from 'react-icons'
import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: string | number
  icon: IconType
  color: 'blue' | 'purple' | 'green' | 'yellow'
  change?: {
    value: number
    trend: 'up' | 'down' | 'neutral'
  }
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    icon: 'text-blue-500',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    icon: 'text-purple-500',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    icon: 'text-green-500',
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    icon: 'text-yellow-500',
  },
} as const

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change 
}: StatsCardProps) {
  const colors = colorClasses[color]

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${colors.bg} rounded-lg p-6 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center">
        <div className={`${colors.icon} p-2 rounded-lg`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-1 flex items-baseline">
            <p className={`text-2xl font-semibold ${colors.text}`}>
              {value}
            </p>
            {change && (
              <p className={`ml-2 flex items-baseline text-sm font-semibold
                ${change.trend === 'up' ? 'text-green-600' : ''}
                ${change.trend === 'down' ? 'text-red-600' : ''}
                ${change.trend === 'neutral' ? 'text-gray-500' : ''}
              `}>
                {change.trend === 'up' && '↑'}
                {change.trend === 'down' && '↓'}
                {change.value}%
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}