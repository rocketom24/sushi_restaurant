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
      className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-300 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-neutral-900">
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
        <ReservationStatusBadge status={reservation.status} />
      </div>
    </Link>
  );
}