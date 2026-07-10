// components/cart/CartProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { Cart, CartItem, CartCustomization } from "@/types/cart";
import { loadCart, saveCart, clearCartStorage } from "@/lib/cart/cart-storage";
import {
  getLineSignature,
  calculateItemSubtotal,
  clampQuantity,
  generateLineId,
} from "@/lib/cart/cart-utils";

type CartState = Cart & { isHydrated: boolean };

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        menuItemId: string;
        name: string;
        basePrice: number;
        imageUrl: string | null;
        quantity: number;
        customizations: CartCustomization[];
        specialInstructions: string;
      };
    }
  | { type: "UPDATE_QUANTITY"; payload: { lineId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { lineId: string } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: Cart };

const initialState: CartState = {
  items: [],
  updatedAt: new Date().toISOString(),
  isHydrated: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    // Single state update covers both "load the saved cart" and
    // "mark hydration complete" — avoids two separate setState calls
    // firing back-to-back inside the same effect.
    case "HYDRATE":
      return { ...action.payload, isHydrated: true };

    case "ADD_ITEM": {
      const {
        menuItemId,
        name,
        basePrice,
        imageUrl,
        quantity,
        customizations,
        specialInstructions,
      } = action.payload;

      const signature = getLineSignature(
        menuItemId,
        customizations,
        specialInstructions
      );

      const existingIndex = state.items.findIndex(
        (item) =>
          getLineSignature(
            item.menuItemId,
            item.customizations,
            item.specialInstructions
          ) === signature
      );

      if (existingIndex !== -1) {
        const updatedItems = [...state.items];
        const existing = updatedItems[existingIndex];
        const newQuantity = clampQuantity(existing.quantity + quantity);

        updatedItems[existingIndex] = {
          ...existing,
          quantity: newQuantity,
          subtotal: calculateItemSubtotal(
            existing.basePrice,
            existing.customizations,
            newQuantity
          ),
        };

        return {
          ...state,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        };
      }

      const newItem: CartItem = {
        lineId: generateLineId(),
        menuItemId,
        name,
        basePrice,
        imageUrl,
        quantity: clampQuantity(quantity),
        customizations,
        specialInstructions,
        subtotal: calculateItemSubtotal(
          basePrice,
          customizations,
          clampQuantity(quantity)
        ),
      };

      return {
        ...state,
        items: [...state.items, newItem],
        updatedAt: new Date().toISOString(),
      };
    }

    case "UPDATE_QUANTITY": {
      const { lineId, quantity } = action.payload;
      const clamped = clampQuantity(quantity);

      return {
        ...state,
        items: state.items.map((item) =>
          item.lineId === lineId
            ? {
                ...item,
                quantity: clamped,
                subtotal: calculateItemSubtotal(
                  item.basePrice,
                  item.customizations,
                  clamped
                ),
              }
            : item
        ),
        updatedAt: new Date().toISOString(),
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.lineId !== action.payload.lineId),
        updatedAt: new Date().toISOString(),
      };

    case "CLEAR_CART":
      return { ...state, items: [], updatedAt: new Date().toISOString() };

    default:
      return state;
  }
}

type CartContextValue = {
  cart: Cart;
  isHydrated: boolean;
  addItem: (payload: Extract<CartAction, { type: "ADD_ITEM" }>["payload"]) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Single effect, single dispatch — loads from storage and marks
  // hydration complete in one state update, not two.
  useEffect(() => {
    const stored = loadCart();
    dispatch({ type: "HYDRATE", payload: stored });
  }, []);

  // Persist on every change, but skip until hydration has completed
  useEffect(() => {
    if (!state.isHydrated) return;
    saveCart({ items: state.items, updatedAt: state.updatedAt });
  }, [state.items, state.updatedAt, state.isHydrated]);

  const addItem: CartContextValue["addItem"] = (payload) => {
    dispatch({ type: "ADD_ITEM", payload });
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { lineId, quantity } });
  };

  const removeItem = (lineId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { lineId } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    clearCartStorage();
  };

  return (
    <CartContext.Provider
      value={{
        cart: { items: state.items, updatedAt: state.updatedAt },
        isHydrated: state.isHydrated,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return ctx;
}