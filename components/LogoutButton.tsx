'use client'

import { logout } from '@/app/actions/logout'

export function LogoutButton() {
  return (
    <form action={logout} className="inline">
      <button
        type="submit"
        className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
      >
        Sign out
      </button>
    </form>
  )
}
