# n83 modern tables: sole independent StageB

## Disposition and authority

- `tbl-p0036-01`: **PASS**, limited to the disclosed current spec/output and existing fixed-640px horizontal-scroll display evidence.
- `tbl-p0038-01`: **PASS**, with the same limits.
- No concrete cell, sign, border, label, current-asset binding, or observed display defect was found. This is not an unconditional source/text/math whole-gate approval or product finalization.
- Reviewer: Worker B / Codex, the established sole independent reviewer under parent-agent delegation within STEMROBIN-184. The reviewer is not Aristotle, the table author. An obsolete reviewer-role name in author materials does not identify the actual reviewer.
- This report does not execute or authorize `record_review`, promotion, lesson finalization, or publication. No author files were changed.

## Source-first chronology and disclosed bindings

The original table observations from the earlier physical-page source gate and the separate original-only table inventory preceded this StageB author disclosure. They were reused; no original page or source table PNG was reopened for StageB. The frozen inventory was read before comparing the disclosed contexts/specs/outputs. Author source-inventory file contents were not used as independent evidence.

| Binding | Raw SHA-256 |
|---|---|
| Independent StageA `ana10-n83-tables-independent-source-first.md` | `e0b9fb1964b7d79c4146d56117e57cbd18f3af67f4d3bd80d2768c0a1a22ebb2` |
| Author handoff `ana10-n83-modern-tables-author.md` | `61820d51f55708598a1fa82f9784b8c2a72cd3ebdd8d9a2c9c461f9a5b521b0a` |
| Author manifest `ana10-n83-modern-tables-author.manifest.json` | `2a547aab638479a4657b91e3dd991d1bca985abe118e70b3ed69853c351e783a` |
| Current approved DRAFT `lesson.json` | `d4db11167eea1ec208f6d30039e3b9befaa94e48fbce03e5ccedb4a7b102ff8e` |
| Current approved DRAFT `exercises.json` | `3174f166733abd18869f76197cec5577573b6e3468e729b194b0a583af110266` |

The DRAFT text directory is `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n83/`. The complete current projection of all 30 prose objects and 48 written exercises was read for current-context binding, not to reopen their substantive text/mathematics gate.

Read-only manifest verification found 79 entries, 77 unique paths, and zero raw-hash or byte-length mismatches. This binds the complete preview/attempt evidence as well as the canonical files listed below. Both specs' `source.authoritativeText` exactly equal their official context nearby-text projections, including ordering and whitespace; each projected string occurs exactly in the current approved lesson. Source image paths/hashes match the contexts.

## Table 36: complete cell and structure comparison

Headers are an actually blank first header, then `u`, `sin u`, `cos u`. The blank header has no inserted number or label.

| Source row | u | sin u | cos u |
|---|---|---|---|
| 1 | $\frac{\pi}{2}+\alpha$ | $\cos\alpha$ | $-\sin\alpha$ |
| 2 | $\pi+\alpha$ | $-\sin\alpha$ | $-\cos\alpha$ |
| 3 | $\frac{3\pi}{2}+\alpha$ | $-\cos\alpha$ | $\sin\alpha$ |
| 4 | $-\alpha$ | $-\sin\alpha$ | $\cos\alpha$ |
| 5 | $\frac{\pi}{2}-\alpha$ | $\cos\alpha$ | $\sin\alpha$ |
| 6 | $\pi-\alpha$ | $\sin\alpha$ | $-\cos\alpha$ |
| 7 | $\frac{3\pi}{2}-\alpha$ | $-\cos\alpha$ | $-\sin\alpha$ |

Every listed value/sign and its row/column ownership agrees with the frozen source inventory, current spec text, actual SVG text, native PNG, and inspected full/scroll screenshots. Positive entries have no added plus sign. Fractions remain stacked, including the numerator 3 where present.

The source has four columns and four ruled horizontal bands: header, three positive-shift baselines, the single negative-angle baseline, and three negative-shift baselines. The seven data baselines remain grouped **3-1-3**. There are no added full-width separators inside the three-row groups. This distinction is retained rather than replacing the source with an ordinary eight-row ruled table.

Actual SVG/output geometry:

