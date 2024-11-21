import { Suspense } from 'react'
import { getRankings } from '@/services/rankings'
import { RankingsTable } from '@/components/collectors/rankings/rankings-table'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every minute

export default async function RankingsPage() {
  const rankings = await getRankings()
  
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            POAP Collector Rankings
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Top collectors across all recognized POAP collections on Solana
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-7xl">
          <Suspense fallback={<RankingsTableSkeleton />}>
            <RankingsTable rankings={rankings} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function RankingsTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
}