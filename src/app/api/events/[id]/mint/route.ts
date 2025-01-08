// src/app/api/events/[id]/mint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { assetId } = data

    if (!assetId) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 }
      )
    }

    // Check if event exists and is active
    const event = await prisma.poapEvent.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { attendees: true }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if event is active
    const now = new Date()
    if (now < event.startDate || now > event.endDate) {
      return NextResponse.json(
        { error: 'Event is not active' },
        { status: 400 }
      )
    }

    // Check if max attendees reached
    if (event._count.attendees >= event.maxAttendees) {
      return NextResponse.json(
        { error: 'Event is full' },
        { status: 400 }
      )
    }

    // Check if user already has a POAP for this event
    const existingMint = await prisma.eventAttendee.findUnique({
      where: {
        eventId_wallet: {
          eventId: params.id,
          wallet: session.user.wallet
        }
      }
    })

    if (existingMint) {
      return NextResponse.json(
        { error: 'Already minted POAP for this event' },
        { status: 400 }
      )
    }

    // Record the mint
    const attendee = await prisma.eventAttendee.create({
      data: {
        eventId: params.id,
        wallet: session.user.wallet,
        assetId
      }
    })

    // Revalidate the events pages
    revalidatePath('/events')
    revalidatePath(`/events/${params.id}`)

    return NextResponse.json(attendee)
  } catch (error) {
    console.error('Error minting POAP:', error)
    return NextResponse.json(
      { error: 'Failed to mint POAP' },
      { status: 500 }
    )
  }
}