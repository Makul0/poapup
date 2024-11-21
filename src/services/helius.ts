const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`

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

export async function getAssetsByAuthority(authority: string): Promise<AssetWithOwner[]> {
  try {
    const response = await fetch(HELIUS_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByAuthority',
        params: [
          authority,
          {
            page: 1,
            limit: 1000,
            before: "",
            after: "",
            sortBy: "created",
            sortDirection: "desc",
            displayOptions: {
              showCollectionMetadata: true,
              showNativeBalance: true,
              showUnverifiedCollections: true,
              showFungible: false,
              showInscription: false,
            }
          }
        ],
      }),
    });
    
    const data = await response.json();
    
    if (data?.error) {
      console.error('Helius API error:', data.error);
      return [];
    }

    if (!data?.result?.items) {
      console.log('No assets found or invalid response:', data);
      return [];
    }

    return data.result.items;
  } catch (error) {
    console.error('Error fetching assets:', error);
    return [];
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getAssetsByCreator(creator: string): Promise<AssetWithOwner[]> {
  try {
    await delay(1000);

    const response = await fetch(HELIUS_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByCreator',
        params: [
          creator,
          {
            page: 1,
            limit: 1000,
            before: "",
            after: "",
            sortBy: "created",
            sortDirection: "desc",
            displayOptions: {
              showCollectionMetadata: true,
              showNativeBalance: true,
              showUnverifiedCollections: true,
              showFungible: false,
              showInscription: false,
            }
          }
        ],
      }),
    });
    
    const data = await response.json();
    
    if (data?.error) {
      console.error('Helius API error:', data.error);
      return [];
    }

    return data.result?.items || [];
  } catch (error) {
    console.error('Error fetching assets:', error);
    return [];
  }
}

// Add types for Helius API responses
export type HeliusResponse<T> = {
  jsonrpc: '2.0';
  result?: T;
  error?: {
    code: number;
    message: string;
  };
  id: string;
};

export type HeliusAssetList = {
  items: AssetWithOwner[];
  total: number;
  limit: number;
  page: number;
};

// Add rate limiting helper
export class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
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
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
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

// Create a global rate limiter instance
export const heliusRateLimiter = new RateLimiter(5, 1000); // 5 requests per second