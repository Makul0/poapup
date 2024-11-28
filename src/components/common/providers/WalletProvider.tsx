'use client'

import { WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter"
import { WalletModalProvider } from '@tiplink/wallet-adapter-react-ui'
import { useMemo } from 'react'
import '@tiplink/wallet-adapter-react-ui/styles.css'

export function WalletProvider({ children }: { children: React.ReactNode }) {
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