'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

interface ImageUploaderProps {
  onImageUpload: (file: File) => void
  currentImage?: File
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    const file = acceptedFiles[0]

    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (200KB)
    if (file.size > 200 * 1024) {
      setError('Image must be less than 200KB')
      return
    }
    // Create image object to validate dimensions
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)
    
    img.src = objectUrl
    img.onload = () => {
      // Check dimensions
      if (img.width !== 500 || img.height !== 500) {
        setError('Image must be 500x500 pixels')
        URL.revokeObjectURL(objectUrl)
        return
      }

      setImagePreview(objectUrl)
      onImageUpload(file)
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif']
    },
    maxFiles: 1
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md 
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${error ? 'border-red-300' : ''}
          hover:border-gray-400 transition-colors cursor-pointer`}
      >
        <div className="space-y-1 text-center">
          <input {...getInputProps()} />
          
          {imagePreview ? (
            <div className="relative w-32 h-32 mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setImagePreview(null)
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload an image</span>
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">500x500px, PNG or JPG up to 200KB</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}