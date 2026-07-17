// components/home/hero/types.ts

export type HeroSlideData = {
  id: string;
  kind: "OFFER" | "FEATURED";
  layout: "IMAGE_RIGHT" | "IMAGE_LEFT" | "FULL_BLEED" | "MULTI_IMAGE";
  badgeText: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  imageUrls: string[];
  price: number | null;
  discountLabel: string | null;
  couponCode: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
};
