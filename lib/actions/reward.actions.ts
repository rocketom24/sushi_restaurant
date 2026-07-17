// lib/actions/reward.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireOwner } from "@/lib/guards";
import { redeemReward } from "@/lib/loyalty/rewards";
import { rewardSchema, type RewardFormState } from "@/lib/validations/reward";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ============ CUSTOMER ============

/** Active rewards the customer can browse and redeem. */
export async function getAvailableRewards() {
  await requireAuth();

  const rewards = await prisma.reward.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { pointsCost: "asc" },
  });

  return rewards.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    pointsCost: r.pointsCost,
  }));
}

export async function redeemRewardAction(rewardId: string) {
  const user = await requireAuth();

  try {
    const result = await prisma.$transaction((tx) =>
      redeemReward(tx, { userId: user.id, rewardId })
    );

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath("/loyalty");
    revalidatePath("/loyalty/rewards");
    return { success: true, newBalance: result.newBalance };
  } catch (err) {
    console.error("Reward redemption error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function getMyRewardRedemptions() {
  const user = await requireAuth();

  const redemptions = await prisma.rewardRedemption.findMany({
    where: { userId: user.id },
    include: { reward: { select: { name: true, pointsCost: true } } },
    orderBy: { redeemedAt: "desc" },
  });

  return redemptions.map((r) => ({
    id: r.id,
    rewardName: r.reward.name,
    pointsCost: r.reward.pointsCost,
    fulfilled: r.fulfilled,
    redeemedAt: r.redeemedAt,
    fulfilledAt: r.fulfilledAt,
  }));
}

// ============ OWNER — CRUD ============

export async function getRewardsForDashboard() {
  await requireOwner();

  const rewards = await prisma.reward.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { redemptions: true } } },
    orderBy: { pointsCost: "asc" },
  });

  return rewards.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    pointsCost: r.pointsCost,
    isActive: r.isActive,
    redemptionCount: r._count.redemptions,
  }));
}

export async function getRewardById(rewardId: string) {
  await requireOwner();

  return prisma.reward.findUnique({
    where: { id: rewardId, deletedAt: null },
  });
}

function parseRewardForm(formData: FormData) {
  return rewardSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    pointsCost: formData.get("pointsCost"),
    isActive: formData.get("isActive") === "on",
  });
}

export async function createRewardAction(
  _prevState: RewardFormState,
  formData: FormData
): Promise<RewardFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = parseRewardForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;

  await prisma.reward.create({
    data: {
      name: data.name,
      description: data.description || null,
      pointsCost: data.pointsCost,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath("/dashboard/rewards");
  redirect("/dashboard/rewards");
}

export async function updateRewardAction(
  rewardId: string,
  _prevState: RewardFormState,
  formData: FormData
): Promise<RewardFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = parseRewardForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;

  await prisma.reward.update({
    where: { id: rewardId },
    data: {
      name: data.name,
      description: data.description || null,
      pointsCost: data.pointsCost,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath("/dashboard/rewards");
  redirect("/dashboard/rewards");
}

export async function toggleRewardAction(rewardId: string) {
  await requireOwner();

  const reward = await prisma.reward.findUnique({
    where: { id: rewardId, deletedAt: null },
  });
  if (!reward) return { error: "Reward not found." };

  await prisma.reward.update({
    where: { id: rewardId },
    data: { isActive: !reward.isActive },
  });

  revalidatePath("/dashboard/rewards");
  return { success: true };
}

export async function deleteRewardAction(rewardId: string) {
  await requireOwner();

  const reward = await prisma.reward.findUnique({
    where: { id: rewardId, deletedAt: null },
  });
  if (!reward) return { error: "Reward not found." };

  await prisma.reward.update({
    where: { id: rewardId },
    data: { deletedAt: new Date(), isActive: false },
  });

  revalidatePath("/dashboard/rewards");
  return { success: true };
}

// ============ OWNER — redemption fulfilment ============

export async function getRewardRedemptionsForOwner() {
  await requireOwner();

  const redemptions = await prisma.rewardRedemption.findMany({
    include: {
      reward: { select: { name: true, pointsCost: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: [{ fulfilled: "asc" }, { redeemedAt: "desc" }],
    take: 100,
  });

  return redemptions.map((r) => ({
    id: r.id,
    rewardName: r.reward.name,
    pointsCost: r.reward.pointsCost,
    customerName: r.user.name,
    customerEmail: r.user.email,
    fulfilled: r.fulfilled,
    redeemedAt: r.redeemedAt,
    fulfilledAt: r.fulfilledAt,
  }));
}

export async function fulfillRedemptionAction(redemptionId: string) {
  await requireOwner();

  const redemption = await prisma.rewardRedemption.findUnique({
    where: { id: redemptionId },
  });
  if (!redemption) return { error: "Redemption not found." };
  if (redemption.fulfilled) return { error: "Already fulfilled." };

  await prisma.rewardRedemption.update({
    where: { id: redemptionId },
    data: { fulfilled: true, fulfilledAt: new Date() },
  });

  revalidatePath("/dashboard/rewards");
  return { success: true };
}
