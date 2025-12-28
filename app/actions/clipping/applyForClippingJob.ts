"use server";

import { createSupabaseServerClient } from "../../../lib/supabase-server";
import { requireRole } from "../../../lib/requireRole";

export async function applyForClippingJob(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { id: userId } = await requireRole(["user", "creator", "admin"]);

  const jobId = formData.get("jobId") as string;

  await supabase.from("clipping_applications").insert({
    job_id: jobId,
    user_id: userId,
  });
}