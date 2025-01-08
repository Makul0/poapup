// src/app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

// For development/testing purposes, we'll create some sample events
const sampleEvents = [
  {
    id: "1",
    title: "Solana Ecosystem Call: January 2024",
    description: "Join us for the first Solana ecosystem call of 2024! We'll cover recent developments, upcoming features, and community updates.",
    image: "/api/placeholder/800/450", // Using a placeholder for now
    startDate: new Date(2024, 0, 15, 10, 0).toISOString(), // Jan 15, 2024, 10:00 AM
    endDate: new Date(2024, 0, 15, 11, 30).toISOString(),  // Jan 15, 2024, 11:30 AM
    eventType: "VIRTUAL",
    maxAttendees: 1000,
    mintedCount: 450,
    isPublic: true,
    creator: "5b4ZfyhVEuHEiUWzoWPrQqvhWD3WLyktPpQm2xs2CnyJ",
    merkleTree: "merkle_tree_1"
  },
  {
    id: "2",
    title: "Jupiter Protocol Community Call #30",
    description: "Monthly community call discussing Jupiter Protocol's progress, new features, and upcoming developments in the DeFi space.",
    image: "/api/placeholder/800/450",
    startDate: new Date(2024, 1, 1, 15, 0).toISOString(), // Feb 1, 2024, 3:00 PM
    endDate: new Date(2024, 1, 1, 16, 0).toISOString(),   // Feb 1, 2024, 4:00 PM
    eventType: "VIRTUAL",
    maxAttendees: 500,
    mintedCount: 0,
    isPublic: true,
    creator: "3xdSwvDQTXZiyyC9F2LFjAhRD1xFfdKrAjnuJVy4nDQR",
    merkleTree: "merkle_tree_2"
  },
  {
    id: "3",
    title: "DeFi Developer Workshop: Mumbai",
    description: "Hands-on workshop for developers interested in building DeFi applications on Solana. Join us in Mumbai for an intensive learning experience.",
    image: "/api/placeholder/800/450",
    startDate: new Date(2023, 11, 15, 9, 0).toISOString(), // Dec 15, 2023, 9:00 AM
    endDate: new Date(2023, 11, 15, 17, 0).toISOString(),  // Dec 15, 2023, 5:00 PM
    eventType: "IRL",
    maxAttendees: 100,
    mintedCount: 98,
    isPublic: true,
    creator: "J3CQs9xfn5YAPU1pP3YhdMLQcJuRtuFZBfDJSxxuwxof",
    merkleTree: "merkle_tree_3"
  },
  {
    id: "4",
    title: "Solana Spaces: NFT Innovation",
    description: "Exploring the future of NFTs on Solana. Join industry leaders and creators to discuss the latest trends and technologies.",
    image: "/api/placeholder/800/450",
    startDate: new Date(2024, 1, 20, 13, 0).toISOString(), // Feb 20, 2024, 1:00 PM
    endDate: new Date(2024, 1, 20, 15, 0).toISOString(),   // Feb 20, 2024, 3:00 PM
    eventType: "VIRTUAL",
    maxAttendees: 2000,
    mintedCount: 0,
    isPublic: true,
    creator: "59UiKc91dGyHy2n5N6CnGHV9SVsujBHCitEQixk5G6GK",
    merkleTree: "merkle_tree_4"
  },
  {
    id: "5",
    title: "Solana Hacker House: Singapore",
    description: "Three-day intensive hacking event in Singapore. Build, learn, and connect with fellow Solana developers.",
    image: "/api/placeholder/800/450",
    startDate: new Date(2024, 2, 1, 9, 0).toISOString(), // March 1, 2024, 9:00 AM
    endDate: new Date(2024, 2, 3, 18, 0).toISOString(),  // March 3, 2024, 6:00 PM
    eventType: "IRL",
    maxAttendees: 200,
    mintedCount: 0,
    isPublic: true,
    creator: "BKn45YvZfgQM6AQ3te4maGkFSMTVZibKyCxxqh6AWcUL",
    merkleTree: "merkle_tree_5"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const creator = searchParams.get('creator')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)

    // For development, we'll return our sample events instead of querying the database
    let filteredEvents = sampleEvents;

    // Apply filters if needed
    if (creator) {
      filteredEvents = filteredEvents.filter(event => event.creator === creator)
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex)

    return NextResponse.json({
      events: paginatedEvents,
      pagination: {
        total: filteredEvents.length,
        pages: Math.ceil(filteredEvents.length / limit),
        currentPage: page,
        limit,
        hasNextPage: endIndex < filteredEvents.length,
        hasPreviousPage: page > 1
      }
    })

  } catch (error) {
    console.error('Error in events API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}