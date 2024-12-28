import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface TopCollector {
  rank: number
  wallet: string
  eventCount: number
  totalMints: number
  firstAttendance: Date
  lastAttendance: Date
}

interface TopCollectorsTableProps {
  collectors: TopCollector[]
}

export function TopCollectorsTable({ collectors }: TopCollectorsTableProps) {
  // Helper function to format wallet addresses and generate Solana.fm link
  const formatAddress = (address: string) => ({
    display: `${address.slice(0, 4)}...${address.slice(-4)}`,
    solanaFmUrl: `https://solana.fm/address/${address}`
  })

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Wallet
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Events Attended
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total POAPs
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              First Attended
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Attended
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {collectors.map((collector, index) => {
            const { display, solanaFmUrl } = formatAddress(collector.wallet)
            
            return (
              <motion.tr 
                key={collector.wallet}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{collector.rank}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Link 
                      href={`/collectors/${collector.wallet}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {display}
                    </Link>
                    <Link
                      href={solanaFmUrl}
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
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {collector.eventCount}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {collector.totalMints}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(new Date(collector.firstAttendance), { addSuffix: true })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(new Date(collector.lastAttendance), { addSuffix: true })}
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}