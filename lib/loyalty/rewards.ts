// lib/loyalty/rewards.ts
//
// Reward redemption logic. Redeeming deducts points via a REDEEMED
// ledger entry and creates a RewardRedemption that stays PENDING
// (fulfilled=false) until the owner fulfils it.

import type { Prisma, PrismaClient } from "@/app/generated/prisma/client";
import { getOrCreateLoyaltyAccount } from "./points";

type Tx = Prisma.TransactionClient | PrismaClient;

export type RedeemResult =
  | { success: true; redemptionId: string; newBalance: number }
  | { success: false; error: string };

/**
 * Redeems a reward for a customer. Verifies the reward is active and
 * the customer has enough points, deducts the points through a REDEEMED
 * ledger entry, and records the redemption linked to that entry. Must
 * run inside a transaction.
 */
export async function redeemReward(
  tx: Tx,
  params: { userId: string; rewardId: string }
): Promise<RedeemResult> {
  const reward = await tx.reward.findUnique({
    where: { id: params.rewardId, deletedAt: null },
  });

  if (!reward || !reward.isActive) {
    return { success: false, error: "This reward is not available." };
  }

  const account = await getOrCreateLoyaltyAccount(tx, params.userId);

  if (account.pointsBalance < reward.pointsCost) {
    return { success: false, error: "You don't have enough points for this reward." };
  }

  const transaction = await tx.loyaltyTransaction.create({
    data: {
      loyaltyAccountId: account.id,
      type: "REDEEMED",
      points: -reward.pointsCost,
      description: `Redeemed: ${reward.name}`,
    },
  });

  const updated = await tx.loyaltyAccount.update({
    where: { id: account.id },
    data: { pointsBalance: { decrement: reward.pointsCost } },
  });

  const redemption = await tx.rewardRedemption.create({
    data: {
      rewardId: reward.id,
      userId: params.userId,
      loyaltyTransactionId: transaction.id,
      fulfilled: false,
    },
  });

  return {
    success: true,
    redemptionId: redemption.id,
    newBalance: updated.pointsBalance,
  };
}
