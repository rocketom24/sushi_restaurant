// components/menu/MenuCard.tsx

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
    <div className="rounded-xl border border-gray-100 overflow-hidden bg-white relative">
      {item.isFeatured && (
        <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-medium px-2 py-1 rounded-full z-10">
          Featured
        </span>
      )}
      {!item.isAvailable && (
        <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-full z-10">
          Unavailable
        </span>
      )}
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.name}
          className={`w-full h-40 object-cover ${!item.isAvailable ? "opacity-50" : ""}`}
        />
      ) : (
        <div className="w-full h-40 bg-gray-100" />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-neutral-900">{item.name}</h3>
          <span className="font-semibold text-neutral-900 whitespace-nowrap">
            €{Number(item.price).toFixed(2)}
          </span>
        </div>
        {item.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        )}
      </div>
    </div>
  );
}