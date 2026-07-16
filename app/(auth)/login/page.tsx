import { Suspense } from "react";
import Link from "next/link";
import { requireGuest } from "@/lib/guards";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login",
  description: "Login to your account to order sushi and track your loyalty points.",
};

export default async function LoginPage() {
  await requireGuest(); // redirects away if already logged in

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 scheme-dark">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl border border-white/10 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl text-white hover:underline">
            Sushi<span className="text-orange-500"> Restaurant</span>
          </Link>
          <p className="mt-2 text-gray-500 text-sm">Welcome back</p>
        </div>

        <Suspense fallback={<div className="h-48" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}