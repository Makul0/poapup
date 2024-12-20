import { PrismaClient } from '@prisma/client'
import { RankingsService } from '../src/services/rankings'

const prisma = new PrismaClient()

async function testRankings() {
  console.log('Testing Rankings Service...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    // 1. Check database connection
    console.log('\n1. Testing database connection...')
    const collectionCount = await prisma.collection.count()
    console.log(`Found ${collectionCount} collections in database`)

    // 2. Check collection data
    console.log('\n2. Checking collection details...')
    const collections = await prisma.collection.findMany({
      include: {
        events: true,
        poaps: {
          include: {
            holders: true
          }
        }
      }
    })
    
    collections.forEach(collection => {
      console.log(`\nCollection: ${collection.name}`)
      console.log(`├─ Events: ${collection.events.length}`)
      console.log(`├─ POAPs: ${collection.poaps.length}`)
      console.log(`└─ Holders: ${collection.poaps.reduce((sum, p) => sum + p.holders.length, 0)}`)
    })

    // 3. Test rankings service
    console.log('\n3. Testing RankingsService.getGroupedRankings...')
    const rankings = await RankingsService.getGroupedRankings(1)
    console.log('Rankings result:', {
      totalGroups: rankings.groups.length,
      pagination: rankings.pagination
    })

    // 4. Check each group's data
    console.log('\n4. Checking group details...')
    rankings.groups.forEach(group => {
      console.log(`\nGroup: ${group.name}`)
      console.log(`├─ Events: ${group.events.length}`)
      console.log(`├─ Total POAPs: ${group.stats.totalPoaps}`)
      console.log(`└─ Top Collectors: ${group.stats.topCollectors.length}`)
    })

  } catch (error) {
    console.error('\nError during testing:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRankings().catch(console.error)