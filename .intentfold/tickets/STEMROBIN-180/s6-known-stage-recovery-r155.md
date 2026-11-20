# S6 Known Stage Recovery r155

Status: PASS_BYTES_ONLY. EXACT6p phy6-c4-s6. Three exact historical
files recovered, 84687 bytes total; precise local byte gaps: none.
No course completion, new authoring, semantic approval or promotion.

Workspace:
`/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck`

Owned recovery root:
`/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-7161/s6-fig117-known-stage-recovery-r155`

## Frozen Manifest

Output-only manifest:
`/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-7161/s6-fig117-known-stage-recovery-r155/manifest.json`

53730 bytes, SHA-256
`5bbc18e8d9d824ec766a704d6617d7c2a85b22cb2f43a657cf7a2dc3b79eb1c5`,
mode 0444. It records absolute output paths, complete hashes, byte counts,
saved record origins, actual necessary input bindings, recovery programs,
failures, source identity checks and the unchanged historical scope.

## Exact Recovered Outputs

All three full hashes matched in memory before their first exclusive
output write. All recovered evidence is frozen as mode 0444.

| File Under Owned Recovery Root | Bytes | Full SHA-256 |
|---|---:|---|
| fig-117.spec.json | 42472 | c9148e3e583f1e953bb02a9c8059391fdeb962452e7d284c0e2f11edc35275b4 |
| lesson.template.json | 21742 | d9a2adae43c22454c8f5a6f682260fd88ec410bfe38af4ed9cade6708ba8918c |
| exercises.template.json | 20473 | 8d101fa8c090d6148adcbb2cc154a1e71da164fd21702c6fde4e7f96830f3870 |

The original target paths are retained in the manifest as provenance only;
no original target path was probed again or written.

## Saved Byte Provenance

The current `production-usage.json` was parsed first as structured records.
Its measured snapshot was 2235818 bytes, SHA-256
`7cfcef4a74dd6107527590f69940dd8e24a195e4a752f669d7b1a4c2995e4301`.
Relevant records retain the existing s6 text-only PASS, fig117 FAIL and
consumed correction allowance, but do not contain the target file bytes.
The narrow exact-path/hash lookup in existing saved command outputs found
no target bytes. Neither file nor any usage/checkpoint field was edited.

Only six November 15 archives matched by the exact target paths/hashes
were scanned; each matched STEMROBIN-180. Their absolute locations and
full byte bindings are in the manifest. The prior r144/r147 recovery
scripts were read for strict SHA extraction methods, not executed or redone.

Exercises: exact saved stdout JSON plus its saved newline, text-author
archive `17-56-12`, output line4814, originating call line4805,
`call_qJgQbzKGJCzWpmvO5QHXzAIY`. No exercise text was authored or solved.

Lesson: complete saved template fields from reviewer archive `17-33-56`,
line3548, whose historical jq command removed only `source.data`; the
exact saved source object and its original key order come from text-author
archive `17-56-12`, line4117. Only the original `save()` function in saved
`author.py`, line4136, was executed in memory. No current text substitution,
normalization, checks, anchors, editorial mapping or semantic comparison.

Spec: original saved shared builder, figure-author archive `19-51-49`,
line2638, `call_74sYNi7d8FSUuEeCWb8CyNZ1`. Only `Drawing`, `figure117`
and the original spec assignment were executed; `figure116` was not run.
Its full saved source/authoritative-text object comes from reviewer archive
`17-33-56`, line4199. The original historical 20-field fill-only patch,
figure-author line2705, `call_6QPxs4PpOBbmjIOMOavumt61`, was replayed on
that serialized string in memory. This recovered the already corrected
historical FAIL snapshot, not a changed candidate or another correction.

The existing Python runtime used `-I -B`. The memory runner intercepts
writes and rejects filesystem/network/process side effects during saved
code execution. No filesystem input was read by the saved code; all
saved source/code inputs were supplied in memory. No image was decoded.

## Source Identity Only

Current raw source paths are under:
`/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p`

| Raw File | Bytes | Full SHA-256 | Historical Binding |
|---|---:|---|---|
| lessons/phy6-c4-s6/lesson.json | 6887 | 19812124440615460ad49857bbcce8b67e145aa262bd683b3ee29667c7dab65c | MATCH |
| lessons/phy6-c4-s6/exercises.json | 7873 | 68904ad65c3794686588c05899147bc6b1c6a5b0eeef234702d070ffaf6d2bc9 | MATCH |
| figures/fig-117.png | 10903 | 4a505fab84fff7c89224cd2f8fa062b4acb3245db2435d5090a9bdd21aeb517f | MATCH |

The recovered lesson/exercises `source.sha256` fields match their respective
current raw bytes. The saved source identity uses the original relative
path `lessons/phy6-c4-s6/lesson.json`. No source/TEXT review or solving
was performed. Any future identity mismatch requires a promotion stop;
this recovery itself authorizes no promotion.

## Original Arrow Fields

Read directly from the recovered existing spec, not inferred from a render:

- `source-b-deep-mouth-down-arrow`: `from [442,174]`, `to [442,154]`,
  `strokeWidth 3`.
- `source-b-straight-mouth-up-arrow`: `from [432,156]`, `to [432,176]`,
  `strokeWidth 3`.

Neither arrow stores a `scale` field. Canvas is the historical spec's
640-by-640 coordinate system. The pre-existing blocker report records
SVG arrowhead scale 1.8; that remains a historical report declaration,
not a recovered SVG-byte or new render claim. No geometry, label,
direction, arrow size or object was changed.

## Failures And Unchanged Scope

The original scan receipt preserves the literal lookup misses and all
20 exact-substring SHA candidate attempts, including 19 nonmatches.
No nonmatching candidate bytes were written.

One recovery lookup failure is preserved in `lookup-failure-01.json`:
the first derivation expected an absolute embedded source path, but the
saved template uses a relative path. It exited1 before serialization or
target/evidence-manifest writes. The expectation was corrected to the
saved convention; no source data was changed. The following derivation
exited0 and all three target hashes matched. These recovery failures do
not constitute author/scientific failures or consume a new allowance.

Existing evidence reused without semantic comparison:
`modern-text-review-c4-s5-s6.md` and `figure-117-blocker.md` in the ticket
directory. S6 full TEXT PASS remains text-only. S5's separate original
REVISE is untouched. Fig117 retains source/math/unaffected-visual PASS
facts, its first independent FAIL/BLOCKED `F117-DIRECTION-1`, and original
author correction1/1 consumed. Canonical114/115/116 PASS was not repeated.

No SVG, render JSON, screenshot, missing PNG, whole evidence package or
course was restored. No image opens, browser, renderer, validator,
service, install, paid call, env/auth, DB, Git, other-chat contact,
worktree action, checkpoint, usage, ticket-state or canonical product edit.
Original trees, locks, backups, stash, histories, budgets and pending
messages were not changed by this recovery. Parent owns subsequent
checkpoints and non-overlap handling.

## Changed Files

Only this report and the following files under the authorized recovery
root were created:

- `recover.mjs`
- `derive.mjs`
- `serialize-memory.py`
- `scan-receipt.json`
- `lookup-failure-01.json`
- `derivation-receipt.json`
- `fig-117.spec.json`
- `lesson.template.json`
- `exercises.template.json`
- `manifest.json`

All absolute paths are enumerated in the frozen manifest. No required
target byte gap remains; ordinary authorized technical restoration later
is a separate parent-owned action.
