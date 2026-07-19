"use client";

import { useEffect, useState } from "react";

/**
 * Wraps the header's existing content (unchanged) and drives a
 * "resizable navbar" effect: a full-bleed flat bar at the top of the
 * page that shrinks into a floating, rounded, blurred pill once the
 * page scrolls past a small threshold — pure CSS transitions on a
 * scroll-driven class toggle, no animation library required.
 *
 * Genuinely translucent (not just a dark bar with a hint of blur) —
 * low background opacity + heavy backdrop blur + a saturation boost,
 * so whatever scrolls underneath (hero photos, the smoke background,
 * page content) stays visible as a soft frosted blur instead of being
 * hidden behind a near-solid panel.
 */
export default function FloatingHeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div
        className={`mx-auto transition-all duration-500 ease-out backdrop-saturate-150 ${
          scrolled
            ? "mt-3 max-w-4xl rounded-full border border-white/15 bg-night/35 shadow-2xl shadow-black/40 backdrop-blur-2xl px-2"
            : "mt-0 max-w-7xl rounded-none border-b border-white/10 bg-night/30 shadow-none backdrop-blur-xl px-4 sm:px-6"
        }`}
      >
        {children}
      </div>
    </header>
  );
}
