// src/app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

// Get event details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.poapEvent.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { attendees: true }
        },
        // Include recent attendees for display
        attendees: {
          select: {
            wallet: true,
            mintedAt: true,
            assetId: true
          },
          orderBy: { mintedAt: 'desc' },
          take: 10 // Limit to recent attendees
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // If event is not public, verify creator access
    if (!event.isPublic) {
      try {
        const session = await requireAuth(request)
        if (session.wallet !== event.creator) {
          return NextResponse.json(
            { error: 'Not authorized to view this event' },
            { status: 403 }
          )
        }
      } catch {
        return NextResponse.json(
          { error: 'Not authorized to view this event' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({
      ...event,
      mintedCount: event._count.attendees
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

// Update event
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const session = await requireAuth(request)

    const event = await prisma.poapEvent.findUnique({
      where: { id: params.id }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Verify creator permission
    if (event.creator !== session.wallet) {
      return NextResponse.json(
        { error: 'Not authorized to update this event' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Don't allow updating critical fields after creation
    delete data.creator
    delete data.merkleTree
    delete data.mintedCount

    // Update the event
    const updatedEvent = await prisma.poapEvent.update({
      where: { id: params.id },
      data
    })

    // Revalidate cached pages
    revalidatePath('/events')
    revalidatePath(`/events/${params.id}`)

    return NextResponse.json(updatedEvent)
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}