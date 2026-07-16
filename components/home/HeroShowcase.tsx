"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type ShowcaseItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
};

const TAGLINES = [
  "L'Arte del Sushi Incontra il Minimalismo.",
  "L'Eccellenza del Pescato, Ogni Giorno.",
  "Tradizione Giapponese, Anima Italiana.",
];

/**
 * KURO hero: asymmetric grid with a floating, glowing dish visual.
 * With 2+ featured dishes it becomes a 5-second auto-slider with
 * manual arrows; with 0–1 it renders a single static slide.
 */
export default function HeroShowcase({ items }: { items: ShowcaseItem[] }) {
  const slides: (ShowcaseItem | null)[] = items.length > 0 ? items : [null];
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + slides.length) % slides.length);
      if (timer.current) clearInterval(timer.current);
      if (slides.length > 1) {
        timer.current = setInterval(
          () => setCurrent((c) => (c + 1) % slides.length),
          5000
        );
      }
    },
    [slides.length]
  );

  useEffect(() => {
    if (slides.length > 1) {
      timer.current = setInterval(
        () => setCurrent((c) => (c + 1) % slides.length),
        5000
      );
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [slides.length]);

  return (
    <section className="relative min-h-[80vh] flex items-center py-16 px-6 md:px-16 lg:px-24 overflow-hidden bg-gradient-to-b from-night to-carbon">
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            aria-label="Piatto precedente"
            className="absolute left-3 md:left-6 z-40 w-10 h-10 rounded-full border border-white/5 hover:border-accent bg-black/40 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-white transition-all text-lg"
          >
            ‹
          </button>
          <button
            onClick={() => goTo(current + 1)}
            aria-label="Piatto successivo"
            className="absolute right-3 md:right-6 z-40 w-10 h-10 rounded-full border border-white/5 hover:border-accent bg-black/40 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-white transition-all text-lg"
          >
            ›
          </button>
        </>
      )}

      <div className="relative w-full">
        {slides.map((item, i) => (
          <div key={item?.id ?? "brand"} className={`hero-slide ${i === current ? "active" : ""}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: text */}
              <div className="space-y-6 lg:col-span-5 z-10 order-2 lg:order-1">
                <span className="text-accent tracking-widest text-xs uppercase font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent inline-block animate-ping" />
                  {item ? "In Evidenza · Selezione dello Chef" : "Sushi Giapponese · Cucina Italiana"}
                </span>
                <h1 className="text-4xl md:text-6xl font-serif leading-tight text-cream">
                  {TAGLINES[i % TAGLINES.length]}
                </h1>
                <p className="text-sm md:text-base text-gray-400 max-w-md leading-relaxed font-light">
                  {item?.description ??
                    "Scopri le creazioni dello Chef, preparate espresse con il pescato del giorno. Ordina online o prenota il tuo tavolo."}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-6">
                  {item && (
                    <span className="text-2xl font-serif text-accent">
                      €{item.price.toFixed(2)}
                    </span>
                  )}
                  <Link
                    href="/menu"
                    className="bg-accent hover:bg-white hover:text-night text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300"
                  >
                    Ordina Ora
                  </Link>
                  <Link
                    href="/reservations/new"
                    className="border border-white/20 hover:border-accent hover:text-accent px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300"
                  >
                    Prenota un Tavolo
                  </Link>
                </div>
              </div>

              {/* Right: floating dish visual with ambient glow */}
              <div className="relative lg:col-span-7 flex justify-center items-center order-1 lg:order-2 min-h-64">
                <div className="absolute w-72 h-72 bg-accent/10 rounded-full blur-3xl dynamic-glow" />
                {item?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-4/5 md:w-2/3 max-w-md aspect-square object-cover rounded-full shadow-2xl border-4 border-white/5 floating-animation"
                  />
                ) : (
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-carbon border-4 border-white/5 shadow-2xl flex items-center justify-center floating-animation">
                    <span aria-hidden className="text-7xl md:text-8xl select-none">
                      🍣
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
