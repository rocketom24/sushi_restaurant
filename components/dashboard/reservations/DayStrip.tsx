"use client";

import { useRouter, useSearchParams } from "next/navigation";

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/**
 * Seven-day calendar strip. Each day shows its active-reservation count;
 * clicking a day filters the list to that date (toggles off when re-clicked).
 */
export default function DayStrip({ counts }: { counts: Record<string, number> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    return { date: d, key: dateKey(d) };
  });

  function selectDay(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedDate === key) params.delete("date");
    else params.set("date", key);
    router.push(`/dashboard/reservations?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {days.map(({ date, key }, i) => {
        const isSelected = selectedDate === key;
        const count = counts[key] ?? 0;
        return (
          <button
            key={key}
            onClick={() => selectDay(key)}
            className={`flex flex-col items-center rounded-xl border px-4 py-2 min-w-[72px] text-sm transition-colors ${
              isSelected
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-900 border-gray-200 hover:border-gray-400"
            }`}
          >
            <span className={`text-xs ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
              {i === 0
                ? "Today"
                : date.toLocaleDateString("en-GB", { weekday: "short" })}
            </span>
            <span className="font-semibold">
              {date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
            <span
              className={`text-xs mt-1 ${
                count > 0
                  ? isSelected
                    ? "text-white"
                    : "text-neutral-900 font-medium"
                  : isSelected
                    ? "text-gray-400"
                    : "text-gray-400"
              }`}
            >
              {count > 0 ? `${count} res.` : "—"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
