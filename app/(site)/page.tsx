import Link from "next/link";
import { getFeaturedItems } from "@/lib/actions/public-menu.actions";
import { getActiveHeroSlidesForHome } from "@/lib/actions/hero-slides.actions";
import { getDict } from "@/lib/i18n/server";
import HeroShowcase from "@/components/home/HeroShowcase";
import ScrollVideoSection from "@/components/home/ScrollVideoSection";

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

      {/* Featured / classic selections */}
      {featured.length > 0 && (
        <section className="py-24 bg-night px-6 md:px-16 lg:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-accent text-xs font-semibold uppercase tracking-widest">
                {t.home.featuredEyebrow}
              </span>
              <h2 className="text-3xl md:text-5xl font-serif mt-2 text-cream">
                {t.home.featuredTitle}
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-2 md:mt-0 max-w-xs font-light">
              {t.home.featuredNote}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((item) => (
              <Link
                key={item.id}
                href="/menu"
                className="glass p-5 rounded-3xl group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 block"
              >
                <div className="h-56 overflow-hidden rounded-2xl mb-4 relative">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/3 flex items-center justify-center text-6xl">
                      🍣
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-serif text-xl group-hover:text-accent transition-colors duration-300">
                    {item.name}
                  </h3>
                  <span className="text-sm font-semibold text-accent">
                    €{item.price.toFixed(2)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                    {item.description}
                  </p>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-[10px] tracking-wider text-gray-500 uppercase">
                    {t.home.specialty}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-accent text-white flex items-center justify-center transition-colors text-sm">
                    +
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-block border border-white/20 hover:border-accent hover:text-accent px-8 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300"
            >
              {t.home.seeFullMenu}
            </Link>
          </div>
        </section>
      )}

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
