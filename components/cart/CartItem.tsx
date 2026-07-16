"use client";

import type { CartItem as CartItemType } from "@/types/cart";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "@/hooks/useCart";

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-white/10 last:border-b-0">
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-16 h-16 rounded-md object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-md bg-neutral-800 flex items-center justify-center flex-shrink-0">
          🍣
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-white truncate">{item.name}</h4>
          <span className="font-semibold text-orange-400 whitespace-nowrap">
            €{item.subtotal.toFixed(2)}
          </span>
        </div>

        {item.customizations.length > 0 && (
          <ul className="mt-1 text-sm text-gray-500 space-y-0.5">
            {item.customizations.map((c) => (
              <li key={c.optionId}>
                {c.groupName}: {c.optionName}
                {c.priceModifier > 0 && ` (+€${c.priceModifier.toFixed(2)})`}
              </li>
            ))}
          </ul>
        )}

        {item.specialInstructions && (
          <p className="mt-1 text-sm text-gray-500 italic">
            "{item.specialInstructions}"
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(next) => updateQuantity(item.lineId, next)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.lineId)}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}