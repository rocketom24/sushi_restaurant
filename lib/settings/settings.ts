// lib/settings/settings.ts
//
// Server-only restaurant settings access. Pure types/helpers live in
// lib/settings/operating-hours.ts (no prisma import, safe for Client
// Components); this file adds the DB-touching singleton getter and
// re-exports the pure helpers for convenience in server code.

import { prisma } from "@/lib/prisma";
import type { Prisma, PrismaClient } from "@/app/generated/prisma/client";
import { defaultOperatingHours } from "./operating-hours";

export * from "./operating-hours";

type Tx = Prisma.TransactionClient | PrismaClient;

/**
 * Returns the restaurant's settings row, creating it with defaults on
 * first access. Safe to call from any server context (public pages,
 * checkout, reservations) — none of these fields are secret.
 */
export async function getRestaurantSettings(tx: Tx = prisma) {
  const existing = await tx.restaurantSettings.findFirst();
  if (existing) return existing;

  return tx.restaurantSettings.create({
    data: { operatingHours: defaultOperatingHours() as object },
  });
}
