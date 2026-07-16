"use client";

import Link from "next/link";
import ReservationStatusBadge from "./ReservationStatusBadge";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { ReservationStatus } from "@/app/generated/prisma/client";

type ReservationCardData = {
  id: string;
  reservationAt: Date;
  guestCount: number;
  status: ReservationStatus;
  table: { tableNumber: number } | null;
};

export default function ReservationCard({ reservation }: { reservation: ReservationCardData }) {
  const { dict, locale } = useI18n();
  const t = dict.reservations;
  const dateLocale = locale === "it" ? "it-IT" : "en-GB";

  return (
    <Link
      href={`/reservations/${reservation.id}`}
      className="glass block rounded-3xl p-5 group hover:-translate-y-1 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-serif text-lg text-cream group-hover:text-accent transition-colors duration-300">
            {new Date(reservation.reservationAt).toLocaleDateString(dateLocale, {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}{" "}
            ·{" "}
            {new Date(reservation.reservationAt).toLocaleTimeString(dateLocale, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-xs text-gray-500 font-light mt-1">
            {reservation.guestCount}{" "}
            {reservation.guestCount === 1 ? t.person : t.people}
            {reservation.table ? ` · ${t.table} ${reservation.table.tableNumber}` : ""}
          </p>
        </div>
        <ReservationStatusBadge
          status={reservation.status}
          variant="dark"
          label={dict.status.reservation[reservation.status]}
        />
      </div>
    </Link>
  );
}
