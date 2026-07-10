// components/categories/CategoryTable.tsx

import Link from "next/link";
import DeleteCategoryButton from "./DeleteCategoryButton";

type CategoryRow = {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
  _count: { menuItems: number };
};

export default function CategoryTable({ categories }: { categories: CategoryRow[] }) {
  if (categories.length === 0) {
    return (
      <p className="text-gray-500 text-center py-12">No categories available.</p>
    );
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
          <th className="py-3 px-4">Name</th>
          <th className="py-3 px-4">Items</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Order</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat) => (
          <tr key={cat.id} className="border-b border-gray-100">
            <td className="py-3 px-4 font-medium">{cat.name}</td>
            <td className="py-3 px-4 text-gray-600">{cat._count.menuItems}</td>
            <td className="py-3 px-4">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  cat.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {cat.isActive ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="py-3 px-4 text-gray-600">{cat.sortOrder}</td>
            <td className="py-3 px-4 space-x-3">
              <Link
                href={`/dashboard/categories/${cat.id}/edit`}
                className="text-sm text-neutral-900 underline"
              >
                Edit
              </Link>
              <DeleteCategoryButton categoryId={cat.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}