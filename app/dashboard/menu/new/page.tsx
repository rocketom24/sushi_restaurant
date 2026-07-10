// app/dashboard/menu/new/page.tsx

import MenuItemForm from "@/components/menu/MenuItemForm";
import { createMenuItemAction } from "@/lib/actions/menu-item.actions";
import { getActiveCategoriesForSelect } from "@/lib/actions/category.actions";

export default async function NewMenuItemPage() {
  const categoryOptions = await getActiveCategoriesForSelect();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">New Menu Item</h1>
      <MenuItemForm action={createMenuItemAction} categoryOptions={categoryOptions} />
    </div>
  );
}