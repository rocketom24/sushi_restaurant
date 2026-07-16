"use client";

import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

export default function CartPage() {
  const { items, isEmpty, isHydrated, clearCart } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center text-gray-400 font-light">
        Caricamento carrello...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-cream">Il Tuo Carrello</h1>
        {!isEmpty && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Svuotare tutto il carrello?")) clearCart();
            }}
            className="text-xs uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
          >
            Svuota Carrello
          </button>
        )}
      </div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <>
          <div className="mb-8">
            {items.map((item) => (
              <CartItem key={item.lineId} item={item} />
            ))}
          </div>
          <div className="glass rounded-3xl p-6">
            <CartSummary />
          </div>
        </>
      )}
    </div>
  );
}
