// lib/payments/stripe.ts

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import type { InitiatePaymentInput, InitiatePaymentResult } from "./payment-service";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

/**
 * Creates a Stripe PaymentIntent and a PENDING Payment record.
 * The order does NOT get confirmed here — only the webhook (after
 * Stripe verifies the charge actually succeeded) is allowed to do
 * that. This matches the doc's explicit security rule: never mark
 * an online payment successful just because the browser returned.
 */
export async function initiate(
  input: InitiatePaymentInput
): Promise<InitiatePaymentResult> {
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(input.amount * 100), // Stripe uses smallest currency unit (cents)
      currency: "eur",
      metadata: { orderId: input.orderId },
      automatic_payment_methods: { enabled: true },
    });

    const payment = await prisma.payment.create({
      data: {
        orderId: input.orderId,
        method: "CARD",
        gateway: "STRIPE",
        status: "PENDING",
        amount: input.amount,
        transactionId: intent.id,
      },
    });

    return {
      success: true,
      paymentId: payment.id,
      clientSecret: intent.client_secret ?? undefined,
    };
  } catch (err) {
    console.error("Stripe payment intent creation failed:", err);
    return { success: false, error: "Could not start card payment. Please try again." };
  }
}

function mapStripeCardBrand(brand: string | undefined): "VISA" | "MASTERCARD" | "AMERICAN_EXPRESS" | null {
  switch (brand) {
    case "visa":
      return "VISA";
    case "mastercard":
      return "MASTERCARD";
    case "amex":
      return "AMERICAN_EXPRESS";
    default:
      return null;
  }
}

/**
 * Called ONLY from the verified webhook handler — never from the
 * client, never from a redirect callback. This is the sole place
 * that marks a Stripe payment PAID.
 */
export async function handlePaymentSucceeded(intent: Stripe.PaymentIntent) {
  const paymentMethod = intent.payment_method as string | null;
  let cardBrand: "VISA" | "MASTERCARD" | "AMERICAN_EXPRESS" | null = null;

  if (paymentMethod) {
    try {
      const pm = await stripe.paymentMethods.retrieve(paymentMethod);
      cardBrand = mapStripeCardBrand(pm.card?.brand);
    } catch (err) {
      console.error("Failed to retrieve payment method brand:", err);
    }
  }

  const payment = await prisma.payment.findFirst({
    where: { transactionId: intent.id },
  });

  if (!payment) {
    console.error("Webhook received for unknown payment intent:", intent.id);
    return;
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        cardBrand,
        paidAt: new Date(),
        gatewayReference: intent.latest_charge as string | undefined,
      },
    }),
    prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "CONFIRMED" },
    }),
  ]);
}

export async function handlePaymentFailed(intent: Stripe.PaymentIntent) {
  const payment = await prisma.payment.findFirst({
    where: { transactionId: intent.id },
  });

  if (!payment) return;

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "FAILED",
      failureReason: intent.last_payment_error?.message ?? "Payment failed.",
    },
  });
}

export async function refund(paymentId: string, amount?: number) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

  if (!payment || !payment.transactionId) {
    return { success: false, error: "Payment not found or has no transaction." };
  }

  try {
    const refundAmount = amount ?? Number(payment.amount);

    await stripe.refunds.create({
      payment_intent: payment.transactionId,
      amount: Math.round(refundAmount * 100),
    });

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "REFUNDED",
        refundedAt: new Date(),
        refundAmount,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Stripe refund failed:", err);
    return { success: false, error: "Refund failed. Please try again." };
  }
}