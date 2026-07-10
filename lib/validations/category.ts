// lib/validations/category.ts

import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100, "Name must be less than 100 characters."),
  description: z.string().trim().max(500, "Description must be less than 500 characters.").optional().or(z.literal("")),
  slug: z.string().trim().min(2, "Slug must be at least 2 characters.").max(100)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  imageUrl: z.string().trim().url("Must be a valid URL.").optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0, "Display order must be a positive number.").default(0),
  isActive: z.coerce.boolean().default(true),
  parentId: z.string().uuid().optional().or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export type CategoryFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    slug?: string[];
    imageUrl?: string[];
    sortOrder?: string[];
    isActive?: string[];
    parentId?: string[];
    _form?: string[];
  };
  success?: boolean;
};