"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useI18n } from "@/components/i18n/I18nProvider";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { dict } = useI18n();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${orderId}`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setIsProcessing(false);
    }

    // On success Stripe automatically redirects to return_url.
    // Payment status is updated by the webhook, NOT here.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-accent hover:bg-white hover:text-night text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest disabled:opacity-50 transition-all duration-300"
      >
        {isProcessing ? dict.payment.processing : dict.payment.payNow}
      </button>
    </form>
  );
}

export default function CheckoutPaymentPage() {
  const searchParams = useSearchParams();
  const { dict } = useI18n();

  const orderId = searchParams.get("orderId");
  const clientSecret = searchParams.get("clientSecret");

  if (!orderId || !clientSecret) {
    return (
      <div className="mx-auto max-w-md px-6 py-20">
        <p className="text-center text-gray-400 font-light">
          {dict.payment.invalid}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <span className="text-accent text-xs font-semibold uppercase tracking-widest">
        {dict.payment.eyebrow}
      </span>
      <h1 className="mt-2 mb-8 font-serif text-3xl md:text-4xl text-cream">
        {dict.payment.title}
      </h1>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "night",
            variables: {
              colorPrimary: "#E05A47",
              colorBackground: "#0F1115",
              colorText: "#EAE6E1",
              borderRadius: "10px",
            },
          },
        }}
      >
        <PaymentForm orderId={orderId} />
      </Elements>
    </div>
  );
}