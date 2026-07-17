// components/dashboard/HeroSlideTable.tsx
"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleHeroSlideActiveAction, deleteHeroSlideAction } from "@/lib/actions/hero-slides.actions";
import type { HeroSlideKind, HeroSlideLayout } from "@/app/generated/prisma/client";

type HeroSlideRow = {
  id: string;
  kind: HeroSlideKind;
  layout: HeroSlideLayout;
  title: string;
  imageUrl: string | null;
  price: number | null;
  discountLabel: string | null;
  isActive: boolean;
  sortOrder: number;
};

const LAYOUT_LABELS: Record<HeroSlideLayout, string> = {
  IMAGE_RIGHT: "Image Right",
  IMAGE_LEFT: "Image Left",
  FULL_BLEED: "Full Background",
  MULTI_IMAGE: "Multi-Image",
};

export default function HeroSlideTable({ slides }: { slides: HeroSlideRow[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggle(id: string) {
    startTransition(async () => {
      await toggleHeroSlideActiveAction(id);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this hero slide? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteHeroSlideAction(id);
      if (result?.error) alert(result.error);
      else router.refresh();
    });
  }

  if (slides.length === 0) {
    return <p className="text-gray-500 text-center py-12">No hero slides yet.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
          <th className="py-3 px-4">Preview</th>
          <th className="py-3 px-4">Title</th>
          <th className="py-3 px-4">Kind</th>
          <th className="py-3 px-4">Layout</th>
          <th className="py-3 px-4">Order</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {slides.map((s) => (
          <tr key={s.id} className="border-b border-gray-100">
            <td className="py-3 px-4">
              <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-xl">
                {s.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : s.kind === "OFFER" ? (
                  "🏷️"
                ) : (
                  "🍣"
                )}
              </div>
            </td>
            <td className="py-3 px-4 font-medium text-neutral-900">
              {s.title}
              {s.kind === "OFFER" && s.discountLabel && (
                <span className="ml-2 text-xs text-gray-400">{s.discountLabel}</span>
              )}
              {s.kind === "FEATURED" && s.price !== null && (
                <span className="ml-2 text-xs text-gray-400">€{s.price.toFixed(2)}</span>
              )}
            </td>
            <td className="py-3 px-4 text-gray-600 text-sm">
              {s.kind === "OFFER" ? "Offer" : "Featured"}
            </td>
            <td className="py-3 px-4 text-gray-600 text-sm">{LAYOUT_LABELS[s.layout]}</td>
            <td className="py-3 px-4 text-gray-600 text-sm">{s.sortOrder}</td>
            <td className="py-3 px-4">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {s.isActive ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="py-3 px-4 space-x-3 whitespace-nowrap">
              <Link
                href={`/dashboard/hero-slides/${s.id}/edit`}
                className="text-sm text-neutral-900 underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleToggle(s.id)}
                disabled={isPending}
                className="text-sm text-neutral-600 underline disabled:opacity-50"
              >
                {s.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                disabled={isPending}
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
