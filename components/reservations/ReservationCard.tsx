import Link from "next/link";
import ReservationStatusBadge from "./ReservationStatusBadge";
import type { ReservationStatus } from "@/app/generated/prisma/client";

type ReservationCardData = {
  id: string;
  reservationAt: Date;
  guestCount: number;
  status: ReservationStatus;
  table: { tableNumber: number } | null;
};

export default function ReservationCard({ reservation }: { reservation: ReservationCardData }) {
  return (
    <Link
      href={`/reservations/${reservation.id}`}
      className="block bg-neutral-900 rounded-2xl border border-white/10 p-4 hover:border-orange-500/50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-white">
            {new Date(reservation.reservationAt).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}{" "}
            ·{" "}
            {new Date(reservation.reservationAt).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            {reservation.guestCount} guest{reservation.guestCount !== 1 ? "s" : ""}
            {reservation.table ? ` · Table ${reservation.table.tableNumber}` : ""}
          </p>
        </div>
        <ReservationStatusBadge status={reservation.status} variant="dark" />
      </div>
    </Link>
  );
}