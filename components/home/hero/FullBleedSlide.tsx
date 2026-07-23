// components/home/hero/FullBleedSlide.tsx
import Link from "next/link";
import type { HeroSlideData } from "./types";
import type { Dict } from "@/lib/i18n/dictionaries";
import SushiConveyor from "./SushiConveyor";
import DiscountBadge from "./DiscountBadge";
import DiscountMarquee from "./DiscountMarquee";

export default function FullBleedSlide({
  slide,
  active,
  dict,
}: {
  slide: HeroSlideData;
  active: boolean;
  dict: Dict["home"];
}) {
  const isOffer = slide.kind === "OFFER";
  const eyebrow = slide.badgeText || (isOffer ? dict.offerEyebrow : dict.itemEyebrow);
  const revealClass = (n: 1 | 2 | 3 | 4) => (active ? `reveal-${n}` : "opacity-0");

  if (isOffer) {
    // Discount-header treatment: centered image with a glow halo, an
    // orbiting discount badge, and two mirrored scrolling marquees above
    // and below — ruby-on-near-black, distinct from the FEATURED
    // full-bleed-photo treatment below. Accent (ruby) is used directly
    // for the eyebrow/CTA here, unlike the platinum/gold used by the
    // other offer layouts — those sit over red smoke where red text
    // would vanish; this slide sits on solid near-black, so ruby reads
    // fine and matches the rest of the discount-header palette.
    return (
      <div className="relative w-full h-full bg-night flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center py-4 md:py-6 min-h-0">
          <div
            aria-hidden
            className="absolute w-[70%] max-w-xl aspect-16/10 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(155,27,48,0.45), transparent 70%)" }}
          />

          {/* Marquee text layer — sits behind the image (lower z-index),
              sized large so it reads as a moving background layer that
              peeks out past the image's edges rather than framing text
              above/below it. */}
          <div
            aria-hidden
            className="absolute inset-0 z-0 flex flex-col justify-between py-1 md:py-2 pointer-events-none"
          >
            <DiscountMarquee direction="right" />
            <DiscountMarquee direction="left" />
          </div>

          <div className="relative z-10 w-[86%] sm:w-[75%] max-w-xl aspect-16/10">
            {slide.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover rounded-xl border-2 border-accent/60 shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
              />
            ) : (
              <div className="w-full h-full rounded-xl border-2 border-accent/60 bg-carbon flex items-center justify-center shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
                <span aria-hidden className="text-7xl opacity-20 select-none">
                  🏷️
                </span>
              </div>
            )}

            {slide.discountLabel && (
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 z-20">
                <DiscountBadge label={slide.discountLabel} active={active} variant="orbit" />
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-2xl">
          <span
            className={`text-accent ${revealClass(1)} tracking-widest text-xs uppercase font-semibold inline-flex items-center gap-2 justify-center`}
          >
            <span className="w-2 h-2 rounded-full bg-accent inline-block animate-ping" />
            {eyebrow}
          </span>
          <h1
            className={`font-hero font-bold mt-3 ${revealClass(2)} text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-cream drop-shadow-[0_2px_24px_rgba(0,0,0,0.7)]`}
          >
            {slide.title}
          </h1>
          {slide.description && (
            <p className={`mt-3 ${revealClass(3)} text-sm md:text-base text-gray-200 leading-relaxed font-light drop-shadow`}>
              {slide.description}
            </p>
          )}
          <div className={`mt-5 ${revealClass(4)} flex flex-wrap items-center justify-center gap-4 sm:gap-6`}>
            <Link
              href={slide.ctaHref || "/menu"}
              className="bg-accent text-white hover:bg-white hover:text-night px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
            >
              {slide.ctaLabel || dict.orderNow}
            </Link>
            <Link
              href="/reservations/new"
              className="border border-white/30 hover:border-accent hover:text-accent px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
            >
              {dict.bookTable}
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2 py-3 md:py-4">
          <span aria-hidden className="w-10 h-px bg-accent" />
          <span className="font-hero text-cream/55 text-xs md:text-sm tracking-[0.3em] uppercase">
            Limited Time Offers · Today Only
          </span>
          <span className="font-sans text-accent text-[10px] tracking-[0.25em] uppercase">
            Scroll To Explore
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {slide.imageUrl ? (
        // Re-keying on `active` remounts the node so the Ken Burns zoom
        // restarts from 0% every time this slide comes back into view.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={active ? `${slide.id}-active` : slide.id}
          src={slide.imageUrl}
          alt={slide.title}
          className={`absolute inset-0 w-full h-full object-cover ${active ? "ken-burns-animation" : ""}`}
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-carbon to-night flex items-center justify-center">
          <span aria-hidden className="text-9xl opacity-20 select-none">
            🍣
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/10" />

      <div className="absolute inset-x-0 bottom-16 md:bottom-20 z-10 px-6 md:px-16 lg:px-24 max-w-2xl">
        <span className={`text-accent ${revealClass(1)} tracking-widest text-xs uppercase font-semibold flex items-center gap-2`}>
          <span className="w-2 h-2 rounded-full bg-accent inline-block animate-ping" />
          {eyebrow}
        </span>
        <h1
          className={`font-hero font-bold mt-4 ${revealClass(2)} text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-cream drop-shadow-[0_2px_24px_rgba(0,0,0,0.7)]`}
        >
          {slide.title}
        </h1>
        {slide.description && (
          <p className={`mt-4 ${revealClass(3)} text-sm md:text-base text-gray-200 max-w-lg leading-relaxed font-light drop-shadow`}>
            {slide.description}
          </p>
        )}
        <div className={`mt-6 ${revealClass(4)} flex flex-wrap items-center gap-4 sm:gap-6`}>
          {slide.price !== null && (
            <span className="font-hero text-3xl md:text-4xl font-bold text-accent">
              €{slide.price.toFixed(2)}
            </span>
          )}
          <Link
            href={slide.ctaHref || "/menu"}
            className="bg-accent text-white hover:bg-white hover:text-night px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
          >
            {slide.ctaLabel || dict.orderNow}
          </Link>
          <Link
            href="/reservations/new"
            className="border border-white/30 hover:border-accent hover:text-accent px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
          >
            {dict.bookTable}
          </Link>
        </div>
      </div>

      <SushiConveyor active={active} />
    </div>
  );
}
