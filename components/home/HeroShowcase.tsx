"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HeroSlide } from "@/lib/actions/public-menu.actions";
import { useI18n } from "@/components/i18n/I18nProvider";

/**
 * KURO hero: asymmetric grid with a floating, glowing visual that
 * rotates every 5 seconds through featured dishes, the newest dish,
 * and active offers. Arrows and dots allow manual navigation.
 */
export default function HeroShowcase({ slides: incoming }: { slides: HeroSlide[] }) {
  const { dict } = useI18n();
  const t = dict.home;

  // Always at least the brand slide.
  const slides: (HeroSlide | { kind: "brand"; id: "brand" })[] =
    incoming.length > 0 ? incoming : [{ kind: "brand", id: "brand" }];

  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const many = slides.length > 1;

  const restartTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (many) {
      timer.current = setInterval(
        () => setCurrent((c) => (c + 1) % slides.length),
        5000
      );
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

  return (
    <section className="relative min-h-[80vh] flex items-center py-16 px-6 md:px-16 lg:px-24 overflow-hidden bg-linear-to-b from-night to-carbon">
      {many && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            aria-label={t.prevSlide}
            className="absolute left-3 md:left-6 z-40 w-10 h-10 rounded-full border border-white/5 hover:border-accent bg-black/40 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-white transition-all text-lg"
          >
            ‹
          </button>
          <button
            onClick={() => goTo(current + 1)}
            aria-label={t.nextSlide}
            className="absolute right-3 md:right-6 z-40 w-10 h-10 rounded-full border border-white/5 hover:border-accent bg-black/40 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-white transition-all text-lg"
          >
            ›
          </button>
        </>
      )}

      <div className="relative w-full">
        {slides.map((slide, i) => {
          const isOffer = slide.kind === "offer";
          const accent = isOffer ? "text-gold" : "text-accent";
          const dot = isOffer ? "bg-gold" : "bg-accent";
          const glow = isOffer ? "bg-gold/10" : "bg-accent/10";
          const cta = isOffer
            ? "bg-gold hover:bg-white hover:text-night"
            : "bg-accent hover:bg-white hover:text-night";

          const eyebrow =
            slide.kind === "offer"
              ? t.offerEyebrow
              : slide.kind === "new"
                ? t.newEyebrow
                : slide.kind === "item"
                  ? t.itemEyebrow
                  : t.brandEyebrow;

          const tagline =
            slide.kind === "offer"
              ? slide.description ?? t.offerDescription
              : slide.kind === "new"
                ? t.taglineNew
                : slide.kind === "item"
                  ? t.taglineItem
                  : t.taglineBrand;

          return (
            <div key={slide.id} className={`hero-slide ${i === current ? "active" : ""}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: text */}
                <div className="space-y-6 lg:col-span-5 z-10 order-2 lg:order-1">
                  <span className={`${accent} tracking-widest text-xs uppercase font-medium flex items-center gap-2`}>
                    <span className={`w-2 h-2 rounded-full ${dot} inline-block animate-ping`} />
                    {eyebrow}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-serif leading-tight text-cream">
                    {slide.kind === "item" || slide.kind === "new"
                      ? slide.name
                      : slide.kind === "offer"
                        ? `${slide.discountLabel} · ${slide.code}`
                        : t.taglineBrand}
                  </h1>
                  <p className="text-sm md:text-base text-gray-400 max-w-md leading-relaxed font-light">
                    {slide.kind === "item" || slide.kind === "new"
                      ? slide.description ?? t.brandDescription
                      : slide.kind === "offer"
                        ? `${t.useCode} ${slide.code}. ${tagline}`
                        : t.brandDescription}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-6">
                    {(slide.kind === "item" || slide.kind === "new") && (
                      <span className={`text-2xl font-serif ${accent}`}>
                        €{slide.price.toFixed(2)}
                      </span>
                    )}
                    {slide.kind === "offer" && (
                      <span className="text-2xl font-serif text-gold">
                        {slide.discountLabel}
                      </span>
                    )}
                    <Link
                      href="/menu"
                      className={`${cta} text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300`}
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

                {/* Right: floating visual with ambient glow */}
                <div className="relative lg:col-span-7 flex justify-center items-center order-1 lg:order-2 min-h-64">
                  <div className={`absolute w-72 h-72 ${glow} rounded-full blur-3xl dynamic-glow`} />
                  {"imageUrl" in slide && slide.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slide.imageUrl}
                      alt={slide.name}
                      className="w-4/5 md:w-2/3 max-w-md aspect-square object-cover rounded-full shadow-2xl border-4 border-white/5 floating-animation"
                    />
                  ) : (
                    <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-carbon border-4 border-white/5 shadow-2xl flex items-center justify-center floating-animation">
                      <span aria-hidden className="text-7xl md:text-8xl select-none">
                        {isOffer ? "🏷️" : "🍣"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Dot indicators */}
        {many && (
          <div className="flex justify-center gap-2.5 mt-10">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => goTo(i)}
                aria-label={`${t.goToSlide} ${i + 1}`}
                aria-current={i === current}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === current
                    ? "w-8 bg-accent"
                    : "w-2 bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
