"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireOwner } from "@/lib/guards";
import { reservationSchema, type ReservationFormState } from "@/lib/validations/reservation";
import {
  findAvailableTable,
  hasConflictingReservation,
  isWithinOperatingHours,
  isOnValidSlotInterval,
} from "@/lib/reservations/availability";
import {
  isValidReservationTransition,
  canCustomerCancel,
} from "@/lib/reservations/status-transitions";
import type { ReservationStatus } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// lib/actions/reservation.actions.ts

export async function createReservationAction(
  _prevState: ReservationFormState,
  formData: FormData
): Promise<ReservationFormState> {
  const user = await requireAuth();

  const raw = {
    reservationDate: formData.get("reservationDate") as string,
    reservationTime: formData.get("reservationTime") as string,
    guestCount: formData.get("guestCount") as string,
    specialRequest: formData.get("specialRequest") as string,
    customerName: formData.get("customerName") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
  };

  const validated = reservationSchema.safeParse(raw);

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { reservationDate, reservationTime, guestCount, specialRequest, customerName, phone, email } =
    validated.data;

  const reservationAt = new Date(`${reservationDate}T${reservationTime}:00`);

  if (isNaN(reservationAt.getTime())) {
    return { errors: { _form: ["Invalid date or time."] } };
  }

  if (reservationAt.getTime() <= Date.now()) {
    return { errors: { reservationDate: ["Reservation cannot be in the past."] } };
  }

  if (!isOnValidSlotInterval(reservationAt)) {
    return { errors: { reservationTime: ["Please select a valid time slot."] } };
  }

  if (!isWithinOperatingHours(reservationAt)) {
    return { errors: { reservationTime: ["This time is outside our opening hours."] } };
  }

  const tableId = await findAvailableTable(reservationAt, guestCount);

  if (!tableId) {
    return {
      errors: {
        _form: ["Sorry, we're fully booked for that time. Please try a different time or date."],
      },
    };
  }

  let reservationId: string;

  try {
    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        phone,
        email: email || null,
        guestCount,
        reservationAt,
        status: "PENDING",
        source: "ONLINE",
        tableId,
        specialRequest: specialRequest || null,
        userId: user.id,
      },
    });

    reservationId = reservation.id;
  } catch (err) {
    console.error("Reservation creation error:", err);
    return { errors: { _form: ["Something went wrong. Please try again."] } };
  }

  // redirect() throws internally by design — it must NEVER be inside
  // a try/catch, or the catch block swallows it and reports a false
  // failure even though the operation succeeded.
  revalidatePath("/reservations");
  redirect(`/reservations/${reservationId}`);
}

export async function getMyReservations() {
  const user = await requireAuth();

  return prisma.reservation.findMany({
    where: { userId: user.id, deletedAt: null },
    include: { table: { select: { tableNumber: true } } },
    orderBy: { reservationAt: "desc" },
  });
}

export async function getMyReservationById(reservationId: string) {
  const user = await requireAuth();

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId, deletedAt: null },
    include: { table: { select: { tableNumber: true, capacity: true } } },
  });

  if (!reservation || reservation.userId !== user.id) return null;

  return reservation;
}

export async function cancelMyReservationAction(reservationId: string) {
  const user = await requireAuth();

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId, deletedAt: null },
  });

  if (!reservation || reservation.userId !== user.id) {
    return { error: "Reservation not found." };
  }

  if (!canCustomerCancel(reservation.status, reservation.reservationAt)) {
    return {
      error: "This reservation can no longer be cancelled online. Please call us.",
    };
  }

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/reservations");
  revalidatePath(`/reservations/${reservationId}`);
  return { success: true };
}

// ============ OWNER ACTIONS ============

export async function getAllReservations(filters: {
  status?: ReservationStatus;
  date?: string;
  search?: string;
} = {}) {
  await requireOwner();

  const { status, date, search } = filters;

  const where = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(date
      ? {
          reservationAt: {
            gte: new Date(`${date}T00:00:00`),
            lt: new Date(`${date}T23:59:59`),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { customerName: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search } },
          ],
        }
      : {}),
  };

  return prisma.reservation.findMany({
    where,
    include: { table: { select: { tableNumber: true } }, user: { select: { name: true, email: true } } },
    orderBy: { reservationAt: "asc" },
  });
}

export async function getReservationStats() {
  await requireOwner();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  const [today, pending, confirmed, seated] = await Promise.all([
    prisma.reservation.count({
      where: {
        deletedAt: null,
        reservationAt: { gte: startOfToday, lt: endOfToday },
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
      },
    }),
    prisma.reservation.count({ where: { deletedAt: null, status: "PENDING" } }),
    prisma.reservation.count({ where: { deletedAt: null, status: "CONFIRMED" } }),
    prisma.reservation.count({ where: { deletedAt: null, status: "SEATED" } }),
  ]);

  return { today, pending, confirmed, seated };
}

/** Active-reservation counts per local calendar day, for the dashboard day strip. */
export async function getReservationDayCounts(days = 7) {
  await requireOwner();

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

  const reservations = await prisma.reservation.findMany({
    where: {
      deletedAt: null,
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
      reservationAt: { gte: start, lt: end },
    },
    select: { reservationAt: true },
  });

  const counts: Record<string, number> = {};
  for (const r of reservations) {
    const d = r.reservationAt;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return counts;
}

export async function getReservationByIdForOwner(reservationId: string) {
  await requireOwner();

  return prisma.reservation.findUnique({
    where: { id: reservationId, deletedAt: null },
    include: {
      table: { select: { tableNumber: true, capacity: true } },
      user: { select: { name: true, email: true } },
    },
  });
}

export async function updateReservationStatusAction(
  reservationId: string,
  newStatus: ReservationStatus
) {
  await requireOwner();

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId, deletedAt: null },
  });

  if (!reservation) return { error: "Reservation not found." };

  if (!isValidReservationTransition(reservation.status, newStatus)) {
    return { error: `Cannot move from ${reservation.status} to ${newStatus}.` };
  }

  await prisma.reservation.update({
    where: { id: reservationId },
    data: {
      status: newStatus,
      arrivedAt: newStatus === "SEATED" ? new Date() : reservation.arrivedAt,
    },
  });

  revalidatePath("/dashboard/reservations");
  revalidatePath(`/dashboard/reservations/${reservationId}`);
  return { success: true };
}

export async function assignTableAction(reservationId: string, tableId: string) {
  await requireOwner();

  const table = await prisma.table.findUnique({
    where: { id: tableId, deletedAt: null },
  });

  if (!table) return { error: "Table not found." };

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId, deletedAt: null },
  });

  if (!reservation) return { error: "Reservation not found." };

  const busy = await hasConflictingReservation(
    tableId,
    reservation.reservationAt,
    reservationId
  );

  if (busy) {
    return {
      error: `Table ${table.tableNumber} already has a reservation around that time.`,
    };
  }

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { tableId },
  });

  revalidatePath("/dashboard/reservations");
  revalidatePath(`/dashboard/reservations/${reservationId}`);
  return { success: true };
}

export async function getAvailableTablesForReassignment() {
  await requireOwner();

  return prisma.table.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { tableNumber: "asc" },
  });
}