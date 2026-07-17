// components/dashboard/RewardRedemptionsTable.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { fulfillRedemptionAction } from "@/lib/actions/reward.actions";

type RedemptionRow = {
  id: string;
  rewardName: string;
  pointsCost: number;
  customerName: string;
  customerEmail: string;
  fulfilled: boolean;
  redeemedAt: Date;
  fulfilledAt: Date | null;
};

export default function RewardRedemptionsTable({
  redemptions,
}: {
  redemptions: RedemptionRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleFulfill(id: string) {
    startTransition(async () => {
      const result = await fulfillRedemptionAction(id);
      if (result?.error) alert(result.error);
      else router.refresh();
    });
  }

  if (redemptions.length === 0) {
    return <p className="text-gray-500 text-center py-12">No redemptions yet.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
          <th className="py-3 px-4">Customer</th>
          <th className="py-3 px-4">Reward</th>
          <th className="py-3 px-4">Points</th>
          <th className="py-3 px-4">Redeemed</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {redemptions.map((r) => (
          <tr key={r.id} className="border-b border-gray-100">
            <td className="py-3 px-4">
              <p className="font-medium">{r.customerName}</p>
              <p className="text-xs text-gray-400">{r.customerEmail}</p>
            </td>
            <td className="py-3 px-4 text-gray-600">{r.rewardName}</td>
            <td className="py-3 px-4 text-gray-600">{r.pointsCost.toLocaleString()}</td>
            <td className="py-3 px-4 text-gray-600 text-sm">
              {new Date(r.redeemedAt).toLocaleDateString("en-GB")}
            </td>
            <td className="py-3 px-4">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  r.fulfilled ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {r.fulfilled ? "Fulfilled" : "Pending"}
              </span>
            </td>
            <td className="py-3 px-4">
              {!r.fulfilled && (
                <button
                  onClick={() => handleFulfill(r.id)}
                  disabled={isPending}
                  className="text-sm text-neutral-900 underline disabled:opacity-50"
                >
                  Mark Fulfilled
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
