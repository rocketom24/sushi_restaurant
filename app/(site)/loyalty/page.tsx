import { requireCustomerPage } from "@/lib/guards";
import { getDict, getLocale } from "@/lib/i18n/server";
import {
  getMyLoyaltySummary,
  getMyLoyaltyHistory,
  getMyCouponHistory,
} from "@/lib/actions/loyalty.actions";
import {
  getAvailableRewards,
  getMyRewardRedemptions,
} from "@/lib/actions/reward.actions";
import LoyaltyCard from "@/components/loyalty/LoyaltyCard";
import RewardCard from "@/components/loyalty/RewardCard";
import LoyaltyHistory from "@/components/loyalty/LoyaltyHistory";

export const metadata = { title: "Rewards & Points" };

export default async function LoyaltyPage() {
  await requireCustomerPage();

  const [t, locale, summary, rewards, history, couponHistory, redemptions] =
    await Promise.all([
      getDict(),
      getLocale(),
      getMyLoyaltySummary(),
      getAvailableRewards(),
      getMyLoyaltyHistory(),
      getMyCouponHistory(),
      getMyRewardRedemptions(),
    ]);

  const tl = t.loyalty;
  const dateLocale = locale === "it" ? "it-IT" : "en-GB";

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <span className="text-accent text-xs font-semibold uppercase tracking-widest">
        {tl.eyebrow}
      </span>
      <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2 mb-2">
        {tl.title}
      </h1>
      <p className="text-sm text-gray-400 font-light mb-10">{tl.subtitle}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-1">
          <LoyaltyCard
            pointsBalance={summary.pointsBalance}
            lifetimePoints={summary.lifetimePoints}
          />
        </div>

        {/* Available rewards */}
        <div className="lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            {tl.availableRewards}
          </h2>
          {rewards.length === 0 ? (
            <div className="glass rounded-3xl p-6">
              <p className="text-gray-400 font-light text-center py-6">
                {tl.noRewards}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  pointsBalance={summary.pointsBalance}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My redeemed rewards */}
      {redemptions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            {tl.myRewards}
          </h2>
          <div className="glass rounded-3xl p-6">
            <ul className="divide-y divide-white/5">
              {redemptions.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-sm text-cream">{r.rewardName}</p>
                    <p className="text-xs text-gray-500 font-light mt-0.5">
                      {new Date(r.redeemedAt).toLocaleDateString(dateLocale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${
                      r.fulfilled
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-gold/15 text-gold"
                    }`}
                  >
                    {r.fulfilled ? tl.fulfilled : tl.pending}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points history */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            {tl.history}
          </h2>
          <div className="glass rounded-3xl p-6">
            <LoyaltyHistory transactions={history} />
          </div>
        </section>

        {/* Coupon history */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            {tl.couponHistory}
          </h2>
          <div className="glass rounded-3xl p-6">
            {couponHistory.length === 0 ? (
              <p className="text-gray-400 font-light text-center py-10">
                {tl.noCoupons}
              </p>
            ) : (
              <ul className="divide-y divide-white/5">
                {couponHistory.map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-3.5">
                    <div>
                      <p className="text-sm text-cream font-mono">{c.code}</p>
                      <p className="text-xs text-gray-500 font-light mt-0.5">
                        {c.orderNumber} ·{" "}
                        {new Date(c.createdAt).toLocaleDateString(dateLocale, {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <span className="text-sm text-emerald-400 font-semibold whitespace-nowrap">
                      −€{c.discountAmount.toFixed(2)} {tl.saved}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
