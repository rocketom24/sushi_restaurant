// lib/validations/reward.ts
import { z } from "zod";

export const rewardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be at most 80 characters."),
  description: z.string().trim().max(200).optional().or(z.literal("")),
  pointsCost: z.coerce
    .number()
    .int("Points must be a whole number.")
    .min(1, "Points cost must be at least 1."),
  isActive: z.boolean().optional(),
});

export type RewardFormState = {
  errors?: Partial<
    Record<"name" | "description" | "pointsCost" | "_form", string[]>
  >;
};
