// components/menu/MenuItemTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteMenuItemButton from "./DeleteMenuItemButton";

type MenuItemRow = {
  id: string;
  name: string;
  price: unknown; // Prisma Decimal — displayed as string
  discountPrice: unknown; // Prisma Decimal | null
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  category: { name: string };
};

export default function MenuItemTable({ items }: { items: MenuItemRow[] }) {
  const [search, setSearch] = useState("");

  if (items.length === 0) {
    return <p className="text-gray-500 text-center py-12">No menu items available.</p>;
  }

  const filteredItems = [...items]
    .filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="p-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm w-64"
        />
      </div>
      {filteredItems.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No menu items match your search.</p>
      ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-100" />
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4 text-gray-600">{item.category.name}</td>
                  <td className="py-3 px-4">
                    {item.discountPrice !== null && item.discountPrice !== undefined ? (
                      <span className="flex items-center gap-2">
                        <span className="text-gray-400 line-through text-xs">
                          €{Number(item.price).toFixed(2)}
                        </span>
                        <span className="text-red-600 font-medium">
                          €{Number(item.discountPrice).toFixed(2)}
                        </span>
                      </span>
                    ) : (
                      <>€{Number(item.price).toFixed(2)}</>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="py-3 px-4">{item.isFeatured ? "⭐" : "—"}</td>
                  <td className="py-3 px-4 space-x-3">
                    <Link
                      href={`/dashboard/menu/${item.id}/edit`}
                      className="text-sm text-neutral-900 underline"
                    >
                      Edit
                    </Link>
                    <DeleteMenuItemButton menuItemId={item.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      )}
    </div>
  );
}