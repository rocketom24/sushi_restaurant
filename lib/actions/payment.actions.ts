// lib/actions/payment.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireOwner } from "@/lib/guards";
import { initiatePayment } from "@/lib/payments/payment-service";
import { refund as refundStripe } from "@/lib/payments/stripe";
import { reversePointsForOrder } from "@/lib/loyalty/points";
import type { PaymentMethod } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Called right after order creation (Module 6). Validates the order
 * belongs to the current user, isn't already paid, and that the
 * amount matches the database — never trusts a client-supplied amount.
 */
export async function startPaymentAction(orderId: string, method: PaymentMethod) {
  const user = await requireAuth();

  const order = await prisma.order.findUnique({
    where: { id: orderId, deletedAt: null },
    include: { payments: { where: { deletedAt: null } } },
  });

  if (!order || order.userId !== user.id) {
    return { success: false as const, error: "Order not found." };
  }

  if (order.status === "CANCELLED") {
    return { success: false as const, error: "This order has been cancelled." };
  }

  const alreadyPaid = order.payments.some((p) => p.status === "PAID");
  if (alreadyPaid) {
    return { success: false as const, error: "This order has already been paid." };
  }

  // Amount always comes from the server-stored order total, never
  // from any client input — per the module's core security rule.
  const result = await initiatePayment({
    orderId: order.id,
    amount: Number(order.totalAmount),
    method,
  });

  return result;
}

/** Owner manually confirms a cash payment was physically received. */
export async function confirmCashPaymentAction(paymentId: string) {
  await requireOwner();

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

  if (!payment) return { error: "Payment not found." };
  if (payment.method !== "CASH") return { error: "Only cash payments can be confirmed this way." };
  if (payment.status === "PAID") return { error: "Already marked as paid." };

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: "PAID", paidAt: new Date() },
    }),
    prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "CONFIRMED" },
    }),
  ]);

  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/orders");
  return { success: true };
}

export async function refundPaymentAction(paymentId: string) {
  await requireOwner();

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

  if (!payment) return { error: "Payment not found." };
  if (payment.status !== "PAID") return { error: "Only paid payments can be refunded." };

  if (payment.gateway === "STRIPE") {
    const result = await refundStripe(paymentId);
    if (!result.success) return { error: result.error };
  } else if (payment.method === "CASH") {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "REFUNDED",
        refundedAt: new Date(),
        refundAmount: payment.amount,
        notes: "Cash refund recorded manually by owner.",
      },
    });
  } else {
    return { error: "Refunds for this payment method aren't supported yet." };
  }

  // Reverse any loyalty points earned from the refunded order.
  await prisma.$transaction(async (tx) => {
    await reversePointsForOrder(tx, payment.orderId);
  });

  revalidatePath("/dashboard/payments");
  revalidatePath("/loyalty");
  return { success: true };
}

export async function getAllPayments(filters: {
  status?: string;
  method?: string;
  search?: string;
} = {}) {
  await requireOwner();

  const { status, method, search } = filters;

  const payments = await prisma.payment.findMany({
    where: {
      deletedAt: null,
      ...(status ? { status: status as never } : {}),
      ...(method ? { method: method as never } : {}),
      ...(search
        ? { order: { orderNumber: { contains: search, mode: "insensitive" } } }
        : {}),
    },
    include: {
      order: { select: { orderNumber: true, user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Prisma Decimal instances can't cross the Server → Client Component
  // boundary — convert money fields to plain numbers before returning.
  return payments.map((p) => ({
    ...p,
    amount: p.amount.toNumber(),
    refundAmount: p.refundAmount?.toNumber() ?? null,
  }));
}

export async function getPaymentStats() {
  await requireOwner();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [revenueToday, pending, failed, refunded, byMethod] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: startOfToday }, deletedAt: null },
      _sum: { amount: true },
    }),
    prisma.payment.count({ where: { status: "PENDING", deletedAt: null } }),
    prisma.payment.count({ where: { status: "FAILED", deletedAt: null } }),
    prisma.payment.count({ where: { status: "REFUNDED", deletedAt: null } }),
    prisma.payment.groupBy({
      by: ["method"],
      where: { status: "PAID", deletedAt: null },
      _count: true,
    }),
  ]);

  return {
    revenueToday: Number(revenueToday._sum.amount ?? 0),
    pending,
    failed,
    refunded,
    byMethod,
  };
}