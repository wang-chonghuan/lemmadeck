# s12 Choice Sole Stem Repair Author Report

Ticket: STEMROBIN-180. Finding: F-S12-C4-1.
Role: author only. Status: frozen, pending affected independent review.

## Exact Change

Only `mass-speed-comparisons.view.stem` changes:

Before:
两物体相对于同一参照物都在运动。在分别控制速度或质量的比较中，下面哪些关系成立？

After:
两物体相对于同一参照物都在运动。只讨论物体整体平动，不考虑转动。在分别控制速度或质量的比较中，下面哪些关系成立？

The same insertion is present in the full draft and pure id/view export.
Both raw unified diffs contain exactly one removed stem line and one added
stem line. `repair-diff.json` records these diffs and canonical digests.
The selected frame, common nonzero motion and fixed-other-variable
conditions remain. No new data or task is introduced.

All21 options, their ordering and figure references, the A/D correct set,
all rationales/intents/source mappings/coverage and the other four complete
units remain unchanged. The five independently derived source solutions,
prepared seed and source-first freeze are byte-identical copies of the
originals. No source solutions were redrafted or rebound.

## First Rejection Preserved

Original handoff:
`e03112a81c7ff729ed15108de97cbeb9204131ef7541770ccf8f630d4f40437e`.
Original source solutions:
`de5eb3ed78424a3a2996d9f02131162d5b24979857a4f0b8779bc2c76cc4f65a`.
Original seed canonical digest:
`aa935f8c8c156d92696cdde3891f8a7f37fef2fabe3eebe464b406cd7a1b9039`.

The manifest-owned original artifacts, original handoff/report and main
FIRST rejection/report were copied before editing under `first-failure/`.
`preservation.json` protects their original exact bytes and the already
completed fig197 repair freeze. No original file was edited.

The main's unchanged four-unit full PASS is reused. Its original rejected
review remains evidence for the old snapshot only; it is not renamed or
declared a PASS for this new candidate.

## Actual Affected Structural Check

Existing interpreter:
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`.
Repair root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/choice-author-c5-s12/repair-01`.

`repair_tools.py snapshot`, `bind`, and `check` each ran once.
The sole affected structural call was:

```text
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/choice-author-c5-s12/repair-01/repair_tools.py check-leaf
```

It invokes the existing stable `validate.check_draft` on an in-memory
projection of only this question, its four unchanged options/internal
records and its unchanged coverage row. The complete seed digest is
retained; the full frozen draft/export are not reduced or altered by
that check. Exit0: structural PASS, semantic review still pending.
The exact argv/input hashes/stdout/exit/tool before-and-after hashes are
in `ledger/01-sole-affected-structural.json`.

No `check_seed`, prepare, source-refresh or other-unit structural gate was
run. The complete source/modern200 observations are reused unchanged, with
actual source input hashes verified at freeze; no image or browser was
reopened. No second mechanical call, automatic retry or self-review.

## Freeze Boundary

Five tasks/questions, two single and three multiple,21 options; no exercise
figure attachments or new diagrams. Open example-production and written
argument capacity losses remain explicit and unchanged.

This affected unit has consumed its sole1/1 repair, including mechanics;
remaining budget0. Other units were untouched and their original budgets
were not reset. Main performs the affected semantic comparison.

No service, DB/Git, retention/finalize/publish, canonical/app/tool/dependency
or other-author edits occurred. Figure197 remains frozen separately with
its reported BLOCKED pixel result. Original author and FIRST rejection
bytes remain immutable. Agent token usage is not independently measured;
service tokens/cost0. No in-flight session remains.
