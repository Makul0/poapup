import { NextResponse } from 'next/server'
import { getRankings } from '@/services/rankings'

export async function GET() {
  try {
    const rankings = await getRankings()
    return NextResponse.json(rankings)
  } catch (error) {
    console.error('Error in rankings API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    )
  }
}