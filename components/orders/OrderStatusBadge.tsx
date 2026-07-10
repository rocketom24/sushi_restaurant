import { STATUS_LABELS, STATUS_COLORS } from "@/lib/orders/status-transitions";
import type { OrderStatus } from "@/app/generated/prisma/client";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}