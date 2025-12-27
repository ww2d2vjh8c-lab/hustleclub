"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function applyForClippingJob(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const jobId = formData.get("jobId") as string

  await supabase.from("clipping_applications").insert({
    job_id: jobId,
  })

  revalidatePath("/dashboard/clipping")
}