import { notFound } from "next/navigation";
import { getMyOrderById } from "@/lib/actions/order.actions";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import CancelOrderButton from "@/components/orders/CancelOrderButton";
import { canCustomerCancel } from "@/lib/orders/status-transitions";

export default async function MyOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getMyOrderById(id);

  if (!order) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="flex items-start justify-between mb-10">
        <div>
          <span className="text-accent text-xs font-semibold uppercase tracking-widest">
            {"// Ordine"}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2">
            {order.orderNumber}
          </h1>
          <p className="text-xs text-gray-500 font-light mt-2">
            {new Date(order.createdAt).toLocaleString("it-IT")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} variant="dark" />
      </div>

      <div className="glass rounded-3xl p-6 mb-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Articoli
        </h2>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="text-cream font-light">
                  {item.quantity}× {item.menuItem.name}
                </p>
                {item.customizations.length > 0 && (
                  <ul className="text-gray-500 font-light text-xs mt-1">
                    {item.customizations.map((c) => (
                      <li key={c.id}>
                        {c.groupName}: {c.optionName}
                      </li>
                    ))}
                  </ul>
                )}
                {item.notes && (
                  <p className="text-gray-500 font-light italic text-xs mt-1">
                    "{item.notes}"
                  </p>
                )}
              </div>
              <span className="text-cream font-light">
                €{Number(item.subtotal).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-6 mb-5 space-y-2 text-sm">
        <div className="flex justify-between text-gray-400 font-light">
          <span>Subtotale</span>
          <span>€{Number(order.subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-baseline pt-3 border-t border-white/5">
          <span className="text-gray-400">Totale</span>
          <span className="font-serif text-xl text-accent">
            €{Number(order.totalAmount).toFixed(2)}
          </span>
        </div>
      </div>

      {order.orderType === "DELIVERY" && order.deliveryAddress && (
        <div className="glass rounded-3xl p-6 mb-5 text-sm">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Indirizzo di Consegna
          </h2>
          <p className="text-cream font-light">{order.deliveryAddress}</p>
        </div>
      )}

      {canCustomerCancel(order.status) && (
        <div className="text-right">
          <CancelOrderButton orderId={order.id} />
        </div>
      )}
    </div>
  );
}
