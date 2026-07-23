// components/dashboard/ReviewTable.tsx
"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateReviewStatusAction,
  toggleReviewVisibilityAction,
  toggleReviewFeaturedAction,
  deleteReviewAction,
} from "@/lib/actions/review.actions";
import StarRating from "@/components/ui/StarRating";
import type { ReviewStatus } from "@/app/generated/prisma/client";

type ReviewRow = {
  id: string;
  rating: number;
  title: string;
  comment: string;
  status: ReviewStatus;
  isVisible: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  customerName: string;
  orderNumber: string;
};

const STATUS_STYLES: Record<ReviewStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function ReviewTable({ reviews }: { reviews: ReviewRow[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function run(action: () => Promise<{ error?: string } | { success?: boolean } | undefined>) {
    startTransition(async () => {
      const result = await action();
      if (result && "error" in result && result.error) alert(result.error);
      else router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    run(() => deleteReviewAction(id));
  }

  if (reviews.length === 0) {
    return <p className="text-gray-500 text-center py-12">No reviews yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">Order</th>
            <th className="py-3 px-4">Rating</th>
            <th className="py-3 px-4">Review</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Visible</th>
            <th className="py-3 px-4">Featured</th>
            <th className="py-3 px-4">Sort Order</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-b border-gray-100 align-top">
              <td className="py-3 px-4 font-medium whitespace-nowrap">{r.customerName}</td>
              <td className="py-3 px-4 text-gray-600 font-mono text-xs whitespace-nowrap">{r.orderNumber}</td>
              <td className="py-3 px-4">
                <StarRating rating={r.rating} className="text-amber-500" size="text-sm" />
              </td>
              <td className="py-3 px-4 max-w-xs">
                <p className="font-medium text-neutral-900">{r.title}</p>
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{r.comment}</p>
              </td>
              <td className="py-3 px-4">
                <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[r.status]}`}>
                  {r.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    r.isVisible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {r.isVisible ? "Visible" : "Hidden"}
                </span>
              </td>
              <td className="py-3 px-4">{r.isFeatured ? "★ Pinned" : "—"}</td>
              <td className="py-3 px-4 text-gray-600">{r.sortOrder}</td>
              <td className="py-3 px-4 space-x-3 whitespace-nowrap">
                {r.status !== "APPROVED" && (
                  <button
                    onClick={() => run(() => updateReviewStatusAction(r.id, "APPROVED"))}
                    disabled={isPending}
                    className="text-sm text-green-700 underline disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                {r.status !== "REJECTED" && (
                  <button
                    onClick={() => run(() => updateReviewStatusAction(r.id, "REJECTED"))}
                    disabled={isPending}
                    className="text-sm text-red-600 underline disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => run(() => toggleReviewVisibilityAction(r.id))}
                  disabled={isPending}
                  className="text-sm text-neutral-600 underline disabled:opacity-50"
                >
                  {r.isVisible ? "Hide" : "Unhide"}
                </button>
                <button
                  onClick={() => run(() => toggleReviewFeaturedAction(r.id))}
                  disabled={isPending}
                  className="text-sm text-neutral-600 underline disabled:opacity-50"
                >
                  {r.isFeatured ? "Unpin" : "Pin"}
                </button>
                <Link
                  href={`/dashboard/reviews/${r.id}/edit`}
                  className="text-sm text-neutral-900 underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={isPending}
                  className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
