// src/app/collectors/rankings/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { RankingsService } from '@/services/rankings'
import { RankingsView } from '@/components/collectors/rankings/RankingsView'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata: Metadata = {
  title: 'POAP Rankings | Event Series Performance',
  description: 'Discover trending events and active participants across POAP collections.',
}

// Correctly type the page parameters for Next.js 13.4+
interface PageProps {
  params: { [key: string]: string | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}

function parsePage(pageParam?: string | string[]): number {
  const value = Array.isArray(pageParam) ? pageParam[0] : pageParam
  if (!value) return 1
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? 1 : Math.max(1, parsed)
}

export default async function RankingsPage({
  searchParams,
}: PageProps) {
  // Extract and parse params before using them in async operations
  const page = parsePage(searchParams.page)
  const collectionId = Array.isArray(searchParams.collectionId) 
    ? searchParams.collectionId[0] 
    : searchParams.collectionId
  const eventId = Array.isArray(searchParams.eventId)
    ? searchParams.eventId[0]
    : searchParams.eventId

  try {
    const rankings = await RankingsService.getGroupedRankings(
      page,
      {
        collectionId,
        eventId
      }
    )

    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Event Series Rankings</h1>
        <Suspense fallback={<LoadingSpinner />}>
          <RankingsView initialData={rankings} />
        </Suspense>
      </main>
    )
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 text-lg font-semibold">
            Error Loading Rankings
          </h2>
          <p className="mt-2 text-red-600">
            {error instanceof Error ? error.message : 'Failed to load rankings data'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
}

export const dynamic = 'force-dynamic'