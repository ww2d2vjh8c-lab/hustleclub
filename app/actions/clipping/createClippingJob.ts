"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { getUserWithRole } from "@/lib/getUserWithRole";

export async function createClippingJob(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const userData = await getUserWithRole();

  const isCreator =
    userData?.role === "creator" || userData?.role === "admin";

  if (!isCreator) {
    throw new Error("Not authorized to publish jobs");
  }

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
    created_by: userData?.user.id,
  });
}