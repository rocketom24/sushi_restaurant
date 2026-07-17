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
  return { ...item, price: Number(item.price) };
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
    <div className="py-24 px-6 md:px-16 lg:px-24 bg-night">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-accent text-xs font-semibold uppercase tracking-widest">
            {t.menu.eyebrow}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif mt-2 text-cream">
            {t.menu.title}
          </h1>
        </div>
        <p className="text-xs text-gray-400 mt-2 md:mt-0 max-w-xs font-light">
          {t.menu.note}
        </p>
      </div>
      <MenuBrowser
        categories={serializedCategories}
        initialQuery={params.q}
        highlightId={params.highlight}
      />
    </div>
  );
}
