import { Helius } from 'helius-sdk';

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY as string;
const helius = new Helius(HELIUS_API_KEY);

export type AssetWithOwner = {
  id: string;
  content: {
    metadata: {
      name: string;
      symbol: string;
    };
  };
  ownerAddress: string;
  compression: {
    compressed: boolean;
  };
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Rate limiter class
export class RateLimiter {
  private queue: Array<() => Promise<unknown>> = [];
  private processing = false;
  private rateLimit: number;
  private interval: number;

  constructor(rateLimit = 10, interval = 1000) {
    this.rateLimit = rateLimit;
    this.interval = interval;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result as T);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process(): Promise<void> {
    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.rateLimit);
      await Promise.all(batch.map(fn => fn()));
      if (this.queue.length > 0) {
        await delay(this.interval);
      }
    }

    this.processing = false;
  }
}

// Global rate limiter instance
export const heliusRateLimiter = new RateLimiter(5, 1000);

export async function getAllAssetsByAuthority(authority: string): Promise<AssetWithOwner[]> {
  try {
    let allAssets: AssetWithOwner[] = [];
    let page = 1;
    const limit = 1000;

    while (true) {
      const response = await helius.rpc.getAssetsByAuthority({
        authorityAddress: authority,
        page,
        limit,
        displayOptions: {
          showCollectionMetadata: true,
          showUnverifiedCollections: true,
          showNativeBalance: true,
          showFungible: false,
        },
      });

      if (!response?.items?.length) break;

      allAssets = [...allAssets, ...response.items.map(item => ({
        id: item.id,
        interface: item.interface,
        ownerAddress: item.ownership.owner,
        compression: {
          compressed: item.compression?.compressed ?? false
        },
        content: {
          metadata: {
            name: item.content?.metadata?.name || '',
            symbol: item.content?.metadata?.symbol || ''
          }
        }
      }))];
      if (response.items.length < limit) break;
      
      page++;
      await delay(200); // Rate limiting delay
    }

    return allAssets;
  } catch (error) {
    console.error('Error fetching all assets:', error);
    return [];
  }
}