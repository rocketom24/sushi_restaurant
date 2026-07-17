// components/settings/OrderingSettingsForm.tsx
"use client";

import { useActionState } from "react";
import { updateOrderingSettingsAction } from "@/lib/actions/settings.actions";

type Settings = {
  deliveryEnabled: boolean;
  takeawayEnabled: boolean;
  dineInEnabled: boolean;
  minOrderAmount: number;
  deliveryFee: number;
  estimatedPrepTimeMinutes: number;
};

export default function OrderingSettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, isPending] = useActionState(updateOrderingSettingsAction, {});

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

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="dineInEnabled" defaultChecked={settings.dineInEnabled} className="rounded" />
          Dine In
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="takeawayEnabled" defaultChecked={settings.takeawayEnabled} className="rounded" />
          Takeaway
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="deliveryEnabled" defaultChecked={settings.deliveryEnabled} className="rounded" />
          Delivery
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minOrderAmount" className="block text-sm font-medium mb-1">
            Minimum Order Amount (€)
          </label>
          <input
            id="minOrderAmount"
            name="minOrderAmount"
            type="number"
            step="0.01"
            min={0}
            defaultValue={settings.minOrderAmount}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="deliveryFee" className="block text-sm font-medium mb-1">
            Delivery Fee (€)
          </label>
          <input
            id="deliveryFee"
            name="deliveryFee"
            type="number"
            step="0.01"
            min={0}
            defaultValue={settings.deliveryFee}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="estimatedPrepTimeMinutes" className="block text-sm font-medium mb-1">
          Estimated Preparation Time (minutes)
        </label>
        <input
          id="estimatedPrepTimeMinutes"
          name="estimatedPrepTimeMinutes"
          type="number"
          min={1}
          max={240}
          defaultValue={settings.estimatedPrepTimeMinutes}
          className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2"
        />
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
