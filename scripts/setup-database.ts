// scripts/setup-database.ts
import { PrismaClient } from '@prisma/client'
import { Helius } from 'helius-sdk'
import { initialCollections } from '../src/config/collections'

const prisma = new PrismaClient()
const helius = new Helius(process.env.NEXT_PUBLIC_HELIUS_API_KEY || '')

async function main() {
  console.log('🚀 Starting database setup and POAP sync...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    // First, clear existing data
    console.log('🗑️  Clearing existing data...')
    await prisma.poapHolder.deleteMany({})
    await prisma.poap.deleteMany({})
    await prisma.event.deleteMany({})
    await prisma.creatorAccess.deleteMany({})
    await prisma.collection.deleteMany({})
    console.log('✓ Database cleared')

    for (const collectionConfig of initialCollections) {
      console.log(`\n🔄 Processing collection: ${collectionConfig.name}`)
      
      // Create base collection
      const collection = await prisma.collection.create({
        data: {
          name: collectionConfig.name,
          description: collectionConfig.description,
          isOfficial: collectionConfig.isOfficial,
          isActive: true,
        }
      })
      console.log(`✓ Base collection created: ${collection.name}`)

      // Process each event in the collection
      for (const eventConfig of collectionConfig.events) {
        console.log(`\n📅 Processing event: ${eventConfig.name}`)

        // Calculate event dates
        const startDate = new Date(eventConfig.year, getMonthNumber(eventConfig.month))
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 7) // Assume events last a week

        // Create event
        const event = await prisma.event.create({
          data: {
            name: eventConfig.name,
            month: eventConfig.month,
            year: eventConfig.year,
            mintAuthority: eventConfig.mintAuthority,
            collectionAddr: eventConfig.collectionAddr,
            startDate,
            endDate,
            collection: { connect: { id: collection.id } }
          }
        })
        console.log(`✓ Event created: ${event.name}`)

        // Fetch POAPs for this event
        console.log(`📥 Fetching POAPs from Helius...`)
        const assets = await helius.rpc.getAssetsByGroup({
          groupKey: "collection",
          groupValue: eventConfig.collectionAddr,
          page: 1,
          limit: 1000
        })

        if (!assets?.items?.length) {
          console.log(`ℹ️  No POAPs found for event`)
          continue
        }

        console.log(`Found ${assets.items.length} POAPs`)

        // Process POAPs in batches
        const batchSize = 100
        for (let i = 0; i < assets.items.length; i += batchSize) {
          const batch = assets.items
            .slice(i, i + batchSize)
            // Filter POAPs that belong to this specific mint authority
            .filter(asset => asset.authorities?.[0]?.address === eventConfig.mintAuthority)

          await Promise.all(batch.map(async (asset) => {
            await prisma.poap.create({
              data: {
                name: asset.content.metadata.name,
                description: asset.content.metadata.description,
                image: asset.content.files[0]?.uri || '',
                assetId: asset.id,
                mintAddress: asset.id,
                collection: { connect: { id: collection.id } },
                event: { connect: { id: event.id } },
                holders: {
                  create: {
                    walletAddress: asset.ownership.owner,
                    acquiredAt: new Date(asset.mintedDate)
                  }
                }
              }
            })
          }))

          console.log(`✓ Processed ${Math.min((i + batchSize), batch.length)} POAPs`)
        }

        // Update event stats
        const eventStats = await prisma.poap.count({
          where: { eventId: event.id }
        })
        
        console.log(`📊 Event total POAPs: ${eventStats}`)
      }

      // Update collection stats
      const collectionStats = await prisma.poap.count({
        where: { collectionId: collection.id }
      })

      await prisma.collection.update({
        where: { id: collection.id },
        data: {
          totalPoaps: collectionStats,
          updatedAt: new Date()
        }
      })
    }

    // Print final status
    const finalStats = await prisma.collection.findMany({
      include: {
        _count: {
          select: { poaps: true, events: true }
        },
        events: {
          include: {
            _count: {
              select: { poaps: true }
            }
          }
        }
      }
    })

    console.log('\n📊 Final Database Status:')
    console.log('━━━━━━━━━━━━━━━━━━━━')
    finalStats.forEach(stat => {
      console.log(`\n${stat.name}:`)
      console.log(`  Total POAPs: ${stat._count.poaps}`)
      console.log(`  Total Events: ${stat._count.events}`)
      console.log('\n  Events:')
      stat.events.forEach(event => {
        console.log(`    - ${event.name}: ${event._count.poaps} POAPs`)
      })
    })

  } catch (error) {
    console.error('❌ Error during setup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Helper function to convert month name to number
function getMonthNumber(month: string): number {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months.findIndex(m => m.toLowerCase() === month.toLowerCase())
}

main().catch(console.error)