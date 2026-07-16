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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();

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
        className="w-full rounded-md bg-orange-600 py-3 font-medium text-white hover:bg-orange-500 disabled:opacity-50 transition-colors"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function CheckoutPaymentPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");
  const clientSecret = searchParams.get("clientSecret");

  if (!orderId || !clientSecret) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <p className="text-center text-gray-500">
          Invalid payment session.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 font-serif text-3xl text-white">
        Complete Payment
      </h1>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "night",
            variables: {
              colorPrimary: "#ea580c",
              colorBackground: "#171717",
              colorText: "#e7e5e4",
            },
          },
        }}
      >
        <PaymentForm orderId={orderId} />
      </Elements>
    </div>
  );
}