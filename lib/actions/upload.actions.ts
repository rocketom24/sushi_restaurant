// lib/actions/upload.actions.ts
"use server";

import { randomUUID } from "crypto";
import sharp from "sharp";
import { requireOwner } from "@/lib/guards";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "images";
const ALLOWED_FOLDERS = ["menu", "hero-slides"] as const;
type UploadFolder = (typeof ALLOWED_FOLDERS)[number];

// Raw upload ceiling before compression — generous since any format/size the
// owner's camera or phone produces gets normalized down below TARGET_BYTES
// anyway. Must stay <= the serverActions.bodySizeLimit in next.config.ts.
const MAX_BYTES = 25 * 1024 * 1024; // 25MB

// Every stored image is re-encoded to WEBP, so output size and content type
// no longer depend on what the owner uploaded.
const OUTPUT_EXT = "webp";
const OUTPUT_CONTENT_TYPE = "image/webp";

// Compression targets: keep every stored image under 200KB while favoring
// quality over resolution — a sharp downscale is more noticeable than a
// modest quality drop, so dimensions are only capped/reduced as a last resort.
const TARGET_BYTES = 200 * 1024;
const MAX_DIMENSION = 2000; // long edge, in px — plenty for menu/hero display sizes
const QUALITY_STEPS = [90, 82, 74, 66, 58, 50, 42, 35] as const;
const MIN_WIDTH = 320;

/**
 * Compresses an arbitrary input image to WEBP under TARGET_BYTES, preferring
 * to lower encode quality before shrinking dimensions.
 */
async function compressImage(input: Buffer): Promise<Buffer> {
  const normalized = await sharp(input, { failOn: "none" })
    .rotate() // apply EXIF orientation, then strip it
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .toBuffer();

  for (const quality of QUALITY_STEPS) {
    const candidate = await sharp(normalized).webp({ quality }).toBuffer();
    if (candidate.length <= TARGET_BYTES) return candidate;
  }

  const lowestQuality = QUALITY_STEPS[QUALITY_STEPS.length - 1];
  let width = MAX_DIMENSION;
  let smallest = await sharp(normalized).webp({ quality: lowestQuality }).toBuffer();
  while (width > MIN_WIDTH) {
    width = Math.round(width * 0.75);
    const candidate = await sharp(normalized)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: lowestQuality })
      .toBuffer();
    smallest = candidate;
    if (candidate.length <= TARGET_BYTES) return candidate;
  }

  return smallest; // best effort — extremely unlikely to still exceed TARGET_BYTES
}

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
    return { success: false, error: "Image must be under 25MB." };
  }
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "Only image files are allowed." };
  }

  let compressed: Buffer;
  try {
    const rawBytes = Buffer.from(await file.arrayBuffer());
    compressed = await compressImage(rawBytes);
  } catch {
    return { success: false, error: "That file could not be read as an image." };
  }

  const path = `${folder}/${randomUUID()}.${OUTPUT_EXT}`;
  const supabase = createAdminClient();

  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType: OUTPUT_CONTENT_TYPE,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    return { success: false, error: "Upload failed — please try again." };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}
