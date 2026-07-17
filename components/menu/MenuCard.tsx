// components/menu/MenuCard.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import SpiceMeter from "./SpiceMeter";
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
      className={`group relative ${isInView ? "card-pop-in-animation" : "opacity-0"}`}
    >
      {/* Ambient glow on hover — same accent bloom as the homepage cards. */}
      <div
        aria-hidden
        className="absolute -inset-2 rounded-[1.75rem] bg-accent/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
      />

      <div
        className={`relative aspect-square rounded-2xl overflow-hidden shadow-xl shadow-black/40 ring-1 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-accent/20 ${
          highlighted ? "ring-2 ring-accent shadow-2xl shadow-accent/30" : "ring-white/10 group-hover:ring-accent/40"
        }`}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
              !item.isAvailable ? "opacity-40" : ""
            }`}
          />
        ) : (
          <div className="absolute inset-0 bg-carbon flex items-center justify-center text-6xl">
            🍣
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-night via-night/20 to-transparent" />

        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-night/50">
            <span className="bg-night/80 border border-white/15 text-gray-200 text-[10px] font-semibold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              {dict.menu.soldOut}
            </span>
          </div>
        )}

        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
          {item.isFeatured && (
            <span className="bg-platinum text-night text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
              {dict.menu.featured}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-accent text-white text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full sale-badge-pulse-animation">
              Sale
            </span>
          )}
        </div>

        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
          {hasDiscount ? (
            <>
              <span className="bg-night/85 backdrop-blur-sm text-gray-300 line-through text-[11px] px-2 py-1 rounded-md shadow">
                €{Number(item.price).toFixed(2)}
              </span>
              <span className="bg-accent text-white font-serif text-lg font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-accent/50">
                €{Number(item.discountPrice).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="bg-night/85 backdrop-blur-sm text-white font-serif text-lg font-bold px-3 py-1.5 rounded-lg shadow-lg">
              €{Number(item.price).toFixed(2)}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-serif text-lg text-cream group-hover:text-accent transition-colors duration-300 truncate">
                {item.name}
              </h3>
              <SpiceMeter level={item.spiceLevel} />
            </div>
            {item.description && (
              <p className="mt-0.5 text-[11px] text-gray-300 font-light leading-relaxed line-clamp-1">
                {item.description}
              </p>
            )}
          </div>

          <AddToCartButton menuItemId={item.id} isAvailable={item.isAvailable} spiceLevel={item.spiceLevel} />
        </div>
      </div>
    </div>
  );
}
