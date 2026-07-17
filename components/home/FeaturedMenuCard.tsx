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
      className={`group relative shrink-0 w-65 sm:w-75 snap-start ${
        isInView ? "card-pop-in-animation" : "opacity-0"
      }`}
      style={{ perspective: "1000px", animationDelay: `${Math.min(index, 6) * 90}ms` }}
    >
      {/* Accent glow that blooms behind the card on hover — the "pop". */}
      <div
        aria-hidden
        className="absolute -inset-3 rounded-[2rem] bg-accent/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
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
        className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 group-hover:ring-accent/50 group-hover:shadow-accent/20 transition-shadow duration-500"
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-carbon flex items-center justify-center text-7xl">
            🍣
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-night via-night/15 to-transparent" />

        {hasDiscount && (
          <span className="absolute top-4 left-4 bg-accent text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full sale-badge-pulse-animation">
            Sale
          </span>
        )}

        <div className="absolute top-4 right-4 flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
          {hasDiscount ? (
            <>
              <span className="bg-night/85 backdrop-blur-sm text-gray-300 line-through text-[11px] px-2 py-1 rounded-md shadow">
                €{item.price.toFixed(2)}
              </span>
              <span className="bg-accent text-white font-serif text-lg font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-accent/50">
                €{item.discountPrice!.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="bg-night/85 backdrop-blur-sm text-white font-serif text-lg font-bold px-3 py-1.5 rounded-lg shadow-lg">
              €{item.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-serif text-xl md:text-2xl text-cream">{item.name}</h3>
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
