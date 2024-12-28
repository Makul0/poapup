import { motion } from 'framer-motion'
import Link from 'next/link'

interface TopCollector {
  rank: number
  wallet: string
  count: number
}

interface TopCollectorsProps {
  collectors: TopCollector[]
  title?: string
  subtitle?: string
}

export function TopCollectors({ 
  collectors, 
  title = "Top Collectors",
  subtitle = "Most active participants in this series"
}: TopCollectorsProps) {
  const formatWallet = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`
  const solanaFmUrl = (address: string) => `https://solana.fm/address/${address}`

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>

      <div className="space-y-4">
        {collectors.map((collector, index) => (
          <motion.div
            key={collector.wallet}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <span className={`
                w-6 h-6 flex items-center justify-center rounded-full
                ${index < 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                text-sm font-medium
              `}>
                {collector.rank}
              </span>
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/collectors/${collector.wallet}`}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  {formatWallet(collector.wallet)}
                </Link>
                <Link 
                  href={solanaFmUrl(collector.wallet)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg 
                    className="h-4 w-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {collector.count}
              </span>
              <span className="text-xs text-gray-500">POAPs</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}