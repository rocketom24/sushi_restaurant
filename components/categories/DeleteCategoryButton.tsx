// components/categories/DeleteCategoryButton.tsx
"use client";

import { useTransition } from "react";
import { deleteCategoryAction } from "@/lib/actions/category.actions";
import { useRouter } from "next/navigation";

export default function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this category? This cannot be undone.")) return;

    startTransition(async () => {
      const result = await deleteCategoryAction(categoryId);
      if (result?.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}