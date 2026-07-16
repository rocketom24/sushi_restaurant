import { requireAuthPage } from "@/lib/guards";
import ReservationForm from "@/components/reservations/ReservationForm";

export default async function NewReservationPage() {
  await requireAuthPage();

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Book a Table</h1>
      <ReservationForm />
    </div>
  );
}