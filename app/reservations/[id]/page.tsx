import { notFound } from "next/navigation";
import { requireAuthPage } from "@/lib/guards";
import { getMyReservationById } from "@/lib/actions/reservation.actions";
import ReservationStatusBadge from "@/components/reservations/ReservationStatusBadge";
import { canCustomerCancel } from "@/lib/reservations/status-transitions";
import CancelReservationButton from "@/components/reservations/CancelReservationButton";


export default async function MyReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuthPage();
  const { id } = await params;
  const reservation = await getMyReservationById(id);

  if (!reservation) notFound();

  const canCancel = canCustomerCancel(reservation.status, reservation.reservationAt);

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Reservation</h1>
        <ReservationStatusBadge status={reservation.status} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-2 text-sm">
        <Row label="Date & Time" value={new Date(reservation.reservationAt).toLocaleString("en-GB")} />
        <Row label="Party Size" value={`${reservation.guestCount} guests`} />
        <Row label="Table" value={reservation.table ? `Table ${reservation.table.tableNumber}` : "Not yet assigned"} />
        {reservation.specialRequest && (
          <Row label="Special Request" value={reservation.specialRequest} />
        )}
      </div>

      {canCancel && (
      <div className="mt-4 text-right">
    <CancelReservationButton reservationId={reservation.id} />
  </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-neutral-900">{value}</span>
    </div>
  );
}