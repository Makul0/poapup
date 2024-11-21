import { poapCollections } from '@/config/collections';
import { getAllAssetsByAuthority, heliusRateLimiter } from './helius';

export type CollectorRanking = {
  address: string;
  totalPoaps: number;
  collections: { [key: string]: number };
  rank: number;
};

export type CollectionStats = {
  name: string;
  totalHolders: number;
  uniqueHolders: number;
  collectors: CollectorRanking[];
};

export async function getCollectionStats(collectionName: string): Promise<CollectionStats | null> {
  try {
    const collection = poapCollections.find(c => c.name === collectionName);
    if (!collection) return null;

    const assets = await heliusRateLimiter.add(() => 
      getAllAssetsByAuthority(collection.mintAuthority)
    );

    const ownershipMap = new Map<string, CollectorRanking>();
    let totalPoaps = 0;

    assets.forEach(asset => {
      if (!asset?.ownerAddress) return;
      totalPoaps++;
      
      if (!ownershipMap.has(asset.ownerAddress)) {
        ownershipMap.set(asset.ownerAddress, {
          address: asset.ownerAddress,
          totalPoaps: 0,
          collections: { [collectionName]: 0 },
          rank: 0
        });
      }
      
      const collector = ownershipMap.get(asset.ownerAddress)!;
      collector.totalPoaps += 1;
      collector.collections[collectionName] = 
        (collector.collections[collectionName] || 0) + 1;
    });

    const collectors = Array.from(ownershipMap.values())
      .sort((a, b) => b.totalPoaps - a.totalPoaps)
      .map((collector, index) => ({
        ...collector,
        rank: index + 1
      }));

    return {
      name: collection.name,
      totalHolders: totalPoaps,
      uniqueHolders: collectors.length,
      collectors
    };
  } catch (error) {
    console.error(`Error getting stats for collection ${collectionName}:`, error);
    return null;
  }
}

export async function getAllCollectionStats(): Promise<CollectionStats[]> {
  try {
    const statsPromises = poapCollections.map(collection => 
      getCollectionStats(collection.name)
    );
    
    const results = await Promise.all(statsPromises);
    return results.filter((stats): stats is CollectionStats => stats !== null);
  } catch (error) {
    console.error('Error getting all collection stats:', error);
    return [];
  }
}