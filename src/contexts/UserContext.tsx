'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from '@/hooks/useToast'
import { POAPCollection } from '@/services/poap'
import React from 'react'

export type UserRole = 'CREATOR' | 'COLLECTOR'

interface UserProfile {
 wallet: string
 role: UserRole
 collections?: POAPCollection[]
 poaps?: string[] 
 isCreator?: boolean
}

interface UserContextValue {
 isAuthenticated: boolean
 isLoading: boolean
 user: UserProfile | null
 login: () => Promise<void>
 logout: () => Promise<void>
 refreshUserData: () => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { connected, publicKey, signMessage, disconnect } = useWallet()
  const { showToast } = useToast()
  
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)

  const login = useCallback(async () => {
    if (!connected || !publicKey || !signMessage) {
      throw new Error('Wallet not connected')
    }

    try {
      setIsLoading(true)
      
      const nonce = Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map(n => n.toString(16).padStart(2, '0'))
        .join('')
        
      const message = new TextEncoder().encode(
        `Sign this message to authenticate with POAPup\nNonce: ${nonce}\nTimestamp: ${Date.now()}`
      )

      const signature = await signMessage(message)
      const wallet = publicKey.toString()

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet,
          signature: Array.from(signature),
          nonce
        })
      })

      if (!response.ok) {
        throw new Error(await response.text() || 'Authentication failed')
      }

      const userData = await response.json()
      setUser(userData)
      localStorage.setItem(`poapup_user_${wallet}`, JSON.stringify(userData))

      showToast({
        title: 'Welcome!',
        description: 'Successfully authenticated.',
        type: 'success'
      })
    } catch (error) {
      console.error('Login error:', error)
      showToast({
        title: 'Authentication Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        type: 'error'
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [connected, publicKey, signMessage, showToast])

 const loadUser = useCallback(async () => {
   if (connected && publicKey) {
     try {
       const stored = localStorage.getItem(`poapup_user_${publicKey.toString()}`)
       if (stored) {
         setUser(JSON.parse(stored))
         return
       }
       await login()
     } catch (error) {
       console.error('Failed to load user:', error)
     } finally {
       setIsLoading(false)
     }
   } else {
     setUser(null)
     setIsLoading(false)
   }
 }, [connected, publicKey, login])

 const logout = useCallback(async () => {
   try {
     await disconnect()
     if (publicKey) {
       localStorage.removeItem(`poapup_user_${publicKey.toString()}`)
     }
     setUser(null)
   } catch (error) {
     console.error('Logout error:', error)
   }
 }, [disconnect, publicKey])

 const refreshUserData = useCallback(async () => {
   if (!user?.wallet) return

   try {
     setIsLoading(true)
     const response = await fetch(`/api/users/${user.wallet}`)
     
     if (!response.ok) {
       throw new Error('Failed to refresh user data')
     }

     const userData = await response.json()
     setUser(userData)
     localStorage.setItem(`poapup_user_${user.wallet}`, JSON.stringify(userData))
   } catch (error) {
     console.error('Failed to refresh user data:', error)
     showToast({
       title: 'Error',
       description: 'Failed to refresh user data',
       type: 'error'
     })
   } finally {
     setIsLoading(false)
   }
 }, [user?.wallet, showToast])

 const { useEffect } = React

 useEffect(() => {
   loadUser()
 }, [loadUser])

 useEffect(() => {
  const handleAuth = async () => {
    if (connected && publicKey) {
      try {
        setIsLoading(true)
        const stored = localStorage.getItem(`poapup_user_${publicKey.toString()}`)
        
        if (stored) {
          const userData = JSON.parse(stored)
          if (userData.wallet === publicKey.toString()) {
            setUser(userData)
            setIsLoading(false)
            return
          }
        }
        
        await login()
      } catch (error) {
        console.error('Failed to load user:', error)
        if (publicKey) {
          localStorage.removeItem(`poapup_user_${publicKey.toString()}`)
        }
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    } else {
      setUser(null)
      setIsLoading(false)
    }
  }

  handleAuth()
}, [connected, publicKey, login])

 return (
   <UserContext.Provider
     value={{
       isAuthenticated: !!user,
       isLoading,
       user,
       login,
       logout,
       refreshUserData
     }}
   >
     {children}
   </UserContext.Provider>
 )
}

export function useUser() {
 const context = useContext(UserContext)
 if (context === undefined) {
   throw new Error('useUser must be used within a UserProvider')
 }
 return context
}