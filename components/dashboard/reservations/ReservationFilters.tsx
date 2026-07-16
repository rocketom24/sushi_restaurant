"use client";

import { useRouter, useSearchParams } from "next/navigation";

const STATUSES = ["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export default function ReservationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/dashboard/reservations?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="Search name or phone..."
        defaultValue={searchParams.get("search") ?? ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") updateParam("search", e.currentTarget.value);
        }}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm w-64"
      />
      <select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace("_", " ")}</option>
        ))}
      </select>
      <input
        type="date"
        defaultValue={searchParams.get("date") ?? ""}
        onChange={(e) => updateParam("date", e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      {searchParams.get("date") && (
        <button
          onClick={() => updateParam("date", "")}
          className="text-sm text-gray-500 underline"
        >
          All dates
        </button>
      )}
    </div>
  );
}
