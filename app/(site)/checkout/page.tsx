import { requireAuthPage } from "@/lib/guards";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default async function CheckoutPage() {
  await requireAuthPage(); // guest checkout deferred — see Module 6 doc's own "(future)" note

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-white mb-8">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}