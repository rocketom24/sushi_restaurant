// app/dashboard/coupons/page.tsx

import Link from "next/link";
import { getCouponsForDashboard } from "@/lib/actions/coupon.actions";
import CouponTable from "@/components/dashboard/CouponTable";

export default async function CouponsPage() {
  const coupons = await getCouponsForDashboard();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Coupons</h1>
        <Link
          href="/dashboard/coupons/new"
          className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800"
        >
          + New Coupon
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <CouponTable coupons={coupons} />
      </div>
    </div>
  );
}
