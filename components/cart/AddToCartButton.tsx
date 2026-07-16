"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/hooks/useCart";
import { validateAddToCart } from "@/lib/actions/cart-validation.actions";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function AddToCartButton({
  menuItemId,
  isAvailable,
}: {
  menuItemId: string;
  isAvailable: boolean;
}) {
  const { addItem } = useCart();
  const { dict } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    setError(null);
    startTransition(async () => {
      const result = await validateAddToCart({
        menuItemId,
        quantity: 1,
        customizationOptionIds: [],
        specialInstructions: "",
      });

      if (!result.valid) {
        setError(result.error);
        return;
      }

      addItem({
        menuItemId: result.menuItem.id,
        name: result.menuItem.name,
        basePrice: result.menuItem.basePrice,
        imageUrl: result.menuItem.imageUrl,
        quantity: 1,
        customizations: result.customizations,
        specialInstructions: "",
      });

      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    });
  }

  if (!isAvailable) {
    return (
      <button
        disabled
        className="w-full rounded-full bg-white/5 text-gray-500 py-2.5 text-xs font-semibold uppercase tracking-widest cursor-not-allowed"
      >
        {dict.menu.soldOut}
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={isPending}
        className="w-full rounded-full bg-accent hover:bg-white hover:text-night text-white py-2.5 text-xs font-semibold uppercase tracking-widest disabled:opacity-50 transition-all duration-300"
      >
        {isPending ? dict.menu.adding : added ? dict.menu.added : dict.menu.add}
      </button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
