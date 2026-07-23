// app/dashboard/loyalty/page.tsx

import Link from "next/link";
import { getLoyaltyStats, getTopLoyaltyCustomers } from "@/lib/actions/loyalty.actions";
import LoyaltyStats from "@/components/dashboard/LoyaltyStats";

export default async function LoyaltyDashboardPage() {
  const [stats, topCustomers] = await Promise.all([
    getLoyaltyStats(),
    getTopLoyaltyCustomers(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Loyalty</h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/coupons"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Manage Coupons
          </Link>
          <Link
            href="/dashboard/rewards"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Manage Rewards
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <LoyaltyStats stats={stats} />
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Top Customers</h2>
      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        {topCustomers.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No customers have earned points yet.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Points Balance</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c) => (
                <tr key={c.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {c.pointsBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
