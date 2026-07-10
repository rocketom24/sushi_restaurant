import type { Cart, CartItem, CartCustomization, CartTotals } from "@/types/cart";

export const MAX_QUANTITY = 99;
export const MIN_QUANTITY = 1;
export const MAX_INSTRUCTIONS_LENGTH = 250;

/**
 * Produces a stable signature for merge-detection: same menu item +
 * same set of customizations (order-independent) + same instructions
 * = same cart line, quantities merge. Any difference = separate line.
 *
 * Special instructions are included deliberately — "no onions" and
 * "extra crispy" on the same roll are meaningfully different orders
 * for the kitchen, even though the doc doesn't explicitly call this out.
 */
export function getLineSignature(
  menuItemId: string,
  customizations: CartCustomization[],
  specialInstructions: string
): string {
  const sortedOptionIds = [...customizations]
    .map((c) => c.optionId)
    .sort()
    .join(",");

  return `${menuItemId}::${sortedOptionIds}::${specialInstructions.trim()}`;
}

export function calculateItemSubtotal(
  basePrice: number,
  customizations: CartCustomization[],
  quantity: number
): number {
  const customizationTotal = customizations.reduce(
    (sum, c) => sum + c.priceModifier,
    0
  );
  return Math.round((basePrice + customizationTotal) * quantity * 100) / 100;
}

export function calculateCartTotals(cart: Cart): CartTotals {
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal =
    Math.round(cart.items.reduce((sum, item) => sum + item.subtotal, 0) * 100) /
    100;

  // Discount/tax/delivery are placeholders per Module 5 scope —
  // real values are calculated server-side at checkout (Module 6)
  const discount = 0;
  const tax = 0;
  const delivery = 0;

  return {
    itemCount,
    subtotal,
    discount,
    tax,
    delivery,
    grandTotal: Math.round((subtotal - discount + tax + delivery) * 100) / 100,
  };
}

export function clampQuantity(quantity: number): number {
  return Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY, Math.floor(quantity)));
}

export function generateLineId(): string {
  return crypto.randomUUID();
}