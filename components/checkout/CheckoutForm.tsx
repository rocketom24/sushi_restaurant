"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { createOrderAction } from "@/lib/actions/checkout.actions";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { startPaymentAction } from "@/lib/actions/payment.actions";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { PaymentMethod } from "@/app/generated/prisma/client";

export type SavedAddress = {
  id: string;
  label: string;
  fullAddress: string;
  city: string | null;
  postalCode: string | null;
  isDefault: boolean;
};

function formatAddress(a: SavedAddress): string {
  return [a.fullAddress, a.postalCode, a.city].filter(Boolean).join(", ");
}

export default function CheckoutForm({
  savedAddresses = [],
}: {
  savedAddresses?: SavedAddress[];
}) {
  const { items, totals, clearCart } = useCart();
  const { dict } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [orderType, setOrderType] = useState<
    "DINE_IN" | "TAKEAWAY" | "DELIVERY"
  >("TAKEAWAY");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("CASH");

  const defaultAddress = savedAddresses.find((a) => a.isDefault);
  const [deliveryAddress, setDeliveryAddress] = useState(
    defaultAddress ? formatAddress(defaultAddress) : ""
  );
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

  const orderTypeLabels = {
    TAKEAWAY: dict.checkout.takeaway,
    DELIVERY: dict.checkout.delivery,
    DINE_IN: dict.checkout.dineIn,
  } as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Order Type */}
      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-gray-400">
          {dict.checkout.orderType}
        </label>

        <div className="flex gap-2">
          {(["TAKEAWAY", "DELIVERY", "DINE_IN"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={`flex-1 rounded-full border px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                orderType === type
                  ? "border-accent bg-accent text-white"
                  : "border-white/10 text-gray-400 hover:border-white/30"
              }`}
            >
              {orderTypeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      {orderType === "DELIVERY" && (
        <div>
          <label
            htmlFor="deliveryAddress"
            className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400"
          >
            {dict.checkout.deliveryAddress}
          </label>

          {savedAddresses.length > 0 && (
            <select
              aria-label={dict.checkout.savedAddresses}
              defaultValue={defaultAddress?.id ?? ""}
              onChange={(e) => {
                const chosen = savedAddresses.find((a) => a.id === e.target.value);
                if (chosen) setDeliveryAddress(formatAddress(chosen));
              }}
              className="w-full mb-2 rounded-lg bg-white/3 border border-white/10 px-4 py-3 text-sm text-cream focus:outline-none focus:border-accent transition-colors"
            >
              <option value="">{dict.checkout.chooseSaved}</option>
              {savedAddresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} — {formatAddress(a)}
                </option>
              ))}
            </select>
          )}

          <textarea
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            rows={2}
            required
            className="w-full rounded-lg bg-white/3 border border-white/10 px-4 py-3 text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400"
        >
          {dict.checkout.notes}
        </label>

        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={250}
          rows={2}
          placeholder={dict.checkout.notesPlaceholder}
          className="w-full rounded-lg bg-white/3 border border-white/10 px-4 py-3 text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Total */}
      <div className="border-t border-white/5 pt-5">
        <div className="flex justify-between items-baseline">
          <span className="text-gray-400 text-sm">{dict.checkout.total}</span>
          <span className="font-serif text-2xl text-accent">
            €{totals.grandTotal.toFixed(2)}
          </span>
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
        className="w-full bg-accent hover:bg-white hover:text-night text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest disabled:opacity-50 transition-all duration-300"
      >
        {isPending
          ? dict.checkout.processing
          : paymentMethod === "CARD"
          ? dict.checkout.paySecure
          : dict.checkout.submit}
      </button>
    </form>
  );
}
