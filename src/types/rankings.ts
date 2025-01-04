// src/types/rankings.ts

// Enum Types (matching Prisma schema)
export enum EventType {
  VIRTUAL = 'VIRTUAL',
  IN_PERSON = 'IN_PERSON',
  HYBRID = 'HYBRID'
}

export enum CreatorRole {
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR',
  MODERATOR = 'MODERATOR'
}

// Base Entity Types (matching Prisma schema)
export interface Collection {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string | null
  website: string | null
  twitter: string | null
  discord: string | null
  logo: string | null
  isOfficial: boolean
  isActive: boolean
  isVerified: boolean
  totalPoaps: number
  uniqueHolders: number
  lastEventDate: Date | null
  events: Event[]
  poaps: Poap[]
}

export interface BasePoapHolder {
  id: string
  createdAt: Date
  updatedAt: Date
  walletAddress: string
  acquiredAt: Date
  transferredAt?: Date | null
  transferredTo?: string | null
  poapId: string
}

export interface BasePoap {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string | null
  image: string
  assetId: string
  mintAddress?: string | null
  attributes?: Record<string, any>
  isBurned: boolean
  isFrozen: boolean
  isCompressed: boolean
  collectionId: string
  eventId: string
}

// Now let's define our relation types
export interface PoapWithHolders extends BasePoap {
  holders: BasePoapHolder[]
}

export interface Event {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description?: string | null
  eventType: EventType
  startDate: Date
  endDate: Date
  month: string
  year: number
  location?: string | null
  maxSupply?: number | null
  mintPrice?: number | null
  mintAuthority: string
  website?: string | null
  coverImage?: string | null
  isActive: boolean
  isClosed: boolean
  collectionId: string
  poaps: PoapWithHolders[]  // Using our new type that includes holders
}

export interface Poap {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description?: string | null
  image: string
  assetId: string
  mintAddress?: string | null
  attributes?: Record<string, any>
  isBurned: boolean
  isFrozen: boolean
  isCompressed: boolean
  collectionId: string
  eventId: string
}

export interface PoapHolder {
  id: string
  createdAt: Date
  updatedAt: Date
  walletAddress: string
  acquiredAt: Date
  transferredAt?: Date | null
  transferredTo?: string | null
  poapId: string
}

// Input Types (for services)
export interface CollectionInput {
  name: string
  description?: string | null
  symbol?: string | null
  website?: string | null
  twitter?: string | null
  discord?: string | null
  logo?: string | null
  isOfficial?: boolean
  isActive?: boolean
  merkleTree?: string | null
  maxDepth?: number | null
  maxBufferSize?: number | null
  canopyDepth?: number | null
}

export interface EventInput {
  name: string
  description?: string | null
  eventType?: EventType
  startDate: Date
  endDate: Date
  location?: string | null
  maxSupply?: number | null
  mintPrice?: number | null
  mintAuthority: string
  website?: string | null
  coverImage?: string | null
  collectionId: string
}

// Filter Types (for queries)
export interface CollectionFilters {
  isOfficial?: boolean
  isActive?: boolean
  isVerified?: boolean
  search?: string
  mintAuthorities?: string[]
}

export interface EventFilters {
  eventType?: EventType
  isActive?: boolean
  isClosed?: boolean
  startDate?: Date
  endDate?: Date
  collectionId?: string
}

export interface CollectionWithRelations extends Collection {
  events: Event[]
  poaps: Poap[]
}

export interface EventWithRelations extends Omit<Event, 'poaps'> {
  collection: Collection
  poaps: PoapWithHolders[]
}

export interface PoapWithRelations extends BasePoap {
  collection: Collection
  event: Event
  holders: BasePoapHolder[]
}

// View Types (for UI components)
export interface PoapData {
  id: string
  name: string
  description: string
  image: string
  collectors: number
  mintDate: Date
}

export interface EventGroup {
  id: string
  name: string
  startDate: Date
  endDate: Date
  poaps: PoapData[]
  totalPoaps: number
  uniqueCollectors: number
}

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

// Statistics Types
export interface RankingStats {
  totalPoaps: number
  uniqueEvents: number
  mostActiveMonth: string
  topCollectors: TopCollector[]
}

export interface CollectionStats {
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

// Response Types
export interface RankingsResult {
  groups: CollectionGroup[]
}

export interface CollectionGroup {
  id: string
  name: string
  description: string
  events: Event[]
  stats: CollectionStats
}

export interface EventSeries {
  id: string
  name: string
  description: string
  totalEvents: number
  totalPoaps: number
  uniqueEvents: number
  topCollectors: TopCollector[]
}

// Analytics Types
export interface CollectionAnalytics {
  totalPoaps: number
  uniqueHolders: number
  averageMintsPerEvent: number
  mostActiveMonth: string
  recentEvents: Event[]
  topCollectors: TopCollector[]
  monthlyGrowth: number
  participationRate: number
}

// Creator Access Types
export interface CreatorAccess {
  id: string
  createdAt: Date
  updatedAt: Date
  walletAddress: string
  role: CreatorRole
  isActive: boolean
  canCreateEvents: boolean
  canMintPoaps: boolean
  canEditDetails: boolean
  canVerify: boolean
  collectionId: string
}