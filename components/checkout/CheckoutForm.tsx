"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { createOrderAction } from "@/lib/actions/checkout.actions";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { startPaymentAction } from "@/lib/actions/payment.actions";
import type { PaymentMethod } from "@/app/generated/prisma/client";

export default function CheckoutForm() {
  const { items, totals, clearCart } = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [orderType, setOrderType] = useState<
    "DINE_IN" | "TAKEAWAY" | "DELIVERY"
  >("TAKEAWAY");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("CASH");

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createOrderAction({
        orderType,
        deliveryAddress:
          orderType === "DELIVERY" ? deliveryAddress : undefined,
        notes: notes || undefined,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          customizationOptionIds: item.customizations.map(
            (c) => c.optionId
          ),
          specialInstructions: item.specialInstructions,
        })),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Start payment after order creation
      const paymentResult = await startPaymentAction(
        result.orderId,
        paymentMethod
      );

      if (!paymentResult.success) {
        setError(paymentResult.error);
        return;
      }

      // Card payment -> Stripe
      if (paymentResult.clientSecret) {
        clearCart();

        router.push(
          `/checkout/payment?orderId=${result.orderId}&clientSecret=${paymentResult.clientSecret}`
        );
        return;
      }

      // Cash / other offline payments
      clearCart();
      router.push(`/orders/${result.orderId}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Order Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Order Type
        </label>

        <div className="flex gap-2">
          {(["TAKEAWAY", "DELIVERY", "DINE_IN"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                orderType === type
                  ? "border-orange-500 bg-orange-600 text-white"
                  : "border-white/15 text-gray-300 hover:border-white/30"
              }`}
            >
              {type === "DINE_IN"
                ? "Dine In"
                : type === "TAKEAWAY"
                ? "Takeaway"
                : "Delivery"}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      {orderType === "DELIVERY" && (
        <div>
          <label
            htmlFor="deliveryAddress"
            className="mb-1 block text-sm font-medium text-gray-300"
          >
            Delivery Address
          </label>

          <textarea
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            rows={2}
            required
            className="w-full rounded-md bg-neutral-900 border border-white/15 px-3 py-2 text-neutral-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="mb-1 block text-sm font-medium text-gray-300"
        >
          Order Notes (optional)
        </label>

        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={250}
          rows={2}
          placeholder="e.g. Less spicy, ring the bell"
          className="w-full rounded-md bg-neutral-900 border border-white/15 px-3 py-2 text-neutral-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
        />
      </div>


      {/* Total */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between text-lg font-semibold text-white">
          <span>Total</span>
          <span className="text-orange-400">€{totals.grandTotal.toFixed(2)}</span>
        </div>
      </div>

        
          {/* Payment Method */}
      <PaymentMethodSelector
        value={paymentMethod}
        onChange={setPaymentMethod}
      />

      
      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || items.length === 0}
        className="w-full rounded-md bg-orange-600 py-3 font-medium text-white hover:bg-orange-500 disabled:opacity-50 transition-colors"
      >
        {isPending
          ? "Processing..."
          : paymentMethod === "CARD"
          ? "Continue to Secure Payment"
          : "Place Order"}
      </button>
    </form>
  );
}