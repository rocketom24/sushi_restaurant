// components/settings/OperatingHoursForm.tsx
"use client";

import { useActionState, useState } from "react";
import { updateOperatingHoursAction } from "@/lib/actions/settings.actions";
import { dayName, type DayHours, type OperatingHours } from "@/lib/settings/operating-hours";

export default function OperatingHoursForm({ hours }: { hours: OperatingHours }) {
  const [state, formAction, isPending] = useActionState(updateOperatingHoursAction, {});
  const [days, setDays] = useState<OperatingHours>(hours);

  function update(index: number, patch: Partial<DayHours>) {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  return (
    <form action={formAction} className="space-y-4 max-w-3xl">
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

      <input type="hidden" name="operatingHours" value={JSON.stringify(days)} />

      <div className="space-y-2">
        {days.map((day, i) => (
          <div
            key={day.day}
            className="grid grid-cols-[100px_auto_1fr_1fr] items-center gap-3 bg-white rounded-lg border border-gray-100 px-4 py-3"
          >
            <span className="text-sm font-medium">{dayName(day.day)}</span>

            <label className="flex items-center gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={day.closed}
                onChange={(e) => update(i, { closed: e.target.checked })}
                className="rounded"
              />
              Closed
            </label>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs text-gray-400 w-12">Lunch</span>
              <input
                type="time"
                value={day.lunchOpen ?? ""}
                disabled={day.closed}
                onChange={(e) => update(i, { lunchOpen: e.target.value })}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm disabled:opacity-40"
              />
              <span className="text-gray-400">–</span>
              <input
                type="time"
                value={day.lunchClose ?? ""}
                disabled={day.closed}
                onChange={(e) => update(i, { lunchClose: e.target.value })}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm disabled:opacity-40"
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs text-gray-400 w-12">Dinner</span>
              <input
                type="time"
                value={day.dinnerOpen ?? ""}
                disabled={day.closed}
                onChange={(e) => update(i, { dinnerOpen: e.target.value })}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm disabled:opacity-40"
              />
              <span className="text-gray-400">–</span>
              <input
                type="time"
                value={day.dinnerClose ?? ""}
                disabled={day.closed}
                onChange={(e) => update(i, { dinnerClose: e.target.value })}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm disabled:opacity-40"
              />
            </div>
          </div>
        ))}
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
