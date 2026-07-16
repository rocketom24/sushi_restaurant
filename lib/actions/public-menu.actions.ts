// lib/actions/public-menu.actions.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicMenu() {
  return prisma.category.findMany({
    where: { deletedAt: null, isActive: true, parentId: null },
    include: {
      menuItems: {
        where: { deletedAt: null },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
      children: {
        where: { deletedAt: null, isActive: true },
        include: {
          menuItems: {
            where: { deletedAt: null },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

/** Featured, available dishes for the home page. Prices pre-serialized. */
export async function getFeaturedItems(limit = 4) {
  const items = await prisma.menuItem.findMany({
    where: { deletedAt: null, isAvailable: true, isFeatured: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: limit,
  });

  return items.map((item) => ({ ...item, price: Number(item.price) }));
}

export async function searchMenuItems(query: string) {
  if (!query.trim()) return [];

  return prisma.menuItem.findMany({
    where: {
      deletedAt: null,
      name: { contains: query, mode: "insensitive" },
    },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { name: "asc" },
    take: 20,
  });
}