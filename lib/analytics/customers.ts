// lib/analytics/customers.ts

import { prisma } from "@/lib/prisma";

export type CustomerAnalytics = {
  totalCustomers: number;
  newCustomers: number; // registered within the given window
  returningCustomers: number; // customers with 2+ completed orders (all-time)
  averageSpend: number; // per customer, across customers with at least one completed order
};

export async function getCustomerAnalytics(since: Date): Promise<CustomerAnalytics> {
  const [totalCustomers, newCustomers, spenders] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER", deletedAt: null } }),
    prisma.user.count({
      where: { role: "CUSTOMER", deletedAt: null, createdAt: { gte: since } },
    }),
    prisma.order.groupBy({
      by: ["userId"],
      where: { deletedAt: null, status: "COMPLETED", userId: { not: null } },
      _sum: { totalAmount: true },
      _count: true,
    }),
  ]);

  const returningCustomers = spenders.filter((s) => s._count >= 2).length;
  const totalSpend = spenders.reduce((sum, s) => sum + Number(s._sum.totalAmount ?? 0), 0);
  const averageSpend =
    spenders.length > 0 ? Math.round((totalSpend / spenders.length) * 100) / 100 : 0;

  return { totalCustomers, newCustomers, returningCustomers, averageSpend };
}

export type TopCustomer = { userId: string; name: string; email: string; totalSpend: number; orderCount: number };

export async function getTopSpendingCustomers(limit = 10): Promise<TopCustomer[]> {
  const grouped = await prisma.order.groupBy({
    by: ["userId"],
    where: { deletedAt: null, status: "COMPLETED", userId: { not: null } },
    _sum: { totalAmount: true },
    _count: true,
    orderBy: { _sum: { totalAmount: "desc" } },
    take: limit,
  });

  const userIds = grouped.map((g) => g.userId!).filter(Boolean);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return grouped
    .filter((g) => g.userId && userMap.has(g.userId))
    .map((g) => {
      const u = userMap.get(g.userId!)!;
      return {
        userId: u.id,
        name: u.name,
        email: u.email,
        totalSpend: Math.round(Number(g._sum.totalAmount ?? 0) * 100) / 100,
        orderCount: g._count,
      };
    });
}
