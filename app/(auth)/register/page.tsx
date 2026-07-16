import Link from "next/link";
import { requireGuest } from "@/lib/guards";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account",
  description: "Register to order sushi, save addresses, and earn loyalty points.",
};

export default async function RegisterPage() {
  await requireGuest(); // redirects away if already logged in

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 scheme-dark">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl border border-white/10 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl text-white hover:underline">
            Sushi<span className="text-orange-500"> Restaurant</span>
          </Link>
          <p className="mt-2 text-gray-500 text-sm">Create your account</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}