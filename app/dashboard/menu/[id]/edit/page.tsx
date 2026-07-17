// app/dashboard/menu/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import MenuItemForm from "@/components/menu/MenuItemForm";
import { getMenuItemById, updateMenuItemAction } from "@/lib/actions/menu-item.actions";
import { getActiveCategoriesForSelect } from "@/lib/actions/category.actions";

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, categoryOptions] = await Promise.all([
    getMenuItemById(id),
    getActiveCategoriesForSelect(),
  ]);

  if (!item) notFound();

  const updateWithId = updateMenuItemAction.bind(null, id);

  // Serialize Decimal -> number before crossing into the Client Component
  const serializedItem = {
    ...item,
    price: Number(item.price),
    discountPrice: item.discountPrice ? Number(item.discountPrice) : null,
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Edit Menu Item</h1>
      <MenuItemForm action={updateWithId} item={serializedItem} categoryOptions={categoryOptions} />
    </div>
  );
}