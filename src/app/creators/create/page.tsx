// src/app/creators/create/page.tsx
'use client'

import { useCreatePOAP } from '@/hooks/useCreatePOAP'
import { ImageUploader } from './image-uploader'
import { DateTimeRangePicker } from './datetime-range-picker'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { POAPMetadata } from '@/services/poap'
import { useUser } from '@/contexts/UserContext'

export default function CreateCollectionPage() {
  const router = useRouter()
  const { user } = useUser()
  const { createPOAP, validateMetadata, isCreating } = useCreatePOAP()

  const [formData, setFormData] = useState<POAPMetadata>({
    title: '',
    description: '',
    url: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    eventType: 'VIRTUAL',
    maxAttendees: 100,
    isPublic: true,
    image: null as unknown as File,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = validateMetadata(formData)
    if (error) {
      alert(error)
      return
    }

    try {
      const merkleTree = await createPOAP(formData)
      router.push(`/collections/${merkleTree}`)
    } catch (error) {
      console.error('Error creating POAP:', error)
    }
  }

  if (!user?.wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Wallet</h1>
          <p className="text-gray-600">Please connect your wallet to create POAPs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Create POAP Collection</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            POAP Image
            <span className="text-xs text-gray-500 ml-2">
              (500x500px, max 200KB)
            </span>
          </label>
          <ImageUploader
            onImageUpload={(file) => setFormData(prev => ({ ...prev, image: file }))}
            currentImage={formData.image}
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            maxLength={50}
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            required
            maxLength={200}
            rows={4}
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Event URL
          </label>
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Time *
          </label>
          <DateTimeRangePicker
            startDate={formData.startDate}
            endDate={formData.endDate}
            onStartDateChange={date => setFormData(prev => ({ ...prev, startDate: date }))}
            onEndDateChange={date => setFormData(prev => ({ ...prev, endDate: date }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Type *
          </label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={formData.eventType === 'VIRTUAL'}
                onChange={() => setFormData(prev => ({ ...prev, eventType: 'VIRTUAL' }))}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Virtual</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={formData.eventType === 'IRL'}
                onChange={() => setFormData(prev => ({ ...prev, eventType: 'IRL' }))}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">In Person</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">
            Maximum Attendees *
          </label>
          <input
            type="number"
            id="maxAttendees"
            min="1"
            max="16384"
            required
            value={formData.maxAttendees}
            onChange={e => setFormData(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Collection Visibility
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={e => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Make this collection public</span>
            </label>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isCreating}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create Collection'}
          </button>
        </div>
      </form>
    </div>
  )
}