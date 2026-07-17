import { prisma } from "@/lib/prisma";
import {
  getRestaurantSettings,
  isTimeWithinHours,
  parseOperatingHours,
} from "@/lib/settings/settings";
import type { RestaurantSettings } from "@/app/generated/prisma/client";

// Hard safety ceilings — settings can tune within these but never past
// them. The zod schema in lib/validations/reservation.ts also enforces
// MIN/MAX_GUESTS as a static bound; createReservationAction layers the
// dynamic settings.reservationMaxGuests check on top at request time.
export const MIN_GUESTS = 1;
export const MAX_GUESTS = 100;

function getDurationForTime(
  reservationAt: Date,
  settings: Pick<
    RestaurantSettings,
    "reservationLunchDurationMinutes" | "reservationDinnerDurationMinutes"
  >
): number {
  const hour = reservationAt.getHours();
  // Simple lunch/dinner split — before 17:00 counts as lunch duration
  return hour < 17
    ? settings.reservationLunchDurationMinutes
    : settings.reservationDinnerDurationMinutes;
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
  const settings = await getRestaurantSettings();

  const candidateTables = await prisma.table.findMany({
    where: {
      deletedAt: null,
      isActive: true,
      capacity: { gte: guestCount },
    },
    orderBy: { capacity: "asc" }, // smallest-fit-first, per the doc's rule
  });

  for (const table of candidateTables) {
    const busy = await hasConflictingReservation(table.id, reservationAt, undefined, settings);
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
  excludeReservationId?: string,
  settings?: RestaurantSettings
): Promise<boolean> {
  const s = settings ?? (await getRestaurantSettings());
  const durationMs = getDurationForTime(reservationAt, s) * 60 * 1000;
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
      r.reservationAt.getTime() + getDurationForTime(r.reservationAt, s) * 60 * 1000;
    return endMs > windowStart.getTime();
  });
}

export async function isWithinOperatingHours(reservationAt: Date): Promise<boolean> {
  const settings = await getRestaurantSettings();
  const hours = parseOperatingHours(settings.operatingHours);
  return isTimeWithinHours(reservationAt, hours);
}

export async function isOnValidSlotInterval(reservationAt: Date): Promise<boolean> {
  const settings = await getRestaurantSettings();
  return reservationAt.getMinutes() % settings.reservationSlotIntervalMinutes === 0;
}
