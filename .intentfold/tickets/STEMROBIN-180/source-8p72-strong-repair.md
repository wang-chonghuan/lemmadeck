# STEMROBIN-180/C: Sole 8p72 Strong-Weight Repair

**Mechanical exact-delta PASS; independent affected SOURCE review pending.**
No SOURCE approval, promotion, replacement SOURCEFIRST or reviewer dispatch.

Workspace W: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Exclusive repairroot:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-repair-8p72-strong/`.
Only this new root and this report were written. Other agents' edits were preserved.

## Authority And Frozen Inputs

Reused the completed Main55 author binding
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/8p7172-author-main-review-bindings.json`
and Main12 source-FIRST binding
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/8p72-source-first-main-review-bindings.json`.
Binder reruns: 0. No full binding-leaf replay.

The bound independent report
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-8p72.md`
and its review JSON confirm exactly one actionable omission:
`72-FIRST-INDEPENDENT-1`, physical 72 / printed 60,
`p0072#8`, first printed line / page-wide row 14.
The withdrawn `设/该` misreading is not a candidate defect and was not changed.
Fine typography metadata, tiny brace-label case and punctuation-codepoint
width remain three NONblocking residual classes, not additional repair targets.

Direct 72 actual/FIRST/artifact/work paths were selected from Main55,
not rediscovered by running a binder or prepare. Eighteen required bound
inputs were copied: artifact MD/JSON/audit; all eight original FIRST leaves
(candidate, run, stdout, stderr, actual MD/JSON/audit/figure);
work layout/template/source image/figure; page-72 author decision;
independent report/review JSON.
No page-71 leaf, grid image, review pixel crop or external runtime was copied.
Only selected copied inputs were hash-checked against the completed bindings
and checked unchanged afterward; no other source/candidate leaves were rehashed.

Input references, original FIRST bytes, historical author decision and
source-FIRST report/review bytes were frozen before repair.
`before.json` was frozen at `2026-11-16T22:51:59.607Z`;
`budget-before.json` preserves used 0 / unused 1 / sourceactual 0.
Frozen FIRST chronology and historical uncertainty notes were not rewritten.
The original page-72 FIRST remains exit 0 with 20 rows, 10 blocks, 1 figure,
0 tasks and initial-failure debit 0.

## Sole Character Repair

Only `artifacts/8p/pages/0072/page.md` was manually edited with `apply_patch`.
Its target line 79 changed exactly this fragment:

```text
Before: 这时初速度为$v_B$
After:  这时**初速度**为$v_B$
```

Exactly four ASCII `*` bytes were inserted around `初速度`.
No adjacent word, fine slant, lowercase `c`, formula, punctuation, heading,
caption, footer, block flag, figure reference, note or other metadata changed.
The copied JSON was not manually edited.

The repaired pre-call candidate, existing JSON/audit/figure and command
reservation were frozen under `REPAIR/0072/` before the sole finalize.
The original FIRST is preserved separately under `FIRST/0072/`.

## Actual Finalize

Exactly one new finalize was executed, with the original FIRST's bound
runtime/tool paths and only root/work changed to the exclusive repairroot:

```bash
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B \
  /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py finalize \
  --book 8p --page 72 \
  --root /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-repair-8p72-strong/artifacts \
  --work /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-repair-8p72-strong/work
```

Cwd: workspace W. Start `2026-11-16T22:52:07.620Z`;
end `2026-11-16T22:52:08.008Z`; exit 0; signal/spawn error null.
Actual MD/JSON/audit/figure and stdout/stderr were immediately preserved.
Stdout: 174 bytes; stderr: 0 bytes. Printed result:
10 blocks / 20 MD rows / 20 machine rows, 1 figure, 0 normalizations.
Fig-47 remains box `[432,1248,758,194]`.
No second finalize, retry, extra repair or separate pipeline checker.

## Before And After

| Leaf | FIRST / Before Bytes | After Bytes | Delta |
|---|---:|---:|---:|
| page.md | 2678 | 2682 | +4 |
| page.json | 4817 | 4821 | +4 |
| audit.json | 414 | 414 | 0 |
| layout.json | 851 | 851 | 0 |
| page.template.md | 1437 | 1437 | 0 |
| page.png | 78986 | 78986 | 0 |
| fig-47.png | 3379 | 3379 | 0 |

MD SHA-256 before:
`8fa54fc1c76cc1638090226b5f1591482a0afe63ceff74f83ebf86f0c1896746`;
after:
`def7742262e6693fc0a3d1782af052e706c1aa97331585f5384eb9b28389254b`.
JSON SHA-256 before:
`947be3ce0840d89621bbcf80d9c10ab95fa76c6dedfd38957904b6792fc05127`;
after:
`2c9a9b582119a58ad03333268ae7808d7f39c9e4e25981de7fb8f17abda492fe`.

Exact byte comparison proves the MD is the original plus only that insertion;
the JSON is its original serialized bytes plus the same insertion only at
`/blocks/7/lines/0`. Exactly one `**初速度**` span exists.
All metadata, rest text and non-target blocks are unchanged.
Audit/layout/template/source image/final figure retain their original SHA-256.
The deterministically re-cropped figure is byte-identical; no pixels were reopened.
FIRST and after both have **20 rows / 10 blocks / 1 figure / 0 tasks**.
Audit stays 20/20, errors 0, normalizations 0, unknown characters 0,
KaTeX warnings 0. All exact-delta checks are recorded in `verification.json`.
This proves the bounded repair and mechanical result, not SOURCE approval.

## Budget And Boundaries

| Counter | Before | After |
|---|---:|---:|
| Repair limit | 1 | 1 |
| Character repair used | 0 | 1 |
| Character repair unused | 1 | 0 |
| sourceactual | 0 | 1 |
| Environment/mechanical repair | 0 | 0 |
| Original FIRST failure count / debit | 0 / 0 | 0 / 0 |
| Repair finalize failure count / debit | 0 / 0 | 0 / 0 |

**One actual repair; failed debit is separate and is not an applied repair.**
No budget reset or shared-budget edit. No extra repair is allowed on failure.
Source-FIRST count remains 1; replacement SOURCEFIRST and affected reviews here: 0.
Independent affected reviewer is later; none was run or dispatched here.

New prepare 0, new finalize 1, image opens 0, reopens 0, inflight 0.
Finalize's required deterministic local image read/crop is not a visual reopen.
Page-71 mechanical HOLD was neither inspected nor changed.
No 7p335, backend, freshness, DB, Git, app, dependency, profile, shared-tool,
schema, assembly, modern edition, publication, supervision or other-chat action.

## Flat Manifest

The own `manifest.json` is exactly `{workspaceW, files}`.
Each `files` entry is an absolute direct own-leaf/report path, bytes and SHA-256.
The report is included; the manifest itself and `runtime/` are excluded.
No source/candidate external leaf or recursive manifest pointer is a file entry.
Input references, both budgets, original FIRST, pre-call candidate, actual
repair results and verification evidence remain available under the repairroot.
The manifest does not approve or promote this candidate.
