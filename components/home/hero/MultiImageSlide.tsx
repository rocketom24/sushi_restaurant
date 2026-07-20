// components/home/hero/MultiImageSlide.tsx
import Link from "next/link";
import type { HeroSlideData } from "./types";
import type { Dict } from "@/lib/i18n/dictionaries";
import DiscountBadge from "./DiscountBadge";

// One dominant "hero" tile plus up to three smaller supporting tiles,
// rather than four competing similarly-sized ones — a clear size
// hierarchy is what makes an uploaded photo actually read as the
// centerpiece instead of getting lost in a busy grid.
const TILE_STYLES = [
  "absolute left-0 top-2 w-[66%] h-[82%] -rotate-2 z-20",
  "absolute right-0 top-0 w-[46%] h-[46%] rotate-3 z-30",
  "absolute right-[2%] bottom-0 w-[42%] h-[42%] -rotate-3 z-40",
  "absolute left-[10%] -bottom-3 w-[32%] h-[32%] rotate-6 z-10",
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
  // Same reasoning as ImageSideSlide — this layout sits over the crimson
  // smoke background, so text/CTA use the palette's light gold-cream
  // instead of red, which would blend into the smoke behind it.
  const accent = "text-cream-vanilla";
  const cta = "bg-cream-vanilla text-night hover:bg-white";
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
            <span className="w-2 h-2 rounded-full bg-cream-vanilla inline-block animate-ping" />
            {eyebrow}
          </span>
          <h1
            className={`font-hero font-bold ${revealClass(2)} text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-cream drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)]`}
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
              className="border border-white/20 hover:border-cream-vanilla hover:text-cream-vanilla px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
            >
              {dict.bookTable}
            </Link>
          </div>
        </div>

        {/* Collage — one dominant tile carries the eye, smaller ones
            support it. Each tile blooms an accent glow and lifts/scales
            on hover, and desaturates by default until then, so a real
            uploaded photo actively pops forward instead of sitting flat
            in a grid. */}
        <div className="relative lg:col-span-7 order-1 lg:order-2 h-64 sm:h-104 md:h-136">
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
                  className={`${TILE_STYLES[i]} group/tile ${active ? "tile-in-animation" : "opacity-0"}`}
                >
                  {/* Accent glow that blooms behind this tile on hover. */}
                  <div
                    aria-hidden
                    className="absolute -inset-4 rounded-4xl bg-accent/20 blur-2xl opacity-0 group-hover/tile:opacity-100 transition-opacity duration-500 -z-10"
                  />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[inset_0_0_45px_14px_rgba(0,0,0,0.75),0_25px_55px_-18px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out group-hover/tile:scale-[1.04] group-hover/tile:z-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={slide.title}
                      className="w-full h-full object-cover grayscale-85 saturate-50 contrast-105 transition-[filter] duration-700 ease-out group-hover/tile:grayscale-0 group-hover/tile:saturate-100"
                    />
                  </div>
                </div>
              ))
            : // No photos yet — still show the collage arrangement itself
              // (positions, rotation, stagger) with placeholder tiles.
              PLACEHOLDER_EMOJI.map((emoji, i) => (
                <div
                  key={i}
                  style={active ? { animationDelay: `${i * 120}ms` } : undefined}
                  className={`${TILE_STYLES[i]} group/tile ${active ? "tile-in-animation" : "opacity-0"}`}
                >
                  <div
                    aria-hidden
                    className="absolute -inset-4 rounded-4xl bg-accent/20 blur-2xl opacity-0 group-hover/tile:opacity-100 transition-opacity duration-500 -z-10"
                  />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[inset_0_0_45px_14px_rgba(0,0,0,0.75),0_25px_55px_-18px_rgba(0,0,0,0.8)] bg-carbon flex items-center justify-center transition-transform duration-500 ease-out group-hover/tile:scale-[1.04] group-hover/tile:z-50">
                    <span
                      aria-hidden
                      className="text-5xl opacity-30 select-none grayscale-85 saturate-50 transition-[filter] duration-700 ease-out group-hover/tile:grayscale-0 group-hover/tile:saturate-100 group-hover/tile:opacity-60"
                    >
                      {emoji}
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
