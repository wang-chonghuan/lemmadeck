# Engineering

Human-authored architecture and development rules. This file defines how the product is built, how
code changes are made, and how they land. Section shape is fixed by `.intentfold/readme.md`.

The dependency inventory belongs to the lockfile; generated structure belongs to its generator.
Record here only decisions, boundaries, and commands that the repository cannot explain by itself.

> Consolidated on 2026-09-12 from the former architecture and development dimensions. Existing
> project decisions and boundaries were preserved. Pull-request landing commands were added later
> that day with explicit human authorization.

## Contract

**Stack**

- **tanstack-start** is the application framework — SSR full-stack, a single app in `app/`, React 19,
  TypeScript, Node 24. Vite builds it through the TanStack Start and Nitro plugins. This is the one
  supported n-easyapp base for this repo; a second app or a framework change is out of scope without
  a charter decision.
- **`@tanstack/react-router`** is the router — file-based, under `app/src/routes/`.
- **Tailwind CSS 4** (+ tw-animate-css) is the styling authority; see `ui.md`.
- **zustand** is the client state library (`app/src/lib/layout-store.ts`).
- **PostgreSQL** via the `postgres` client is the datastore — the **shared Supabase project**, schema
  **`lemmadeck-schema`**, reached through `LEMMADECK_DATABASE_URL`. Never a second client.
  `app/src/lib/db.ts` resolves the URL as `LEMMADECK_DATABASE_URL || EASYAPP_DATABASE_URL ||
  DATABASE_URL`; the fallbacks exist only so an unmigrated deploy keeps working and **nothing new may
  be written through them**. The container app has `LEMMADECK_DATABASE_URL` set, so production and
  local read the same schema.
- **Authentication is in-repo, no external provider**: scrypt password hashing (Node `crypto`) and an
  HMAC-signed httpOnly session cookie, both in `app/src/lib/session.server.ts`.
- **Content rendering**: markdown via `marked`; KaTeX is loaded from a CDN by the root document
  rather than bundled from npm.

**Structure**

- **Repo layout**: `app/` = the web app, a **standalone project** with its
  own `package.json`/`package-lock.json`/`node_modules` — **there is no repo-root `package.json`**;
  commands run from `app/` or via `npm --prefix app`. `ssot-schemas/db-schemas/` = DB SSOT;
  `resources/` = committed human/curated material and generated content
  (`resources/s10y-lessons/` = Soviet 10 Years extraction + modern editions;
  `resources/content/` = physics authoring sources plus retained historical English sources;
  `resources/reference/` = human docs
  incl. `DESIGN.md`); `.claude/skills/` = repository-local S10Y lesson and answer pipelines;
  `.agents/skills/` = project skills for modern figures, stories, the knowledge galaxy, and retained
  English generation tooling;
  `infra/` = deploy/substrate notes. No top-level `jobs/` — this project has no independently-packaged
  jobs. Root holds only cross-cutting files: the deploy `Dockerfile`, `.intentfold/`, `AGENTS.md`, and
  tooling config.
- **Routes**: public learner routes are `index.tsx` and `_app/card.$id.tsx` for the textbook
  catalog and cards. The legacy English lesson and recitation paths redirect to the public landing
  page and render no English-learning UI. `login.tsx` remains the account entry.
- **Domain libs** in `app/src/lib/`: `curriculum.ts` (course structure + lesson ordering/nav),
  `lessons.ts`, `stories.ts`, `quiz.ts` + `answer-normalize.ts` (practice, incl. `input`-mode
  server-side judging), `session*.ts` (auth), `db.ts` (postgres access, `search_path` = the project
  schema). `english.ts` remains only as preserved server/data capability and is not a learner-facing
  product module.
- **DB access is server-only**: every read and write goes through `app/src/lib/db.ts`'s `sql()`. The
  browser never holds the connection string.
- `app/vite.config.ts` sets `envDir: '..'` so build-time env resolves from the root `.env`.

**Key decisions**

- **Published content lives in the DB and is produced by named skills.** The sole math lesson entry is
  `.claude/skills/ld-s10y-lesson`: scanned textbook pages become faithful page artifacts, assembled
  lesson/exercise objects, and a `modern-us-neutral` edition under `resources/s10y-lessons/`.
  Modern figures are delegated to `ld-s10y-image`; answers and interaction specifications are added
  by `ld-s10y-answer`; their publishers upsert `sr_lessons`. The app reads the stored prose and
  exercise fragments at `/card/:id`. New math work does not use a concept ledger, neutral card tree,
  locale overlay, or retired concept-led lesson savers. Biographies use `sr-story`. Historical
  short-literature English rows and the `sr-voa1500` generator are retained but are not exposed by
  the application.
