// components/analytics/ExportCsvButton.tsx
"use client";

import { useTransition } from "react";
import {
  exportOrdersCsvAction,
  exportRevenueCsvAction,
  exportReservationsCsvAction,
} from "@/lib/actions/analytics.actions";
import type { AnalyticsRange } from "@/lib/analytics/range";

type ReportType = "orders" | "revenue" | "reservations";

export default function ExportCsvButton({
  report,
  range,
  filename,
  label = "Export CSV",
}: {
  report: ReportType;
  range: AnalyticsRange;
  filename: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const csv =
        report === "orders"
          ? await exportOrdersCsvAction(range)
          : report === "reservations"
          ? await exportReservationsCsvAction(range)
          : await exportRevenueCsvAction();

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
    >
      {isPending ? "Exporting..." : label}
    </button>
  );
}
