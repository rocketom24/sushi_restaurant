"use client";

import { useActionState } from "react";
import { createReservationAction } from "@/lib/actions/reservation.actions";
import type { ReservationFormState } from "@/lib/validations/reservation";

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

const inputClass =
  "w-full rounded-lg bg-white/3 border border-white/10 px-4 py-3 text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors";
const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2";
const errorClass = "mt-2 text-xs text-red-400";

export default function ReservationForm() {
  const [state, formAction, isPending] = useActionState(createReservationAction, {});

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="space-y-6 max-w-lg">
      {state.errors?._form && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-300">
          {state.errors._form[0]}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="reservationDate" className={labelClass}>Data</label>
          <input
            id="reservationDate"
            name="reservationDate"
            type="date"
            min={today}
            required
            className={inputClass}
          />
          {state.errors?.reservationDate && (
            <p className={errorClass}>{state.errors.reservationDate[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="reservationTime" className={labelClass}>Ora</label>
          <select
            id="reservationTime"
            name="reservationTime"
            required
            className={inputClass}
          >
            <option value="">Seleziona orario</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {state.errors?.reservationTime && (
            <p className={errorClass}>{state.errors.reservationTime[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="guestCount" className={labelClass}>Numero di Persone</label>
        <input
          id="guestCount"
          name="guestCount"
          type="number"
          min={1}
          max={20}
          defaultValue={2}
          required
          className={inputClass}
        />
        {state.errors?.guestCount && (
          <p className={errorClass}>{state.errors.guestCount[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="customerName" className={labelClass}>Nome Completo</label>
        <input
          id="customerName"
          name="customerName"
          required
          className={inputClass}
        />
        {state.errors?.customerName && (
          <p className={errorClass}>{state.errors.customerName[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className={labelClass}>Telefono</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className={inputClass}
          />
          {state.errors?.phone && (
            <p className={errorClass}>{state.errors.phone[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email (opzionale)</label>
          <input
            id="email"
            name="email"
            type="email"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="specialRequest" className={labelClass}>
          Richieste Speciali (opzionale)
        </label>
        <textarea
          id="specialRequest"
          name="specialRequest"
          maxLength={250}
          rows={2}
          placeholder="es. tavolo vicino alla finestra, compleanno"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-accent hover:bg-white hover:text-night text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest disabled:opacity-50 transition-all duration-300"
      >
        {isPending ? "Prenotazione in corso..." : "Prenota il Tavolo"}
      </button>
    </form>
  );
}
