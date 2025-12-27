"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function markSold(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const id = formData.get("id") as string

  await supabase
    .from("thrift_items")
    .update({ is_sold: true })
    .eq("id", id)

  revalidatePath("/dashboard/thrifting/my")
}