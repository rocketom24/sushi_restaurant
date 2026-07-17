"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { redeemRewardAction } from "@/lib/actions/reward.actions";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function RewardRedeemButton({
  rewardId,
  canAfford,
}: {
  rewardId: string;
  canAfford: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { dict } = useI18n();
  const t = dict.loyalty;

  function handleRedeem() {
    if (!confirm(t.redeemConfirm)) return;
    startTransition(async () => {
      const result = await redeemRewardAction(rewardId);
      if (result.error) alert(result.error);
      else router.refresh();
    });
  }

  if (!canAfford) {
    return (
      <button
        disabled
        className="w-full rounded-full bg-white/5 text-gray-500 py-2.5 text-xs font-semibold uppercase tracking-widest cursor-not-allowed"
      >
        {t.notEnough}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleRedeem}
      disabled={isPending}
      className="w-full rounded-full bg-accent hover:bg-white hover:text-night text-white py-2.5 text-xs font-semibold uppercase tracking-widest disabled:opacity-50 transition-all duration-300"
    >
      {isPending ? t.redeeming : t.redeem}
    </button>
  );
}
