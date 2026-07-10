// app/dashboard/categories/new/page.tsx

import CategoryForm from "@/components/categories/CategoryForm";
import { createCategoryAction, getActiveCategoriesForSelect } from "@/lib/actions/category.actions";

export default async function NewCategoryPage() {
  const categoryOptions = await getActiveCategoriesForSelect();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">New Category</h1>
      <CategoryForm action={createCategoryAction} categoryOptions={categoryOptions} />
    </div>
  );
}