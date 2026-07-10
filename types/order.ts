export type CheckoutCartItemInput = {
  menuItemId: string;
  quantity: number;
  customizationOptionIds: string[];
  specialInstructions: string;
};

export type CheckoutInput = {
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  deliveryAddress?: string;
  notes?: string;
  items: CheckoutCartItemInput[];
};

export type CheckoutResult =
  | { success: true; orderId: string; orderNumber: string }
  | { success: false; error: string; itemErrors?: Record<string, string> };