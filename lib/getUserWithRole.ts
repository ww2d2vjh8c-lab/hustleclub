import { createSupabaseServerClient } from "./supabase-server";

export async function getUserWithRole() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { id: user.id, email: user.email, role: profile?.role ?? "user" };
}