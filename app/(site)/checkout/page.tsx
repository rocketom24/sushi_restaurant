import { requireAuthPage } from "@/lib/guards";
import { getMyAddresses } from "@/lib/actions/profile.actions";
import { getDict } from "@/lib/i18n/server";
import { getRestaurantSettings } from "@/lib/settings/settings";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requireAuthPage(); // guest checkout deferred — see Module 6 doc's own "(future)" note
  const [addresses, t, settings, params] = await Promise.all([
    getMyAddresses(),
    getDict(),
    getRestaurantSettings(),
    searchParams,
  ]);

  const requestedType = params.type;
  const initialOrderType =
    requestedType === "DELIVERY" || requestedType === "DINE_IN" || requestedType === "TAKEAWAY"
      ? requestedType
      : undefined;

  const savedAddresses = addresses.map((a) => ({
    id: a.id,
    label: a.label,
    fullAddress: a.fullAddress,
    city: a.city,
    postalCode: a.postalCode,
    isDefault: a.isDefault,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <span className="text-accent text-xs font-semibold uppercase tracking-widest">
        {t.checkout.eyebrow}
      </span>
      <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2 mb-10">
        {t.checkout.title}
      </h1>
      <CheckoutForm
        savedAddresses={savedAddresses}
        initialOrderType={initialOrderType}
        orderTypesEnabled={{
          DINE_IN: settings.dineInEnabled,
          TAKEAWAY: settings.takeawayEnabled,
          DELIVERY: settings.deliveryEnabled,
        }}
        paymentMethodsEnabled={{
          CASH: settings.cashEnabled,
          CARD: settings.cardEnabled,
          SATISPAY: settings.satispayEnabled,
          TICKET_RESTAURANT_EDENRED: settings.edenredEnabled,
        }}
        minOrderAmount={Number(settings.minOrderAmount)}
        deliveryFee={Number(settings.deliveryFee)}
      />
    </div>
  );
}
