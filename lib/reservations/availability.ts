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
    const conflicting = await prisma.reservation.findFirst({
      where: {
        tableId: table.id,
        deletedAt: null,
        status: { in: ["PENDING", "CONFIRMED", "SEATED"] },
        // Overlap check: existing reservation starts before our window
        // ends, AND doesn't end before our window starts. Since we
        // don't store an explicit end time, we approximate using the
        // same duration logic for the existing reservation's start time.
        reservationAt: {
          lt: windowEnd,
        },
      },
    });

    if (conflicting) {
      const conflictDurationMs =
        getDurationForTime(conflicting.reservationAt) * 60 * 1000;
      const conflictEnd = new Date(
        conflicting.reservationAt.getTime() + conflictDurationMs
      );

      // Only a real conflict if the existing reservation's window
      // actually overlaps ours
      if (conflictEnd > windowStart) {
        continue; // this table is busy, try the next
      }
    }

    return table.id;
  }

  return null;
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