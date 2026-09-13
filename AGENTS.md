# AGENTS.md — router

Entry point for AI coding agents on this repo. This is a **thin router**: it holds no
knowledge itself, only behavioral guidelines + where each kind of knowledge lives.
Read the routed file directly; don't duplicate its content here.

## Behavioral baseline

- Follow `.intentfold/charter/engineering.md` (binding architecture and development rules).
- This repo runs the **intentfold** one-ticket-at-a-time loop: no product change without a ticket in the backend `.intentfold/project.json` names. `.intentfold/charter/` is human-owned — an agent reports drift, never edits it.
- Verify through the authoritative browser or command evidence in `operations.md`, never by
  imagining from code.

## Where knowledge lives

| Question | Home |
|---|---|
| Session entry — read this first | `.intentfold/readme.md` |
| Product intent / what good looks like | `.intentfold/charter/product.md` (human-only) |
| Hard boundaries needing human approval | the `## Redlines` section of each `.intentfold/charter/` file |
| Engineering norms, architecture, stack, checks, landing | `.intentfold/charter/engineering.md` |
| Run / test / acceptance / deploy / operations | `.intentfold/charter/operations.md` |
| UI stack, tokens, design rules | `.intentfold/charter/ui.md` → `ssot-resources/reference/DESIGN.md` |
| Machine-current module facts (reverse-engineered) | `.evodocs/modules/` |
| Ticket spec / acceptance criteria | the ticket in plane, live — never a local copy |
| Content-generation skills | `.agents/skills/` (`sr-story`, `sr-voa1500`, `ld-galaxy`, `ld-s10y-image`) |
| Soviet 10 Years 教材 → lesson / exercise | `.claude/skills/ld-s10y-lesson/`（现代图委托 `ld-s10y-image`；产物在 `ssot-resources/soviet10year-textbooks/artifacts/`） |
| Soviet 10 Years 书后答案 → answer | `.claude/skills/ld-s10y-answer/` |

## Frozen directories

Read-only history. Add no new dependencies on them; persistent intent lives in `.intentfold/charter/`
and machine-current module facts in `.evodocs/modules/`.

- `.prodfarm/` — the previous product loop, superseded by `.intentfold/` on 2026-08-05. Its charter was
  migrated into `.intentfold/charter/`; `batches/`, `timeline/` and `features/` are kept as history.
- `.intentmill/` — per-ticket artifacts from the earlier n-im flow.
- `.evodocs/constitution.md` and `.evodocs/index.json`.

## Project context

Read `.intentfold/readme.md` first — it routes to this project's intent (`.intentfold/charter/`) and
its ticket workflow. No product change without a ticket in the backend `.intentfold/project.json` names;
use the `intentfold` skill.
