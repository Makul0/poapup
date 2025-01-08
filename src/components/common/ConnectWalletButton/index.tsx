'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@tiplink/wallet-adapter-react-ui'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUser } from '@/contexts/UserContext'
import { useToast } from '@/hooks/useToast'

export function ConnectWalletButton() {
  const { connected, publicKey } = useWallet()
  const { isAuthenticated, login: authLogin, isLoading: authLoading } = useAuth()
  const { login: userLogin, isLoading: userLoading } = useUser()
  const { showToast } = useToast()

  useEffect(() => {
    const handleAuth = async () => {
      if (connected && publicKey && !isAuthenticated) {
        try {
          await authLogin()
          await userLogin()
        } catch (error) {
          console.error('Authentication error:', error)
          showToast({
            title: 'Authentication Failed',
            description: 'Please try connecting again',
            type: 'error'
          })
        }
      }
    }

    handleAuth()
  }, [connected, publicKey, isAuthenticated, authLogin, userLogin, showToast])

  const isLoading = authLoading || userLoading

  return (
    <div className="relative inline-block">
      <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 transition-colors" />
      {connected && isLoading && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
          {authLoading ? 'Authenticating...' : 'Loading profile...'}
        </div>
      )}
    </div>
  )
}