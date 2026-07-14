// lib/payments/cash.ts

import { prisma } from "@/lib/prisma";
import type { InitiatePaymentInput, InitiatePaymentResult } from "./payment-service";

/**
 * Cash has no gateway. Payment record is created immediately in
 * PENDING status — order can proceed to CONFIRMED per the doc's
 * "cash orders can be confirmed immediately" rule, and the owner
 * later marks it PAID manually when cash is physically received.
 */
export async function initiate(
  input: InitiatePaymentInput
): Promise<InitiatePaymentResult> {
  const payment = await prisma.payment.create({
    data: {
      orderId: input.orderId,
      method: "CASH",
      gateway: "NONE",
      status: "PENDING",
      amount: input.amount,
    },
  });

  return { success: true, paymentId: payment.id };
}