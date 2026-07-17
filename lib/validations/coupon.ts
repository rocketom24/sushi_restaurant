// lib/validations/coupon.ts
import { z } from "zod";

// Coerce empty-string form fields to undefined so optional numeric/date
// inputs don't fail parsing when left blank.
const emptyToUndefined = (v: unknown) =>
  v === "" || v === null ? undefined : v;

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Code must be at least 3 characters.")
      .max(30, "Code must be at most 30 characters.")
      .regex(/^[A-Za-z0-9]+$/, "Use letters and numbers only.")
      .transform((v) => v.toUpperCase()),
    description: z.string().trim().max(200).optional().or(z.literal("")),
    type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    value: z.coerce.number().positive("Value must be greater than 0."),
    minOrderAmount: z.preprocess(
      emptyToUndefined,
      z.coerce.number().min(0).optional()
    ),
    maxUsageCount: z.preprocess(
      emptyToUndefined,
      z.coerce.number().int().min(1).optional()
    ),
    maxUsagePerUser: z.preprocess(
      emptyToUndefined,
      z.coerce.number().int().min(1).optional()
    ),
    startsAt: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
    endsAt: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => data.type !== "PERCENTAGE" || data.value <= 100,
    { message: "Percentage cannot exceed 100.", path: ["value"] }
  )
  .refine(
    (data) => !data.startsAt || !data.endsAt || data.endsAt >= data.startsAt,
    { message: "End date must be after the start date.", path: ["endsAt"] }
  );

export const applyCouponSchema = z.object({
  code: z.string().trim().min(1, "Enter a coupon code.").max(30),
});

export type CouponFormState = {
  errors?: Partial<
    Record<
      | "code"
      | "description"
      | "type"
      | "value"
      | "minOrderAmount"
      | "maxUsageCount"
      | "maxUsagePerUser"
      | "startsAt"
      | "endsAt"
      | "_form",
      string[]
    >
  >;
};
