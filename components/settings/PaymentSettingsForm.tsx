// components/settings/PaymentSettingsForm.tsx
"use client";

import { useActionState } from "react";
import { updatePaymentSettingsAction } from "@/lib/actions/settings.actions";

type Settings = {
  cashEnabled: boolean;
  cardEnabled: boolean;
  satispayEnabled: boolean;
  edenredEnabled: boolean;
};

export default function PaymentSettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, isPending] = useActionState(updatePaymentSettingsAction, {});

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

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="cashEnabled" defaultChecked={settings.cashEnabled} className="rounded" />
          Cash
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="cardEnabled" defaultChecked={settings.cardEnabled} className="rounded" />
          Card (Stripe)
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="satispayEnabled" defaultChecked={settings.satispayEnabled} className="rounded" />
          Satispay <span className="text-xs text-gray-400 font-normal">(integration not yet live)</span>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="edenredEnabled" defaultChecked={settings.edenredEnabled} className="rounded" />
          Ticket Restaurant Edenred <span className="text-xs text-gray-400 font-normal">(integration not yet live)</span>
        </label>
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
