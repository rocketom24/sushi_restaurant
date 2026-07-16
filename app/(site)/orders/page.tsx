import { getMyOrders } from "@/lib/actions/order.actions";
import OrderCard from "@/components/orders/OrderCard";

export default async function MyOrdersPage() {
  const orders = await getMyOrders();

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <span className="text-accent text-xs font-semibold uppercase tracking-widest">
        {"// Storico"}
      </span>
      <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2 mb-10">
        I Miei Ordini
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-400 font-light text-center py-16">
          Nessun ordine trovato.
        </p>
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