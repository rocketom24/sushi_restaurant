// app/dashboard/hero-slides/new/page.tsx

import HeroSlideForm from "@/components/dashboard/HeroSlideForm";
import { createHeroSlideAction } from "@/lib/actions/hero-slides.actions";

export default function NewHeroSlidePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">New Hero Slide</h1>
      <HeroSlideForm action={createHeroSlideAction} />
    </div>
  );
}
