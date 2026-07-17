// components/checkout/PaymentMethodSelector.tsx
"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import type { PaymentMethod } from "@/app/generated/prisma/client";

export default function PaymentMethodSelector({
  value,
  onChange,
  enabledMethods,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  enabledMethods?: Record<PaymentMethod, boolean>;
}) {
  const { dict } = useI18n();

  const allMethods: { value: PaymentMethod; label: string; note?: string }[] = [
    { value: "CASH", label: dict.checkout.cash },
    { value: "CARD", label: dict.checkout.card },
    { value: "SATISPAY", label: "Satispay", note: dict.checkout.comingSoon },
    {
      value: "TICKET_RESTAURANT_EDENRED",
      label: "Ticket Restaurant Edenred",
      note: dict.checkout.comingSoon,
    },
  ];

  const methods = enabledMethods
    ? allMethods.filter((m) => enabledMethods[m.value])
    : allMethods;

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        {dict.checkout.paymentMethod}
      </label>
      <div className="space-y-2">
        {methods.map((m) => (
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
