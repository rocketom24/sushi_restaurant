// components/reservations/CancelReservationButton.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelMyReservationAction } from "@/lib/actions/reservation.actions";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function CancelReservationButton({ reservationId }: { reservationId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { dict } = useI18n();

  function handleCancel() {
    if (!confirm(dict.reservations.cancelConfirm)) return;
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
      className="text-xs uppercase tracking-wider text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
    >
      {isPending ? dict.reservations.cancelling : dict.reservations.cancel}
    </button>
  );
}
