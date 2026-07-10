// lib/actions/cart-validation.actions.ts
"use server";

import { prisma } from "@/lib/prisma";

export type AddToCartValidationInput = {
  menuItemId: string;
  quantity: number;
  customizationOptionIds: string[];
  specialInstructions: string;
};

type ValidatedCustomization = {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceModifier: number;
};

export type AddToCartValidationResult =
  | {
      valid: true;
      menuItem: {
        id: string;
        name: string;
        basePrice: number;
        imageUrl: string | null;
      };
      customizations: ValidatedCustomization[];
    }
  | { valid: false; error: string };

export async function validateAddToCart(
  input: AddToCartValidationInput
): Promise<AddToCartValidationResult> {
  const { menuItemId, quantity, customizationOptionIds, specialInstructions } =
    input;

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return { valid: false, error: "Invalid quantity." };
  }

  if (specialInstructions.length > 250) {
    return { valid: false, error: "Special instructions too long." };
  }

  const menuItem = await prisma.menuItem.findUnique({
    where: { id: menuItemId, deletedAt: null },
    include: {
      category: { select: { isActive: true, deletedAt: true } },
    },
  });

  if (!menuItem) {
    return { valid: false, error: "This item no longer exists." };
  }

  if (!menuItem.isAvailable) {
    return { valid: false, error: "This item is currently unavailable." };
  }

  if (!menuItem.category.isActive || menuItem.category.deletedAt) {
    return { valid: false, error: "This item is currently unavailable." };
  }

  const validatedCustomizations: ValidatedCustomization[] = [];

  if (customizationOptionIds.length > 0) {
    const options = await prisma.customizationOption.findMany({
      where: {
        id: { in: customizationOptionIds },
        deletedAt: null,
        group: { menuItemId, deletedAt: null },
      },
      include: { group: { select: { id: true, name: true } } },
    });

    if (options.length !== customizationOptionIds.length) {
      return {
        valid: false,
        error: "One or more selected customizations are invalid.",
      };
    }

    for (const opt of options) {
      validatedCustomizations.push({
        groupId: opt.group.id,
        groupName: opt.group.name,
        optionId: opt.id,
        optionName: opt.name,
        priceModifier: Number(opt.priceModifier),
      });
    }
  }

  return {
    valid: true,
    menuItem: {
      id: menuItem.id,
      name: menuItem.name,
      basePrice: Number(menuItem.price),
      imageUrl: menuItem.imageUrl,
    },
    customizations: validatedCustomizations,
  };
}