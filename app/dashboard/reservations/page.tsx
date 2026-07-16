import { getAllReservations } from "@/lib/actions/reservation.actions";
import ReservationsTable from "@/components/dashboard/reservations/ReservationsTable";

export default async function DashboardReservationsPage() {
  const reservations = await getAllReservations();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Reservations</h1>
      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <ReservationsTable reservations={reservations} />
      </div>
    </div>
  );
}