import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum, createTree, mintV1, findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { generateSigner, none, publicKey } from '@metaplex-foundation/umi'

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY as string
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`

async function heliusRpc<T>(method: string, params: any[]): Promise<T> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method,
      params,
    }),
  })
  const data = await response.json()
  if (data.error) throw new Error(data.error.message)
  return data.result
}

export type EventType = 'VIRTUAL' | 'IRL'

export interface POAPMetadata {
 title: string
 description: string
 image: File | undefined
 url?: string
 startDate: Date
 endDate: Date
 eventType: EventType
 maxAttendees: number
 isPublic: boolean
}

export interface POAPCollection {
 id: string
 title: string
 description: string
 imageUrl: string
 merkleTree: string
 startDate: Date
 endDate: Date
 eventType: EventType
 maxAttendees: number
 isPublic: boolean
 mintedCount: number
 createdAt: Date
 creator: string
}

export class POAPService {
  private umi

  constructor() {
    this.umi = createUmi(RPC_URL)
      .use(mplBubblegum())
      .use(irysUploader({ address: 'https://node1.irys.xyz' }))
  }

 async createPOAPCollection(metadata: POAPMetadata): Promise<string> {
   try {
     if (!metadata.image) {
       throw new Error('Image is required for POAP collection')
     }

     const imageBuffer = await metadata.image.arrayBuffer()
     const imageFile = {
       buffer: new Uint8Array(imageBuffer),
       fileName: metadata.image.name,
       displayName: metadata.image.name,
       uniqueName: metadata.image.name,
       contentType: metadata.image.type,
       extension: metadata.image.name.split('.').pop() || '',
       tags: [],
     }
     const [imageUri] = await this.umi.uploader.upload([imageFile])

     const metadataJson = {
       name: metadata.title,
       symbol: 'POAP',
       description: metadata.description,
       image: imageUri,
       external_url: metadata.url,
       attributes: [
         {
           trait_type: 'Event Type',
           value: metadata.eventType
         },
         {
           trait_type: 'Start Date',
           value: metadata.startDate.toISOString()
         },
         {
           trait_type: 'End Date',
           value: metadata.endDate.toISOString()
         }
       ]
     }

     const metadataUri = await this.umi.uploader.uploadJson(metadataJson)
     const merkleTree = generateSigner(this.umi)

     const tx = await createTree(this.umi, {
       merkleTree,
       maxDepth: 14,
       maxBufferSize: 64,
       canopyDepth: 8,
       public: metadata.isPublic
     })
     await tx.sendAndConfirm(this.umi)

     return merkleTree.publicKey

   } catch (error) {
     console.error('Error creating POAP collection:', error)
     throw error
   }
 }

 async mintPOAP(
   merkleTree: string,
   recipient: string,
   metadata: {
     name: string
     uri: string
   }
 ): Promise<string> {
   try {
     const { signature } = await mintV1(this.umi, {
       leafOwner: publicKey(recipient),
       merkleTree: publicKey(merkleTree),
       metadata: {
         name: metadata.name,
         symbol: 'POAP',
         uri: metadata.uri,
         sellerFeeBasisPoints: 0,
         collection: none(),
         creators: []
       }
     }).sendAndConfirm(this.umi)

     const leaf = await this.umi.rpc.getTransaction(signature)
     if (!leaf) throw new Error('Failed to get leaf')

     const leafIndex = Number(leaf.message.accounts[1].toString())
     
     const [assetId] = findLeafAssetIdPda(this.umi, {
       merkleTree: publicKey(merkleTree),
       leafIndex
     })

     return assetId.toString()

   } catch (error) {
     console.error('Error minting POAP:', error)
     throw error
   }
 }

 async getPOAPsByOwner(owner: string): Promise<POAPCollection[]> {
  try {
    const response = await heliusRpc<{
      items: Array<{
        id: string;
        content: {
          metadata: {
            name: string;
            description?: string;
          };
          files?: Array<{ uri: string }>;
        };
        compression: {
          compressed: boolean;
          tree: string;
        };
        grouping?: Array<{
          group_key: string;
        }>;
      }>;
    }>('getAssetsByOwner', [{
      ownerAddress: owner,
      page: 1,
      limit: 1000,
      displayOptions: {
        showCollectionMetadata: true
      }
    }])

    const assets = response.items || []
    
    return assets
      .filter(asset => 
        asset.compression?.compressed && 
        asset.grouping?.find(g => g.group_key === "collection")
      )
      .map(asset => ({
        id: asset.id,
        title: asset.content.metadata.name,
        description: asset.content.metadata.description || '',
        imageUrl: asset.content.files?.[0]?.uri || '',
        merkleTree: asset.compression.tree,
        startDate: new Date(),
        endDate: new Date(),
        eventType: 'VIRTUAL' as EventType,
        maxAttendees: 0,
        isPublic: true,
        mintedCount: 0,
        createdAt: new Date(),
        creator: ''
      }))

  } catch (error) {
    console.error('Error fetching POAPs:', error)
    return []
  }
}
}


export const poapService = new POAPService()