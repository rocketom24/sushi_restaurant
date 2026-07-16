import { requireAuthPage } from "@/lib/guards";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default async function CheckoutPage() {
  await requireAuthPage(); // guest checkout deferred — see Module 6 doc's own "(future)" note

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}