# Operations

Human-authored instructions for running, verifying, deploying, and operating this project. Commands
are repo-root-relative and executable as written. Section shape is fixed by
`.intentfold/readme.md`.

Most tickets end at merge. `Finish: auto-deploy` runs this file's deploy and post-deploy tools after
merge. Acceptance verification also uses this file, so stale commands block delivery.

> Consolidated on 2026-09-12 from the former local runbook, QA, and deployment dimensions. Existing
> commands, evidence rules, and operational boundaries were preserved. Hosting instructions were
> replaced on 2026-09-23 with explicit human approval for the Render migration and Azure cleanup.

## Contract

**Runtime**

One long-running service: the TanStack Start web app in `app/`, SSR. It serves both pages and server
functions; there is no separate API process. "Start the product" means the Vite dev server on the
fixed main port recorded in `.intentfold/project.json`.

The database is remote: the shared Supabase project, schema `lemmadeck-schema`, reached through
`LEMMADECK_DATABASE_URL`. There is no local database. Content generation (`ld-s10y-lesson`,
`ld-s10y-image`, `ld-s10y-answer`, `sr-story`, `sr-voa1500`, `ld-galaxy`) runs as one-off scripts,
not as a service. Their committed resource inputs and outputs live under `ssot-resources/`;
rebuildable working files live under `.tmp/` and may be removed after the run.

**Environments**

One environment: **production**, hosted on Render. There is no staging or preview environment.
Render builds the root `Dockerfile` with the repo root as context, installing the standalone
project in `app/` and shipping only `app/.output`. Production remains a single always-on instance.

The service is API-managed, not Blueprint-managed. `render.yaml` records intended configuration;
editing it does not apply infrastructure changes. Automatic deployment and preview creation are
disabled. A merge is not a release; publication is a separate explicit operation.

Azure hosting is retired from the normal deployment path. Remaining guarded retirement targets
are recorded in `infra/README.md`; Azure model/image/TTS generation services are unaffected.

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

**Production**

- Live URL: `https://lemmadeck.com`; `www` redirects to the apex.
- Render origin: `https://lemmadeck.onrender.com`.
- Workspace: `intentplex` (`tea-d229rofdiees73d7h4gg`).
- Web service: `lemmadeck` (`srv-dapsio9srm7s73an5p60`), Frankfurt, one `0.5c-512mb` instance.
- GitHub repository: `wang-chonghuan/lemmadeck`, branch `main`, `autoDeploy=no`.
- Health endpoint: `/healthz`, requiring session configuration and the existing Supabase connection;
  its response reports the deployed `RENDER_GIT_COMMIT`.
- Cloudflare apex and `www`: DNS-only CNAMEs to `lemmadeck.onrender.com`, TTL 300.
  Both custom domains are verified by Render, which provides TLS and the `www` redirect.
- No Render database, disk, worker, cron, autoscaling, or preview service.
- Retired domains `mynatree.com` and `stemrobin.com` serve nothing; their Cloudflare zones remain.

**Install**

```bash
cd app && npm install
```

The content skills install separately:

```bash
npm --prefix .agents/skills install
npm --prefix .claude/skills/ld-s10y-lesson install
```

`ld-s10y-lesson` also owns a Python virtual environment; its `SKILL.md` contains the exact `uv`
bootstrap command and required packages.

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

- The single local source file is repo-root `.env`, git-ignored. `LEMMADECK_DATABASE_URL` is the
  only supported DB variable. Generation credentials, including Azure models/images and
  `AZURE_TTS_*`, remain available to their one-off skills; they are not website runtime keys.
- The app reads the same values through a git-ignored symlink:

```bash
ln -sf ../.env app/.env
```

- Content scripts read the repo-root `.env`. Skills under `.agents/skills/` resolve shared Node
  dependencies there; `ld-s10y-lesson` uses its own Node package and Python virtual environment;
  `ld-s10y-answer` publishers resolve `postgres` from `app/`.
- Render securely stores the existing `LEMMADECK_DATABASE_URL` and a random production
  `SESSION_SECRET`. The container does not load the repo `.env`. Use `ips-render-ops` capability 6
  for approved runtime changes, never bake secrets into the image. Do not copy generation
  credentials to the website. Session-secret rotation invalidates existing login cookies and
  requires explicit approval.

Read the live content schema:

```bash
psql "$LEMMADECK_DATABASE_URL" -c 'set search_path to "lemmadeck-schema"; \dt'
```

There is no local database: this command reaches the same shared Supabase project used by production.
Legacy database variables are not supported; no alternate database is acceptance evidence for
data the product reads.

**Deploy**

The only routine release path is `ips-render-ops` capability 3, targeting an approved merged
revision. Load the current skill and use its secret-safe authentication setup. Replace the skill
path and commit placeholders below with the loaded skill directory and approved main commit:

```bash
python3 <ips-render-ops>/scripts/release.py --dry-run --only lemmadeck --commit <merged-sha>
python3 <ips-render-ops>/scripts/release.py --only lemmadeck --commit <merged-sha>
```

The dry run must select exactly the web service above. Reconcile approved infrastructure changes
explicitly with the Render API; a change to `render.yaml` alone is not a deployment.

**Post-deploy check**

```bash
render deploys list srv-dapsio9srm7s73an5p60 --output json --confirm
curl -fsS -D - https://lemmadeck.com/healthz
curl -fsS -o /dev/null -w '%{http_code} %{size_download}\n' https://lemmadeck.com/
curl -sSI 'https://www.lemmadeck.com/healthz?check=render'
```

Require a `live` deploy on the intended commit, `/healthz` status `ok` with the same commit and
database `reachable`, and `x-render-origin-server: Render`. The root must return 200 with actual
SSR content, not an empty shell. `www` must redirect once to the apex with path/query intact.
Observe the changed page read-only; write-capable acceptance remains local.

**Rollback**

Use `ips-render-ops` capability 7 to identify and roll back to a retained successful Render deploy.
Do not confuse a preceding `deactivated` successful deploy with a failed build. Recheck the actual
commit and post-deploy observations above. Application rollback does not undo database changes,
environment variables, DNS, or TLS configuration.

**Operations**

```bash
render logs -r srv-dapsio9srm7s73an5p60 --limit 50 --output text --confirm
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

**Authentication failures stop operations.** A cloud command failing authentication is a stop for
human re-authentication, not a reason to retry with a different account, workspace, or subscription.

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
6. **Creating or deleting cloud resources** — not without the human's explicit approval. Routine
   Render releases update only the existing approved service.
7. **Deploying for the first time** — not without the human's explicit approval.
8. **A deploy that changes more than the image's application code** — not without the human's
   explicit approval. This includes a schema statement run against the live database; a root
   `Dockerfile` or `infra/` change; a required environment key the container does not already have;
   or an ingress or scaling configuration change. Editing the descriptive DDL file without applying
   a schema statement is not itself a runtime change.
9. **Moving the root `Dockerfile`, or changing its build context away from the repo root** —
   forbidden outright.
10. **Allowing the production web service to scale to zero or sleep when idle** — forbidden
    outright; retain the always-on single-instance baseline.
11. **Pointing a production domain at anything new, or changing the `lemmadeck.com` Cloudflare
    records or proxy state** — not without the human's explicit approval.
12. **Reporting a deploy as done without running the post-deploy check** — forbidden outright.
13. **Any action incurring new recurring cost, or a one-off cost above $5** — not without the
    human's explicit approval.
