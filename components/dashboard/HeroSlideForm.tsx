// components/dashboard/HeroSlideForm.tsx
"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { HeroSlideFormState } from "@/lib/validations/hero-slide";
import type { HeroSlideKind, HeroSlideLayout } from "@/app/generated/prisma/client";

type HeroSlide = {
  id: string;
  kind: HeroSlideKind;
  layout: HeroSlideLayout;
  badgeText: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  imageUrls: string[];
  price: number | null;
  discountLabel: string | null;
  couponCode: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  isActive: boolean;
  sortOrder: number;
};

const LAYOUTS: { value: HeroSlideLayout; label: string; hint: string }[] = [
  { value: "IMAGE_RIGHT", label: "Image Right", hint: "Text left, photo floats right" },
  { value: "IMAGE_LEFT", label: "Image Left", hint: "Photo floats left, text right" },
  { value: "FULL_BLEED", label: "Full Background", hint: "Full-bleed photo, text floats on top" },
  { value: "MULTI_IMAGE", label: "Multi-Image", hint: "A collage of up to 4 photos" },
];

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-neutral-900";

export default function HeroSlideForm({
  action,
  slide,
}: {
  action: (state: HeroSlideFormState, formData: FormData) => Promise<HeroSlideFormState>;
  slide?: HeroSlide;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [kind, setKind] = useState<HeroSlideKind>(slide?.kind ?? "FEATURED");
  const [layout, setLayout] = useState<HeroSlideLayout>(slide?.layout ?? "IMAGE_RIGHT");

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state.errors?._form && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.errors._form[0]}
        </div>
      )}

      {/* Kind */}
      <div>
        <label className="block text-sm font-medium mb-2">Slide Type</label>
        <div className="flex gap-2">
          {(["FEATURED", "OFFER"] as const).map((k) => (
            <label
              key={k}
              className={`flex-1 cursor-pointer rounded-md border px-4 py-2.5 text-center text-sm font-medium ${
                kind === k ? "border-neutral-900 bg-neutral-900 text-white" : "border-gray-300 text-gray-600"
              }`}
            >
              <input
                type="radio"
                name="kind"
                value={k}
                checked={kind === k}
                onChange={() => setKind(k)}
                className="sr-only"
              />
              {k === "FEATURED" ? "Featured Dish" : "Discount / Offer"}
            </label>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div>
        <label className="block text-sm font-medium mb-2">Layout</label>
        <div className="grid grid-cols-2 gap-3">
          {LAYOUTS.map((l) => (
            <label
              key={l.value}
              className={`cursor-pointer rounded-md border px-4 py-3 ${
                layout === l.value ? "border-neutral-900 ring-1 ring-neutral-900" : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="layout"
                value={l.value}
                checked={layout === l.value}
                onChange={() => setLayout(l.value)}
                className="sr-only"
              />
              <p className="text-sm font-medium text-neutral-900">{l.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{l.hint}</p>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="badgeText" className="block text-sm font-medium mb-1">
          Badge Text (optional)
        </label>
        <input
          id="badgeText"
          name="badgeText"
          defaultValue={slide?.badgeText ?? ""}
          placeholder="e.g. Chef's Pick, Limited Time"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={slide?.title}
          placeholder="e.g. Dragon Roll"
          className={inputClass}
        />
        {state.errors?.title && <p className="mt-1 text-sm text-red-600">{state.errors.title[0]}</p>}
      </div>

      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium mb-1">
          Subtitle (optional)
        </label>
        <input
          id="subtitle"
          name="subtitle"
          defaultValue={slide?.subtitle ?? ""}
          placeholder="e.g. Crafted Fresh, Every Single Day"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={slide?.description ?? ""}
          rows={3}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          defaultValue={slide?.imageUrl ?? ""}
          placeholder="https://..."
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">
          {layout === "FULL_BLEED"
            ? "Used as the full-bleed background photo."
            : "Used as the main floating dish photo."}
        </p>
      </div>

      {layout === "MULTI_IMAGE" && (
        <div>
          <label htmlFor="imageUrls" className="block text-sm font-medium mb-1">
            Additional Images
          </label>
          <textarea
            id="imageUrls"
            name="imageUrls"
            defaultValue={slide?.imageUrls?.join("\n") ?? ""}
            rows={4}
            placeholder={"One image URL per line, up to 4"}
            className={inputClass}
          />
        </div>
      )}

      {kind === "FEATURED" && (
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Price (optional)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={slide?.price ?? ""}
            className={inputClass}
          />
        </div>
      )}

      {kind === "OFFER" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="discountLabel" className="block text-sm font-medium mb-1">
              Discount Label
            </label>
            <input
              id="discountLabel"
              name="discountLabel"
              defaultValue={slide?.discountLabel ?? ""}
              placeholder="-10% or -€5.00"
              className={inputClass}
            />
            {state.errors?.discountLabel && (
              <p className="mt-1 text-sm text-red-600">{state.errors.discountLabel[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="couponCode" className="block text-sm font-medium mb-1">
              Coupon Code (optional)
            </label>
            <input
              id="couponCode"
              name="couponCode"
              defaultValue={slide?.couponCode ?? ""}
              placeholder="BENVENUTO10"
              className={inputClass}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="ctaLabel" className="block text-sm font-medium mb-1">
            Button Label (optional)
          </label>
          <input
            id="ctaLabel"
            name="ctaLabel"
            defaultValue={slide?.ctaLabel ?? ""}
            placeholder="Order Now"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ctaHref" className="block text-sm font-medium mb-1">
            Button Link (optional)
          </label>
          <input
            id="ctaHref"
            name="ctaHref"
            defaultValue={slide?.ctaHref ?? ""}
            placeholder="/menu"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="sortOrder" className="block text-sm font-medium mb-1">
          Sort Order
        </label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min="0"
          defaultValue={slide?.sortOrder ?? ""}
          placeholder="Lower shows first"
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={slide?.isActive ?? true}
          className="rounded"
        />
        <label htmlFor="isActive" className="text-sm font-medium">
          Active (shown in the homepage rotation)
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-neutral-900 text-white px-6 py-2.5 font-medium hover:bg-neutral-800 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <Link
          href="/dashboard/hero-slides"
          className="rounded-md border border-gray-300 px-6 py-2.5 font-medium hover:bg-gray-50 inline-flex items-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
