"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guards";
import { checkoutSchema } from "@/lib/validations/checkout";
import { generateOrderNumber } from "@/lib/orders/order-number";
import type { CheckoutInput, CheckoutResult } from "@/types/order";

export async function createOrderAction(
  input: CheckoutInput
): Promise<CheckoutResult> {
  const user = await requireAuth();

// lib/actions/checkout.actions.ts — change this one line

const validated = checkoutSchema.safeParse(input);
if (!validated.success) {
  return {
    success: false,
    error: validated.error.issues[0]?.message ?? "Invalid checkout data.",
  };
}
  const { orderType, deliveryAddress, notes, items } = validated.data;

  // Re-validate every cart item against the database — frontend data
  // (prices, availability) is never trusted, per the module's security
  // requirement.
  type ValidatedLine = {
    menuItemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    specialInstructions: string;
    customizations: {
      optionId: string;
      groupName: string;
      optionName: string;
      priceModifier: number;
    }[];
  };

  const validatedLines: ValidatedLine[] = [];
  const itemErrors: Record<string, string> = {};

  for (const line of items) {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: line.menuItemId, deletedAt: null },
      include: { category: { select: { isActive: true, deletedAt: true } } },
    });

    if (!menuItem) {
      itemErrors[line.menuItemId] = "This item no longer exists.";
      continue;
    }
    if (!menuItem.isAvailable) {
      itemErrors[line.menuItemId] = `${menuItem.name} is currently unavailable.`;
      continue;
    }
    if (!menuItem.category.isActive || menuItem.category.deletedAt) {
      itemErrors[line.menuItemId] = `${menuItem.name} is currently unavailable.`;
      continue;
    }

    let customizations: ValidatedLine["customizations"] = [];

    if (line.customizationOptionIds.length > 0) {
      const options = await prisma.customizationOption.findMany({
        where: {
          id: { in: line.customizationOptionIds },
          deletedAt: null,
          group: { menuItemId: line.menuItemId, deletedAt: null },
        },
        include: { group: { select: { name: true } } },
      });

      if (options.length !== line.customizationOptionIds.length) {
        itemErrors[line.menuItemId] = `Invalid customization for ${menuItem.name}.`;
        continue;
      }

      customizations = options.map((opt) => ({
        optionId: opt.id,
        groupName: opt.group.name,
        optionName: opt.name,
        priceModifier: Number(opt.priceModifier),
      }));
    }

    const basePrice = Number(menuItem.price);
    const customizationTotal = customizations.reduce(
      (sum, c) => sum + c.priceModifier,
      0
    );
    const unitPrice = basePrice + customizationTotal;
    const subtotal = Math.round(unitPrice * line.quantity * 100) / 100;

    validatedLines.push({
      menuItemId: menuItem.id,
      name: menuItem.name,
      quantity: line.quantity,
      unitPrice,
      subtotal,
      specialInstructions: line.specialInstructions,
      customizations,
    });
  }

  if (Object.keys(itemErrors).length > 0) {
    return {
      success: false,
      error: "Some items in your cart are no longer available.",
      itemErrors,
    };
  }

  if (validatedLines.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  const subtotal =
    Math.round(validatedLines.reduce((sum, l) => sum + l.subtotal, 0) * 100) /
    100;

  // Tax, service charge, and discount calculation are out of scope for
  // Module 6 — placeholders remain 0 until Promotions/Payments modules
  // wire in real logic. Flagged deliberately, not silently omitted.
  const discountAmount = 0;
  const taxAmount = 0;
  const serviceCharge = 0;
  const totalAmount =
    Math.round((subtotal - discountAmount + taxAmount + serviceCharge) * 100) /
    100;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const orderNumber = await generateOrderNumber(tx);

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          orderType,
          status: "NEW",
          userId: user.id,
          deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : null,
          notes: notes || null,
          subtotal,
          discountAmount,
          taxAmount,
          serviceCharge,
          totalAmount,
        },
      });

      for (const line of validatedLines) {
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            menuItemId: line.menuItemId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            subtotal: line.subtotal,
            notes: line.specialInstructions || null,
          },
        });

        for (const c of line.customizations) {
          await tx.orderItemCustomization.create({
            data: {
              orderItemId: orderItem.id,
              optionId: c.optionId,
              groupName: c.groupName,
              optionName: c.optionName,
              priceModifier: c.priceModifier,
            },
          });
        }
      }

      // Payment stub — method/gateway are placeholders until Module 8
      // (Payments) implements real payment method selection.
      await tx.payment.create({
        data: {
          orderId: createdOrder.id,
          method: "CASH",
          gateway: "MANUAL",
          status: "PENDING",
          amount: totalAmount,
        },
      });

      return createdOrder;
    });

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (err) {
    console.error("Order creation error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}