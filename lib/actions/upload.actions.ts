// lib/actions/upload.actions.ts
"use server";

import { randomUUID } from "crypto";
import { requireOwner } from "@/lib/guards";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "images";
const ALLOWED_FOLDERS = ["menu", "hero-slides"] as const;
type UploadFolder = (typeof ALLOWED_FOLDERS)[number];

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_BYTES = 8 * 1024 * 1024; // 8MB — matches the bucket's own fileSizeLimit

export type UploadResult = { success: true; url: string } | { success: false; error: string };

/** Owner-only image upload used by the menu-item and hero-slide forms. */
export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  try {
    await requireOwner();
  } catch {
    return { success: false, error: "You are not authorized to upload images." };
  }

  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File)) {
    return { success: false, error: "No file provided." };
  }
  if (typeof folder !== "string" || !ALLOWED_FOLDERS.includes(folder as UploadFolder)) {
    return { success: false, error: "Invalid upload destination." };
  }
  if (file.size === 0) {
    return { success: false, error: "The selected file is empty." };
  }
  if (file.size > MAX_BYTES) {
    return { success: false, error: "Image must be under 8MB." };
  }

  const ext = EXT_BY_MIME[file.type];
  if (!ext) {
    return { success: false, error: "Only JPEG, PNG, WEBP, or GIF images are allowed." };
  }

  const path = `${folder}/${randomUUID()}.${ext}`;
  const supabase = createAdminClient();

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    return { success: false, error: "Upload failed — please try again." };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}
