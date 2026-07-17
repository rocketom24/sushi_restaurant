// components/home/hero/ImageSideSlide.tsx
import Link from "next/link";
import type { HeroSlideData } from "./types";
import type { Dict } from "@/lib/i18n/dictionaries";
import DiscountBadge from "./DiscountBadge";

export default function ImageSideSlide({
  slide,
  reverse,
  active,
  dict,
}: {
  slide: HeroSlideData;
  reverse: boolean;
  active: boolean;
  dict: Dict["home"];
}) {
  const isOffer = slide.kind === "OFFER";
  const accent = isOffer ? "text-platinum" : "text-accent";
  const dot = isOffer ? "bg-platinum" : "bg-accent";
  const glow = isOffer ? "bg-platinum/10" : "bg-accent/10";
  const cta = isOffer ? "bg-platinum text-night hover:bg-white" : "bg-accent text-white hover:bg-white hover:text-night";
  const eyebrow = slide.badgeText || (isOffer ? dict.offerEyebrow : dict.itemEyebrow);
  const revealClass = (n: 1 | 2 | 3 | 4) => (active ? `reveal-${n}` : "opacity-0");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
      {/* Text */}
      <div
        className={`space-y-5 md:space-y-6 lg:col-span-5 z-10 order-2 ${
          reverse ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <span
          className={`${accent} ${revealClass(1)} tracking-widest text-xs uppercase font-semibold flex items-center gap-2`}
        >
          <span className={`w-2 h-2 rounded-full ${dot} inline-block animate-ping`} />
          {eyebrow}
        </span>
        <h1
          className={`${revealClass(2)} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.05] text-cream drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]`}
        >
          {slide.title}
        </h1>
        {slide.description && (
          <p className={`${revealClass(3)} text-sm md:text-base text-gray-300 max-w-md leading-relaxed font-light`}>
            {slide.description}
          </p>
        )}
        <div className={`${revealClass(4)} pt-2 flex flex-wrap items-center gap-4 sm:gap-6`}>
          {!isOffer && slide.price !== null && (
            <span className={`text-3xl md:text-4xl font-serif font-bold ${accent}`}>
              €{slide.price.toFixed(2)}
            </span>
          )}
          {isOffer && slide.couponCode && (
            <span className="text-xs text-gray-400">
              {dict.useCode} <span className="text-platinum font-semibold">{slide.couponCode}</span>
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
            className="border border-white/20 hover:border-accent hover:text-accent px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
          >
            {dict.bookTable}
          </Link>
        </div>
      </div>

      {/* Floating visual with ambient glow */}
      <div
        className={`relative lg:col-span-7 flex justify-center items-center order-1 min-h-56 sm:min-h-64 ${
          reverse ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <div className={`absolute w-56 h-56 sm:w-72 sm:h-72 ${glow} rounded-full blur-3xl dynamic-glow`} />
        {slide.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-4/5 md:w-2/3 max-w-md aspect-square object-cover rounded-full shadow-2xl border-4 border-white/5 floating-animation"
          />
        ) : (
          <div className="w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full bg-carbon border-4 border-white/5 shadow-2xl flex items-center justify-center floating-animation">
            <span aria-hidden className="text-6xl sm:text-7xl md:text-8xl select-none">
              {isOffer ? "🏷️" : "🍣"}
            </span>
          </div>
        )}

        {isOffer && slide.discountLabel && (
          <div className={`absolute top-0 ${reverse ? "left-2 sm:left-4" : "right-2 sm:right-4"}`}>
            <DiscountBadge label={slide.discountLabel} active={active} />
          </div>
        )}
      </div>
    </div>
  );
}
