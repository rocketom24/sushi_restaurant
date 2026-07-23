// components/home/TestimonialCard.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import StarRating from "@/components/ui/StarRating";
import type { PublicReview } from "@/lib/actions/review.actions";

const AVATAR_COLORS = [
  "bg-accent/20 text-accent",
  "bg-cream-vanilla/20 text-cream-vanilla",
  "bg-crimson-silk/25 text-crimson-silk",
];

export default function TestimonialCard({
  review,
  index,
  dateLabel,
}: {
  review: PublicReview;
  index: number;
  dateLabel: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const initial = review.customerName.trim().charAt(0).toUpperCase() || "?";
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div
      ref={cardRef}
      data-testimonial-card
      className={`group relative shrink-0 snap-start basis-full sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)] ${
        isInView ? "card-pop-in-animation" : "opacity-0"
      }`}
      style={{ animationDelay: `${Math.min(index, 6) * 90}ms` }}
    >
      <div
        aria-hidden
        className="absolute -inset-2 rounded-3xl bg-accent/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
      />
      <div className="h-full flex flex-col rounded-3xl bg-carbon/70 ring-1 ring-white/10 p-6 transition-all duration-500 group-hover:ring-accent/40 group-hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div
            aria-hidden
            className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center font-serif text-lg ${avatarColor}`}
          >
            {initial}
          </div>
          <div>
            <p className="text-cream text-sm font-medium">{review.customerName}</p>
            <p className="text-gray-500 text-xs">{dateLabel}</p>
          </div>
        </div>

        <StarRating rating={review.rating} size="text-sm" />

        <p className="font-serif text-lg text-cream mt-3">{review.title}</p>
        <p className="text-sm text-gray-400 font-light leading-relaxed mt-2 line-clamp-4">
          {review.comment}
        </p>
      </div>
    </div>
  );
}
