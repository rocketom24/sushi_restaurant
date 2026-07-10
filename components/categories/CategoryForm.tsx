// components/categories/CategoryForm.tsx
"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { slugify } from "@/lib/utils/slug";
import type { CategoryFormState } from "@/lib/validations/category";

type Category = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  parentId: string | null;
};

type CategoryOption = { id: string; name: string };

export default function CategoryForm({
  action,
  category,
  categoryOptions,
}: {
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  category?: Category;
  categoryOptions: CategoryOption[];
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);

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
          defaultValue={category?.name}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-1">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm"
        />
        {state.errors?.slug && (
          <p className="mt-1 text-sm text-red-600">{state.errors.slug[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={category?.description ?? ""}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.description && (
          <p className="mt-1 text-sm text-red-600">{state.errors.description[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          defaultValue={category?.imageUrl ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{state.errors.imageUrl[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="parentId" className="block text-sm font-medium mb-1">
          Parent Category (optional)
        </label>
        <select
          id="parentId"
          name="parentId"
          defaultValue={category?.parentId ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">None</option>
          {categoryOptions
            .filter((c) => c.id !== category?.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label htmlFor="sortOrder" className="block text-sm font-medium mb-1">
          Display Order
        </label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={category?.sortOrder ?? 0}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {state.errors?.sortOrder && (
          <p className="mt-1 text-sm text-red-600">{state.errors.sortOrder[0]}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={category?.isActive ?? true}
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
          href="/dashboard/categories"
          className="rounded-md border border-gray-300 px-6 py-2.5 font-medium hover:bg-gray-50 inline-flex items-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}