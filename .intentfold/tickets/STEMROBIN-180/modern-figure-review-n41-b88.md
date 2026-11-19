# STEMROBIN-180 / B88 / n41 Independent FIG Review

Date: 2026-11-19. Same cap3 invocation `invocation180-3`.
Workspace W: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Independent FIG reviewer only. **fig-114: PASS. tbl-p0168-01: PASS. STOP.**
No remaining figure defect was found in the exact reviewed bytes.
This is draft figure approval, not promotion, lesson publication, or product DISPLAY approval.

## Authority And Scope

All shell commands used W. The complete modern lesson, all five modern exercises,
both original PNGs, both existing 308/640 previews, current exact specs/SVGs/render
reports, preserved FIRST table evidence, and author report were inspected.
Both specs bind the complete 17 nonempty modern prose/caption/exercise items
exactly, not excerpts or the embedded historical raw text.

| Authority, Relative To W | Actual SHA-256 |
|---|---|
| `.tmp/ld-s10y-lesson/b88-friction-author/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n41/lesson.template.json` | `ca6d4ff8c3c7b41d4a4f89cfc7ca20fbf55c356e5b711111b142874bdfdd029d` |
| Same candidate directory, `exercises.template.json` | `5da3d2035680d759baaf2c731f1280817f12248fabef3e8fd0e35373c8567067` |
| `.intentfold/tickets/STEMROBIN-180/modern-text-review-n41-affected-b88.md`, affected TEXT PASS | `bcbca2dfa827ce7616330945d3130531f7556a5f3a43abd571b0707a43c309b1` |
| `.intentfold/tickets/STEMROBIN-180/modern-figure-author-n41-b88.md` | `a13e4299c0dbccd1e92daa39ccc815b2750b2aeb216fd87ba422a0011e415a7a` |

The author's historical TEXT/FIG-pending statements remain unchanged. The parent
affected TEXT PASS is hash-verified context, not replaced by this FIG review.
An initial read-only hash command guessed nonexistent `lesson.md` and
`exercises.json`; the actual `*.template.json` files were then located and fully
read. No freshness, setup, backend, or production recovery replay occurred.

## Independent Source Inventory

Opened original `fig-114.png` first, then original `tbl-p0168-01.png`, at their
original resolutions. Wrote `tmp/b88-n41-figure-review/source-inventory.md`
under this ticket before inspecting any draft objects/specs/SVGs, author report
or previews. The following mappings were checked afterward against that
independently recorded pixel inventory.

**fig-114: PASS**

The source has one upright block on a horizontal supporting tabletop, underside
horizontal material hatching, and a vertically hatched right support. These
remain visible as `block`, `tabletop`, `right-support`, `table-material-*` and
`support-material-*`; the exact object geometry retains both contact corners
and attachment of the support.

The source's rightward applied-force arrow is `applied-force`, with the exact
English-translated given label `F = 10 N`. The source's downward weight arrow
is `weight`, with `P = 20 N`, originating at the contact midpoint. Native
`connects`, displacement, perpendicularity, point-on-line and equal-distance
assertions resolve and pass. Independent checks bind the actual block/arrow
objects and the SVG's rendered arrowheads, including their actual directions
and endpoints; coordinate-literal assertions or object counts alone were not
used as source-fidelity proof.

The apparatus is complete as an abstract source sketch. No spring balance,
pulley, second block, extra weight, force, speed, acceleration or coefficient
annotation was invented. English N, clean rectangles, semantic block fill,
regularized nonmetric hatching and unscaled arrow lengths are declared modern
additions in `context.json`, not asserted source measurements.

The authoritative example specifies an already-sliding block on a fixed
horizontal tabletop, weight 20 N, horizontal push 10 N and kinetic coefficient
0.5. The figure draws only the original givens and does not imply that these
forces start motion from rest. It adds no worked friction/normal-force answer,
Q4 coefficient, Q4 numerical result, or Q5 load answer.

**tbl-p0168-01: PASS**

The source is a two-column table: Materials / Friction coefficient, one header
band plus four complete data rows, no merged/blank cells or coefficient units.
The original has an enclosing border, central divider and header rule, but no
body-row separators. Exact source order and decimal strings are preserved:

