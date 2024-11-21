'use client'

//import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@tiplink/wallet-adapter-react-ui'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

// Navigation items
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  { name: 'Rankings', href: '/collectors/rankings' },
  { name: 'Docs', href: '/docs' },
]

const walletNavigation = [
  { name: 'My Collections', href: '/collectors/profile' },
  { name: 'Create POAP', href: '/creators/create' },
]

export function Header() {
  const pathname = usePathname()
  const { connected } = useWallet()

  // Combine navigation based on wallet connection
  const allNavigation = [...navigation, ...(connected ? walletNavigation : [])]

  return (
    <Disclosure as="nav" className="bg-white shadow dark:bg-gray-900">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              {/* Desktop navigation */}
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link 
                    href="/"
                    className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
                  >
                    POAPup
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {allNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'inline-flex items-center px-1 pt-1 text-sm font-medium',
                          isActive
                            ? 'border-b-2 border-indigo-500 text-gray-900 dark:text-white'
                            : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Right side actions */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <WalletMultiButton />
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:hover:bg-gray-800">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {allNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={cn(
                      'block py-2 pl-3 pr-4 text-base font-medium',
                      isActive
                        ? 'border-l-4 border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'border-l-4 border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                )
              })}
              <div className="px-4 py-3">
                <WalletMultiButton />
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}