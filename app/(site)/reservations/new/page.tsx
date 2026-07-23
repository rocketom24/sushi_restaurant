import { requireAuthPage } from "@/lib/guards";
import { getDict } from "@/lib/i18n/server";
import {
  allPossibleSlots,
  getRestaurantSettings,
  parseOperatingHours,
} from "@/lib/settings/settings";
import ReservationForm from "@/components/reservations/ReservationForm";
import { LampContainer } from "@/components/ui/lamp";

export const metadata = { title: "Book a Table" };

export default async function NewReservationPage() {
  await requireAuthPage();
  const [t, settings] = await Promise.all([getDict(), getRestaurantSettings()]);

  const hours = parseOperatingHours(settings.operatingHours);
  const timeSlots = allPossibleSlots(hours, settings.reservationSlotIntervalMinutes);

  return (
    <LampContainer>
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span className="text-accent text-xs font-semibold uppercase tracking-widest">
            {t.reservations.formEyebrow}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2">
            {t.reservations.formTitle}
          </h1>
        </div>
        <div className="glow-card">
          <div className="glow-card-inner rounded-2xl bg-night backdrop-blur-xl shadow-2xl shadow-black/50 p-6 md:p-8">
            <ReservationForm timeSlots={timeSlots} maxGuests={settings.reservationMaxGuests} />
          </div>
        </div>
      </div>
    </LampContainer>
  );
}
