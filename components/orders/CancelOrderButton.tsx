"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelMyOrderAction } from "@/lib/actions/order.actions";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { dict } = useI18n();

  function handleCancel() {
    if (!confirm(dict.orders.cancelConfirm)) return;

    startTransition(async () => {
      const result = await cancelMyOrderAction(orderId);
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="text-xs uppercase tracking-wider text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
    >
      {isPending ? dict.orders.cancelling : dict.orders.cancel}
    </button>
  );
}
