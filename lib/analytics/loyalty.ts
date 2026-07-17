// lib/analytics/loyalty.ts
//
// Program-wide loyalty member/point stats already exist in
// lib/actions/loyalty.actions.ts (getLoyaltyStats, getTopLoyaltyCustomers)
// from Module 11 — this file adds only what wasn't already covered.

import { prisma } from "@/lib/prisma";

export type MostRedeemedReward = { name: string; redemptions: number } | null;

export async function getMostRedeemedReward(since: Date): Promise<MostRedeemedReward> {
  const grouped = await prisma.rewardRedemption.groupBy({
    by: ["rewardId"],
    where: { redeemedAt: { gte: since } },
    _count: true,
    orderBy: { _count: { rewardId: "desc" } },
    take: 1,
  });

  if (grouped.length === 0) return null;

  const reward = await prisma.reward.findUnique({
    where: { id: grouped[0].rewardId },
    select: { name: true },
  });
  if (!reward) return null;

  return { name: reward.name, redemptions: grouped[0]._count };
}
