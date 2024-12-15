// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    // Step 1: Create initial collections
    console.log('\n📦 Creating collections...')
    const initialCollections = [
      {
        name: "Solana Ecosystem Calls",
        description: "Superteam Ecosystem Collectables - These collectibles help track attendance to the Superteam ecosystem call.",
        mintAuthority: "5b4ZfyhVEuHEiUWzoWPrQqvhWD3WLyktPpQm2xs2CnyJ",
        isOfficial: true,
        isActive: true,
      },
      {
        name: "dVIN Labs",
        description: "Collections of Digital Cork NFTs, each the digital twin for a bottle of wine.",
        mintAuthority: "pkVjxuNte1SqdwjvP28pbcgUcmLAWay9PiuLDCKMjyb",
        isOfficial: true,
        isActive: true,
      },
      {
        name: "Dilli Hackerhouse",
        description: "Solana Foundation x Jump Hacker House, New Delhi souvenir.",
        mintAuthority: "59UiKc91dGyHy2n5N6CnGHV9SVsujBHCitEQixk5G6GK",
        isOfficial: true,
        isActive: true,
      },
      {
        name: "$SILLY Dragon in Dubai",
        description: "NFT Night with SuperTeamUAE at Founders Villa.",
        mintAuthority: "BKn45YvZfgQM6AQ3te4maGkFSMTVZibKyCxxqh6AWcUL",
        isOfficial: true,
        isActive: true,
      },
    ]

    // Create collections with progress tracking
    for (const collection of initialCollections) {
      const created = await prisma.collection.upsert({
        where: { mintAuthority: collection.mintAuthority },
        create: collection,
        update: collection,
      })
      console.log(`✓ Created: ${created.name}`)

      // Create admin access for the collection
      const access = await prisma.creatorAccess.upsert({
        where: {
          collectionId_walletAddress: {
            collectionId: created.id,
            walletAddress: collection.mintAuthority,
          }
        },
        create: {
          collectionId: created.id,
          walletAddress: collection.mintAuthority,
          role: 'ADMIN',
          isActive: true,
          canCreateEvents: true,
          canMintPoaps: true,
          canEditDetails: true,
        },
        update: {
          role: 'ADMIN',
          isActive: true,
        }
      })
      console.log(`  └─ Admin access created for ${collection.name}`)
    }

    // Step 2: Verify seeding results
    const collectionCount = await prisma.collection.count()
    const accessCount = await prisma.creatorAccess.count()

    console.log('\n📊 Seeding Results:')
    console.log('━━━━━━━━━━━━━━━━━━━━')
    console.log(`Collections created: ${collectionCount}`)
    console.log(`Creator access records: ${accessCount}`)

    if (collectionCount === initialCollections.length &&
        accessCount === initialCollections.length) {
      console.log('\n✨ Database seeding completed successfully!')
    } else {
      console.warn('\n⚠️  Warning: Some records may not have been created correctly')
    }

  } catch (error) {
    console.error('\n❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Execute the seeding
main()
  .catch((error) => {
    console.error('Failed to seed database:', error)
    process.exit(1)
  })