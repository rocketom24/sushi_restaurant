"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelMyOrderAction } from "@/lib/actions/order.actions";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCancel() {
    if (!confirm("Annullare questo ordine? L'operazione è irreversibile.")) return;

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
      {isPending ? "Annullamento..." : "Annulla Ordine"}
    </button>
  );
}
