"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import KitchenTimer from "./KitchenTimer";
import { updateKitchenStatusAction } from "@/lib/actions/kitchen.actions";
import type { OrderStatus, OrderType } from "@/app/generated/prisma/client";

type KitchenOrderItem = {
  id: string;
  quantity: number;
  notes: string | null;
  menuItem: { name: string };
  customizations: { groupName: string; optionName: string }[];
};

type KitchenOrderData = {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  createdAt: Date;
  notes: string | null;
  user: { name: string } | null;
  table: { tableNumber: number } | null;
  orderItems: KitchenOrderItem[];
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "COMPLETED",
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: "Start Preparing",
  PREPARING: "Mark Ready",
  READY: "Complete Order",
};

function orderTypeLabel(order: KitchenOrderData): string {
  if (order.orderType === "DINE_IN") {
    return order.table ? `Table ${order.table.tableNumber}` : "Dine In";
  }
  if (order.orderType === "DELIVERY") return "Delivery";
  return "Pickup";
}

export default function KitchenCard({ order }: { order: KitchenOrderData }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const nextStatus = NEXT_STATUS[order.status];
  const nextLabel = NEXT_LABEL[order.status];

  function handleAdvance() {
    if (!nextStatus) return;
    startTransition(async () => {
      const result = await updateKitchenStatusAction(order.id, nextStatus);
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-neutral-900">{order.orderNumber}</p>
          <p className="text-xs text-gray-500">
            {orderTypeLabel(order)}
            {order.user?.name ? ` · ${order.user.name}` : ""}
          </p>
        </div>
        <KitchenTimer since={new Date(order.createdAt)} />
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-2">
        {order.orderItems.map((item) => (
          <div key={item.id} className="text-sm">
            <p className="text-neutral-900 font-medium">
              {item.quantity}× {item.menuItem.name}
            </p>
            {item.customizations.length > 0 && (
              <ul className="mt-0.5 pl-3 text-gray-600 text-xs space-y-0.5">
                {item.customizations.map((c, i) => (
                  <li key={i}>
                    • {c.groupName}: {c.optionName}
                  </li>
                ))}
              </ul>
            )}
            {item.notes && (
                <p className="mt-0.5 text-gray-500 text-xs">⚠ {item.notes}</p>
            )}
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="border-t border-gray-100 pt-2">
          <p className="text-xs font-medium text-amber-700">⚠ {order.notes}</p>
        </div>
      )}

      {nextStatus && nextLabel && (
        <button
          onClick={handleAdvance}
          disabled={isPending}
          className="mt-1 w-full rounded-md bg-neutral-900 text-white py-2 text-sm font-medium hover:bg-neutral-800 disabled:opacity-50"
        >
          {isPending ? "Updating..." : nextLabel}
        </button>
      )}
    </div>
  );
}