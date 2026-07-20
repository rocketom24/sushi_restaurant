// components/home/FeaturedMenuCarousel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import FeaturedMenuCard, { type FeaturedMenuItem } from "./FeaturedMenuCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The card row isn't manually swiped — it's tied to the page's own
 * vertical scroll. Scrolling down pans it left, scrolling back up pans it
 * right, over exactly the distance the section spends in the viewport.
 */
export default function FeaturedMenuCarousel({ items }: { items: FeaturedMenuItem[] }) {
  const { dict } = useI18n();
  const t = dict.home;
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (items.length === 0 || reducedMotion) return;
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    // An earlier section on this page (the scroll-video hero) pins itself
    // for several viewport-heights of scroll — creating this trigger
    // before that pin's reserved space is fully accounted for bakes in a
    // wrong (too-early) start/end that a later ScrollTrigger.refresh()
    // does not seem to correct in practice. Waiting for the page to fully
    // load before creating the trigger avoids the bad measurement instead
    // of trying to fix it after the fact.
    let ctx: gsap.Context | undefined;

    function setup() {
      ctx = gsap.context(() => {
        const distance = () => Math.max(0, track!.scrollWidth - viewport!.clientWidth);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }, section!);
    }

    if (document.readyState === "complete") {
      setup();
    } else {
      window.addEventListener("load", setup, { once: true });
    }

    return () => {
      window.removeEventListener("load", setup);
      ctx?.revert();
    };
  }, [items.length, reducedMotion]);

  if (items.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative py-24 md:py-28 overflow-hidden">
      {/* Dark perforated-panel texture — a fine dot grid under a radial
          vignette, brighter at the center and fading to the page's own
          night-black at the edges. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundColor: "var(--color-night)",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(ellipse 80% 60% at 50% 45%, #21232b 0%, var(--color-night) 75%)",
          backgroundSize: "15px 15px, 100% 100%",
        }}
      />

      {/* Top/bottom fade — blends this section into the sections above and
          below it instead of a hard handoff. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, var(--color-night) 0%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--color-night) 0%, transparent 100%)" }}
      />

      <div className="relative px-6 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
          <div>
            <span className="text-accent text-xs font-semibold uppercase tracking-widest">
              {t.featuredEyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif mt-2 text-cream">{t.featuredTitle}</h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-accent transition-colors duration-300"
          >
            {t.seeFullMenu}
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/*
          The viewport clips the track horizontally; pt-12/pb-8 give hover
          effects (glow bloom, lift, image zoom) vertical headroom so they
          don't get clipped by that same overflow boundary. Reduced-motion
          users get a plain native horizontal scroll instead of the
          scroll-tied pan.
        */}
        <div
          ref={viewportRef}
          className={`pt-12 pb-8 -mx-6 px-6 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24 ${
            reducedMotion ? "overflow-x-auto no-scrollbar" : "overflow-hidden"
          }`}
        >
          <div ref={trackRef} className="flex gap-6 w-max">
            {items.map((item, i) => (
              <FeaturedMenuCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
