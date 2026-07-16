// components/cart/CartSummary.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function CartSummary({
  showCheckoutButton = true,
}: {
  showCheckoutButton?: boolean;
}) {
  const { totals } = useCart();
  const { dict } = useI18n();

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-400 font-light">
        <span>{dict.cart.subtotal}</span>
        <span>€{totals.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 font-light">
        <span>{dict.cart.discount}</span>
        <span>{dict.cart.atCheckout}</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 font-light">
        <span>{dict.cart.taxes}</span>
        <span>{dict.cart.atCheckout}</span>
      </div>
      <div className="flex justify-between items-baseline pt-3 border-t border-white/5">
        <span className="text-gray-400 text-sm">{dict.cart.total}</span>
        <span className="font-semibold text-lg text-cream">
          €{totals.grandTotal.toFixed(2)}
        </span>
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="mt-4 block w-full text-center bg-accent hover:bg-white hover:text-night text-white py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
        >
          {dict.cart.checkout} ({totals.itemCount})
        </Link>
      )}
    </div>
  );
}
