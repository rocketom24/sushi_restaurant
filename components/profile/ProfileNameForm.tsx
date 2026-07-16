"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions/profile.actions";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { ProfileFormState } from "@/lib/validations/profile";

const initialState: ProfileFormState = {};

export default function ProfileNameForm({
  currentName,
  email,
}: {
  currentName: string;
  email: string;
}) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);
  const { dict } = useI18n();
  const t = dict.profile;

  return (
    <form action={formAction} className="space-y-5">
      {state.errors?._form && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-300">
          {state.errors._form[0]}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
        >
          {t.name}
        </label>
        <input
          id="name"
          name="name"
          defaultValue={currentName}
          required
          className="w-full rounded-lg bg-white/3 border border-white/10 px-4 py-3 text-sm text-cream focus:outline-none focus:border-accent transition-colors"
        />
        {state.errors?.name && (
          <p className="mt-2 text-xs text-red-400">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
          {t.email}
        </label>
        <p className="w-full rounded-lg bg-white/2 border border-white/5 px-4 py-3 text-sm text-gray-500">
          {email}
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-accent hover:bg-white hover:text-night text-white px-8 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest disabled:opacity-50 transition-all duration-300"
      >
        {isPending ? t.saving : state.success ? t.saved : t.save}
      </button>
    </form>
  );
}
