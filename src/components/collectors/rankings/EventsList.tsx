// src/components/collectors/rankings/EventsList.tsx
'use client'
import { format, parseISO } from 'date-fns'
import { motion } from 'framer-motion'

interface Event {
  name: string
  date: string // This should be an ISO date string
  participantCount: number
}

interface EventsListProps {
  events: Event[]
  isCompact?: boolean
}

export function EventsList({ events, isCompact = false }: EventsListProps) {
  // Helper function to safely format dates
  const formatEventDate = (dateString: string | undefined) => {
    if (!dateString) {
      return 'Date unavailable'
    }

    try {
      // Attempt to parse and format the date
      const date = parseISO(dateString)
      return format(date, 'PPP')
    } catch (error) {
      console.error('Error formatting date:', dateString, error)
      return 'Invalid date'
    }
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={`${event.name}-${index}`} // Added index to ensure unique keys
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            flex justify-between items-center 
            ${isCompact ? 'py-2' : 'p-4'} 
            bg-white rounded-lg shadow-sm
          `}
        >
          <div>
            <h3 className={`${isCompact ? 'text-sm' : 'text-base'} font-medium text-gray-900`}>
              {event.name || 'Unnamed Event'}
            </h3>
            <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-500`}>
              {formatEventDate(event.date)}
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

      {/* Show empty state if no events */}
      {events.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No events to display</p>
        </div>
      )}
    </div>
  )
}