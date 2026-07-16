import { z } from "zod";
import { MIN_GUESTS, MAX_GUESTS } from "@/lib/reservations/availability";

export const reservationSchema = z.object({
  reservationDate: z.string().min(1, "Please select a date."),
  reservationTime: z.string().min(1, "Please select a time."),
  guestCount: z.coerce
    .number()
    .int()
    .min(MIN_GUESTS, `Minimum ${MIN_GUESTS} guest.`)
    .max(MAX_GUESTS, `Maximum ${MAX_GUESTS} guests. Please call us for larger groups.`),
  specialRequest: z.string().trim().max(250, "Special request too long.").optional(),
  customerName: z.string().trim().min(2, "Name is required.").max(100),
  phone: z.string().trim().min(6, "Valid phone number required.").max(20),
  email: z.string().trim().email("Valid email required.").optional().or(z.literal("")),
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;

export type ReservationFormState = {
  errors?: {
    reservationDate?: string[];
    reservationTime?: string[];
    guestCount?: string[];
    specialRequest?: string[];
    customerName?: string[];
    phone?: string[];
    email?: string[];
    _form?: string[];
  };
  success?: boolean;
};