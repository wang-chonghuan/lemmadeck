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

## Exact Frozen Bindings

```json
{
  "lesson": "phy6-c5-s12",
  "role": "author_not_independent_reviewer",
  "status": "frozen_sole_repair_pending_affected_independent_review",
  "finding": "F-S12-C4-1",
  "unit": "mass-speed-comparisons",
  "stem": "两物体相对于同一参照物都在运动。只讨论物体整体平动，不考虑转动。在分别控制速度或质量的比较中，下面哪些关系成立？",
  "original_author_freeze": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/choice-author-c5-s12/author-handoff.json",
    "bytes": 3459,
    "sha256": "e03112a81c7ff729ed15108de97cbeb9204131ef7541770ccf8f630d4f40437e"
  },
  "first_rejection": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/choice-author-c5-s12/review-main-rejected-1.json",
    "bytes": 16446,
    "sha256": "01cf0572ce2c8bf8e661479b7b629a49b130d5fb8ce97620f73a1da7c6505839"
  },
  "first_review_report": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/choice-review-c5-s12-rejected-1.md",
    "bytes": 1372,
    "sha256": "50c70aee5005da73780af00c33744a63283e50aad9d0d554d612cb64b1ae0afd"
  },
  "seed": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/choice-author-c5-s12/repair-01/seed.json",
    "bytes": 3125,
    "sha256": "1fcd805de904d028b8657c033194a8870c4b813e096329606e8887cbb2e6fcff"
  },
  "seed_sha256": "aa935f8c8c156d92696cdde3891f8a7f37fef2fabe3eebe464b406cd7a1b9039",
  "source_freeze": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/choice-author-c5-s12/repair-01/source-freeze.json",
    "bytes": 773,
    "sha256": "9b352f6e9572bda0b5af4d6d021fe011de68c5308916278ad354adafa4ef07ef"
  },
  "source_solutions": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/choice-author-c5-s12/repair-01/source-solutions.json",
    "bytes": 9596,
    "sha256": "de5eb3ed78424a3a2996d9f02131162d5b24979857a4f0b8779bc2c76cc4f65a"
  },
  "draft": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/choice-author-c5-s12/repair-01/draft.json",
    "bytes": 21321,
    "sha256": "2fd59682360544295bc1f156c356c5bb2598f4609b39c576ce33177f998c54cc"
  },
  "draft_sha256": "6787d435ae3463635fd5ae0957adcf4722357980258080eeb64f0015ab9460bb",
  "pure_view": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/choice-author-c5-s12/repair-01/pure-view.json",
    "bytes": 4136,
    "sha256": "4002a57299f6945fdaef471ec63e3922519cdb92848be5f468c6bbb2fa5ccd1d"
  },
  "diff": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/choice-author-c5-s12/repair-01/repair-diff.json",
    "bytes": 2633,
    "sha256": "7a4e17d5df64ac44d25e3e591b41dbb2272be461c8383c0259a8fc33624c04e4"
  },
  "questions": 5,
  "tasks": 5,
  "options": 21,
  "modes": {
    "single": 2,
    "multiple": 3
  },
  "unchanged_other_units_full_PASS_reused": true,
  "all_options_keys_intents_coverage_source_unchanged": true,
  "source_exercise_figures": [],
  "new_figures": [],
  "body_reference_figure_evidence_reused": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/choice-author-c5-s12/figure-display-evidence.json",
    "bytes": 1159,
    "sha256": "a6a97d04eae110358bf2cbd015c0a05b46b65039d95bff7c34a20598c58026bf"
  },
  "structural": {
    "calls": 1,
    "scope": "mass-speed-comparisons",
    "exit_code": 0,
    "semantic_pass_claimed": false
  },
  "repair_budget": {
    "maximum": 1,
    "used": 1,
    "remaining": 0,
    "includes_mechanics": true
  },
  "calls": {
    "prepare": 0,
    "source_gate": 0,
    "image_gate": 0,
    "other_unit_structure": 0,
    "affected_structure": 1,
    "self_review": 0,
    "service": 0,
    "automatic_retry": 0,
    "retain_finalize_publish_db_git": 0
  },
  "independent_approval": false,
  "self_review": false,
  "current_review_file": null,
  "token_usage": "Agent tokens not independently measured; no service requests",
  "inflight_sessions": []
}
```
