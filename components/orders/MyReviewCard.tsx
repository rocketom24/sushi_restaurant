// components/orders/MyReviewCard.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/I18nProvider";
import StarRating from "@/components/ui/StarRating";
import ReviewForm from "./ReviewForm";
import { updateMyReviewAction, deleteMyReviewAction } from "@/lib/actions/review.actions";
import type { ReviewStatus } from "@/app/generated/prisma/client";

type MyReview = {
  id: string;
  rating: number;
  title: string;
  comment: string;
  status: ReviewStatus;
};

export default function MyReviewCard({ review }: { review: MyReview }) {
  const { dict } = useI18n();
  const t = dict.orders;
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const statusLabel: Record<ReviewStatus, string> = {
    PENDING: t.reviewStatusPending,
    APPROVED: t.reviewStatusApproved,
    REJECTED: t.reviewStatusRejected,
  };

  const statusClass: Record<ReviewStatus, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    APPROVED: "bg-green-500/10 text-green-400 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  function handleDelete() {
    if (!confirm(t.deleteReviewConfirm)) return;
    startTransition(async () => {
      await deleteMyReviewAction(review.id);
      router.refresh();
    });
  }

  if (isEditing) {
    return (
      <div className="glass rounded-3xl p-6 mb-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          {t.editReview}
        </h2>
        <ReviewForm
          action={async (state, formData) => {
            const result = await updateMyReviewAction(review.id, state, formData);
            if (result.success) setIsEditing(false);
            return result;
          }}
          defaultRating={review.rating}
          defaultTitle={review.title}
          defaultComment={review.comment}
          submitLabel={t.saveReview}
          submittingLabel={t.savingReview}
        />
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 mb-5">
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {t.yourReview}
        </h2>
        <span className={`text-xs px-2.5 py-1 rounded-full border ${statusClass[review.status]}`}>
          {statusLabel[review.status]}
        </span>
      </div>

      <StarRating rating={review.rating} />
      <p className="font-serif text-lg text-cream mt-2">{review.title}</p>
      <p className="text-sm text-gray-400 font-light mt-1 leading-relaxed">{review.comment}</p>

      <p className="text-xs text-gray-500 font-light mt-3 italic">
        {review.status === "PENDING" ? t.reviewPendingNote : t.reviewLockedNote}
      </p>

      <div className="flex gap-4 mt-4">
        {review.status === "PENDING" && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs uppercase tracking-wider text-gray-400 hover:text-cream transition-colors"
          >
            {t.editReview}
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs uppercase tracking-wider text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
        >
          {isPending ? t.deletingReview : t.deleteReview}
        </button>
      </div>
    </div>
  );
}
