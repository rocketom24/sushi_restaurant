"use client";

import { useRouter, useSearchParams } from "next/navigation";

const STATUSES = ["NEW", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];
const TYPES = ["DINE_IN", "TAKEAWAY", "DELIVERY"];

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/dashboard/orders?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="Search order #, name, email..."
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
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        defaultValue={searchParams.get("orderType") ?? ""}
        onChange={(e) => updateParam("orderType", e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">All Types</option>
        {TYPES.map((t) => (
          <option key={t} value={t}>{t.replace("_", " ")}</option>
        ))}
      </select>
    </div>
  );
}