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
      <section className="bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
            Fresh Sushi, Italian Soul
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Handcrafted rolls and seasonal dishes — order online for takeaway
            or delivery, or reserve your table in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/menu"
              className="rounded-md bg-white text-neutral-900 px-6 py-3 font-medium hover:bg-gray-200"
            >
              View Menu
            </Link>
            <Link
              href="/reservations/new"
              className="rounded-md border border-white/40 px-6 py-3 font-medium hover:bg-white/10"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Featured dishes */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900">
              Featured Dishes
            </h2>
            <Link
              href="/menu"
              className="text-sm text-gray-500 hover:text-neutral-900 hover:underline"
            >
              Full menu &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((item) => (
              <Link
                key={item.id}
                href="/menu"
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-full bg-neutral-100 flex items-center justify-center text-4xl">
                    🍣
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-neutral-900">{item.name}</h3>
                    <span className="text-sm font-semibold text-neutral-900">
                      €{item.price.toFixed(2)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl mb-3">🥢</p>
            <h3 className="font-semibold text-neutral-900 mb-1">Browse the Menu</h3>
            <p className="text-sm text-gray-500">
              Explore our full selection of sushi and Italian-inspired dishes.
            </p>
          </div>
          <div>
            <p className="text-3xl mb-3">🛵</p>
            <h3 className="font-semibold text-neutral-900 mb-1">Order Online</h3>
            <p className="text-sm text-gray-500">
              Takeaway, delivery, or dine-in — pay by card or cash.
            </p>
          </div>
          <div>
            <p className="text-3xl mb-3">📅</p>
            <h3 className="font-semibold text-neutral-900 mb-1">Reserve a Table</h3>
            <p className="text-sm text-gray-500">
              Book online and we&apos;ll have your table ready when you arrive.
            </p>
          </div>
        </div>
      </section>

      {/* Hours & CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Opening Hours
        </h2>
        <p className="text-gray-500 mb-8">
          Lunch 12:00–14:30 &nbsp;·&nbsp; Dinner 18:00–22:30
        </p>
        <Link
          href="/reservations/new"
          className="inline-block rounded-md bg-neutral-900 text-white px-6 py-3 font-medium hover:bg-neutral-800"
        >
          Reserve Your Table
        </Link>
      </section>
    </div>
  );
}
