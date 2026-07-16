"use client";

import { useActionState } from "react";
import Link from "next/link";
// components/auth/RegisterForm.tsx
import { registerAction } from "@/app/(auth)/actions";
import type { RegisterFormState } from "@/lib/validations/auth";

const initialState: RegisterFormState = {};

const inputClass =
  "w-full rounded-lg bg-white/3 border border-white/10 px-4 py-3 text-sm text-cream placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors";
const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.errors?._form && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-300">
          {state.errors._form[0]}
        </div>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          Nome Completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={state.values?.name ?? ""}
          autoComplete="name"
          className={inputClass}
        />
        {state.errors?.name && (
          <p className="mt-2 text-xs text-red-400">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.values?.email ?? ""}
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
          autoComplete="new-password"
          className={inputClass}
        />
        {state.errors?.password && (
          <p className="mt-2 text-xs text-red-400">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Conferma Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={inputClass}
        />
        {state.errors?.confirmPassword && (
          <p className="mt-2 text-xs text-red-400">
            {state.errors.confirmPassword[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-accent hover:bg-white hover:text-night text-white py-3 rounded-full text-xs font-semibold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isPending ? "Creazione account..." : "Registrati"}
      </button>

      <p className="text-center text-sm text-gray-500 font-light">
        Hai già un account?{" "}
        <Link
          href="/login"
          className="text-accent font-medium hover:underline underline-offset-4"
        >
          Accedi
        </Link>
      </p>
    </form>
  );
}
