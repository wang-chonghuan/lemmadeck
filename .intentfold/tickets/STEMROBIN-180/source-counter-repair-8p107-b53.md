# Batch53 existing-tool counter repair: 8p107

**MECHANICALPASS only; independent FIRST SOURCE still required.**
One production-code patch, one focused test invocation, one actual affected107
finalization. **budgetused1 / remaining0 / limit1.** No SOURCEPASS,
promotion, vectorization, assembly or publication.

## Specification And Observation

Read router/readme, binding product/engineering/operations charter, lesson
cap1 and image-budget rules, and `source-8p107108-b53.md`. The human's explicit
local repair boundary excluded Git/backend operations and broader handoff checks.

Independently loaded only the original107 page:
[page.png](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-107108-b53/work/8p/pages/0107/page.png).
The left-edge mark is isolated outside prose, figure73, caption and footer;
it is not a text glyph or figure label. Page contract: 18 prose rows,
1 independent caption row, 1 footer row = **20**.

The reported x21..51/y1887..1914 core contains 617 ink pixels. Independent
component measurement finds a 20-pixel tail: complete component
`[21,1887,31,30]`, 637 pixels, density `637/930 = 0.6849462365591398`.
The normal row/glyph heights are 46/44; there is no neighboring ink within
two normal row heights.
[Actual pre-patch diagnostic](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source107-counter-repair-b53/commands/prepatch-component-observation.txt).

[Specification](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source107-counter-repair-b53/specification.md)
was written and byte-frozen before opening the old unit assertions. Expected
positive/negative cases came from the printed-row contract and observed107,
not current counter output.

## One Patch

[layout.py:332](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py:332)
extends the existing counting-copy component filter only. A margin blot must
be wholly in the outer 4% on either side, glyph-scale, near-square,
at least 65% dense, and isolated within a two-glyph-height neighborhood
(at most 10% additional ink). Narrow numerals, hollow edge glyphs, interior
components and neighboring glyph/figure-label strokes do not meet that conjunction.
Removed labels are zeroed so standalone-numeral recovery cannot resurrect them.
No crop, snap, source parser, row contract, figure box or pixel threshold changed.

[test_layout.py:17](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tests/test_layout.py:17)
adds 9 focused changed-criterion tests to one existing file; old assertions
were not modified. Cases cover both margins, standalone 1/7, hollow edge glyph,
same-row and vertically offset neighbors, interior ink, nearby figure stroke,
original107 and the original107 control without the blot. Input-array preservation
is asserted. Original-page tests receive the exclusive source copy via
`B53_SOURCE107_PAGE`; neither was skipped in this run.

[Exact production diff](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source107-counter-repair-b53/commands/counting-only-diff.stdout).
Its `diff` exit1 means files differ; it is not a failed test or failed repair.
No failed patch occurred; there was no second patch or retry.

## Actual Verification

Both commands used cwd `/Users/yong/.codex/worktrees/0f12/lemmadeck`,
`PYTHONDONTWRITEBYTECODE=1`, and shared runtime
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`.
The scratch evidence helper only copies, hashes and records actual commands;
domain work ran through the existing layout test and p2c tool.

| Actual invocation | UTC start / finish, November 17, 2026 | Result |
|---|---|---|
| `test_layout.py IsolatedMarginBlotTest -v`, once | 04:32:39.223 / 04:32:39.702 | exit0, 9 passed, 0 skipped |
| `p2c.py finalize --book 8p --page 107`, once | 04:32:44.237 / 04:32:44.525 | exit0, printed20 / md20, 8 blocks, 1 figure |

[Focused-test command/input hashes](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source107-counter-repair-b53/commands/focused-margin-tests.call.json)
and [actual test output](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source107-counter-repair-b53/commands/focused-margin-tests.stderr).
[Finalization command/input/output hashes](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source107-counter-repair-b53/commands/affected107-finalize.call.json)
and [actual finalization output](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source107-counter-repair-b53/commands/affected107-finalize.stdout).

Repair root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source107-counter-repair-b53`.
`--root` used its `artifacts`; `--work` used its `work`.
The current normalized107 MD/JSON/audit and original scan/crop were copied
with `COPYFILE_EXCL`, not regenerated or overwritten in the author root.
The prior audit allowed exact original figure-geometry reuse.

[Updated audit](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source107-counter-repair-b53/artifacts/8p/pages/0107/audit.json):
20/20, errors0, normalizations0, unknown chars0, KaTeX warnings0, errata0.
Figure73 remains `[338,1732,1108,457]`, components17, original rough-box
provenance `[330,1725,1125,470]` unchanged.

## Frozen Evidence And Preservation

[before.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source107-counter-repair-b53/before.json)
records 44 exact-byte `COPYFILE_EXCL` snapshots before the production patch:
all author-root files, original107 FIRST receipt/streams, old layout and test,
supporting tool inputs, source report and explicit specification.
The original FIRST failure remains printed21 / md20, exit1.

[after.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source107-counter-repair-b53/after.json)
freezes updated code/test, updated audit, actual command receipts/streams and
pre-patch observation with all byte lengths/SHA256 values, used1/remaining0.
All 42 non-code original snapshots and their frozen copies compare unchanged.
The two code files are the only permitted differences. Tested, finalized and
post-frozen code/test SHA256 values match exactly.

Repair `page.md`, `page.json`, source PNG, crop PNG and complete figure
geometry/provenance are unchanged versus the author originals.
The repair audit alone changed from the original failed audit; the author
audit and every FIRST input/result remain unchanged.

| Exact bytes | SHA256 |
|---|---|
| Old layout.py | `c64ba63bdb73b29cf984f3d63438ab78b5f16d179b8c800c9d3917ced0bd7271` |
| Patched layout.py | `7eaacc058ac1842a1b60883b2faa3df4f44a6f2439809ea80e2bac520282e557` |
| Updated focused test file | `455eccb0a14ca005c34b92c7096f294d8caf9e70cbe410ab20e1792a7d3fccaa` |
| Updated repair audit | `db030f6c7bb652849fa0c752259e8ff0e21bab9a058ba0086e527931652e94b6` |
| Unchanged normalized107 MD | `1a18114d46df2c72d31ab193609c3a58c20554d49c0fdb8aadf827a0ce5e38fb` |
| Unchanged normalized107 JSON | `319f6ea77d90da28c1cf2ec5ea6f00a8bd91f7a7f1db49d9c7a99daa3b86c7ca` |
| Unchanged original107 PNG | `7f2a39f800569710689249d984a02c59611cf58621e8d02bf04ecd94519d162a` |
| Unchanged figure73 PNG | `1aef9a17890cf0410ec514aa43bb4f80aaeb3a58a5b4646264e169fcca83b6df` |

## Boundary And Next Independent Step

**Images: parent0, loaded1, one batch, batch limit8, context limit24.**
Only original107page entered model context. No crop, grid, other source page
or modern asset was visually reopened. Array reads by tests/diagnostics do
not add model-context images.

No visits to 104/105/106/old HOLD work; no source108 finalization; no blanket
old-page checks or full suite. No DB, Git, backend, app, dependency installation,
services, new domain pipeline, vectorization, modern asset writes, promotion
or publication. No shared-checkout work was reverted.

Independent FIRST SOURCE must still inspect original107 against the unchanged
complete MD, original figure73/crop and repaired audit, including caption,
footer and emphasis scope. Mechanical row agreement does not certify source
fidelity. This report neither grants SOURCEPASS nor authorizes any promotion.
