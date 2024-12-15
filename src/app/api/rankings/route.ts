// src/app/api/rankings/route.ts
import { NextResponse } from 'next/server'
import { RankingsService } from '@/services/rankings'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    
    const rankings = await RankingsService.getGroupedRankings(page)
    return NextResponse.json(rankings)
    
  } catch (error) {
    console.error('Rankings API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rankings' }, 
      { status: 500 }
    )
  }
}