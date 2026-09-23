# Plan

## Observed Contracts

- The root `Dockerfile` already builds the standalone `app/` project from the repository root,
  copies only the build output into the runtime image, and binds through `HOST` / `PORT`.
- The deployed web process needs only `LEMMADECK_DATABASE_URL` and session signing configuration;
  the content generators, Azure model credentials, disk storage, workers, and cron jobs do not
  belong in the Render service.
- There is no lightweight health route. `/` reaches Supabase and renders the full landing page, so
  it is a poor platform probe and cannot report the deployed Git commit.
- `session.server.ts` currently accepts a public development signing secret in production. A new
  production service must fail closed when the secret is absent, while local development retains
  its existing default.
- The Render workspace is reachable and currently has no LemmaDeck project or service. The live
  Blueprint schema accepts `0.5c-512mb`; the service has not been created because that incurs a new
  recurring charge.
- The current Supabase corpus has 63 published lesson rows. The largest row payload is
  `phy6-c1-s6` at about 15.2 MB; `alg6-c2-s1-n11` has 19 figures and 17 interactive exercises;
  `alg6-c1-ex` supplies dense MathLive input coverage.

## Route

1. Add a root `render.yaml` for one Frankfurt Docker web service using the existing root
   Dockerfile/context, one `0.5c-512mb` instance, manual deploys, `/healthz`, no previews, no disk,
   and only the two runtime secrets as unsynced values.
2. Add `/healthz` as a GET-only server route. It verifies production session configuration and a
   trivial Supabase query, returns a small no-store JSON response, and includes Render's injected
   commit identifier when present without exposing configuration values.
3. Make session signing reject a missing secret in production and mark production cookies secure;
   preserve the documented local-development fallback.
4. Replace the Azure-only `infra/README.md` with a transition document that labels current versus
   proposed state, defines the approved-order provisioning, release, domain, rollback, and Azure
   retirement steps, and lists the minimal later Charter replacement without editing Charter.
5. Validate the Blueprint, build and run the production image with a 512 MB memory limit, exercise
   the selected real lessons in Chromium, capture RSS/latency/error evidence, run the mechanical
   defence, then commit and publish a review PR. Record cloud acceptance items as pending rather
   than passing.
