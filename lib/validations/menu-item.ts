// lib/validations/menu-item.ts

import { z } from "zod";

const emptyToUndefined = (v: unknown) => (v === "" || v === null ? undefined : v);

export const menuItemSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters.").max(150, "Name must be less than 150 characters."),
    description: z.string().trim().max(1000, "Description must be less than 1000 characters.").optional().or(z.literal("")),
    categoryId: z.string().uuid("Please select a valid category."),
    price: z.coerce.number().positive("Price must be greater than 0.").max(9999.99, "Price is too high."),
    discountPrice: z.preprocess(
      emptyToUndefined,
      z.coerce.number().positive("Discount price must be greater than 0.").max(9999.99).optional()
    ),
    imageUrl: z.string().trim().url("Must be a valid URL.").optional().or(z.literal("")),
    preparationTime: z.coerce.number().int().min(0).optional(),
    calories: z.coerce.number().int().min(0).optional(),
    spiceLevel: z.enum(["NONE", "MILD", "MEDIUM", "HOT"]).optional(),
    isAvailable: z.coerce.boolean().default(true),
    isFeatured: z.coerce.boolean().default(false),
    sortOrder: z.coerce.number().int().min(0).default(0),
  })
  .refine((data) => data.discountPrice === undefined || data.discountPrice < data.price, {
    message: "Discount price must be less than the regular price.",
    path: ["discountPrice"],
  });

export type MenuItemInput = z.infer<typeof menuItemSchema>;

export type MenuItemFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    categoryId?: string[];
    price?: string[];
    discountPrice?: string[];
    imageUrl?: string[];
    preparationTime?: string[];
    calories?: string[];
    spiceLevel?: string[];
    isAvailable?: string[];
    isFeatured?: string[];
    sortOrder?: string[];
    _form?: string[];
  };
  success?: boolean;
};