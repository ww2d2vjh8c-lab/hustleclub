"use server";

import { createSupabaseServerClient } from "../../../lib/supabase-server";
import { requireRole } from "../../../lib/requireRole";
import { revalidatePath } from "next/cache";

export async function updateApplicationStatus(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  await requireRole(["creator", "admin"]);

  const appId = formData.get("appId") as string;
  const status = formData.get("status") as string;

  await supabase
    .from("clipping_applications")
    .update({ status })
    .eq("id", appId);

  revalidatePath("/dashboard/clipping");
}