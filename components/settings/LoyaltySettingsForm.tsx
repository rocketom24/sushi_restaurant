// components/settings/LoyaltySettingsForm.tsx
"use client";

import { useActionState } from "react";
import { updateLoyaltySettingsAction } from "@/lib/actions/settings.actions";

type Settings = {
  pointsPerEuro: number;
};

export default function LoyaltySettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, isPending] = useActionState(updateLoyaltySettingsAction, {});

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      {state.errors?._form && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.errors._form[0]}
        </div>
      )}
      {state.success && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Saved.
        </div>
      )}

      <div>
        <label htmlFor="pointsPerEuro" className="block text-sm font-medium mb-1">
          Points Earned per €1 Spent
        </label>
        <input
          id="pointsPerEuro"
          name="pointsPerEuro"
          type="number"
          step="0.1"
          min={0}
          max={100}
          defaultValue={settings.pointsPerEuro}
          className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.pointsPerEuro && (
          <p className="mt-1 text-sm text-red-600">{state.errors.pointsPerEuro[0]}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Applies to orders completed after this change — past point totals are never recalculated.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-neutral-900 text-white px-6 py-2.5 font-medium hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
