"use client";

import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

export default function CartPage() {
  const { items, isEmpty, isHydrated, clearCart } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">Your Cart</h1>
        {!isEmpty && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear your entire cart?")) clearCart();
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear Cart
          </button>
        )}
      </div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-100 px-5">
            {items.map((item) => (
              <CartItem key={item.lineId} item={item} />
            ))}
          </div>
          <CartSummary />
        </>
      )}
    </div>
  );
}