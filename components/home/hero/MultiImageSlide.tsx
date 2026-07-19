// components/home/hero/MultiImageSlide.tsx
import Link from "next/link";
import type { HeroSlideData } from "./types";
import type { Dict } from "@/lib/i18n/dictionaries";
import DiscountBadge from "./DiscountBadge";

// Fixed collage positions/sizes/rotations for up to 4 tiles — deliberately
// staggered and overlapping rather than a plain grid.
const TILE_STYLES = [
  "absolute left-0 top-1 w-[63%] h-[66%] -rotate-3 z-20",
  "absolute right-0 top-0 w-[51%] h-[50%] rotate-2 z-30",
  "absolute left-[7%] bottom-0 w-[47%] h-[47%] rotate-3 z-10",
  "absolute right-[1%] bottom-1 w-[41%] h-[41%] -rotate-2 z-40",
];

export default function MultiImageSlide({
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

  const images = (slide.imageUrls.length > 0 ? slide.imageUrls : slide.imageUrl ? [slide.imageUrl] : []).slice(0, 4);
  const PLACEHOLDER_EMOJI = isOffer ? ["🏷️", "🎉", "✨"] : ["🍣", "🍤", "🍥"];
  const revealClass = (n: 1 | 2 | 3 | 4) => (active ? `reveal-${n}` : "opacity-0");

  return (
    <div className="w-full h-full flex items-center px-6 md:px-16 lg:px-24 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-10 items-center w-full">
        {/* Text */}
        <div className="space-y-3 md:space-y-6 lg:col-span-5 z-10 order-2 lg:order-1">
          <span className={`${accent} ${revealClass(1)} tracking-widest text-xs uppercase font-semibold flex items-center gap-2`}>
            <span className={`w-2 h-2 rounded-full ${isOffer ? "bg-platinum" : "bg-accent"} inline-block animate-ping`} />
            {eyebrow}
          </span>
          <h1
            className={`font-hero ${revealClass(2)} text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-cream drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]`}
          >
            {slide.title}
          </h1>
          {slide.description && (
            <p className={`${revealClass(3)} text-sm md:text-base text-gray-300 max-w-md leading-relaxed font-light line-clamp-2`}>
              {slide.description}
            </p>
          )}
          <div className={`${revealClass(4)} pt-1 flex flex-wrap items-center gap-3 sm:gap-6`}>
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
              className="border border-white/20 hover:border-accent hover:text-accent px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
            >
              {dict.bookTable}
            </Link>
          </div>
        </div>

        {/* Collage — tiles desaturate by default and bloom into full color
            on hover, with a grounded contact shadow instead of a flat
            hairline border. */}
        <div className="relative lg:col-span-7 order-1 lg:order-2 h-56 sm:h-96 md:h-120">
          {isOffer && slide.discountLabel && (
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-50">
              <DiscountBadge label={slide.discountLabel} active={active} />
            </div>
          )}
          {images.length > 0
            ? images.map((url, i) => (
                <div
                  key={url + i}
                  style={active ? { animationDelay: `${i * 120}ms` } : undefined}
                  className={`${TILE_STYLES[i]} group/tile rounded-2xl overflow-hidden shadow-[inset_0_0_45px_14px_rgba(0,0,0,0.75),0_25px_55px_-18px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-105 hover:z-50 ${
                    active ? "tile-in-animation" : "opacity-0"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={slide.title}
                    className="w-full h-full object-cover grayscale-85 saturate-50 contrast-105 transition-[filter] duration-700 ease-out group-hover/tile:grayscale-0 group-hover/tile:saturate-100"
                  />
                </div>
              ))
            : // No photos yet — still show the collage arrangement itself
              // (positions, rotation, stagger) with placeholder tiles.
              PLACEHOLDER_EMOJI.map((emoji, i) => (
                <div
                  key={i}
                  style={active ? { animationDelay: `${i * 120}ms` } : undefined}
                  className={`${TILE_STYLES[i]} group/tile rounded-2xl overflow-hidden shadow-[inset_0_0_45px_14px_rgba(0,0,0,0.75),0_25px_55px_-18px_rgba(0,0,0,0.8)] bg-carbon flex items-center justify-center transition-transform duration-500 hover:scale-105 hover:z-50 ${
                    active ? "tile-in-animation" : "opacity-0"
                  }`}
                >
                  <span
                    aria-hidden
                    className="text-5xl opacity-30 select-none grayscale-85 saturate-50 transition-[filter] duration-700 ease-out group-hover/tile:grayscale-0 group-hover/tile:saturate-100 group-hover/tile:opacity-60"
                  >
                    {emoji}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
