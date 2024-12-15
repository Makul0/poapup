// src/app/collectors/rankings/page.tsx
import { RankingsService } from '@/services/rankings'
import { RankingsView } from '@/components/collectors/rankings/RankingsView'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default async function RankingsPage() {
  // Let's add some debug logging
  console.log('Fetching rankings data...')
  
  try {
    // Get initial data with debug information
    const rankings = await RankingsService.getGroupedRankings(1)
    console.log('Rankings data fetched:', {
      groupsCount: rankings.groups.length,
      pagination: rankings.pagination
    })

    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<LoadingSpinner />}>
          <RankingsView initialData={rankings} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error loading rankings:', error)
    // Return an error state component instead of letting the page fail
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Error Loading Rankings</h2>
          <p className="mt-2 text-sm text-gray-500">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    )
  }
}