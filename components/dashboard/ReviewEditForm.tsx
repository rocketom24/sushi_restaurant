// components/dashboard/ReviewEditForm.tsx
"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ReviewEditFormState } from "@/lib/validations/review";

type Review = {
  id: string;
  rating: number;
  title: string;
  comment: string;
  sortOrder: number;
};

export default function ReviewEditForm({
  action,
  review,
}: {
  action: (state: ReviewEditFormState, formData: FormData) => Promise<ReviewEditFormState>;
  review: Review;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      {state.errors?._form && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.errors._form[0]}
        </div>
      )}

      <div>
        <label htmlFor="rating" className="block text-sm font-medium mb-1">
          Rating (1-5)
        </label>
        <input
          id="rating"
          name="rating"
          type="number"
          min="1"
          max="5"
          defaultValue={review.rating}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.rating && (
          <p className="mt-1 text-sm text-red-600">{state.errors.rating[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={review.title}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.title && (
          <p className="mt-1 text-sm text-red-600">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-1">
          Comment
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={5}
          defaultValue={review.comment}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.comment && (
          <p className="mt-1 text-sm text-red-600">{state.errors.comment[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="sortOrder" className="block text-sm font-medium mb-1">
          Sort Order
        </label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min="0"
          defaultValue={review.sortOrder}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.sortOrder && (
          <p className="mt-1 text-sm text-red-600">{state.errors.sortOrder[0]}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-neutral-900 text-white px-6 py-2.5 font-medium hover:bg-neutral-800 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <Link
          href="/dashboard/reviews"
          className="rounded-md border border-gray-300 px-6 py-2.5 font-medium hover:bg-gray-50 inline-flex items-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
