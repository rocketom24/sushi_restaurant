// app/dashboard/settings/page.tsx

import { getSettingsForDashboard } from "@/lib/actions/settings.actions";
import { parseOperatingHours } from "@/lib/settings/settings";
import RestaurantForm from "@/components/settings/RestaurantForm";
import OperatingHoursForm from "@/components/settings/OperatingHoursForm";
import ReservationSettingsForm from "@/components/settings/ReservationSettingsForm";
import OrderingSettingsForm from "@/components/settings/OrderingSettingsForm";
import PaymentSettingsForm from "@/components/settings/PaymentSettingsForm";
import LoyaltySettingsForm from "@/components/settings/LoyaltySettingsForm";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      {description && <p className="text-sm text-gray-500 mt-1 mb-4">{description}</p>}
      {!description && <div className="mb-4" />}
      {children}
    </section>
  );
}

export default async function SettingsPage() {
  const settings = await getSettingsForDashboard();
  const hours = parseOperatingHours(settings.operatingHours);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Settings</h1>

      <Section title="Restaurant Information" description="Public-facing details for receipts, contact, and legal ID.">
        <RestaurantForm settings={settings} />
      </Section>

      <Section title="Operating Hours" description="Lunch and dinner shifts per day — respected by the reservation system.">
        <OperatingHoursForm hours={hours} />
      </Section>

      <Section title="Reservation Settings">
        <ReservationSettingsForm settings={settings} />
      </Section>

      <Section title="Ordering Settings">
        <OrderingSettingsForm settings={settings} />
      </Section>

      <Section title="Payment Settings" description="Only enabled methods appear at checkout.">
        <PaymentSettingsForm settings={settings} />
      </Section>

      <Section title="Loyalty Settings">
        <LoyaltySettingsForm settings={settings} />
      </Section>
    </div>
  );
}
