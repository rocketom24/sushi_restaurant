// components/checkout/PaymentMethodSelector.tsx
"use client";

import type { PaymentMethod } from "@/app/generated/prisma/client";

const METHODS: { value: PaymentMethod; label: string; note?: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
  { value: "SATISPAY", label: "Satispay", note: "Coming soon" },
  { value: "TICKET_RESTAURANT_EDENRED", label: "Ticket Restaurant Edenred", note: "Coming soon" },
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
      <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
      <div className="space-y-2">
        {METHODS.map((m) => (
          <label
            key={m.value}
            className={`flex items-center justify-between rounded-md border px-3 py-2.5 cursor-pointer transition-colors ${
              value === m.value
                ? "border-orange-500 bg-orange-500/10"
                : "border-white/15 hover:border-white/30"
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                checked={value === m.value}
                onChange={() => onChange(m.value)}
                className="accent-orange-500"
              />
              <span className="text-sm text-neutral-200">{m.label}</span>
            </span>
            {m.note && <span className="text-xs text-gray-500">{m.note}</span>}
          </label>
        ))}
      </div>
    </div>
  );
}