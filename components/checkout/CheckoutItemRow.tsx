"use client";

import type { CartItem as CartItemType } from "@/types/cart";
import QuantitySelector from "@/components/cart/QuantitySelector";
import { useCart } from "@/hooks/useCart";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function CheckoutItemRow({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();
  const { dict } = useI18n();

  return (
    <div className="flex gap-5 py-6 border-b border-white/8 last:border-b-0">
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover shrink-0 border border-white/8"
        />
      ) : (
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center shrink-0 text-3xl">
          🍣
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg md:text-xl text-cream leading-snug">
            {item.name}
          </h3>
          <span className="font-serif text-lg md:text-xl text-accent whitespace-nowrap">
            €{item.subtotal.toFixed(2)}
          </span>
        </div>

        {item.customizations.length > 0 && (
          <ul className="mt-2 space-y-0.5">
            {item.customizations.map((c) => (
              <li
                key={c.optionId}
                className="text-xs uppercase tracking-wider text-gray-500 font-light"
              >
                {c.groupName}: <span className="text-gray-400">{c.optionName}</span>
                {c.priceModifier > 0 && ` (+€${c.priceModifier.toFixed(2)})`}
              </li>
            ))}
          </ul>
        )}

        {item.specialInstructions && (
          <p className="mt-1 text-xs text-gray-500 font-light italic">
            &quot;{item.specialInstructions}&quot;
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(next) => updateQuantity(item.lineId, next)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.lineId)}
            className="text-xs uppercase tracking-wider text-gray-500 hover:text-red-300 transition-colors"
          >
            {dict.cart.remove}
          </button>
        </div>
      </div>
    </div>
  );
}
