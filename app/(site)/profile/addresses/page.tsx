import Link from "next/link";
import { requireCustomerPage } from "@/lib/guards";
import { getMyAddresses } from "@/lib/actions/profile.actions";
import { getDict } from "@/lib/i18n/server";
import AddressBook from "@/components/profile/AddressBook";

export const metadata = { title: "Addresses" };

export default async function AddressesPage() {
  await requireCustomerPage();
  const [addresses, t] = await Promise.all([getMyAddresses(), getDict()]);

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
          {t.profile.addressesEyebrow}
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2">
          {t.profile.addressesTitle}
        </h1>
      </div>

      <AddressBook addresses={addresses} />
    </div>
  );
}
