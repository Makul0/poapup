// src/components/collectors/rankings/PoapCard.tsx
'use client'

import Image from 'next/image'
import { UsersIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { formatCollectorCount } from '@/utils/address'

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
      className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
      whileHover={{ y: -2 }}
    >
      {/* POAP Image with Next.js Image component */}
      <div className="aspect-square relative">
        <Image
          src={poap.image}
          alt={poap.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJx8mOzYzODY2MTk2PUFBPj0+PS42RUFGSkpKXF1eXUFBQUFBQUFBQUH/2wBDARUXFyAeIB4kHh4kQjY+NkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white truncate mb-2">
            {poap.name}
          </h3>
          <div className="flex items-center text-white/90">
            <UsersIcon className="w-5 h-5 mr-1" />
            <span>{formatCollectorCount(poap.collectors)}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats for Mobile */}
      <div className="md:hidden p-4 border-t border-gray-100">
        <h3 className="font-medium text-gray-900 truncate mb-1">
          {poap.name}
        </h3>
        <div className="flex items-center text-gray-500">
          <UsersIcon className="w-4 h-4 mr-1" />
          <span>{formatCollectorCount(poap.collectors)}</span>
        </div>
      </div>
    </motion.div>
  )
}