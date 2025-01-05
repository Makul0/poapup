// src/components/errors/ErrorFallback.tsx
'use client'

import React from 'react'

interface ErrorFallbackProps {
  error: Error
}

export const ErrorFallback = ({ error }: ErrorFallbackProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-red-800 text-lg font-semibold">
          Error Loading Rankings
        </h2>
        <p className="mt-2 text-red-600">
          {error.message || 'An unexpected error occurred'}
        </p>
      </div>
    </div>
  )
}