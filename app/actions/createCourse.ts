"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function createCourse(formData: FormData) {
const supabase = await createSupabaseServerClient()
const title = formData.get("title") as string
const description = formData.get("description") as string
const price = Number(formData.get("price"))
  
  if (!title) {
    throw new Error("Title is required")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase
  .from("courses")
  .insert({
    user_id: user.id,
    title,
    description,
    price,
  })

if (error) {
  throw error
}
}