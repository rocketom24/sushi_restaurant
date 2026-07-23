# Discount-Header Restyle — Design

## What "happy hour header page no 5" means

There is no standalone "happy hour" feature. The homepage hero (`HeroShowcase.tsx`) rotates through `HeroSlide` rows (Prisma model), each rendered by one of 4 owner-selectable layouts: `IMAGE_RIGHT`, `IMAGE_LEFT`, `FULL_BLEED`, `MULTI_IMAGE`. "Page no 5" is the "Happy Hour" slide — `sortOrder: 4`, the 5th slide in rotation, `kind: OFFER`, `layout: FULL_BLEED`, discount label `-20%`, coupon `HAPPY20`. It's rendered by `components/home/hero/FullBleedSlide.tsx`.

One other slide, "Weekend Special," is also `kind: OFFER` + `layout: FULL_BLEED`. Restyling the `isOffer` branch of `FullBleedSlide` affects both — accepted tradeoff, confirmed with the user. No `FEATURED` slide currently uses `FULL_BLEED`, so that branch (unchanged) is unaffected in practice.

## Goal

Restyle the `isOffer` visual treatment of `FullBleedSlide.tsx` to match a supplied "sushi discount header" mockup (centered image, dual scrolling marquees, circular discount badge, ruby/near-black palette) — pure styling/layout change. No changes to `HeroSlideData`, Prisma schema, server actions, the dashboard form, or i18n dictionary keys already in use.

## Color & font mapping

The mockup's raw hex values are mapped onto the site's existing KURO/Kyoto-Crimson token set (`app/globals.css`) rather than introduced as new colors, so the slide stays on-brand:

| Spec value | Existing token used |
|---|---|
| bg `#0a0a0a` | `night` (`#0B0C10`) |
| ruby accent `#e8243c` / `#9b1b30` | `accent` (ruby-red, `#9B1B30`) |
| dark red `#5c0011` | `deep-bordeaux` (`#3D0C14`) |
| cream text `#f5f0e8` | `cream` / `platinum` |

Fonts: **Bebas Neue** is newly loaded via `next/font/google` (site has no condensed display face today), used only for marquee text and the badge numeral. Cormorant Garamond/Inter from the spec are *not* added as separate fonts — the bottom tagline reuses the site's existing `font-hero` (EB Garamond), consistent with how every other hero slide renders its display type.

## Layout (inside `FullBleedSlide`'s `isOffer` branch only)

Top → bottom:

1. **Top marquee**: infinite CSS loop, scrolls right, 28s linear, same duplicated-content `translateX(-50%)` technique already used by `SushiConveyor.tsx`'s belt.
2. **Centered image**: `slide.imageUrl`, 16:10 aspect, 12px rounded corners, radial glow halo behind it (`rgba(155,27,48,0.45)` — derived from `accent`), drop shadow `0 32px 80px rgba(0,0,0,.8)`, `accent`-colored border ring. Replaces the current full-viewport `object-cover` background photo for this branch only.
3. **Discount badge**, top-right of the image, overlapping — see below.
4. **Existing copy block** (unchanged data/logic): eyebrow (`slide.badgeText` or `dict.offerEyebrow`), `slide.title`, `slide.description`, CTA (`slide.ctaLabel`/`slide.ctaHref` → `dict.orderNow` fallback) + the "Book a table" link — same fields, same `reveal-1..4` stagger animation, just repositioned under the image instead of bottom-left-over-photo.
5. **Bottom marquee**: mirrored, scrolls left.
6. **Tagline strip**: thin `accent`-colored divider + small uppercase micro-label, decorative only.

The `FEATURED` (non-offer) branch of `FullBleedSlide` is untouched — still full-viewport cover photo + Ken Burns zoom + bottom-left copy, exactly as today.

## Discount badge

`DiscountBadge.tsx` is shared with `ImageSideSlide` and `MultiImageSlide` — those must not change. Approach: add an optional `variant?: "stamp" | "orbit"` prop, defaulting to `"stamp"` (today's exact rendering, byte-for-byte). `FullBleedSlide`'s offer path is the only caller that passes `variant="orbit"`:

- 148px circle, tilted -8°
- outer dashed ring (`2px dashed accent/55`), rotating 360° over 8s
- static inner cream ring
- fill gradient `accent → ruby-red → deep-bordeaux`
- idle pulse (glow + scale 1→1.08, 2.2s ease-in-out)
- text: "UP TO" (small) / `slide.discountLabel` (large, reuses the existing field — no new data) / "OFF TODAY" (small)

All `ImageSideSlide`/`MultiImageSlide` call sites keep calling `DiscountBadge` with no `variant` prop → identical output to today.

## Marquee copy

The scrolling food-name/discount strings ("DRAGON ROLL · 20% OFF · ...") are decorative texture, not derived from `slide` data, and are **not** run through the i18n `dict` — hardcoded static English, matching the existing precedent of English-only system/decorative text elsewhere in the app (e.g. Zod validation messages). If Italian-language marquee text is wanted later, that's a separate follow-up, not in scope here.

## Motion & accessibility

Every new keyframe (marquee scroll ×2, badge ring rotation, badge pulse/scale) follows the codebase's existing pattern exactly: the trigger class defaults to `animation: none`, and the real animation is only declared inside `@media (prefers-reduced-motion: no-preference)` — same structure as `ken-burns-animation`, `conveyor-animation`, `badge-pop-animation`, etc. already in `app/globals.css`.

## Bottom-edge blend

No new work needed — `HeroShowcase.tsx` already layers a `night`-colored top/bottom gradient (lines ~112-119) over the whole section specifically to blend hero content into the nav above and the next section below. The new slide content must not fight that existing overlay (i.e., don't add an opaque background behind the marquees/copy block that would show a hard edge against it).

## Explicitly out of scope

- `HeroSlideData` type, Prisma schema/migrations, `HeroSlideForm.tsx`, `hero-slide.ts` validation — no changes.
- No nav bar drawn inside the slide (the real `SiteHeader`/`FloatingHeaderShell` already floats above every slide, site-wide, with working links/cart/search/profile).
- No changes to `IMAGE_RIGHT`, `IMAGE_LEFT`, `MULTI_IMAGE` layouts or their components.
- No changes to `SushiConveyor.tsx` (still used by the `FEATURED`/`FULL_BLEED` branch).

## Testing

Playwright sweep per `.claude/skills/verify/SKILL.md`: home page loads, both `OFFER`/`FULL_BLEED` slides ("Happy Hour", "Weekend Special") render title/description/CTA text, "Claim Offer" link still points to `/menu`, manual dot/arrow navigation still reaches these slides, no console errors, `prefers-reduced-motion` respected (badge/marquee static, no layout break), responsive check at mobile width (marquees allowed to hide/simplify, badge allowed to shrink — both were already implicit in the "responsive" requirement). Also verify `ImageSideSlide` and `MultiImageSlide` offer slides (none currently exist as real data, but exercise via a temporary local slide if needed) render the default `DiscountBadge` unchanged.
