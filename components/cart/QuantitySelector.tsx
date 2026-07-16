"use client";

import { MAX_QUANTITY, MIN_QUANTITY } from "@/lib/cart/cart-utils";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function QuantitySelector({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (next: number) => void;
}) {
  const { dict } = useI18n();

  return (
    <div className="inline-flex items-center gap-1 text-cream">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= MIN_QUANTITY}
        aria-label={dict.cart.decrease}
        className="w-8 h-8 rounded-full bg-white/5 hover:bg-accent flex items-center justify-center text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      <span
        className="w-8 text-center text-sm font-medium"
        aria-live="polite"
        aria-label={`${dict.cart.quantity}: ${quantity}`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= MAX_QUANTITY}
        aria-label={dict.cart.increase}
        className="w-8 h-8 rounded-full bg-white/5 hover:bg-accent flex items-center justify-center text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  );
}
