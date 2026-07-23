// app/dashboard/reviews/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import ReviewEditForm from "@/components/dashboard/ReviewEditForm";
import { getReviewById, updateReviewAction } from "@/lib/actions/review.actions";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getReviewById(id);

  if (!review) notFound();

  const updateWithId = updateReviewAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Edit Review</h1>
      <ReviewEditForm action={updateWithId} review={review} />
    </div>
  );
}
