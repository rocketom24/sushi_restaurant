// components/menu/MenuBrowser.tsx
"use client";

import { useState, useMemo } from "react";
import MenuCard from "./MenuCard";

type MenuItemData = {
  id: string;
  name: string;
  description: string | null;
  price: unknown;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  spiceLevel: string | null;
};

type CategoryData = {
  id: string;
  name: string;
  menuItems: MenuItemData[];
  children: { id: string; name: string; menuItems: MenuItemData[] }[];
};

export default function MenuBrowser({ categories }: { categories: CategoryData[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;

    const q = search.toLowerCase();

    return categories
      .map((cat) => ({
        ...cat,
        menuItems: cat.menuItems.filter((i) => i.name.toLowerCase().includes(q)),
        children: cat.children
          .map((child) => ({
            ...child,
            menuItems: child.menuItems.filter((i) => i.name.toLowerCase().includes(q)),
          }))
          .filter((child) => child.menuItems.length > 0),
      }))
      .filter((cat) => cat.menuItems.length > 0 || cat.children.length > 0);
  }, [categories, search]);

  if (categories.length === 0) {
    return <p className="text-gray-500 text-center py-20">No menu items available.</p>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mx-auto block rounded-md bg-neutral-900 border border-white/15 px-4 py-2.5 mb-12 text-neutral-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
      />

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center py-20">No items match your search.</p>
      )}

      {filtered.map((cat) => (
        <section key={cat.id} className="mb-14">
          <h2 className="font-serif text-2xl text-white mb-6 text-center">{cat.name}</h2>

          {cat.menuItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {cat.menuItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {cat.children.map((child) => (
            <div key={child.id} className="mb-6">
              <h3 className="font-serif text-lg text-gray-300 mb-3">{child.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {child.menuItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}