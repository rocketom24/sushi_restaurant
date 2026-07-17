// components/dashboard/RewardForm.tsx
"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { RewardFormState } from "@/lib/validations/reward";

type Reward = {
  id: string;
  name: string;
  description: string | null;
  pointsCost: number;
  isActive: boolean;
};

export default function RewardForm({
  action,
  reward,
}: {
  action: (state: RewardFormState, formData: FormData) => Promise<RewardFormState>;
  reward?: Reward;
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
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={reward?.name}
          placeholder="Free Dessert"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={reward?.description ?? ""}
          rows={2}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="pointsCost" className="block text-sm font-medium mb-1">
          Points Cost
        </label>
        <input
          id="pointsCost"
          name="pointsCost"
          type="number"
          min="1"
          defaultValue={reward?.pointsCost}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.pointsCost && (
          <p className="mt-1 text-sm text-red-600">{state.errors.pointsCost[0]}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={reward?.isActive ?? true}
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
          href="/dashboard/rewards"
          className="rounded-md border border-gray-300 px-6 py-2.5 font-medium hover:bg-gray-50 inline-flex items-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
