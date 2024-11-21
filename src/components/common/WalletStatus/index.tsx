'use client'

import { useWalletStatus } from '@/hooks/useWalletStatus'

export function WalletStatus() {
  const { isConnected, isConnecting, walletAddress } = useWalletStatus()

  if (isConnecting) {
    return (
      <div className="text-sm text-gray-500">
        Connecting...
      </div>
    )
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="text-sm text-gray-500">
      Connected: {walletAddress?.shortened}
    </div>
  )
}