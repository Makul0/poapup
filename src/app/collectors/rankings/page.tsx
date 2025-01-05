// src/app/collectors/rankings/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import { RankingsService } from '@/services/rankings'
import { RankingsView } from '@/components/collectors/rankings/RankingsView'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import {RankingsClientWrapper} from '@/components/common/RankingsClientWrapper'

export const metadata: Metadata = {
  title: 'POAP Rankings | Event Series Performance',
  description: 'Discover trending events and active participants across POAP collections.',
}

// Helper function to safely parse search parameters
async function parseSearchParams(searchParams: { [key: string]: string | string[] | undefined }) {
  // We need to await searchParams in Next.js 13+
  const rawPage = await Promise.resolve(searchParams.page ?? '1')
  const rawCollectionId = await Promise.resolve(searchParams.collectionId)
  const rawEventId = await Promise.resolve(searchParams.eventId)

  // Parse page number
  const pageStr = Array.isArray(rawPage) ? rawPage[0] : rawPage
  const page = Math.max(1, parseInt(pageStr, 10) || 1)

  // Parse collection ID
  const collectionId = Array.isArray(rawCollectionId) 
    ? rawCollectionId[0] 
    : rawCollectionId

  // Parse event ID
  const eventId = Array.isArray(rawEventId) 
    ? rawEventId[0] 
    : rawEventId

  return {
    page,
    collectionId,
    eventId
  }
}

// Server Component for Rankings Content
async function RankingsContent({
  params
}: {
  params: Awaited<ReturnType<typeof parseSearchParams>>
}) {
  try {
    const rankings = await RankingsService.getGroupedRankings(
      params.page,
      { 
        collectionId: params.collectionId, 
        eventId: params.eventId 
      }
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
    throw error // Let ErrorBoundary handle it
  }
}

// Main Page Component
export default async function RankingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse search parameters asynchronously
  const params = await parseSearchParams(searchParams)

  return (
    <RankingsClientWrapper>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Event Series Rankings</h1>
        <Suspense fallback={<LoadingSpinner />}>
          <RankingsContent params={params} />
        </Suspense>
      </main>
    </RankingsClientWrapper>
  )
}

// Force dynamic rendering to handle search parameters
export const dynamic = 'force-dynamic'