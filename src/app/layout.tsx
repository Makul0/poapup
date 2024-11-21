import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { WalletProvider } from '@/components/common/WalletProvider'
import { Header } from '@/components/common/Header'

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WalletProvider>
          <div className="relative min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}