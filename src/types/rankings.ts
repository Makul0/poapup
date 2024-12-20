import type { Event, Collection, Poap, PoapHolder } from '@prisma/client'

export interface RankingsResult {
  groups: CollectionGroup[];
  pagination: {
    currentPage: number;
    hasMore: boolean;
    totalPages: number;
  };
}

export interface CollectionGroup {
  id: string;
  name: string;
  description?: string | null;
  mintAuthority?: string;
  events: EventGroup[];
  stats: RankingStats;
}

export interface EventGroup {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  poaps: PoapData[];
  totalPoaps: number;
  uniqueCollectors: number;
}

export interface PoapData {
  id: string;
  name: string;
  description?: string | null;
  image: string;
  collectors: number;
  mintDate: Date;
}

export interface RankingStats {
  totalPoaps: number;
  uniqueEvents: number;
  mostActiveMonth: string;
  topCollectors: {
    wallet: string;
    count: number;
    rank: number;
  }[];
}

export type CollectionWithRelations = Collection & {
  events: (Event & {
    poaps: (Poap & {
      holders: PoapHolder[];
    })[];
  })[];
  Poap: (Poap & {
    holders: PoapHolder[];
  })[];
};