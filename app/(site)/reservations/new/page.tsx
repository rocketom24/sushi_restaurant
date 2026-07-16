import { requireAuthPage } from "@/lib/guards";
import ReservationForm from "@/components/reservations/ReservationForm";

export default async function NewReservationPage() {
  await requireAuthPage();

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <p className="text-orange-500 text-xs font-medium tracking-[0.35em] uppercase mb-3">
          Reservations
        </p>
        <h1 className="font-serif text-4xl text-white">Book a Table</h1>
      </div>
      <ReservationForm />
    </div>
  );
}