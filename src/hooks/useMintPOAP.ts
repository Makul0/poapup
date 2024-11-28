// src/hooks/useMintPOAP.ts
import { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { poapService } from '@/services/poap'
import { useToast } from '@/hooks/useToast'
import { useUser } from '@/contexts/UserContext'

export function useMintPOAP() {
  const { publicKey } = useWallet()
  const { showToast } = useToast()
  const { refreshUserData } = useUser()
  const [isMinting, setIsMinting] = useState(false)

  const mintPOAP = useCallback(async (
    merkleTree: string,
    metadata: {
      name: string
      uri: string
    }
  ) => {
    if (!publicKey) {
      showToast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to mint a POAP',
        type: 'error'
      })
      return
    }

    setIsMinting(true)
    try {
      const assetId = await poapService.mintPOAP(
        merkleTree,
        publicKey.toString(),
        metadata
      )

      // Update minted count on backend
      await fetch(`/api/collections/${merkleTree}/mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: publicKey.toString(),
          assetId
        })
      })

      showToast({
        title: 'Success!',
        description: 'POAP minted successfully',
        type: 'success'
      })

      await refreshUserData()
      return assetId

    } catch (error: Error | unknown) {
      console.error('Error minting POAP:', error)
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to mint POAP',
        type: 'error'
      })
      throw error
    } finally {
      setIsMinting(false)
    }
  }, [publicKey, showToast, refreshUserData])

  return {
    mintPOAP,
    isMinting
  }
}