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

const REST = { rx: 0, ry: 0, scale: 1 };
const TOUCH = { rx: -4, ry: 4, scale: 1.05 };

export default function FeaturedMenuCard({
  item,
  index = 0,
}: {
  item: FeaturedMenuItem;
  index?: number;
}) {
  const wrapperRef = useRef<HTMLAnchorElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState(REST);
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

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      ry: (px - 0.5) * 16,
      rx: (0.5 - py) * 16,
      scale: 1.06,
    });
  }

  return (
    <Link
      ref={wrapperRef}
      href={`/menu?highlight=${item.id}`}
      className={`group relative block shrink-0 w-52 sm:w-60 snap-start ${
        isInView ? "card-pop-in-animation" : "opacity-0"
      }`}
      style={{ perspective: "1000px", animationDelay: `${Math.min(index, 6) * 90}ms` }}
    >
      {/* Accent glow that blooms behind the card on hover — the "pop". */}
      <div
        aria-hidden
        className="absolute -top-12 -left-3 -right-3 -bottom-3 bg-accent/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
      />

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt(REST)}
        onTouchStart={() => setTilt(TOUCH)}
        onTouchEnd={() => setTilt(REST)}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.scale})`,
          transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="relative rounded-none pt-16 pb-7 px-5 shadow-2xl shadow-black/50 ring-1 ring-white/8 group-hover:ring-accent/30 transition-shadow duration-500"
      >
        {/* Card surface — a faint directional gradient instead of one flat
            fill, so it reads as a lit surface rather than a solid tile.
            Clipped in its own layer so it doesn't also clip the circular
            photo, which needs to overflow above the card. */}
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(140% 100% at 15% 0%, #1e2027 0%, var(--color-carbon) 45%, #0f1013 100%)",
            }}
          />
          {/* Hairline sheen along the top edge — a thin catch of light
              rather than a hard border. */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Price — plain text, top-right */}
        <div className="absolute top-5 right-5 text-right transition-transform duration-300 group-hover:scale-110">
          {hasDiscount && (
            <div className="text-[11px] text-crimson-silk line-through leading-none mb-1">
              €{item.price.toFixed(2)}
            </div>
          )}
          <div
            className={`font-hero text-lg font-bold leading-none tracking-tight ${
              hasDiscount ? "text-accent" : "text-cream"
            }`}
          >
            €{(item.discountPrice ?? item.price).toFixed(2)}
          </div>
        </div>

        {/* Circular photo, overlapping the card's top edge — a soft
            gradient rim rather than a flat solid ring, so it catches
            light like a real plate edge instead of a printed circle. */}
        <div className="absolute -top-11 left-6 w-24 h-24 sm:w-28 sm:h-28 rounded-full p-0.75 bg-linear-to-br from-cream/70 via-cream/25 to-transparent shadow-xl shadow-black/60">
          <div className="relative w-full h-full rounded-full overflow-hidden bg-night ring-1 ring-black/50">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">🍣</div>
            )}
          </div>
          {hasDiscount && (
            <span className="absolute -bottom-0.5 -right-0.5 bg-accent text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ring-2 ring-carbon sale-badge-pulse-animation">
              Sale
            </span>
          )}
        </div>

        <h3 className="mt-4 font-hero text-lg sm:text-xl font-bold text-cream tracking-tight truncate">
          {item.name}
        </h3>

        <div aria-hidden className="mt-4 h-px bg-white/6" />

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="min-w-0 flex-1 text-xs text-gray-400 font-light truncate">
            {item.description || " "}
          </p>
          <span
            aria-hidden
            className="shrink-0 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-gray-400 group-hover:border-accent group-hover:text-accent transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
