"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assignTableAction } from "@/lib/actions/reservation.actions";

type TableOption = {
  id: string;
  tableNumber: number;
  capacity: number;
};

export default function TableAssignmentDialog({
  reservationId,
  currentTableId,
  guestCount,
  tables,
}: {
  reservationId: string;
  currentTableId: string | null;
  guestCount: number;
  tables: TableOption[];
}) {
  const [selectedId, setSelectedId] = useState(currentTableId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAssign() {
    if (!selectedId || selectedId === currentTableId) return;
    setError(null);
    startTransition(async () => {
      const result = await assignTableAction(reservationId, selectedId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div>
      <div className="flex gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm flex-1"
        >
          <option value="">Select a table...</option>
          {tables.map((t) => (
            <option key={t.id} value={t.id}>
              Table {t.tableNumber} — seats {t.capacity}
              {t.capacity < guestCount ? " (too small)" : ""}
            </option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          disabled={isPending || !selectedId || selectedId === currentTableId}
          className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm disabled:opacity-40"
        >
          {isPending ? "Assigning..." : "Assign"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
