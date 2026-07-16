"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
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
        aria-label={`Apri il carrello, ${totals.itemCount} articoli`}
        className="relative p-2 text-cream hover:text-accent transition-colors duration-300 focus:outline-none"
      >
        {isHydrated && totals.itemCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {totals.itemCount}
          </span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </button>

      {/* Portaled to <body>: the header's backdrop-blur creates a CSS
          containing block, which would otherwise trap this fixed overlay
          inside the 72px-tall header. */}
      {isOpen &&
        createPortal(
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* backdrop */}
          <button
            aria-label="Chiudi il carrello"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          {/* drawer panel */}
          <div className="relative w-full sm:w-96 bg-carbon border-l border-white/5 h-full shadow-2xl flex flex-col p-6">
            <div className="flex justify-between items-center pb-6 border-b border-white/5">
              <h2 className="font-serif text-2xl text-cream">Il Tuo Ordine</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Chiudi il carrello"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pt-4">
              {!isHydrated ? (
                <div className="py-16 text-center text-gray-400 text-sm font-light">
                  Caricamento carrello...
                </div>
              ) : isEmpty ? (
                <EmptyCart />
              ) : (
                items.map((item) => <CartItem key={item.lineId} item={item} />)
              )}
            </div>

            {isHydrated && !isEmpty && (
              <div className="pt-6 border-t border-white/5">
                <CartSummary />
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
