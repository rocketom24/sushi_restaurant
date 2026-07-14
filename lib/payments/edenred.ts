// lib/payments/edenred.ts

import { prisma } from "@/lib/prisma";
import type { InitiatePaymentInput, InitiatePaymentResult } from "./payment-service";

/**
 * ⚠️ NOT PRODUCTION READY — STUB ONLY
 *
 * Real Edenred (Ticket Restaurant) integration requires a merchant
 * agreement directly with Edenred Italy and their API credentials.
 * This is a business-side integration, not something available via
 * a public SDK — the client needs to contact Edenred directly.
 *
 * Same pattern as satispay.ts: structurally present, clearly
 * non-functional until real credentials exist.
 */
export async function initiate(
  input: InitiatePaymentInput
): Promise<InitiatePaymentResult> {
  console.warn("[Edenred] Using STUB implementation — no real charge occurs.");

  await prisma.payment.create({
    data: {
      orderId: input.orderId,
      method: "TICKET_RESTAURANT_EDENRED",
      gateway: "EDENRED",
      status: "PENDING",
      amount: input.amount,
      notes: "STUB: Edenred integration not yet implemented.",
    },
  });

  return {
    success: false,
    error: "Edenred payments are not yet available. Please choose Cash or Card.",
  };
}