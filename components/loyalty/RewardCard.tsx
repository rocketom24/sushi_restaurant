"use client";

import RewardRedeemButton from "./RewardRedeemButton";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function RewardCard({
  reward,
  pointsBalance,
}: {
  reward: {
    id: string;
    name: string;
    description: string | null;
    pointsCost: number;
  };
  pointsBalance: number;
}) {
  const { dict } = useI18n();
  const t = dict.loyalty;
  const canAfford = pointsBalance >= reward.pointsCost;

  return (
    <div className="glass rounded-3xl p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-serif text-xl text-cream">{reward.name}</h3>
        <span className="text-sm font-semibold text-accent whitespace-nowrap">
          {reward.pointsCost.toLocaleString()} {t.points}
        </span>
      </div>
      {reward.description && (
        <p className="text-xs text-gray-400 font-light leading-relaxed mb-4 flex-1">
          {reward.description}
        </p>
      )}
      <div className="mt-auto pt-2">
        <RewardRedeemButton rewardId={reward.id} canAfford={canAfford} />
      </div>
    </div>
  );
}
