import { getUserWithRole } from "./getUserWithRole";

export async function requireRole(allowed: string[]) {
  const user = await getUserWithRole();

  if (!user) throw new Error("Not authenticated");
  if (!allowed.includes(user.role)) throw new Error("Not authorized");

  return { id: user.id, role: user.role };
}