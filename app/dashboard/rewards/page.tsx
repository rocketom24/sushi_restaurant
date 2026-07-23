// app/dashboard/rewards/page.tsx

import Link from "next/link";
import {
  getRewardsForDashboard,
  getRewardRedemptionsForOwner,
} from "@/lib/actions/reward.actions";
import RewardTable from "@/components/dashboard/RewardTable";
import RewardRedemptionsTable from "@/components/dashboard/RewardRedemptionsTable";

export default async function RewardsPage() {
  const [rewards, redemptions] = await Promise.all([
    getRewardsForDashboard(),
    getRewardRedemptionsForOwner(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Rewards</h1>
          <Link
            href="/dashboard/rewards/new"
            className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800"
          >
            + New Reward
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <RewardTable rewards={rewards} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Redemptions
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <RewardRedemptionsTable redemptions={redemptions} />
        </div>
      </div>
    </div>
  );
}
