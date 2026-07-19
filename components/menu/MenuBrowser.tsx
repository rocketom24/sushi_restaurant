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
      <div className="group relative w-full max-w-md mx-auto mb-12">
        {/* Ambient glow that blooms behind the button on hover/focus. */}
        <div
          aria-hidden
          className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-accent/40 blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"
        />
        <input
          type="text"
          placeholder={`🍣  ${dict.menu.searchPlaceholder}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full bg-white/5 border border-white/10 pl-6 pr-16 py-3.5 text-sm text-cream placeholder:text-gray-500 shadow-lg shadow-black/30 outline-none transition-all duration-300 group-hover:border-white/20 group-hover:shadow-xl group-hover:shadow-black/40 focus:border-accent/60 focus:bg-white/8"
        />
        <span
          aria-hidden
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30 transition-transform duration-300 ease-out group-hover:scale-110 group-focus-within:scale-110 group-focus-within:rotate-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M21 21l-5.2-5.2m0 0a7.5 7.5 0 10-10.6 0 7.5 7.5 0 0010.6 0z"
            />
          </svg>
        </span>
      </div>

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
