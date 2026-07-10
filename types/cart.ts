export type CartCustomization = {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceModifier: number;
};

export type CartItem = {
  /** Unique per cart line — NOT the menuItemId. Two lines can share a menuItemId
   * if their customizations/instructions differ (see merge logic in cart-utils). */
  lineId: string;
  menuItemId: string;
  name: string;
  /** Base price snapshot at time of add — server-validated, never trust client edits. */
  basePrice: number;
  imageUrl: string | null;
  quantity: number;
  customizations: CartCustomization[];
  specialInstructions: string;
  /** basePrice + sum(customizations.priceModifier), times quantity */
  subtotal: number;
};

export type Cart = {
  items: CartItem[];
  updatedAt: string; // ISO timestamp, used for future guest-cart merge logic
};

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  discount: number; // placeholder, always 0 in Module 5
  tax: number; // placeholder, always 0 in Module 5
  delivery: number; // placeholder, always 0 in Module 5
  grandTotal: number;
};