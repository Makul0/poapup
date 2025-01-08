// src/app/events/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { EventsGrid } from './EventsGrid'
import { EventTabs } from './EventTabs'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Define the event type to match our API response
interface Event {
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
}

// Define the API response type
interface EventsResponse {
  events: Event[]
  pagination: {
    total: number
    pages: number
    currentPage: number
    limit: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export default function EventsPage() {
  // State management with proper typing
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventData, setEventData] = useState<EventsResponse | null>(null)
  const [activeTab, setActiveTab] = useState<'ongoing' | 'upcoming' | 'past'>('ongoing')

  // Fetch events from our API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/events')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data: EventsResponse = await response.json()
        setEventData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Filter events based on their date status
  const filterEvents = (events: Event[]) => {
    const now = new Date()
    
    switch(activeTab) {
      case 'ongoing':
        return events.filter(event => 
          new Date(event.startDate) <= now && 
          new Date(event.endDate) >= now
        )
      case 'upcoming':
        return events.filter(event => 
          new Date(event.startDate) > now
        )
      case 'past':
        return events.filter(event => 
          new Date(event.endDate) < now
        )
      default:
        return events
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Events</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  // Show empty state
  if (!eventData?.events.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Events Found</h2>
        <p className="text-gray-600">Check back later for new events.</p>
      </div>
    )
  }

  // Filter the events for display
  const filteredEvents = filterEvents(eventData.events)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">POAP Events</h1>
      
      <EventTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          ongoing: filterEvents(eventData.events).filter(e => {
            const now = new Date()
            return new Date(e.startDate) <= now && new Date(e.endDate) >= now
          }).length,
          upcoming: eventData.events.filter(e => new Date(e.startDate) > new Date()).length,
          past: eventData.events.filter(e => new Date(e.endDate) < new Date()).length
        }}
      />
      
      <EventsGrid events={filteredEvents} />
    </div>
  )
}