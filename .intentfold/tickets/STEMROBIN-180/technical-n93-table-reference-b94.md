# STEMROBIN-180/180-4: Explicit Printed-Page Table Reference

Bounded technical repair C, 2026-11-19. Code verification PASS; no source/text
approval, parent integration, canonical promotion or content finalization.

Checkout for every command:
`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.
The direct human assignment is the bounded specification; no backend operation.

## Exact Changed Paths

Relative to the recorded checkout:

- `.claude/skills/ld-s10y-lesson/tools/assemble.py`
- `.claude/skills/ld-s10y-lesson/tools/edition.py`
- `.claude/skills/ld-s10y-lesson/tools/test_printed_page_table_reference.py` (new)
- `.intentfold/tickets/STEMROBIN-180/technical-n93-table-reference-b94.md` (new)
- `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-table-reference-fix/`
  (only this repair's scripts, baseline/candidate snapshots, generated fixture,
  narrow patch, receipt copies and manifests; `freeze.json` inventories every file).

The required parent `run-stage.mjs` also retained uniquely labelled
`n93-table-ref-*` JSON/stdout/stderr receipts in its existing `commands/` directory.
No edits to `layout.py`, other existing code, page bytes, canonical content or the
parent cohorts. No Git commands, image opens, browser/web/ctx7, environment reads,
DB, app, dependencies, services, other agents/chats, promotion or paid calls.

## Source Contract

Approved physical 245 / printed 234, `p0245#11`, exercise `g2-2` in `练习46`:
`（2）在加热情况相同的条件下，比热表（见第230页）所列的液体中哪一种温度上升得最快？`

Printed 230 uniquely maps to physical 241, `p0241#2`, `kind=fig`, `label=表`,
`id=tbl-p0241-01`. This remains n92's raw/prose table. Neither an `owner-ex`
declaration nor an n93 raw figure/block/prose entry is invented.

`TABLE_PAGE_REF` accepts an explicit `表（见第 N 页）` suffix, including the
`比热表` name, ASCII/fullwidth parentheses and normal whitespace.
`resolve_printed_page_table` rejects absent or ambiguous physical-page mappings,
and zero or multiple matching table figures with counts and candidate diagnostics.
Plain table prose, ordinary page references and existing numbered FIGREF behavior
are unchanged. Repeated explicit references preserve each exercise's `figure_refs`
and display once at the first citing exercise, without `_figure_owner` distance.

`lesson_figure_sources` preserves raw figure ordering and appends only missing IDs
actually referenced/displayed by raw exercises, uniquely resolved from the
authoritative book page stream. `cmd_prepare` includes their existing PNG/SVG
source paths/hashes and reports the actual manifest count. Raw source snapshots and
edition exercise identity/figure validation are not relaxed.

## Baseline And Candidate

Full existing dirty source bytes were captured once before any code edits, at
`tmp/resume-180-4/n93-table-reference-fix/baseline/`, already mode `0444`.
The new test/report paths were absent. No existing tests were consulted for design.

| File | Baseline SHA256 | Candidate SHA256 | Narrow Delta |
| --- | --- | --- | --- |
| `assemble.py` | `e2ac5b292899ed8908b66659eb3dc4bcf2f38ffdeae2c679eabb011748a1041c` | `81aa3d1c32de8309b852598119f16e21423cb995e067d528351bed02904d117f` | +47/-0 |
| `edition.py` | `e8c8ac7f4898a37abc4f8af6354406def032a419a96186ea78e29d6c6d4ab22f` | `434e21ad3b522ea333a8f3cdc60227091061e581a39eebeb94350d5866a78497` | +31/-2 |
| `test_printed_page_table_reference.py` | absent | `e4da5e59d7243ab60314ccf57b68e028ca40c05221da7743a0f2f7edcbd26d1d` | +216/-0 |

