// components/home/hero/FullBleedSlide.tsx
import Link from "next/link";
import type { HeroSlideData } from "./types";
import type { Dict } from "@/lib/i18n/dictionaries";
import SushiConveyor from "./SushiConveyor";
import DiscountBadge from "./DiscountBadge";

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
  const accent = isOffer ? "text-platinum" : "text-accent";
  const cta = isOffer ? "bg-platinum text-night hover:bg-white" : "bg-accent text-white hover:bg-white hover:text-night";
  const eyebrow = slide.badgeText || (isOffer ? dict.offerEyebrow : dict.itemEyebrow);
  const revealClass = (n: 1 | 2 | 3 | 4) => (active ? `reveal-${n}` : "opacity-0");

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
            {isOffer ? "🏷️" : "🍣"}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/10" />

      {isOffer && slide.discountLabel && (
        <div className="absolute top-5 right-5 sm:top-8 sm:right-8 md:top-10 md:right-14 z-20">
          <DiscountBadge label={slide.discountLabel} active={active} size="lg" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-16 md:bottom-20 z-10 px-6 md:px-16 lg:px-24 max-w-2xl">
        <span className={`${accent} ${revealClass(1)} tracking-widest text-xs uppercase font-semibold flex items-center gap-2`}>
          <span className={`w-2 h-2 rounded-full ${isOffer ? "bg-platinum" : "bg-accent"} inline-block animate-ping`} />
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
          {!isOffer && slide.price !== null && (
            <span className={`font-hero text-3xl md:text-4xl font-bold ${accent}`}>
              €{slide.price.toFixed(2)}
            </span>
          )}
          <Link
            href={slide.ctaHref || "/menu"}
            className={`${cta} px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105`}
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
