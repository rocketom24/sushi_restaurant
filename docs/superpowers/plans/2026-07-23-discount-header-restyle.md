# Discount Header Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the `isOffer` branch of `components/home/hero/FullBleedSlide.tsx` (the "Happy Hour" / "Weekend Special" discount slides) to match the supplied "sushi discount header" mockup — centered image, dual scrolling marquees, orbiting discount badge, ruby/near-black palette — with zero changes to slide data, Prisma schema, dashboard editing, or the `FEATURED`/non-offer rendering path.

**Architecture:** Two small new pieces (a `DiscountMarquee` component, a new `variant="orbit"` on the existing shared `DiscountBadge`) plus a font load and a set of `prefers-reduced-motion`-gated keyframes, composed together inside `FullBleedSlide`'s existing `isOffer` conditional. No new files outside `components/home/hero/`, no touches to `HeroSlideData`, `HeroShowcase.tsx`, the dashboard form, or `ImageSideSlide.tsx`/`MultiImageSlide.tsx`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (`@theme` tokens in `app/globals.css`), `next/font/google`. No test framework is installed in this repo (no jest/vitest) — verification follows the project's existing convention of `tsc`/`eslint` plus a Playwright browser sweep (see `.claude/skills/verify/SKILL.md`), not unit tests.

## Global Constraints

- Design source of truth: `docs/superpowers/specs/2026-07-23-discount-header-restyle-design.md` — every task below implements a section of it.
- Color mapping (use these Tailwind tokens/CSS vars, never new hex literals): bg → `night` / `bg-night`; ruby accent → `accent` / `text-accent` / `var(--color-accent)`; dark red → `deep-bordeaux` / `var(--color-deep-bordeaux)`; cream text → `cream` / `platinum`.
- New font: Bebas Neue, loaded once in `app/layout.tsx` as CSS var `--font-marquee`, exposed as utility class `.font-marquee` in `app/globals.css` (same pattern as the existing `.font-hero`). Used only for marquee text and the orbit badge's numeral/labels.
- Every new CSS animation must follow the codebase's existing accessibility pattern exactly: the trigger class defaults to `animation: none`; the real `animation:` declaration only exists inside `@media (prefers-reduced-motion: no-preference)`. See `.ken-burns-animation`, `.badge-pop-animation` in `app/globals.css:291-341` for the reference pattern.
- `DiscountBadge.tsx`'s existing default rendering (no `variant` prop passed) must remain byte-for-byte identical — `ImageSideSlide.tsx` and `MultiImageSlide.tsx` both call it with no `variant` prop and must not change visually.
- No new i18n dictionary keys. Marquee row text and the bottom tagline are static English decorative strings (not `slide` data, not run through `dict`) — this is an intentional, documented scope decision, not an oversight.
- `FullBleedSlide`'s non-offer (`FEATURED`) rendering path — full-bleed cover photo, Ken Burns zoom, bottom-left copy, `SushiConveyor` — must not change at all.

---

## File Structure

- Modify: `app/layout.tsx` — add Bebas Neue font load.
- Modify: `app/globals.css` — add `.font-marquee` utility, add marquee-scroll and badge-orbit keyframes/animation classes.
- Create: `components/home/hero/DiscountMarquee.tsx` — one infinite-scrolling decorative text row (used twice, mirrored).
- Modify: `components/home/hero/DiscountBadge.tsx` — add `variant?: "stamp" | "orbit"` prop; `"stamp"` (default) is today's unchanged rendering, `"orbit"` is the new richer badge.
- Modify: `components/home/hero/FullBleedSlide.tsx` — rebuild the `isOffer` JSX branch to the new layout; `FEATURED` branch untouched.

---

### Task 1: Load Bebas Neue font

**Files:**
- Modify: `app/layout.tsx:1-20`, `:45-47`
- Modify: `app/globals.css` (near line 84, `.font-hero`)

**Interfaces:**
- Produces: CSS var `--font-marquee` (available globally via `body` className), utility class `.font-marquee` (usable as `className="font-marquee"` anywhere).

