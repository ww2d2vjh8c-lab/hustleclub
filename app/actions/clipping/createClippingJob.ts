"use server";

import { createSupabaseServerClient } from "../../../lib/supabase-server";
import { requireRole } from "../../../lib/requireRole";
import { revalidatePath } from "next/cache";

export async function createClippingJob(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { id: userId } = await requireRole(["creator", "admin"]);

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const platform = formData.get("platform") as string;
  const reward = Number(formData.get("reward"));

  await supabase.from("clipping_jobs").insert({
    title,
    description,
    platform,
    reward,
    status: "open",
    created_by: userId,
  });

  revalidatePath("/dashboard/clipping");
}