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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleString("en-GB")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h2 className="font-medium text-neutral-900 mb-3">Items</h2>
        <div className="space-y-3">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="text-neutral-900">
                  {item.quantity}× {item.menuItem.name}
                </p>
                {item.customizations.length > 0 && (
                  <ul className="text-gray-500 mt-0.5">
                    {item.customizations.map((c) => (
                      <li key={c.id}>
                        {c.groupName}: {c.optionName}
                      </li>
                    ))}
                  </ul>
                )}
                {item.notes && (
                  <p className="text-gray-500 italic mt-0.5">"{item.notes}"</p>
                )}
              </div>
              <span className="text-neutral-900">
                €{Number(item.subtotal).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 space-y-1 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>€{Number(order.subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-neutral-900 pt-2 border-t border-gray-100">
          <span>Total</span>
          <span>€{Number(order.totalAmount).toFixed(2)}</span>
        </div>
      </div>

      {order.orderType === "DELIVERY" && order.deliveryAddress && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 text-sm">
          <h2 className="font-medium text-neutral-900 mb-1">Delivery Address</h2>
          <p className="text-gray-600">{order.deliveryAddress}</p>
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