- Canvas: 640 x 552. Vertical boundaries: x = 24, 108, 278, 448, 618.
- Full-width horizontal boundaries: y = 20, 84, 276, 340, 532.
- Header baseline y = 52; data baselines y = 116, 180, 244, 308, 372, 436, 500.
- Fraction bars occur only on the applicable baselines 116, 244, 372, 500, within x = 155..185 or 153..187; they are not table-row borders.
- There are 16 physical bounded cells and 32 logical alignment positions, including the blank header position.
- The spec has 51 objects: eight grids, four fraction segments, and 39 text components. Actual SVG text exactly matches all 39 components.

Each horizontal band is represented by an adjacent one-column index grid and a three-column mathematical grid. All eight mapped grids have their own executable `gridDimensions` assertion for one row and respectively one or three columns. Referenced objects/assertions resolve. The supplemental object-count assertion is not used as a substitute for cell dimensions, border ownership, or actual output inspection.

**Result: PASS.** The disclosed output preserves all frozen cells, the blank header, and the source's four-band/seven-baseline organization.

## Table 38: complete cell and structure comparison

Headers are an actually blank first header, then `u`, `tg u`, `ctg u`.

| Source row | u | tg u | ctg u |
|---|---|---|---|
| 1 | $\frac{\pi}{2}+\alpha$ | $-\operatorname{ctg}\alpha$ | $-\operatorname{tg}\alpha$ |
| 2 | $-\alpha$ | $-\operatorname{tg}\alpha$ | $-\operatorname{ctg}\alpha$ |
| 3 | $\frac{\pi}{2}-\alpha$ | $\operatorname{ctg}\alpha$ | $\operatorname{tg}\alpha$ |

Every value/sign and its ownership agrees with the frozen inventory, current spec, actual SVG/PNG, and inspected screenshots. The output keeps the literal `tg`/`ctg` labels rather than substituting `tan`/`cot`. Positive entries have no added plus sign. The two fractions remain stacked.

Unlike table 36, this table retains a header and three **individually ruled** data rows. No source row boundary is omitted or added.

Actual SVG/output geometry:

- Canvas: 640 x 320. Vertical boundaries: x = 24, 108, 278, 448, 618.
- Full-width horizontal boundaries: y = 32, 96, 160, 224, 288.
- Header baseline y = 64; data baselines y = 128, 192, 256.
- Fraction bars are confined to y = 128 and 256, x = 155..185.
- There are 16 physical/logical cells, including the blank header.
- The spec has 29 objects: eight grids, two fraction segments, and 19 text components. Actual SVG text exactly matches all 19 components.

The eight grid mappings again resolve and each has an executable one-row `gridDimensions` assertion with the correct one/three-column split. Actual SVG lines confirm the complete grid; counts alone were not treated as a fidelity check.

**Result: PASS.** The complete per-row grid, all signs/functions, and blank header are retained.

## Actual output and retained display evidence

Sixteen distinct existing images were actually opened at original detail, eight per table: native `table.png`, complete `previews/print-640-full.png`, all three `neutral-240-{start,middle,end}.png`, and all three `print-346-{start,middle,end}.png`. The neutral-640 full image is byte-identical to the opened native PNG; that observation was reused rather than reopening the identical image.

Both full-image themes have intact outer borders, legible text/fractions, consistent line weights, and no visible label collisions, stray points, oblique lines, answer annotations, or cultural decoration. Visible SVG text/lines use semantic `var(--ld-figure-ink, #15201f)`. Hidden construction-path fallback colors do not appear in the inspected output.

The existing display contract is `layout: scroll`, `purpose: instructional`, `minTextPx: 16`, and `widths: [640]`. Retained metrics show:

| Existing display | Actual media/scroll extent | Captured horizontal positions | Text |
|---|---|---|---|
| neutral 640 and print 640 | Complete 640px media | full image | Ordinary 22px, fraction components 18px |
| neutral viewport 240 | scrollWidth 640; maximum 400; pageScrollWidth 240 | 0 / 200 / 400 | Minimum 18px; no media downscaling |
| print viewport 346 | scrollWidth 640; maximum 294; pageScrollWidth 346 | 0 / 147 / 294 | Minimum 18px; no media downscaling |

Each display record's complete label/text mapping agrees with the current spec: 39 components for table 36, 19 for table 38. All referenced screenshot hashes match the manifest/current bytes. The narrow screenshots deliberately show viewport clipping of neighboring cells; the end positions expose the right outer border. This is horizontal-scroll behavior, not clipping of the canonical full image.

These are actual reviewer observations of retained author images plus read-only inspection of retained measurements. **The reviewer did not launch a browser or recompute widths.** Existing metrics declare isolated headless contexts, zero network requests, `PWDEBUG` unset, and `PLAYWRIGHT_HTML_OPEN=never`. No additional accent theme was disclosed or approved.

