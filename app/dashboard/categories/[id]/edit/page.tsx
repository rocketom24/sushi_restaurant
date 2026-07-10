// app/dashboard/categories/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import CategoryForm from "@/components/categories/CategoryForm";
import {
  getCategoryById,
  getActiveCategoriesForSelect,
  updateCategoryAction,
} from "@/lib/actions/category.actions";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, categoryOptions] = await Promise.all([
    getCategoryById(id),
    getActiveCategoriesForSelect(),
  ]);

  if (!category) notFound();

  const updateWithId = updateCategoryAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Edit Category</h1>
      <CategoryForm
        action={updateWithId}
        category={category}
        categoryOptions={categoryOptions}
      />
    </div>
  );
}