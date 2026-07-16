import Link from "next/link";

export const metadata = {
  title: "Accesso Negato",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-night px-6">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-4xl text-cream mb-4">
          Accesso Negato
        </h1>
        <p className="text-gray-400 font-light mb-10">
          Non hai i permessi per visualizzare questa pagina.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent hover:bg-white hover:text-night text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}
