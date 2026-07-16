// app/menu/page.tsx

import { getPublicMenu } from "@/lib/actions/public-menu.actions";
import MenuBrowser from "@/components/menu/MenuBrowser";

export const metadata = {
  title: "Menu",
  description: "Browse our full sushi menu.",
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold text-neutral-900 text-center mb-10">
        Our Menu
      </h1>
      <MenuBrowser categories={serializedCategories} />
    </div>
  );
}