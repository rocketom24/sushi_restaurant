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
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-semibold text-neutral-900 hover:underline">
            Sushi Restaurant
          </Link>
          <p className="mt-2 text-gray-500 text-sm">Create your account</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}