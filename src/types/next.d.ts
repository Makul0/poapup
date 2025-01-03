// src/types/next.d.ts
import type { NextPage } from 'next'

declare module 'next' {
  export interface PageProps {
    params: Record<string, string | string[]>
    searchParams: Record<string, string | string[] | undefined>
  }
}

// If you need the NextPageWithParams type, update it like this:
export type NextPageWithParams<P = {}> = NextPage<P & PageProps>