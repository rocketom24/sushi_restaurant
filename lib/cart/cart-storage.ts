// lib/cart/cart-storage.ts

import type { Cart } from "@/types/cart";

const CART_STORAGE_KEY = "sushi_restaurant_cart_v1";

const EMPTY_CART: Cart = {
  items: [],
  updatedAt: new Date().toISOString(),
};

/** Safe to call during SSR — returns empty cart if window is unavailable. */
export function loadCart(): Cart {
  if (typeof window === "undefined") return EMPTY_CART;

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return EMPTY_CART;

    const parsed = JSON.parse(raw) as Cart;

    if (!parsed || !Array.isArray(parsed.items)) return EMPTY_CART;

    return parsed;
  } catch (err) {
    console.error("Failed to load cart from storage:", err);
    return EMPTY_CART;
  }
}

export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error("Failed to save cart to storage:", err);
  }
}

export function clearCartStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear cart storage:", err);
  }
}