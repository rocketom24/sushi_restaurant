import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export class UnauthenticatedError extends Error {}
export class ForbiddenError extends Error {}

/** Returns the logged-in user's profile, or null if not authenticated. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return prisma.user.findUnique({
    where: { id: user.id, deletedAt: null },
  });
}

/** Throws if not authenticated. Use inside API routes / Server Actions. */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new UnauthenticatedError("Not authenticated");
  return user;
}

/** Throws if not an OWNER. Use inside API routes / Server Actions. */
export async function requireOwner() {
  const user = await requireAuth();
  if (user.role !== "OWNER") {
    throw new ForbiddenError("Owner access required");
  }
  return user;
}

/** For Server Components / pages — redirects instead of throwing. */
export async function requireAuthPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** For Owner-only Server Components / pages — redirects instead of throwing. */
export async function requireOwnerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "OWNER") redirect("/");
  return user;
}