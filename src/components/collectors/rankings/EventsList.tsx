// src/components/collectors/rankings/EventsList.tsx
'use client'
import { motion } from 'framer-motion'

interface Event {
  name: string
  month: string
  year: number
  participantCount: number
}

interface EventsListProps {
  events: Event[]
  isCompact?: boolean
}

export function EventsList({ events, isCompact = false }: EventsListProps) {
  const formatEventDate = (month: string, year: number) => {
    return `${month} ${year}`
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={`${event.name}-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            flex justify-between items-center 
            ${isCompact ? 'py-2' : 'p-4'} 
            bg-white rounded-lg shadow-sm
            hover:shadow-md transition-shadow duration-200
          `}
        >
          <div>
            <h3 className={`${isCompact ? 'text-sm' : 'text-base'} font-medium text-gray-900`}>
              {event.name || 'Unnamed Event'}
            </h3>
            <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-500`}>
              {formatEventDate(event.month, event.year)}
            </p>
          </div>
          <div className="text-right">
            <p className={`${isCompact ? 'text-sm' : 'text-base'} font-medium text-gray-900`}>
              {event.participantCount.toLocaleString()}
            </p>
            <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-500`}>
              participants
            </p>
          </div>
        </motion.div>
      ))}

      {events.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No events to display</p>
        </div>
      )}
    </div>
  )
}