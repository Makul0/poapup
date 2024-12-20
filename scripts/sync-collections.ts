import { poapCollections } from '../src/config/collections'
import { CollectionService } from '../src/services/collections'
import { prisma } from '../src/lib/prisma'

async function syncCollections() {
  console.log('Starting collection sync...')

  try {
    for (const config of poapCollections) {
      console.log(`\nSyncing ${config.name}...`)

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

      console.log('Syncing POAPs...')
      const poaps = await CollectionService.syncPoaps(collection.id)
      console.log(`Synced ${poaps.length} POAPs`)

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