// app/dashboard/hero-slides/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import HeroSlideForm from "@/components/dashboard/HeroSlideForm";
import { getHeroSlideById, updateHeroSlideAction } from "@/lib/actions/hero-slides.actions";

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slide = await getHeroSlideById(id);

  if (!slide) notFound();

  const updateWithId = updateHeroSlideAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Edit Hero Slide</h1>
      <HeroSlideForm action={updateWithId} slide={slide} />
    </div>
  );
}
