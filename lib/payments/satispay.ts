// lib/payments/satispay.ts

import { prisma } from "@/lib/prisma";
import type { InitiatePaymentInput, InitiatePaymentResult } from "./payment-service";

/**
 * ⚠️ NOT PRODUCTION READY — STUB ONLY
 *
 * Real Satispay integration requires:
 * 1. A Satispay Business merchant account (signup at business.satispay.com)
 * 2. API credentials (key_id + private key, RSA-signed requests)
 * 3. Their official Node SDK or documented REST API
 *
 * This stub creates a PENDING payment record so the rest of the
 * system (order flow, dashboard) functions structurally, but does
 * NOT actually redirect to or charge Satispay. Replace this file's
 * body once real credentials are available — the initiate() function
 * signature is designed to match Stripe's, so no other code needs
 * to change when you implement it for real.
 */
export async function initiate(
  input: InitiatePaymentInput
): Promise<InitiatePaymentResult> {
  console.warn("[Satispay] Using STUB implementation — no real charge occurs.");

  const payment = await prisma.payment.create({
    data: {
      orderId: input.orderId,
      method: "SATISPAY",
      gateway: "SATISPAY",
      status: "PENDING",
      amount: input.amount,
      notes: "STUB: Satispay integration not yet implemented.",
    },
  });

  return {
    success: false,
    error: "Satispay payments are not yet available. Please choose Cash or Card.",
  };
}