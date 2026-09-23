# STEMROBIN-159 Handoff

## What Changed

- Added a root `render.yaml` for one Frankfurt Docker web service using the existing root
  `Dockerfile` and context, one `0.5c-512mb` instance, manual deploys, `/healthz`, no previews,
  disk, worker, or cron, and only unsynced runtime secret placeholders.
- Added `GET /healthz`, which requires valid production session configuration, checks the existing
  Supabase database with `select 1`, disables caching, and reports Render's injected Git commit
  without returning configuration values.
- Changed session handling so production requires `SESSION_SECRET` and sets secure cookies while
  local development retains the documented fallback. Added three focused tests.
- Replaced the Azure-only `infra/README.md` with an explicit current-Azure/proposed-Render
  transition, release, rollback, DNS, cleanup, and later Charter-replacement guide. No Charter file
  was changed.

Implementation commit: `270740bd8f1fc77c943800799546e691194e3574`.

## Acceptance Results

### AC1 Render Runtime And Product Flow

**Local readiness passed; Render production verification is pending authorization.**

- The root Docker image built successfully and ran at `http://localhost:52159` as
  `lemmadeck-stemrobin-159`, constrained to 512 MiB RAM and 0.5 CPU.
- Without `SESSION_SECRET`, the production container returned `503` from `/healthz`. With a
  temporary secret, it returned `200`, reported the Supabase database reachable, and included the
  injected commit field.
- Headed Chromium passed at `1440x960` and `390x844`: catalog, largest lesson `phy6-c1-s6`,
  figure-heavy lesson `alg6-c2-s1-n11`, lesson switching, two MathLive fields and server-side
  judging in exercise 110, and the print/download flow.
- Both viewports had no console errors, uncaught page errors, failed requests, broken loaded images,
  or horizontal overflow.
- Largest-lesson load was 8.071 seconds desktop and 7.668 seconds mobile. Figure-heavy loads were
  1.767-2.502 seconds; MathLive lesson loads were 1.336-1.540 seconds.
- Twenty-four memory samples ranged from 49.32 MiB to a 204.5 MiB peak and ended at 79.82 MiB.
  Docker reported no OOM kill or restart. The still-running review container currently remains
  healthy.
- The Supabase corpus remained at 63 lesson rows. No course, account, or learning data was migrated
  or written by this ticket.

No Render service exists yet, so the approved deployed commit, Render hostname, production memory,
and production learner flow remain pending.

### AC2 Domain And TLS Cutover

**Procedure and baseline recorded; cutover is pending authorization.**

- The apex currently resolves to Azure address `20.54.18.105`.
- `www` remains behind Cloudflare and the public Azure validation record remains at
  `asuid.lemmadeck.com`.
- Azure still binds `lemmadeck.com` with managed certificate
  `mc-cae-easyapp-sh-lemmadeck-com-3571`.
- `infra/README.md` requires Render domain verification before DNS changes, then independent checks
  for apex and `www`, HTTPS, the intended single redirect, preserved paths and query strings,
  response origin, and deployed commit.

No DNS, proxy, domain, redirect, or certificate state was changed.

### AC3 Azure Retirement

**Read-only plan passed; deletion is pending cutover and exact human confirmation.**

- The n-easyapp plan identified only `ca-lemmadeck` in `rg-easyapp-shared`,
  `lemmadeck-schema` in database `easyapp`, and role `lemmadeck-user`. It returned
  `confirmation_required`; the destructive command was not run.
- Azure inventory found the application, its managed certificate, and ACR repository `lemmadeck`
  with 39 manifests and one tag. No `caj-lemmadeck-*` cron jobs exist.
- Shared resource group, Container Apps Environment, ACR registry, PostgreSQL server/database,
  other apps, Supabase, and Azure model/image/TTS services are explicitly excluded.
- The public Azure validation record, managed certificate, and ACR repository require separate
  ownership checks and approval before cleanup; n-easyapp does not delete them.

### AC4 Release, Rollback, Capacity, And Handoff

**Local configuration and capacity evidence passed; live release and rollback are pending.**

- Render CLI Blueprint validation succeeded for service `lemmadeck` with two planned actions.
  The validated file selects the root Dockerfile/context, Frankfurt, one `0.5c-512mb` instance,
  manual deploys, `/healthz`, no disk/worker/cron, and two unsynced secret placeholders.
- Current data contains 63 total lessons and 23,311,175 bytes of stored lesson/exercise/PDF payload.
  The largest row, `phy6-c1-s6`, is 15,181,938 bytes.
- The 49 current math/physics rows contain 20,035,888 bytes, averaging about 408,896 bytes. A
  straight-line 1,500-lesson projection is about 613.3 MB decimal / 584.9 MiB. This is a coarse
  Supabase payload estimate only; it excludes indexes, versioning, backups, object storage, and
  changes in lesson-size distribution, and it does not imply matching web-process RAM.
- Local evidence supports 512 MiB as the one-user starting web-memory plan. It does not establish
  future concurrency capacity or justify a 2 GiB default.
- Release and rollback commands are documented but cannot be verified against actual Render service
  state until the paid service exists. The ticket's approximate `$7/month` estimate must be
  reconfirmed at provisioning.

## Mechanical Defence

Passed once on September 23, 2026:

- `python3 ssot-resources/audit.py`
- `python3 ssot-resources/soviet10year-textbooks/validate.py`
- `cd app && npm run test` — 15 files, 109 tests passed
- `cd app && npm run build`

## Deviations

No implementation deviation from `plan.md`. Production deployment, domain cutover, secret rotation,
live release/rollback verification, Charter replacement, and Azure deletion were intentionally not
performed because their explicit approvals have not been given.

## Environment

- Review URL: `http://localhost:52159`
- Required Render runtime secrets: existing `LEMMADECK_DATABASE_URL`; new production requirement
  `SESSION_SECRET`
- Platform metadata used by health reporting: `RENDER_GIT_COMMIT`
- No environment key was removed.
- Enabling a new production `SESSION_SECRET` invalidates existing login cookies.

## Residual

After explicit approval: create the paid Render Blueprint instance, enter secrets, deploy the
approved commit, verify the Render URL, add and verify domains, cut DNS and TLS, exercise release
and rollback, replace the Azure-only Charter facts in place, then run the guarded n-easyapp deletion
flow with the human's exact confirmation. Only after successful cutover should approved
Lemmadeck-specific certificate, ACR repository, and validation records be removed.
