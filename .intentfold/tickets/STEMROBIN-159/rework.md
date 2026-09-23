# Post-Handoff Migration

## Human Request

On September 23, 2026 the human instructed: "Execute the migration." This authorized the reviewed
512 MB Render deployment and domain cutover after PR #61 delivery. The current coordinating
session took over the production operation; no second worker or recurring monitor was started.
The original `handoff.md` remains unchanged.

## Implementation And Operation

- PR #61 merged as `46f4b00f285b8799baaa0c5738b24c5f1b290c2d`.
- Created API-managed Render service `srv-dapsio9srm7s73an5p60`, Frankfurt, one `0.5c-512mb`
  instance, root Docker build, manual deployments, no previews or additional infrastructure.
- Used the same Supabase connection as Azure and a new random production session secret.
  No secret values were recorded and no database content was migrated.
- Initial Render deploy `dep-dapsiopsrm7s73an5rh0` became live on the merge commit.
- Added and verified apex and `www`; changed both Cloudflare records to DNS-only CNAMEs pointing
  at `lemmadeck.onrender.com`. Azure remained available throughout.
- Updated the machine-owned deploy routing and infrastructure record to actual Render state.
  Added an explicit comment to `render.yaml`: it is a reference, not an active Blueprint.
  No application source changed during this initial cutover.

## Rechecked Evidence

- Render API, `/healthz`, and response headers independently identified the intended live
  revision, the reachable original database, and Render as the answering origin.
- Public DNS moved from Azure `20.54.18.105` to the Render CNAME target. Both Render domains
  reported `verified`; HTTPS succeeded. `www` returned one 301 preserving path/query.
- `/healthz?check=render&probe=159` followed exactly one redirect from `www`. Numeric exercise
  URLs such as `exercise=14` also have an application-level 307 to `exercise=%2214%22`;
  forcing the old Azure origin produced the identical 307. This pre-existing URL normalization
  is distinct from the single domain redirect and was not changed by migration.
- Headed Chromium, `1440x960` and `390x844`: catalog, `phy6-c1-s6`,
  `alg6-c2-s1-n11?tab=ex`, and exercise 110 in `alg6-c1-ex` rendered without page errors, failed
  requests, broken loaded images, horizontal document overflow, or any non-read request.
  Existing local MathLive judging and print evidence remains valid; production forms were not
  submitted.
- The largest lesson's HTML response was 45,810,364 bytes. Browser load observations were about
  40.3 seconds desktop and 28.8 seconds mobile; this is a remaining content-payload concern, not
  evidence for increasing web RAM.
- Render's 30-second memory samples between 12:45 and 12:50 UTC reached 121,999,360 bytes
  (about 116.3 MiB). This is a sampled maximum, not an instantaneous peak or concurrency test.
- The standard release dry run selected exactly this one web service and the intended main SHA.
- The resource audit, textbook validator, 109 tests, production build, and `git diff --check`
  passed again on the post-cutover documentation/configuration changes.
- Screenshots and raw observations are disposable ticket evidence under `tmp/`; live service,
  DNS, and rollback identifiers are retained in `infra/README.md` and the Plane ticket.

## Authorized Hosting Cleanup

The human subsequently approved finishing the proposed cleanup, explicitly preserving Supabase
and focusing on separation from Azure hosting. The live ticket now records this approval in place
of the former pending-Charter constraints.

- Replaced the Engineering and Operations Charter's Azure hosting/deploy instructions with the
  actual Render configuration and the sole manual release, observation, and rollback path.
  Approval boundaries remain explicit; Product and UI Charter files are unchanged.
- Routed `project.json`, `infra/README.md`, the root README, and the galaxy skill's publishing
  instruction to those operations. Removed obsolete Azure build comments. Kept retirement-only
  Azure identifiers and the rollback baseline separate from routine deployment instructions.
- Removed `EASYAPP_DATABASE_URL` and `DATABASE_URL` fallbacks from the application DB client and
  shared content helper. Both now fail closed without `LEMMADECK_DATABASE_URL`; the client,
  Supabase connection value, schema, and pool configuration are unchanged.
- Added four application tests and four shared-helper tests covering canonical-only selection,
  missing/empty configuration, rejected legacy variables, and existing client/pool behavior.
  The helper tests are included in the mechanical-defence commands.
- No dependency manifests, lockfiles, database schemas, course artifacts, environment files,
  secrets, or Azure model/image/TTS resources changed.

Cleanup verification passed:

- Resource audit and textbook validator.
- 113 application tests and four content-helper tests, without database writes.
- Production build and `git diff --check`.
- Galaxy skill validation. The validation interpreter initially lacked PyYAML; an isolated `uv`
  tool environment resolved it without changing project dependencies.
- Fresh built application, temporarily on port 52160 because 52159 was already held by an SSH
  listener: `/healthz` returned 200 with database `reachable`; `/` returned 200 with 13,335 bytes;
  `/card/alg6-c1-s1-n2` returned 200 with 1,522,456 bytes and the lesson title markup.
  Only GETs were issued. No Supabase configuration, schema, or data was changed.
- Active-code/instruction search leaves Azure hosting references only in the explicit retirement
  record, rejection tests, and the rule forbidding legacy database aliases. Frozen history is
  intentionally preserved.

The cleanup release and its exact merged/deployed revision are recorded in the live ticket after
publication, rather than claiming a deployment before it occurs.

## Remaining Boundaries

The Azure application, its empty Azure schema/role, dedicated certificate/image repository,
old verification TXT, and old Cloudflare redirect ruleset are not deleted. The human approved
their scoped cleanup but has not supplied n-easyapp's exact `delete easyapp lemmadeck` confirmation
after the current plan. Do not substitute broad approval for that tool gate or delete the app's
dependent resources first. These unfinished items keep the ticket open.

Supabase and shared infrastructure are preserved. No actual production rollback was induced
merely to test it.
