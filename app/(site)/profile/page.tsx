import Link from "next/link";
import { requireCustomerPage } from "@/lib/guards";
import { getDict } from "@/lib/i18n/server";
import ProfileNameForm from "@/components/profile/ProfileNameForm";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const [user, t] = await Promise.all([requireCustomerPage(), getDict()]);

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
