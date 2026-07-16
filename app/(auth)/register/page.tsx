import Link from "next/link";
import { requireGuest } from "@/lib/guards";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Crea Account",
  description: "Registrati per ordinare sushi e prenotare un tavolo.",
};

export default async function RegisterPage() {
  await requireGuest(); // redirects away if already logged in

  return (
    <div className="min-h-screen flex items-center justify-center bg-night px-6 scheme-dark">
      <div className="w-full max-w-md glass rounded-3xl p-8">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-serif text-2xl tracking-widest font-bold text-cream"
          >
            KURO<span className="text-accent">.</span>
          </Link>
          <p className="mt-3 text-gray-500 text-sm font-light">
            Crea il tuo account
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
