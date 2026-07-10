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