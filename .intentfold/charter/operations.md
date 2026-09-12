# Operations

Human-authored instructions for running, verifying, deploying, and operating this project. Commands
are repo-root-relative and executable as written. Section shape is fixed by
`.intentfold/readme.md`.

Most tickets end at merge. `Finish: auto-deploy` runs this file's deploy and post-deploy tools after
merge. Acceptance verification also uses this file, so stale commands block delivery.

> Consolidated on 2026-09-12 from the former local runbook, QA, and deployment dimensions. Existing
> commands, evidence rules, and operational boundaries were preserved.

## Contract

**Runtime**

One long-running service: the TanStack Start web app in `app/`, SSR. It serves both pages and server
functions; there is no separate API process. "Start the product" means the Vite dev server on the
fixed main port recorded in `.intentfold/project.json`.

The database is remote: the shared Supabase project, schema `lemmadeck-schema`, reached through
`LEMMADECK_DATABASE_URL`. There is no local database. Content generation (`sr-math-lesson`,
`sr-story`, `sr-lesson`) runs as one-off node scripts, not as a service.

**Environments**

One environment: **production**. There is no staging or preview environment.

- Live URL: `https://lemmadeck.com` (`www` redirects to the apex).
- Origin:
  `https://ca-lemmadeck.kindsmoke-4d84c417.northeurope.azurecontainerapps.io`.
- Azure Container Apps app `ca-lemmadeck`, resource group `rg-easyapp-shared`, shared environment
  `cae-easyapp-shared`, managed through n-easyapp project `lemmadeck`.
- Image `acreasyapp.azurecr.io/lemmadeck:latest`, built by `az acr build`.
- The app runs with minimum replicas set to 1.
- n-easyapp builds from the repo-root `Dockerfile` with the repo root as build context. The image
  installs and builds the standalone project in `app/`, then ships only `app/.output`.
- Cloudflare zone `lemmadeck.com`: apex A record to `20.54.18.105` is DNS-only; `www` is a proxied
  CNAME to the apex with a redirect rule. The Azure managed certificate is
  `mc-cae-easyapp-sh-lemmadeck-com-3571`, DigiCert auto-renewing and bound `SniEnabled`.
- Retired domains `mynatree.com` and `stemrobin.com` serve nothing; their Cloudflare zones remain
  in the account and may be repointed later.

**Evidence**

Acceptance verification is acceptance-criteria only. A ticket proves its own criteria against an
authoritative surface and stops; no regression pass is added to the flow.

Evidence must be reproducible and capable of failing. Use the smallest observation that settles the
criterion: a command, query, or browser interaction. Code inspection alone is not evidence that
behavior works.

A ticket-scoped browser check is a command-line script under
`.intentfold/tickets/<ticket-id>/tmp/`, uncommitted. One script covering all criteria is the normal
case, with a screenshot per visual criterion. `app/tests/` remains the project's long-lived
Playwright suite and is not where ticket-scoped checks live.

`playwright-cli open <url>` is useful for debugging but is never acceptance evidence. A criterion
check asserts the reachable page or flow, required controls and regions, accepted action, correctly
placed result, resolved loading state, absence of an error-only state, and the expected value shape.

A chore's proof is whatever settles its criterion. When the criterion is visible only in the running
product, verify it there even when a query proves the underlying row exists.

## Tools

**Install**

```bash
cd app && npm install
```

The content skills install separately:

```bash
cd .agents/skills && npm install
```

**Run locally**

The fixed main port is recorded in `.intentfold/project.json` and set in `app/vite.config.ts`. Do not
pass `--port` in the main checkout:

```bash
cd app && npm run dev
```

For a ticket worktree, resolve the port and pass it to Vite:

```bash
python3 <intentfold-skill>/scripts/ports.py .intentfold/project.json ticket <ticket-id>
cd app && npm run dev -- --port <resolved-web-port>
```

**Build and tests**

```bash
cd app && npm run build
cd app && npm run start
cd app && npm run test
cd app && npm run e2e
```

The combined mechanical-defence command is in `engineering.md`.

**Acceptance**

Use the Playwright copy installed in `app/`; do not install a second copy at the repo root. After a
fresh clone or upgrade:

```bash
cd app && npx playwright install chromium
```

Run a ticket-scoped `.mjs` check from `app/` so it resolves the existing Playwright package:

```bash
cd app && node ../.intentfold/tickets/<ticket-id>/tmp/ac-check.mjs
```

For UI criteria, use headed Chromium at desktop `1440x960` and mobile `390x844`. The layout
breakpoint is `860px`.

Test accounts and data:

- Test learner: `edwinbiz+clerk_test@hotmail.com`, `sr_users.user_id = 2`.
- Real learner: `edwinbiz@hotmail.com`, `sr_users.user_id = 1`; acceptance checks never write to it.
- The local authenticated session cookie is
  `sr_session = "<userId>.<hmac_sha256(SESSION_SECRET, userId)>"`. `SESSION_SECRET` is absent from the
  repo `.env`, so local development uses the in-code default. Mint the test learner cookie without a
  password:

```bash
node -e "const c=require('crypto');console.log('2.'+c.createHmac('sha256', process.env.SESSION_SECRET || 'stemrobin-dev-session-secret').update('2').digest('hex'))"
```

Inject it with Playwright `context.addCookies`. Password login is unavailable to the agent; a
criterion that genuinely requires the login form is a stop and a handoff to the human.

Any rows a check creates, such as `sr_answer_events`, are cleaned up by the same script.

