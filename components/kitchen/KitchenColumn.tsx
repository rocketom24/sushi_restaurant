import KitchenCard from "./KitchenCard";
import type { OrderStatus, OrderType } from "@/app/generated/prisma/client";

type KitchenOrderData = {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  createdAt: Date;
  notes: string | null;
  user: { name: string } | null;
  table: { tableNumber: number } | null;
  orderItems: {
    id: string;
    quantity: number;
    notes: string | null;
    menuItem: { name: string };
    customizations: { groupName: string; optionName: string }[];
  }[];
};

export default function KitchenColumn({
  title,
  orders,
}: {
  title: string;
  orders: KitchenOrderData[];
}) {
  return (
    <div className="flex-1 min-w-70">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="font-medium text-neutral-900">{title}</h2>
        <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
          {orders.length}
        </span>
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No orders.</p>
        ) : (
          orders.map((order) => <KitchenCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}