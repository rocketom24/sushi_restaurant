import Link from "next/link";
import OrderStatusBadge from "./OrderStatusBadge";
import type { OrderStatus, OrderType } from "@/app/generated/prisma/client";

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
      className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-300 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-neutral-900">{order.orderNumber}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            · {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="mt-3 flex justify-between items-center text-sm">
        <span className="text-gray-500">{order.orderType.replace("_", " ")}</span>
        <span className="font-semibold text-neutral-900">
          €{Number(order.totalAmount).toFixed(2)}
        </span>
      </div>
    </Link>
  );
}