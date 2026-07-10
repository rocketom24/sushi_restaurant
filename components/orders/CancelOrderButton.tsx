"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelMyOrderAction } from "@/lib/actions/order.actions";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCancel() {
    if (!confirm("Cancel this order? This cannot be undone.")) return;

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
      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}