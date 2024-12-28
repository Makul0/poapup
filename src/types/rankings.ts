// src/types/rankings.ts

// Basic data types
export interface PoapData {
  id: string
  name: string
  description: string
  image: string
  collectors: number
  mintDate: Date
}

// Event related types
export interface EventGroup {
  id: string
  name: string
  startDate: Date
  endDate: Date
  poaps: PoapData[]
  totalPoaps: number
  uniqueCollectors: number
}

// Collector related types
export interface TopCollector {
  wallet: string
  totalPoaps: number
  rank: number
  events?: Array<{
    name: string
    month: string
    year: number
  }>
}

// Statistics types
export interface RankingStats {
  totalPoaps: number
  uniqueEvents: number
  mostActiveMonth: string
  topCollectors: TopCollector[]
}

// Collection types
export interface CollectionGroup {
  id: string
  name: string
  description: string
  events: Event[]
  stats: {
    totalPoaps: number
    uniqueEvents: number
    mostActiveMonth: string
    topCollectors: Array<{
      wallet: string
      count: number
      rank: number
      events?: Array<{
        name: string
        month: string
        year: number
      }>
    }>
  }
}

// Database relation types
export interface CollectionWithRelations {
  id: string
  name: string
  description: string | null
  events: Array<{
    id: string
    name: string
    startDate: Date
    endDate: Date
    poaps: Array<{
      id: string
      name: string
      description: string | null
      image: string
      holders: Array<{
        walletAddress: string
      }>
      createdAt: Date
    }>
  }>
  Poap: Array<{
    holders: Array<{
      walletAddress: string
    }>
  }>
  totalPoaps: number
}

// API response types
export interface RankingsResult {
  groups: CollectionGroup[]
}

// Extended EventSeries type from your existing code
export interface EventSeries {
  id: string
  name: string
  description: string
  totalEvents: number
  totalPoaps: number
  uniqueEvents: number
  topCollectors: TopCollector[]
}

export interface Event {
  name: string
  month: string
  year: number
  poaps: Array<{
    holder: {
      walletAddress: string
    }
  }>
}

export interface CollectionGroup {
  id: string
  name: string
  description: string
  events: Event[]
  stats: {
    totalPoaps: number
    uniqueEvents: number
    mostActiveMonth: string
    topCollectors: Array<{
      wallet: string
      count: number
      rank: number
      events?: Array<{
        name: string
        month: string
        year: number
      }>
    }>
  }
}

export interface RankingsResult {
  groups: CollectionGroup[]
}