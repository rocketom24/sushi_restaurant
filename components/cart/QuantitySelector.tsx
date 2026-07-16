"use client";

import { MAX_QUANTITY, MIN_QUANTITY } from "@/lib/cart/cart-utils";

export default function QuantitySelector({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="inline-flex items-center border border-white/15 rounded-md text-neutral-200">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= MIN_QUANTITY}
        aria-label="Decrease quantity"
        className="w-8 h-8 flex items-center justify-center text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
      >
        −
      </button>
      <span
        className="w-10 text-center text-sm font-medium"
        aria-live="polite"
        aria-label={`Quantity: ${quantity}`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= MAX_QUANTITY}
        aria-label="Increase quantity"
        className="w-8 h-8 flex items-center justify-center text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
      >
        +
      </button>
    </div>
  );
}