'use client'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter"
import { TipLinkWalletAutoConnectV2 } from "@tiplink/wallet-adapter-react-ui"
import { type ReactNode, useMemo } from 'react'

import '@tiplink/wallet-adapter-react-ui/styles.css'

type Props = {
  children: ReactNode
}

export function WalletProvider({ children }: Props) {
  const _network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork || WalletAdapterNetwork.Devnet
  const clientId = process.env.NEXT_PUBLIC_TIPLINK_CLIENT_ID

  const config = useMemo(() => ({
    title: "POAPup",
    clientId: clientId!,
    theme: "dark" as const,
    styles: {
      modalOverlay: {
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
      },
      modal: {
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        backgroundColor: '#1a1b1f',
      },
      button: {
        backgroundColor: '#4f46e5',
        '&:hover': {
          backgroundColor: '#4338ca',
        },
      },
    },
  }), [clientId])

  const wallets = useMemo(
    () => [new TipLinkWalletAdapter(config)],
    [config]
  )

  return (
    <SolanaWalletProvider 
      wallets={wallets} 
      autoConnect={true}
      onError={(error) => {
        console.error('Wallet error:', error)
        // a toast notification here
      }}
    >
      <TipLinkWalletAutoConnectV2
        isReady={true}
        query={{}}
      >
        {children}
      </TipLinkWalletAutoConnectV2>
    </SolanaWalletProvider>
  )
}