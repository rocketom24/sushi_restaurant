// lib/analytics/menu.ts

import { prisma } from "@/lib/prisma";

export type MenuItemPerformance = {
  menuItemId: string;
  name: string;
  quantitySold: number;
  revenue: number;
};

async function getSoldItemAggregates(since: Date) {
  const items = await prisma.orderItem.groupBy({
    by: ["menuItemId"],
    where: { deletedAt: null, order: { deletedAt: null, status: "COMPLETED", createdAt: { gte: since } } },
    _sum: { quantity: true, subtotal: true },
  });

  const menuItemIds = items.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
    select: { id: true, name: true },
  });
  const nameMap = new Map(menuItems.map((m) => [m.id, m.name]));

  return items
    .map((i) => ({
      menuItemId: i.menuItemId,
      name: nameMap.get(i.menuItemId) ?? "(deleted item)",
      quantitySold: i._sum.quantity ?? 0,
      revenue: Math.round(Number(i._sum.subtotal ?? 0) * 100) / 100,
    }))
    .filter((i) => i.quantitySold > 0);
}

export async function getBestSellingItems(since: Date, limit = 10): Promise<MenuItemPerformance[]> {
  const items = await getSoldItemAggregates(since);
  return items.sort((a, b) => b.quantitySold - a.quantitySold).slice(0, limit);
}

export async function getHighestRevenueItems(since: Date, limit = 10): Promise<MenuItemPerformance[]> {
  const items = await getSoldItemAggregates(since);
  return items.sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

/** Available items with the lowest (including zero) sales in the window — candidates to reconsider. */
export async function getLeastPopularItems(since: Date, limit = 10): Promise<MenuItemPerformance[]> {
  const sold = await getSoldItemAggregates(since);
  const soldMap = new Map(sold.map((i) => [i.menuItemId, i]));

  const allItems = await prisma.menuItem.findMany({
    where: { deletedAt: null, isAvailable: true },
    select: { id: true, name: true },
  });

  const combined: MenuItemPerformance[] = allItems.map((item) => {
    const existing = soldMap.get(item.id);
    return (
      existing ?? { menuItemId: item.id, name: item.name, quantitySold: 0, revenue: 0 }
    );
  });

  return combined.sort((a, b) => a.quantitySold - b.quantitySold).slice(0, limit);
}

export type CategoryPerformance = {
  categoryId: string;
  name: string;
  revenue: number;
  percentOfTotal: number;
};

export async function getCategoryPerformance(since: Date): Promise<CategoryPerformance[]> {
  const items = await prisma.orderItem.findMany({
    where: { deletedAt: null, order: { deletedAt: null, status: "COMPLETED", createdAt: { gte: since } } },
    select: { subtotal: true, menuItem: { select: { categoryId: true } } },
  });

  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
  });
  const nameMap = new Map(categories.map((c) => [c.id, c.name]));

  const totals = new Map<string, number>();
  let grandTotal = 0;
  for (const item of items) {
    const catId = item.menuItem.categoryId;
    const amount = Number(item.subtotal);
    totals.set(catId, (totals.get(catId) ?? 0) + amount);
    grandTotal += amount;
  }

  const result: CategoryPerformance[] = Array.from(totals.entries()).map(([categoryId, revenue]) => ({
    categoryId,
    name: nameMap.get(categoryId) ?? "(deleted category)",
    revenue: Math.round(revenue * 100) / 100,
    percentOfTotal: grandTotal > 0 ? Math.round((revenue / grandTotal) * 1000) / 10 : 0,
  }));

  return result.sort((a, b) => b.revenue - a.revenue);
}
