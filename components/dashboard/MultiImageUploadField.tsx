// components/dashboard/MultiImageUploadField.tsx
"use client";

import { useRef, useState } from "react";
import { uploadImageAction } from "@/lib/actions/upload.actions";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_IMAGES = 4;

export default function MultiImageUploadField({
  name,
  folder,
  label,
  defaultValue,
}: {
  name: string;
  folder: "menu" | "hero-slides";
  label: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue ?? []);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const room = MAX_IMAGES - urls.length;
    const toUpload = Array.from(files).slice(0, room);
    if (toUpload.length === 0) {
      setError(`You can add up to ${MAX_IMAGES} images.`);
      return;
    }

    for (const file of toUpload) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Only JPEG, PNG, WEBP, or GIF images are allowed.");
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError("Each image must be under 8MB.");
        continue;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const result = await uploadImageAction(formData);
      setIsUploading(false);

      if (result.success) {
        setUrls((prev) => [...prev, result.url].slice(0, MAX_IMAGES));
      } else {
        setError(result.error);
      }
    }
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type="hidden" name={name} value={urls.join("\n")} />

      <div className="flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <div key={url + i} className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Remove image"
              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}

        {urls.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="w-20 h-20 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50 text-2xl"
          >
            {isUploading ? "…" : "+"}
          </button>
        )}
      </div>

      <p className="mt-1.5 text-xs text-gray-400">
        Up to {MAX_IMAGES} images, JPEG/PNG/WEBP/GIF, 8MB each.
      </p>
      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
