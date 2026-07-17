import Link from "next/link";
import { requireCustomerPage } from "@/lib/guards";
import { getDict } from "@/lib/i18n/server";
import { getMyLoyaltySummary } from "@/lib/actions/loyalty.actions";
import ProfileNameForm from "@/components/profile/ProfileNameForm";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const [user, t, loyalty] = await Promise.all([
    requireCustomerPage(),
    getDict(),
    getMyLoyaltySummary(),
  ]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <span className="text-accent text-xs font-semibold uppercase tracking-widest">
        {t.profile.eyebrow}
      </span>
      <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2 mb-10">
        {t.profile.title}
      </h1>

      <div className="glass rounded-3xl p-6 mb-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
          {t.profile.accountInfo}
        </h2>
        <ProfileNameForm currentName={user.name} email={user.email} />
      </div>

      {/* Loyalty summary */}
      <Link
        href="/loyalty"
        className="glass rounded-3xl p-6 mb-5 flex items-center justify-between group"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            {t.loyalty.pointsBalance}
          </p>
          <p className="font-serif text-3xl text-accent">
            {loyalty.pointsBalance.toLocaleString()}{" "}
            <span className="text-sm text-gray-500">{t.loyalty.points}</span>
          </p>
        </div>
        <span className="text-xs uppercase tracking-widest text-gray-400 group-hover:text-accent transition-colors">
          {t.profile.loyaltyLink} →
        </span>
      </Link>

      <div className="glass rounded-3xl p-6 mb-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          {t.profile.quickLinks}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/orders"
            className="rounded-2xl border border-white/10 hover:border-accent px-5 py-4 text-sm text-gray-300 hover:text-accent transition-all duration-300"
          >
            {t.profile.ordersLink} →
          </Link>
          <Link
            href="/reservations"
            className="rounded-2xl border border-white/10 hover:border-accent px-5 py-4 text-sm text-gray-300 hover:text-accent transition-all duration-300"
          >
            {t.profile.reservationsLink} →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/profile/addresses"
          className="glass rounded-3xl p-6 hover:-translate-y-1 transition-all duration-500 group"
        >
          <h2 className="font-serif text-lg text-cream group-hover:text-accent transition-colors duration-300">
            {t.profile.addresses}
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            {t.profile.addressesTitle}
          </p>
        </Link>
        <Link
          href="/profile/settings"
          className="glass rounded-3xl p-6 hover:-translate-y-1 transition-all duration-500 group"
        >
          <h2 className="font-serif text-lg text-cream group-hover:text-accent transition-colors duration-300">
            {t.profile.settings}
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            {t.profile.settingsTitle}
          </p>
        </Link>
      </div>
    </div>
  );
}
