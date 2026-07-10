"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { createOrderAction } from "@/lib/actions/checkout.actions";

export default function CheckoutForm() {
  const { items, totals, clearCart } = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [orderType, setOrderType] = useState<"DINE_IN" | "TAKEAWAY" | "DELIVERY">(
    "TAKEAWAY"
  );
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createOrderAction({
        orderType,
        deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : undefined,
        notes: notes || undefined,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          customizationOptionIds: item.customizations.map((c) => c.optionId),
          specialInstructions: item.specialInstructions,
        })),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      clearCart();
      router.push(`/orders/${result.orderId}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Order Type</label>
        <div className="flex gap-2">
          {(["TAKEAWAY", "DELIVERY", "DINE_IN"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                orderType === type
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {type === "DINE_IN" ? "Dine In" : type === "TAKEAWAY" ? "Takeaway" : "Delivery"}
            </button>
          ))}
        </div>
      </div>

      {orderType === "DELIVERY" && (
        <div>
          <label htmlFor="deliveryAddress" className="block text-sm font-medium mb-1">
            Delivery Address
          </label>
          <textarea
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            rows={2}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Order Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={250}
          rows={2}
          placeholder="e.g. Less spicy, ring the bell"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>€{totals.grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || items.length === 0}
        className="w-full rounded-md bg-neutral-900 text-white py-3 font-medium hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
}