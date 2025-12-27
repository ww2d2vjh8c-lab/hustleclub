"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function toggleCoursePublish(formData: FormData) {
  const courseId = formData.get("courseId") as string
  const nextState = formData.get("nextState") === "true"

  if (!courseId) {
    throw new Error("Missing courseId")
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("courses")
    .update({ is_published: nextState })
    .eq("id", courseId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/courses")
}