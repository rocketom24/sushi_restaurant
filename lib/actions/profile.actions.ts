// lib/actions/profile.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBareClient } from "@supabase/supabase-js";
import {
  addressSchema,
  changePasswordSchema,
  profileNameSchema,
  type AddressFormState,
  type PasswordFormState,
  type ProfileFormState,
} from "@/lib/validations/profile";
import { revalidatePath } from "next/cache";

// ============ PROFILE ============

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const user = await requireAuth();

  const validated = profileNameSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: validated.data.name },
  });

  revalidatePath("/profile");
  return { success: true };
}

// ============ ADDRESS BOOK ============

export async function getMyAddresses() {
  const user = await requireAuth();

  return prisma.customerAddress.findMany({
    where: { userId: user.id, deletedAt: null },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
}

function parseAddressForm(formData: FormData) {
  return addressSchema.safeParse({
    label: formData.get("label"),
    fullAddress: formData.get("fullAddress"),
    city: formData.get("city") ?? "",
    postalCode: formData.get("postalCode") ?? "",
    notes: formData.get("notes") ?? "",
    isDefault: formData.get("isDefault") === "on",
  });
}

export async function createAddressAction(
  _prevState: AddressFormState,
  formData: FormData
): Promise<AddressFormState> {
  const user = await requireAuth();

  const validated = parseAddressForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { label, fullAddress, city, postalCode, notes, isDefault } = validated.data;

  const existingCount = await prisma.customerAddress.count({
    where: { userId: user.id, deletedAt: null },
  });

  // First address automatically becomes the default
  const makeDefault = isDefault || existingCount === 0;

  await prisma.$transaction(async (tx) => {
    if (makeDefault) {
      await tx.customerAddress.updateMany({
        where: { userId: user.id, deletedAt: null },
        data: { isDefault: false },
      });
    }
    await tx.customerAddress.create({
      data: {
        userId: user.id,
        label,
        fullAddress,
        city: city || null,
        postalCode: postalCode || null,
        notes: notes || null,
        isDefault: makeDefault,
      },
    });
  });

  revalidatePath("/profile/addresses");
  return { success: true };
}

export async function updateAddressAction(
  addressId: string,
  _prevState: AddressFormState,
  formData: FormData
): Promise<AddressFormState> {
  const user = await requireAuth();

  const address = await prisma.customerAddress.findUnique({
    where: { id: addressId, deletedAt: null },
  });
  if (!address || address.userId !== user.id) {
    return { errors: { _form: ["Address not found."] } };
  }

  const validated = parseAddressForm(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { label, fullAddress, city, postalCode, notes, isDefault } = validated.data;

  await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.customerAddress.updateMany({
        where: { userId: user.id, deletedAt: null },
        data: { isDefault: false },
      });
    }
    await tx.customerAddress.update({
      where: { id: addressId },
      data: {
        label,
        fullAddress,
        city: city || null,
        postalCode: postalCode || null,
        notes: notes || null,
        ...(isDefault ? { isDefault: true } : {}),
      },
    });
  });

  revalidatePath("/profile/addresses");
  return { success: true };
}

export async function deleteAddressAction(addressId: string) {
  const user = await requireAuth();

  const address = await prisma.customerAddress.findUnique({
    where: { id: addressId, deletedAt: null },
  });
  if (!address || address.userId !== user.id) {
    return { error: "Address not found." };
  }

  await prisma.customerAddress.update({
    where: { id: addressId },
    data: { deletedAt: new Date(), isDefault: false },
  });

  revalidatePath("/profile/addresses");
  return { success: true };
}

export async function setDefaultAddressAction(addressId: string) {
  const user = await requireAuth();

  const address = await prisma.customerAddress.findUnique({
    where: { id: addressId, deletedAt: null },
  });
  if (!address || address.userId !== user.id) {
    return { error: "Address not found." };
  }

  await prisma.$transaction([
    prisma.customerAddress.updateMany({
      where: { userId: user.id, deletedAt: null },
      data: { isDefault: false },
    }),
    prisma.customerAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    }),
  ]);

  revalidatePath("/profile/addresses");
  return { success: true };
}

// ============ ACCOUNT SETTINGS ============

export async function changePasswordAction(
  _prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const user = await requireAuth();

  const validated = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmNewPassword: formData.get("confirmNewPassword"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // Verify the current password with a throwaway in-memory client —
  // using the cookie-backed client here would wipe the user's session
  // when the attempt fails (supabase-js replaces the session on sign-in).
  const bare = createBareClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data: verifyData, error: verifyError } =
    await bare.auth.signInWithPassword({
      email: user.email,
      password: validated.data.currentPassword,
    });

  if (verifyError) {
    return { errors: { currentPassword: ["Current password is incorrect."] } };
  }

  // Discard the throwaway session's tokens.
  if (verifyData.session) await bare.auth.signOut({ scope: "local" });

  const supabase = await createClient();
  const { error: updateError } = await supabase.auth.updateUser({
    password: validated.data.newPassword,
  });

  if (updateError) {
    return { errors: { _form: [updateError.message] } };
  }

  return { success: true };
}
