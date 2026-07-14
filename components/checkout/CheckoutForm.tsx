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
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Order Type */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Order Type
        </label>

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
            className="mb-1 block text-sm font-medium"
          >
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

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="mb-1 block text-sm font-medium"
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
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>


      {/* Total */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>€{totals.grandTotal.toFixed(2)}</span>
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
        className="w-full rounded-md bg-neutral-900 py-3 font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
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