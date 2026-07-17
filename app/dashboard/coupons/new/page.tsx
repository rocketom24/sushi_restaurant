// app/dashboard/coupons/new/page.tsx

import CouponForm from "@/components/dashboard/CouponForm";
import { createCouponAction } from "@/lib/actions/coupon.actions";

export default function NewCouponPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">New Coupon</h1>
      <CouponForm action={createCouponAction} />
    </div>
  );
}
