// components/cart/CartSummary.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function CartSummary({
  showCheckoutButton = true,
}: {
  showCheckoutButton?: boolean;
}) {
  const { totals } = useCart();

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-400 font-light">
        <span>Totale Parziale</span>
        <span>€{totals.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 font-light">
        <span>Sconto</span>
        <span>Calcolato alla cassa</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 font-light">
        <span>Tasse</span>
        <span>Calcolate alla cassa</span>
      </div>
      <div className="flex justify-between items-baseline pt-3 border-t border-white/5">
        <span className="text-gray-400 text-sm">Totale</span>
        <span className="font-semibold text-lg text-cream">
          €{totals.grandTotal.toFixed(2)}
        </span>
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="mt-4 block w-full text-center bg-accent hover:bg-white hover:text-night text-white py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
        >
          Vai alla Cassa ({totals.itemCount})
        </Link>
      )}
    </div>
  );
}
