'use client'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter"
import { TipLinkWalletAutoConnectV2 } from "@tiplink/wallet-adapter-react-ui"
import { useMemo } from 'react'

export function WalletProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork || WalletAdapterNetwork.Devnet
  
  const wallets = useMemo(
    () => [
      new TipLinkWalletAdapter({ 
        title: "POAPup",
        clientId: process.env.NEXT_PUBLIC_TIPLINK_CLIENT_ID!,
        theme: "dark"
      }),
    ],
    [network]
  )

  return (
    <SolanaWalletProvider wallets={wallets} autoConnect>
      <TipLinkWalletAutoConnectV2
        isReady={true}
        query={{}}
      >
        {children}
      </TipLinkWalletAutoConnectV2>
    </SolanaWalletProvider>
  )
}