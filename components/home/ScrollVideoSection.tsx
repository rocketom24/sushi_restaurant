"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/components/i18n/I18nProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VIDEO_SRC = "/videos/hero-scroll.mp4";
// The clip is ~6s of source footage — scrubbed, not played in real time, so
// this is scroll distance, not playback duration. Long enough to feel
// deliberate without holding the scroll hostage for a short clip, and long
// enough that each scroll-pixel maps to a small enough time delta that
// individual video seeks stay cheap (see seekTo below).
const PIN_VH = 350;

/**
 * Cinematic scroll-scrubbed video, directly below the hero banner.
 * The clip fades in as it enters view, then pins while its currentTime is
 * driven by scroll progress — playing forward on scroll down, reversing on
 * scroll up — before releasing back into normal scroll.
 */
export default function ScrollVideoSection() {
  const { dict } = useI18n();
  const t = dict.home;

  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoError) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    const textEl = textRef.current;
    if (!section || !video) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // No scroll-jacking for reduced-motion users — just a normal, calm
      // muted loop, fully visible from the start.
      gsap.set(section, { opacity: 1 });
      if (textEl) gsap.set(textEl, { opacity: 1, y: 0 });
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    video.pause();

    // Setting video.currentTime directly on every scroll tick outruns the
    // decoder — each seek queues behind the last, and the backlog is what
    // reads as lag/stutter. Gate seeks on the browser's own "seeked" event
    // so we never have more than one in flight; if scroll moves again
    // before the current seek resolves, only the latest target is kept.
    let isSeeking = false;
    let pendingTime: number | null = null;

    function seekTo(time: number) {
      if (!video) return;
      const clamped = Math.max(0, Math.min(video.duration || 0, time));
      if (isSeeking) {
        pendingTime = clamped;
        return;
      }
      if (Math.abs(video.currentTime - clamped) < 0.01) return;
      isSeeking = true;
      video.currentTime = clamped;
    }

    function handleSeeked() {
      isSeeking = false;
      if (pendingTime !== null) {
        const next = pendingTime;
        pendingTime = null;
        seekTo(next);
      }
    }

    video.addEventListener("seeked", handleSeeked);

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

    // Stage 2 — pin in place; scroll position drives the video's frame.
    triggers.push(
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          if (video.duration) {
            seekTo(self.progress * video.duration);
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
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [videoError]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-night">
      {!videoError ? (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-carbon to-night flex items-center justify-center">
          <span aria-hidden className="text-8xl opacity-20 select-none">
            🍣
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-night/70 via-night/5 to-night/40" />

      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      >
        <span className="text-accent text-xs font-semibold uppercase tracking-widest">
          {t.scrollVideoEyebrow}
        </span>
        <h2 className="mt-4 text-4xl md:text-6xl font-serif text-cream max-w-2xl leading-tight drop-shadow-lg">
          {t.scrollVideoTagline}
        </h2>
      </div>
    </section>
  );
}
