"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReservationStatusBadge from "@/components/reservations/ReservationStatusBadge";
import { updateReservationStatusAction } from "@/lib/actions/reservation.actions";
import type { ReservationStatus } from "@/app/generated/prisma/client";

const NEXT_STATUS: Partial<Record<ReservationStatus, ReservationStatus>> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "SEATED",
  SEATED: "COMPLETED",
};

type ReservationRow = {
  id: string;
  customerName: string;
  phone: string;
  reservationAt: Date;
  guestCount: number;
  status: ReservationStatus;
  table: { tableNumber: number } | null;
};

export default function ReservationsTable({ reservations }: { reservations: ReservationRow[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAdvance(id: string, status: ReservationStatus) {
    startTransition(async () => {
      const result = await updateReservationStatusAction(id, status);
      if (result.error) alert(result.error);
      else router.refresh();
    });
  }

  function handleNoShow(id: string) {
    if (!confirm("Mark as no-show?")) return;
    handleAdvance(id, "NO_SHOW");
  }

  if (reservations.length === 0) {
    return <p className="text-gray-500 text-center py-12">No reservations found.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-left text-gray-500">
          <th className="py-3 px-4">Customer</th>
          <th className="py-3 px-4">Date & Time</th>
          <th className="py-3 px-4">Guests</th>
          <th className="py-3 px-4">Table</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((r) => {
          const nextStatus = NEXT_STATUS[r.status];
          return (
            <tr key={r.id} className="border-b border-gray-100">
              <td className="py-3 px-4">
                <Link href={`/dashboard/reservations/${r.id}`} className="font-medium underline">
                  {r.customerName}
                </Link>
                <p className="text-xs text-gray-500">{r.phone}</p>
              </td>
              <td className="py-3 px-4 text-gray-600">
                {new Date(r.reservationAt).toLocaleString("en-GB", {
                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </td>
              <td className="py-3 px-4 text-gray-600">{r.guestCount}</td>
              <td className="py-3 px-4 text-gray-600">
                {r.table ? `Table ${r.table.tableNumber}` : "—"}
              </td>
              <td className="py-3 px-4">
                <ReservationStatusBadge status={r.status} />
              </td>
              <td className="py-3 px-4 space-x-2">
                {nextStatus && (
                  <button
                    onClick={() => handleAdvance(r.id, nextStatus)}
                    disabled={isPending}
                    className="text-neutral-900 underline text-xs"
                  >
                    Mark {nextStatus}
                  </button>
                )}
                {r.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleNoShow(r.id)}
                    disabled={isPending}
                    className="text-orange-600 underline text-xs"
                  >
                    No Show
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}