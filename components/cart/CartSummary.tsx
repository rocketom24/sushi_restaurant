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
    <div className="border-t border-gray-200 pt-4 space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span>€{totals.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-400">
        <span>Discount</span>
        <span>Calculated at checkout</span>
      </div>
      <div className="flex justify-between text-sm text-gray-400">
        <span>Tax</span>
        <span>Calculated at checkout</span>
      </div>
      <div className="flex justify-between font-semibold text-neutral-900 text-lg pt-2 border-t border-gray-100">
        <span>Total</span>
        <span>€{totals.grandTotal.toFixed(2)}</span>
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="mt-4 block w-full text-center rounded-md bg-neutral-900 text-white py-3 font-medium hover:bg-neutral-800 transition-colors"
        >
          Checkout ({totals.itemCount})
        </Link>
      )}
    </div>
  );
}