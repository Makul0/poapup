// src/components/events/EventCard.tsx
import Image from 'next/image'
import { format } from 'date-fns' // For date formatting
import { 
  CalendarIcon,
  GlobeAltIcon,
  MapPinIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import type { Event } from '@/types/events'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  // Calculate event status based on current time and event dates
  const now = new Date()
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  
  const isOngoing = startDate <= now && endDate >= now
  const isUpcoming = startDate > now
  const isPast = endDate < now

  // Helper function to get status-specific styling
  const getStatusStyle = () => {
    if (isOngoing) return 'bg-green-100 text-green-800 border-green-200'
    if (isUpcoming) return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Calculate attendance percentage for progress bar
  const attendancePercentage = Math.min(
    (event.mintedCount / event.maxAttendees) * 100,
    100
  )

  // Format date in a readable way
  const formatEventDate = (date: Date) => {
    return format(date, 'MMM d, yyyy h:mm a')
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Event Image Section */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg bg-gray-100">
        <Image
          src={event.image}
          alt={`Cover image for ${event.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Event Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full
            text-xs font-medium border ${getStatusStyle()}
          `}>
            {isOngoing ? 'Ongoing' : isUpcoming ? 'Upcoming' : 'Past'}
          </span>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="p-6 space-y-4">
        {/* Title and Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Event Information List */}
        <div className="space-y-3">
          {/* Date and Time */}
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <div>
              <div>{formatEventDate(startDate)}</div>
              <div>to {formatEventDate(endDate)}</div>
            </div>
          </div>

          {/* Event Type */}
          <div className="flex items-center text-sm text-gray-600">
            {event.eventType === 'VIRTUAL' ? (
              <>
                <GlobeAltIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Virtual Event</span>
              </>
            ) : (
              <>
                <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>In-Person Event</span>
              </>
            )}
          </div>

          {/* Attendance Info */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Attendance</span>
              </div>
              <span className="font-medium text-gray-900">
                {event.mintedCount} / {event.maxAttendees}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${attendancePercentage}%` }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={attendancePercentage}
                aria-label={`${Math.round(attendancePercentage)}% capacity filled`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Overlay for Entire Card */}
      <div className="absolute inset-0 rounded-lg ring-1 ring-black ring-opacity-5 pointer-events-none" />
    </div>
  )
}