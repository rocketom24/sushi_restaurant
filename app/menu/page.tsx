// app/menu/page.tsx

import { getPublicMenu } from "@/lib/actions/public-menu.actions";
import MenuBrowser from "@/components/menu/MenuBrowser";

export const metadata = {
  title: "Menu | Your Restaurant",
  description: "Browse our full sushi menu.",
};

export default async function PublicMenuPage() {
  const categories = await getPublicMenu();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold text-neutral-900 text-center mb-10">
        Our Menu
      </h1>
      <MenuBrowser categories={categories} />
    </div>
  );
}