'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from './LogoutButton'

interface NavigationProps {
  session: boolean
}

export function Navigation({ session }: NavigationProps) {
  const pathname = usePathname()

  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/clipping', label: 'Clipping' },
    { href: '/thrift', label: 'Thrift' },
    { href: '/news', label: 'News' },
  ]

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              HustleClub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Section */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation (simplified for now) */}
          <div className="md:hidden flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
