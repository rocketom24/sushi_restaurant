import { requireAuthPage } from "@/lib/guards";
import { getMyAddresses } from "@/lib/actions/profile.actions";
import { getDict } from "@/lib/i18n/server";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  await requireAuthPage(); // guest checkout deferred — see Module 6 doc's own "(future)" note
  const [addresses, t] = await Promise.all([getMyAddresses(), getDict()]);

  const savedAddresses = addresses.map((a) => ({
    id: a.id,
    label: a.label,
    fullAddress: a.fullAddress,
    city: a.city,
    postalCode: a.postalCode,
    isDefault: a.isDefault,
  }));

  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <span className="text-accent text-xs font-semibold uppercase tracking-widest">
        {t.checkout.eyebrow}
      </span>
      <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2 mb-10">
        {t.checkout.title}
      </h1>
      <CheckoutForm savedAddresses={savedAddresses} />
    </div>
  );
}