The PASS is for the fixed-640px scroll harness. It does not claim inline shrinking to 240/346px, a new product-layout gate, or lesson/product finalization.

## Attempts, failures, and current-byte identity

Both retained explicit draft checks report exit 0/PASS. Each table has one first render, exit 0, passing render report, empty collisions, and a minimum-text width check of 18px. There were **zero spec repairs** and no reviewer validator/renderer/test reruns.

- Table 36 render: 07:11:37.087Z to 07:11:38.567Z, as recorded in its existing report.
- Table 38 render: 07:11:37.255Z to 07:11:38.567Z, as recorded in its existing report.
- The first display probe failed ESM resolution of `playwright-core` before browser/script execution. The original script/command and error excerpt remain retained; the excerpt is not claimed to be complete raw stderr.
- The scratch probe's import resolution was repaired using existing `createRequire`; its subsequent retained execution exited 0. This was not a spec repair, renderer rerun, dependency change, or removal of the first failure.

Current context/spec/SVG/PNG/render bytes equal their `attempt-01` snapshots. Retained metrics' before/after hashes equal the current canonical assets. No post-review author edits are covered.

## Current canonical hashes

Packages are `.tmp/s10y-image/batch007/10c/tbl-p0036-01/` and `.tmp/s10y-image/batch007/10c/tbl-p0038-01/`. Source PNGs are the corresponding durable figures under `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/`.

| File | Table 36 raw SHA-256 | Table 38 raw SHA-256 |
|---|---|---|
| Source PNG | `ab6f1b14ae9b98c981eb337d5c0b55bd692b1661fa45716c9c8132ff42f978a4` | `5efbd8da9ee3dcbaa1f50bd9b40315d4647f8c0a3705f15185b959a1cd301ba9` |
| `context.json` | `89821cef344d74669edc353d9be16d4d037595a140060e120d0b6499f0e76e70` | `a77e9616cdfb371a749f5bfb961f586afb5e73df761a29667495578e45cbb62c` |
| `spec.json` | `ee66b348c00178095f66022a7699df63a1ca94cbefffd25c589c1724fde583a2` | `8c8b798af679d16d25f33743299bf632cb2355568fda68607940d18024d7f6eb` |
| `table.svg` | `3853005f986df08252a97774c686c306b06d44742b4ca4bd90d5330f595c182b` | `64e78c538cb1e72156a51477f24932c6d37089fd0a03f5fecfc5f82275758f47` |
| `table.png` | `a4f6ba628d2e43fed4b3adb4d2581afa6f7a1b1218af46ca3f52b75d880172e0` | `39b061f445bed367f24285504328072781b06bd18df3a77284f5a608a8ad6115` |
| `table.render.json` | `1182a24ca29cbfa8782b50daa7938776a0614a57b765805eb13db9ebc4c15e3e` | `b07d961af6f4165319b6ba2a2d0bf76489efe47107879581ee4a32e8dd9522d1` |
| `previews/metrics.json` | `214547dd59f084ca4bdaf863973b5a6b7dd7fef3eda7d864e910d5c005a3aa08` | `b8b14323f769515af7a9925fc2482d5a2cec4b806c98bf88bb94026dba6ee4f6` |

The manifest cited above provides exact paths/raw hashes for every remaining screenshot, command, attempt snapshot, and retained probe artifact.

## Limits retained, not silently resolved

- The original alpha-shaped glyph's exact `a`/Greek-alpha codepoint remains a source-pixel limitation. Modern context variable binding to `alpha` is consistent with the disclosed text but is not proof of an original raster codepoint.
- Clean font, coordinate spacing, and line-weight regularization are modern presentation choices, not measured source mathematical data. They do not change the frozen cell values or border topology.
- No extra condition/domain cell was inserted. The adjacent exercise 101 notation/interpretation UNKNOWN is not resolved or reviewed by this table gate.
- Earlier source-gate uncertainty is not erased by author tool PASS or by this scoped output PASS. No source/text/math gate was repeated.
- The unrelated n84 original-only inventory remains frozen at `17aab7d53243f7cd53800c30c587d8bb8ab817e1c9f71fc1f0676df9e8a73e47`; its author package was not processed.

This is the immutable handoff for the sole n83 table StageB at the hashes above. Stop after external report hashing.
