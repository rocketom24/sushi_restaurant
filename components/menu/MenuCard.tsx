// components/menu/MenuCard.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import SpiceMeter from "./SpiceMeter";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { useI18n } from "@/components/i18n/I18nProvider";

type MenuItemData = {
  id: string;
  name: string;
  description: string | null;
  price: unknown;
  discountPrice: unknown;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  spiceLevel: string | null;
};

export default function MenuCard({
  item,
  highlighted = false,
}: {
  item: MenuItemData;
  highlighted?: boolean;
}) {
  const { dict } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const hasDiscount = item.discountPrice !== null && item.discountPrice !== undefined;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id={`menu-item-${item.id}`}
      ref={cardRef}
      className={`group relative h-full ${isInView ? "card-pop-in-animation" : "opacity-0"}`}
    >
      <CardContainer containerClassName="h-full" className="w-full h-full">
        <CardBody
          className={`relative h-full w-full flex flex-col rounded-none pt-24 pb-4 px-4 shadow-xl shadow-black/40 ring-1 transition-all duration-500 ${
            highlighted ? "ring-2 ring-accent shadow-2xl shadow-accent/30" : "ring-white/10 group-hover:ring-accent/40"
          }`}
        >
          {/* Card surface — a faint directional gradient instead of one flat
              fill, clipped in its own layer so it doesn't clip the circular
              photo overflowing above the card. Stays flush with the base
              plane rather than floating like the CardItems above it. */}
          <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(140% 100% at 15% 0%, #1e2027 0%, var(--color-carbon) 45%, #0f1013 100%)",
              }}
            />
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* Price — plain text, top-right */}
          <CardItem translateZ={40} className="absolute top-5 right-5 text-right">
            {hasDiscount && (
              <div className="text-[11px] text-crimson-silk line-through leading-none mb-1">
                €{Number(item.price).toFixed(2)}
              </div>
            )}
            <div
              className={`font-hero text-lg font-bold leading-none tracking-tight ${
                hasDiscount ? "text-accent" : "text-cream"
              }`}
            >
              €{Number(item.discountPrice ?? item.price).toFixed(2)}
            </div>
          </CardItem>

          {/* Circular photo, overlapping the card's top edge — a soft
              gradient rim rather than a flat solid ring. Floats the
              highest of any element when the card tilts. */}
          <CardItem
            translateZ={90}
            className="absolute -top-16 left-6 w-40 h-40 rounded-full p-1 bg-linear-to-br from-cream/70 via-cream/25 to-transparent shadow-2xl shadow-black/70"
          >
            <div className="relative w-full h-full rounded-full overflow-hidden bg-night ring-1 ring-black/50">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                    !item.isAvailable ? "opacity-40 grayscale" : ""
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🍣</div>
              )}
            </div>
            {item.isFeatured && (
              <span
                aria-label={dict.menu.featured}
                className="absolute -top-1 -left-1 w-6 h-6 bg-platinum text-deep-bordeaux rounded-full ring-2 ring-carbon flex items-center justify-center"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M10 1.5l2.472 5.008 5.528.804-4 3.899.944 5.507L10 14.25l-4.944 2.468L6 11.211l-4-3.899 5.528-.804L10 1.5z" />
                </svg>
              </span>
            )}
            {hasDiscount && (
              <span className="absolute -bottom-1 -right-1 bg-accent text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ring-2 ring-carbon sale-badge-pulse-animation">
                Sale
              </span>
            )}
          </CardItem>

          {/* This block grows to absorb whatever vertical space the grid row
              gives it (rows stretch to their tallest card), so the divider
              and Add to Cart button below always dock to the same baseline
              across a row instead of drifting per-card. */}
          <div className="flex-1">
            <CardItem translateZ={30} className="w-full mt-4 flex items-center justify-between gap-2">
              <h3 className="font-hero text-lg font-bold text-cream tracking-tight truncate group-hover:text-accent transition-colors duration-300">
                {item.name}
              </h3>
              <SpiceMeter level={item.spiceLevel} />
            </CardItem>

            {item.description && (
              <CardItem as="p" translateZ={20} className="w-full mt-1 text-xs text-gray-400 font-light leading-relaxed line-clamp-1">
                {item.description}
              </CardItem>
            )}
          </div>

          <div aria-hidden className="mt-4 h-px bg-white/6" />

          <CardItem translateZ={20} className="w-full mt-4">
            <AddToCartButton menuItemId={item.id} isAvailable={item.isAvailable} spiceLevel={item.spiceLevel} />
          </CardItem>
        </CardBody>
      </CardContainer>
    </div>
  );
}
