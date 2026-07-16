// components/checkout/PaymentMethodSelector.tsx
"use client";

import type { PaymentMethod } from "@/app/generated/prisma/client";

const METHODS: { value: PaymentMethod; label: string; note?: string }[] = [
  { value: "CASH", label: "Contanti" },
  { value: "CARD", label: "Carta" },
  { value: "SATISPAY", label: "Satispay", note: "Prossimamente" },
  { value: "TICKET_RESTAURANT_EDENRED", label: "Ticket Restaurant Edenred", note: "Prossimamente" },
];

export default function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Metodo di Pagamento
      </label>
      <div className="space-y-2">
        {METHODS.map((m) => (
          <label
            key={m.value}
            className={`flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer transition-all duration-300 ${
              value === m.value
                ? "border-accent bg-accent/10"
                : "border-white/10 bg-white/2 hover:border-white/25"
            }`}
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={value === m.value}
                onChange={() => onChange(m.value)}
                className="accent-[#E05A47]"
              />
              <span className="text-sm text-cream font-light">{m.label}</span>
            </span>
            {m.note && (
              <span className="text-[10px] uppercase tracking-wider text-gray-500">
                {m.note}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
