// app/dashboard/categories/page.tsx

import Link from "next/link";
import { getCategoriesForDashboard } from "@/lib/actions/category.actions";
import CategoryTable from "@/components/categories/CategoryTable";

export default async function CategoriesPage() {
  const categories = await getCategoriesForDashboard();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Categories</h1>
        <Link
          href="/dashboard/categories/new"
          className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800"
        >
          + New Category
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <CategoryTable categories={categories} />
      </div>
    </div>
  );
}