- **The content DB lives on the shared Supabase project, not on the Azure easy-app instance**
  (schema `lemmadeck-schema`), because the Azure instance was intermittently refusing connections.
  This is the decision that matters most to anyone writing content — and since the 2026-08-14 rename
  it needs saying carefully: **tell the two apart by server, never by schema name.** The Azure
  easy-app Postgres now *also* has a schema called `lemmadeck-schema` (created by n-easyapp cap1 for
  project `lemmadeck`, empty, wired into the container as `DATABASE_URL`). The live one is the
  Supabase project reached through `LEMMADECK_DATABASE_URL`; a write that lands in the Azure one
  still succeeds and never reaches the product. `EASYAPP_DATABASE_URL` still sits in `.env` but is
  now inert: it names `stemrobin-schema` / `stemrobin-user`, both deleted with `ca-stemrobin` on
  2026-08-14, so it fails to connect rather than writing somewhere invisible.
- **`ssot-schemas/db-schemas/lemmadeck.sql` is the single source of truth for the DB tables** — 18
  of them, generated from the live schema by STEMROBIN-124 and regenerated the same way whenever the
  schema changes deliberately. Reason: schema changes applied ad hoc drift away from anything
  reviewable, and a hand-maintained DDL drifts just as far (the file it replaced had fallen seven
  tables behind). It **describes**; it is never applied.
- **Vitest uses a separate `app/vitest.config.ts`** because the TanStack Start Vite plugin is
  incompatible with the Vitest runner.
- **Content tooling keeps its dependencies outside the deployed app.** Project skills under
  `.agents/skills/` share that directory's package; `ld-s10y-lesson` owns its package and Python
  environment under `.claude/skills/ld-s10y-lesson/`; `ld-s10y-answer` reuses the app's `postgres`
  dependency for its publishers.

## Tools

**Pull-request landing**

Worktree tickets land through GitHub pull requests in `wang-chonghuan/lemmadeck`. Substitute the
ticket's recorded values for `<ticket-id>`, `<branch>`, and `<pr>`.

Find an existing PR:

```bash
gh pr list --repo wang-chonghuan/lemmadeck --head <branch> --state all \
  --json number,title,url,state,headRefOid,baseRefName,mergeStateStatus,statusCheckRollup
```

Create one when absent:

```bash
gh pr create --repo wang-chonghuan/lemmadeck --base main --head <branch> \
  --title "<ticket-id>" --body-file ".intentfold/tickets/<ticket-id>/handoff.md"
```

Read its current head, state, and checks:

```bash
gh pr view <pr> --repo wang-chonghuan/lemmadeck \
  --json number,url,state,headRefOid,mergeStateStatus,statusCheckRollup
```

This repository currently configures no required GitHub checks, branch protection, rulesets,
overlap detector, or cap4 takeover gate. If that changes, update these Tools before landing the
next ticket. Merge with a merge commit, then confirm GitHub reports the merge commit:

```bash
gh pr merge <pr> --repo wang-chonghuan/lemmadeck --merge
gh pr view <pr> --repo wang-chonghuan/lemmadeck --json state,mergedAt,mergeCommit
```

Do not pass `--delete-branch`; IntentFold cap4 deletes the local and remote ticket branches only
after the ticket backend reaches Done.

**Mechanical defence**

Run once before handoff:

```bash
cd app && npm run test && npm run build
```

There is no separate lint or typecheck script today; `vite build` is the type-error boundary.

**Architecture and generation**

- Build output: `app/.output` (`app/.output/server/index.mjs`).
- Content generation: never hand-write `sr_*` rows. Math starts at
  `.claude/skills/ld-s10y-lesson/SKILL.md`, delegates modern figures to `ld-s10y-image`, delegates
  answers and interaction specifications to `ld-s10y-answer`, and persists only through those
  skills' publishers. Biographies use `sr-story`; retained short-literature English generation uses
  `sr-voa1500` but does not publish a learner-facing application surface.
  Each skill's `SKILL.md` owns its exact generation and persistence commands.
- DB schema: `ssot-schemas/db-schemas/lemmadeck.sql` describes the live schema. It is generated from
  the database, never hand-edited and never applied to it. The inspection command lives in
  `operations.md`.
