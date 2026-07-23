// app/dashboard/reviews/page.tsx

import { getReviewsForDashboard } from "@/lib/actions/review.actions";
import ReviewTable from "@/components/dashboard/ReviewTable";

export default async function ReviewsPage() {
  const reviews = await getReviewsForDashboard();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Reviews</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <ReviewTable reviews={reviews} />
      </div>
    </div>
  );
}
