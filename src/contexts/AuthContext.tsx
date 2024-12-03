// src/contexts/AuthContext.tsx
'use client'

import { 
  createContext, 
  useContext, 
  useCallback, 
  useState, 
  useEffect,
  type ReactNode 
} from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from '@/hooks/useToast'

// Define the shape of our authentication state
interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  sessionKey?: string
  wallet?: string
  error?: string
}

// Define the shape of our context
interface AuthContextType extends AuthState {
  login: () => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Get wallet utilities from Solana wallet adapter
  const { publicKey, signMessage, disconnect } = useWallet()
  const { showToast } = useToast()

  // Initialize state
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  })

  // Function to create authentication message
  const createAuthMessage = useCallback(() => {
    const nonce = Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map(n => n.toString(16).padStart(2, '0'))
      .join('')
    
    return {
      message: new TextEncoder().encode(
        `Sign this message to authenticate with POAPup\nNonce: ${nonce}\nTimestamp: ${Date.now()}`
      ),
      nonce
    }
  }, [])

  // Login function
  const login = useCallback(async () => {
    if (!publicKey || !signMessage) {
      showToast({
        title: 'Wallet Required',
        description: 'Please connect your wallet first',
        type: 'error'
      })
      return
    }

    try {
      setState(s => ({ ...s, isLoading: true, error: undefined }))
      
      const { message, nonce } = createAuthMessage()
      const signature = await signMessage(message)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: publicKey.toString(),
          signature: Array.from(signature),
          nonce
        })
      })

      if (!response.ok) {
        throw new Error(await response.text() || 'Authentication failed')
      }

      const { sessionKey } = await response.json()

      setState({
        isAuthenticated: true,
        isLoading: false,
        sessionKey,
        wallet: publicKey.toString()
      })

      // Store session info
      localStorage.setItem('poapup_session', JSON.stringify({
        sessionKey,
        wallet: publicKey.toString()
      }))

      showToast({
        title: 'Welcome!',
        description: 'Successfully authenticated',
        type: 'success'
      })
    } catch (error) {
      console.error('Login error:', error)
      setState(s => ({ 
        ...s, 
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      }))

      showToast({
        title: 'Authentication Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        type: 'error'
      })
    }
  }, [publicKey, signMessage, createAuthMessage, showToast])

  // Logout function
  const logout = useCallback(async () => {
    try {
      setState(s => ({ ...s, isLoading: true }))
      
      await disconnect()
      localStorage.removeItem('poapup_session')
      
      setState({
        isAuthenticated: false,
        isLoading: false
      })

      showToast({
        title: 'Logged Out',
        description: 'Successfully logged out',
        type: 'success'
      })
    } catch (error) {
      console.error('Logout error:', error)
      setState(s => ({ 
        ...s,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      }))
    }
  }, [disconnect, showToast])

  // Function to refresh the session
  const refreshSession = useCallback(async () => {
    try {
      setState(s => ({ ...s, isLoading: true }))
      
      const stored = localStorage.getItem('poapup_session')
      if (!stored || !publicKey) {
        setState({
          isAuthenticated: false,
          isLoading: false
        })
        return
      }

      const { sessionKey, wallet } = JSON.parse(stored)
      
      // Verify the session is still valid
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${sessionKey}`
        }
      })

      if (!response.ok) {
        throw new Error('Session expired')
      }

      setState({
        isAuthenticated: true,
        isLoading: false,
        sessionKey,
        wallet
      })
    } catch (error) {
      console.error('Session refresh error:', error)
      localStorage.removeItem('poapup_session')
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Session refresh failed'
      })
    }
  }, [publicKey])

  // Check authentication status on mount and wallet changes
  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  // Expose the auth context
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}