// components/home/TestimonialsSection.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import StarRating from "@/components/ui/StarRating";
import TestimonialCard from "./TestimonialCard";
import type { PublicReview, PublicReviewStats } from "@/lib/actions/review.actions";

/**
 * Homepage testimonials — an auto-sliding carousel (5s) built on native
 * scroll-snap rather than a transform-driven track, so "how far scrolled"
 * has a single source of truth (scrollLeft) shared by the timer, the
 * arrows, and the dots. Advances one card at a time; how many are
 * visible per view is purely a CSS breakpoint concern (see
 * TestimonialCard's basis-* classes).
 */
export default function TestimonialsSection({
  reviews,
  stats,
}: {
  reviews: PublicReview[];
  stats: PublicReviewStats;
}) {
  const { dict, locale } = useI18n();
  const t = dict.reviews;
  const viewportRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  const many = reviews.length > 1;

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (reviews.length === 0) return;
      setCurrent((index + reviews.length) % reviews.length);
    },
    [reviews.length]
  );

  // Single place that actually moves the viewport — runs whenever
  // `current` changes, regardless of whether it changed via the timer,
  // an arrow click, or a dot click.
  useEffect(() => {
    const viewport = viewportRef.current;
    const card = viewport?.children[current] as HTMLElement | undefined;
    if (!viewport || !card) return;
    viewport.scrollTo({ left: card.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
  }, [current, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !many || paused) return;
    timer.current = setInterval(() => {
      setCurrent((c) => (c + 1) % reviews.length);
    }, 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reducedMotion, many, paused, reviews.length]);

  if (reviews.length === 0) return null;

  const dateFormatter = new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "en-GB", {
    year: "numeric",
    month: "short",
  });

  return (
    <section
      className="relative py-16 md:py-20 bg-night px-6 md:px-16 lg:px-24 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative max-w-6xl mx-auto text-center mb-10">
        <span className="text-accent text-xs font-semibold uppercase tracking-widest">{t.eyebrow}</span>
        <h2 className="text-3xl md:text-4xl font-serif mt-2 mb-4 text-cream">{t.title}</h2>
        <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 text-sm text-gray-400">
          <StarRating rating={stats.averageRating} size="text-lg" />
          <span className="text-cream font-medium">{stats.averageRating.toFixed(1)}</span>
          <span>{t.outOf}</span>
          <span aria-hidden>·</span>
          <span>
            {stats.totalCount} {stats.totalCount === 1 ? t.reviewWord : t.reviewsWord}
          </span>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div
          ref={viewportRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth pt-2 pb-4"
        >
          {reviews.map((review, i) => (
            <TestimonialCard
              key={review.id}
              review={review}
              index={i}
              dateLabel={dateFormatter.format(review.createdAt)}
            />
          ))}
        </div>

        {many && (
          <>
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              aria-label={dict.home.prevSlide}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full border border-white/10 hover:border-accent bg-black/50 backdrop-blur-md items-center justify-center text-gray-300 hover:text-white transition-all duration-300 text-lg"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              aria-label={dict.home.nextSlide}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full border border-white/10 hover:border-accent bg-black/50 backdrop-blur-md items-center justify-center text-gray-300 hover:text-white transition-all duration-300 text-lg"
            >
              ›
            </button>
          </>
        )}
      </div>

      {many && (
        <div className="relative flex justify-center gap-2 mt-8">
          {reviews.map((review, i) => (
            <button
              key={review.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${dict.home.goToSlide} ${i + 1}`}
              aria-current={i === current}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-accent" : "w-1.5 bg-white/20 hover:bg-white/35"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
