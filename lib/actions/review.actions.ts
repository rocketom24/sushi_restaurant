// lib/actions/review.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireOwner } from "@/lib/guards";
import {
  reviewSchema,
  reviewEditSchema,
  type ReviewFormState,
  type ReviewEditFormState,
} from "@/lib/validations/review";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ReviewStatus } from "@/app/generated/prisma/client";

// =======================================================
// CUSTOMER
// =======================================================

/** Returns the caller's own review for an order, or null if none exists. */
export async function getMyReviewForOrder(orderId: string) {
  const user = await requireAuth();

  const review = await prisma.review.findUnique({
    where: { orderId, deletedAt: null },
  });

  if (!review || review.userId !== user.id) return null;
  return review;
}

function parseReviewForm(formData: FormData) {
  return reviewSchema.safeParse({
    rating: formData.get("rating"),
    title: formData.get("title"),
    comment: formData.get("comment"),
  });
}

/**
 * Creates a review for a completed order owned by the caller. Order
 * lookup failures (missing, not owned, not completed) all return the
 * same generic error — never distinguishes "not found" from "forbidden",
 * matching cancelMyOrderAction's privacy pattern so a review submission
 * can't be used to probe another customer's order.
 */
export async function createReviewAction(
  orderId: string,
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const user = await requireAuth();

  const order = await prisma.order.findUnique({
    where: { id: orderId, deletedAt: null },
  });

  if (!order || order.userId !== user.id || order.status !== "COMPLETED") {
    return { errors: { _form: ["This order can't be reviewed."] } };
  }

  const existing = await prisma.review.findUnique({ where: { orderId } });
  if (existing) {
    return { errors: { _form: ["You've already reviewed this order."] } };
  }

  const validated = parseReviewForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { rating, title, comment } = validated.data;

  // The orderId @unique constraint is the authoritative guard against a
  // race between the check above and this insert.
  try {
    await prisma.review.create({
      data: { rating, title, comment, userId: user.id, orderId },
    });
  } catch {
    return { errors: { _form: ["You've already reviewed this order."] } };
  }

  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}

/** Customers may only edit their own review while it's still PENDING. */
export async function updateMyReviewAction(
  reviewId: string,
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const user = await requireAuth();

  const review = await prisma.review.findUnique({
    where: { id: reviewId, deletedAt: null },
  });

  if (!review || review.userId !== user.id) {
    return { errors: { _form: ["Review not found."] } };
  }
  if (review.status !== "PENDING") {
    return { errors: { _form: ["This review has already been moderated and can no longer be edited."] } };
  }

  const validated = parseReviewForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await prisma.review.update({
    where: { id: reviewId },
    data: validated.data,
  });

  revalidatePath(`/orders/${review.orderId}`);
  return { success: true };
}

export async function deleteMyReviewAction(reviewId: string) {
  const user = await requireAuth();

  const review = await prisma.review.findUnique({
    where: { id: reviewId, deletedAt: null },
  });
  if (!review || review.userId !== user.id) {
    return { error: "Review not found." };
  }

  await prisma.review.update({
    where: { id: reviewId },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/orders/${review.orderId}`);
  return { success: true };
}

// =======================================================
// OWNER — moderation & CRUD
// =======================================================

export async function getReviewsForDashboard() {
  await requireOwner();

  const reviews = await prisma.review.findMany({
    where: { deletedAt: null },
    include: {
      user: { select: { name: true } },
      order: { select: { orderNumber: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    status: r.status,
    isVisible: r.isVisible,
    isFeatured: r.isFeatured,
    sortOrder: r.sortOrder,
    createdAt: r.createdAt,
    customerName: r.user.name,
    orderNumber: r.order.orderNumber,
  }));
}

export async function getReviewById(reviewId: string) {
  await requireOwner();

  const r = await prisma.review.findUnique({
    where: { id: reviewId, deletedAt: null },
  });
  if (!r) return null;

  return {
    id: r.id,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    sortOrder: r.sortOrder,
  };
}

export async function updateReviewStatusAction(reviewId: string, status: ReviewStatus) {
  await requireOwner();

  const review = await prisma.review.findUnique({
    where: { id: reviewId, deletedAt: null },
  });
  if (!review) return { error: "Review not found." };

  await prisma.review.update({ where: { id: reviewId }, data: { status } });

  revalidatePath("/dashboard/reviews");
  revalidatePath("/");
  return { success: true };
}

export async function toggleReviewVisibilityAction(reviewId: string) {
  await requireOwner();

  const review = await prisma.review.findUnique({
    where: { id: reviewId, deletedAt: null },
  });
  if (!review) return { error: "Review not found." };

  await prisma.review.update({
    where: { id: reviewId },
    data: { isVisible: !review.isVisible },
  });

  revalidatePath("/dashboard/reviews");
  revalidatePath("/");
  return { success: true };
}

export async function toggleReviewFeaturedAction(reviewId: string) {
  await requireOwner();

  const review = await prisma.review.findUnique({
    where: { id: reviewId, deletedAt: null },
  });
  if (!review) return { error: "Review not found." };

  await prisma.review.update({
    where: { id: reviewId },
    data: { isFeatured: !review.isFeatured },
  });

  revalidatePath("/dashboard/reviews");
  revalidatePath("/");
  return { success: true };
}

/**
 * Owner content edit (rating/title/comment/sortOrder). Deliberately does
 * not touch `status` — a corrective edit by the owner (e.g. redacting
 * something) shouldn't force an already-approved review back into
 * moderation.
 */
export async function updateReviewAction(
  reviewId: string,
  _prevState: ReviewEditFormState,
  formData: FormData
): Promise<ReviewEditFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = reviewEditSchema.safeParse({
    rating: formData.get("rating"),
    title: formData.get("title"),
    comment: formData.get("comment"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId, deletedAt: null },
  });
  if (!review) {
    return { errors: { _form: ["Review not found."] } };
  }

  const { rating, title, comment, sortOrder } = validated.data;

  await prisma.review.update({
    where: { id: reviewId },
    data: { rating, title, comment, sortOrder: sortOrder ?? review.sortOrder },
  });

  revalidatePath("/dashboard/reviews");
  revalidatePath("/");
  redirect("/dashboard/reviews");
}

export async function deleteReviewAction(reviewId: string) {
  await requireOwner();

  const review = await prisma.review.findUnique({
    where: { id: reviewId, deletedAt: null },
  });
  if (!review) return { error: "Review not found." };

  await prisma.review.update({
    where: { id: reviewId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/dashboard/reviews");
  revalidatePath("/");
  return { success: true };
}

// =======================================================
// PUBLIC — homepage testimonials
// =======================================================

export type PublicReview = {
  id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
};

export async function getPublicReviews(): Promise<PublicReview[]> {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED", isVisible: true, deletedAt: null },
    include: { user: { select: { name: true } } },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: 30,
  });

  return reviews.map((r) => ({
    id: r.id,
    customerName: r.user.name,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    createdAt: r.createdAt,
  }));
}

export type PublicReviewStats = {
  averageRating: number;
  totalCount: number;
};

export async function getPublicReviewStats(): Promise<PublicReviewStats> {
  const stats = await prisma.review.aggregate({
    where: { status: "APPROVED", isVisible: true, deletedAt: null },
    _avg: { rating: true },
    _count: true,
  });

  return {
    averageRating: stats._avg.rating ?? 0,
    totalCount: stats._count,
  };
}
