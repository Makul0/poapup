import { Metadata } from 'next'
import { Suspense } from 'react'
import { GeistSans } from 'geist/font/sans'
import { Providers } from '@/components/common/providers'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'

import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'POAPup - Solana Proof of Attendance Protocol',
  description: 'Create and collect proof of attendance tokens on Solana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
              }>
                {children}
              </Suspense>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}