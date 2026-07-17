// components/dashboard/ImageUploadField.tsx
"use client";

import { useRef, useState } from "react";
import { uploadImageAction } from "@/lib/actions/upload.actions";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 8 * 1024 * 1024;

export default function ImageUploadField({
  name,
  folder,
  label,
  defaultValue,
}: {
  name: string;
  folder: "menu" | "hero-slides";
  label: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, WEBP, or GIF images are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be under 8MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const result = await uploadImageAction(formData);

    setIsUploading(false);
    URL.revokeObjectURL(objectUrl);
    setPreview(null);

    if (result.success) {
      setUrl(result.url);
    } else {
      setError(result.error);
    }
  }

  const displaySrc = preview ?? url;

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type="hidden" name={name} value={url} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex items-center gap-4 rounded-md border-2 border-dashed p-3 transition-colors ${
          isDragOver ? "border-neutral-900 bg-gray-50" : "border-gray-300"
        }`}
      >
        <div className="w-20 h-20 shrink-0 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center text-2xl">
          {displaySrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displaySrc} alt="" className={`w-full h-full object-cover ${isUploading ? "opacity-50" : ""}`} />
          ) : (
            <span aria-hidden className="text-gray-300">
              🖼️
            </span>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : url ? "Change Image" : "Upload Image"}
            </button>
            {url && !isUploading && (
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setError(null);
                }}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400">Drag & drop, or click to upload. JPEG/PNG/WEBP/GIF, up to 8MB.</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </div>
    </div>
  );
}
