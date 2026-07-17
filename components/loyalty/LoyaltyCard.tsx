"use client";

import { useI18n } from "@/components/i18n/I18nProvider";

export default function LoyaltyCard({
  pointsBalance,
  lifetimePoints,
}: {
  pointsBalance: number;
  lifetimePoints: number;
}) {
  const { dict } = useI18n();
  const t = dict.loyalty;

  return (
    <div className="glass rounded-3xl p-8 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-16 -right-16 w-56 h-56 bg-accent/10 rounded-full blur-3xl dynamic-glow"
      />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          {t.pointsBalance}
        </p>
        <p className="font-serif text-6xl text-accent leading-none">
          {pointsBalance.toLocaleString()}
        </p>
        <p className="text-sm text-gray-400 font-light mt-2">
          {t.availablePoints}
        </p>

        <div className="mt-6 pt-5 border-t border-white/5 flex items-baseline gap-2">
          <span className="text-2xl font-serif text-cream">
            {lifetimePoints.toLocaleString()}
          </span>
          <span className="text-xs uppercase tracking-widest text-gray-500">
            {t.lifetimePoints}
          </span>
        </div>
      </div>
    </div>
  );
}
