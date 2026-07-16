"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, totals, isEmpty, isHydrated } = useCart();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Open cart, ${totals.itemCount} items`}
        className="relative inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm text-gray-300 hover:border-orange-500/60 hover:text-orange-400 transition-colors"
      >
        Cart
        {isHydrated && totals.itemCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-orange-600 text-white">
            {totals.itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* backdrop */}
          <button
            aria-label="Close cart"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* drawer panel */}
          <div className="relative w-full max-w-sm bg-neutral-950 border-l border-white/10 h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h2 className="font-serif text-lg text-white">Your Cart</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close cart"
                className="text-gray-500 hover:text-orange-400 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {!isHydrated ? (
                <div className="py-16 text-center text-gray-400 text-sm">
                  Loading cart...
                </div>
              ) : isEmpty ? (
                <EmptyCart />
              ) : (
                items.map((item) => <CartItem key={item.lineId} item={item} />)
              )}
            </div>

            {isHydrated && !isEmpty && (
              <div className="px-5 py-4 border-t border-white/10">
                <CartSummary />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}