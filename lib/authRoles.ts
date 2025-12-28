import { getUserWithRole } from "./getUserWithRole";

export async function requireUser() {
  const user = await getUserWithRole();
  if (!user) throw new Error("Not authenticated");
  return user;
}

export async function requireCreator() {
  const user = await requireUser();
  if (user.role !== "creator" && user.role !== "admin") {
    throw new Error("Creator access only");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("Admin only");
  return user;
}

export async function requireOwner(userId: string, recordOwnerId: string) {
  if (userId !== recordOwnerId) {
    throw new Error("You do not own this resource");
  }
}