'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@tiplink/wallet-adapter-react-ui'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { cn } from '@/utils/cn'

const navigation = {
  events: [
    { name: 'Recent Events', href: '/events/recent' },
    { name: 'Breakpoint', href: '/events/breakpoint' },
    { name: 'Hacker Houses', href: '/events/hackerhouses' },
    { name: 'Ecosystem Calls', href: '/events/ecosystem' },
  ],
  creators: [
    { name: 'Create Collection', href: '/creators/create' },
    { name: 'Learn', href: '/creators/learn' },
    { name: 'Top Creators', href: '/creators/top' },
  ],
  collectors: [
    { name: 'Rankings', href: '/collectors/rankings' },
    { name: 'My Collections', href: '/collectors/profile' },
  ],
}

function NavPopover({ title, items }: { title: string; items: { name: string; href: string }[] }) {
  const pathname = usePathname()
  
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={cn(
              'group inline-flex items-center px-3 py-2 text-sm font-medium outline-none',
              'text-gray-700 hover:text-gray-900',
              open && 'text-gray-900'
            )}
          >
            <span>{title}</span>
            <ChevronDownIcon
              className={cn(
                'ml-2 h-4 w-4 transition-transform duration-200',
                open && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-40 -translate-x-1/2 transform">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative bg-white">
                  {items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'block px-4 py-2 text-sm hover:bg-gray-50',
                        pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

function MobileMenu({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen: boolean
  setIsOpen: (value: boolean) => void 
}) {
  const pathname = usePathname()

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 -translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 -translate-y-1"
    >
      <div className="absolute inset-x-0 top-full mt-px bg-white pb-3 shadow-lg">
        <div className="space-y-3">
          {/* Events Section */}
          <div className="px-4">
            <div className="text-xs font-semibold text-gray-400">Events</div>
            <div className="mt-2 space-y-2">
              {navigation.events.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block text-sm',
                    pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Creators Section */}
          <div className="px-4">
            <div className="text-xs font-semibold text-gray-400">Creators</div>
            <div className="mt-2 space-y-2">
              {navigation.creators.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block text-sm',
                    pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Collectors Section */}
          <div className="px-4">
            <div className="text-xs font-semibold text-gray-400">Collectors</div>
            <div className="mt-2 space-y-2">
              {navigation.collectors.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block text-sm',
                    pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Docs Link */}
          <div className="px-4">
            <Link
              href="/docs"
              className="block text-sm text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Docs
            </Link>
          </div>
        </div>
      </div>
    </Transition>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { connected } = useWallet()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">POAPup</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:gap-2">
            <NavPopover title="Events" items={navigation.events} />
            <NavPopover title="Creators" items={navigation.creators} />
            <NavPopover title="Collectors" items={navigation.collectors} />
            <Link
              href="/docs"
              className={cn(
                'inline-flex items-center px-3 py-2 text-sm font-medium',
                'text-gray-700 hover:text-gray-900',
                pathname === '/docs' && 'text-blue-600'
              )}
            >
              Docs
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Wallet Button */}
          <WalletMultiButton />

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle main menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
    </header>
  )
}