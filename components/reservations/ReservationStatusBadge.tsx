import { STATUS_LABELS, STATUS_COLORS } from "@/lib/reservations/status-transitions";
import type { ReservationStatus } from "@/app/generated/prisma/client";

export default function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}