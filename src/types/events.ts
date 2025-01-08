// src/types/events.ts
export interface POAPEvent {
    id: string
    title: string
    description: string
    image: string
    startDate: string
    endDate: string
    eventType: 'VIRTUAL' | 'IRL'
    maxAttendees: number
    mintedCount: number
    isPublic: boolean
    creator: string
    merkleTree: string
  }
  