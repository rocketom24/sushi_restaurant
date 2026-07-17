// components/settings/RestaurantForm.tsx
"use client";

import { useActionState } from "react";
import { updateRestaurantInfoAction } from "@/lib/actions/settings.actions";

type Settings = {
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  vatNumber: string | null;
  taxId: string | null;
};

export default function RestaurantForm({ settings }: { settings: Settings }) {
  const [state, formAction, isPending] = useActionState(updateRestaurantInfoAction, {});

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      {state.errors?._form && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.errors._form[0]}
        </div>
      )}
      {state.success && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Saved.
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Restaurant Name</label>
        <input
          id="name"
          name="name"
          defaultValue={settings.name}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={settings.description ?? ""}
          rows={2}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
          <input
            id="phone"
            name="phone"
            defaultValue={settings.phone ?? ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {state.errors?.phone && <p className="mt-1 text-sm text-red-600">{state.errors.phone[0]}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={settings.email ?? ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {state.errors?.email && <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium mb-1">Website</label>
        <input
          id="website"
          name="website"
          defaultValue={settings.website ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
        <input
          id="address"
          name="address"
          defaultValue={settings.address ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="vatNumber" className="block text-sm font-medium mb-1">VAT Number</label>
          <input
            id="vatNumber"
            name="vatNumber"
            defaultValue={settings.vatNumber ?? ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="taxId" className="block text-sm font-medium mb-1">Tax ID</label>
          <input
            id="taxId"
            name="taxId"
            defaultValue={settings.taxId ?? ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-neutral-900 text-white px-6 py-2.5 font-medium hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
