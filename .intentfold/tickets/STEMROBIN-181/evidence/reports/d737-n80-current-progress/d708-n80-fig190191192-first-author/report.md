# d708 n80 First Author Result

Batch status: **STOPPED: fig191/192 terminal native-render FAIL**. No promotion.
All writes are under this batch directory in the authorized 00b1 checkout.

| Figure | First Result | Sole Repair Result | Actual Image Opens |
| --- | --- | --- | --- |
| fig190 | Validation PASS; render FAIL: A/B/A1 label clearance | Validation/render PASS; actual 640 px media PASS; first author visual observation completed | 1 source + 1 native |
| fig191 | Validation FAIL: objectCount used equals instead of count | Validation PASS; render terminal FAIL: M/N label collision | 1 source + 0 native |
| fig192 | Validation FAIL: objectCount used equals instead of count | Validation PASS; render terminal FAIL: M/N label collision | 1 source + 0 native |

Each figure used exactly one repair. First specs, FAIL receipts, stdout/stderr,
and all produced SVG/render outputs remain unchanged. No second repair,
independent record_review, canonical promotion or whole-card approval occurred.
The two failed renders have retained SVG outputs, not visually approved assets.

## Source And Mapping

- `source-inventory.json`: before-author inventory of each original, labels,
  source points, line styles, source-only prompt constraints and modern additions.
- `source-inventory-metadata-correction.json`: PNG metadata-only correction of
  fig192 height to 227 px. No image reopen or geometry change.
- `source-to-spec.json`: frozen d701 lesson/exercises/requirements hashes,
  original source hashes, first spec hashes and pixel-coordinate transformations.
- `report.json`: current per-figure final spec/validation/render/output hashes,
  inventory-to-assertion mappings, first failures and stage receipts.
- `artifact-hashes.json`: absolute paths and SHA-256 hashes for all batch files.

Fig190 retains A/B, A1/B1, A2/B2, objective, eyepiece, the two source focus marks,
F1/F2 brackets, intermediate focal plane and two forward ray paths. Geometry is
an explicitly approximate paraxial schematic, not measured source distances.
The modern eye-lens plane is dashed and muted; rays and source axis remain solid.
English apparatus names are declared modern additions. Author-observed
readability and source relationship preservation are not independent approval.

Fig191/192 preserve the unsolved MN/S/S1 and MN/A/B arrangements respectively.
Uniform source-pixel scaling preserves source x order and vertical offsets;
only scan tilt of the axis is levelled. All source points are covered by mapped
displacement relationships. Neither diagram contains a solved optical center,
foci, lens plane or answer construction rays. Fig192 does not assign either
point permanently as source or image; the written exercise has both directions.
No answer key was read.

## Native Evidence

Fig190: `fig-190/repair1/render.json`,
`fig-190/repair1/media-640.receipt.json`,
`fig-190/repair1/figure.svg`, `fig-190/repair1/native-640.png`.
The actual media width was 640 px at 1440x960 and 390x844 viewports, with all
12 labels measured at a minimum 18.2852 px. Mobile media stayed 640 px in a
358 px scroller and reached its 282 px horizontal scroll end.
This is a figure-only isolated SVG-media check, not whole-card/product acceptance.

Fig191/192: `fig-191/repair1/render.json` and
`fig-192/repair1/render.json`. Each retains its failed SVG and reports 24 px
minimum text at 640 px but M/N collisions (score 50.625 each). A font-size pass
does not override a render FAIL. Dependent media/visual checks were not run.

## Accounting And Holds

Image payloads opened: **4 total**: 3 originals + 1 native fig190 screenshot.
Per figure: fig190=2, fig191=1, fig192=1. PNG outputs generated=1. Crops=0;
reopens=0. One batch, below the 8-image batch and 24-image context limits.
The planned 6 payloads were not reached because failed renders stopped.

Paid calls=0; new agents=0; external messages=0; canonical/tooling/meter/index/
Git/backend/DB modifications=0; full tests=0. Only existing native validator,
JSXGraph renderer and local Playwright media inspection were used.

d703 modern edition text remains pending; specs use frozen d701 source text.
Independent figure review, final edition-text reconciliation and all whole-card
acceptance gates remain pending. fig191/192 are terminal for this authorization.
