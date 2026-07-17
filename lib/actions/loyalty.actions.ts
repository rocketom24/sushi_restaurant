// lib/actions/loyalty.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireOwner } from "@/lib/guards";
import { getOrCreateLoyaltyAccount, getLifetimePoints } from "@/lib/loyalty/points";

// ============ CUSTOMER ============

/** Current balance + lifetime points for the logged-in customer. */
export async function getMyLoyaltySummary() {
  const user = await requireAuth();

  const account = await getOrCreateLoyaltyAccount(prisma, user.id);
  const lifetimePoints = await getLifetimePoints(prisma, account.id);

  return {
    pointsBalance: account.pointsBalance,
    lifetimePoints,
  };
}

/** Point ledger history (most recent first) for the logged-in customer. */
export async function getMyLoyaltyHistory(limit = 50) {
  const user = await requireAuth();

  const account = await prisma.loyaltyAccount.findUnique({
    where: { userId: user.id },
  });
  if (!account) return [];

  const transactions = await prisma.loyaltyTransaction.findMany({
    where: { loyaltyAccountId: account.id },
    include: { order: { select: { orderNumber: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return transactions.map((t) => ({
    id: t.id,
    type: t.type,
    points: t.points,
    description: t.description,
    orderNumber: t.order?.orderNumber ?? null,
    createdAt: t.createdAt,
  }));
}

/** Coupon redemptions made by the logged-in customer. */
export async function getMyCouponHistory() {
  const user = await requireAuth();

  const redemptions = await prisma.couponRedemption.findMany({
    where: { userId: user.id },
    include: {
      coupon: { select: { code: true } },
      order: { select: { orderNumber: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return redemptions.map((r) => ({
    id: r.id,
    code: r.coupon.code,
    orderNumber: r.order.orderNumber,
    discountAmount: Number(r.discountAmount),
    createdAt: r.createdAt,
  }));
}

// ============ OWNER ============

/** Loyalty program statistics for the owner dashboard. */
export async function getLoyaltyStats() {
  await requireOwner();

  const [memberCount, issued, redeemed, rewardsRedeemed] = await Promise.all([
    prisma.loyaltyAccount.count(),
    prisma.loyaltyTransaction.aggregate({
      where: { type: "EARNED" },
      _sum: { points: true },
    }),
    prisma.loyaltyTransaction.aggregate({
      where: { type: "REDEEMED" },
      _sum: { points: true },
    }),
    prisma.rewardRedemption.count(),
  ]);

  return {
    memberCount,
    pointsIssued: issued._sum.points ?? 0,
    pointsRedeemed: Math.abs(redeemed._sum.points ?? 0),
    rewardsRedeemed,
  };
}

/** Top customers by current points balance. */
export async function getTopLoyaltyCustomers(limit = 10) {
  await requireOwner();

  const accounts = await prisma.loyaltyAccount.findMany({
    where: { pointsBalance: { gt: 0 } },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { pointsBalance: "desc" },
    take: limit,
  });

  return accounts.map((a) => ({
    id: a.id,
    name: a.user.name,
    email: a.user.email,
    pointsBalance: a.pointsBalance,
  }));
}
