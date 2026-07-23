// app/dashboard/hero-slides/page.tsx

import Link from "next/link";
import { getHeroSlidesForDashboard } from "@/lib/actions/hero-slides.actions";
import HeroSlideTable from "@/components/dashboard/HeroSlideTable";

export default async function HeroSlidesPage() {
  const slides = await getHeroSlidesForDashboard();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Hero Slides</h1>
          <p className="text-sm text-gray-500 mt-1">
            Rotating home-page banner — pick each slide&apos;s layout, copy, image and offer.
          </p>
        </div>
        <Link
          href="/dashboard/hero-slides/new"
          className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800"
        >
          + New Slide
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <HeroSlideTable slides={slides} />
      </div>
    </div>
  );
}
