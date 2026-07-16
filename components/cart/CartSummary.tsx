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
    <div className="border-t border-white/10 pt-4 space-y-2">
      <div className="flex justify-between text-sm text-gray-400">
        <span>Subtotal</span>
        <span>€{totals.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Discount</span>
        <span>Calculated at checkout</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Tax</span>
        <span>Calculated at checkout</span>
      </div>
      <div className="flex justify-between font-semibold text-white text-lg pt-2 border-t border-white/10">
        <span>Total</span>
        <span className="text-orange-400">€{totals.grandTotal.toFixed(2)}</span>
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="mt-4 block w-full text-center rounded-md bg-orange-600 text-white py-3 font-medium hover:bg-orange-500 transition-colors"
        >
          Checkout ({totals.itemCount})
        </Link>
      )}
    </div>
  );
}