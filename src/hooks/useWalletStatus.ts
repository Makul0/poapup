'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

export function useWalletStatus() {
  const { connected, connecting, publicKey } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    isReady: mounted,
    isConnecting: connecting,
    isConnected: mounted && connected,
    publicKey: publicKey?.toString(),
    walletAddress: publicKey?.toString(),
  }
}