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
    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white">
      {item.isFeatured && (
        <span className="absolute top-2 left-2 z-10 rounded-full bg-amber-400 px-2 py-1 text-xs font-medium text-amber-900">
          Featured
        </span>
      )}
      {!item.isAvailable && (
        <span className="absolute top-2 right-2 z-10 rounded-full bg-gray-800 px-2 py-1 text-xs font-medium text-white">
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
        <div className="h-40 w-full bg-gray-100" />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-neutral-900">{item.name}</h3>
          <span className="whitespace-nowrap font-semibold text-neutral-900">
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