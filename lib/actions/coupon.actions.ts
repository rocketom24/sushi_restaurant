// lib/actions/coupon.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireOwner } from "@/lib/guards";
import { validateCoupon, formatDiscountLabel } from "@/lib/loyalty/coupons";
import { couponSchema, type CouponFormState } from "@/lib/validations/coupon";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ============ CUSTOMER — checkout preview ============

/**
 * Validates a coupon code against the given subtotal and returns the
 * discount preview for the checkout UI. The authoritative validation
 * still runs server-side inside createOrderAction.
 */
export async function previewCouponAction(code: string, subtotal: number) {
  const user = await requireAuth();

  const result = await validateCoupon(prisma, {
    code,
    subtotal,
    userId: user.id,
  });

  if (!result.valid) {
    return { valid: false as const, error: result.error };
  }

  return {
    valid: true as const,
    code: result.coupon.code,
    discount: result.discount,
    label: formatDiscountLabel(result.coupon.type, result.coupon.value),
  };
}

// ============ OWNER — CRUD ============

export async function getCouponsForDashboard() {
  await requireOwner();

  const coupons = await prisma.coupon.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return coupons.map((c) => ({
    id: c.id,
    code: c.code,
    description: c.description,
    type: c.type,
    value: Number(c.value),
    minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
    maxUsageCount: c.maxUsageCount,
    maxUsagePerUser: c.maxUsagePerUser,
    usageCount: c.usageCount,
    isActive: c.isActive,
    startsAt: c.startsAt,
    endsAt: c.endsAt,
  }));
}

export async function getCouponById(couponId: string) {
  await requireOwner();

  const c = await prisma.coupon.findUnique({
    where: { id: couponId, deletedAt: null },
  });
  if (!c) return null;

  return {
    id: c.id,
    code: c.code,
    description: c.description,
    type: c.type,
    value: Number(c.value),
    minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
    maxUsageCount: c.maxUsageCount,
    maxUsagePerUser: c.maxUsagePerUser,
    isActive: c.isActive,
    startsAt: c.startsAt,
    endsAt: c.endsAt,
  };
}

function parseCouponForm(formData: FormData) {
  return couponSchema.safeParse({
    code: formData.get("code"),
    description: formData.get("description") ?? "",
    type: formData.get("type"),
    value: formData.get("value"),
    minOrderAmount: formData.get("minOrderAmount"),
    maxUsageCount: formData.get("maxUsageCount"),
    maxUsagePerUser: formData.get("maxUsagePerUser"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    isActive: formData.get("isActive") === "on",
  });
}

export async function createCouponAction(
  _prevState: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = parseCouponForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;

  // Enforce code uniqueness among active (non-deleted) coupons.
  const existing = await prisma.coupon.findFirst({
    where: { code: data.code, deletedAt: null },
  });
  if (existing) {
    return { errors: { code: ["A coupon with this code already exists."] } };
  }

  await prisma.coupon.create({
    data: {
      code: data.code,
      description: data.description || null,
      type: data.type,
      value: data.value,
      minOrderAmount: data.minOrderAmount ?? null,
      maxUsageCount: data.maxUsageCount ?? null,
      maxUsagePerUser: data.maxUsagePerUser ?? null,
      startsAt: data.startsAt ?? null,
      endsAt: data.endsAt ?? null,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath("/dashboard/coupons");
  redirect("/dashboard/coupons");
}

export async function updateCouponAction(
  couponId: string,
  _prevState: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = parseCouponForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;

  const existing = await prisma.coupon.findFirst({
    where: { code: data.code, deletedAt: null, NOT: { id: couponId } },
  });
  if (existing) {
    return { errors: { code: ["A coupon with this code already exists."] } };
  }

  await prisma.coupon.update({
    where: { id: couponId },
    data: {
      code: data.code,
      description: data.description || null,
      type: data.type,
      value: data.value,
      minOrderAmount: data.minOrderAmount ?? null,
      maxUsageCount: data.maxUsageCount ?? null,
      maxUsagePerUser: data.maxUsagePerUser ?? null,
      startsAt: data.startsAt ?? null,
      endsAt: data.endsAt ?? null,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath("/dashboard/coupons");
  redirect("/dashboard/coupons");
}

export async function toggleCouponAction(couponId: string) {
  await requireOwner();

  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId, deletedAt: null },
  });
  if (!coupon) return { error: "Coupon not found." };

  await prisma.coupon.update({
    where: { id: couponId },
    data: { isActive: !coupon.isActive },
  });

  revalidatePath("/dashboard/coupons");
  return { success: true };
}

export async function deleteCouponAction(couponId: string) {
  await requireOwner();

  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId, deletedAt: null },
  });
  if (!coupon) return { error: "Coupon not found." };

  await prisma.coupon.update({
    where: { id: couponId },
    data: { deletedAt: new Date(), isActive: false },
  });

  revalidatePath("/dashboard/coupons");
  return { success: true };
}
