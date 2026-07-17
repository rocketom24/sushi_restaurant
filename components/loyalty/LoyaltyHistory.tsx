"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import type { LoyaltyTransactionType } from "@/app/generated/prisma/client";

type Transaction = {
  id: string;
  type: LoyaltyTransactionType;
  points: number;
  description: string | null;
  orderNumber: string | null;
  createdAt: Date;
};

export default function LoyaltyHistory({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const { dict, locale } = useI18n();
  const t = dict.loyalty;
  const dateLocale = locale === "it" ? "it-IT" : "en-GB";

  const typeLabels: Record<LoyaltyTransactionType, string> = {
    EARNED: t.txEarned,
    REDEEMED: t.txRedeemed,
    ADJUSTED: t.txAdjusted,
    EXPIRED: t.txExpired,
  };

  if (transactions.length === 0) {
    return <p className="text-gray-400 font-light text-center py-10">{t.noHistory}</p>;
  }

  return (
    <ul className="divide-y divide-white/5">
      {transactions.map((tx) => {
        const positive = tx.points >= 0;
        return (
          <li key={tx.id} className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm text-cream">
                {typeLabels[tx.type]}
                {tx.orderNumber && (
                  <span className="text-gray-500 font-light"> · {tx.orderNumber}</span>
                )}
              </p>
              <p className="text-xs text-gray-500 font-light mt-0.5">
                {new Date(tx.createdAt).toLocaleDateString(dateLocale, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className={`text-sm font-semibold whitespace-nowrap ${
                positive ? "text-emerald-400" : "text-gray-400"
              }`}
            >
              {positive ? "+" : ""}
              {tx.points.toLocaleString()}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
