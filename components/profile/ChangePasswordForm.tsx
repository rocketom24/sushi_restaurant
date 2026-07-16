"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/lib/actions/profile.actions";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { PasswordFormState } from "@/lib/validations/profile";

const initialState: PasswordFormState = {};

const inputClass =
  "w-full rounded-lg bg-white/3 border border-white/10 px-4 py-3 text-sm text-cream focus:outline-none focus:border-accent transition-colors";
const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2";

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);
  const { dict } = useI18n();
  const t = dict.profile;

  return (
    <form action={formAction} className="space-y-5">
      {state.success && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/40 px-4 py-3 text-sm text-emerald-300">
          {t.passwordUpdated}
        </div>
      )}
      {state.errors?._form && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-300">
          {state.errors._form[0]}
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className={labelClass}>
          {t.currentPassword}
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
        {state.errors?.currentPassword && (
          <p className="mt-2 text-xs text-red-400">{state.errors.currentPassword[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" className={labelClass}>
          {t.newPassword}
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          className={inputClass}
        />
        {state.errors?.newPassword && (
          <p className="mt-2 text-xs text-red-400">{state.errors.newPassword[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmNewPassword" className={labelClass}>
          {t.confirmNewPassword}
        </label>
        <input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          required
          className={inputClass}
        />
        {state.errors?.confirmNewPassword && (
          <p className="mt-2 text-xs text-red-400">{state.errors.confirmNewPassword[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-accent hover:bg-white hover:text-night text-white px-8 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest disabled:opacity-50 transition-all duration-300"
      >
        {isPending ? t.updating : t.updatePassword}
      </button>
    </form>
  );
}
