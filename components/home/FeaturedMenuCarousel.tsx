// components/home/FeaturedMenuCarousel.tsx
"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import FeaturedMenuCard, { type FeaturedMenuItem } from "./FeaturedMenuCard";

export default function FeaturedMenuCarousel({ items }: { items: FeaturedMenuItem[] }) {
  const { dict } = useI18n();
  const t = dict.home;

  if (items.length === 0) return null;

  return (
    <section className="relative py-24 md:py-28 bg-night">
      {/* Top/bottom vignette — blends this section into the sections above
          and below it instead of a hard color-band handoff. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-20 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, var(--color-night) 0%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--color-night) 0%, transparent 100%)" }}
      />

      <div className="relative px-6 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
          <div>
            <span className="text-accent text-xs font-semibold uppercase tracking-widest">
              {t.featuredEyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif mt-2 text-cream">{t.featuredTitle}</h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-accent transition-colors duration-300"
          >
            {t.seeFullMenu}
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/*
          overflow-x-auto forces overflow-y to compute as auto too (a CSS
          overflow quirk: an axis left "visible" while the other isn't gets
          clamped to auto), which was clipping the hover glow/tilt scale at
          the top edge. pt-8/pb-8 give both enough headroom to expand into
          without being cut off by that implicit vertical clip.
        */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar pt-12 pb-8 snap-x snap-mandatory -mx-6 px-6 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24">
          {items.map((item, i) => (
            <FeaturedMenuCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
