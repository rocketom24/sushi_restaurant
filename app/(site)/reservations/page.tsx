import Link from "next/link";
import { requireAuthPage } from "@/lib/guards";
import { getMyReservations } from "@/lib/actions/reservation.actions";
import ReservationCard from "@/components/reservations/ReservationCard";

export default async function MyReservationsPage() {
  await requireAuthPage();
  const reservations = await getMyReservations();

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-accent text-xs font-semibold uppercase tracking-widest">
            {"// Storico"}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2">
            Le Mie Prenotazioni
          </h1>
        </div>
        <Link
          href="/reservations/new"
          className="bg-accent hover:bg-white hover:text-night text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
        >
          + Nuova
        </Link>
      </div>

      {reservations.length === 0 ? (
        <p className="text-gray-400 font-light text-center py-16">
          Nessuna prenotazione trovata.
        </p>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => (
            <ReservationCard key={r.id} reservation={r} />
          ))}
        </div>
      )}
    </div>
  );
}
