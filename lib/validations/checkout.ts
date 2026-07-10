import { z } from "zod";

export const checkoutItemSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
  customizationOptionIds: z.array(z.string().uuid()),
  specialInstructions: z.string().max(250),
});

export const checkoutSchema = z
  .object({
    orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]),
    deliveryAddress: z.string().trim().max(500).optional(),
    notes: z.string().trim().max(250).optional(),
    items: z.array(checkoutItemSchema).min(1, "Your cart is empty."),
  })
  .refine(
    (data) =>
      data.orderType !== "DELIVERY" ||
      (data.deliveryAddress && data.deliveryAddress.length > 0),
    {
      message: "Delivery address is required for delivery orders.",
      path: ["deliveryAddress"],
    }
  );

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;