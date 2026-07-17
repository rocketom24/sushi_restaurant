// lib/loyalty/coupons.ts
//
// Coupon validation and discount calculation. Pure-ish helpers plus a
// DB-backed validator. All validation is server-side; the checkout flow
// never trusts a client-supplied discount.

import type { Prisma, PrismaClient } from "@/app/generated/prisma/client";
import type { Coupon, DiscountType } from "@/app/generated/prisma/client";

type Tx = Prisma.TransactionClient | PrismaClient;

export type CouponValidationOk = {
  valid: true;
  coupon: {
    id: string;
    code: string;
    type: DiscountType;
    value: number;
  };
  discount: number;
};

export type CouponValidationError = {
  valid: false;
  error: string;
};

export type CouponValidationResult = CouponValidationOk | CouponValidationError;

/**
 * Discount a coupon produces against a given subtotal. Percentage is
 * proportional; fixed amount never exceeds the subtotal (no negative
 * totals). Rounded to cents.
 */
export function calculateCouponDiscount(
  type: DiscountType,
  value: number,
  subtotal: number
): number {
  let discount: number;
  if (type === "PERCENTAGE") {
    discount = (subtotal * value) / 100;
  } else {
    discount = value;
  }
  discount = Math.min(discount, subtotal);
  return Math.max(0, Math.round(discount * 100) / 100);
}

/**
 * Validates a coupon code for a given subtotal and (optional) user.
 * Checks: existence, active flag, date window, total usage cap,
 * per-user usage cap, and minimum order amount. Returns the computed
 * discount when valid.
 */
export async function validateCoupon(
  tx: Tx,
  params: { code: string; subtotal: number; userId?: string | null }
): Promise<CouponValidationResult> {
  const code = params.code.trim().toUpperCase();
  if (!code) return { valid: false, error: "Enter a coupon code." };

  const coupon: Coupon | null = await tx.coupon.findFirst({
    where: { code, deletedAt: null },
  });

  if (!coupon || !coupon.isActive) {
    return { valid: false, error: "This coupon code is not valid." };
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    return { valid: false, error: "This coupon is not active yet." };
  }
  if (coupon.endsAt && coupon.endsAt < now) {
    return { valid: false, error: "This coupon has expired." };
  }

  if (coupon.maxUsageCount !== null && coupon.usageCount >= coupon.maxUsageCount) {
    return { valid: false, error: "This coupon has reached its usage limit." };
  }

  const minOrder = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
  if (minOrder > 0 && params.subtotal < minOrder) {
    return {
      valid: false,
      error: `This coupon requires a minimum order of €${minOrder.toFixed(2)}.`,
    };
  }

  if (params.userId && coupon.maxUsagePerUser !== null) {
    const used = await tx.couponRedemption.count({
      where: { couponId: coupon.id, userId: params.userId },
    });
    if (used >= coupon.maxUsagePerUser) {
      return {
        valid: false,
        error: "You have already used this coupon the maximum number of times.",
      };
    }
  }

  const value = Number(coupon.value);
  const discount = calculateCouponDiscount(coupon.type, value, params.subtotal);

  if (discount <= 0) {
    return { valid: false, error: "This coupon has no effect on your order." };
  }

  return {
    valid: true,
    coupon: { id: coupon.id, code: coupon.code, type: coupon.type, value },
    discount,
  };
}

export function formatDiscountLabel(type: DiscountType, value: number): string {
  return type === "PERCENTAGE" ? `-${value}%` : `-€${value.toFixed(2)}`;
}
