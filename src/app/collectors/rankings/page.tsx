// src/app/collectors/rankings/page.tsx

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { RankingsService } from '@/services/rankings'
import { RankingsView } from '@/components/collectors/rankings/RankingsView'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// Page metadata
export const metadata: Metadata = {
  title: 'POAP Rankings | Event Series Performance',
  description: 'Discover trending events and active participants across POAP collections.',
}

// Define the search parameters type
type SearchParams = {
  page?: string
  collectionId?: string
  eventId?: string
}

// Page component with correct Next.js 15 typing
export default async function RankingsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Parse and validate search parameters
  const parsedParams = {
    page: Math.max(1, parseInt(searchParams.page ?? '1')),
    collectionId: searchParams.collectionId,
    eventId: searchParams.eventId,
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold text-red-600">
            Error loading rankings
          </h2>
        </div>
      }
    >
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Event Series Rankings</h1>
        <Suspense fallback={<LoadingSpinner />}>
          <RankingsContent {...parsedParams} />
        </Suspense>
      </main>
    </ErrorBoundary>
  )
}

// Content component with its own type definitions
type RankingsContentProps = {
  page: number
  collectionId?: string
  eventId?: string
}

async function RankingsContent({
  page,
  collectionId,
  eventId
}: RankingsContentProps) {
  try {
    const rankings = await RankingsService.getGroupedRankings(
      page,
      { collectionId, eventId }
    )

    if (!rankings?.groups?.length) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No rankings data available at this time
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your filters or check back later
          </p>
        </div>
      )
    }

    return <RankingsView initialData={rankings} />
    
  } catch (error) {
    return <ErrorDisplay error={error} />
  }
}

// Error display component
function ErrorDisplay({ error }: { error: unknown }) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : 'An unexpected error occurred while loading rankings data'

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h2 className="text-red-800 text-lg font-semibold">
        Error Loading Rankings
      </h2>
      <p className="mt-2 text-red-600">
        {errorMessage}
      </p>
    </div>
  )
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'