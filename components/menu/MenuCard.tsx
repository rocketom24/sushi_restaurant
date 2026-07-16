// components/menu/MenuCard.tsx

import AddToCartButton from "@/components/cart/AddToCartButton";

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
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 hover:border-orange-500/50 transition-colors">
      {item.isFeatured && (
        <span className="absolute top-2 left-2 z-10 rounded-full bg-orange-600 px-2 py-1 text-xs font-medium text-white">
          Featured
        </span>
      )}
      {!item.isAvailable && (
        <span className="absolute top-2 right-2 z-10 rounded-full bg-black/70 border border-white/20 px-2 py-1 text-xs font-medium text-gray-300">
          Unavailable
        </span>
      )}
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.name}
          className={`h-40 w-full object-cover ${
            !item.isAvailable ? "opacity-50" : ""
          }`}
        />
      ) : (
        <div className="h-40 w-full bg-neutral-800 flex items-center justify-center text-4xl">
          🍣
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-white">{item.name}</h3>
          <span className="whitespace-nowrap font-semibold text-orange-400">
            €{Number(item.price).toFixed(2)}
          </span>
        </div>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {item.description}
          </p>
        )}
        <div className="mt-4">
          <AddToCartButton menuItemId={item.id} isAvailable={item.isAvailable} />
        </div>
      </div>
    </div>
  );
}
