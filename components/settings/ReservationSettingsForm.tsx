// components/settings/ReservationSettingsForm.tsx
"use client";

import { useActionState } from "react";
import { updateReservationSettingsAction } from "@/lib/actions/settings.actions";

type Settings = {
  reservationSlotIntervalMinutes: number;
  reservationLunchDurationMinutes: number;
  reservationDinnerDurationMinutes: number;
  reservationMaxGuests: number;
  reservationCancellationCutoffHours: number;
  autoAssignTable: boolean;
};

export default function ReservationSettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, isPending] = useActionState(updateReservationSettingsAction, {});

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="reservationSlotIntervalMinutes" className="block text-sm font-medium mb-1">
            Slot Interval (minutes)
          </label>
          <input
            id="reservationSlotIntervalMinutes"
            name="reservationSlotIntervalMinutes"
            type="number"
            min={5}
            max={120}
            defaultValue={settings.reservationSlotIntervalMinutes}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="reservationMaxGuests" className="block text-sm font-medium mb-1">
            Max Guests per Reservation
          </label>
          <input
            id="reservationMaxGuests"
            name="reservationMaxGuests"
            type="number"
            min={1}
            max={100}
            defaultValue={settings.reservationMaxGuests}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="reservationLunchDurationMinutes" className="block text-sm font-medium mb-1">
            Lunch Duration (minutes)
          </label>
          <input
            id="reservationLunchDurationMinutes"
            name="reservationLunchDurationMinutes"
            type="number"
            min={15}
            max={480}
            defaultValue={settings.reservationLunchDurationMinutes}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="reservationDinnerDurationMinutes" className="block text-sm font-medium mb-1">
            Dinner Duration (minutes)
          </label>
          <input
            id="reservationDinnerDurationMinutes"
            name="reservationDinnerDurationMinutes"
            type="number"
            min={15}
            max={480}
            defaultValue={settings.reservationDinnerDurationMinutes}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="reservationCancellationCutoffHours" className="block text-sm font-medium mb-1">
          Online Cancellation Cutoff (hours before reservation)
        </label>
        <input
          id="reservationCancellationCutoffHours"
          name="reservationCancellationCutoffHours"
          type="number"
          min={0}
          max={168}
          defaultValue={settings.reservationCancellationCutoffHours}
          className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="autoAssignTable"
          name="autoAssignTable"
          type="checkbox"
          defaultChecked={settings.autoAssignTable}
          className="rounded"
        />
        <label htmlFor="autoAssignTable" className="text-sm font-medium">
          Automatically assign a table when booking
        </label>
      </div>
      <p className="text-xs text-gray-500 -mt-2">
        When off, new reservations are accepted without a table and the owner assigns one manually from the reservation detail page.
      </p>

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
