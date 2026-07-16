import {
  getAllReservations,
  getReservationStats,
  getReservationDayCounts,
} from "@/lib/actions/reservation.actions";
import ReservationsTable from "@/components/dashboard/reservations/ReservationsTable";
import ReservationFilters from "@/components/dashboard/reservations/ReservationFilters";
import DayStrip from "@/components/dashboard/reservations/DayStrip";
import type { ReservationStatus } from "@/app/generated/prisma/client";

export default async function DashboardReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    date?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;

  const [reservations, stats, dayCounts] = await Promise.all([
    getAllReservations({
      status: params.status as ReservationStatus | undefined,
      date: params.date,
      search: params.search,
    }),
    getReservationStats(),
    getReservationDayCounts(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Reservations</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Today" value={stats.today} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Confirmed" value={stats.confirmed} />
        <StatCard label="Seated" value={stats.seated} />
      </div>

      <DayStrip counts={dayCounts} />

      <ReservationFilters />

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <ReservationsTable reservations={reservations} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-neutral-900 mt-1">{value}</p>
    </div>
  );
}
