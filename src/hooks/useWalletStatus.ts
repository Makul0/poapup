import { useWallet } from '@solana/wallet-adapter-react'
import { useCallback, useMemo } from 'react'

export function useWalletStatus() {
  const { connected, publicKey, connecting, disconnecting, disconnect } = useWallet()

  const walletAddress = useMemo(() => {
    if (!publicKey) return null
    const address = publicKey.toBase58()
    return {
      full: address,
      shortened: `${address.slice(0, 4)}...${address.slice(-4)}`,
    }
  }, [publicKey])

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }, [disconnect])

  return {
    isConnected: connected,
    isConnecting: connecting,
    isDisconnecting: disconnecting,
    publicKey,
    walletAddress,
    disconnect: handleDisconnect,
  }
}