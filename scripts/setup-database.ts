// scripts/setup-database.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database setup...')

  try {
    console.log('\nCreating collections...')
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

    // Create collections
    for (const collection of initialCollections) {
      const created = await prisma.collection.upsert({
        where: { mintAuthority: collection.mintAuthority },
        update: collection,
        create: collection,
      })
      console.log(`✓ Created collection: ${created.name}`)
      
      // Create a default admin access for each collection
      // In production, you'd want to set this to a specific admin wallet
      await prisma.creatorAccess.upsert({
        where: {
          collectionId_walletAddress: {
            collectionId: created.id,
            walletAddress: collection.mintAuthority,
          },
        },
        update: {
          role: 'ADMIN',
          isActive: true,
          canCreateEvents: true,
          canMintPoaps: true,
          canEditDetails: true,
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
      })
      console.log(`✓ Created admin access for: ${created.name}`)
    }

    console.log('\nDatabase setup completed successfully!')

  } catch (error) {
    console.error('Error during database setup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()