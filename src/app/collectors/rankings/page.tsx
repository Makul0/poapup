import { Suspense } from 'react'
import { getAllCollectionStats } from '@/services/rankings'
import { RankingsTable } from '@/components/collectors/rankings/rankings-table'

export default async function RankingsPage() {
  const stats = await getAllCollectionStats()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">POAP Rankings</h1>
      
      {stats.map((collectionStats) => (
        <Suspense 
          key={collectionStats.name}
          fallback={<div>Loading {collectionStats.name} rankings...</div>}
        >
          <div className="mb-12">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">{collectionStats.name}</h2>
              <div className="text-sm text-gray-600 mt-1">
                <span className="mr-4">Total POAPs: {collectionStats.totalHolders}</span>
                <span>Unique Holders: {collectionStats.uniqueHolders}</span>
              </div>
            </div>
            <RankingsTable rankings={collectionStats.collectors} />
          </div>
        </Suspense>
      ))}
    </div>
  )
}