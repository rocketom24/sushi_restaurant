"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guards";
import { canCustomerCancel } from "@/lib/orders/status-transitions";
import { revalidatePath } from "next/cache";

export async function getMyOrders() {
  const user = await requireAuth();

  return prisma.order.findMany({
    where: { userId: user.id, deletedAt: null },
    include: {
      orderItems: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Returns null if not found OR not owned by the current user — never
 * distinguishes between the two cases in the response, so a customer
 * can't probe for the existence of another customer's order ID. */
export async function getMyOrderById(orderId: string) {
  const user = await requireAuth();

  const order = await prisma.order.findUnique({
    where: { id: orderId, deletedAt: null },
    include: {
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

  if (!order || order.userId !== user.id) return null;

  return order;
}

export async function cancelMyOrderAction(orderId: string) {
  const user = await requireAuth();

  const order = await prisma.order.findUnique({
    where: { id: orderId, deletedAt: null },
  });

  if (!order || order.userId !== user.id) {
    return { error: "Order not found." };
  }

  if (!canCustomerCancel(order.status)) {
    return { error: "This order can no longer be cancelled." };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}