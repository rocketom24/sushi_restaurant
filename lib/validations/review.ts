// lib/validations/review.ts
import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Choose a rating.").max(5, "Rating must be between 1 and 5."),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title must be at most 100 characters."),
  comment: z
    .string()
    .trim()
    .min(10, "Comment must be at least 10 characters.")
    .max(1000, "Comment must be at most 1000 characters."),
});

export type ReviewFormState = {
  errors?: Partial<Record<"rating" | "title" | "comment" | "_form", string[]>>;
  success?: boolean;
};

export const reviewEditSchema = reviewSchema.extend({
  sortOrder: z.coerce.number().int().min(0).optional(),
});

export type ReviewEditFormState = {
  errors?: Partial<
    Record<"rating" | "title" | "comment" | "sortOrder" | "_form", string[]>
  >;
};
