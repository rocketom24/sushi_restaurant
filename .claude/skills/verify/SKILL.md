---
name: verify
description: How to build, run, and drive this app end-to-end for verification
---

# Verifying sushi-app changes

## Launch

- `npm run dev` (background) → http://localhost:3000. First hit of each route compiles on demand — allow 30–60s timeouts.
- DB scripts: Prisma client is generated as TS-only into `app/generated/prisma`, so plain `node` can't require it. Write a `.ts` script importing `{ prisma } from "./lib/prisma"` and run `npx tsx --env-file=.env script.ts` from the repo root (the `--env-file` flag is required — tsx does not load `.env`).

## Test accounts (dev Supabase, created 2026-07-16)

- OWNER: `claude-test-owner@example.com` / `TestOwner!2026`
- CUSTOMER: `claude-test-customer@example.com` / `TestCustomer!2026`
- To (re)create: use `supabase.auth.admin.createUser` with `SUPABASE_SERVICE_ROLE_KEY` from `.env`, then upsert the Prisma `user` row with the matching id and role.

## Drive (Playwright)

- `npm install --no-save playwright` + `npx playwright install chromium`; require playwright by absolute path if the script lives outside the repo.
- Login form: `input[name="email"]`, `input[name="password"]`, submit → owner redirects to `/dashboard`, customer to `/`.
- Reservation form (`/reservations/new`): `reservationDate` (date), `reservationTime` (select, 30-min slots 12:00–14:00 / 18:00–21:30), `guestCount`, `customerName`, `phone`, `specialRequest`.
- Seeded tables: 1 (cap 2), 2 (cap 4), 3 (cap 3).

## Gotchas

- Server actions + Supabase auth are slow in dev (2–8s per mutation). After clicking an action button, poll body text up to 30s instead of a fixed 3–4s wait — fixed short waits produce false failures (status "didn't change", router.push URL "didn't update").
- Screenshots taken right after `waitForURL` can capture the old React tree mid-transition; settle with an extra wait before asserting visuals.
- Playwright auto-dismisses `confirm()`/`alert()` dialogs — register a `page.on("dialog")` handler that accepts and logs, or destructive actions (No Show, Cancel) silently no-op.
- Clean up created reservations afterwards: `prisma.reservation.deleteMany({ where: { customerName: { in: [...] } } })`; soft-delete test orders/payments (`deletedAt`) instead of hard-deleting (FK children).
- `innerText` does not include `<input>` values — edit forms (e.g. `/dashboard/menu/[id]/edit`) look "empty" to text assertions; read `input.value` via `evaluateAll`. Also `waitForSelector("input")` hangs on the hidden `$ACTION_ID` server-action input — filter `type !== "hidden"`.
- Pages calling action-guards (`requireAuth`, throws) instead of page-guards (`requireAuthPage`, redirects) 500 for guests — check every new page has a page-guard before its data call.
- i18n: site defaults to English; Italian via the header EN/IT switcher (cookie `locale`). Playwright `hasText` matches raw textContent, NOT the CSS-uppercased render — match case-insensitively (`/^it$/i` for the switcher buttons, not `/^IT$/`). Body `innerText` IS uppercased by CSS, so assertions on `innerText` need `/i` too.
- Never verify a password with the cookie-backed Supabase client — a failed `signInWithPassword` wipes the user's session cookies. Use a bare in-memory `@supabase/supabase-js` client (see `changePasswordAction`).
- Never `page.reload()` / `page.goto()` / start a polling-reload loop immediately after clicking a button that fires a server action. `.click()` resolves once the event dispatches, not once the action's `fetch()` completes — a reload right after aborts that in-flight request client-side before the server handler even starts (confirmed via dev-log: cancelled calls leave no `└─ ƒ actionName(...)` line at all, unlike every completed one). Instead `await Promise.all([page.waitForResponse(r => r.request().method()==="POST" && r.status()===200), locator.click()])`, *then* reload/re-navigate to read the settled state.
- Fixed-string/regex text assertions after a mutation are fragile when the expected substring can already exist elsewhere on the page from unrelated data — e.g. checking for `\b17\b` (a balance) on a day when the date renders as `17/07/2026`, or checking `/paid/i` on a payments table that already has older PAID/REFUNDED rows from prior sessions. These produce false passes that resolve instantly, in turn tempting a premature reload (see above). Scope the check to a specific row/element, or assert on the network response instead of body text.
- `Order.orderNumber` is `@unique` in the schema despite a comment in `lib/orders/order-number.ts` claiming otherwise — it's generated from a live `COUNT(*) of orders this year`. **Never hard-delete an `Order` row in dev** (or anything that cascades to one): it shrinks the count and the next generated number can collide with one still on disk (`P2002` on `orderNumber`). Always soft-delete test orders (`deletedAt: new Date()`) instead. If a hard delete already happened and checkout starts failing with a `P2002` unique-constraint error on `orderNumber`, repair by inserting a soft-deleted placeholder order with the missing `ORD-<year><NNNNN>` number to refill the gap, restoring `COUNT(*)` to match the highest surviving number.
- Loyalty/coupons (Module 11) test fixtures: coupon `BENVENUTO10` (10% off, no min) and reward `Free Drink` (10 pts) are seeded as permanent demo data (BENVENUTO10 also feeds the home-page hero's offer slide) — don't delete them, just reset `usageCount`/redemptions between runs.
