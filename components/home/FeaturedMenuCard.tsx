// components/home/FeaturedMenuCard.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export type FeaturedMenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  imageUrl: string | null;
};

export default function FeaturedMenuCard({
  item,
  index = 0,
}: {
  item: FeaturedMenuItem;
  index?: number;
}) {
  const wrapperRef = useRef<HTMLAnchorElement>(null);
  const [isInView, setIsInView] = useState(false);
  const hasDiscount = item.discountPrice !== null;

  // Cards pop in as they scroll into view, staggered by their position in
  // the row, instead of just appearing with the rest of the page.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={wrapperRef}
      href={`/menu?highlight=${item.id}`}
      className={`group relative block grow shrink basis-56 sm:basis-64 min-w-56 sm:min-w-64 max-w-105 snap-start ${
        isInView ? "card-pop-in-animation" : "opacity-0"
      }`}
      style={{ animationDelay: `${Math.min(index, 6) * 90}ms` }}
    >
      {/* Accent glow that blooms behind the card on hover. */}
      <div
        aria-hidden
        className="absolute -inset-3 rounded-3xl bg-accent/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
      />

      <div
        className="relative aspect-[3/4.9] w-full overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 transition-all duration-500 group-hover:ring-accent/40 group-hover:-translate-y-1"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 88%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 88%, transparent 100%)",
        }}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
          />
        ) : (
          <div className="absolute inset-0 bg-carbon flex items-center justify-center text-6xl">🍣</div>
        )}

        {/* Top and bottom of the photo dissolve into the page's own
            background instead of ending in a hard rectangle edge. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, var(--color-night) 0%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--color-night) 0%, transparent 100%)" }}
        />

        {/* Sale flag, top-left */}
        {hasDiscount && (
          <span className="absolute top-3.5 left-3.5 bg-accent text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full sale-badge-pulse-animation">
            Sale
          </span>
        )}

        {/* Price chip, top-right */}
        <div className="absolute top-3.5 right-3.5 text-right transition-transform duration-300 group-hover:scale-110">
          {hasDiscount && (
            <div className="text-[10px] text-gray-300 line-through leading-none mb-1 bg-night/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md inline-block">
              €{item.price.toFixed(2)}
            </div>
          )}
          <div
            className={`font-hero text-sm font-bold leading-none px-2.5 py-1.5 rounded-lg backdrop-blur-sm shadow-lg ${
              hasDiscount ? "bg-accent text-white shadow-accent/40" : "bg-night/70 text-cream"
            }`}
          >
            €{(item.discountPrice ?? item.price).toFixed(2)}
          </div>
        </div>

        {/* Name + description, sitting in the bottom fade */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-hero text-lg font-bold text-cream leading-tight truncate group-hover:text-cream-vanilla transition-colors duration-300">
            {item.name}
          </h3>
          {item.description && (
            <p className="mt-1 text-xs text-gray-300 font-light leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
