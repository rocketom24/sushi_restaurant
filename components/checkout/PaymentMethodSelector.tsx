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
      <label className="block text-sm font-medium mb-2">Payment Method</label>
      <div className="space-y-2">
        {METHODS.map((m) => (
          <label
            key={m.value}
            className={`flex items-center justify-between rounded-md border px-3 py-2.5 cursor-pointer ${
              value === m.value ? "border-neutral-900 bg-neutral-50" : "border-gray-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                checked={value === m.value}
                onChange={() => onChange(m.value)}
              />
              <span className="text-sm">{m.label}</span>
            </span>
            {m.note && <span className="text-xs text-gray-400">{m.note}</span>}
          </label>
        ))}
      </div>
    </div>
  );
}