// app/dashboard/rewards/new/page.tsx

import RewardForm from "@/components/dashboard/RewardForm";
import { createRewardAction } from "@/lib/actions/reward.actions";

export default function NewRewardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">New Reward</h1>
      <RewardForm action={createRewardAction} />
    </div>
  );
}
