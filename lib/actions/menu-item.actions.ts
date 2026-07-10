// lib/actions/menu-item.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/guards";
import { menuItemSchema, type MenuItemFormState } from "@/lib/validations/menu-item";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMenuItemAction(
  _prevState: MenuItemFormState,
  formData: FormData
): Promise<MenuItemFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("categoryId") as string,
    price: formData.get("price") as string,
    imageUrl: formData.get("imageUrl") as string,
    preparationTime: formData.get("preparationTime") as string,
    calories: formData.get("calories") as string,
    spiceLevel: (formData.get("spiceLevel") as string) || undefined,
    isAvailable: formData.get("isAvailable") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: formData.get("sortOrder") as string,
  };

  const validated = menuItemSchema.safeParse(raw);

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const category = await prisma.category.findUnique({
    where: { id: validated.data.categoryId, deletedAt: null },
  });

  if (!category) {
    return { errors: { categoryId: ["Selected category does not exist."] } };
  }

  try {
    await prisma.menuItem.create({
      data: {
        ...validated.data,
        description: validated.data.description || null,
        imageUrl: validated.data.imageUrl || null,
        preparationTime: validated.data.preparationTime ?? null,
        calories: validated.data.calories ?? null,
        spiceLevel: validated.data.spiceLevel ?? null,
      },
    });
  } catch (err) {
    console.error("Menu item creation error:", err);
    return { errors: { _form: ["Something went wrong. Please try again."] } };
  }

  revalidatePath("/dashboard/menu");
  revalidatePath("/menu");
  redirect("/dashboard/menu");
}

export async function updateMenuItemAction(
  menuItemId: string,
  _prevState: MenuItemFormState,
  formData: FormData
): Promise<MenuItemFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("categoryId") as string,
    price: formData.get("price") as string,
    imageUrl: formData.get("imageUrl") as string,
    preparationTime: formData.get("preparationTime") as string,
    calories: formData.get("calories") as string,
    spiceLevel: (formData.get("spiceLevel") as string) || undefined,
    isAvailable: formData.get("isAvailable") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: formData.get("sortOrder") as string,
  };

  const validated = menuItemSchema.safeParse(raw);

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const category = await prisma.category.findUnique({
    where: { id: validated.data.categoryId, deletedAt: null },
  });

  if (!category) {
    return { errors: { categoryId: ["Selected category does not exist."] } };
  }

  try {
    await prisma.menuItem.update({
      where: { id: menuItemId },
      data: {
        ...validated.data,
        description: validated.data.description || null,
        imageUrl: validated.data.imageUrl || null,
        preparationTime: validated.data.preparationTime ?? null,
        calories: validated.data.calories ?? null,
        spiceLevel: validated.data.spiceLevel ?? null,
      },
    });
  } catch (err) {
    console.error("Menu item update error:", err);
    return { errors: { _form: ["Something went wrong. Please try again."] } };
  }

  revalidatePath("/dashboard/menu");
  revalidatePath("/menu");
  redirect("/dashboard/menu");
}

export async function deleteMenuItemAction(menuItemId: string) {
  await requireOwner();

  await prisma.menuItem.update({
    where: { id: menuItemId },
    data: { deletedAt: new Date(), isAvailable: false },
  });

  revalidatePath("/dashboard/menu");
  revalidatePath("/menu");
  return { success: true };
}

export async function toggleAvailabilityAction(menuItemId: string, isAvailable: boolean) {
  await requireOwner();

  await prisma.menuItem.update({
    where: { id: menuItemId },
    data: { isAvailable },
  });

  revalidatePath("/dashboard/menu");
  revalidatePath("/menu");
}

export async function getMenuItemsForDashboard() {
  await requireOwner();

  return prisma.menuItem.findMany({
    where: { deletedAt: null },
    include: { category: { select: { name: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getMenuItemById(menuItemId: string) {
  await requireOwner();

  return prisma.menuItem.findUnique({
    where: { id: menuItemId, deletedAt: null },
  });
}