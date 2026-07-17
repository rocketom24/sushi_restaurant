"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/hooks/useCart";
import { validateAddToCart } from "@/lib/actions/cart-validation.actions";
import { useI18n } from "@/components/i18n/I18nProvider";

const SPICE_LEVELS = ["MILD", "MEDIUM", "HOT"] as const;
type SpiceLevel = (typeof SPICE_LEVELS)[number];

export default function AddToCartButton({
  menuItemId,
  isAvailable,
  spiceLevel,
}: {
  menuItemId: string;
  isAvailable: boolean;
  /** The dish's own configured heat — if set, the customer can adjust
   * their preferred level before adding; if null/NONE, no dish spice
   * choice is offered (not a spicy item). */
  spiceLevel?: string | null;
}) {
  const { addItem } = useCart();
  const { dict } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  const offersSpiceChoice = spiceLevel === "MILD" || spiceLevel === "MEDIUM" || spiceLevel === "HOT";
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel | null>(
    offersSpiceChoice ? (spiceLevel as SpiceLevel) : null
  );

  function handleAdd() {
    setError(null);
    startTransition(async () => {
      const noteText = note.trim().slice(0, 200);
      const spiceText = selectedSpice ? `${dict.menu.spiceLevel}: ${dict.menu.spiceLevels[selectedSpice]}` : "";
      const specialInstructions = [spiceText, noteText].filter(Boolean).join(" — ").slice(0, 250);

      const result = await validateAddToCart({
        menuItemId,
        quantity: 1,
        customizationOptionIds: [],
        specialInstructions,
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
        specialInstructions,
      });

      setAdded(true);
      setNote("");
      setNoteOpen(false);
      setTimeout(() => setAdded(false), 1500);
    });
  }

  if (!isAvailable) {
    return (
      <button
        disabled
        className="w-full rounded-full bg-white/10 text-gray-400 py-2 text-[11px] font-semibold uppercase tracking-widest cursor-not-allowed"
      >
        {dict.menu.soldOut}
      </button>
    );
  }

  return (
    <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
      {offersSpiceChoice && (
        <div className="flex items-center gap-1" role="radiogroup" aria-label={dict.menu.spiceLevel}>
          {SPICE_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={selectedSpice === level}
              onClick={() => setSelectedSpice(level)}
              className={`flex-1 rounded-md py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors duration-200 ${
                selectedSpice === level
                  ? "bg-accent text-white"
                  : "bg-night/70 text-gray-400 border border-white/10 hover:border-accent/50 hover:text-gray-200"
              }`}
            >
              {dict.menu.spiceLevels[level]}
            </button>
          ))}
        </div>
      )}

      {noteOpen && (
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={dict.menu.notePlaceholder}
          maxLength={200}
          autoFocus
          className="w-full rounded-lg bg-night/80 border border-white/15 px-3 py-1.5 text-xs text-cream placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
        />
      )}
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending}
          className="flex-1 rounded-full bg-accent hover:bg-white hover:text-night text-white py-2 text-[11px] font-semibold uppercase tracking-widest disabled:opacity-50 transition-all duration-300"
        >
          {isPending ? dict.menu.adding : added ? dict.menu.added : dict.menu.add}
        </button>
        <button
          type="button"
          onClick={() => setNoteOpen((v) => !v)}
          aria-label={dict.menu.addNote}
          aria-pressed={noteOpen}
          className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${
            noteOpen
              ? "border-accent text-accent bg-accent/10"
              : "border-white/20 text-gray-300 hover:border-accent hover:text-accent"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
            />
          </svg>
        </button>
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
