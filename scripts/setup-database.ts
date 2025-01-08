// scripts/setup-database.ts
import { prisma } from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'

async function createEvent(
  collection: { id: string },
  eventData: {
    name: string
    month: string
    year: number
    mintAuthority: string
    merkleTree?: string  // Changed from collectionAddr
    startDate: Date
    endDate: Date
  }
) {
  const event = await prisma.event.create({
    data: {
      name: eventData.name,
      month: eventData.month,
      year: eventData.year,
      mintAuthority: eventData.mintAuthority,
      merkleTree: eventData.merkleTree,  // Using merkleTree instead of collectionAddr
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      eventType: 'VIRTUAL',  // Default value
      isActive: true,
      collection: {
        connect: {
          id: collection.id
        }
      }
    }
  })
  return event
}

async function main() {
  console.log('🚀 Starting database setup and POAP sync...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.$transaction([
    prisma.poapHolder.deleteMany(),
    prisma.poap.deleteMany(),
    prisma.event.deleteMany(),
    prisma.collection.deleteMany(),
    prisma.creatorAccess.deleteMany(),
  ])
  console.log('✓ Database cleared')

  // Define collections
  const collections = [
    {
      name: "Solana Ecosystem Calls",
      events: [
        {
          name: "Solana Ecosystem Call: April 2023",
          month: "April",
          year: 2023,
          mintAuthority: "8zunjtVuspe4GFgbv9A44HLxmeMVHbCM3ZhUfUT6edpg",
          merkleTree: "FBDU9BiUpnzkorK8mS7swyPBrQGSTFv8ewJ8dYMGw7SY",
          startDate: new Date("2023-03-31T17:00:00.000Z"),
        },
        // ... other events
      ]
    },
    // ... other collections
  ]

  // Process collections
  for (const collectionData of collections) {
    console.log(`\n🔄 Processing collection: ${collectionData.name}`)
    
    const collection = await prisma.collection.create({
      data: {
        name: collectionData.name,
        description: `Official ${collectionData.name} collection`,
        isOfficial: true,
        isActive: true
      }
    })
    console.log(`✓ Base collection created: ${collection.name}`)

    // Process events for this collection
    for (const eventData of collectionData.events) {
      console.log(`\n📅 Processing event: ${eventData.name}`)
      try {
        const endDate = new Date(eventData.startDate)
        endDate.setDate(endDate.getDate() + 7)
        
        await createEvent(collection, {
          ...eventData,
          endDate
        })
        console.log(`✓ Event created: ${eventData.name}`)
      } catch (error) {
        console.error(`Error processing event ${eventData.name}: `, error)
      }
    }
  }

  // Print final stats
  console.log('\n📊 Final Database Status:')
  console.log('━━━━━━━━━━━━━━━━━━━━')
  
  const finalStats = await prisma.collection.findMany({
    include: {
      _count: {
        select: {
          poaps: true,  // Changed from Poap
          events: true,
        }
      },
      events: {
        include: {
          _count: {
            select: {
              poaps: true
            }
          }
        }
      }
    }
  })

  finalStats.forEach(collection => {
    console.log(`\n${collection.name}:`)
    console.log(`- Events: ${collection._count.events}`)
    console.log(`- Total POAPs: ${collection._count.poaps}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error during setup: ', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })