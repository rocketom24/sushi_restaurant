// lib/loyalty/points.ts
//
// Loyalty point engine. Every point movement goes through a
// LoyaltyTransaction ledger entry — balances are never mutated without
// a matching transaction, so the account always has a full audit trail.

import type { Prisma, PrismaClient } from "@/app/generated/prisma/client";

/**
 * Points earned per euro spent. Configurable in one place so the
 * conversion ratio can change without touching business logic.
 */
export const POINTS_PER_EURO = 1;

/** Points earned for a given order total (post-discount amount actually paid). */
export function calculatePoints(amountPaid: number): number {
  if (amountPaid <= 0) return 0;
  return Math.floor(amountPaid * POINTS_PER_EURO);
}

type Tx = Prisma.TransactionClient | PrismaClient;

/** Returns the customer's loyalty account, creating it lazily on first use. */
export async function getOrCreateLoyaltyAccount(tx: Tx, userId: string) {
  const existing = await tx.loyaltyAccount.findUnique({ where: { userId } });
  if (existing) return existing;
  return tx.loyaltyAccount.create({ data: { userId } });
}

/**
 * Awards points for a completed order. Idempotent: if an EARNED entry
 * already exists for this order, it does nothing (guards against a
 * status flip being processed twice). Must run inside a transaction.
 */
export async function awardPointsForOrder(
  tx: Tx,
  params: { userId: string; orderId: string; amountPaid: number }
): Promise<number> {
  const { userId, orderId, amountPaid } = params;

  const already = await tx.loyaltyTransaction.findFirst({
    where: { orderId, type: "EARNED" },
  });
  if (already) return 0;

  const points = calculatePoints(amountPaid);
  if (points <= 0) return 0;

  const account = await getOrCreateLoyaltyAccount(tx, userId);

  await tx.loyaltyTransaction.create({
    data: {
      loyaltyAccountId: account.id,
      orderId,
      type: "EARNED",
      points,
      description: `Earned from order`,
    },
  });

  await tx.loyaltyAccount.update({
    where: { id: account.id },
    data: { pointsBalance: { increment: points } },
  });

  return points;
}

/**
 * Reverses points previously earned from an order (e.g. on refund).
 * Records an ADJUSTED ledger entry with negative points and never
 * lets the balance drop below zero. Idempotent per order.
 */
export async function reversePointsForOrder(
  tx: Tx,
  orderId: string
): Promise<number> {
  const earned = await tx.loyaltyTransaction.findFirst({
    where: { orderId, type: "EARNED" },
  });
  if (!earned) return 0;

  const alreadyReversed = await tx.loyaltyTransaction.findFirst({
    where: { orderId, type: "ADJUSTED", points: { lt: 0 } },
  });
  if (alreadyReversed) return 0;

  const account = await tx.loyaltyAccount.findUnique({
    where: { id: earned.loyaltyAccountId },
  });
  if (!account) return 0;

  // Never reverse more than the customer currently holds.
  const reversal = Math.min(earned.points, account.pointsBalance);
  if (reversal <= 0) return 0;

  await tx.loyaltyTransaction.create({
    data: {
      loyaltyAccountId: account.id,
      orderId,
      type: "ADJUSTED",
      points: -reversal,
      description: "Reversed — order refunded",
    },
  });

  await tx.loyaltyAccount.update({
    where: { id: account.id },
    data: { pointsBalance: { decrement: reversal } },
  });

  return reversal;
}

/** Sum of all positive EARNED points ever — the customer's lifetime total. */
export async function getLifetimePoints(
  tx: Tx,
  loyaltyAccountId: string
): Promise<number> {
  const result = await tx.loyaltyTransaction.aggregate({
    where: { loyaltyAccountId, type: "EARNED" },
    _sum: { points: true },
  });
  return result._sum.points ?? 0;
}
