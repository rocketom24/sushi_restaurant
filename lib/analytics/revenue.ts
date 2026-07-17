// lib/analytics/revenue.ts
//
// Revenue aggregations. Only PAID payments count as revenue — a NEW
// order with a PENDING payment hasn't actually earned the restaurant
// anything yet, and REFUNDED amounts are reported separately, not
// netted silently out of "gross".

import { prisma } from "@/lib/prisma";

export type RevenueRange = "today" | "week" | "month" | "year";

function startOfRange(range: RevenueRange): Date {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  switch (range) {
    case "today":
      return start;
    case "week": {
      const day = start.getDay(); // 0=Sun
      const diff = (day + 6) % 7; // days since Monday
      start.setDate(start.getDate() - diff);
      return start;
    }
    case "month":
      start.setDate(1);
      return start;
    case "year":
      start.setMonth(0, 1);
      return start;
  }
}

export type RevenueSummary = {
  grossRevenue: number;
  refundAmount: number;
  netRevenue: number;
  orderCount: number;
  averageOrderValue: number;
};

export async function getRevenueSummary(range: RevenueRange): Promise<RevenueSummary> {
  const since = startOfRange(range);

  const [paid, refunded] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: since }, deletedAt: null },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: { status: "REFUNDED", refundedAt: { gte: since }, deletedAt: null },
      _sum: { refundAmount: true },
    }),
  ]);

  const grossRevenue = Number(paid._sum.amount ?? 0);
  const refundAmount = Number(refunded._sum.refundAmount ?? 0);
  const orderCount = paid._count;

  return {
    grossRevenue,
    refundAmount,
    netRevenue: Math.round((grossRevenue - refundAmount) * 100) / 100,
    orderCount,
    averageOrderValue: orderCount > 0 ? Math.round((grossRevenue / orderCount) * 100) / 100 : 0,
  };
}

export type DailyRevenuePoint = { date: string; revenue: number; orders: number };

/** Daily revenue for the last N days (including today), oldest first. */
export async function getRevenueTrend(days = 7): Promise<DailyRevenuePoint[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const payments = await prisma.payment.findMany({
    where: { status: "PAID", paidAt: { gte: start }, deletedAt: null },
    select: { amount: true, paidAt: true },
  });

  const buckets = new Map<string, { revenue: number; orders: number }>();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    buckets.set(dateKey(d), { revenue: 0, orders: 0 });
  }

  for (const p of payments) {
    if (!p.paidAt) continue;
    const key = dateKey(p.paidAt);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.revenue = Math.round((bucket.revenue + Number(p.amount)) * 100) / 100;
      bucket.orders += 1;
    }
  }

  return Array.from(buckets.entries()).map(([date, v]) => ({ date, ...v }));
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
