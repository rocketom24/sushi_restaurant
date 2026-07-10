// lib/actions/category.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/guards";
import { categorySchema, type CategoryFormState } from "@/lib/validations/category";
import { slugify } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const nameRaw = formData.get("name") as string;

  const raw = {
    name: nameRaw,
    description: formData.get("description") as string,
    slug: (formData.get("slug") as string) || slugify(nameRaw || ""),
    imageUrl: formData.get("imageUrl") as string,
    sortOrder: formData.get("sortOrder") as string,
    isActive: formData.get("isActive") === "on",
    parentId: (formData.get("parentId") as string) || "",
  };

  const validated = categorySchema.safeParse(raw);

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, description, slug, imageUrl, sortOrder, isActive, parentId } =
    validated.data;

  // Enforce uniqueness among active rows (soft-delete pattern from your schema)
  const existing = await prisma.category.findFirst({
    where: { slug, deletedAt: null },
  });

  if (existing) {
    return { errors: { slug: ["A category with this slug already exists."] } };
  }

  try {
    await prisma.category.create({
      data: {
        name,
        description: description || null,
        slug,
        imageUrl: imageUrl || null,
        sortOrder,
        isActive,
        parentId: parentId || null,
      },
    });
  } catch (err) {
    console.error("Category creation error:", err);
    return { errors: { _form: ["Something went wrong. Please try again."] } };
  }

  revalidatePath("/dashboard/categories");
  revalidatePath("/menu");
  redirect("/dashboard/categories");
}

export async function updateCategoryAction(
  categoryId: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const nameRaw = formData.get("name") as string;

  const raw = {
    name: nameRaw,
    description: formData.get("description") as string,
    slug: (formData.get("slug") as string) || slugify(nameRaw || ""),
    imageUrl: formData.get("imageUrl") as string,
    sortOrder: formData.get("sortOrder") as string,
    isActive: formData.get("isActive") === "on",
    parentId: (formData.get("parentId") as string) || "",
  };

  const validated = categorySchema.safeParse(raw);

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, description, slug, imageUrl, sortOrder, isActive, parentId } =
    validated.data;

  // Prevent a category from becoming its own parent
  if (parentId === categoryId) {
    return { errors: { parentId: ["A category cannot be its own parent."] } };
  }

  const existing = await prisma.category.findFirst({
    where: { slug, deletedAt: null, NOT: { id: categoryId } },
  });

  if (existing) {
    return { errors: { slug: ["A category with this slug already exists."] } };
  }

  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        description: description || null,
        slug,
        imageUrl: imageUrl || null,
        sortOrder,
        isActive,
        parentId: parentId || null,
      },
    });
  } catch (err) {
    console.error("Category update error:", err);
    return { errors: { _form: ["Something went wrong. Please try again."] } };
  }

  revalidatePath("/dashboard/categories");
  revalidatePath("/menu");
  redirect("/dashboard/categories");
}

export async function deleteCategoryAction(categoryId: string) {
  await requireOwner();

  const itemCount = await prisma.menuItem.count({
    where: { categoryId, deletedAt: null },
  });

  if (itemCount > 0) {
    return {
      error: "Cannot delete category with existing menu items.",
    };
  }

  await prisma.category.update({
    where: { id: categoryId },
    data: { deletedAt: new Date(), isActive: false },
  });

  revalidatePath("/dashboard/categories");
  revalidatePath("/menu");
  return { success: true };
}

export async function getCategoriesForDashboard() {
  await requireOwner();

  return prisma.category.findMany({
    where: { deletedAt: null },
    include: {
      _count: { select: { menuItems: { where: { deletedAt: null } } } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getActiveCategoriesForSelect() {
  await requireOwner();

  return prisma.category.findMany({
    where: { deletedAt: null, isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryById(categoryId: string) {
  await requireOwner();

  return prisma.category.findUnique({
    where: { id: categoryId, deletedAt: null },
  });
}