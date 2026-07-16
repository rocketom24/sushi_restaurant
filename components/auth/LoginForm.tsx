"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
// components/auth/LoginForm.tsx
import { loginAction } from "@/app/(auth)/actions";
import type { LoginFormState } from "@/lib/validations/auth";

const initialState: LoginFormState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <form action={formAction} className="space-y-5">
      {message && (
        <div className="rounded-md bg-emerald-500/10 border border-emerald-500/40 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      )}

      {state.errors?._form && (
        <div className="rounded-md bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-300">
          {state.errors._form[0]}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-md bg-neutral-950 border border-white/15 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
        />
        {state.errors?.email && (
          <p className="mt-1 text-sm text-red-400">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-md bg-neutral-950 border border-white/15 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
        />
        {state.errors?.password && (
          <p className="mt-1 text-sm text-red-400">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-orange-600 text-white py-2.5 font-medium hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-orange-400 font-medium underline hover:text-orange-300"
        >
          Register
        </Link>
      </p>
    </form>
  );
}