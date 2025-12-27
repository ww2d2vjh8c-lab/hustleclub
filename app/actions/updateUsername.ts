"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function updateUsername(formData: FormData) {
  const username = formData.get("username") as string;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  await supabase
    .from("profiles")
    .update({ username })
    .eq("id", user.id);

  revalidatePath("/dashboard/profile");
}
