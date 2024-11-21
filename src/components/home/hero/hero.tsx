'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'

export function Hero() {
  const { connected } = useWallet()
  const router = useRouter()

  return (
    <div className="relative isolate pt-14">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Your Web3 Memories, Forever on Solana
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            POAPup turns precious moments into collectibles. Using blockchain technology, 
            we tokenize your memories, so they can last forever and be truly yours.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {connected ? (
              <Button onClick={() => router.push('/events')}>
                Explore Events
              </Button>
            ) : (
              <Button onClick={() => router.push('/creators/create')}>
                Create Your First POAP
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push('/docs')}>
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}