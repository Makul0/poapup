import { poapCollections } from '@/config/collections';
import { getAssetsByAuthority, heliusRateLimiter } from './helius';

export type CollectorRanking = {
  address: string;
  totalPoaps: number;
  collections: { [key: string]: number };
};

export async function getRankings(): Promise<CollectorRanking[]> {
  try {
    // Use rate limiter for requests
    const assetsPromises = poapCollections.map(collection => 
      heliusRateLimiter.add(() => getAssetsByAuthority(collection.mintAuthority))
    );
    
    const allAssetsArrays = await Promise.allSettled(assetsPromises);
    
    // Combine all assets and group by owner
    const ownershipMap = new Map<string, CollectorRanking>();
    
    allAssetsArrays.forEach((result, collectionIndex) => {
      if (result.status === 'fulfilled') {
        const assets = result.value;
        const collectionName = poapCollections[collectionIndex].name;
        
        assets.forEach(asset => {
          if (!asset?.ownerAddress) return;
          
          if (!ownershipMap.has(asset.ownerAddress)) {
            ownershipMap.set(asset.ownerAddress, {
              address: asset.ownerAddress,
              totalPoaps: 0,
              collections: {},
            });
          }
          
          const collector = ownershipMap.get(asset.ownerAddress)!;
          collector.totalPoaps += 1;
          collector.collections[collectionName] = 
            (collector.collections[collectionName] || 0) + 1;
        });
      } else {
        console.error(`Failed to fetch collection ${collectionIndex}:`, result.reason);
      }
    });
    
    // Convert to array and sort by total POAPs
    return Array.from(ownershipMap.values())
      .sort((a, b) => b.totalPoaps - a.totalPoaps);
  } catch (error) {
    console.error('Error getting rankings:', error);
    return [];
  }
}