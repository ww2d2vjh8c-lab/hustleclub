"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { requireUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function deleteItem(formData: FormData) {
  const itemId = formData.get("id") as string
  if (!itemId) return

  const user = await requireUser()
  const supabase = await createSupabaseServerClient()

  // ✅ only delete if item belongs to user
  const { error } = await supabase
    .from("thrift_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Delete failed:", error)
    throw new Error("Failed to delete item")
  }

  // refresh thrifting pages
  revalidatePath("/dashboard/thrifting")
  revalidatePath("/dashboard/thrifting/my")
}