# STEMROBIN-125 Grill

## Sources Reviewed

- Plane ticket STEMROBIN-125 and its four acceptance criteria.
- Current IntentFold skill, cap3 flow, Charter templates, and layout test.
- Existing `.intentfold/readme.md`, `project.json`, and all eight former-layout Charter files.
- Active routing references in `AGENTS.md`, `SESSION-BOOTSTRAP.md`, `README.md`,
  `infra/README.md`, and `.agents/skills/lib/content-db.mjs`.
- Frozen `.prodfarm/`, `.intentmill/`, and completed IntentFold ticket artifacts were identified as
  history rather than migration targets.

## Final Shared Understanding

- Migrate the human-owned Charter to exactly four files: `product.md`, `engineering.md`, `ui.md`,
  and `operations.md`.
- Consolidate existing content rather than re-authoring policy: architecture plus development rules
  move into `engineering.md`; runtime, acceptance, deployment, and operations move into
  `operations.md`.
- The machine-owned `.intentfold/readme.md` becomes the single home of the Charter writing and
  consumption protocol.
- Active repository routes must point to the four-file layout. Frozen history and completed ticket
  artifacts retain their historical names.
- This is a documentation and process migration only. It changes no application behavior,
  dependency, database state, cloud resource, or deployment.

## Decisions

1. The human explicitly authorized non-semantic edits to `product.md` for this migration despite its
   existing self-edit redline. Only obsolete references to `format.md` may change; product intent and
   TODOs remain untouched.
2. Update all active entry points and references: `AGENTS.md`, `SESSION-BOOTSTRAP.md`, `README.md`,
   `.intentfold/project.json`, `infra/README.md`, and the content-database code comment.
3. Preserve every substantive fact, command, Guidance rule, and Redline from the former files.
   Remove repeated format boilerplate and merge duplicate statements without adding policy.
4. Do not invent IntentFold CI/integrity integration or pull-request commands that the repository
   does not currently define.
5. Verify with a ticket-scoped structural command because the changed behavior is repository
   routing and Charter layout, not the running web product.

## Rejected Options

- Leaving `product.md` with a broken `format.md` reference was rejected because it would preserve
  known drift in the newly migrated Charter.
- Updating only `.intentfold/` was rejected because active repository entry points would continue
  routing agents to the superseded harness or deleted files.
- Rewriting historical artifacts was rejected because those directories and completed ticket
  records are intentionally frozen evidence.
- Starting the web app for acceptance was rejected because it cannot establish whether the Charter
  layout and routing contract are correct.

## Remaining Open Questions

None.

## Implementation Constraints

- Keep the four required section headings exactly once and in order in every Charter file.
- Preserve project-specific semantics while consolidating.
- Do not modify product code, dependencies, generated application files, environment values,
  databases, deployment state, or frozen history.
- Do not stage `.env` or `app/.env`.

## Acceptance Criteria

Use `.intentfold/tickets/STEMROBIN-125/ac.md` unchanged.
