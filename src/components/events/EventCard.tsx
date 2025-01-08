// src/components/events/EventCard.tsx
import Image from 'next/image'
import { POAPEvent } from '@/types/events'
import { formatDate } from '@/utils/date'
import { 
  CalendarIcon, 
  GlobeAltIcon, // Changed from GlobeIcon
  MapPinIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline'

interface EventCardProps {
  event: POAPEvent
}

export function EventCard({ event }: EventCardProps) {
  const now = new Date()
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  
  const isOngoing = startDate <= now && endDate >= now
  const isUpcoming = startDate > now
  const isPast = endDate < now

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 group">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${isOngoing ? 'bg-green-100 text-green-800' : ''}
            ${isUpcoming ? 'bg-blue-100 text-blue-800' : ''}
            ${isPast ? 'bg-gray-100 text-gray-800' : ''}
          `}>
            {isOngoing ? 'Ongoing' : isUpcoming ? 'Upcoming' : 'Past'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <UsersIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <div className="flex items-center space-x-2 w-full">
              <span>{event.mintedCount} / {event.maxAttendees} claimed</span>
              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ 
                    width: `${Math.min((event.mintedCount / event.maxAttendees) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            {event.eventType === 'VIRTUAL' ? (
              <>
                <GlobeAltIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Virtual Event</span>
              </>
            ) : (
              <>
                <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>In Person Event</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}