// lib/actions/settings.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/guards";
import { getRestaurantSettings } from "@/lib/settings/settings";
import {
  loyaltySettingsSchema,
  operatingHoursSchema,
  orderingSettingsSchema,
  paymentSettingsSchema,
  reservationSettingsSchema,
  restaurantInfoSchema,
  type SettingsFormState,
} from "@/lib/validations/settings";
import { revalidatePath } from "next/cache";

export async function getSettingsForDashboard() {
  await requireOwner();
  const settings = await getRestaurantSettings();
  return {
    ...settings,
    minOrderAmount: Number(settings.minOrderAmount),
    deliveryFee: Number(settings.deliveryFee),
    pointsPerEuro: Number(settings.pointsPerEuro),
  };
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

export async function updateRestaurantInfoAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = restaurantInfoSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    website: formData.get("website") ?? "",
    address: formData.get("address") ?? "",
    vatNumber: formData.get("vatNumber") ?? "",
    taxId: formData.get("taxId") ?? "",
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const settings = await getRestaurantSettings();
  const d = validated.data;
  await prisma.restaurantSettings.update({
    where: { id: settings.id },
    data: {
      name: d.name,
      description: d.description || null,
      phone: d.phone || null,
      email: d.email || null,
      website: d.website || null,
      address: d.address || null,
      vatNumber: d.vatNumber || null,
      taxId: d.taxId || null,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateOperatingHoursAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const raw = formData.get("operatingHours");
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(raw));
  } catch {
    return { errors: { _form: ["Invalid operating hours payload."] } };
  }

  const validated = operatingHoursSchema.safeParse(parsed);
  if (!validated.success) {
    return { errors: { _form: [validated.error.issues[0]?.message ?? "Invalid hours."] } };
  }

  const settings = await getRestaurantSettings();
  await prisma.restaurantSettings.update({
    where: { id: settings.id },
    data: { operatingHours: validated.data as object },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateReservationSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = reservationSettingsSchema.safeParse({
    reservationSlotIntervalMinutes: formData.get("reservationSlotIntervalMinutes"),
    reservationLunchDurationMinutes: formData.get("reservationLunchDurationMinutes"),
    reservationDinnerDurationMinutes: formData.get("reservationDinnerDurationMinutes"),
    reservationMaxGuests: formData.get("reservationMaxGuests"),
    reservationCancellationCutoffHours: formData.get("reservationCancellationCutoffHours"),
    autoAssignTable: bool(formData, "autoAssignTable"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const settings = await getRestaurantSettings();
  await prisma.restaurantSettings.update({
    where: { id: settings.id },
    data: validated.data,
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateOrderingSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = orderingSettingsSchema.safeParse({
    deliveryEnabled: bool(formData, "deliveryEnabled"),
    takeawayEnabled: bool(formData, "takeawayEnabled"),
    dineInEnabled: bool(formData, "dineInEnabled"),
    minOrderAmount: formData.get("minOrderAmount"),
    deliveryFee: formData.get("deliveryFee"),
    estimatedPrepTimeMinutes: formData.get("estimatedPrepTimeMinutes"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  if (
    !validated.data.deliveryEnabled &&
    !validated.data.takeawayEnabled &&
    !validated.data.dineInEnabled
  ) {
    return {
      errors: { _form: ["At least one order type must be enabled."] },
    };
  }

  const settings = await getRestaurantSettings();
  await prisma.restaurantSettings.update({
    where: { id: settings.id },
    data: validated.data,
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updatePaymentSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = paymentSettingsSchema.safeParse({
    cashEnabled: bool(formData, "cashEnabled"),
    cardEnabled: bool(formData, "cardEnabled"),
    satispayEnabled: bool(formData, "satispayEnabled"),
    edenredEnabled: bool(formData, "edenredEnabled"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const settings = await getRestaurantSettings();
  await prisma.restaurantSettings.update({
    where: { id: settings.id },
    data: validated.data,
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateLoyaltySettingsAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  try {
    await requireOwner();
  } catch {
    return { errors: { _form: ["You are not authorized to perform this action."] } };
  }

  const validated = loyaltySettingsSchema.safeParse({
    pointsPerEuro: formData.get("pointsPerEuro"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const settings = await getRestaurantSettings();
  await prisma.restaurantSettings.update({
    where: { id: settings.id },
    data: validated.data,
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
