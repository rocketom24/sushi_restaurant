import { requireAuthPage } from "@/lib/guards";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default async function CheckoutPage() {
  await requireAuthPage(); // guest checkout deferred — see Module 6 doc's own "(future)" note

  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <span className="text-accent text-xs font-semibold uppercase tracking-widest">
        {"// Ultimo Passo"}
      </span>
      <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2 mb-10">Cassa</h1>
      <CheckoutForm />
    </div>
  );
}