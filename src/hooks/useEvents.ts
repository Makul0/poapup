
  // src/hooks/useEvents.ts
  import { useState, useEffect } from 'react'
  import type { POAPEvent } from '@/types/events'
  
  export function useEvents() {
    const [events, setEvents] = useState<POAPEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
  
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await fetch('/api/events')
          if (!response.ok) {
            throw new Error('Failed to fetch events')
          }
          const data = await response.json()
          setEvents(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load events')
        } finally {
          setLoading(false)
        }
      }
  
      fetchEvents()
    }, [])
  
    return { events, loading, error }
  }