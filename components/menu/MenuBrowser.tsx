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
    return (
      <p className="text-gray-400 text-center py-20 font-light">
        Il menu è in preparazione. Torna a trovarci presto.
      </p>
    );
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Cerca nel menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md block rounded-full bg-white/3 border border-white/10 px-6 py-3 mb-12 text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
      />

      {filtered.length === 0 && (
        <p className="text-gray-400 text-center py-20 font-light">
          Nessun piatto corrisponde a &ldquo;{search}&rdquo;.
        </p>
      )}

      {filtered.map((cat) => (
        <section key={cat.id} className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-serif text-2xl md:text-3xl text-cream">{cat.name}</h2>
            <span aria-hidden className="flex-1 h-px bg-white/5" />
          </div>

          {cat.menuItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {cat.menuItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {cat.children.map((child) => (
            <div key={child.id} className="mb-8">
              <h3 className="font-serif text-lg text-gray-400 mb-4">{child.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