- [ ] **Step 1: Add the font import and const in `app/layout.tsx`**

Change the import on line 2:

```tsx
import { EB_Garamond, Geist_Mono, Plus_Jakarta_Sans, Bebas_Neue } from "next/font/google";
```

Add after the `jakarta` const (after line 20):

```tsx
const bebasNeue = Bebas_Neue({
  variable: "--font-marquee",
  subsets: ["latin"],
  weight: "400",
});
```

- [ ] **Step 2: Add the font variable to the body className**

Change line 46 from:

```tsx
className={`${jakarta.variable} ${geistMono.variable} ${ebGaramond.variable} antialiased`}
```

to:

```tsx
className={`${jakarta.variable} ${geistMono.variable} ${ebGaramond.variable} ${bebasNeue.variable} antialiased`}
```

- [ ] **Step 3: Add the `.font-marquee` utility class in `app/globals.css`**

Insert directly after the existing `.font-hero` block (after line 87):

```css
/* Condensed poster face for the discount-header marquee text and the
 * orbit discount badge — the site's other two fonts (EB Garamond,
 * Plus Jakarta Sans) don't have a bold condensed weight that reads at
 * small marquee sizes. */
.font-marquee {
  font-family: var(--font-marquee), sans-serif;
}
```

- [ ] **Step 4: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "Load Bebas Neue for the discount-header marquee/badge"
```

---

### Task 2: Add marquee-scroll and badge-orbit keyframes

**Files:**
- Modify: `app/globals.css` (append near the end of the animation section, after line 341 `.sale-badge-pulse-animation`)

**Interfaces:**
- Produces: classes `.discount-marquee-right-animation`, `.discount-marquee-left-animation`, `.badge-orbit-ring-animation`, `.badge-orbit-pulse-animation` — all safe to apply unconditionally (they no-op without `prefers-reduced-motion: no-preference`).

- [ ] **Step 1: Add the keyframes and gated animation classes**

Insert after the `.sale-badge-pulse-animation` rule inside the existing `@media (prefers-reduced-motion: no-preference)` block (after line 341, before its closing `}` on line 342) — and add the keyframes above that block, next to the other `@keyframes` (after `sale-badge-pulse`, i.e. after line 267):

```css
/* Discount-header marquee rows — two infinite duplicated-content loops,
   one per direction, same translateX(-50%) technique as the sushi
   conveyor belt. */
@keyframes discount-marquee-right {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes discount-marquee-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Orbit discount badge — rotating dashed ring plus an idle glow/scale
   pulse on the badge itself. */
@keyframes badge-orbit-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes badge-orbit-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 24px 4px rgba(155, 27, 48, 0.55);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 0 36px 10px rgba(155, 27, 48, 0.85);
  }
}
```

Then extend the existing "off by default" list (line 291-302) to include the four new classes, changing:

```css
.ken-burns-animation,
.conveyor-animation,
.tile-in-animation,
.reveal-1,
.reveal-2,
.reveal-3,
.reveal-4,
.badge-pop-animation,
.card-pop-in-animation,
.sale-badge-pulse-animation {
  animation: none;
}
```

to:

```css
.ken-burns-animation,
.conveyor-animation,
.tile-in-animation,
.reveal-1,
.reveal-2,
.reveal-3,
.reveal-4,
.badge-pop-animation,
.card-pop-in-animation,
.sale-badge-pulse-animation,
.discount-marquee-right-animation,
.discount-marquee-left-animation,
.badge-orbit-ring-animation,
.badge-orbit-pulse-animation {
  animation: none;
}
```

And extend the `@media (prefers-reduced-motion: no-preference)` block (line 304-342) by adding, right before its final closing `}`:

```css
  .discount-marquee-right-animation {
    animation: discount-marquee-right 28s linear infinite;
  }
  .discount-marquee-left-animation {
    animation: discount-marquee-left 28s linear infinite;
  }
  .badge-orbit-ring-animation {
    animation: badge-orbit-spin 8s linear infinite;
  }
  .badge-orbit-pulse-animation {
    animation: badge-orbit-pulse 2.2s ease-in-out infinite;
  }
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors (pure CSS change, but confirms nothing else broke).

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "Add marquee-scroll and badge-orbit keyframes"
```

---

### Task 3: Create `DiscountMarquee` component

**Files:**
- Create: `components/home/hero/DiscountMarquee.tsx`

**Interfaces:**
- Consumes: `.font-marquee` (Task 1), `.discount-marquee-right-animation` / `.discount-marquee-left-animation` (Task 2), `text-accent` / `text-cream` (existing tokens).
- Produces: `export default function DiscountMarquee({ direction }: { direction: "left" | "right" })` — self-contained, no props beyond direction, no data dependency.

- [ ] **Step 1: Create the component**

```tsx
// components/home/hero/DiscountMarquee.tsx
//
// One infinite-scrolling row of decorative food-name / discount text,
// used above and below the offer slide's centered image. Content is
// static English flavor text — not slide data, not run through i18n —
// duplicated once so the loop point is seamless.

