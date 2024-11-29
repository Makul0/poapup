'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const defaultToastContext: ToastContextType = {
  showToast: () => {
    if (typeof window !== 'undefined') {
      console.warn('Toast was triggered before provider was ready')
    }
  }
}

const ToastContext = createContext<ToastContextType>(defaultToastContext)

function getToastColor(type: ToastType) {
  switch (type) {
    case 'success':
      return 'bg-green-50';
    case 'error':
      return 'bg-red-50';
    case 'info':
      return 'bg-blue-50';
  }
}

function getToastIcon(type: ToastType) {
  const className = 'h-6 w-6';
  switch (type) {
    case 'success':
      return <CheckCircleIcon className={`${className} text-green-400`} />;
    case 'error':
      return <XCircleIcon className={`${className} text-red-400`} />;
    case 'info':
      return <InformationCircleIcon className={`${className} text-blue-400`} />;
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    if (!mounted) return

    const id = Date.now()
    setToasts(prev => [...prev, { ...toast, id }])

    const timeoutId = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)

    return () => clearTimeout(timeoutId)
  }, [mounted])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
        <AnimatePresence mode="sync">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.2,
                ease: 'easeInOut'
              }}
              className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full"
            >
              <div className={`p-4 ${getToastColor(toast.type)}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getToastIcon(toast.type)}
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {toast.title}
                    </p>
                    {toast.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {toast.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        setToasts(prev => prev.filter(t => t.id !== toast.id))
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  return context
}