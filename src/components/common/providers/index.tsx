'use client'

import dynamic from 'next/dynamic'
import { WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter"
import { WalletModalProvider } from '@tiplink/wallet-adapter-react-ui'
import { useMemo } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { UserProvider } from '@/contexts/UserContext'
import { ToastProvider } from '@/hooks/useToast'

import '@tiplink/wallet-adapter-react-ui/styles.css'

const WalletProviderComponent = ({ children }: { children: React.ReactNode }) => {
  const wallets = useMemo(() => [
    new TipLinkWalletAdapter({ 
      title: "POAPup", 
      clientId: process.env.NEXT_PUBLIC_TIPLINK_CLIENT_ID || '',
      theme: "dark"
    }),
  ], [])

  return (
    <SolanaWalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        {children}
      </WalletModalProvider>
    </SolanaWalletProvider>
  )
}

// Prevent SSR for wallet provider
const ClientWalletProvider = dynamic(
  () => Promise.resolve(WalletProviderComponent),
  { ssr: false }
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientWalletProvider>
      <AuthProvider>
        <UserProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </UserProvider>
      </AuthProvider>
    </ClientWalletProvider>
  )
}