| Source Material Pair | Coefficient | Checked Draft Objects |
|---|---|---|
| Wood and wood | 0.25 | `wood-wood-materials`, `wood-wood-coefficient` |
| Rubber and wood | 0.75 | `rubber-wood-materials-first/second`, `rubber-wood-coefficient` |
| Steel and ice | 0.04 | `steel-ice-materials`, `steel-ice-coefficient` |
| Steel and steel | 0.20 | `steel-steel-materials`, `steel-steel-coefficient` |

The `table-lattice` finite grid is covered by `gridDimensions`: exactly two
columns and five total rows. Native displacement and inside assertions pass;
the independent checks additionally inspect actual label coordinates, exact
material/value strings, row membership, border geometry and the SVG's three
vertical/six horizontal lattice lines. Every wrapped label remains in its
intended cell. No objectCount substitutes for table dimensions or associations.

English translation, equal column widths/row heights, three added body rules
and local wrapping are explicitly declared modern legibility additions.
No lubricated-material row, static/kinetic reinterpretation of source data,
extra material pair, exercise coefficient assignment or answer is added.
The surrounding complete modern prose supplies the source table's unlubricated
surface context; the figure does not silently turn those values into units.

## Visual And Mechanical Gate

Existing `fig-114.preview.png` and `tbl-p0168-01.preview.png` were opened once
each; each includes the actual 640 px and 308 px figure widths side by side.
The apparatus, arrows, table rows and all English labels are visible and
readable. No collision, clipping, missing object, black/broken raster, cultural
text/symbol leakage, or answer disclosure was observed.

All 2 apparatus labels and all 12 table label runs use actual SVG font size
34 px with a 640 px viewBox: `34 * 308 / 640 = 16.3625 px` at 308, and 34 px
at 640. Both exceed 16 px. Exact label text/coordinates/font attributes match
the specs; both current render reports are pass with empty collision lists.
Visible vector colors use semantic CSS variables; invisible JSXGraph
construction elements are not mistaken for visible colors or source points.
Neutral previews were independently viewed; existing accent/print checks were
read as author evidence, not claimed as new independent themed screenshots.

Read-only native rendered-stage validation and independent object/SVG checks
passed for each figure. No renderer was called. This review makes no new
browser, product-surface, scroll-end, lesson validator or offline lesson-render
claim; those downstream publication gates are outside this authorization.
Render metadata references only the staged final SVG, never the preview or
ticket-evidence files. Its `.tmp/` draft paths are not promoted durable assets.

## Repair And Byte Preservation

The author already used the one targeted table repair. Independently compared
FIRST and current spec: only `coefficient-header-first.at[1]` changed 535 -> 532
and `coefficient-header-second.at[1]` changed 485 -> 482. This is a 3 canvas px
downward shift, retaining their 50 px separation. Data, text and table geometry
are unchanged. FIRST render remains **fail**, including its recorded Friction
header collision, and its hashes still bind the retained FIRST spec/SVG.
The reviewer made zero repairs and never rerendered either figure.

All pre-existing draft-root files, the original PNGs, authority templates,
author report/evidence and affected TEXT report retained their bytes across
review recording. `preservation.json` verifies this against the actual
pre-recorder hash snapshot. No other worker's changes were reverted.

## Exact Output Binding

Draft root D: W/`.tmp/ld-s10y-lesson/b88-n41-figures`.
Source root S: W/`ssot-resources/soviet10year-textbooks/artifacts/8p/figures`.

