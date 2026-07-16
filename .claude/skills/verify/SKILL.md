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
- Clean up created reservations afterwards: `prisma.reservation.deleteMany({ where: { customerName: { in: [...] } } })`.
