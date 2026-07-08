import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account | Your Restaurant",
  description: "Register to order sushi, save addresses, and earn loyalty points.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Your Restaurant
          </h1>
          <p className="mt-2 text-gray-500 text-sm">Create your account</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}