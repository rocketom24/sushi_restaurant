"use server";

import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/guards";
import { isValidTransition } from "@/lib/orders/status-transitions";
import { awardPointsForOrder } from "@/lib/loyalty/points";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/app/generated/prisma/client";

export type KitchenFilters = {
  status?: "CONFIRMED" | "PREPARING" | "READY";
  orderType?: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  search?: string;
};

const QUEUE_STATUSES: OrderStatus[] = ["CONFIRMED", "PREPARING", "READY"];

/**
 * Returns active kitchen orders only — CONFIRMED, PREPARING, READY.
 * NEW (pending), COMPLETED, and CANCELLED orders never appear here,
 * per the module's queue definition.
 *
 * Prices are intentionally excluded from this query entirely — the
 * kitchen doesn't need financial information, per the module doc.
 */
export async function getKitchenQueue(filters: KitchenFilters = {}) {
  await requireOwner();

  const { status, orderType, search } = filters;

  const where = {
    deletedAt: null,
    status: status ? status : { in: QUEUE_STATUSES },
    ...(orderType ? { orderType } : {}),
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" as const } },
            { user: { name: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    select: {
      id: true,
      orderNumber: true,
      orderType: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      notes: true,
      user: { select: { name: true } },
      table: { select: { tableNumber: true } },
      orderItems: {
        select: {
          id: true,
          quantity: true,
          notes: true,
          menuItem: { select: { name: true } },
          customizations: {
            select: { groupName: true, optionName: true },
          },
        },
      },
    },
    // Oldest first — the oldest confirmed order should always
    // surface first, per the module's prioritization rule.
    orderBy: { createdAt: "asc" },
  });

  return orders;
}

export async function getKitchenStats() {
  await requireOwner();

  const [waiting, preparing, ready, activeOrders] = await Promise.all([
    prisma.order.count({ where: { status: "CONFIRMED", deletedAt: null } }),
    prisma.order.count({ where: { status: "PREPARING", deletedAt: null } }),
    prisma.order.count({ where: { status: "READY", deletedAt: null } }),
    prisma.order.findMany({
      where: { status: { in: QUEUE_STATUSES }, deletedAt: null },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const now = Date.now();
  const waitTimesMinutes = activeOrders.map(
    (o) => (now - new Date(o.createdAt).getTime()) / 60000
  );

  const avgPreparationTime =
    waitTimesMinutes.length > 0
      ? Math.round(
          waitTimesMinutes.reduce((sum, t) => sum + t, 0) / waitTimesMinutes.length
        )
      : 0;

  const longestWaitingMinutes =
    waitTimesMinutes.length > 0 ? Math.round(Math.max(...waitTimesMinutes)) : 0;

  return { waiting, preparing, ready, avgPreparationTime, longestWaitingMinutes };
}

/**
 * Kitchen-specific status update. Reuses the same transition rules
 * as the owner order dashboard, but scoped to kitchen-relevant moves:
 * CONFIRMED -> PREPARING -> READY -> COMPLETED.
 *
 * Validates: order exists, transition is legal, order isn't already
 * cancelled or completed (isValidTransition already covers this since
 * CANCELLED/COMPLETED have no outgoing transitions).
 */
export async function updateKitchenStatusAction(
  orderId: string,
  newStatus: OrderStatus
) {
  await requireOwner();

  const order = await prisma.order.findUnique({
    where: { id: orderId, deletedAt: null },
  });

  if (!order) {
    return { error: "Order not found." };
  }

  if (!isValidTransition(order.status, newStatus)) {
    return {
      error: `Cannot move an order from ${order.status} to ${newStatus}.`,
    };
  }

  // Status flip + loyalty award are atomic (see admin-order.actions).
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    if (newStatus === "COMPLETED" && order.userId) {
      await awardPointsForOrder(tx, {
        userId: order.userId,
        orderId: order.id,
        amountPaid: Number(order.totalAmount),
      });
    }
  });

  revalidatePath("/dashboard/kitchen");
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/loyalty");
  return { success: true };
}