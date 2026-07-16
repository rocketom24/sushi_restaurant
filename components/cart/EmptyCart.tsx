import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="text-center py-16">
      <p className="text-gray-400 font-light mb-6">Il tuo carrello è vuoto.</p>
      <Link
        href="/menu"
        className="inline-block bg-accent hover:bg-white hover:text-night text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
      >
        Sfoglia il Menu
      </Link>
    </div>
  );
}
