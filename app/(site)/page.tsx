import Link from "next/link";
import { getFeaturedItems } from "@/lib/actions/public-menu.actions";

export const metadata = {
  title: "Sushi Restaurant — Order Online & Reserve a Table",
  description:
    "Fresh sushi with an Italian twist. Browse the menu, order online, or book a table.",
};

export default async function HomePage() {
  const featured = await getFeaturedItems();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.12),transparent_55%)]"
        />
        <div className="relative max-w-6xl mx-auto px-4 py-28 text-center">
          <p className="text-orange-500 text-xs font-medium tracking-[0.35em] uppercase mb-5">
            Japanese Kitchen · Italian Soul
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-white tracking-tight mb-6">
            Experience the <span className="text-orange-500">Taste</span>
            <br />
            of Fresh Sushi
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
            Handcrafted rolls and seasonal dishes — order online for takeaway
            or delivery, or reserve your table in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/menu"
              className="rounded-md bg-orange-600 text-white px-7 py-3 font-medium hover:bg-orange-500 transition-colors"
            >
              View Menu
            </Link>
            <Link
              href="/reservations/new"
              className="rounded-md border border-white/25 text-white px-7 py-3 font-medium hover:border-orange-500/70 hover:text-orange-400 transition-colors"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Featured dishes */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-10">
            <p className="text-orange-500 text-xs font-medium tracking-[0.35em] uppercase mb-3">
              Chef&apos;s Selection
            </p>
            <h2 className="font-serif text-3xl text-white">Featured Dishes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((item) => (
              <Link
                key={item.id}
                href="/menu"
                className="group bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden hover:border-orange-500/50 transition-colors"
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="h-44 w-full bg-neutral-800 flex items-center justify-center text-5xl">
                    🍣
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-white group-hover:text-orange-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-sm font-semibold text-orange-400">
                      €{item.price.toFixed(2)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/menu"
              className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              Explore the full menu &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="border-y border-white/10 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          <div>
            <p className="text-4xl mb-4">🥢</p>
            <h3 className="font-serif text-lg text-white mb-2">Browse the Menu</h3>
            <p className="text-sm text-gray-500">
              Explore our full selection of sushi and Italian-inspired dishes.
            </p>
          </div>
          <div>
            <p className="text-4xl mb-4">🛵</p>
            <h3 className="font-serif text-lg text-white mb-2">Order Online</h3>
            <p className="text-sm text-gray-500">
              Takeaway, delivery, or dine-in — pay by card or cash.
            </p>
          </div>
          <div>
            <p className="text-4xl mb-4">📅</p>
            <h3 className="font-serif text-lg text-white mb-2">Reserve a Table</h3>
            <p className="text-sm text-gray-500">
              Book online and we&apos;ll have your table ready when you arrive.
            </p>
          </div>
        </div>
      </section>

      {/* Hours & CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-orange-500 text-xs font-medium tracking-[0.35em] uppercase mb-3">
          Visit Us
        </p>
        <h2 className="font-serif text-3xl text-white mb-3">Opening Hours</h2>
        <p className="text-gray-400 mb-10">
          Lunch 12:00–14:30 &nbsp;·&nbsp; Dinner 18:00–22:30
        </p>
        <Link
          href="/reservations/new"
          className="inline-block rounded-md bg-orange-600 text-white px-7 py-3 font-medium hover:bg-orange-500 transition-colors"
        >
          Reserve Your Table
        </Link>
      </section>
    </div>
  );
}
