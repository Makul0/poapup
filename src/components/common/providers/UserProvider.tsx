'use client'

import dynamic from 'next/dynamic'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter"
import { WalletModalProvider } from '@tiplink/wallet-adapter-react-ui'
import { useMemo } from 'react'
import { UserProvider as AuthProvider } from '@/contexts/UserContext'
import { ToastProvider } from '@/hooks/useToast'

import '@tiplink/wallet-adapter-react-ui/styles.css'

const ClientProviders = dynamic(
  () => Promise.resolve(({ children }: { children: React.ReactNode }) => {
    const wallets = useMemo(() => [
      new TipLinkWalletAdapter({ 
        title: "POAPup", 
        clientId: process.env.NEXT_PUBLIC_TIPLINK_CLIENT_ID || '',
        theme: "dark"
      }),
    ], [])

    return (
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    )
  }),
  {
    ssr: false
  }
)

export function Providers({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>
}