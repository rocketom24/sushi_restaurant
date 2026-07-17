// app/dashboard/rewards/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import RewardForm from "@/components/dashboard/RewardForm";
import { getRewardById, updateRewardAction } from "@/lib/actions/reward.actions";

export default async function EditRewardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reward = await getRewardById(id);

  if (!reward) notFound();

  const updateWithId = updateRewardAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Edit Reward</h1>
      <RewardForm action={updateWithId} reward={reward} />
    </div>
  );
}
