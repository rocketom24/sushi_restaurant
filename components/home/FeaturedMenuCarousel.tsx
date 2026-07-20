// components/home/FeaturedMenuCarousel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import FeaturedMenuCard, { type FeaturedMenuItem } from "./FeaturedMenuCard";
import { SCROLL_VIDEO_READY_EVENT } from "./ScrollVideoSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/**
 * The card row isn't manually swiped — it's tied to the page's own
 * vertical scroll. Scrolling down pans it left, scrolling back up pans it
 * right, over exactly the distance the section spends in the viewport.
 * The arrow buttons drive the same mechanism (they animate the page's
 * scroll position to where that pan amount would land), so there's a
 * single source of truth for "how far panned" instead of two competing
 * animations fighting over the track's position.
 */
export default function FeaturedMenuCarousel({ items }: { items: FeaturedMenuItem[] }) {
  const { dict } = useI18n();
  const t = dict.home;
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (items.length === 0 || reducedMotion) return;
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track!.scrollWidth - viewport!.clientWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setAtStart(self.progress <= 0.001);
            setAtEnd(self.progress >= 0.999);
          },
          onRefresh: () => setHasOverflow(distance() > 0),
        },
      });
      scrollTriggerRef.current = tween.scrollTrigger ?? null;
      setHasOverflow(distance() > 0);
    }, section);

    // An earlier section on this page (the scroll-video hero) pins itself
    // for several viewport-heights of scroll, and that reserved space only
    // exists once its async frame decode resolves — which can land before
    // or after this component mounts depending on cache state. A one-time
    // "load"/ready-event refresh isn't enough to guarantee correctness on
    // every load: any further height change after that point (a late font
    // swap, a delayed image, the pin-spacer settling to a slightly
    // different size) silently leaves this trigger's start/end stale.
    // Watching the document's actual height instead of guessing which
    // events matter is what makes the position correct on every load,
    // not just the ones where the timing happens to line up.
    let refreshTimer: ReturnType<typeof setTimeout>;
    function scheduleRefresh() {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 50);
    }
    const resizeObserver = new ResizeObserver(scheduleRefresh);
    resizeObserver.observe(document.body);
    window.addEventListener("load", scheduleRefresh);
    window.addEventListener(SCROLL_VIDEO_READY_EVENT, scheduleRefresh);

    return () => {
      clearTimeout(refreshTimer);
      resizeObserver.disconnect();
      window.removeEventListener("load", scheduleRefresh);
      window.removeEventListener(SCROLL_VIDEO_READY_EVENT, scheduleRefresh);
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, [items.length, reducedMotion]);

  // Reduced-motion cards scroll natively (no ScrollTrigger involved), so
  // the buttons' enabled/visible state is driven off the viewport's own
  // scroll position instead of a GSAP progress value.
  useEffect(() => {
    if (!reducedMotion) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    function update() {
      const max = viewport!.scrollWidth - viewport!.clientWidth;
      setHasOverflow(max > 1);
      setAtStart(viewport!.scrollLeft <= 1);
      setAtEnd(viewport!.scrollLeft >= max - 1);
    }
    update();
    viewport.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(viewport);
    return () => {
      viewport.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [reducedMotion, items.length]);

  function panBy(direction: 1 | -1) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    if (reducedMotion) {
      const track = trackRef.current;
      const firstCard = track?.firstElementChild as HTMLElement | null;
      const cardStep = firstCard ? firstCard.getBoundingClientRect().width + 24 : viewport.clientWidth * 0.8;
      viewport.scrollBy({ left: direction * cardStep, behavior: "smooth" });
      return;
    }

    const st = scrollTriggerRef.current;
    const track = trackRef.current;
    if (!st || !track) return;
    const dist = Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (dist <= 0) return;

    // Step by one card at a time (its rendered width plus the gap-6 gap),
    // so the buttons read as "next/previous item" regardless of how much
    // total overflow there is, rather than jumping a fixed screen-fraction
    // that might cover the entire range in a single click.
    const firstCard = track.firstElementChild as HTMLElement | null;
    const cardStep = firstCard ? firstCard.getBoundingClientRect().width + 24 : viewport.clientWidth * 0.8;
    const step = Math.min(cardStep, dist);
    const targetProgress = Math.min(1, Math.max(0, st.progress + direction * (step / dist)));
    const targetScroll = st.start + targetProgress * (st.end - st.start);

    gsap.to(window, {
      duration: 0.9,
      ease: "power2.inOut",
      scrollTo: { y: targetScroll },
    });
  }

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
          scroll-tied pan. Cards grow to fill the row when there are only a
          few of them (so the section never looks half-empty) and only
          overflow — enabling the pan and the arrow buttons — once there
          are enough of them that they can't all fit at a reasonable size.
        */}
        <div
          ref={viewportRef}
          className={`relative pt-12 pb-8 -mx-6 px-6 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24 ${
            reducedMotion ? "overflow-x-auto no-scrollbar" : "overflow-hidden"
          }`}
        >
          <div ref={trackRef} className="flex gap-6">
            {items.map((item, i) => (
              <FeaturedMenuCard key={item.id} item={item} index={i} />
            ))}
          </div>

          {hasOverflow && (
            <>
              <button
                type="button"
                onClick={() => panBy(-1)}
                disabled={atStart}
                aria-label={t.prevSlide}
                className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/10 hover:border-accent bg-black/50 backdrop-blur-md items-center justify-center text-gray-300 hover:text-white transition-all duration-300 text-lg disabled:opacity-0 disabled:pointer-events-none"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => panBy(1)}
                disabled={atEnd}
                aria-label={t.nextSlide}
                className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/10 hover:border-accent bg-black/50 backdrop-blur-md items-center justify-center text-gray-300 hover:text-white transition-all duration-300 text-lg disabled:opacity-0 disabled:pointer-events-none"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
