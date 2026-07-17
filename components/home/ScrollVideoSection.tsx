"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/components/i18n/I18nProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 160;
const framePath = (i: number) => `/videos/frames/frame-${String(i + 1).padStart(4, "0")}.jpg`;

// Scroll distance while pinned — not tied to the source clip's real-time
// duration since frames are scrubbed, not played back. Long enough that
// the sequence reads as deliberate motion, not a quick flick.
const PIN_VH = 350;

/**
 * Cinematic scroll-scrubbed hero, directly below the hero banner.
 *
 * Renders a pre-extracted JPEG frame sequence onto a <canvas> instead of
 * seeking a <video> element — native video seeking has to decode from the
 * nearest keyframe on every scroll tick, which is what caused the earlier
 * stutter. Pre-decoded still frames drawn to canvas are effectively
 * instant, so scrubbing tracks scroll 1:1 with no lag in either direction.
 */
export default function ScrollVideoSection() {
  const { dict } = useI18n();
  const t = dict.home;

  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  function drawFrame(index: number) {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0 || canvas.width === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // object-cover math: fill the canvas, cropping the overflow axis —
    // this is what made the frame look "halved" when it ran against a
    // stale canvas size after a resize (fixed by resizeCanvas below).
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let drawWidth: number, drawHeight: number, dx: number, dy: number;
    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgRatio;
      dx = (canvas.width - drawWidth) / 2;
      dy = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgRatio;
      dx = 0;
      dy = (canvas.height - drawHeight) / 2;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
  }

  // Preload and fully decode every frame before enabling scrub — decode()
  // (unlike a bare onload) guarantees the browser has finished the actual
  // pixel decode, so the first draw of each frame never janks the thread.
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loadedCount = 0;

    const jobs = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new window.Image();
      img.src = framePath(i);
      images[i] = img;
      return img
        .decode()
        .then(() => {
          loadedCount++;
        })
        .catch(() => {});
    });

    Promise.all(jobs).then(() => {
      if (cancelled) return;
      imagesRef.current = images;
      if (loadedCount === 0) {
        setLoadError(true);
      } else {
        setIsReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const textEl = textRef.current;
    if (!section || !canvas) return;

    // Size the canvas off the viewport directly, not section.clientWidth/
    // Height — while GSAP has the section pinned, its box is held inside a
    // pin-spacer that freezes at its dimensions from the last refresh, so
    // reading the section's own box mid-resize can return a stale value
    // (this is what produced the "halved" image on short/tall windows).
    // The section is always exactly viewport-sized (h-screen, w-full), so
    // window dimensions are the correct, always-current source of truth.
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      drawFrame(currentFrameRef.current);
    }

    resizeCanvas();

    let resizeTimer: ReturnType<typeof setTimeout>;
    function handleResize() {
      // Debounced: a window being dragged fires many resize events per
      // second, and re-measuring/refreshing on every one is wasted work.
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        ScrollTrigger.refresh();
      }, 150);
    }

    window.addEventListener("resize", handleResize);
    // GSAP's own refresh (from this resize, an orientation change, fonts
    // loading, etc.) recalculates the pin — redraw once it settles so the
    // canvas never shows a frame sized for the previous layout.
    ScrollTrigger.addEventListener("refresh", resizeCanvas);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // No scroll-jacking for reduced-motion users — settle on a single
      // representative frame, fully visible from the start.
      gsap.set(section, { opacity: 1 });
      if (textEl) gsap.set(textEl, { opacity: 1, y: 0 });
      drawFrame(Math.floor(FRAME_COUNT / 2));
      return () => {
        window.removeEventListener("resize", handleResize);
        ScrollTrigger.removeEventListener("refresh", resizeCanvas);
        clearTimeout(resizeTimer);
      };
    }

    drawFrame(0);

    const triggers: ScrollTrigger[] = [];
    const pinDistance = window.innerHeight * (PIN_VH / 100);

    // Stage 1 — fade the section in as it enters the viewport (before pin).
    const fadeIn = gsap.fromTo(
      section,
      { opacity: 0 },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      }
    );
    if (fadeIn.scrollTrigger) triggers.push(fadeIn.scrollTrigger);

    // Stage 2 — pin in place; scroll position selects the frame to draw.
    triggers.push(
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const index = Math.min(FRAME_COUNT - 1, Math.round(self.progress * (FRAME_COUNT - 1)));
          if (index !== currentFrameRef.current) {
            currentFrameRef.current = index;
            drawFrame(index);
          }
        },
      })
    );

    // Stage 3 — tagline eases in over the first half of the scrub.
    if (textEl) {
      const textIn = gsap.fromTo(
        textEl,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${pinDistance * 0.5}`,
            scrub: true,
          },
        }
      );
      if (textIn.scrollTrigger) triggers.push(textIn.scrollTrigger);
    }

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.removeEventListener("refresh", resizeCanvas);
      clearTimeout(resizeTimer);
    };
  }, [isReady]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-night">
      {!loadError ? (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-carbon to-night flex items-center justify-center">
          <span aria-hidden className="text-8xl opacity-20 select-none">
            🍣
          </span>
        </div>
      )}

      {/* Top/bottom vignette — fades to the exact page background color at
          the edges so the section blends into its neighbors instead of
          showing a hard-edged rectangle of footage. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-night) 0%, transparent 16%, transparent 82%, var(--color-night) 100%)",
        }}
      />

      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      >
        {/* Frosted plaque behind the copy — the footage runs from pale
            rice to near-black, so light text alone (or dark text alone)
            washes out against half of it. A dedicated light surface keeps
            dark text readable no matter what's playing behind it. */}
        <div className="bg-cream/90 backdrop-blur-sm rounded-2xl px-8 py-6 sm:px-12 sm:py-8 shadow-2xl">
          <span className="text-accent text-xs font-semibold uppercase tracking-widest">
            {t.scrollVideoEyebrow}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-6xl font-serif text-night max-w-2xl leading-tight">
            {t.scrollVideoTagline}
          </h2>
        </div>
      </div>
    </section>
  );
}
