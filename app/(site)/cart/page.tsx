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
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-white">Your Cart</h1>
        {!isEmpty && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear your entire cart?")) clearCart();
            }}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Clear Cart
          </button>
        )}
      </div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <>
          <div className="bg-neutral-900 rounded-2xl border border-white/10 px-5 mb-6">
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