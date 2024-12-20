import { PrismaClient } from '@prisma/client'
import { Helius } from 'helius-sdk'
import { initialCollections } from '../src/config/collections'

const prisma = new PrismaClient()
const helius = new Helius(process.env.NEXT_PUBLIC_HELIUS_API_KEY || '')

/**
 * Helper function to validate and parse dates from various formats.
 * Returns current date as fallback if date is invalid or missing.
 */
function parseMintDate(mintedDate: string | number | undefined): Date {
  if (!mintedDate) return new Date()
  
  try {
    const date = new Date(mintedDate)
    if (isNaN(date.getTime())) {
      console.warn('Invalid date detected:', mintedDate)
      return new Date()
    }
    return date
  } catch (error) {
    console.warn('Error parsing date:', mintedDate, error)
    return new Date()
  }
}

/**
 * Convert month names to their numerical representation (0-11)
 * Used for creating consistent date objects from month strings
 */
function getMonthNumber(month: string): number {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months.findIndex(m => m.toLowerCase() === month.toLowerCase())
}

async function main() {
  console.log('🚀 Starting database setup and POAP sync...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    console.log('🗑️  Clearing existing data...')
    await prisma.poapHolder.deleteMany({})
    await prisma.poap.deleteMany({})
    await prisma.event.deleteMany({})
    await prisma.creatorAccess.deleteMany({})
    await prisma.collection.deleteMany({})
    console.log('✓ Database cleared')

    for (const collectionConfig of initialCollections) {
      console.log(`\n🔄 Processing collection: ${collectionConfig.name}`)
      
      const collection = await prisma.collection.create({
        data: {
          name: collectionConfig.name,
          description: collectionConfig.description,
          isOfficial: collectionConfig.isOfficial,
          isActive: true,
        }
      })
      console.log(`✓ Base collection created: ${collection.name}`)

      for (const eventConfig of collectionConfig.events) {
        try {
          console.log(`\n📅 Processing event: ${eventConfig.name}`)

          const startDate = new Date(eventConfig.year, getMonthNumber(eventConfig.month))
          const endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + 7)

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

          if (assets.items[0]) {
            console.log('Sample Asset Structure (first asset):')
            console.log(JSON.stringify({
              id: assets.items[0].id,
              ownership: assets.items[0].ownership,
              content: {
                metadata: {
                  name: assets.items[0].content.metadata.name,
                }
              }
            }, null, 2))
          }

          const batchSize = 100
          for (let i = 0; i < assets.items.length; i += batchSize) {
            const batch = assets.items
              .slice(i, i + batchSize)
              .filter(asset => asset.authorities?.[0]?.address === eventConfig.mintAuthority)

            await Promise.allSettled(batch.map(async (asset) => {
              try {
                const mintDate = parseMintDate(asset.mintedDate)

                await prisma.poap.create({
                  data: {
                    name: asset.content.metadata.name,
                    description: asset.content.metadata.description || '',
                    image: asset.content.files?.[0]?.uri || '',
                    assetId: asset.id,
                    mintAddress: asset.id,
                    collection: { connect: { id: collection.id } },
                    event: { connect: { id: event.id } },
                    holders: {
                      create: {
                        walletAddress: asset.ownership.owner,
                        acquiredAt: mintDate
                      }
                    }
                  }
                })
              } catch (error) {
                console.error('Error creating individual POAP:', {
                  assetId: asset.id,
                  error: error.message
                })
              }
            }))

            console.log(`✓ Processed ${Math.min((i + batchSize), batch.length)} POAPs`)
          }

          const eventStats = await prisma.poap.count({
            where: { eventId: event.id }
          })
          console.log(`📊 Event total POAPs: ${eventStats}`)

        } catch (error) {
          console.error(`Error processing event ${eventConfig.name}:`, error)
          continue
        }
      }

      try {
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
      } catch (error) {
        console.error(`Error updating collection stats for ${collection.name}:`, error)
      }
    }

    console.log('\n📊 Final Database Status:')
    console.log('━━━━━━━━━━━━━━━━━━━━')

    const finalStats = await prisma.collection.findMany({
      include: {
        _count: {
          select: { Poap: true, events: true }
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

    finalStats.forEach(stat => {
      console.log(`\n${stat.name}:`)
      console.log(`  Total POAPs: ${stat._count.Poap}`)
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

main().catch(console.error)