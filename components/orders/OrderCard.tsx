import Link from "next/link";
import OrderStatusBadge from "./OrderStatusBadge";
import type { OrderStatus, OrderType } from "@/app/generated/prisma/client";

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  DINE_IN: "Al Tavolo",
  TAKEAWAY: "Asporto",
  DELIVERY: "Consegna",
};

type OrderCardData = {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  totalAmount: unknown;
  createdAt: Date;
  orderItems: { id: string }[];
};

export default function OrderCard({ order }: { order: OrderCardData }) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="glass block rounded-3xl p-5 group hover:-translate-y-1 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-serif text-lg text-cream group-hover:text-accent transition-colors duration-300">
            {order.orderNumber}
          </p>
          <p className="text-xs text-gray-500 font-light mt-1">
            {new Date(order.createdAt).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            · {order.orderItems.length} articol{order.orderItems.length !== 1 ? "i" : "o"}
          </p>
        </div>
        <OrderStatusBadge status={order.status} variant="dark" />
      </div>
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
        <span className="text-[10px] tracking-wider text-gray-500 uppercase">
          {ORDER_TYPE_LABELS[order.orderType]}
        </span>
        <span className="text-sm font-semibold text-accent">
          €{Number(order.totalAmount).toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
