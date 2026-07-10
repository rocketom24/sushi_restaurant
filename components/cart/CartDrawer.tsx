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
        className="relative inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
      >
        Cart
        {isHydrated && totals.itemCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-neutral-900 text-white">
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
          <div className="relative w-full max-w-sm bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-neutral-900">Your Cart</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close cart"
                className="text-gray-400 hover:text-neutral-900 text-xl leading-none"
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
              <div className="px-5 py-4 border-t border-gray-100">
                <CartSummary />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}