// components/dashboard/CouponForm.tsx
"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { CouponFormState } from "@/lib/validations/coupon";
import type { DiscountType } from "@/app/generated/prisma/client";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  type: DiscountType;
  value: number;
  minOrderAmount: number | null;
  maxUsageCount: number | null;
  maxUsagePerUser: number | null;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
};

function toDateInputValue(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default function CouponForm({
  action,
  coupon,
}: {
  action: (state: CouponFormState, formData: FormData) => Promise<CouponFormState>;
  coupon?: Coupon;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      {state.errors?._form && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.errors._form[0]}
        </div>
      )}

      <div>
        <label htmlFor="code" className="block text-sm font-medium mb-1">
          Code
        </label>
        <input
          id="code"
          name="code"
          defaultValue={coupon?.code}
          placeholder="WELCOME10"
          className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono uppercase"
        />
        {state.errors?.code && (
          <p className="mt-1 text-sm text-red-600">{state.errors.code[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={coupon?.description ?? ""}
          rows={2}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={coupon?.type ?? "PERCENTAGE"}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED_AMOUNT">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label htmlFor="value" className="block text-sm font-medium mb-1">
            Value
          </label>
          <input
            id="value"
            name="value"
            type="number"
            step="0.01"
            min="0"
            defaultValue={coupon?.value}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {state.errors?.value && (
            <p className="mt-1 text-sm text-red-600">{state.errors.value[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="minOrderAmount" className="block text-sm font-medium mb-1">
          Minimum Order Amount (optional)
        </label>
        <input
          id="minOrderAmount"
          name="minOrderAmount"
          type="number"
          step="0.01"
          min="0"
          defaultValue={coupon?.minOrderAmount ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="maxUsageCount" className="block text-sm font-medium mb-1">
            Total Usage Limit (optional)
          </label>
          <input
            id="maxUsageCount"
            name="maxUsageCount"
            type="number"
            min="1"
            defaultValue={coupon?.maxUsageCount ?? ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="maxUsagePerUser" className="block text-sm font-medium mb-1">
            Per-Customer Limit (optional)
          </label>
          <input
            id="maxUsagePerUser"
            name="maxUsagePerUser"
            type="number"
            min="1"
            defaultValue={coupon?.maxUsagePerUser ?? ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startsAt" className="block text-sm font-medium mb-1">
            Start Date (optional)
          </label>
          <input
            id="startsAt"
            name="startsAt"
            type="date"
            defaultValue={toDateInputValue(coupon?.startsAt ?? null)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="endsAt" className="block text-sm font-medium mb-1">
            End Date (optional)
          </label>
          <input
            id="endsAt"
            name="endsAt"
            type="date"
            defaultValue={toDateInputValue(coupon?.endsAt ?? null)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {state.errors?.endsAt && (
            <p className="mt-1 text-sm text-red-600">{state.errors.endsAt[0]}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={coupon?.isActive ?? true}
          className="rounded"
        />
        <label htmlFor="isActive" className="text-sm font-medium">
          Active
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-neutral-900 text-white px-6 py-2.5 font-medium hover:bg-neutral-800 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <Link
          href="/dashboard/coupons"
          className="rounded-md border border-gray-300 px-6 py-2.5 font-medium hover:bg-gray-50 inline-flex items-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
