import Link from "next/link";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import type { OrderStatus, OrderType } from "@/app/generated/prisma/client";

type OrderRow = {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  totalAmount: unknown;
  createdAt: Date;
  user: { name: string; email: string } | null;
  orderItems: { id: string }[];
  payments: { status: string }[];
};

export default function OrdersTable({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) {
    return <p className="text-gray-500 text-center py-12">No orders found.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-left text-gray-500">
          <th className="py-3 px-4">Order #</th>
          <th className="py-3 px-4">Customer</th>
          <th className="py-3 px-4">Type</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Payment</th>
          <th className="py-3 px-4">Items</th>
          <th className="py-3 px-4">Total</th>
          <th className="py-3 px-4">Created</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-3 px-4">
              <Link
                href={`/dashboard/orders/${order.id}`}
                className="font-medium text-neutral-900 underline"
              >
                {order.orderNumber}
              </Link>
            </td>
            <td className="py-3 px-4 text-gray-600">
              {order.user?.name ?? "—"}
            </td>
            <td className="py-3 px-4 text-gray-600">
              {order.orderType.replace("_", " ")}
            </td>
            <td className="py-3 px-4">
              <OrderStatusBadge status={order.status} />
            </td>
            <td className="py-3 px-4 text-gray-600">
              {order.payments[0]?.status ?? "—"}
            </td>
            <td className="py-3 px-4 text-gray-600">{order.orderItems.length}</td>
            <td className="py-3 px-4 font-medium">
              €{Number(order.totalAmount).toFixed(2)}
            </td>
            <td className="py-3 px-4 text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("en-GB")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}