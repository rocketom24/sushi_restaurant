"use client";

import { useActionState } from "react";
import Link from "next/link";
// components/auth/RegisterForm.tsx
import { registerAction } from "@/app/(auth)/actions";
import type { RegisterFormState } from "@/lib/validations/auth";

const initialState: RegisterFormState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.errors?._form && (
        <div className="rounded-md bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-300">
          {state.errors._form[0]}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={state.values?.name ?? ""}
          autoComplete="name"
          className="w-full rounded-md bg-neutral-950 border border-white/15 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
        />
        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-400">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.values?.email ?? ""}
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
          autoComplete="new-password"
          className="w-full rounded-md bg-neutral-950 border border-white/15 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
        />
        {state.errors?.password && (
          <p className="mt-1 text-sm text-red-400">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-md bg-neutral-950 border border-white/15 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
        />
        {state.errors?.confirmPassword && (
          <p className="mt-1 text-sm text-red-400">
            {state.errors.confirmPassword[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-orange-600 text-white py-2.5 font-medium hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Creating account..." : "Register"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-orange-400 font-medium underline hover:text-orange-300">
          Login
        </Link>
      </p>
    </form>
  );
}