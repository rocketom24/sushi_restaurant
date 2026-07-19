// components/menu/MenuBrowser.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import MenuCard from "./MenuCard";
import { useI18n } from "@/components/i18n/I18nProvider";

type MenuItemData = {
  id: string;
  name: string;
  description: string | null;
  price: unknown;
  discountPrice: unknown;
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

export default function MenuBrowser({
  categories,
  initialQuery = "",
  highlightId,
}: {
  categories: CategoryData[];
  initialQuery?: string;
  highlightId?: string;
}) {
  const { dict } = useI18n();
  const [search, setSearch] = useState(initialQuery);
  const [highlighted, setHighlighted] = useState(highlightId);

  // Deep-linked from the header search: scroll straight to the dish and
  // give it a brief accent ring, without filtering the rest of the menu.
  useEffect(() => {
    if (!highlightId) return;
    const el = document.getElementById(`menu-item-${highlightId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = setTimeout(() => setHighlighted(undefined), 2600);
    return () => clearTimeout(timer);
  }, [highlightId]);

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
        {dict.menu.empty}
      </p>
    );
  }

  return (
    <div>
      <input
        type="text"
        placeholder={dict.menu.searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md block mx-auto rounded-full bg-white/3 border border-white/10 px-6 py-3 mb-12 text-sm text-cream text-center placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
      />

      {filtered.length === 0 && (
        <p className="text-gray-400 text-center py-20 font-light">
          {dict.menu.noMatch} &ldquo;{search}&rdquo;.
        </p>
      )}

      {filtered.map((cat) => {
        const totalCount =
          cat.menuItems.length + cat.children.reduce((sum, c) => sum + c.menuItems.length, 0);

        return (
          <section key={cat.id} className="mb-20">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-cream">{cat.name}</h2>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span aria-hidden className="w-8 h-px bg-white/20" />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                  {totalCount} {totalCount === 1 ? dict.menu.dish : dict.menu.dishes}
                </span>
                <span aria-hidden className="w-8 h-px bg-white/20" />
              </div>
            </div>

            {cat.menuItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-20 pt-16 mb-10">
                {cat.menuItems.map((item) => (
                  <MenuCard key={item.id} item={item} highlighted={item.id === highlighted} />
                ))}
              </div>
            )}

            {cat.children.map((child) => (
              <div key={child.id} className="mb-10">
                <div className="flex items-center justify-center gap-2.5 mb-5">
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <h3 className="font-serif text-xl text-gray-300 tracking-wide">{child.name}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-20 pt-16">
                  {child.menuItems.map((item) => (
                    <MenuCard key={item.id} item={item} highlighted={item.id === highlighted} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
