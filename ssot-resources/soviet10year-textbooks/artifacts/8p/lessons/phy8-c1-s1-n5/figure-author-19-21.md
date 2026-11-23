# FIRST modern figure AUTHOR: n5, figures 19-21

Ticket: STEMROBIN-180/180-7. Date: 2026-11-23.

Workdir for every command:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

**AUTHOR drafts only; no approval or promotion.** Current candidates are r1.
All three have passing draft/rendered FigureSpec validation and JSXGraph render
reports. Figure 19 has **local HOLD for final-r1 visual confirmation**: its sole
opened preview was r0, which exposed missing vector glyphs. The repair is
mechanically checked but its pixels were not reopened. Figures 20 and 21 have
actual r1 author preview observations, not independent PASS reviews.

## Frozen independent source inventory

Original durable PNGs were each opened once before reading the candidate prose
or authoring any spec. No prior specs, source hypotheses, crops, other source
images or old rendered outputs informed the inventory.

The full first inventory is
`.tmp/180-7-n5-figures-19-21/source-inventory-first.md`,
SHA-256 `a6da7301dca94bc316cbdef3eaaeebc5744fd3f230c2266eda5335a087c7c71e`.
It was never amended after the freeze.

- **19:** Two separate horizontal standalone arrows, a rightward above b
  leftward, with b visibly longer and both vector labels above. The lower
  construction has rightward a on the upper row, leftward b just below, aligned
  right ends, and b ending left of the a tail. A short outlined a + b arrow
  points left from the a-tail location toward the b-head location on the a
  row. Preserve all five arrows and their five vector labels; no axis, grid,
  footbracket or numerical given.
- **20:** One shared frame. a goes from the left/start vertex to the middle
  upper joint, b to the highest/right joint, c down-left to the terminal, and
  outlined f from start to terminal. Four dashed vertical drops reach one
  rightward x axis. Feet are **A-B-D-C** in left-to-right order. Above the axis,
  f_x spans A-D and c_x occupies D-C; below, a_x spans A-B and b_x spans B-C.
  Preserve all endpoint caps, center notches, four vector labels, four foot
  labels, four projection labels and x. The source prints c_x without a
  prefixed minus; c projects **C-to-D**, so its signed projection is negative.
- **21:** Two separate standalone vectors: a up-left and b up-right, each with
  a vector label. The right-hand triangle has a from bottom-right to top,
  -b from top to bottom-left, and outlined c from bottom-right to bottom-left.
  Preserve all five arrows, -b, and c = a - b; no axis, grid, footbracket,
  named triangle vertices or numerical given.

Original hashes, all current at final binding:

| Figure | Source PNG SHA-256 |
| --- | --- |
| 19 | `98370364987503ee52744d3b007389d61ab182cfd038914c14f985c4d4171bd2` |
| 20 | `f42099a98394107bb8d663471cc9cf97a7c9b444716173416f9685989eabc8fe` |
| 21 | `a4605a9d47afdab96eee5c6a2330da42f9ea7f6b818b0bd7105e5e95ac3b7842` |

### Modern additions, not source givens

The first inventory did not supply separate mathematical dot markers. Following
the human's scoped clarification, small visible, unlabelled semantic-ink
endpoint markers are explicitly **MODERN additions**, including bracket
construction vertices. They supply visible inventory coverage, not new names,
coordinates or givens. No invisible inventory points or validator changes.

Exact coordinates, identical vector-copy lengths, straightness, spacing and
bracket-notch shapes are author-selected mathematical regularization. No scan
stroke-length ratio or angle is represented as an exact source measurement.

Ordinary letter text plus JSXGraph notation arrows preserve vector-over-arrow
labels without the unsupported combining glyph. Native JSXGraph paper cores
and polygons preserve outlined vector shafts and arrowheads; these components
are not extra mathematical vectors. No hand-edited SVG paths or artwork calls.

## Authoritative candidate context

Input:
`.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c1-s1-n5/lesson.template.json`.

The full relevant paragraphs, without truncation or substitute summaries, are
embedded in each spec's `source.authoritativeText` and bound in
`.tmp/180-7-n5-figures-19-21/inventory-context-binding.json`:

- 19: prose index 15, complete collinear-addition paragraph, source references
  `p0029#11`, `p0030#1`.
- 20: prose indices 20-23, complete projection question, vector-sum statement
  and formula, both signs/projection-sum paragraphs, source references
  `p0030#6` through `p0030#9`.
- 21: prose indices 24, 25, 28, complete vector-subtraction statement, formula
  and negative-vector magnitude/direction paragraph, source references
  `p0030#10`, `p0030#11`, `p0031#3`.

Only these current `.text` values supplied geometry context. The concluding
erratum and unrelated prose were excluded. Full relevant text remained current
at final handoff binding. No source or edition text was edited.

## Executable Mathematical Evidence

The r1 specs use native `connects`, `displacement`, `equalDistance`, `parallel`,
`perpendicular`, `pointOnLine` and `collinear` assertions as applicable. Every
source-inventory point group requires `pointRelationships`. Every mapped point
has an actual mapped relationship wholly inside its own group. Every semantic
arrow, guide segment and bracket stroke has endpoint assertions. There is no
`objectCount` substitute.

Additional executed endpoint checks in
`.tmp/180-7-n5-figures-19-21/check-endpoints.mjs` prove:

- 19: exact standalone/construction vector copies, equal display-row
  translation, opposite signed directions, negative vector longer than a,
  and resultant endpoint displacement equal to a + b.
- 20: tip-to-tail a + b + c = f at actual endpoints; vertical drops to the
  correct feet; one axis; strict A-B-D-C order; signed a_x, b_x, c_x, f_x
  equal to their actual vector projections; algebraic projection sum; every
  bracket start/end, side of axis, center notch and subscript label.
