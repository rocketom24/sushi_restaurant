// lib/actions/hero-slides.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/guards";
import { heroSlideSchema, type HeroSlideFormState } from "@/lib/validations/hero-slide";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function serialize<T extends { price: unknown }>(slide: T) {
  return { ...slide, price: slide.price === null ? null : Number(slide.price) };
}

// ============ PUBLIC — homepage carousel ============

export async function getActiveHeroSlidesForHome() {
  const slides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return slides.map(serialize);
}

// ============ OWNER — CRUD ============

export async function getHeroSlidesForDashboard() {
  await requireOwner();
  const slides = await prisma.heroSlide.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return slides.map(serialize);
}

export async function getHeroSlideById(id: string) {
  await requireOwner();
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  return slide ? serialize(slide) : null;
}

function parseHeroSlideForm(formData: FormData) {
  return heroSlideSchema.safeParse({
    kind: formData.get("kind"),
    layout: formData.get("layout"),
    badgeText: formData.get("badgeText") ?? "",
    title: formData.get("title"),
    subtitle: formData.get("subtitle") ?? "",
    description: formData.get("description") ?? "",
    imageUrl: formData.get("imageUrl") ?? "",
    imageUrls: formData.get("imageUrls") ?? "",
    price: formData.get("price"),
    discountLabel: formData.get("discountLabel") ?? "",
    couponCode: formData.get("couponCode") ?? "",
    ctaLabel: formData.get("ctaLabel") ?? "",
    ctaHref: formData.get("ctaHref") ?? "",
    isActive: formData.get("isActive") === "on",
    sortOrder: formData.get("sortOrder"),
  });
}

export async function createHeroSlideAction(
  _prevState: HeroSlideFormState,
  formData: FormData
): Promise<HeroSlideFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = parseHeroSlideForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;
  const sortOrder = data.sortOrder ?? (await prisma.heroSlide.count());

  await prisma.heroSlide.create({
    data: {
      kind: data.kind,
      layout: data.layout,
      badgeText: data.badgeText || null,
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      imageUrls: data.imageUrls,
      price: data.price ?? null,
      discountLabel: data.discountLabel || null,
      couponCode: data.couponCode || null,
      ctaLabel: data.ctaLabel || null,
      ctaHref: data.ctaHref || null,
      isActive: data.isActive ?? true,
      sortOrder,
    },
  });

  revalidatePath("/dashboard/hero-slides");
  revalidatePath("/");
  redirect("/dashboard/hero-slides");
}

export async function updateHeroSlideAction(
  slideId: string,
  _prevState: HeroSlideFormState,
  formData: FormData
): Promise<HeroSlideFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = parseHeroSlideForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;

  await prisma.heroSlide.update({
    where: { id: slideId },
    data: {
      kind: data.kind,
      layout: data.layout,
      badgeText: data.badgeText || null,
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      imageUrls: data.imageUrls,
      price: data.price ?? null,
      discountLabel: data.discountLabel || null,
      couponCode: data.couponCode || null,
      ctaLabel: data.ctaLabel || null,
      ctaHref: data.ctaHref || null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  revalidatePath("/dashboard/hero-slides");
  revalidatePath("/");
  redirect("/dashboard/hero-slides");
}

export async function toggleHeroSlideActiveAction(slideId: string) {
  await requireOwner();

  const slide = await prisma.heroSlide.findUnique({ where: { id: slideId } });
  if (!slide) return { error: "Slide not found." };

  await prisma.heroSlide.update({
    where: { id: slideId },
    data: { isActive: !slide.isActive },
  });

  revalidatePath("/dashboard/hero-slides");
  revalidatePath("/");
  return { success: true };
}

export async function deleteHeroSlideAction(slideId: string) {
  await requireOwner();

  const slide = await prisma.heroSlide.findUnique({ where: { id: slideId } });
  if (!slide) return { error: "Slide not found." };

  await prisma.heroSlide.delete({ where: { id: slideId } });

  revalidatePath("/dashboard/hero-slides");
  revalidatePath("/");
  return { success: true };
}
