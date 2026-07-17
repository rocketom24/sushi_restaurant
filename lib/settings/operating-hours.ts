// lib/settings/operating-hours.ts
//
// Pure types and helpers for restaurant operating hours — deliberately
// free of any server-only import (no prisma) so Client Components can
// import this safely. lib/settings/settings.ts re-exports all of this
// alongside the DB-touching singleton getter for server code.

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export type DayHours = {
  day: DayOfWeek;
  closed: boolean;
  lunchOpen: string | null; // "HH:MM"
  lunchClose: string | null;
  dinnerOpen: string | null;
  dinnerClose: string | null;
};

export type OperatingHours = DayHours[];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function dayName(day: DayOfWeek): string {
  return DAY_NAMES[day];
}

/** Matches the hours that were previously hardcoded in availability.ts. */
export function defaultOperatingHours(): OperatingHours {
  return [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    day: day as DayOfWeek,
    closed: false,
    lunchOpen: "12:00",
    lunchClose: "14:30",
    dinnerOpen: "18:00",
    dinnerClose: "22:30",
  }));
}

/** Parses the JSON column into typed OperatingHours, tolerating a corrupt/empty value. */
export function parseOperatingHours(value: unknown): OperatingHours {
  if (Array.isArray(value) && value.length === 7) {
    return value as OperatingHours;
  }
  return defaultOperatingHours();
}

export function getDayHours(hours: OperatingHours, day: DayOfWeek): DayHours {
  return hours.find((h) => h.day === day) ?? defaultOperatingHours()[day];
}

/** "12:00" -> 720 minutes since midnight. */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** True if `at` falls inside a lunch or dinner shift for its day of week. */
export function isTimeWithinHours(at: Date, hours: OperatingHours): boolean {
  const day = getDayHours(hours, at.getDay() as DayOfWeek);
  if (day.closed) return false;

  const totalMinutes = at.getHours() * 60 + at.getMinutes();

  const inLunch =
    day.lunchOpen &&
    day.lunchClose &&
    totalMinutes >= timeToMinutes(day.lunchOpen) &&
    totalMinutes <= timeToMinutes(day.lunchClose);

  const inDinner =
    day.dinnerOpen &&
    day.dinnerClose &&
    totalMinutes >= timeToMinutes(day.dinnerOpen) &&
    totalMinutes <= timeToMinutes(day.dinnerClose);

  return Boolean(inLunch || inDinner);
}

/** All "HH:MM" slots (at the given interval) across every day's shifts — for populating a time <select>. */
export function allPossibleSlots(
  hours: OperatingHours,
  intervalMinutes: number
): string[] {
  const slots = new Set<string>();

  for (const day of hours) {
    if (day.closed) continue;
    for (const [open, close] of [
      [day.lunchOpen, day.lunchClose],
      [day.dinnerOpen, day.dinnerClose],
    ] as const) {
      if (!open || !close) continue;
      let m = timeToMinutes(open);
      const end = timeToMinutes(close);
      while (m <= end) {
        const hh = String(Math.floor(m / 60)).padStart(2, "0");
        const mm = String(m % 60).padStart(2, "0");
        slots.add(`${hh}:${mm}`);
        m += intervalMinutes;
      }
    }
  }

  return Array.from(slots).sort();
}
