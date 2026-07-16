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

export type HeroSlide =
  | {
      kind: "item" | "new";
      id: string;
      name: string;
      description: string | null;
      price: number;
      imageUrl: string | null;
    }
  | {
      kind: "offer";
      id: string;
      code: string;
      description: string | null;
      discountLabel: string; // e.g. "-10%" or "-€5.00"
    };

/**
 * Slides for the home hero: featured dishes, the newest dish, and any
 * active coupon offers — rotated by the client every 5 seconds.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const now = new Date();

  const [featured, newest, coupons] = await Promise.all([
    prisma.menuItem.findMany({
      where: { deletedAt: null, isAvailable: true, isFeatured: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 3,
    }),
    prisma.menuItem.findFirst({
      where: { deletedAt: null, isAvailable: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.coupon.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
  ]);

  const slides: HeroSlide[] = featured.map((item) => ({
    kind: "item" as const,
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    imageUrl: item.imageUrl,
  }));

  if (newest && !slides.some((s) => s.id === newest.id)) {
    slides.push({
      kind: "new",
      id: newest.id,
      name: newest.name,
      description: newest.description,
      price: Number(newest.price),
      imageUrl: newest.imageUrl,
    });
  }

  for (const coupon of coupons) {
    slides.push({
      kind: "offer",
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountLabel:
        coupon.type === "PERCENTAGE"
          ? `-${Number(coupon.value)}%`
          : `-€${Number(coupon.value).toFixed(2)}`,
    });
  }

  return slides;
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