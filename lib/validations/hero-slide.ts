// lib/validations/hero-slide.ts
import { z } from "zod";

const emptyToUndefined = (v: unknown) => (v === "" || v === null ? undefined : v);

// imageUrls arrives from the form as a newline-separated textarea value.
const imageUrlsField = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4)
  );

export const heroSlideSchema = z
  .object({
    kind: z.enum(["OFFER", "FEATURED"]),
    layout: z.enum(["IMAGE_RIGHT", "IMAGE_LEFT", "FULL_BLEED", "MULTI_IMAGE"]),
    badgeText: z.string().trim().max(40).optional().or(z.literal("")),
    title: z.string().trim().min(1, "Title is required.").max(80),
    subtitle: z.string().trim().max(120).optional().or(z.literal("")),
    description: z.string().trim().max(280).optional().or(z.literal("")),
    imageUrl: z.string().trim().max(2000).optional().or(z.literal("")),
    imageUrls: imageUrlsField,
    price: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()),
    discountLabel: z.string().trim().max(30).optional().or(z.literal("")),
    couponCode: z.string().trim().max(30).optional().or(z.literal("")),
    ctaLabel: z.string().trim().max(30).optional().or(z.literal("")),
    ctaHref: z.string().trim().max(200).optional().or(z.literal("")),
    isActive: z.boolean().optional(),
    sortOrder: z.coerce.number().int().min(0).optional(),
  })
  .refine((data) => data.kind !== "OFFER" || data.discountLabel, {
    message: "Discount label is required for an offer slide.",
    path: ["discountLabel"],
  });

export type HeroSlideFormState = {
  errors?: Partial<
    Record<
      | "kind"
      | "layout"
      | "badgeText"
      | "title"
      | "subtitle"
      | "description"
      | "imageUrl"
      | "imageUrls"
      | "price"
      | "discountLabel"
      | "couponCode"
      | "ctaLabel"
      | "ctaHref"
      | "_form",
      string[]
    >
  >;
};
