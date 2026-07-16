// app/menu/page.tsx

import { getPublicMenu } from "@/lib/actions/public-menu.actions";
import MenuBrowser from "@/components/menu/MenuBrowser";

export const metadata = {
  title: "Il Nostro Menu",
  description: "Sfoglia il nostro menu completo di sushi.",
};

type PublicMenuItem = Awaited<ReturnType<typeof getPublicMenu>>[number]["menuItems"][number];

function serializeMenuItem(item: PublicMenuItem) {
  return { ...item, price: Number(item.price) };
}

export default async function PublicMenuPage() {
  const categories = await getPublicMenu();

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
            {"// Selezioni Classiche"}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif mt-2 text-cream">
            La Carta dei Nostri Capolavori
          </h1>
        </div>
        <p className="text-xs text-gray-400 mt-2 md:mt-0 max-w-xs font-light">
          * Ogni piatto è preparato espresso utilizzando materie prime
          certificate e freschissime.
        </p>
      </div>
      <MenuBrowser categories={serializedCategories} />
    </div>
  );
}
