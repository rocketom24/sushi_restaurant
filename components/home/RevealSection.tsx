// components/home/RevealSection.tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Wraps a landing-page section so it fades/slides in the first time it
 * scrolls into view, instead of appearing fully rendered with the rest of
 * the page. Mirrors the observe-once pattern already used for individual
 * cards (FeaturedMenuCard, MenuCard) — just promoted to whole-section scale.
 */
export default function RevealSection({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </section>
  );
}
