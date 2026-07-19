// app/menu/page.tsx

import { getPublicMenu } from "@/lib/actions/public-menu.actions";
import { getDict } from "@/lib/i18n/server";
import MenuBrowser from "@/components/menu/MenuBrowser";

export const metadata = {
  title: "Menu",
  description: "Browse our full sushi menu.",
};

type PublicMenuItem = Awaited<ReturnType<typeof getPublicMenu>>[number]["menuItems"][number];

function serializeMenuItem(item: PublicMenuItem) {
  return {
    ...item,
    price: Number(item.price),
    discountPrice: item.discountPrice ? Number(item.discountPrice) : null,
  };
}

export default async function PublicMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; highlight?: string }>;
}) {
  const [categories, t, params] = await Promise.all([
    getPublicMenu(),
    getDict(),
    searchParams,
  ]);

  // Serialize every Decimal price before crossing into Client Components
  const serializedCategories = categories.map((cat) => ({
    ...cat,
    menuItems: cat.menuItems.map(serializeMenuItem),
    children: cat.children.map((child) => ({
      ...child,
      menuItems: child.menuItems.map(serializeMenuItem),
    })),
  }));

  return (
    <div className="bg-night">
      {/* Banner — fades to solid night black at the bottom so it dissolves
          into the page instead of ending in a hard-edged rectangle. */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/menu-header.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-night/35" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,12,16,0.15) 0%, transparent 35%, var(--color-night) 100%)",
          }}
        />
      </div>

      <div className="pt-14 pb-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-accent text-xs font-semibold uppercase tracking-widest">
              {t.menu.eyebrow}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif mt-2 text-cream">
              {t.menu.title}
            </h1>
            <p className="text-xs text-gray-400 mt-4 max-w-md mx-auto font-light">
              {t.menu.note}
            </p>
          </div>
          <MenuBrowser
            categories={serializedCategories}
            initialQuery={params.q}
            highlightId={params.highlight}
          />
        </div>
      </div>
    </div>
  );
}
