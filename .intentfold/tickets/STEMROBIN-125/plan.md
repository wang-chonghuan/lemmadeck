# STEMROBIN-125 Plan

## Observed

- The current Charter is the former layout: `product.md`, `dev.md`, `ui.md`, `arch.md`,
  `runbook.md`, `qa.md`, `devops.md`, and `format.md`.
- The current IntentFold skill accepts exactly `product.md`, `engineering.md`, `ui.md`, and
  `operations.md`; its session-entry template now owns the Charter writing protocol that previously
  lived in `format.md`.
- `engineering.md` must consolidate the current architecture and development dimensions.
  `operations.md` must consolidate local runtime, acceptance evidence, deployment, and operations.
- Active, non-frozen references to former Charter paths exist in `.intentfold/readme.md`,
  `.intentfold/project.json`, `AGENTS.md`, `infra/README.md`, and
  `.agents/skills/lib/content-db.mjs`. Historical references also exist under frozen directories and
  completed ticket artifacts.
- `.evodocs/meta.json` still names the retired intent location, but declares itself single-writer
  output of the n-evodocs helper. This ticket does not bypass that ownership rule; the stale metadata
  is reported as residual work rather than hand-edited.
- No current IntentFold CI/integrity integration or pull-request command set is present in the
  repository. The migration must not invent one.
- `product.md` already has the required four headings, but its own Redlines section forbids editing
  that file while its prose still points to the retiring `format.md`. The human explicitly
  authorized reference-only edits for this migration.

## Route

1. Replace the machine-owned session entry with the current four-file IntentFold template and update
   the deploy pointer in `project.json`.
2. Create `engineering.md` by consolidating `arch.md` and `dev.md`: preserve project facts,
   mechanical defence, generation/schema tools, guidance, and every project redline; remove repeated
   format boilerplate and repair internal references.
3. Create `operations.md` by consolidating `runbook.md`, `qa.md`, and `devops.md`: preserve runtime,
   acceptance, environment, database, deploy, post-deploy, troubleshooting, and every operational
   redline; remove repeated format boilerplate and repair internal references.
4. Keep `product.md` and `ui.md` as their existing dimensions and update only former-layout
   references. Product intent and UI policy remain unchanged.
5. Remove the six former-layout dimension/protocol files after their unique content has a home.
   Update active non-frozen router, documentation, and code-comment references; leave `.prodfarm/`,
   `.intentmill/`, and completed ticket artifacts untouched as history.
6. Add a ticket-scoped structural acceptance script under `tmp/` and run it against the resulting
   worktree. The script checks exact filenames, heading order, active routing, and the current
   IntentFold preflight layout predicate.

## Redline Lookup

- `product.md`: editing the file is forbidden outright. The human explicitly authorized the narrow
  reference-only edit required by this Charter migration; no product intent or TODO changes.
- `dev.md`: no credentials will be staged, no existing dirty work will be discarded, and answer-key
  behavior is untouched.
- `arch.md`: no dependency, generated application file, database connection, schema, content write,
  or application-layout change is involved.
- `ui.md`: no token registry, palette, brand mark, or styling mechanism changes.
- `runbook.md`, `qa.md`, `devops.md`: no database mutation, production interaction, deployment,
  infrastructure operation, domain change, or spend.

## Slices

1. Settle the migration boundary in the human grill.
2. Build the two consolidated files and refresh the two retained dimensions.
3. Update active routing references and remove former-layout files.
4. Run the ticket-scoped structural checks, then prepare the development commit for handoff.
