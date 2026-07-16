import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getReservationByIdForOwner,
  getAvailableTablesForReassignment,
} from "@/lib/actions/reservation.actions";
import { getAllowedTransitions } from "@/lib/reservations/status-transitions";
import ReservationStatusBadge from "@/components/reservations/ReservationStatusBadge";
import ReservationStatusActions from "@/components/dashboard/reservations/ReservationStatusActions";
import TableAssignmentDialog from "@/components/dashboard/reservations/TableAssignmentDialog";

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [reservation, tables] = await Promise.all([
    getReservationByIdForOwner(id),
    getAvailableTablesForReassignment(),
  ]);

  if (!reservation) notFound();

  const canReassignTable = ["PENDING", "CONFIRMED"].includes(reservation.status);

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/reservations"
        className="text-sm text-gray-500 hover:text-neutral-900 hover:underline"
      >
        &larr; Back to reservations
      </Link>

      <div className="flex items-center justify-between mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {reservation.customerName}
        </h1>
        <ReservationStatusBadge status={reservation.status} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-500 mb-4">Reservation Details</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <DetailRow
            label="Date & Time"
            value={new Date(reservation.reservationAt).toLocaleString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <DetailRow label="Guests" value={String(reservation.guestCount)} />
          <DetailRow
            label="Table"
            value={
              reservation.table
                ? `Table ${reservation.table.tableNumber} (seats ${reservation.table.capacity})`
                : "Not assigned"
            }
          />
          <DetailRow label="Source" value={reservation.source} />
          <DetailRow label="Phone" value={reservation.phone} />
          <DetailRow label="Email" value={reservation.email ?? "—"} />
          <DetailRow
            label="Account"
            value={
              reservation.user
                ? `${reservation.user.name} (${reservation.user.email})`
                : "—"
            }
          />
          <DetailRow
            label="Arrived At"
            value={
              reservation.arrivedAt
                ? new Date(reservation.arrivedAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"
            }
          />
          <DetailRow
            label="Booked On"
            value={new Date(reservation.createdAt).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </dl>

        {reservation.specialRequest && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Special Request</p>
            <p className="text-sm text-neutral-900">{reservation.specialRequest}</p>
          </div>
        )}

        {reservation.internalNote && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Internal Note</p>
            <p className="text-sm text-neutral-900">{reservation.internalNote}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-500 mb-4">Status</h2>
        <ReservationStatusActions
          reservationId={reservation.id}
          allowedTransitions={getAllowedTransitions(reservation.status)}
        />
      </div>

      {canReassignTable && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Assign Table</h2>
          <TableAssignmentDialog
            reservationId={reservation.id}
            currentTableId={reservation.tableId}
            guestCount={reservation.guestCount}
            tables={tables}
          />
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-neutral-900 mt-0.5">{value}</dd>
    </div>
  );
}
