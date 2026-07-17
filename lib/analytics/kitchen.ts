// lib/analytics/kitchen.ts
//
// Historical kitchen throughput — how long tickets actually took from
// being queued to being marked ready, for tickets that reached that
// point. Distinct from getKitchenStats() in kitchen.actions.ts, which
// reports the CURRENT wait time of orders still sitting in the queue.

import { prisma } from "@/lib/prisma";

export type KitchenAnalytics = {
  averagePrepMinutes: number;
  fastestMinutes: number | null;
  slowestMinutes: number | null;
  activeTickets: number;
  completedTickets: number;
};

export async function getKitchenAnalytics(since: Date): Promise<KitchenAnalytics> {
  const [tickets, activeTickets] = await Promise.all([
    prisma.kitchenTicket.findMany({
      where: { deletedAt: null, queuedAt: { gte: since }, readyAt: { not: null } },
      select: { queuedAt: true, readyAt: true },
    }),
    prisma.kitchenTicket.count({
      where: { deletedAt: null, status: { in: ["QUEUED", "PREPARING"] } },
    }),
  ]);

  const minutes = tickets.map(
    (t) => (t.readyAt!.getTime() - t.queuedAt.getTime()) / 60000
  );

  const average =
    minutes.length > 0
      ? Math.round((minutes.reduce((a, b) => a + b, 0) / minutes.length) * 10) / 10
      : 0;

  return {
    averagePrepMinutes: average,
    fastestMinutes: minutes.length > 0 ? Math.round(Math.min(...minutes) * 10) / 10 : null,
    slowestMinutes: minutes.length > 0 ? Math.round(Math.max(...minutes) * 10) / 10 : null,
    activeTickets,
    completedTickets: tickets.length,
  };
}
