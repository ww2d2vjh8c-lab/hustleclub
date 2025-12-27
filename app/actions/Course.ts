"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function enrollCourse(courseId: string) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  await supabase.from("course_enrollments").insert({
    course_id: courseId,
    user_id: user.id,
  })

  revalidatePath("/dashboard/courses")
}