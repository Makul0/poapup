// src/app/collectors/rankings/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import { RankingsService } from '@/services/rankings'
import { RankingsView } from '@/components/collectors/rankings/RankingsView'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

export const metadata: Metadata = {
  title: 'POAP Rankings | Event Series Performance',
  description: 'Discover trending events and active participants across POAP collections.',
}

type ProcessedParams = {
  page: number
  collectionId?: string
  eventId?: string
}

function processParams(searchParams: Record<string, string | string[] | undefined> = {}): ProcessedParams {
  const rawPage = searchParams.page ?? '1'
  const pageNumber = parseInt(Array.isArray(rawPage) ? rawPage[0] : rawPage, 10)

  return {
    page: Math.max(1, isNaN(pageNumber) ? 1 : pageNumber),
    collectionId: searchParams.collectionId 
      ? (Array.isArray(searchParams.collectionId) ? searchParams.collectionId[0] : searchParams.collectionId)
      : undefined,
    eventId: searchParams.eventId
      ? (Array.isArray(searchParams.eventId) ? searchParams.eventId[0] : searchParams.eventId)
      : undefined
  }
}

// Error fallback component with proper typing
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-red-600">
        Error loading rankings: {error.message}
      </h2>
    </div>
  )
}

// Client wrapper component
const RankingsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      {children}
    </ErrorBoundary>
  )
}

// Content component with proper typing
const RankingsContent: React.FC<ProcessedParams> = async ({ page, collectionId, eventId }) => {
  try {
    const rankings = await RankingsService.getGroupedRankings(
      page,
      { collectionId, eventId }
    )

    if (!rankings?.groups?.length) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No rankings data available</p>
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

// Error display component with proper typing
const ErrorDisplay: React.FC<{ error: unknown }> = ({ error }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h2 className="text-red-800 text-lg font-semibold">
        Error Loading Rankings
      </h2>
      <p className="mt-2 text-red-600">
        {error instanceof Error ? error.message : 'An unexpected error occurred'}
      </p>
    </div>
  )
}

// Main page component
const RankingsPage = async () => {
  const searchParams = {} as Record<string, string | string[] | undefined>
  const processedParams = processParams(searchParams)

  return (
    <RankingsWrapper>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Event Series Rankings</h1>
        <Suspense fallback={<LoadingSpinner />}>
          <RankingsContent {...processedParams} />
        </Suspense>
      </main>
    </RankingsWrapper>
  )
}

export const dynamic = 'force-dynamic'

export default RankingsPage