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

  // Function to format file size in a readable way
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    const file = acceptedFiles[0]

    if (!file) return

    // Validate file type - now including GIF
    if (!file.type.match(/^image\/(jpeg|png|gif|jpg)$/)) {
      setError('Please upload a valid image file (JPG, PNG, or GIF)')
      return
    }

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      setError(`Image must be less than ${formatFileSize(maxSize)}. Current size: ${formatFileSize(file.size)}`)
      return
    }

    // Create preview and process the image
    const objectUrl = URL.createObjectURL(file)
    
    if (file.type === 'image/gif') {
      // For GIFs, we don't check dimensions since they might be animated
      setImagePreview(objectUrl)
      onImageUpload(file)
    } else {
      // For static images, we still show a preview
      const img = new window.Image()
      img.src = objectUrl
      img.onload = () => {
        // Store dimensions for display
        const dimensions = `${img.width}x${img.height}px`
        setImagePreview(objectUrl)
        onImageUpload(file)
      }
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif']
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024 // 2MB in bytes
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
            <div className="relative w-48 h-48 mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setImagePreview(null)
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 
                           hover:bg-red-600 transition-colors shadow-md"
                aria-label="Remove image"
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
              <div className="flex flex-col gap-1 items-center text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload an image</span>
                </label>
                <p className="text-gray-500">or drag and drop</p>
                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF (up to 2MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}