type MarqueeItem = { text: string; highlight?: boolean };

const TOP_ITEMS: MarqueeItem[] = [
  { text: "DRAGON ROLL" },
  { text: "20% OFF", highlight: true },
  { text: "SALMON NIGIRI" },
  { text: "TUNA SASHIMI" },
  { text: "30% OFF", highlight: true },
  { text: "SPICY TUNA" },
  { text: "RAINBOW ROLL" },
  { text: "15% OFF", highlight: true },
];

const BOTTOM_ITEMS: MarqueeItem[] = [
  { text: "MAKI ROLLS" },
  { text: "25% OFF", highlight: true },
  { text: "CALIFORNIA ROLL" },
  { text: "EDAMAME" },
  { text: "40% OFF", highlight: true },
  { text: "TEMPURA ROLL" },
  { text: "CHIRASHI BOWL" },
  { text: "35% OFF", highlight: true },
];

export default function DiscountMarquee({ direction }: { direction: "left" | "right" }) {
  const items = direction === "left" ? BOTTOM_ITEMS : TOP_ITEMS;
  const row = [...items, ...items];
  const animationClass =
    direction === "left" ? "discount-marquee-left-animation" : "discount-marquee-right-animation";

  return (
    <div aria-hidden className="hidden sm:block w-full overflow-hidden py-2 md:py-3">
      <div className={`flex items-center w-max gap-6 md:gap-10 whitespace-nowrap ${animationClass}`}>
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-6 md:gap-10">
            <span
              className={
                item.highlight
                  ? "font-marquee text-lg md:text-2xl tracking-wide text-accent drop-shadow-[0_0_10px_rgba(155,27,48,0.8)]"
                  : "font-marquee text-base md:text-xl tracking-wide text-cream/42"
              }
            >
              {item.text}
            </span>
            <span className="text-cream/20">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
```

Note: `hidden sm:block` on the outer wrapper is the "hide marquee on mobile" responsive requirement from the spec.

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/home/hero/DiscountMarquee.tsx
git commit -m "Add DiscountMarquee component"
```

---

### Task 4: Add `orbit` variant to `DiscountBadge`

**Files:**
- Modify: `components/home/hero/DiscountBadge.tsx` (full file, currently 34 lines)

**Interfaces:**
- Consumes: `.font-marquee` (Task 1), `.badge-orbit-ring-animation` / `.badge-orbit-pulse-animation` (Task 2), `var(--color-accent)` / `var(--color-deep-bordeaux)` (existing).
- Produces: `DiscountBadge({ label, active, size?, variant? })` — `variant` defaults to `"stamp"` (today's exact behavior). Existing callers in `ImageSideSlide.tsx:132` and `MultiImageSlide.tsx:87` pass no `variant` and are therefore unaffected.

- [ ] **Step 1: Replace the file contents**

```tsx
// components/home/hero/DiscountBadge.tsx
//
// A big rotated "stamp" for offer slides — the discount is the whole
// point of these slides, so it gets the boldest treatment on the page
// rather than reading as another line of body copy.
//
// variant "stamp" (default) is the original dashed-circle stamp used by
// ImageSideSlide/MultiImageSlide — unchanged. variant "orbit" is a
// richer treatment (rotating dashed ring, gradient fill, idle pulse)
// used only by FullBleedSlide's offer layout.

export default function DiscountBadge({
  label,
  active,
  size = "md",
  variant = "stamp",
}: {
  label: string;
  active: boolean;
  size?: "md" | "lg";
  variant?: "stamp" | "orbit";
}) {
  if (variant === "orbit") {
    return (
      <div
        className={`relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-[148px] md:h-[148px] rotate-[-8deg] ${
          active ? "badge-orbit-pulse-animation" : "opacity-0"
        }`}
      >
        <div
          aria-hidden
          className={`absolute inset-0 rounded-full border-2 border-dashed border-accent/55 ${
            active ? "badge-orbit-ring-animation" : ""
          }`}
        />
        <div aria-hidden className="absolute inset-2 rounded-full border border-cream/40" />
        <div
          className="absolute inset-3 rounded-full flex flex-col items-center justify-center text-center shadow-2xl shadow-black/60"
          style={{
            background: "linear-gradient(135deg, var(--color-accent), var(--color-deep-bordeaux))",
          }}
        >
          <span className="font-marquee text-[0.5rem] md:text-[0.6rem] tracking-[0.2em] text-cream/80 uppercase">
            Up To
          </span>
          <span className="font-marquee text-2xl md:text-4xl text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.55)]">
            {label}
          </span>
          <span className="font-marquee text-[0.55rem] md:text-[0.65rem] tracking-[0.2em] text-cream/80 uppercase">
            Off Today
          </span>
        </div>
      </div>
    );
  }

  const dims = size === "lg" ? "w-28 h-28 md:w-40 md:h-40" : "w-24 h-24 md:w-32 md:h-32";
  const numeral = size === "lg" ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl";

  return (
    <div
      className={`${dims} shrink-0 rounded-full bg-deep-bordeaux border-4 border-dashed border-white/50 shadow-2xl shadow-black/50 flex flex-col items-center justify-center rotate-[8deg] ${
        active ? "badge-pop-animation" : "opacity-0"
      }`}
    >
      <span className={`${numeral} font-serif font-black text-white leading-none drop-shadow-md`}>
        {label}
      </span>
      <span className="mt-1 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
        Off
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Confirm the two existing callers are unaffected**

Run: `grep -n "DiscountBadge" components/home/hero/ImageSideSlide.tsx components/home/hero/MultiImageSlide.tsx`
Expected: both call sites pass only `label` and `active` (no `variant`) — confirming they fall through to the unchanged `"stamp"` branch.

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/home/hero/DiscountBadge.tsx
git commit -m "Add orbit variant to DiscountBadge"
```

---

### Task 5: Rebuild `FullBleedSlide`'s offer layout

**Files:**
- Modify: `components/home/hero/FullBleedSlide.tsx` (full file, currently 91 lines)

**Interfaces:**
- Consumes: `DiscountMarquee` (Task 3), `DiscountBadge` with `variant="orbit"` (Task 4), `HeroSlideData` / `Dict["home"]` types (unchanged, from `./types` and `@/lib/i18n/dictionaries`).
- Produces: same default export signature as before — `FullBleedSlide({ slide, active, dict })` — no change to how `HeroShowcase.tsx` calls it.

- [ ] **Step 1: Replace the file contents**

```tsx
// components/home/hero/FullBleedSlide.tsx
import Link from "next/link";
import type { HeroSlideData } from "./types";
import type { Dict } from "@/lib/i18n/dictionaries";
import SushiConveyor from "./SushiConveyor";
import DiscountBadge from "./DiscountBadge";
import DiscountMarquee from "./DiscountMarquee";

export default function FullBleedSlide({
  slide,
  active,
  dict,
}: {
  slide: HeroSlideData;
  active: boolean;
  dict: Dict["home"];
}) {
  const isOffer = slide.kind === "OFFER";
  const eyebrow = slide.badgeText || (isOffer ? dict.offerEyebrow : dict.itemEyebrow);
  const revealClass = (n: 1 | 2 | 3 | 4) => (active ? `reveal-${n}` : "opacity-0");

  if (isOffer) {
    // Discount-header treatment: centered image with a glow halo, an
    // orbiting discount badge, and two mirrored scrolling marquees above
    // and below — ruby-on-near-black, distinct from the FEATURED
    // full-bleed-photo treatment below. Accent (ruby) is used directly
    // for the eyebrow/CTA here, unlike the platinum/gold used by the
    // other offer layouts — those sit over red smoke where red text
    // would vanish; this slide sits on solid near-black, so ruby reads
    // fine and matches the rest of the discount-header palette.
    return (
      <div className="relative w-full h-full bg-night flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="w-full">
          <DiscountMarquee direction="right" />
        </div>

        <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center py-4 md:py-6 min-h-0">
          <div
            aria-hidden
            className="absolute w-[70%] max-w-xl aspect-[16/10] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(155,27,48,0.45), transparent 70%)" }}
          />

          <div className="relative w-[86%] sm:w-[75%] max-w-xl aspect-[16/10]">
            {slide.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover rounded-xl border-2 border-accent/60 shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
              />
            ) : (
              <div className="w-full h-full rounded-xl border-2 border-accent/60 bg-carbon flex items-center justify-center shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
                <span aria-hidden className="text-7xl opacity-20 select-none">
                  🏷️
                </span>
              </div>
            )}

            {slide.discountLabel && (
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 z-20">
                <DiscountBadge label={slide.discountLabel} active={active} variant="orbit" />
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-2xl">
          <span
            className={`text-accent ${revealClass(1)} tracking-widest text-xs uppercase font-semibold inline-flex items-center gap-2 justify-center`}
          >
            <span className="w-2 h-2 rounded-full bg-accent inline-block animate-ping" />
            {eyebrow}
          </span>
          <h1
            className={`font-hero font-bold mt-3 ${revealClass(2)} text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-cream drop-shadow-[0_2px_24px_rgba(0,0,0,0.7)]`}
          >
            {slide.title}
          </h1>
          {slide.description && (
            <p className={`mt-3 ${revealClass(3)} text-sm md:text-base text-gray-200 leading-relaxed font-light drop-shadow`}>
              {slide.description}
            </p>
          )}
          <div className={`mt-5 ${revealClass(4)} flex flex-wrap items-center justify-center gap-4 sm:gap-6`}>
            <Link
              href={slide.ctaHref || "/menu"}
              className="bg-accent text-white hover:bg-white hover:text-night px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
            >
              {slide.ctaLabel || dict.orderNow}
            </Link>
            <Link
              href="/reservations/new"
              className="border border-white/30 hover:border-accent hover:text-accent px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
            >
              {dict.bookTable}
            </Link>
          </div>
        </div>

        <div className="w-full mt-2 md:mt-4">
          <DiscountMarquee direction="left" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2 py-3 md:py-4">
          <span aria-hidden className="w-10 h-px bg-accent" />
          <span className="font-hero text-cream/55 text-xs md:text-sm tracking-[0.3em] uppercase">
            Limited Time Offers · Today Only
          </span>
          <span className="font-sans text-accent text-[10px] tracking-[0.25em] uppercase">
            Scroll To Explore
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {slide.imageUrl ? (
        // Re-keying on `active` remounts the node so the Ken Burns zoom
        // restarts from 0% every time this slide comes back into view.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={active ? `${slide.id}-active` : slide.id}
          src={slide.imageUrl}
          alt={slide.title}
          className={`absolute inset-0 w-full h-full object-cover ${active ? "ken-burns-animation" : ""}`}
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-carbon to-night flex items-center justify-center">
          <span aria-hidden className="text-9xl opacity-20 select-none">
            🍣
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/10" />

      <div className="absolute inset-x-0 bottom-16 md:bottom-20 z-10 px-6 md:px-16 lg:px-24 max-w-2xl">
        <span className={`text-accent ${revealClass(1)} tracking-widest text-xs uppercase font-semibold flex items-center gap-2`}>
          <span className="w-2 h-2 rounded-full bg-accent inline-block animate-ping" />
          {eyebrow}
        </span>
        <h1
          className={`font-hero font-bold mt-4 ${revealClass(2)} text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-cream drop-shadow-[0_2px_24px_rgba(0,0,0,0.7)]`}
        >
          {slide.title}
        </h1>
        {slide.description && (
          <p className={`mt-4 ${revealClass(3)} text-sm md:text-base text-gray-200 max-w-lg leading-relaxed font-light drop-shadow`}>
            {slide.description}
          </p>
        )}
        <div className={`mt-6 ${revealClass(4)} flex flex-wrap items-center gap-4 sm:gap-6`}>
          {slide.price !== null && (
            <span className="font-hero text-3xl md:text-4xl font-bold text-accent">
              €{slide.price.toFixed(2)}
            </span>
          )}
          <Link
            href={slide.ctaHref || "/menu"}
            className="bg-accent text-white hover:bg-white hover:text-night px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
          >
            {slide.ctaLabel || dict.orderNow}
          </Link>
          <Link
            href="/reservations/new"
            className="border border-white/30 hover:border-accent hover:text-accent px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
          >
            {dict.bookTable}
          </Link>
        </div>
      </div>

      <SushiConveyor active={active} />
    </div>
  );
}
```

Note: the `accent`/`cta` string variables from the original file are gone — the FEATURED branch below now hardcodes `text-accent`/`bg-accent` directly since that's what those variables always resolved to when `isOffer` was `false` (see original lines 18-19: `isOffer ? "text-platinum" : "text-accent"` — the `else` value). Every other line of the FEATURED branch, including `revealClass(1)` on the eyebrow, matches the original file exactly — this is a pure refactor of the unchanged branch, not a behavior change. Diff it line-by-line against the original before committing Task 5.

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/home/hero/FullBleedSlide.tsx
git commit -m "Restyle FullBleedSlide's offer layout to the discount-header design"
```

---

### Task 6: Playwright verification sweep

**Files:**
- Create (scratch, not committed): a temporary script under the scratchpad directory.

**Interfaces:**
- Consumes: the running dev server (`npm run dev`) and everything built in Tasks 1-5.
- Produces: pass/fail confirmation only — no code changes unless a bug is found, in which case fix in the relevant task's file and commit a follow-up fix here.

- [ ] **Step 1: Start the dev server**

Run in background: `npm run dev`
Wait for: `Ready in` in the output (allow up to 60s for first compile).

- [ ] **Step 2: Write and run the verification script**

Create `discount-header-verify.mjs` in the scratchpad directory:

```js
import { chromium } from "PATH_TO_REPO/node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

// Navigate the dot pagination until each offer slide's title is visible.
async function goToSlide(title) {
  for (let i = 0; i < 6; i++) {
    if (await page.getByRole("heading", { name: title }).isVisible().catch(() => false)) return;
    const dots = page.locator('button[aria-label^="Go to slide"]');
    await dots.nth(i % (await dots.count())).click();
    await page.waitForTimeout(900); // slide transition
  }
  throw new Error(`Slide "${title}" never became visible`);
}

for (const { title, discount, href } of [
  { title: "Happy Hour", discount: "-20%", href: "/menu" },
  { title: "Weekend Special", discount: "-15%", href: "/menu" },
]) {
  await goToSlide(title);
  await page.waitForTimeout(400);

  const heading = page.getByRole("heading", { name: title });
  if (!(await heading.isVisible())) throw new Error(`${title}: heading not visible`);

  const badgeText = await page.locator("text=" + discount).first().isVisible();
  if (!badgeText) throw new Error(`${title}: discount badge text "${discount}" not visible`);

  const cta = page.getByRole("link", { name: /claim offer|order now/i }).first();
  const ctaHref = await cta.getAttribute("href");
  if (ctaHref !== href) throw new Error(`${title}: CTA href was "${ctaHref}", expected "${href}"`);

  console.log(`${title}: OK (desktop)`);
}

// Mobile width: marquees should be hidden, no horizontal overflow.
await page.setViewportSize({ width: 375, height: 812 });
await page.reload({ waitUntil: "networkidle" });
await goToSlide("Happy Hour");
const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
if (bodyWidth > 375 + 1) throw new Error(`Horizontal overflow at mobile width: ${bodyWidth}px`);
console.log("Happy Hour: OK (mobile, no overflow)");

if (consoleErrors.length > 0) {
  throw new Error("Console errors detected:\n" + consoleErrors.join("\n"));
}
console.log("No console errors. All checks passed.");

await browser.close();
```

Replace `PATH_TO_REPO` with the repo's absolute path before running (per the project's verify skill, Playwright must be required by absolute path when the script lives outside the repo). If `playwright` isn't installed yet: `npm install --no-save playwright && npx playwright install chromium` from the repo root first.

Run: `node discount-header-verify.mjs` (from the scratchpad directory)
Expected: `No console errors. All checks passed.` with no thrown errors above it.

If the image/marquee/copy stack overflows the hero section's fixed height on either viewport (visible as a thrown overflow error, or by eye in a screenshot), the fix is to shrink the sizes in `FullBleedSlide.tsx`'s offer branch (e.g. reduce `max-w-4xl`/`max-w-xl`/`text-4xl` steps) — adjust and re-run rather than guessing sizes blind.

- [ ] **Step 3: Manual reduced-motion check**

With the dev server still running, open http://localhost:3000 in a browser with "Emulate CSS prefers-reduced-motion: reduce" enabled (Chrome DevTools → Rendering tab). Navigate to the "Happy Hour" slide.
Expected: marquee rows and badge ring are static (not scrolling/spinning), no layout is broken or misaligned compared to the motion-enabled view.

- [ ] **Step 4: Stop the dev server**

Kill the background `npm run dev` process.

- [ ] **Step 5: If any check failed, fix and commit**

Only if Step 2 or Step 3 found a problem: fix it in the relevant file from Tasks 1-5, re-run Steps 1-3 to confirm, then:

```bash
git add -A
git commit -m "Fix discount-header verification failure"
```

If everything passed in the first run, there is nothing to commit for this task — it's verification-only.

---

## Self-Review Notes

- **Spec coverage:** color/font mapping → Task 1 + constants used throughout Tasks 3-5; layout stack (marquee/image/badge/copy/marquee/tagline) → Task 5; badge orbit spec (148px, -8°, rotating ring, gradient, pulse, UP TO/label/OFF TODAY) → Task 4; marquee copy/direction/28s loop → Task 3; motion/reduced-motion pattern → Task 2 + verified in Task 6 Step 3; bottom-edge blend → explicitly no task needed (already handled by `HeroShowcase.tsx`, confirmed unchanged); "out of scope" items (schema, dashboard form, other layouts, `SushiConveyor`) → verified untouched by Task 4 Step 2 and by the FEATURED branch being a like-for-like refactor in Task 5.
- **Type consistency:** `DiscountBadge`'s `variant` prop, `DiscountMarquee`'s `direction` prop, and `FullBleedSlide`'s unchanged `{ slide, active, dict }` signature are used identically across every task that references them.
- **No placeholders:** every step has complete code; the one place this plan defers a decision (exact image/text sizing under real content) is flagged as a real, boundable adjustment loop in Task 6 Step 2, not an unresolved requirement.
