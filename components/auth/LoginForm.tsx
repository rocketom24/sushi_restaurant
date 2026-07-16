"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
// components/auth/LoginForm.tsx
import { loginAction } from "@/app/(auth)/actions";
import type { LoginFormState } from "@/lib/validations/auth";

const initialState: LoginFormState = {};

const inputClass =
  "w-full rounded-lg bg-white/3 border border-white/10 px-4 py-3 text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors";
const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <form action={formAction} className="space-y-6">
      {message && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/40 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      )}

      {state.errors?._form && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-300">
          {state.errors._form[0]}
        </div>
      )}

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={inputClass}
        />
        {state.errors?.email && (
          <p className="mt-2 text-xs text-red-400">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={inputClass}
        />
        {state.errors?.password && (
          <p className="mt-2 text-xs text-red-400">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-accent hover:bg-white hover:text-night text-white py-3 rounded-full text-xs font-semibold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isPending ? "Accesso in corso..." : "Accedi"}
      </button>

      <p className="text-center text-sm text-gray-500 font-light">
        Non hai un account?{" "}
        <Link
          href="/register"
          className="text-accent font-medium hover:underline underline-offset-4"
        >
          Registrati
        </Link>
      </p>
    </form>
  );
}
