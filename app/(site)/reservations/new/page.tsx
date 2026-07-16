import { requireAuthPage } from "@/lib/guards";
import { getDict } from "@/lib/i18n/server";
import ReservationForm from "@/components/reservations/ReservationForm";

export const metadata = { title: "Book a Table" };

export default async function NewReservationPage() {
  await requireAuthPage();
  const t = await getDict();

  return (
    <div className="max-w-lg mx-auto px-6 py-20">
      <div className="mb-10">
        <span className="text-accent text-xs font-semibold uppercase tracking-widest">
          {t.reservations.formEyebrow}
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2">
          {t.reservations.formTitle}
        </h1>
      </div>
      <ReservationForm />
    </div>
  );
}
