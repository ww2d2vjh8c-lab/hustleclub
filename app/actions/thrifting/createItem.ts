"use server"

 import { createSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function createItem(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = Number(formData.get("price"))

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  await supabase.from("thrift_items").insert({
    title,
    description,
    price,
    user_id: user.id,
  })

  revalidatePath("/dashboard/thrifting")
}