- 21: exact a copy, exact negative of standalone b, c = a - b and
  c = a + (-b), separate standalone tails, source directions, negative-b
  label and complete result equation.
- All figures: visible mapped inventory points, wholly internal relationship
  coverage and deterministic vector-notation objects mapped to assertions.

Negative controls were executed in memory for every figure: a reversed
semantic arrow, changed mathematical endpoint and removed group relationship
coverage each failed the checker. No additional source pixels or previews.

Results:
`.tmp/180-7-n5-figures-19-21/inventory-endpoint-checks.json`,
SHA-256 `ba7a3f3912b7a7564d9d427b683b115da4db62aa3a83bada0bc62738191da9b8`.

## Current Draft Paths And Hashes

All paths below are relative to the explicit workdir, inside the owned batch.
Each r1 revision remains a draft and awaits the separate reviewer.

| Figure | Draft spec | SHA-256 |
| --- | --- | --- |
| 19 | `.tmp/180-7-n5-figures-19-21/specs/fig-19.r1.spec.json` | `98cf99c1596e1de14dd51c6a8347c728c6ec7378a6c67eddfcbdb59fb31dbc63` |
| 20 | `.tmp/180-7-n5-figures-19-21/specs/fig-20.r1.spec.json` | `c88c7e68bb9a62cf75a91650bbf27522c7e50898f971cba5a4d8fce55283e232` |
| 21 | `.tmp/180-7-n5-figures-19-21/specs/fig-21.r1.spec.json` | `60ae6a78f4faa3552248a543914cbad21fe4cae47fa5e50d69d6d93adc9a8751` |

| Figure | Draft SVG | SHA-256 |
| --- | --- | --- |
| 19 | `.tmp/180-7-n5-figures-19-21/render/fig-19.r1.svg` | `b0ee26b25bb3b35fb9c1f3dee8c04c0b5d071a5161c738c05039118d6ff9fe28` |
| 20 | `.tmp/180-7-n5-figures-19-21/render/fig-20.r1.svg` | `2497b6f2d177e2faa6e21fafe7bd9663ba2eba78a6159cab7d46d29eee559747` |
| 21 | `.tmp/180-7-n5-figures-19-21/render/fig-21.r1.svg` | `2bbc176f743d1bc6a9511a6373e25a176766f637205069ecc0abbd9d120e0cc3` |

The matching reports are `render/fig-{19,20,21}.r1.render.json`.
Each says `status: pass`, has no collisions, binds the current spec/SVG hashes,
and records JSXGraph 1.13.1. Existing `validate_spec.py` was run once per
affected revision/stage; all r1 draft and rendered stages have no errors.
Command arguments, explicit workdir, exit codes, stdout and stderr are retained.

Final preview paths/hashes:

- 19: `previews/fig-19.r1.png`,
  `5329138bf1f9462e5e4a918d40be146b9b2973990e2682c99ca6cb92d562fde5`;
  **not opened** after repair.
- 20: `previews/fig-20.r1.png`,
  `d5b447e64c699f0cb711a044c63df61e0bea388c551ce130f127ab78a5e67767`;
  opened once; shared projection frame, signs/order, brackets and labels
  observed.
- 21: `previews/fig-21.r1.png`,
  `74a4d58ac33f5ca982d59e8cc921de63686978120a165933fa916a2a7f2f3346`;
  opened once; standalone vectors, subtraction triangle and labels observed.

## Real First Failures And Scoped Repair

All r0 specs, SVGs, preview files, reports and command evidence remain.

- 20 r0 render failed on b and foot A/D/C label collisions.
- 21 r0 render failed on standalone a's label collision.
- 19 r0 mechanically passed, but its actual opened preview showed vector
  marks as missing-glyph boxes. This is a real **author visual failure**, not
  approval. Bound evidence:
  `inventory-first-visual-failure-19.json`.
- The single r1 repair changed only the identified label anchors and affected
  vector notation, and refined the outlined arrowhead interiors. All existing
  point coordinates and mathematical endpoint relations remained unchanged.
  Details: `inventory-scoped-repair-r1.json`.
- r1 mechanical stages passed. No unchanged-stage replay, arbitrary retry,
  hand-edited output, removed source requirement or shared validator edit.

## Display And Image Budget

Instructional inline, canvas width 640; test widths **318, 358, 480**;
maximum inline width 480. Every text object is 36px on the source canvas.
Renderer-cloned SVG display checks measured minimum text:
17.8875px at 318, 20.1375px at 358, 27px at 480.

These are declared author-test widths, **not known owning-lesson browser
measurements**. The actual owning-lesson media widths and final display
verification are later. No scroll contract or product acceptance claim.

Images actually opened: **3 source + 3 render previews = 6/6**.

1. Original fig-19 PNG.
2. Original fig-20 PNG.
3. Original fig-21 PNG.
4. fig-19 r0 preview; exposed the missing-glyph failure.
5. fig-20 r1 preview.
6. fig-21 r1 preview.

No crops, other pixels or reopens. Figure 19 final-r1 visual confirmation remains
**local HOLD**. Independent mathematical/source-fidelity/cultural review and
promotion remain outside author ownership.

## Handoff

Complete source inventories, assertions, negative controls, all current
draft/output hashes, opened-image bindings, render statuses and boundaries:
`.tmp/180-7-n5-figures-19-21/inventory-final-handoff.json`,
SHA-256 `14926a1729db7c2fa4d5086debd68a88d09aac24d0e836abb23078ee5daa1012`.

No final asset promotion, self-approval, PASS review, manifest/text/source edit,
DB access, Git operation, install/bootstrap, new agent or paid call. Writes were
limited to the owned batch scratch and this durable raw n5 author report.
