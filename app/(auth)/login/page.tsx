import { Suspense } from "react";
import { requireGuest } from "@/lib/guards";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | Your Restaurant",
  description: "Login to your account to order sushi and track your loyalty points.",
};

export default async function LoginPage() {
  await requireGuest(); // redirects away if already logged in

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Your Restaurant
          </h1>
          <p className="mt-2 text-gray-500 text-sm">Welcome back</p>
        </div>

        <Suspense fallback={<div className="h-48" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}