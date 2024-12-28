import { NextResponse } from 'next/server'
import { RankingsService } from '@/services/rankings'
import { ZodError } from 'zod'

/**
 * API handler for fetching POAP rankings data.
 * Supports pagination and filtering through query parameters.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const collectionId = searchParams.get('collectionId') || undefined
    const eventId = searchParams.get('eventId') || undefined
    
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: 'Invalid page number' },
        { status: 400 }
      )
    }

    const rankings = await RankingsService.getGroupedRankings(page, {
      collectionId,
      eventId
    })

    return NextResponse.json(rankings)
    
  } catch (error) {
    console.error('Rankings API error:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    )
  }
}