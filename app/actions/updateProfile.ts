'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const username = formData.get('username') as string
  const full_name = formData.get('full_name') as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      username,
      full_name,
    })
    .eq('id', user.id)

  if (error) {
    throw error
  }

  revalidatePath('/dashboard/profile')
}