// src/components/rankings/RankingsClientWrapper.tsx
'use client'

import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { ErrorFallback } from '@/components/errors/ErrorFallback'

export const RankingsClientWrapper = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      {children}
    </ErrorBoundary>
  )
}