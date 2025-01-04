// src/components/collectors/rankings/StatsCard.tsx
'use client'

import { useEffect, useRef } from 'react'
import type { IconType } from 'react-icons'
import { motion, useAnimation, useInView } from 'framer-motion'

// Define the prop types for our component
interface StatsCardProps {
  title: string
  value: string | number
  icon: IconType
  color: 'blue' | 'purple' | 'green' | 'yellow'
  change?: {
    value: number
    trend: 'up' | 'down' | 'neutral'
  }
  animationDelay?: number
}

// Define our color schemes using a const assertion for better type safety
const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    icon: 'text-blue-500',
    hover: 'hover:bg-blue-100',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    icon: 'text-purple-500',
    hover: 'hover:bg-purple-100',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    icon: 'text-green-500',
    hover: 'hover:bg-green-100',
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    icon: 'text-yellow-500',
    hover: 'hover:bg-yellow-100',
  },
} as const

// Animation variants for the card
const cardAnimationVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

// Helper function to format trend indicators
const getTrendIndicator = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return '↑'
    case 'down':
      return '↓'
    case 'neutral':
      return '→'
    default:
      return ''
  }
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change,
  animationDelay = 0 
}: StatsCardProps) {
  // Set up animation controls and intersection observer
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  // Get color classes for the current color scheme
  const colors = colorClasses[color]

  // Handle animation when card comes into view
  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  // Format the display value
  const displayValue = typeof value === 'number' 
    ? value.toLocaleString()
    : value

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={cardAnimationVariants}
      transition={{ delay: animationDelay }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={`
        ${colors.bg} 
        ${colors.hover}
        rounded-lg 
        p-6 
        transition-all 
        duration-200
        hover:shadow-lg
      `}
      role="region"
      aria-label={`${title} statistics`}
    >
      <div className="flex items-center">
        {/* Icon Container */}
        <div 
          className={`
            ${colors.icon} 
            p-2 
            rounded-lg 
            bg-white/50
            backdrop-blur-sm
          `}
          aria-hidden="true"
        >
          <Icon className="h-6 w-6" />
        </div>

        {/* Content Container */}
        <div className="ml-4 flex-1">
          {/* Title */}
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>

          {/* Value and Change Indicator */}
          <div className="mt-1 flex items-baseline">
            <p className={`text-2xl font-semibold ${colors.text}`}>
              {displayValue}
            </p>

            {/* Conditional Change Indicator */}
            {change && (
              <p 
                className={`
                  ml-2 
                  flex 
                  items-baseline 
                  text-sm 
                  font-semibold
                  ${change.trend === 'up' ? 'text-green-600' : ''}
                  ${change.trend === 'down' ? 'text-red-600' : ''}
                  ${change.trend === 'neutral' ? 'text-gray-500' : ''}
                `}
                aria-label={`${change.value}% ${change.trend}`}
              >
                <span className="sr-only">
                  {change.trend === 'up' ? 'Increased by' : ''}
                  {change.trend === 'down' ? 'Decreased by' : ''}
                  {change.trend === 'neutral' ? 'Remained at' : ''}
                </span>
                {getTrendIndicator(change.trend)}
                {change.value}%
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Add display name for debugging
StatsCard.displayName = 'StatsCard'