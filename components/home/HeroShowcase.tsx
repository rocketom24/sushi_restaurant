"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HeroSlideData } from "./hero/types";
import ImageSideSlide from "./hero/ImageSideSlide";
import FullBleedSlide from "./hero/FullBleedSlide";
import MultiImageSlide from "./hero/MultiImageSlide";
import { useI18n } from "@/components/i18n/I18nProvider";

/**
 * Home hero: an owner-editable, animated slide rotation (every 5s).
 * Each slide picks one of four distinct visual treatments — see
 * components/home/hero/*. Arrows and dots allow manual navigation.
 */
export default function HeroShowcase({ slides: incoming }: { slides: HeroSlideData[] }) {
  const { dict } = useI18n();
  const t = dict.home;

  const slides = incoming;
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const many = slides.length > 1;

  const restartTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (many) {
      timer.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    }
  }, [many, slides.length]);

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + slides.length) % slides.length);
      restartTimer();
    },
    [slides.length, restartTimer]
  );

  useEffect(() => {
    restartTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [restartTimer]);

  if (slides.length === 0) {
    return (
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 bg-linear-to-b from-night to-carbon text-center">
        <div>
          <span className="text-accent tracking-widest text-xs uppercase font-medium">{t.brandEyebrow}</span>
          <h1 className="mt-4 text-4xl md:text-6xl font-serif leading-tight text-cream">{t.taglineBrand}</h1>
          <p className="mt-4 text-sm md:text-base text-gray-400 max-w-md mx-auto leading-relaxed font-light">
            {t.brandDescription}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/menu"
              className="bg-accent text-white hover:bg-white hover:text-night px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300"
            >
              {t.orderNow}
            </Link>
            <Link
              href="/reservations/new"
              className="border border-white/20 hover:border-accent hover:text-accent px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300"
            >
              {t.bookTable}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-175 sm:h-[80vh] sm:min-h-150 max-h-225 overflow-hidden bg-night">
      {/* Prev/next arrows are a mouse-hover affordance — on touch widths
          they'd sit directly over the eyebrow/title text, so they only
          appear from sm: up. Dots + swipe/auto-rotate cover mobile nav. */}
      {many && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            aria-label={t.prevSlide}
            className="hidden sm:flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-white/5 hover:border-accent bg-black/40 backdrop-blur-md items-center justify-center text-gray-400 hover:text-white transition-all text-lg"
          >
            ‹
          </button>
          <button
            onClick={() => goTo(current + 1)}
            aria-label={t.nextSlide}
            className="hidden sm:flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-white/5 hover:border-accent bg-black/40 backdrop-blur-md items-center justify-center text-gray-400 hover:text-white transition-all text-lg"
          >
            ›
          </button>
        </>
      )}

      {slides.map((slide, i) => {
        const active = i === current;
        return (
          <div key={slide.id} className={`hero-slide ${active ? "active" : ""}`}>
            {slide.layout === "FULL_BLEED" && <FullBleedSlide slide={slide} active={active} dict={t} />}
            {slide.layout === "MULTI_IMAGE" && <MultiImageSlide slide={slide} active={active} dict={t} />}
            {slide.layout === "IMAGE_RIGHT" && (
              <div className="w-full h-full flex items-center px-6 md:px-16 lg:px-24">
                <ImageSideSlide slide={slide} reverse={false} active={active} dict={t} />
              </div>
            )}
            {slide.layout === "IMAGE_LEFT" && (
              <div className="w-full h-full flex items-center px-6 md:px-16 lg:px-24">
                <ImageSideSlide slide={slide} reverse={true} active={active} dict={t} />
              </div>
            )}
          </div>
        );
      })}

      {/* Dot indicators */}
      {many && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 flex justify-center gap-2.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i)}
              aria-label={`${t.goToSlide} ${i + 1}`}
              aria-current={i === current}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === current ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
