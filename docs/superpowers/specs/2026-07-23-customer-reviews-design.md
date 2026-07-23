# Customer Reviews System — Design

## Overview

Customers who complete an order can submit one review (1–5 star rating,
title, comment) for that order. Reviews start `PENDING` and only become
public once the owner approves them. The owner has full moderation
control (approve/reject/hide/pin/edit/delete). Approved + visible
reviews appear in a homepage testimonials carousel, replacing the
existing "Come Visit Us" section.

No review images — text-only reviews (rating, title, comment).

## Data model

New `Review` model in `prisma/schema.prisma`:

```prisma
enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

model Review {
  id      String @id @default(uuid())
  rating  Int // 1-5
  title   String
  comment String

  status     ReviewStatus @default(PENDING)
  isVisible  Boolean      @default(true) // owner hide/unhide, independent of approval
  isFeatured Boolean      @default(false) // pinned to the front of the homepage carousel
  sortOrder  Int          @default(0) // manual display order among featured/approved reviews

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // One review per order — enforced at the DB level via @unique
  orderId String @unique
  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@index([status])
  @@index([isVisible])
  @@index([isFeatured])
  @@index([userId])
  @@map("reviews")
}
```

Add `reviews Review[]` to `User` and `Order` models.

**Public visibility rule**: `status = APPROVED AND isVisible = true AND deletedAt IS NULL`.

**Ordering rule** (owner dashboard's "control display order" + homepage
carousel): `isFeatured desc, sortOrder asc, createdAt desc`.

## Validation (`lib/validations/review.ts`)

Zod schemas, following the `lib/validations/coupon.ts` pattern
(`safeParse` + `FormState` type with `errors: fieldErrors`):

- `rating`: int, 1–5
- `title`: string, 3–100 chars
- `comment`: string, 10–1000 chars
- Owner edit form additionally validates `sortOrder` (int ≥ 0)

## Server actions (`lib/actions/review.actions.ts`)

All actions call `requireAuth`/`requireOwner` from `lib/guards.ts` first
— no action trusts a client-supplied `userId` or role.

**Customer**
- `getMyReviewForOrder(orderId)` — returns the caller's review for that
  order, or `null`. Used by the order detail page to decide whether to
  show the form or the existing review.
- `createReviewAction(orderId, prevState, formData)` — `requireAuth`.
  Loads the order, returns a generic "not found" error (never
  "forbidden") if it doesn't exist, isn't owned by the caller, or isn't
  `COMPLETED` — same non-distinguishing pattern as
  `cancelMyOrderAction` in `order.actions.ts`, so a review can't be used
  to probe another customer's order. Returns a friendly "already
  reviewed" error if one exists; the `orderId @unique` constraint is the
  authoritative backstop against a race. Creates with `status: PENDING`.
- `updateMyReviewAction(reviewId, prevState, formData)` — ownership
  check (`review.userId === user.id`, else not-found), and only allowed
  while `status === PENDING` (an approved/rejected review is already
  moderated; editing it afterward would bypass moderation).
- `deleteMyReviewAction(reviewId)` — ownership check, soft delete
  (`deletedAt`), any status.

**Owner**
- `getReviewsForDashboard()` — `requireOwner`. All non-deleted reviews,
  including customer name and order number, ordered by `createdAt desc`.
- `updateReviewStatusAction(reviewId, status)` — approve/reject.
- `toggleReviewVisibilityAction(reviewId)` — hide/unhide.
- `toggleReviewFeaturedAction(reviewId)` — pin/unpin.
- `updateReviewAction(reviewId, prevState, formData)` — edits
  `rating`/`title`/`comment`/`sortOrder`. Per confirmed design, this
  does **not** change `status` — an owner's content edit (e.g. redacting
  something) doesn't force re-approval.
- `deleteReviewAction(reviewId)` — soft delete, any review.

