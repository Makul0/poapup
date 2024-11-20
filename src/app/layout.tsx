import { WalletProvider } from '@/components/common/WalletProvider'
import { Layout } from '@/components/common/Layout'

import '@/styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'POAPup - Solana Proof of Attendance Protocol',
  description: 'POAPup turns precious moments into collectibles on Solana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <Layout>
            {children}
          </Layout>
        </WalletProvider>
      </body>
    </html>
  )
}