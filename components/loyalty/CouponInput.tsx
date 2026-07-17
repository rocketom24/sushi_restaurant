"use client";

import { useState, useTransition } from "react";
import { previewCouponAction } from "@/lib/actions/coupon.actions";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function CouponInput({
  subtotal,
  applied,
  onApplied,
  onRemoved,
}: {
  subtotal: number;
  applied: { code: string; discount: number } | null;
  onApplied: (code: string, discount: number) => void;
  onRemoved: () => void;
}) {
  const { dict } = useI18n();
  const t = dict.checkout;
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleApply() {
    setError(null);
    const trimmed = code.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const result = await previewCouponAction(trimmed, subtotal);
      if (!result.valid) {
        setError(result.error);
        return;
      }
      onApplied(result.code, result.discount);
      setCode("");
    });
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-accent/40 bg-accent/10 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {t.couponApplied}
          </p>
          <p className="text-sm text-cream font-light mt-0.5">
            {applied.code} · −€{applied.discount.toFixed(2)}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemoved}
          className="text-xs uppercase tracking-wider text-gray-400 hover:text-red-300 transition-colors"
        >
          {t.couponRemove}
        </button>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
        {t.couponLabel}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t.couponPlaceholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
          className="flex-1 rounded-lg bg-white/3 border border-white/10 px-4 py-3 text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors uppercase"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={isPending || !code.trim()}
          className="rounded-full border border-white/20 hover:border-accent hover:text-accent px-6 py-2 text-xs font-semibold uppercase tracking-widest disabled:opacity-40 transition-all duration-300"
        >
          {isPending ? t.couponApplying : t.couponApply}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
