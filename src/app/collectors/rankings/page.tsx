// src/app/collectors/rankings/page.tsx
import { RankingsService } from '@/services/rankings'
import { RankingsView } from '@/components/collectors/rankings/RankingsView'

export default async function RankingsPage() {
  // Get initial data
  const rankings = await RankingsService.getGroupedRankings(1)

  return (
    <div className="min-h-screen bg-gray-50">
      <RankingsView initialData={rankings} />
    </div>
  )
}