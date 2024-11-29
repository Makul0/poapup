import { poapCollections } from '@/config/collections'
import { getAllAssetsByAuthority, heliusRateLimiter, AssetWithOwner } from './helius'

export interface CollectorRanking {
  address: string
  totalPoaps: number
  collections: {
    [key: string]: number
  }
  rank?: number
  lastUpdated?: Date
}

export interface CollectionStats {
  name: string
  totalMinted: number
  uniqueHolders: number
  topHolders: CollectorRanking[]
}

class RankingsCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly TTL = 5 * 60 * 1000

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }
}

const rankingsCache = new RankingsCache()

export async function getRankings(): Promise<CollectorRanking[]> {
  try {
    const cached = rankingsCache.get('global_rankings')
    if (cached) return cached

    const assetsPromises = poapCollections.map(collection => 
      heliusRateLimiter.add(() => getAllAssetsByAuthority(collection.mintAuthority))
    )
    
    const allAssetsArrays = await Promise.allSettled(assetsPromises)
    
    const ownershipMap = new Map<string, CollectorRanking>()
    
    allAssetsArrays.forEach((result, collectionIndex) => {
      if (result.status === 'fulfilled') {
        const assets = result.value
        const collectionName = poapCollections[collectionIndex].name
        
        assets.forEach(asset => {
          if (!asset?.ownerAddress) return
          
          if (!ownershipMap.has(asset.ownerAddress)) {
            ownershipMap.set(asset.ownerAddress, {
              address: asset.ownerAddress,
              totalPoaps: 0,
              collections: {},
              lastUpdated: new Date()
            })
          }
          
          const collector = ownershipMap.get(asset.ownerAddress)!
          collector.totalPoaps += 1
          collector.collections[collectionName] = 
            (collector.collections[collectionName] || 0) + 1
        })
      } else {
        console.error(`Failed to fetch collection ${collectionIndex}:`, result.reason)
      }
    })
    
    const rankings = Array.from(ownershipMap.values())
      .sort((a, b) => b.totalPoaps - a.totalPoaps)
      .map((collector, index) => ({
        ...collector,
        rank: index + 1
      }))

    rankingsCache.set('global_rankings', rankings)
    
    return rankings
  } catch (error) {
    console.error('Error getting rankings:', error)
    return []
  }
}

export async function getCollectionStats(collectionName: string): Promise<CollectionStats | null> {
  try {
    const cached = rankingsCache.get(`collection_${collectionName}`)
    if (cached) return cached

    const collection = poapCollections.find(c => c.name === collectionName)
    if (!collection) return null

    const assets = await heliusRateLimiter.add(() => 
      getAllAssetsByAuthority(collection.mintAuthority)
    )

    const collectors = new Map<string, CollectorRanking>()
    
    assets.forEach(asset => {
      if (!asset?.ownerAddress) return
      
      if (!collectors.has(asset.ownerAddress)) {
        collectors.set(asset.ownerAddress, {
          address: asset.ownerAddress,
          totalPoaps: 0,
          collections: { [collectionName]: 0 }
        })
      }
      
      const collector = collectors.get(asset.ownerAddress)!
      collector.totalPoaps += 1
      collector.collections[collectionName] += 1
    })

    const stats: CollectionStats = {
      name: collectionName,
      totalMinted: assets.length,
      uniqueHolders: collectors.size,
      topHolders: Array.from(collectors.values())
        .sort((a, b) => b.totalPoaps - a.totalPoaps)
        .slice(0, 10)
        .map((collector, index) => ({
          ...collector,
          rank: index + 1
        }))
    }

    rankingsCache.set(`collection_${collectionName}`, stats)

    return stats
  } catch (error) {
    console.error(`Error getting stats for collection ${collectionName}:`, error)
    return null
  }
}