// components/dashboard/CouponTable.tsx
"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleCouponAction, deleteCouponAction } from "@/lib/actions/coupon.actions";
import type { DiscountType } from "@/app/generated/prisma/client";

type CouponRow = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minOrderAmount: number | null;
  maxUsageCount: number | null;
  usageCount: number;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
};

function formatValue(type: DiscountType, value: number) {
  return type === "PERCENTAGE" ? `${value}%` : `€${value.toFixed(2)}`;
}

export default function CouponTable({ coupons }: { coupons: CouponRow[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggle(id: string) {
    startTransition(async () => {
      await toggleCouponAction(id);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this coupon? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteCouponAction(id);
      if (result?.error) alert(result.error);
      else router.refresh();
    });
  }

  if (coupons.length === 0) {
    return <p className="text-gray-500 text-center py-12">No coupons yet.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
          <th className="py-3 px-4">Code</th>
          <th className="py-3 px-4">Discount</th>
          <th className="py-3 px-4">Usage</th>
          <th className="py-3 px-4">Expires</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {coupons.map((c) => (
          <tr key={c.id} className="border-b border-gray-100">
            <td className="py-3 px-4 font-mono font-medium">{c.code}</td>
            <td className="py-3 px-4 text-gray-600">
              {formatValue(c.type, c.value)}
              {c.minOrderAmount ? (
                <span className="text-xs text-gray-400"> · min €{c.minOrderAmount.toFixed(2)}</span>
              ) : null}
            </td>
            <td className="py-3 px-4 text-gray-600">
              {c.usageCount}
              {c.maxUsageCount !== null ? ` / ${c.maxUsageCount}` : ""}
            </td>
            <td className="py-3 px-4 text-gray-600 text-sm">
              {c.endsAt ? new Date(c.endsAt).toLocaleDateString("en-GB") : "—"}
            </td>
            <td className="py-3 px-4">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {c.isActive ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="py-3 px-4 space-x-3 whitespace-nowrap">
              <Link
                href={`/dashboard/coupons/${c.id}/edit`}
                className="text-sm text-neutral-900 underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleToggle(c.id)}
                disabled={isPending}
                className="text-sm text-neutral-600 underline disabled:opacity-50"
              >
                {c.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                disabled={isPending}
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
