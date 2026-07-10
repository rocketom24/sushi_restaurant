"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatusAction } from "@/lib/actions/admin-order.actions";
import type { OrderStatus } from "@/app/generated/prisma/client";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  NEW: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "COMPLETED",
};

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const nextStatus = NEXT_STATUS[currentStatus];
  const canCancel = currentStatus === "NEW" || currentStatus === "CONFIRMED";

  function handleUpdate(status: OrderStatus) {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, status);
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex gap-2">
      {nextStatus && (
        <button
          onClick={() => handleUpdate(nextStatus)}
          disabled={isPending}
          className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 disabled:opacity-50"
        >
          {isPending ? "Updating..." : `Move to ${nextStatus}`}
        </button>
      )}
      {canCancel && (
        <button
          onClick={() => {
            if (confirm("Cancel this order?")) handleUpdate("CANCELLED");
          }}
          disabled={isPending}
          className="rounded-md border border-red-300 text-red-600 px-4 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
        >
          Cancel
        </button>
      )}
    </div>
  );
}