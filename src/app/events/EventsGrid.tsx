// src/components/events/EventsGrid.tsx
import { Event } from '@/types/events'
import { EventCard } from './EventCard'

interface EventsGridProps {
  events: Event[]
}

export function EventsGrid({ events }: EventsGridProps) {
  // Show a message if no events are found in the current filter
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">
          No events found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          There are no events matching your current filter.
          Try switching to a different tab or check back later.
        </p>
      </div>
    )
  }

  // Render the grid of event cards
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map(event => (
        <EventCard 
          key={event.id} 
          event={event}
          // We pass the full event object to the card component
          // which can then extract what it needs
        />
      ))}
    </div>
  )
}

// You'll also want to have this type definition in your types folder:
// src/types/events.ts
export interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  eventType: 'VIRTUAL' | 'IRL'
  mintedCount: number
  maxAttendees: number
  isPublic: boolean
  creator: string
  merkleTree: string
  image: string
  // Add any other fields your events have
}