Read acceptance data from the live schema:

```bash
psql "$LEMMADECK_DATABASE_URL" -c 'select * from "lemmadeck-schema".sr_answer_events where user_id = 2 order by created_at desc limit 10;'
```

**Environment**

- The single source file is repo-root `.env`, git-ignored. Required keys include
  `LEMMADECK_DATABASE_URL` for the live content DB and `AZURE_TTS_*` for short-literature English
  narration. `EASYAPP_DATABASE_URL` is dead since 2026-08-14 and must not be used for writes.
- The app reads the same values through a git-ignored symlink:

```bash
ln -sf ../.env app/.env
```

- Content skill scripts run directly with node, read the repo-root `.env`, and resolve `postgres`
  from `.agents/skills/node_modules`.
- The deployed container receives environment values from Azure, not from the repo `.env`.
  Change runtime values through n-easyapp or `az containerapp`, never by baking them into the image.

Read the live content schema:

```bash
psql "$LEMMADECK_DATABASE_URL" -c 'set search_path to "lemmadeck-schema"; \dt'
```

There is no local database: this command reaches the same shared Supabase project used by production.
`DATABASE_URL` reaches the empty Azure easy-app database whose schema has the same name, and
`EASYAPP_DATABASE_URL` is dead; neither is acceptance evidence for data the product reads.

**Deploy**

The routine and only path is the n-easyapp redeploy capability for project `lemmadeck`. It builds
`acreasyapp.azurecr.io/lemmadeck:latest` via `az acr build` and updates the container app. Do not
hand-assemble the Azure commands.

**Post-deploy check**

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://lemmadeck.com/
```

Healthy is `200`. Then open the page and confirm the deployed change is visible.

**Operations**

```bash
az containerapp logs show -n ca-lemmadeck -g rg-easyapp-shared --tail 50
```

## Guidance

**Start before verifying.** Confirm the service responds at its URL before invoking Playwright. A
startup failure is a stop and a report, not an acceptance result.

**Environment troubleshooting.** A missing `app/.env` symlink appears as the app starting while every
DB-backed page fails. Recreate the symlink rather than copying `.env`.

**Choose authoritative evidence.** A database query proves a row exists but not that the UI shows
it. A browser proves rendered behavior but may not prove a background write completed. Use both only
when the criterion spans both surfaces.

**Use headed browser verification for formal UI acceptance.** Fall back to headless only when no GUI
is available and record that limitation.

**Drive a real browser from a script.** An embedded preview pane can produce false negatives for
lazy-loading and viewport logic. It may demonstrate a page to the human, but it is not acceptance
evidence.

**Use stable locators.** Prefer role, label, placeholder, visible text, or a stable `data-testid`.
Locate the stable container first, then assert its contents. Do not locate by CSS class chains or DOM
structure invisible to the user.

**Treat generated content as dynamic.** Assert completion, placement, non-empty output, and shape
rather than exact generated wording. Wait for a completion signal or stable text, and ensure stale
content cannot satisfy a new action's assertion.

**Wait on conditions, not fixed sleeps.** Use web-first assertions or polling for asynchronous
behavior.

**Diagnose a failed check before changing it.** Decide whether the implementation failed or the
check targeted the wrong surface, then rerun the same command.

**Routine deployment boundary.** A deploy is a plain image rebuild-and-swap. If the work includes a
schema operation, Dockerfile or infrastructure change, new runtime environment key, ingress change,
or scaling change, it is not a routine redeploy.

**Authentication failures stop operations.** An Azure command failing authentication is a stop for
human re-authentication, not a reason to retry with a different subscription or account.

## Redlines

1. **Recording a criterion as passed when its check did not run** — forbidden outright. An
   environment or external limit that stopped the run is recorded exactly as it happened.
2. **Writing to the real learner's data from a test** — forbidden outright. Tests use
   `sr_users.id = 2`, never `sr_users.id = 1`.
3. **Driving `https://lemmadeck.com` during acceptance** — forbidden outright. Signing in, clicking,
   submitting, or any other write-capable interaction is prohibited; acceptance runs against
   localhost. A read-only GET required by the post-deploy check is allowed.
4. **Writing a real password, session secret, or DB connection string into a check script, ticket
   artifact, or Charter file** — forbidden outright.
5. **Running a destructive statement against `$LEMMADECK_DATABASE_URL`** — `DROP`, `TRUNCATE`, or an
   unfiltered `DELETE`/`UPDATE` on any `sr_*` table — not without the human's explicit approval.
6. **Creating or deleting cloud resources beyond the established n-easyapp redeploy path** — not
   without the human's explicit approval.
7. **Deploying for the first time** — not without the human's explicit approval.
8. **A deploy that changes more than the image's application code** — not without the human's
   explicit approval. This includes a schema statement run against the live database; a root
   `Dockerfile` or `infra/` change; a required environment key the container does not already have;
   or an ingress or scaling configuration change. Editing the descriptive DDL file without applying
   a schema statement is not itself a runtime change.
9. **Moving the root `Dockerfile`, or changing its build context away from the repo root** —
   forbidden outright.
10. **Setting the container app to scale to zero** (`--min-replicas 0`) — forbidden outright.
11. **Pointing a production domain at anything new, or changing the `lemmadeck.com` Cloudflare
    records or proxy state** — not without the human's explicit approval.
12. **Reporting a deploy as done without running the post-deploy check** — forbidden outright.
13. **Any action incurring new recurring cost, or a one-off cost above $5** — not without the
    human's explicit approval.
