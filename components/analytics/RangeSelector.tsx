// components/analytics/RangeSelector.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { AnalyticsRange } from "@/lib/analytics/range";

const RANGES: { value: AnalyticsRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

export default function RangeSelector({ current }: { current: AnalyticsRange }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setRange(range: AnalyticsRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`/dashboard/analytics?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {RANGES.map((r) => (
        <button
          key={r.value}
          onClick={() => setRange(r.value)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            current === r.value
              ? "bg-white text-neutral-900 shadow-sm font-medium"
              : "text-gray-500 hover:text-neutral-900"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
