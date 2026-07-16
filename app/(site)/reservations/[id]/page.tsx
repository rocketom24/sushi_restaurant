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
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="flex items-start justify-between mb-8">
        <h1 className="font-serif text-3xl text-white">Reservation</h1>
        <ReservationStatusBadge status={reservation.status} variant="dark" />
      </div>

      <div className="bg-neutral-900 rounded-2xl border border-white/10 p-5 space-y-2 text-sm">
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
      <span className="text-neutral-200">{value}</span>
    </div>
  );
}