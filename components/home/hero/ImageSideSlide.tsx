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
          className={`font-hero ${revealClass(2)} text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-cream drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]`}
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
            <span className={`font-hero text-3xl md:text-4xl font-bold ${accent}`}>
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

      {/* Borderless visual: no ring or frame — the photo's own edge
          dissolves into the dark background via a soft radial mask, the
          way a dish blends into a matching dark backdrop in a real photo
          shoot. Still grounded with a contact shadow and slowly circulating. */}
      <div
        className={`relative lg:col-span-7 flex justify-center items-center order-1 min-h-64 sm:min-h-96 ${
          reverse ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <div className={`absolute w-72 h-72 sm:w-96 sm:h-96 ${glow} rounded-full blur-3xl dynamic-glow`} />

        <div className="relative w-[85%] sm:w-3/4 max-w-lg aspect-square floating-animation">
          {/* Contact shadow — grounds the dish into the dark background. */}
          <div
            aria-hidden
            className="absolute -bottom-4 inset-x-6 h-10 rounded-full bg-black/70 blur-2xl"
          />

          <div
            className="relative w-full h-full"
            style={{
              maskImage: "radial-gradient(circle at center, black 55%, transparent 82%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 55%, transparent 82%)",
            }}
          >
            {slide.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover rounded-full hero-photo-spin-animation"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-carbon flex items-center justify-center">
                <span aria-hidden className="text-7xl sm:text-8xl opacity-25 select-none">
                  {isOffer ? "🏷️" : "🍣"}
                </span>
              </div>
            )}
          </div>
        </div>

        {isOffer && slide.discountLabel && (
          <div className={`absolute top-2 ${reverse ? "left-0 sm:left-2" : "right-0 sm:right-2"}`}>
            <DiscountBadge label={slide.discountLabel} active={active} />
          </div>
        )}
      </div>
    </div>
  );
}
