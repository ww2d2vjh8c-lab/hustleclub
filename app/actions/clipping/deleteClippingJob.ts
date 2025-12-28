"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/requireRole";

export async function deleteClippingJob(id: string) {
  const supabase = await createSupabaseServerClient();
  const user = await requireRole(["admin", "creator"]);

  await supabase.from("clipping_jobs")
    .delete()
    .eq("id", id)
    .eq("created_by", user.id);

  revalidatePath("/dashboard/clipping");
}