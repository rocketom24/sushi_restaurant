// components/menu/MenuItemForm.tsx
"use client";

import { useActionState } from "react";
import type { MenuItemFormState } from "@/lib/validations/menu-item";
import ImageUploadField from "@/components/dashboard/ImageUploadField";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  price: number;
  imageUrl: string | null;
  preparationTime: number | null;
  calories: number | null;
  spiceLevel: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

type CategoryOption = { id: string; name: string };

export default function MenuItemForm({
  action,
  item,
  categoryOptions,
}: {
  action: (state: MenuItemFormState, formData: FormData) => Promise<MenuItemFormState>;
  item?: MenuItem;
  categoryOptions: CategoryOption[];
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
        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
        <input id="name" name="name" defaultValue={item?.name} className="w-full rounded-md border border-gray-300 px-3 py-2" />
        {state.errors?.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium mb-1">Category</label>
        <select id="categoryId" name="categoryId" defaultValue={item?.categoryId ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-2">
          <option value="">Select a category</option>
          {categoryOptions.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {state.errors?.categoryId && <p className="mt-1 text-sm text-red-600">{state.errors.categoryId[0]}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <textarea id="description" name="description" defaultValue={item?.description ?? ""} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2" />
        {state.errors?.description && <p className="mt-1 text-sm text-red-600">{state.errors.description[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">Price (€)</label>
          <input id="price" name="price" type="number" step="0.01" defaultValue={item?.price ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          {state.errors?.price && <p className="mt-1 text-sm text-red-600">{state.errors.price[0]}</p>}
        </div>
        <div>
          <label htmlFor="preparationTime" className="block text-sm font-medium mb-1">Prep Time (min)</label>
          <input id="preparationTime" name="preparationTime" type="number" defaultValue={item?.preparationTime ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
      </div>

      <div>
        <ImageUploadField name="imageUrl" folder="menu" defaultValue={item?.imageUrl} label="Photo" />
        {state.errors?.imageUrl && <p className="mt-1 text-sm text-red-600">{state.errors.imageUrl[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="calories" className="block text-sm font-medium mb-1">Calories</label>
          <input id="calories" name="calories" type="number" defaultValue={item?.calories ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label htmlFor="spiceLevel" className="block text-sm font-medium mb-1">Spice Level</label>
          <select id="spiceLevel" name="spiceLevel" defaultValue={item?.spiceLevel ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="">None</option>
            <option value="MILD">Mild</option>
            <option value="MEDIUM">Medium</option>
            <option value="HOT">Hot</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="sortOrder" className="block text-sm font-medium mb-1">Display Order</label>
        <input id="sortOrder" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} className="w-full rounded-md border border-gray-300 px-3 py-2" />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <input id="isAvailable" name="isAvailable" type="checkbox" defaultChecked={item?.isAvailable ?? true} className="rounded" />
          <label htmlFor="isAvailable" className="text-sm font-medium">Available</label>
        </div>
        <div className="flex items-center gap-2">
          <input id="isFeatured" name="isFeatured" type="checkbox" defaultChecked={item?.isFeatured ?? false} className="rounded" />
          <label htmlFor="isFeatured" className="text-sm font-medium">Featured</label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending} className="rounded-md bg-neutral-900 text-white px-6 py-2.5 font-medium hover:bg-neutral-800 disabled:opacity-50">
          {isPending ? "Saving..." : "Save"}
        </button>
        <a href="/dashboard/menu" className="rounded-md border border-gray-300 px-6 py-2.5 font-medium hover:bg-gray-50">
          Cancel
        </a>
      </div>
    </form>
  );
}