**Public**
- `getPublicReviews()` — reviews matching the visibility rule above,
  ordered per the ordering rule, mapped to a plain display shape
  (customer name, rating, title, comment, date — no internal IDs beyond
  what's needed for React keys).
- `getPublicReviewStats()` — one `prisma.review.aggregate` call
  (`_avg.rating`, `_count`) scoped to the same visibility filter, so the
  average/count shown on the homepage is computed in the query, not
  client-side.

## Customer UI

`app/(site)/orders/[id]/page.tsx` — when `order.status === "COMPLETED"`:
- No review yet → render `ReviewForm` (`components/orders/ReviewForm.tsx`,
  client component using `useActionState` bound to `createReviewAction`
  with the order id): 1–5 star picker, title input, comment textarea,
  submit button. Styled as a `glass` card matching the rest of the page
  (dark theme, `text-cream`, `text-accent`).
- Review exists → render `MyReviewCard`
  (`components/orders/MyReviewCard.tsx`): rating/title/comment, a status
  badge (Pending/Approved/Rejected), and Edit (only if `PENDING`) /
  Delete controls.

## Owner dashboard UI

- `app/dashboard/reviews/page.tsx` — table view via
  `components/dashboard/ReviewTable.tsx`, same interaction pattern as
  `RewardTable.tsx` (`useTransition` + `router.refresh()` after each
  action, `confirm()` before delete). Columns: customer, order #,
  rating (stars), title, status badge, featured (pin icon toggle),
  visible (toggle), sortOrder, actions (Approve/Reject, Hide/Unhide,
  Pin/Unpin, Edit link, Delete).
- `app/dashboard/reviews/[id]/edit/page.tsx` +
  `components/dashboard/ReviewEditForm.tsx` — full content edit form
  (rating/title/comment/sortOrder), same shape as `CouponForm.tsx`.
- Nav link "Reviews" added to `app/dashboard/layout.tsx`'s header nav.

## Homepage UI

`app/(site)/page.tsx`: the current "Hours & reserve" `RevealSection`
(the one titled "Come Visit Us", lines ~141–156 — distinct from
`ReserveTableSection` above it, which already shows the full weekly
hours and a booking CTA) is deleted and replaced with:

```tsx
const [reviews, reviewStats] = await Promise.all([
  getPublicReviews(),
  getPublicReviewStats(),
]);
...
<TestimonialsSection reviews={reviews} stats={reviewStats} />
```

`components/home/TestimonialsSection.tsx` — new client component built
on the same autoplay-carousel engine already used by
`HeroShowcase.tsx`: `setInterval`-driven auto-advance (5s), dot
pagination with active-dash fill animation, prev/next arrow buttons,
`prefers-reduced-motion` respected (autoplay disabled, manual nav
kept). Responsive: 1 card visible on mobile, up to 3 on desktop.
Section header shows average rating + total review count (e.g. "4.8 ★
· 128 reviews") using existing eyebrow/title typography conventions
(`text-accent text-xs uppercase tracking-widest` eyebrow, `font-serif`
title). Cards show a colored initial-letter avatar circle (no photo),
customer name, star rating, title, comment, and date — dark
`night`/`carbon` theme, `cream` text, `accent` stars, matching every
other homepage section. If there are zero approved+visible reviews,
the component returns `null` (same empty-state convention as
`HeroShowcase` with zero slides).

## i18n

New keys added to **both** the `en` and `it` blocks in
`lib/i18n/dictionaries.ts` (the `it` block is typed `typeof en`, so both
must stay in sync): a `reviews` namespace (eyebrow, title, average/count
label, empty states, form labels, status labels) plus a few additions
under the existing `orders` namespace for the order-detail review
form/card strings.

## Security

- Every mutating action re-derives identity via `requireAuth`/
  `requireOwner` — never trusts client input for `userId` or role.
- Ownership checks on all customer-scoped actions; mismatches return a
  generic "not found", never a distinguishing "forbidden" (prevents
  order/review enumeration).
- Duplicate prevention: `Review.orderId @unique` at the DB level is the
  source of truth; the action layer's pre-check is just a nicer error
  message.
- All inputs zod-validated server-side (ratings clamped to 1–5 ints,
  string length bounds) — the star-picker UI can't be trusted to
  enforce this alone.
- Public queries (`getPublicReviews`, `getPublicReviewStats`) hard-code
  the `APPROVED + isVisible` filter — nothing customer- or
  review-content-controlled can make an unapproved review public.

## Performance

- All homepage/order-detail review reads happen server-side in the
  page component (`Promise.all` alongside the page's other data
  fetches) — no client-side fetch waterfall.
- Average rating computed via one `prisma.review.aggregate` call, not
  fetched-then-reduced in JS.
- No images in this feature, so no new image-optimization surface.
- Carousel: `prefers-reduced-motion` disables the timer-driven
  auto-advance; all controls remain keyboard-reachable with
  `aria-label`s on prev/next and `aria-current` on the active dot,
  matching `HeroShowcase`'s existing accessibility conventions.

## Out of scope (explicitly not building)

- Review images/photo upload (decided: text-only).
- A dedicated "My Reviews" page (review lives on the order detail page
  only, per confirmed design).
- Owner replies/comments on reviews (not requested).
- Review helpfulness voting, reporting/flagging by other customers (not
  requested).
