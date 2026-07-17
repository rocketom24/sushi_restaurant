// components/dashboard/RewardTable.tsx
"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleRewardAction, deleteRewardAction } from "@/lib/actions/reward.actions";

type RewardRow = {
  id: string;
  name: string;
  pointsCost: number;
  isActive: boolean;
  redemptionCount: number;
};

export default function RewardTable({ rewards }: { rewards: RewardRow[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggle(id: string) {
    startTransition(async () => {
      await toggleRewardAction(id);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this reward? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteRewardAction(id);
      if (result?.error) alert(result.error);
      else router.refresh();
    });
  }

  if (rewards.length === 0) {
    return <p className="text-gray-500 text-center py-12">No rewards yet.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
          <th className="py-3 px-4">Name</th>
          <th className="py-3 px-4">Points Cost</th>
          <th className="py-3 px-4">Redemptions</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rewards.map((r) => (
          <tr key={r.id} className="border-b border-gray-100">
            <td className="py-3 px-4 font-medium">{r.name}</td>
            <td className="py-3 px-4 text-gray-600">{r.pointsCost.toLocaleString()}</td>
            <td className="py-3 px-4 text-gray-600">{r.redemptionCount}</td>
            <td className="py-3 px-4">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  r.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {r.isActive ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="py-3 px-4 space-x-3 whitespace-nowrap">
              <Link
                href={`/dashboard/rewards/${r.id}/edit`}
                className="text-sm text-neutral-900 underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleToggle(r.id)}
                disabled={isPending}
                className="text-sm text-neutral-600 underline disabled:opacity-50"
              >
                {r.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => handleDelete(r.id)}
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
