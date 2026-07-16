"use client";

import { useActionState } from "react";
import { createReservationAction } from "@/lib/actions/reservation.actions";
import type { ReservationFormState } from "@/lib/validations/reservation";

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

export default function ReservationForm() {
  const [state, formAction, isPending] = useActionState(createReservationAction, {});

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="space-y-5 max-w-lg">
      {state.errors?._form && (
        <div className="rounded-md bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-300">
          {state.errors._form[0]}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
          <input
            id="reservationDate"
            name="reservationDate"
            type="date"
            min={today}
            required
            className="w-full rounded-md bg-neutral-900 border border-white/15 px-3 py-2 text-neutral-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
          />
          {state.errors?.reservationDate && (
            <p className="mt-1 text-sm text-red-400">{state.errors.reservationDate[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="reservationTime" className="block text-sm font-medium text-gray-300 mb-1">Time</label>
          <select
            id="reservationTime"
            name="reservationTime"
            required
            className="w-full rounded-md bg-neutral-900 border border-white/15 px-3 py-2 text-neutral-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
          >
            <option value="">Select time</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {state.errors?.reservationTime && (
            <p className="mt-1 text-sm text-red-400">{state.errors.reservationTime[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="guestCount" className="block text-sm font-medium text-gray-300 mb-1">Party Size</label>
        <input
          id="guestCount"
          name="guestCount"
          type="number"
          min={1}
          max={20}
          defaultValue={2}
          required
          className="w-full rounded-md bg-neutral-900 border border-white/15 px-3 py-2 text-neutral-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
        />
        {state.errors?.guestCount && (
          <p className="mt-1 text-sm text-red-400">{state.errors.guestCount[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
        <input
          id="customerName"
          name="customerName"
          required
          className="w-full rounded-md bg-neutral-900 border border-white/15 px-3 py-2 text-neutral-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
        />
        {state.errors?.customerName && (
          <p className="mt-1 text-sm text-red-400">{state.errors.customerName[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="w-full rounded-md bg-neutral-900 border border-white/15 px-3 py-2 text-neutral-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
          />
          {state.errors?.phone && (
            <p className="mt-1 text-sm text-red-400">{state.errors.phone[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email (optional)</label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-md bg-neutral-900 border border-white/15 px-3 py-2 text-neutral-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
          />
        </div>
      </div>

      <div>
        <label htmlFor="specialRequest" className="block text-sm font-medium text-gray-300 mb-1">
          Special Requests (optional)
        </label>
        <textarea
          id="specialRequest"
          name="specialRequest"
          maxLength={250}
          rows={2}
          placeholder="e.g. window seat, birthday celebration"
          className="w-full rounded-md bg-neutral-900 border border-white/15 px-3 py-2 text-neutral-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-orange-600 text-white py-3 font-medium hover:bg-orange-500 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Booking..." : "Book Table"}
      </button>
    </form>
  );
}