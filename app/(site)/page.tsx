import Link from "next/link";
import { getFeaturedItems } from "@/lib/actions/public-menu.actions";
import { getActiveHeroSlidesForHome } from "@/lib/actions/hero-slides.actions";
import { getDict } from "@/lib/i18n/server";
import { getRestaurantSettings } from "@/lib/settings/settings";
import {
  isTimeWithinHours,
  parseOperatingHours,
  type DayOfWeek,
} from "@/lib/settings/operating-hours";
import HeroShowcase from "@/components/home/HeroShowcase";
import ScrollVideoSection from "@/components/home/ScrollVideoSection";
import FeaturedMenuCarousel from "@/components/home/FeaturedMenuCarousel";
import RevealSection from "@/components/home/RevealSection";
import ReserveTableSection from "@/components/home/ReserveTableSection";
import DotField from "@/src/components/DotField/DotField";

export const metadata = {
  title: "Nagasaki Sushi & Poke — Japanese Sushi, Delivered & at the Table",
  description:
    "The art of sushi meets minimalism. Order online or book a table.",
};

export default async function HomePage() {
  const [slides, featured, t, settings] = await Promise.all([
    getActiveHeroSlidesForHome(),
    getFeaturedItems(),
    getDict(),
    getRestaurantSettings(),
  ]);

  const operatingHours = parseOperatingHours(settings.operatingHours);
  const now = new Date();
  const isOpenNow = isTimeWithinHours(now, operatingHours);
  const todayDay = now.getDay() as DayOfWeek;

  return (
    <div>
      {/* Hero slider — owner-editable, animated rotation */}
      <HeroShowcase slides={slides} />

      {/* Cinematic scroll-scrubbed video */}
      <ScrollVideoSection />

      {/* Featured menu highlights — image, price/discount, name, short
          description, 3D tilt-on-hover cards */}
      <FeaturedMenuCarousel items={featured} />

      {/* Home delivery CTA */}
      <RevealSection className="relative py-14 md:py-20 bg-night px-6 md:px-16 lg:px-24 overflow-hidden">
        {/* Ambient dot-field background — theme-colored, dimmed, masked
            top/bottom so it fades into the night sections above/below
            instead of a hard rectangle edge. Content stays above at z-10. */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-25 pointer-events-none"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}
        >
          <DotField
            dotRadius={1.2}
            dotSpacing={20}
            cursorRadius={260}
            bulgeStrength={40}
            glowRadius={140}
            sparkle={false}
            waveAmplitude={0}
            gradientFrom="rgba(155, 27, 48, 0.55)"
            gradientTo="rgba(242, 222, 212, 0.35)"
            glowColor="#9b1b30"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative flex justify-center">
            <div
              aria-hidden
              className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl"
            />
            {/* Filled dark red circle behind the delivery man. Sized to
                roughly match the photo's own height so its lower edge
                lines up with the circle's curve; the photo's bottom fades
                into it (see mask below) instead of showing a hard cutoff. */}
            <div
              aria-hidden
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 md:w-md md:h-112 rounded-full bg-deep-bordeaux shadow-[0_0_40px_rgba(155,27,48,0.35)] floating-animation overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm"
              />
            </div>
            <div
              aria-hidden
              className="absolute bottom-6 inset-x-12 h-8 rounded-full bg-black/60 blur-2xl"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/deliveryman.png"
              alt={t.home.deliveryImageAlt}
              className="relative w-full max-w-sm sm:max-w-lg md:max-w-xl image-tilt-animation"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 78%, transparent 96%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 78%, transparent 96%)",
              }}
            />
          </div>

          <div className="text-center lg:text-left">
            <span className="text-accent text-xs font-semibold uppercase tracking-widest">
              {t.home.deliveryEyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif mt-3 mb-4 text-cream leading-tight">
              {t.home.deliveryTitle}
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-light mb-8 max-w-md mx-auto lg:mx-0">
              {t.home.deliverySubtitle}
            </p>
            <Link
              href="/menu"
              className="inline-block bg-accent hover:bg-white hover:text-night text-white px-8 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300"
            >
              {t.home.orderNow}
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* Table reservation CTA */}
      <ReserveTableSection
        operatingHours={operatingHours}
        isOpenNow={isOpenNow}
        todayDay={todayDay}
      />

      {/* Philosophy */}
      <RevealSection className="relative py-14 md:py-20 bg-carbon px-6 md:px-16 lg:px-24 overflow-hidden">
        {/* Top/bottom fade — blends this carbon panel into the night
            sections above and below it instead of a hard color cut. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-16 md:h-20 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, var(--color-night) 0%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 md:h-20 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--color-night) 0%, transparent 100%)" }}
        />
        <div className="relative max-w-2xl">
          <span className="text-gray-500 text-xs uppercase tracking-widest">
            {t.home.philosophyEyebrow}
          </span>
          <h3 className="text-3xl font-serif mt-2 mb-4 text-cream">
            {t.home.philosophyTitle}
          </h3>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            {t.home.philosophyText}
          </p>
        </div>
      </RevealSection>

      {/* Hours & reserve */}
      <RevealSection className="py-16 md:py-20 bg-night px-6 md:px-16 lg:px-24 text-center">
        <span className="text-accent text-xs font-semibold uppercase tracking-widest">
          {t.home.hoursEyebrow}
        </span>
        <h2 className="text-3xl md:text-4xl font-serif mt-2 mb-3 text-cream">
          {t.home.hoursTitle}
        </h2>
        <p className="text-sm text-gray-400 font-light mb-10">{t.footer.hours}</p>
        <Link
          href="/reservations/new"
          className="inline-block bg-accent hover:bg-white hover:text-night text-white px-8 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300"
        >
          {t.home.reserveCta}
        </Link>
      </RevealSection>
    </div>
  );
}
