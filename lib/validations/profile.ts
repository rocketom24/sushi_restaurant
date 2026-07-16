// lib/validations/profile.ts
import { z } from "zod";

export const profileNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be at most 80 characters."),
});

export const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Label is required.")
    .max(30, "Label must be at most 30 characters."),
  fullAddress: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters.")
    .max(200, "Address must be at most 200 characters."),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  postalCode: z.string().trim().max(12).optional().or(z.literal("")),
  notes: z.string().trim().max(200).optional().or(z.literal("")),
  isDefault: z.boolean().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });

export type ProfileFormState = {
  errors?: Partial<Record<"name" | "_form", string[]>>;
  success?: boolean;
};

export type AddressFormState = {
  errors?: Partial<
    Record<"label" | "fullAddress" | "city" | "postalCode" | "notes" | "_form", string[]>
  >;
  success?: boolean;
};

export type PasswordFormState = {
  errors?: Partial<
    Record<"currentPassword" | "newPassword" | "confirmNewPassword" | "_form", string[]>
  >;
  success?: boolean;
};
