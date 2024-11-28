'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@tiplink/wallet-adapter-react-ui'
import { useEffect } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useToast } from '@/hooks/useToast'

export function ConnectWalletButton() {
  const { connected, publicKey } = useWallet()
  const { login, isAuthenticated } = useUser()
  const { showToast } = useToast()

  useEffect(() => {
    if (connected && publicKey && !isAuthenticated) {
      login().catch((error) => {
        showToast({
          title: 'Authentication Error',
          description: 'Failed to authenticate wallet. Please try again.',
          type: 'error'
        })
        console.error('Auth error:', error)
      })
    }
  }, [connected, publicKey, isAuthenticated, login, showToast])

  return (
    <div className="relative inline-block">
      <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 transition-colors" />
      {connected && !isAuthenticated && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
          Authenticating...
        </div>
      )}
    </div>
  )
}