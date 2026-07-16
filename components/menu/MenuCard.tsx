// components/menu/MenuCard.tsx
"use client";

import AddToCartButton from "@/components/cart/AddToCartButton";
import { useI18n } from "@/components/i18n/I18nProvider";

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

export default function MenuCard({ item }: { item: MenuItemData }) {
  const { dict } = useI18n();

  return (
    <div className="glass p-5 rounded-3xl group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 relative">
      {item.isFeatured && (
        <span className="absolute top-8 left-8 z-10 bg-accent text-white text-[9px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
          {dict.menu.featured}
        </span>
      )}
      {!item.isAvailable && (
        <span className="absolute top-8 right-8 z-10 bg-black/70 border border-white/10 text-gray-300 text-[9px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
          {dict.menu.soldOut}
        </span>
      )}
      <div className="h-56 overflow-hidden rounded-2xl mb-4 relative">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
              !item.isAvailable ? "opacity-40" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full bg-white/3 flex items-center justify-center text-6xl">
            🍣
          </div>
        )}
      </div>
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="font-serif text-xl group-hover:text-accent transition-colors duration-300">
          {item.name}
        </h3>
        <span className="text-sm font-semibold text-accent whitespace-nowrap">
          €{Number(item.price).toFixed(2)}
        </span>
      </div>
      {item.description && (
        <p className="text-xs text-gray-400 font-light leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>
      )}
      <div className="pt-2 border-t border-white/5">
        <AddToCartButton menuItemId={item.id} isAvailable={item.isAvailable} />
      </div>
    </div>
  );
}
