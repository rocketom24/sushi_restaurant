// lib/analytics/orders.ts

import { prisma } from "@/lib/prisma";

export type OrderStatsSummary = {
  total: number;
  completed: number;
  cancelled: number;
  pending: number; // NEW/CONFIRMED/PREPARING/READY — anything still active
  averageOrderValue: number;
  averageItemsPerOrder: number;
};

export async function getOrderAnalytics(since?: Date): Promise<OrderStatsSummary> {
  const where = { deletedAt: null, ...(since ? { createdAt: { gte: since } } : {}) };

  const [total, completed, cancelled, completedAgg, itemCount] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.count({ where: { ...where, status: "COMPLETED" } }),
    prisma.order.count({ where: { ...where, status: "CANCELLED" } }),
    prisma.order.aggregate({
      where: { ...where, status: "COMPLETED" },
      _avg: { totalAmount: true },
      _count: true,
    }),
    prisma.orderItem.count({
      where: { deletedAt: null, order: { ...where, status: "COMPLETED" } },
    }),
  ]);

  const pending = total - completed - cancelled;
  const completedCount = completedAgg._count;

  return {
    total,
    completed,
    cancelled,
    pending,
    averageOrderValue: Math.round(Number(completedAgg._avg.totalAmount ?? 0) * 100) / 100,
    averageItemsPerOrder:
      completedCount > 0 ? Math.round((itemCount / completedCount) * 10) / 10 : 0,
  };
}

export type DailyOrderPoint = { date: string; orders: number };

export async function getOrdersTrend(days = 7): Promise<DailyOrderPoint[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const orders = await prisma.order.findMany({
    where: { deletedAt: null, createdAt: { gte: start } },
    select: { createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    buckets.set(dateKey(d), 0);
  }

  for (const o of orders) {
    const key = dateKey(o.createdAt);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.entries()).map(([date, orders]) => ({ date, orders }));
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
