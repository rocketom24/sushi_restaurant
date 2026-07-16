import { prisma } from "@/lib/prisma";

// Configurable business rules — adjust to match the restaurant's
// real operating hours/policies when known.
export const RESERVATION_DURATION_MINUTES = {
  LUNCH: 90,
  DINNER: 120,
};
export const SLOT_INTERVAL_MINUTES = 30;
export const MIN_GUESTS = 1;
export const MAX_GUESTS = 20;

function getDurationForTime(reservationAt: Date): number {
  const hour = reservationAt.getHours();
  // Simple lunch/dinner split — before 17:00 counts as lunch duration
  return hour < 17
    ? RESERVATION_DURATION_MINUTES.LUNCH
    : RESERVATION_DURATION_MINUTES.DINNER;
}

/**
 * Finds the smallest available table that fits the party size for
 * the requested time window, avoiding double-booking by checking
 * for overlapping active reservations on each candidate table.
 *
 * Returns null if no table is currently free — caller decides
 * whether to reject the reservation or leave tableId unassigned
 * (per the doc: "tableId nullable until assigned").
 */
export async function findAvailableTable(
  reservationAt: Date,
  guestCount: number
): Promise<string | null> {
  const durationMs = getDurationForTime(reservationAt) * 60 * 1000;
  const windowStart = reservationAt;
  const windowEnd = new Date(reservationAt.getTime() + durationMs);

  const candidateTables = await prisma.table.findMany({
    where: {
      deletedAt: null,
      isActive: true,
      capacity: { gte: guestCount },
    },
    orderBy: { capacity: "asc" }, // smallest-fit-first, per the doc's rule
  });

  for (const table of candidateTables) {
    const busy = await hasConflictingReservation(table.id, reservationAt);
    if (!busy) return table.id;
  }

  return null;
}

/**
 * True if the table already has an active reservation whose window
 * overlaps the requested time. Since we don't store an explicit end
 * time, each reservation's window is derived from its start time via
 * the same lunch/dinner duration rule.
 */
export async function hasConflictingReservation(
  tableId: string,
  reservationAt: Date,
  excludeReservationId?: string
): Promise<boolean> {
  const durationMs = getDurationForTime(reservationAt) * 60 * 1000;
  const windowStart = reservationAt;
  const windowEnd = new Date(reservationAt.getTime() + durationMs);

  const existing = await prisma.reservation.findMany({
    where: {
      tableId,
      deletedAt: null,
      status: { in: ["PENDING", "CONFIRMED", "SEATED"] },
      // Anything starting after our window ends can't overlap
      reservationAt: { lt: windowEnd },
      ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
    },
    select: { reservationAt: true },
  });

  return existing.some((r) => {
    const endMs =
      r.reservationAt.getTime() + getDurationForTime(r.reservationAt) * 60 * 1000;
    return endMs > windowStart.getTime();
  });
}

export function isWithinOperatingHours(reservationAt: Date): boolean {
  const hour = reservationAt.getHours();
  const minute = reservationAt.getMinutes();
  const totalMinutes = hour * 60 + minute;

  // Placeholder hours: 12:00-14:30 lunch, 18:00-22:30 dinner.
  // Adjust once real restaurant hours are confirmed — this should
  // eventually move to a RestaurantSettings table rather than being
  // hardcoded, but that model doesn't exist yet in your schema.
  const lunchStart = 12 * 60;
  const lunchEnd = 14 * 60 + 30;
  const dinnerStart = 18 * 60;
  const dinnerEnd = 22 * 60 + 30;

  return (
    (totalMinutes >= lunchStart && totalMinutes <= lunchEnd) ||
    (totalMinutes >= dinnerStart && totalMinutes <= dinnerEnd)
  );
}

export function isOnValidSlotInterval(reservationAt: Date): boolean {
  return reservationAt.getMinutes() % SLOT_INTERVAL_MINUTES === 0;
}