- `.agents/skills/lib/content-db.mjs` owns DB URL resolution for content scripts under
  `.agents/skills/`. Repository-local S10Y publishers live under `.claude/skills/`, read the
  repo-root `.env`, and must write through `LEMMADECK_DATABASE_URL`.
- `app/src/routeTree.gen.ts` is generated by the TanStack Start plugin and is never hand-edited.

## Guidance

**No gratuitous dependencies.** If the existing architecture and stack can implement the requirement,
do not add, remove, or change any library. Solve it with what is here. A dependency change is
admissible only when the existing stack genuinely cannot meet the requirement and the ticket carries
that human decision.

**Reuse before inventing.** Existing helpers, config paths, schemas, components, and SSOT files come
first. A second way to do something that already has a way is a defect, even when it works.

**Respect ownership boundaries.** Find the domain lib that already owns the concept before adding a
new one — `curriculum.ts` owns structure and ordering, `quiz.ts` owns practice and judging,
`session*.ts` owns auth. A route file composes; it does not hold domain logic. Anything that touches
the DB goes through `db.ts`'s `sql()` even when a direct query would be shorter.

**No dirty code.** No TEMP markers, degradation branches, or mocks standing in for a failed external
dependency. A failing external premise is a stop and a report.

**Surgical changes.** Touch what the ticket needs and nothing else. Do not improve adjacent code,
reformat unrelated files, or fix things noticed in passing.

**Uncertainty surfaces.** Prefer stopping and asking over inventing a fallback or hidden compatibility
layer.

**DB access is server-only.** All reads and writes go through `app/src/lib/db.ts`'s `sql()`; the
browser never holds the connection string.

**Content is DB-driven and skill-generated.** Never hand-write `sr_*` rows and never apply a schema
change ad hoc; both have exactly one path named in `## Tools`.

**Secrets.** `.env` holds DB and API secrets and is git-ignored. Never stage it, commit it, or echo
its contents; verify it is not staged before every commit.

**Complexity hotspots**

TODO(human) — the former architecture dimension's `Complexity hotspots` section was an empty
placeholder awaiting real aborts. Lessons from things that went wrong belong here; it is what makes
the next grill sharper.

## Redlines

1. **Committing credentials, tokens, connection strings, or hidden account data** — forbidden
   outright, in source, mocks, ticket artifacts, and commits alike. Concretely: `.env` and `app/.env`
   never appear in `git status`'s staged set.
2. **Discarding a change already present in a dirty worktree** — forbidden outright. It is the
   human's work until they say otherwise.
3. **Sending an answer key to the client** — forbidden outright. The quiz question fetchers
   (`getLessonQuestions` / `getStoryQuestions` in `app/src/lib/quiz.ts`) must never include
   `correct_index`, `answer`, or `accept` in what they return; correctness is judged server-side in
   the `record*` server functions.
4. **Opening a database connection anywhere under `app/` other than `app/src/lib/db.ts`** —
   forbidden outright. A second `postgres` client, or a connection string reaching any file under
   `app/src/routes/` or any `.tsx`, is the crossing this names. Content scripts under
   `.agents/skills/` are node CLIs governed by entry 9.
5. **Adding, removing, or changing a dependency** — not without the human's explicit approval, and
   only when a ticket carries that decision.
6. **Hand-editing a generated file** — forbidden outright: `app/src/routeTree.gen.ts`, anything under
   `app/.output/`.
7. **Changing the DB schema anywhere other than `ssot-schemas/db-schemas/lemmadeck.sql`** —
   forbidden outright. Ad hoc `ALTER`/`CREATE` against the shared server is drift.
8. **Writing content through any connection other than `LEMMADECK_DATABASE_URL`** — forbidden
   outright. `DATABASE_URL` points at the Azure easy-app Postgres, whose schema is also named
   `lemmadeck-schema` and is empty; a write that lands there still succeeds and never reaches the
   product. `EASYAPP_DATABASE_URL` is dead since 2026-08-14 and only fails.
9. **A content script under `.agents/skills/` calling `postgres(` directly** — forbidden outright.
   Every content script connects through `.agents/skills/lib/content-db.mjs`.
10. **Adding a repo-root `package.json`, or a second application** — not without the human's explicit
    approval. The standalone-`app/` layout is what the root `Dockerfile` and n-easyapp are built on.
