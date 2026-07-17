// app/dashboard/coupons/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import CouponForm from "@/components/dashboard/CouponForm";
import { getCouponById, updateCouponAction } from "@/lib/actions/coupon.actions";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coupon = await getCouponById(id);

  if (!coupon) notFound();

  const updateWithId = updateCouponAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Edit Coupon</h1>
      <CouponForm action={updateWithId} coupon={coupon} />
    </div>
  );
}
