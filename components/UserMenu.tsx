import Link from 'next/link'
import { getOptionalUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { LogoutButton } from './LogoutButton'

/**
 * UserMenu Component
 *
 * Server Component that displays:
 * - User email
 * - Link to profile page
 * - Logout button
 *
 * Only renders when user is authenticated.
 * All data fetching happens on the server.
 */
export async function UserMenu() {
  // Get current user (server-side)
  const user = await getOptionalUser()

  // If no user, don't render anything
  if (!user) {
    return null
  }

  // Fetch user's profile for display name
  const supabase = await createSupabaseServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name')
    .eq('id', user.id)
    .single()

  const displayName = profile?.full_name || profile?.username || user.email

  return (
    <div className="flex items-center gap-4">
      {/* User Info */}
      <div className="hidden sm:flex flex-col items-end">
        <p className="text-sm font-medium text-gray-900">{displayName}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>

      {/* Profile Link */}
      <Link
        href="/dashboard/profile"
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title="View profile"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </Link>

      {/* Logout Button */}
      <LogoutButton />
    </div>
  )
}
