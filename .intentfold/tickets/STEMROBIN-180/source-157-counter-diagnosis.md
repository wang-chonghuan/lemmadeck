# Source157 Counter Diagnosis

Scope: one focused, read-only diagnosis of the frozen157 **16 actual rows /15 counted rows** deficit. Not an independent source review, not a source amendment and not a repaired-gate PASS.

Only157's original PNG, existing layout/audit/MD and current counter implementation were examined. One unmodified `layout.line_bands` call was traced in memory using the frozen crop mask; two subsequent targeted connected-component/area calculations inspected the already-identified region. **No prepare/finalize/vectorize or other gate was rerun; no source, crop, SVG, tool, frozen manifest or author report was modified.** No161+ access, browser, Git, DB, service or installation.

## Frozen Inputs

Original:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0157/page.png`

Existing source/audit:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/artifacts/6p/pages/0157/{page.md,page.json,audit.json}`

Counter:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py`

| Input | SHA256, unchanged |
|---|---|
|Original PNG|`6ea043493bbef3974ceefc70783670ee6de9c5b4f83c2d0b42311e85f33312b4`|
|page.md|`b381005d791ecdc8c8441391ee151b0bc5c52983cbd26162354909b0eb1d73a7`|
|page.json|`ecfff7ff392f2aab8ed931c9b9b2d6d7f5c444cc060a6b57408f89133f4c172c`|
|audit.json|`a6744445a6d85a2b27536972414df6a5850c41a7ae5f590c49e1160f99407d65`|
|layout.py|`9723a80790ee216716e4a6097c77a57cc9bf4deab78da0250f851ad6bb7d9435`|
|Author frozen manifest|`8a42de8925fc702072f448c58dfb5c896ae2b2545f9001e9a0123b2bcaa19921`|

Counter hash matches the author handoff's recorded implementation hash. Source MD/JSON/audit/PNG and counter hashes were measured before and after diagnosis; all unchanged. The original first failure remains in `source-author-156-160/evidence/0157-finalize-1-first-failure`, untouched.

## Exact Lost Row

The original was actually opened. In source block `p0157#2`, printed line2 is:

`高的高度内，平均每升高12米大气压强减少1毫米高水`

Printed line3 is the separate short line:

`银柱.`

They are **not a fraction, shared row or redundant text**. The third line's ink is retained in the original; its separate **row count** is lost by merging, not by omission from the transcription or figure cropping.

Existing prepare layout already records `[429,537]` as one band. The isolated unchanged counter probe, using content width1186 and the frozen figure box `[213,658,1109,442]`, likewise returns15 bands:

```text
[215,255] [287,325] [356,397] [429,537]
[1152,1181] [1215,1257] [1286,1327] [1359,1399]
[1502,1540] [1572,1614] [1644,1682] [1716,1756]
[1785,1827] [1857,1896] [2000,2027]
```

Initial fragments in the affected region are `[429,469]` (long body row), `[477,485]` (its emphasis dots), `[501,537]` (short body row), `[549,556]` (two emphasis dots below the short row). Connected-component restoration extends body spans to `[429,470]` and `[500,537]` before close merging.

## Actual Causal Branches

1. **Entire emphasis-dot row rejected by one half-pixel misalignment.** In `layout.py:270–287`, `[477,485]` contains23 eligible dot components. `regular_sequence=False`: one spacing is89px (centers386→475), outside the current `[23.4,58.5]` interval for `glyph_h=39`. `aligned_sequence=False`: exactly **one** center, x710.5 under the printed number12, fails strict containment within an individual body component. All other22 centers satisfy strict alignment. The `continue` at line287 therefore skips removal of the entire dot row.

   Nearby body components are digit1 `[x688,705), y432–463` and digit2 `[x711,729), y432–462`. Dot center710.5 is only **0.5px left of digit2's start**, between the two digit components. This is source raster/centering geometry, not an extraneous source dot.

   The otherwise-unreached area guard at lines288–290 was evaluated separately from these same pixels:23 dots have area1295px and total ink area in the guarded band is1295px, ratio1.0; required0.8 is satisfied. The emphasis rows `[406,413]` and `[549,556]` are successfully removed by existing code, so the specific defect is the surviving middle23-dot row.

2. **Surviving dots bridge two real body rows.** At `layout.py:343–373`, `line_h=39`, `glyph_h=39`, `merge_gap=15.6`. Actual traced merges are:

   ```text
   [429,470] + [477,485]: gap7 <=15.6
   [429,485] + [500,537]: gap15 <=15.6
   => [429,537]
   ```

   Both `separate_tall_rows` and `separate_offset_rows` are false at each merge. The subsequent fragment-joining pass does not change this band, and `fraction_starts` is empty.

3. **A correct provisional two-row recovery is vetoed as a false fraction.** At `layout.py:436–459`, band height109 exceeds `2.2*39=85.8`; `typical_gap=31`, `pitch=70`, so recovery computes `max(2, round((109+31)/70))=2`. Then `_single_fraction_row(ink,429,537,39)` returns **True**, and line459 resets count2→1.

   The fraction classifier's body-center clusters are relative-y `[19.5,25.0]` with17 qualifying components and `[90.0,90.0]` with **one** qualifying component from the short row. Its line145 requirement of≥3 components per row discards that second cluster, so the two-body-row veto at lines147–148 does not fire.

   Horizontal CJK strokes are accepted as candidate fraction rules `[x549,582], relative-y34` and `[x903,942], relative-y37`. After rule-column masking, the global25%-of-peak remaining-ink threshold retains only relative-y2–39 and49–55, not the short row. The remaining extent54px is≤78px, so lines187–192 returnTrue. No printed fraction exists in this source paragraph. The recovery pass's full-width strong peak similarly contains only `[432,467]`.

Conclusion: **real counter defect confirmed for these frozen inputs**, with a strict all-points alignment rejection causing dot bridging, then an insufficient short-row veto allowing false-fraction collapse. This does not require a source-text correction.

## Minimal Candidate Fix, Not Applied

The narrowest candidate is **1px horizontal tolerance** in the existing dot-to-body containment at `layout.py:283`, consistent with the surrounding ±1px vertical bounds:

```python
# Candidate only; not applied or executed in the counter.
any(columns.start - 1 <= center <= columns.stop + 1
    for columns in body_columns)
```

Keep all other guards unchanged: actual preceding body-row height/gap, dot component sizes, minimum two aligned points, and≥80% area. This admits the sole0.5px boundary miss; the other22 centers already align. Area coverage is100%. Without `[477,485]`, the two body rows are30px apart (`500-470`), greater than the unchanged15.6px close-merge threshold; the erroneous109px fraction candidate would not be created by this branch. This is a prediction from measured geometry, **not a claimed patched-run result**.

Merely lowering the fraction-row component threshold from3 to2 would **not** address this case: the short row yields only one qualifying component in that classifier. No global gap, row count, source `samerow`, forced wrap or source text should be changed.

Candidate remains unapproved and untested. If separately authorized, verify the exact frozen157 raster against independently observed16 rows, retain single-row/nested-fraction negative cases, and retain non-emphasis marks when alignment/area guards fail. No such tests or future gate runs occurred in this diagnosis.

## Stop

Diagnostic work complete. Frozen source and first-failure evidence remain unchanged;157 still has its original official mechanical FAIL. Independent full-source review remains Ramanujan's separate assignment.
