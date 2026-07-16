import Link from "next/link";
import { requireGuest } from "@/lib/guards";
import RegisterForm from "@/components/auth/RegisterForm";
import { getDict } from "@/lib/i18n/server";

export const metadata = {
  title: "Create Account",
  description: "Register to order sushi and book a table.",
};

export default async function RegisterPage() {
  await requireGuest(); // redirects away if already logged in
  const t = await getDict();

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
            {t.auth.createAccount}
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
