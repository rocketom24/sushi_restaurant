// lib/analytics/payments.ts

import { prisma } from "@/lib/prisma";
import type { PaymentMethod } from "@/app/generated/prisma/client";

export type PaymentMethodBreakdown = {
  method: PaymentMethod;
  count: number;
  revenue: number;
  percentOfRevenue: number;
};

export async function getPaymentMethodBreakdown(since: Date): Promise<PaymentMethodBreakdown[]> {
  const grouped = await prisma.payment.groupBy({
    by: ["method"],
    where: { status: "PAID", paidAt: { gte: since }, deletedAt: null },
    _sum: { amount: true },
    _count: true,
  });

  const grandTotal = grouped.reduce((sum, g) => sum + Number(g._sum.amount ?? 0), 0);

  return grouped
    .map((g) => {
      const revenue = Math.round(Number(g._sum.amount ?? 0) * 100) / 100;
      return {
        method: g.method,
        count: g._count,
        revenue,
        percentOfRevenue: grandTotal > 0 ? Math.round((revenue / grandTotal) * 1000) / 10 : 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

export type CouponAnalytics = {
  couponsUsed: number;
  totalDiscountGiven: number;
  revenueInfluenced: number; // subtotal of orders that used a coupon
  mostPopular: { code: string; uses: number } | null;
};

export async function getCouponAnalytics(since: Date): Promise<CouponAnalytics> {
  const redemptions = await prisma.couponRedemption.findMany({
    where: { createdAt: { gte: since } },
    select: {
      discountAmount: true,
      coupon: { select: { code: true } },
      order: { select: { subtotal: true } },
    },
  });

  const totalDiscountGiven =
    Math.round(redemptions.reduce((sum, r) => sum + Number(r.discountAmount), 0) * 100) / 100;
  const revenueInfluenced =
    Math.round(redemptions.reduce((sum, r) => sum + Number(r.order.subtotal), 0) * 100) / 100;

  const usageByCode = new Map<string, number>();
  for (const r of redemptions) {
    usageByCode.set(r.coupon.code, (usageByCode.get(r.coupon.code) ?? 0) + 1);
  }
  const mostPopularEntry = Array.from(usageByCode.entries()).sort((a, b) => b[1] - a[1])[0];

  return {
    couponsUsed: redemptions.length,
    totalDiscountGiven,
    revenueInfluenced,
    mostPopular: mostPopularEntry ? { code: mostPopularEntry[0], uses: mostPopularEntry[1] } : null,
  };
}
