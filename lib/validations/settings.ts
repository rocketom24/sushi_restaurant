// lib/validations/settings.ts
import { z } from "zod";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const optionalTime = z
  .string()
  .regex(TIME_RE, "Use HH:MM format.")
  .optional()
  .or(z.literal(""));

export const restaurantInfoSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{6,20}$/, "Enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  email: z.string().trim().email("Enter a valid email.").optional().or(z.literal("")),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  vatNumber: z.string().trim().max(50).optional().or(z.literal("")),
  taxId: z.string().trim().max(50).optional().or(z.literal("")),
});

const dayHoursSchema = z
  .object({
    day: z.coerce.number().int().min(0).max(6),
    closed: z.boolean(),
    lunchOpen: optionalTime,
    lunchClose: optionalTime,
    dinnerOpen: optionalTime,
    dinnerClose: optionalTime,
  })
  .refine(
    (d) => d.closed || !d.lunchOpen || !d.lunchClose || d.lunchOpen < d.lunchClose,
    { message: "Lunch close must be after lunch open.", path: ["lunchClose"] }
  )
  .refine(
    (d) => d.closed || !d.dinnerOpen || !d.dinnerClose || d.dinnerOpen < d.dinnerClose,
    { message: "Dinner close must be after dinner open.", path: ["dinnerClose"] }
  );

export const operatingHoursSchema = z.array(dayHoursSchema).length(7);

export const reservationSettingsSchema = z.object({
  reservationSlotIntervalMinutes: z.coerce.number().int().min(5).max(120),
  reservationLunchDurationMinutes: z.coerce.number().int().min(15).max(480),
  reservationDinnerDurationMinutes: z.coerce.number().int().min(15).max(480),
  reservationMaxGuests: z.coerce.number().int().min(1).max(100),
  reservationCancellationCutoffHours: z.coerce.number().int().min(0).max(168),
  autoAssignTable: z.boolean(),
});

export const orderingSettingsSchema = z.object({
  deliveryEnabled: z.boolean(),
  takeawayEnabled: z.boolean(),
  dineInEnabled: z.boolean(),
  minOrderAmount: z.coerce.number().min(0),
  deliveryFee: z.coerce.number().min(0),
  estimatedPrepTimeMinutes: z.coerce.number().int().min(1).max(240),
});

export const paymentSettingsSchema = z
  .object({
    cashEnabled: z.boolean(),
    cardEnabled: z.boolean(),
    satispayEnabled: z.boolean(),
    edenredEnabled: z.boolean(),
  })
  .refine((d) => d.cashEnabled || d.cardEnabled || d.satispayEnabled || d.edenredEnabled, {
    message: "At least one payment method must be enabled.",
    path: ["cashEnabled"],
  });

export const loyaltySettingsSchema = z.object({
  pointsPerEuro: z.coerce.number().min(0).max(100),
});

export type SettingsFormState = {
  errors?: Record<string, string[]>;
  success?: boolean;
};