| Exact File | Actual SHA-256 |
|---|---|
| S/`fig-114.png` | `d158a8de1097461f392fdb1e93afb4421196903c16d5208fbddf3e313e2a8f7c` |
| S/`tbl-p0168-01.png` | `b9fd67d38d1a35112958c4e4cccc2be04b5fc4fc307dc0affacf1f9c63c4827c` |
| D/`context.json` | `5b32a78d4ef16afd788db155913425d875718a43badcf4b8152e8475a7873a32` |
| D/`fig-114.spec.json` | `806fd7b300d45a78cf90b6089fa3f5a483431016b6e642dd57f8d779cb5b4cd0` |
| D/`fig-114.svg` | `82c06ba355ca99d7aba85039e5d926011ad31ee1cea6c885bd9b828568186b7c` |
| D/`fig-114.render.json` | `c01a86fb6f3e41cf648ef8d0b6cce7a6d4dbce34237c033cb76c7f34a6930176` |
| D/`fig-114.preview.png` | `ddd7f8ac5dcb3cbe7ad3db620f68b55991126ee491a97f3a39edf997e0baed47` |
| D/`fig-114.review.json`, independent PASS | `d0c66256363997e8e03cb69d19b94a8a709bd59020a44e0110d9a745a5aa8e66` |
| D/`tbl-p0168-01.spec.json` | `931f3b67c015a49f94c40287ac7c42efb4e0583bb3509eac0794a45fd514922a` |
| D/`tbl-p0168-01.svg` | `233a7fe59cab2862f3ed9fcb90e68cf3d584fef9a61d18d3dd74411b6561eb42` |
| D/`tbl-p0168-01.render.json` | `beaafc03d87c6183d82cc06445168cc69d6df935636ad20756a9d987d96a5734` |
| D/`tbl-p0168-01.preview.png` | `09dab2d3a5ae24ff17745d236f44f5729e2a6d2bc1a4f328758db46bac8d6ed8` |
| D/`tbl-p0168-01.review.json`, independent PASS | `fea6f0309f17ae0d3d6d3da5ef373c7126f704f158cadb11709721a3a82b2c9d` |
| D/`tbl-p0168-01.FIRST.spec.json`, preserved | `306ac6da5fd0b5b0f9908cd312181e2ba8f485f4a1919721b1e2668e565e9e5a` |
| D/`tbl-p0168-01.FIRST.svg`, preserved | `1dc579b4b66666aec6c44b7c7fc1842759ae300b832c4404b5861c58369031ab` |
| D/`tbl-p0168-01.FIRST.render.json`, preserved FAIL | `43ccad43e71820465f73f65527c1d71230bb6e46a046676f84654874c9185655` |

## Evidence And Accounting

Evidence root E: W/`.intentfold/tickets/STEMROBIN-180/tmp/b88-n41-figure-review`.

| Reviewer Evidence | Actual SHA-256 |
|---|---|
| E/`source-inventory.md` | `199320e1a8a11f207e5583895e907d63bf7167e1ac3a1996a32f42a13357dc3a` |
| E/`inspect.py` | `ba673be595897d2d859ac8ef3a3f0c50413c66af3242fdd6cafcbdd00e7f3f38` |
| E/`inspection.json` | `74d439f46a047ec31adb1bd741b9640a64223d0088fc06ceab97d27ab63dc6f5` |
| E/`preservation.json` | `2bfdc13e857b335f854d22daee5df6d6849895e648553a6677035dfbf1d11574` |

Reviewer image loads: original fig-114 (1), original table (2), existing
fig-114 preview (3), existing table preview (4): **4/8 total**.
Crops 0, reopens 0, new screenshots 0, additional image loads 0.
PNG header-only size reads and file hashes decode no images and are not loads.
No image payload was forwarded to the parent; parent image count remains 3.

After independent PASS, `record_review.py` was invoked **exactly once per
figure**, producing the two new D/`*.review.json` files above: **2 calls,
2 successes, 0 recorder retries**. Existing native validation ran once per
figure in the inspection, then internally once per recorder call.
`inspect.py` ran once for inspection and once with `--verify-preservation`.
Render reruns 0; candidate edits 0; reviewer targeted repairs 0.

Paid calls this review 0. Cumulative paid calls remain **68**, paid retries
remain **0**. Token usage **UNKNOWN**; billing **UNKNOWN**.
Only this report, E/* and the two expressly authorized draft review JSONs
were written. No freshness/setup/backend replay, paid generation, promotion,
canonical files, DB, app, dependencies, Git, browser/product DISPLAY, answer
artifacts, supervisor/chat action or publisher was performed.

The report's final SHA-256 is returned separately after writing to avoid a
self-referential hash. **Independent FIG PASS for both exact drafts. STOP.**
