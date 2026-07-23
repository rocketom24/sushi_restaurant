// components/orders/ReviewForm.tsx
"use client";

import { useActionState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { ReviewFormState } from "@/lib/validations/review";

const RATINGS = [5, 4, 3, 2, 1] as const;

type ReviewFormProps = {
  action: (state: ReviewFormState, formData: FormData) => Promise<ReviewFormState>;
  defaultRating?: number;
  defaultTitle?: string;
  defaultComment?: string;
  submitLabel: string;
  submittingLabel: string;
};

export default function ReviewForm({
  action,
  defaultRating,
  defaultTitle,
  defaultComment,
  submitLabel,
  submittingLabel,
}: ReviewFormProps) {
  const { dict } = useI18n();
  const t = dict.orders;
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.errors?._form && (
        <p className="text-sm text-red-400">{state.errors._form[0]}</p>
      )}

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
          {t.reviewRating}
        </legend>
        <div className="rating-stars text-2xl">
          {RATINGS.map((n) => (
            <span key={n}>
              <input
                type="radio"
                id={`rating-${n}`}
                name="rating"
                value={n}
                defaultChecked={defaultRating === n}
                required
              />
              <label htmlFor={`rating-${n}`} aria-label={`${n} star${n > 1 ? "s" : ""}`}>
                ★
              </label>
            </span>
          ))}
        </div>
        {state.errors?.rating && (
          <p className="mt-1 text-sm text-red-400">{state.errors.rating[0]}</p>
        )}
      </fieldset>

      <div>
        <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
          {t.reviewTitleLabel}
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={100}
          defaultValue={defaultTitle}
          placeholder={t.reviewTitlePlaceholder}
          required
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-cream placeholder:text-gray-600 focus:outline-none focus:border-accent transition-colors"
        />
        {state.errors?.title && (
          <p className="mt-1 text-sm text-red-400">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="comment" className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
          {t.reviewCommentLabel}
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          maxLength={1000}
          defaultValue={defaultComment}
          placeholder={t.reviewCommentPlaceholder}
          required
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-cream placeholder:text-gray-600 focus:outline-none focus:border-accent transition-colors resize-none"
        />
        {state.errors?.comment && (
          <p className="mt-1 text-sm text-red-400">{state.errors.comment[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-accent hover:bg-white hover:text-night text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 disabled:opacity-50"
      >
        {isPending ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}
