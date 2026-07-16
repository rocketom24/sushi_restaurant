"use client";

import type { CartItem as CartItemType } from "@/types/cart";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "@/hooks/useCart";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();
  const { dict } = useI18n();

  return (
    <div className="bg-white/2 border border-white/5 rounded-lg p-3 mb-3 flex gap-4">
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-16 h-16 rounded-lg object-cover shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-white/3 flex items-center justify-center shrink-0">
          🍣
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-light text-cream truncate">{item.name}</h4>
          <span className="text-sm font-semibold text-accent whitespace-nowrap">
            €{item.subtotal.toFixed(2)}
          </span>
        </div>

        {item.customizations.length > 0 && (
          <ul className="mt-1 text-xs text-gray-500 font-light space-y-0.5">
            {item.customizations.map((c) => (
              <li key={c.optionId}>
                {c.groupName}: {c.optionName}
                {c.priceModifier > 0 && ` (+€${c.priceModifier.toFixed(2)})`}
              </li>
            ))}
          </ul>
        )}

        {item.specialInstructions && (
          <p className="mt-1 text-xs text-gray-500 font-light italic">
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
            className="text-xs uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
          >
            {dict.cart.remove}
          </button>
        </div>
      </div>
    </div>
  );
}
