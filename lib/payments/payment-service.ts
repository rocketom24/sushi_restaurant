// lib/payments/payment-service.ts

import type { PaymentMethod } from "@/app/generated/prisma/client";
import * as cashProvider from "@/lib/payments/cash";
import * as stripeProvider from "@/lib/payments/stripe";
import * as satispayProvider from "@/lib/payments/satispay";
import * as edenredProvider from "@/lib/payments/edenred";

export type InitiatePaymentInput = {
  orderId: string;
  amount: number;
  method: PaymentMethod;
};

export type InitiatePaymentResult =
  | { success: true; paymentId: string; redirectUrl?: string; clientSecret?: string }
  | { success: false; error: string };

/**
 * Single entry point for starting a payment, regardless of method.
 * Checkout logic never calls a specific provider directly — this is
 * the delegation layer the doc requires, so adding a new provider
 * later means adding one case here, not touching checkout code.
 */
export async function initiatePayment(
  input: InitiatePaymentInput
): Promise<InitiatePaymentResult> {
  switch (input.method) {
    case "CASH":
      return cashProvider.initiate(input);
    case "CARD":
      return stripeProvider.initiate(input);
    case "SATISPAY":
      return satispayProvider.initiate(input);
    case "TICKET_RESTAURANT_EDENRED":
      return edenredProvider.initiate(input);
    default:
      return { success: false, error: "Unsupported payment method." };
  }
}