Baseline manifest SHA256:
`439e79c1b49a63236667d2f89ac8c70b35577705caa4d51dccff64900949bf59`.
`narrow-delta.patch` SHA256:
`7c93194babfc865efe8797c138ca1bd75baca56ec69394913811b7765c951676`.
`candidate.json` binds snapshots and exact paths; `freeze.json` binds this report's
final candidate hash, all frozen evidence hashes/modes and receipt results.

## Executed Evidence

All receipt names below are in the existing parent `commands/` directory and are
copied into this repair's frozen `receipts/` directory:

| Receipt | Result |
| --- | --- |
| `n93-table-ref-baseline-1.json` | exit 0; full dirty baseline and 42 protected hashes |
| `n93-table-ref-focused-tests-1.json` | exit 0; 9 new focused unittest methods PASS |
| `n93-table-ref-integration-1.json` | exit 0; current approved 7-page source integration PASS |
| `n93-table-ref-lookup-current-1.json` | exit 0; exactly `tbl-p0241-01@p0241#2`, printed 230 |
| `n93-table-ref-lookup-missing-1.json` | expected exit 2; printed 999 has 0 physical pages |
| `n93-table-ref-lookup-zero-1.json` | expected exit 2; printed 230 fixture has 0 table figures |
| `n93-table-ref-lookup-ambiguous-1.json` | expected exit 2; printed 230 fixture has 2 named candidates |
| `n93-table-ref-candidate-evidence-1.json` | exit 0; baseline-to-candidate diff and hash export |

The tests cover exact 245-to-241 cross-lesson ownership, four valid syntax forms,
repeated uses/display idempotence with a closer later exercise, five missing or
ambiguous target cases, five ordinary-text negatives, unchanged numbered figures,
prepare deduplication and immutable source identity, owned-figure nonduplication,
and absent/duplicate supplementary IDs. No full-project test suite was run.

## Actual Integration Counts

The approved `.tmp/ld-s10y-lesson/resume-180-4-n93-cohort/artifacts/7p` is read-only
input: 7 pages (240-246), 76 blocks, 4 in-memory lessons, 16 total exercises.
Only `load_stream`/merge/cut/split/TOC identity/claim and fixture prepare ran;
the writing assembler, audit, finalize and publishers were not invoked.

- n92: 10 prose blocks, 5 exercises, 1 own/prose table; all projected JSON/Markdown
  match current assembled inputs, and copied fixture output bytes are unchanged.
- n93: 20 prose blocks, 8 exercises, 0 own figures. The sole delta is `g2-2`:
  `figure_refs=[tbl-p0241-01]`, `figures=[{id:tbl-p0241-01,label:表}]`.
- n93 table-reference exercises: 1; exercise displays: 1; prepare supplements: 1.
- All 42 baseline-protected files, including `layout.py`, both cohorts' n92 raw
  outputs and all n93-cohort inputs, retain their original SHA256.
- Parent cohort writes: 0; production/source reviews replayed: 0; promotions: 0.

Passed n92 hashes retained in both the source and generated fixture:

| File | Unchanged SHA256 |
| --- | --- |
| `lesson.json` | `d4fbc9435faeb507fccee6ca26923cafb8f3ef1b5305162e92b2ee89b492c81b` |
| `lesson.md` | `32a53e5d2175969c4689c8a25479554e4f44041b06900c767c8132dfe41eacac` |
| `exercises.json` | `f660381e4919977e16bcfb60874c52a05fae900ad45c6386f1d819756e3edd68` |

Supplement source PNG:
`e14a09002ecc89035ccce5528109cebff7007998ba552db4952e52706df81189`.
Supplement source SVG:
`2cb325e060e700ee4b84bf873903c967d6b9cc3971d0d4ddc0bfc6ea26db2bb3`.
Fixture pages/book/figures use three read-only source links; freezing does not chmod
their targets. The pre-existing `p0240#1` continuation warning remains unchanged.

## Stop Boundary

Freeze this repair's evidence files as `0444` and stop. The parent owns affected-only
assembly, source/text review, n92 modern figure/answer integration and any later
promotion. This technical PASS does not approve content or lift another HOLD.
