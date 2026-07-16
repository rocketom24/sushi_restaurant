import Link from "next/link";
import { requireCustomerPage } from "@/lib/guards";
import { getDict } from "@/lib/i18n/server";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireCustomerPage();
  const t = await getDict();

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <Link
        href="/profile"
        className="text-xs uppercase tracking-wider text-gray-500 hover:text-accent transition-colors"
      >
        ← {t.profile.back}
      </Link>
      <div className="mt-4 mb-10">
        <span className="text-accent text-xs font-semibold uppercase tracking-widest">
          {t.profile.settingsEyebrow}
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2">
          {t.profile.settingsTitle}
        </h1>
      </div>

      <div className="glass rounded-3xl p-6 mb-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
          {t.profile.changePassword}
        </h2>
        <ChangePasswordForm />
      </div>

      <div className="glass rounded-3xl p-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
          {t.profile.language}
        </h2>
        <p className="text-sm text-gray-400 font-light mb-4">
          {t.profile.languageNote}
        </p>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
