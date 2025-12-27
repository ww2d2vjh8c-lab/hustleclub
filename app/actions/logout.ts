'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { setFlashMessage } from '@/lib/flash'

export async function logout() {
  try {
    const supabase = await createSupabaseServerClient()

    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error.message)
      throw new Error('Failed to logout. Please try again.')
    }

    // Set success flash message
    await setFlashMessage('You have been logged out', 'success')

    // Clear session and redirect to home
    redirect('/')
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.'

    console.error('logout action error:', errorMessage)

    // Still redirect even if there's an error to ensure user is logged out
    redirect('/')
  }
}
