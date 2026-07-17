"use server";

import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/guards";
import { isValidTransition } from "@/lib/orders/status-transitions";
import { awardPointsForOrder } from "@/lib/loyalty/points";
import type { OrderStatus, OrderType } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";

export type OrderFilters = {
  status?: OrderStatus;
  orderType?: OrderType;
  search?: string;
  page?: number;
};

const PAGE_SIZE = 20;

export async function getAllOrders(filters: OrderFilters = {}) {
  await requireOwner();

  const { status, orderType, search, page = 1 } = filters;

  const where = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(orderType ? { orderType } : {}),
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" as const } },
            { user: { name: { contains: search, mode: "insensitive" as const } } },
            { user: { email: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        orderItems: { select: { id: true } },
        payments: { select: { status: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getOrderByIdForOwner(orderId: string) {
  await requireOwner();

  return prisma.order.findUnique({
    where: { id: orderId, deletedAt: null },
    include: {
      user: { select: { name: true, email: true } },
      orderItems: {
        include: {
          menuItem: { select: { name: true, imageUrl: true } },
          customizations: true,
        },
      },
      payments: true,
      table: { select: { tableNumber: true } },
    },
  });
}

export async function updateOrderStatusAction(
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

  // Awarding loyalty points and flipping the status must be atomic —
  // wrap both so a completed order can never be left without its points.
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

  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/loyalty");
  return { success: true };
}

export async function getOrderStats() {
  await requireOwner();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [pending, preparing, ready, completedToday, revenueToday] =
    await Promise.all([
      prisma.order.count({ where: { status: "NEW", deletedAt: null } }),
      prisma.order.count({ where: { status: "PREPARING", deletedAt: null } }),
      prisma.order.count({ where: { status: "READY", deletedAt: null } }),
      prisma.order.count({
        where: {
          status: "COMPLETED",
          deletedAt: null,
          updatedAt: { gte: startOfToday },
        },
      }),
      prisma.order.aggregate({
        where: {
          status: "COMPLETED",
          deletedAt: null,
          updatedAt: { gte: startOfToday },
        },
        _sum: { totalAmount: true },
      }),
    ]);

  return {
    pending,
    preparing,
    ready,
    completedToday,
    revenueToday: Number(revenueToday._sum.totalAmount ?? 0),
  };
}