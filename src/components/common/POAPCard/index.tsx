'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, UsersIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { POAPCollection } from '@/services/poap'
import dayjs from 'dayjs'
import { useMintPOAP } from '@/hooks/useMintPOAP'
import { useUser } from '@/contexts/UserContext'

interface POAPCardProps {
  collection: POAPCollection
  showActions?: boolean
  className?: string
}

export function POAPCard({ collection, showActions = true, className = '' }: POAPCardProps) {
  const { mintPOAP, isMinting } = useMintPOAP()
  const { user } = useUser()
  
  const isActive = dayjs().isAfter(collection.startDate) && dayjs().isBefore(collection.endDate)
  const hasEnded = dayjs().isAfter(collection.endDate)
  const isUpcoming = dayjs().isBefore(collection.startDate)
  const spotsLeft = collection.maxAttendees - collection.mintedCount
  const isCreator = user?.wallet === collection.creator

  const handleMint = async () => {
    try {
      await mintPOAP(collection.merkleTree, {
        name: collection.title,
        uri: collection.imageUrl
      })
    } catch (error) {
      console.error('Error minting POAP:', error)
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="relative h-48">
        <Image
          src={collection.imageUrl}
          alt={collection.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${isActive ? 'bg-green-100 text-green-800' : ''}
            ${hasEnded ? 'bg-gray-100 text-gray-800' : ''}
            ${isUpcoming ? 'bg-yellow-100 text-yellow-800' : ''}
          `}>
            {isActive ? 'Active' : hasEnded ? 'Ended' : 'Upcoming'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">
            {collection.title}
          </h3>
          {isCreator && (
            <span className="text-xs text-gray-500">Creator</span>
          )}
        </div>
        
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {collection.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>
              {dayjs(collection.startDate).format('MMM D, YYYY h:mm A')}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            {collection.eventType === 'VIRTUAL' ? (
              <GlobeAltIcon className="h-5 w-5 mr-2" />
            ) : (
              <MapPinIcon className="h-5 w-5 mr-2" />
            )}
            <span>{collection.eventType}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <UsersIcon className="h-5 w-5 mr-2" />
            <span>
              {collection.mintedCount} / {collection.maxAttendees} claimed
              {spotsLeft > 0 && ` (${spotsLeft} left)`}
            </span>
          </div>
        </div>

        {showActions && (
          <div className="mt-4 flex gap-2 justify-end">
            {isCreator && (
              <Link
                href={`/collections/${collection.id}/manage`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Manage
              </Link>
            )}
            
            {isActive && !isCreator && spotsLeft > 0 && (
              <button
                onClick={handleMint}
                disabled={isMinting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMinting ? 'Minting...' : 'Claim POAP'}
              </button>
            )}
            
            <Link
              href={`/collections/${collection.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}