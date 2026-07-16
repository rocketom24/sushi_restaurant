"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateReservationStatusAction } from "@/lib/actions/reservation.actions";
import type { ReservationStatus } from "@/app/generated/prisma/client";

const ACTION_STYLES: Partial<Record<ReservationStatus, string>> = {
  CONFIRMED: "bg-neutral-900 text-white",
  SEATED: "bg-neutral-900 text-white",
  COMPLETED: "bg-neutral-900 text-white",
  CANCELLED: "border border-red-300 text-red-600",
  NO_SHOW: "border border-orange-300 text-orange-600",
};

const CONFIRM_BEFORE: ReservationStatus[] = ["CANCELLED", "NO_SHOW"];

export default function ReservationStatusActions({
  reservationId,
  allowedTransitions,
}: {
  reservationId: string;
  allowedTransitions: ReservationStatus[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleUpdate(status: ReservationStatus) {
    if (CONFIRM_BEFORE.includes(status) && !confirm(`Mark this reservation as ${status.replace("_", " ")}?`)) {
      return;
    }
    startTransition(async () => {
      const result = await updateReservationStatusAction(reservationId, status);
      if (result.error) alert(result.error);
      else router.refresh();
    });
  }

  if (allowedTransitions.length === 0) {
    return <p className="text-sm text-gray-500">No further actions available.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {allowedTransitions.map((status) => (
        <button
          key={status}
          onClick={() => handleUpdate(status)}
          disabled={isPending}
          className={`rounded-md px-4 py-2 text-sm disabled:opacity-40 ${
            ACTION_STYLES[status] ?? "border border-gray-300 text-neutral-900"
          }`}
        >
          Mark {status.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}
