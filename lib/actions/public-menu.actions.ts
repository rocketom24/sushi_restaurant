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
export async function getFeaturedItems(limit = 8) {
  const items = await prisma.menuItem.findMany({
    where: { deletedAt: null, isAvailable: true, isFeatured: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: limit,
  });

  return items.map((item) => ({
    ...item,
    price: Number(item.price),
    discountPrice: item.discountPrice ? Number(item.discountPrice) : null,
  }));
}

/** Lean, pre-serialized results for the live search dropdown in the header. */
export async function searchMenuItems(query: string) {
  if (!query.trim()) return [];

  const items = await prisma.menuItem.findMany({
    where: {
      deletedAt: null,
      isAvailable: true,
      name: { contains: query, mode: "insensitive" },
    },
    include: { category: { select: { name: true } } },
    orderBy: { name: "asc" },
    take: 8,
  });

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    imageUrl: item.imageUrl,
    category: item.category?.name ?? null,
  }));
}

export type MenuSearchResult = Awaited<ReturnType<typeof searchMenuItems>>[number];