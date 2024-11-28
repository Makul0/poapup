// src/hooks/useCreatePOAP.ts
import { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { poapService, POAPMetadata } from '@/services/poap'
import { useToast } from '@/hooks/useToast'
import { useUser } from '@/contexts/UserContext'

export function useCreatePOAP() {
  const { publicKey } = useWallet()
  const { showToast } = useToast()
  const { refreshUserData } = useUser()
  const [isCreating, setIsCreating] = useState(false)

  const createPOAP = useCallback(async (metadata: POAPMetadata) => {
    if (!publicKey) {
      showToast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to create a POAP collection',
        type: 'error'
      })
      return
    }

    setIsCreating(true)
    try {
      // Create the POAP collection
      const merkleTree = await poapService.createPOAPCollection(metadata)

      // Save to backend
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: metadata.title,
          description: metadata.description,
          merkleTree,
          startDate: metadata.startDate,
          endDate: metadata.endDate,
          eventType: metadata.eventType,
          maxAttendees: metadata.maxAttendees,
          isPublic: metadata.isPublic,
          creator: publicKey.toString()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save collection')
      }

      showToast({
        title: 'Success!',
        description: 'POAP collection created successfully',
        type: 'success'
      })

      await refreshUserData()
      return merkleTree

    } catch (error: Error | unknown) {
      console.error('Error creating POAP:', error)
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create POAP collection',
        type: 'error'
      })
      throw error
    } finally {
      setIsCreating(false)
    }
  }, [publicKey, showToast, refreshUserData])

  const validateMetadata = (metadata: POAPMetadata): string | null => {
    if (!metadata.image) return 'Image is required'
    if (metadata.image.size > 200 * 1024) return 'Image must be less than 200KB'
    if (!metadata.title.trim()) return 'Title is required'
    if (!metadata.description.trim()) return 'Description is required'
    if (metadata.startDate >= metadata.endDate) return 'End date must be after start date'
    if (metadata.maxAttendees < 1) return 'Maximum attendees must be at least 1'
    return null
  }

  return {
    createPOAP,
    validateMetadata,
    isCreating
  }
}