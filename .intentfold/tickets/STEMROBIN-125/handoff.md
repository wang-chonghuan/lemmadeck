# STEMROBIN-125 Handoff

## What Changed

- Replaced the former multi-file Charter layout with exactly four dimensions:
  `product.md`, `engineering.md`, `ui.md`, and `operations.md`.
- Consolidated architecture and development rules into `engineering.md`, preserving stack,
  structure, mechanical defence, content/schema tooling, engineering guidance, and redlines.
- Consolidated local runtime, acceptance evidence, environment, database inspection, deployment,
  and operations into `operations.md`, preserving the existing commands and operational redlines.
- Refreshed `.intentfold/readme.md` from the current IntentFold four-file template and updated
  `.intentfold/project.json` to route deployment through `operations.md`.
- Updated active repository entry points and references in `AGENTS.md`, `SESSION-BOOTSTRAP.md`,
  `README.md`, `infra/README.md`, and `.agents/skills/lib/content-db.mjs`.
- Removed the former Charter files after their substantive content had been consolidated. Frozen
  `.prodfarm/`, `.intentmill/`, and completed ticket artifacts were left unchanged.

## AC Results

| Criterion | Result | Evidence |
|---|---|---|
| Charter contains only the four current dimensions | PASS | `ac-check.mjs` found exactly `engineering.md`, `operations.md`, `product.md`, and `ui.md`. |
| Every dimension has the four required sections in order | PASS | The script parsed each file and found `Contract`, `Tools`, `Guidance`, `Redlines` exactly once and in order. |
| Session entry and active routing use the current layout | PASS | The script found all four routes and the Charter-format protocol in `.intentfold/readme.md`, with no former-layout references in the active files under test. |
| IntentFold development preflight accepts the layout | PASS | Required files exist, former-layout files are absent, and the current `ports.py ... validate` command exited successfully. |

Acceptance command:

```bash
node .intentfold/tickets/STEMROBIN-125/tmp/ac-check.mjs
```

Mechanical defence:

```bash
cd app && npm run test && npm run build
```

Result: 11 test files passed, 75 tests passed, and the production build completed successfully.

## Deviations

- The human grill expanded active routing cleanup to include `SESSION-BOOTSTRAP.md` and the root
  `README.md`; this was incorporated into `plan.md` before implementation.
- The first mechanical-defence invocation could not find `vitest` because the fresh worktree had no
  `app/node_modules`. Running the documented `npm install` restored dependencies without changing the
  lockfile; rerunning the same mechanical-defence command passed.
- No web server or Playwright browser was started because the human approved command-based
  verification for this repository-structure-only change.

## Environment

- Recorded web port: `52125`; it was not bound because no running-product criterion applied.
- No environment key was added, changed, or removed.
- `.env` and `app/.env` remained untracked and were not committed.

## Residual

- `.evodocs/meta.json` still names `.prodfarm/charter/` as authoritative intent. The file declares
  n-evodocs as its sole writer, and the current n-evodocs helper has no command for changing that
  governance field, so this migration did not hand-edit it.
- The existing product Charter still contains human-owned `TODO(human)` entries for success criteria
  and explicit non-goals; this ticket intentionally did not resolve them.
