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
    <div className="max-w-lg mx-auto px-6 py-20">
      <div className="flex items-start justify-between mb-10">
        <div>
          <span className="text-accent text-xs font-semibold uppercase tracking-widest">
            {"// Prenotazione"}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2">
            Il Tuo Tavolo
          </h1>
        </div>
        <ReservationStatusBadge status={reservation.status} variant="dark" />
      </div>

      <div className="glass rounded-3xl p-6 space-y-3 text-sm">
        <Row
          label="Data e Ora"
          value={new Date(reservation.reservationAt).toLocaleString("it-IT", {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
        <Row label="Persone" value={`${reservation.guestCount}`} />
        <Row
          label="Tavolo"
          value={
            reservation.table
              ? `Tavolo ${reservation.table.tableNumber}`
              : "Non ancora assegnato"
          }
        />
        {reservation.specialRequest && (
          <Row label="Richiesta Speciale" value={reservation.specialRequest} />
        )}
      </div>

      {canCancel && (
        <div className="mt-6 text-right">
          <CancelReservationButton reservationId={reservation.id} />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-white/5 last:border-b-0 pb-3 last:pb-0">
      <span className="text-gray-500 font-light">{label}</span>
      <span className="text-cream font-light text-right">{value}</span>
    </div>
  );
}
