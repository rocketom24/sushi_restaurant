import type { Prisma } from "@/app/generated/prisma/client";

/**
 * Generates a human-readable, year-scoped sequential order number,
 * e.g. ORD-202600001.
 *
 * IMPORTANT LIMITATION: orderNumber is intentionally NOT a unique
 * database constraint (same soft-delete reasoning applied throughout
 * this schema — see User.email, Category.slug). This count-based
 * approach has a theoretical race window under concurrent checkouts
 * within the same transaction tick. For a single-owner restaurant at
 * current scale, this risk is negligible. If order volume grows
 * enough that concurrent checkouts become common, replace this with
 * a Postgres SEQUENCE or an atomic counter row.
 */
export async function generateOrderNumber(
  tx: Prisma.TransactionClient
): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startOfNextYear = new Date(year + 1, 0, 1);

  const count = await tx.order.count({
    where: {
      createdAt: { gte: startOfYear, lt: startOfNextYear },
    },
  });

  const sequence = count + 1;
  return `ORD-${year}${String(sequence).padStart(5, "0")}`;
}