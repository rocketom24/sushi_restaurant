import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { User as PrismaUser } from "@/app/generated/prisma/client";
// lib/guards.ts — wrap getCurrentUser with React cache
import { cache } from "react";

export class UnauthenticatedError extends Error {
  constructor(message = "Not authenticated") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Returns the logged-in user's profile, or null if not authenticated,
 * the profile can't be found, or the account was soft-deleted.
 *
 * Never trusts Supabase session/user metadata for role decisions —
 * always re-reads the role fresh from Prisma (public.users), per the
 * project's authorization principle: "The application must never
 * trust Supabase metadata for authorization."
 */
export const getCurrentUser = cache(async (): Promise<PrismaUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.user.findUnique({
    where: { id: user.id, deletedAt: null },
  });

  if (!profile) {
    await supabase.auth.signOut();
    return null;
  }

  return profile;
});

// =======================================================
// API ROUTE / SERVER ACTION GUARDS — throw, caller catches
// =======================================================

/** Throws UnauthenticatedError if not logged in. */
export async function requireAuth(): Promise<PrismaUser> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthenticatedError();
  return user;
}

/** Throws if not logged in, or ForbiddenError if not OWNER. */
export async function requireOwner(): Promise<PrismaUser> {
  const user = await requireAuth();
  if (user.role !== "OWNER") throw new ForbiddenError("Owner access required");
  return user;
}

/** Throws if not logged in, or ForbiddenError if not CUSTOMER. */
export async function requireCustomer(): Promise<PrismaUser> {
  const user = await requireAuth();
  if (user.role !== "CUSTOMER") throw new ForbiddenError("Customer access required");
  return user;
}

/** Converts guard errors into the correct HTTP response. Use in a catch block. */
export function handleGuardError(err: unknown): NextResponse {
  if (err instanceof UnauthenticatedError) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
  if (err instanceof ForbiddenError) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
  console.error("Unhandled error in protected route:", err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

// =======================================================
// PAGE / LAYOUT GUARDS — redirect, no try/catch needed
// =======================================================

/** For any authenticated Server Component/page. Redirects to /login if not logged in. */
export async function requireAuthPage(): Promise<PrismaUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** For Owner-only pages. Redirects to /login (guest) or /unauthorized (wrong role). */
export async function requireOwnerPage(): Promise<PrismaUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "OWNER") redirect("/unauthorized");
  return user;
}

/** For Customer-only pages. Redirects to /login (guest) or /unauthorized (wrong role). */
export async function requireCustomerPage(): Promise<PrismaUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "CUSTOMER") redirect("/unauthorized");
  return user;
}

/**
 * For guest-only pages (login, register). If already authenticated,
 * redirects away based on role instead of showing the auth form again.
 * Mirrors the exact redirect targets used by loginAction.
 */
export async function requireGuest(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  if (user.role === "OWNER") redirect("/dashboard");
  redirect("/");
}







