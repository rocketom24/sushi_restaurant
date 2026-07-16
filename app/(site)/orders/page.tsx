import { getMyOrders } from "@/lib/actions/order.actions";
import { getDict } from "@/lib/i18n/server";
import OrderCard from "@/components/orders/OrderCard";

export default async function MyOrdersPage() {
  const [orders, t] = await Promise.all([getMyOrders(), getDict()]);

  // Serialize Decimal money fields before crossing into Client Components
  const serialized = orders.map((order) => ({
    ...order,
    totalAmount: Number(order.totalAmount),
  }));

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <span className="text-accent text-xs font-semibold uppercase tracking-widest">
        {t.orders.eyebrow}
      </span>
      <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2 mb-10">
        {t.orders.title}
      </h1>

      {serialized.length === 0 ? (
        <p className="text-gray-400 font-light text-center py-16">
          {t.orders.none}
        </p>
      ) : (
        <div className="space-y-4">
          {serialized.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
