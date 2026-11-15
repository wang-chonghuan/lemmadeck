# fig-75 Independent Review

Date: 2026-11-15. Ticket: STEMROBIN-180. Verdict: **PASS** for the current deterministic candidate. No affected repair unit.

## Independent Source Inventory

Opened the actual complete `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-75.png` before comparing the spec.

- Two side-by-side magnified contact views; each has a double circular lens rim, a handle slanting down-right and upper/lower material outlines protruding to the left.
- Left source panel a has irregular touching boundaries between the upper and lower solids.
- Right source panel b has a thicker, visibly intervening irregular band. The supplied lesson identifies that band as lubricant separating the solid surfaces.
- Source panel letters appear beneath the magnifiers. There are no numerical dimensions, magnification factors, force arrows, ticks, specified peak counts, material coefficients or exact film thickness.

The final candidate retains both double rims, handles, outside material outlines and distinct contact/lubrication views. Latin a/b move above the magnifiers without changing the panel correspondence. Source requirements map to `a-magnifier`, `a-rough-interface`, `b-magnifier`, `b-rough-interface`; their mapped objects are visible in the full and mobile outputs.

## Frozen Text and Relationship Review

Reopened complete current s24 lesson/exercise templates, all nine p blocks and seven exercises. Actual bytes and exact context-input copies match:

| Input | SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s24/lesson.template.json` | `abe61637a90bef1a81fce591e1cc606a1300dcb4b4aff5bc78a40b9061ebc0b3` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s24/exercises.template.json` | `42c92e76eb60f3bd427ef20ce77dbcee417925e476e2fac161edbcca73292c67` |

The entire16-unit `source.authoritativeText` equals the frozen actual p/exercise text. The figure represents the existing lesson distinction: rough contact in75(a), lubricant separation in75(b), not zero friction or a calculated reduction.

Inspected all47 spec objects and14 relationship assertions. Every corresponding upper/lower pair in a uses identical coordinates and a `displacement` of(0,0). Both actual solid polygons use those profile references; the shared visible boundary is not a disconnected illustrative overlay. In b, each corresponding pair has separation(0,-30); the solid and lubricant polygons use the same boundary references. The straight segments between paired points preserve positive separation continuously, not only at isolated vertices.

Seven sampled positions, regularized zigzags, equal lens sizes and30 drawing-unit film separation are explicit schematic choices, not source peak counts, micrometers, a magnification value or data to measure from this picture. The source is an unscaled qualitative enlargement, so no instructional numerical grid or coordinate given has been discarded.

## Actual Output and Visual Evidence

Read the complete spec, actual SVG/XML, render, preview metadata, author report and handoff. Actually viewed the complete source PNG and all six existing `preview-{neutral,accent,print}-{306,640}.png` at native dimensions in `independent-preview-sheet.png`.

The sheet composes existing PNG bitmaps only and does not regenerate the figure. Sheet SHA-256: `e436e3d8686d61d9583dc8449490655f7e6ce4e7df1ec29b73c4b30d48178e81`.

**Visual PASS evidence:** a visibly has one shared rough contact boundary, b visibly has two distinct rough boundaries enclosing a continuous film. This remains clear at306 px, including print where shape/line separation does not rely on pink color. Both double rims, both full handles, left-side material outlines and b's rightmost geometry are visible. Labels a/b are legible, map correctly to the frozen references and do not collide with the rings. No clipping at the bottom handles or far-right rim, no black/blank raster, and no missing subfigure was observed.

Actual PNG sizes are306x220 and640x460, not merely viewport declarations. Bound existing headless DOM evidence reports17.2125 px minimum text at306 and36 px at640, all labels inside, no overflow and zero nonwhite edge pixels. The full screenshots support those observations. SVG colors use semantic variables; neutral, accent and print preserve the intended distinction.

Only Latin a/b are visible text. No Chinese/Cyrillic or cultural symbol appears. No force reading, reduction factor, answer inequality or zero-friction assertion is added. The depiction of lubricant is source teaching content, not an invented exercise solution.

## Bound Candidate

All current byte hashes match final handoff, render and preview records:

| Record | SHA-256 |
| --- | --- |
| Source PNG | `f03c5fec12fc2164b49af27e9a2bbcc6db6d7e5b986f8359829dcab72574ff58` |
| `spec.json` | `4e2df447fbe2981a3dabf26c58bc634233cb68adc919b3f1dc772d11f565500a` |
| `fig-75.render.json` | `6546cf5b09700d36907ebf4f773f63f69d858ad8eb62ea9a16f2fd371ffb87a9` |
| `fig-75.svg` | `9e5c8ac1bf7eb81bd327291c21b255bc060419cdd577330ee5e7832dbba179b0` |
| `author-preview.json` | `1631fa89379bfe90182ca61c2a8bac5879a8978d3bef1fe7bcd520d2644965c5` |

There is no artwork/generation output; mode is deterministic. The single image-like composition of the lesson does not conceal a missing source subfigure. Handoff records no first failure and0/1 repairs used; no repair is requested.

## Closure and Boundary

`review.json` is recorded with `record_review.py --spec spec.json --render fig-75.render.json --status pass`, binding actual source/spec/render/SVG and naming this report. A render PASS alone did not establish the source relationships.

No answers/keys/choices, source pages, corpus history or other images were read. No spec/SVG/text/output was changed or promoted. No author render or standalone mechanical validator was rerun. No new browser/app/window, Azure/model, DB, Git, dependency or service action was performed. Existing isolated-headless evidence was reused after independent actual-image inspection. Only the required record command performs its internal current-contract/hash check.
