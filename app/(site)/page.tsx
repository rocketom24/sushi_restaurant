import Link from "next/link";
import { getFeaturedItems } from "@/lib/actions/public-menu.actions";
import { getActiveHeroSlidesForHome } from "@/lib/actions/hero-slides.actions";
import { getDict } from "@/lib/i18n/server";
import HeroShowcase from "@/components/home/HeroShowcase";
import ScrollVideoSection from "@/components/home/ScrollVideoSection";
import FeaturedMenuCarousel from "@/components/home/FeaturedMenuCarousel";

export const metadata = {
  title: "Nagasaki Sushi & Poke — Japanese Sushi, Delivered & at the Table",
  description:
    "The art of sushi meets minimalism. Order online or book a table.",
};

export default async function HomePage() {
  const [slides, featured, t] = await Promise.all([
    getActiveHeroSlidesForHome(),
    getFeaturedItems(),
    getDict(),
  ]);

  return (
    <div>
      {/* Hero slider — owner-editable, animated rotation */}
      <HeroShowcase slides={slides} />

      {/* Cinematic scroll-scrubbed video */}
      <ScrollVideoSection />

      {/* Featured menu highlights — image, price/discount, name, short
          description, 3D tilt-on-hover cards */}
      <FeaturedMenuCarousel items={featured} />

      {/* Philosophy */}
      <section className="py-20 bg-carbon px-6 md:px-16 lg:px-24 border-t border-white/5">
        <div className="max-w-2xl">
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
      </section>

      {/* Hours & reserve */}
      <section className="py-24 bg-night px-6 md:px-16 lg:px-24 text-center">
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
      </section>
    </div>
  );
}
