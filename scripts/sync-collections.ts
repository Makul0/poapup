// scripts/sync-collections.ts
import { poapCollections } from '../src/config/collections'
import { CollectionService } from '../src/services/collections'
import { prisma } from '../src/lib/prisma'

async function syncCollections() {
  console.log('Starting collection sync...')

  try {
    for (const config of poapCollections) {
      console.log(`\nSyncing ${config.name}...`)

      // Create or update collection
      const collection = await CollectionService.syncCollection(
        config.mintAuthority,
        {
          name: config.name,
          description: config.description,
          isOfficial: config.isOfficial
        },
        { forceUpdate: true }
      )

      console.log('Collection updated:', collection.id)

      // Sync POAPs
      console.log('Syncing POAPs...')
      const poaps = await CollectionService.syncPoaps(collection.id)
      console.log(`Synced ${poaps.length} POAPs`)

      // Update stats
      await CollectionService.updateCollectionStats(collection.id)
      console.log('Stats updated')
    }

    console.log('\nSync completed successfully!')

  } catch (error) {
    console.error('Sync failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

syncCollections().catch(console.error)