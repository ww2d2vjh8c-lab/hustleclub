"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function deleteCourse(formData: FormData) {
  const courseId = formData.get("courseId") as string

  if (!courseId) {
    throw new Error("Course ID missing")
  }

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId)
    .eq("user_id", user.id)

  if (error) {
    throw error
  }
}