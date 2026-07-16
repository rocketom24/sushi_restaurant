import { STATUS_LABELS, STATUS_COLORS } from "@/lib/orders/status-transitions";
import type { OrderStatus } from "@/app/generated/prisma/client";

/** Dark-surface variants for the customer-facing site (owner dashboard stays light). */
const DARK_STATUS_COLORS: Record<OrderStatus, string> = {
  NEW: "bg-yellow-500/15 text-yellow-300",
  CONFIRMED: "bg-blue-500/15 text-blue-300",
  PREPARING: "bg-purple-500/15 text-purple-300",
  READY: "bg-emerald-500/15 text-emerald-300",
  COMPLETED: "bg-white/10 text-gray-300",
  CANCELLED: "bg-red-500/15 text-red-300",
};

export default function OrderStatusBadge({
  status,
  variant = "light",
  label,
}: {
  status: OrderStatus;
  variant?: "light" | "dark";
  /** Optional translated label; defaults to the English dashboard label. */
  label?: string;
}) {
  const colors = variant === "dark" ? DARK_STATUS_COLORS[status] : STATUS_COLORS[status];

  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${colors}`}
    >
      {label ?? STATUS_LABELS[status]}
    </span>
  );
}
