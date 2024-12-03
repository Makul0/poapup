import { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Providers } from '@/components/common/providers'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'

import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'POAPup - Solana Proof of Attendance Protocol',
  description: 'Create and collect proof of attendance tokens on Solana',
  other: {
    'data-gr-ext-installed': '',
    'data-new-gr-c-s-check-loaded': '',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}