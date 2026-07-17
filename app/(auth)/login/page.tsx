import { Suspense } from "react";
import Link from "next/link";
import { requireGuest } from "@/lib/guards";
import LoginForm from "@/components/auth/LoginForm";
import { getDict } from "@/lib/i18n/server";

export const metadata = {
  title: "Login",
  description: "Log in to order sushi and book a table.",
};

export default async function LoginPage() {
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
            NAGASAKI<span className="text-accent">.</span>
          </Link>
          <p className="mt-3 text-gray-500 text-sm font-light">{t.auth.welcomeBack}</p>
        </div>

        <Suspense fallback={<div className="h-48" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
