import type { ReservationStatus } from "@/app/generated/prisma/client";

const ALLOWED_TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SEATED", "NO_SHOW", "CANCELLED"],
  SEATED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export function getAllowedTransitions(from: ReservationStatus): ReservationStatus[] {
  return ALLOWED_TRANSITIONS[from] ?? [];
}

export function isValidReservationTransition(
  from: ReservationStatus,
  to: ReservationStatus
): boolean {
  if (from === to) return false;
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Customers may only cancel while still PENDING or CONFIRMED, and
 * only up to a configurable cutoff before the reservation time. */
export function canCustomerCancel(
  status: ReservationStatus,
  reservationAt: Date,
  cutoffHours = 2
): boolean {
  if (status !== "PENDING" && status !== "CONFIRMED") return false;
  const cutoffMs = cutoffHours * 60 * 60 * 1000;
  return reservationAt.getTime() - Date.now() > cutoffMs;
}

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SEATED: "Seated",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
};

export const STATUS_COLORS: Record<ReservationStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SEATED: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-orange-100 text-orange-800",
};