import { getMyOrders } from "@/lib/actions/order.actions";
import OrderCard from "@/components/orders/OrderCard";

export default async function MyOrdersPage() {
  const orders = await getMyOrders();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No orders found.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}