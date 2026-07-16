// components/reservations/CancelReservationButton.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelMyReservationAction } from "@/lib/actions/reservation.actions";

export default function CancelReservationButton({ reservationId }: { reservationId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCancel() {
    if (!confirm("Cancel this reservation?")) return;
    startTransition(async () => {
      const result = await cancelMyReservationAction(reservationId);
      if (result.error) alert(result.error);
      else router.refresh();
    });
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Cancelling..." : "Cancel Reservation"}
    </button>
  );
}