# infra/

Deployment transition record for LemmaDeck. The current production origin remains **Azure
Container Apps** until the Render service, domains, and TLS have been explicitly approved and
verified. The proposed Render service is declared in the root `render.yaml`; that file does not
become authoritative until a human creates its Blueprint instance.

## Current production

- Origin: Azure Container App `ca-lemmadeck` in `rg-easyapp-shared` /
  `cae-easyapp-shared`.
- Image: `acreasyapp.azurecr.io/lemmadeck:latest`.
- Public URL: `https://lemmadeck.com`; `www` redirects to the apex.
- The live content database is the shared **Supabase** project, schema `lemmadeck-schema`, through
  `LEMMADECK_DATABASE_URL`. The same-named Azure schema is empty and is not production data.

The active deploy, rollback, and log commands remain in
`.intentfold/charter/operations.md`. That Charter is human-owned and still names Azure until the
cutover is approved.

## Proposed Render target

`render.yaml` declares one Docker web service:

- repository-root `Dockerfile` and build context;
- Frankfurt, one `0.5c-512mb` instance;
- no disk, database, worker, cron, autoscaling, or preview service;
- manual code deploys (`autoDeployTrigger: off`);
- readiness at `/healthz`;
- `lemmadeck.com` and `www.lemmadeck.com`;
- runtime-only `LEMMADECK_DATABASE_URL` and `SESSION_SECRET` values entered outside Git.

Render injects `PORT`; the image already binds `0.0.0.0:$PORT`. `/healthz` verifies that the
production session secret is configured and that the existing Supabase database is reachable. Its
response includes `RENDER_GIT_COMMIT` so a release can be matched to Git without exposing secrets.

Creating the Blueprint instance starts a paid service and requires explicit approval. Until that
happens, `render.yaml` is a reviewed proposal, not a description of live infrastructure.

## Approved migration sequence

1. Validate `render.yaml`, create its Blueprint instance, enter the two runtime secrets, and verify
   the first deploy at the Render hostname.
2. Use `ips-render-ops` capability 3 with a dry run before each manual release. Verify every target
   is live on the intended commit, then check `/healthz` and real learner pages.
3. Add the custom domains to Render before changing DNS. Point the Cloudflare apex and `www` records
   to the assigned Render hostname with proxying disabled until Render reports both domains verified
   and HTTPS succeeds.
4. Verify apex and `www`, path and query preservation, the intended single redirect, certificate
   dates, Render response-origin headers, and the health commit.
5. Keep the Azure origin intact until those checks pass. On failure, restore the recorded Azure DNS
   target; Render rollback changes application deploys but does not restore environment variables,
   DNS, database state, or external configuration.
6. Only after stable cutover, run the n-easyapp read-only deletion plan again. The human must supply
   the exact confirmation phrase printed by that tool before it may delete the application, empty
   project schema, and role. Separately verify and remove only approved LemmaDeck-specific
   certificate, image repository, and Azure validation records.

The shared Azure resource group, Container Apps Environment, ACR registry, PostgreSQL server and
database, other projects, Supabase data, and Azure model/image/TTS services are not migration
targets.

## Post-cutover operations

- Release: `ips-render-ops` capability 3, starting with `release.py --dry-run --only lemmadeck`,
  then deploying an explicit Git commit and verifying the live commit plus response bytes.
- Logs and status: `ips-render-ops` capabilities 1 and 2.
- Rollback: `ips-render-ops` capability 7, selecting the newest successful deploy before the bad
  one, followed by the same health and learner-flow checks.
- Environment changes: `ips-render-ops` capability 6. Changing `SESSION_SECRET` invalidates existing
  login cookies and requires the user's explicit production-rotation approval.

After cutover approval, the Charter needs one minimal replacement: change `.intentfold/project.json`
and the Engineering/Operations deployment facts and commands from Azure/n-easyapp to the actual
Render project, service, release, log, rollback, domain, and post-deploy checks. Do not retain Azure
as a second normal deployment path once its application has been retired.
