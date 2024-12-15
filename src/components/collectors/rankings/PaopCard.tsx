// src/components/collectors/rankings/PoapCard.tsx
'use client'

import { UsersIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { formatPoapCount } from '@/utils/address'

interface PoapCardProps {
  poap: {
    id: string
    name: string
    description: string
    image: string
    collectors: number
  }
}

export function PoapCard({ poap }: PoapCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-shadow hover:shadow-md"
    >
      {/* POAP Image */}
      <div className="aspect-square">
        <img
          src={poap.image}
          alt={poap.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute inset-x-0 bottom-0 p-4">
          {/* POAP Name */}
          <h3 className="text-white font-medium text-sm line-clamp-2">
            {poap.name}
          </h3>

          {/* Collectors Count */}
          <div className="mt-2 flex items-center space-x-1 text-white/80">
            <UsersIcon className="h-4 w-4" />
            <span className="text-xs">
              {formatPoapCount(poap.collectors)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats - Visible on Mobile */}
      <div className="md:hidden p-3 border-t border-gray-200">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
          {poap.name}
        </h3>
        <div className="mt-1 flex items-center space-x-1 text-gray-500">
          <UsersIcon className="h-4 w-4" />
          <span className="text-xs">
            {formatPoapCount(poap.collectors)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}