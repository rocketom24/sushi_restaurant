"use client";

import { useCartContext } from "@/components/cart/CartProvider";
import { calculateCartTotals } from "@/lib/cart/cart-utils";

export function useCart() {
  const { cart, isHydrated, addItem, updateQuantity, removeItem, clearCart } =
    useCartContext();

  const totals = calculateCartTotals(cart);

  return {
    items: cart.items,
    totals,
    isHydrated,
    isEmpty: cart.items.length === 0,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}