// app/dashboard/menu/page.tsx

import Link from "next/link";
import { getMenuItemsForDashboard } from "@/lib/actions/menu-item.actions";
import MenuItemTable from "@/components/menu/MenuItemTable";

export default async function MenuDashboardPage() {
  const items = await getMenuItemsForDashboard();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Menu Items</h1>
        <Link
          href="/dashboard/menu/new"
          className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800"
        >
          + New Item
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <MenuItemTable items={items} />
      </div>
    </div>
  );
}