import { requireAuthPage } from "@/lib/guards";
import ReservationForm from "@/components/reservations/ReservationForm";

export default async function NewReservationPage() {
  await requireAuthPage();

  return (
    <div className="max-w-lg mx-auto px-6 py-20">
      <div className="mb-10">
        <span className="text-accent text-xs font-semibold uppercase tracking-widest">
          {"// Prenotazioni"}
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2">
          Prenota un Tavolo
        </h1>
      </div>
      <ReservationForm />
    </div>
  );
}
