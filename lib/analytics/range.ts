// lib/analytics/range.ts
//
// Shared date-range type/helper for the analytics dashboard. Kept out
// of lib/actions/analytics.actions.ts because every export from a
// "use server" file must be an async function — this one isn't.

export type AnalyticsRange = "today" | "week" | "month" | "year" | "all";

export function rangeToSince(range: AnalyticsRange): Date {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  switch (range) {
    case "today":
      return start;
    case "week": {
      const day = start.getDay();
      start.setDate(start.getDate() - ((day + 6) % 7));
      return start;
    }
    case "month":
      start.setDate(1);
      return start;
    case "year":
      start.setMonth(0, 1);
      return start;
    case "all":
      return new Date(0);
  }
}
