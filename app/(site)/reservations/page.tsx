import Link from "next/link";
import { requireAuthPage } from "@/lib/guards";
import { getMyReservations } from "@/lib/actions/reservation.actions";
import ReservationCard from "@/components/reservations/ReservationCard";

export default async function MyReservationsPage() {
  await requireAuthPage();
  const reservations = await getMyReservations();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">My Reservations</h1>
        <Link
          href="/reservations/new"
          className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800"
        >
          + New Reservation
        </Link>
      </div>

      {reservations.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No reservations found.</p>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <ReservationCard key={r.id} reservation={r} />
          ))}
        </div>
      )}
    </div>
  );
}