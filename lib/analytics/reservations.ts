// lib/analytics/reservations.ts

import { prisma } from "@/lib/prisma";

export type ReservationAnalytics = {
  total: number;
  confirmed: number;
  cancelled: number;
  noShow: number;
  completed: number;
  conversionRate: number; // completed / total, 0-100
};

export async function getReservationAnalytics(since: Date): Promise<ReservationAnalytics> {
  const where = { deletedAt: null, createdAt: { gte: since } };

  const [total, confirmed, cancelled, noShow, completed] = await Promise.all([
    prisma.reservation.count({ where }),
    prisma.reservation.count({ where: { ...where, status: "CONFIRMED" } }),
    prisma.reservation.count({ where: { ...where, status: "CANCELLED" } }),
    prisma.reservation.count({ where: { ...where, status: "NO_SHOW" } }),
    prisma.reservation.count({ where: { ...where, status: "COMPLETED" } }),
  ]);

  return {
    total,
    confirmed,
    cancelled,
    noShow,
    completed,
    conversionRate: total > 0 ? Math.round((completed / total) * 1000) / 10 : 0,
  };
}

export type HourlyReservationPoint = { hour: number; count: number };

/** Reservation counts bucketed by hour of day (0-23), across all non-cancelled bookings since `since`. */
export async function getPeakReservationHours(since: Date): Promise<HourlyReservationPoint[]> {
  const reservations = await prisma.reservation.findMany({
    where: {
      deletedAt: null,
      createdAt: { gte: since },
      status: { notIn: ["CANCELLED"] },
    },
    select: { reservationAt: true },
  });

  const buckets = new Map<number, number>();
  for (let h = 0; h < 24; h++) buckets.set(h, 0);
  for (const r of reservations) {
    const h = r.reservationAt.getHours();
    buckets.set(h, (buckets.get(h) ?? 0) + 1);
  }

  return Array.from(buckets.entries())
    .map(([hour, count]) => ({ hour, count }))
    .filter((p) => p.count > 0)
    .sort((a, b) => b.count - a.count);
}
