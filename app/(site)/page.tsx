import Link from "next/link";
import { getFeaturedItems } from "@/lib/actions/public-menu.actions";
import HeroShowcase from "@/components/home/HeroShowcase";

export const metadata = {
  title: "KURO — Sushi Giapponese a Domicilio e al Tavolo",
  description:
    "L'arte del sushi incontra il minimalismo. Ordina online o prenota un tavolo.",
};

export default async function HomePage() {
  const featured = await getFeaturedItems();

  return (
    <div>
      {/* Hero slider */}
      <HeroShowcase items={featured} />

      {/* Featured / classic selections */}
      {featured.length > 0 && (
        <section className="py-24 bg-night px-6 md:px-16 lg:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-accent text-xs font-semibold uppercase tracking-widest">
                {"// In Evidenza"}
              </span>
              <h2 className="text-3xl md:text-5xl font-serif mt-2 text-cream">
                Le Selezioni dello Chef
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-2 md:mt-0 max-w-xs font-light">
              * Ogni piatto è preparato espresso utilizzando materie prime
              certificate e freschissime.
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
                    Specialità
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
              Scopri Tutto il Menu
            </Link>
          </div>
        </section>
      )}

      {/* Philosophy */}
      <section className="py-20 bg-carbon px-6 md:px-16 lg:px-24 border-t border-white/5">
        <div className="max-w-2xl">
          <span className="text-gray-500 text-xs uppercase tracking-widest">
            La Filosofia
          </span>
          <h3 className="text-3xl font-serif mt-2 mb-4 text-cream">
            La Nostra Visione
          </h3>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            Il perfetto equilibrio tra la millenaria cultura culinaria del Sol
            Levante e la freschezza e artigianalità tipiche dei migliori
            mercati italiani. Ogni piatto è preparato espresso, dal banco alla
            tavola.
          </p>
        </div>
      </section>

      {/* Hours & reserve */}
      <section className="py-24 bg-night px-6 md:px-16 lg:px-24 text-center">
        <span className="text-accent text-xs font-semibold uppercase tracking-widest">
          {"// Orari"}
        </span>
        <h2 className="text-3xl md:text-4xl font-serif mt-2 mb-3 text-cream">
          Vieni a Trovarci
        </h2>
        <p className="text-sm text-gray-400 font-light mb-10">
          Pranzo 12:00–14:30 &nbsp;·&nbsp; Cena 18:00–22:30
        </p>
        <Link
          href="/reservations/new"
          className="inline-block bg-accent hover:bg-white hover:text-night text-white px-8 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300"
        >
          Prenota il Tuo Tavolo
        </Link>
      </section>
    </div>
  );
}
