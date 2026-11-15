# STEMROBIN-184: Independent Review of fig-10

Reviewed 2026-11-15. Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Reviewer did not author this figure. Review began after completing the
separate fig-07/08/09 report.

## Verdict

**PASS: source fidelity, mathematics, and visual review of the hash-bound
scratch artifacts below.** All three source configurations, all 12 defining
points, and all 11 extended lines are present and mathematically correct.
No added point labels, count annotations, dimensions, or marked diagonal
crossing. No source-fidelity, mathematics, or visual failures found.

**Outstanding final-output gate:** render metadata names
`.tmp/s10y-image/6-8g/fig-10/fig-10.svg`, not a durable final output.
This scratch render is not yet a promotable final-output record. No
regeneration, promotion, `record_review.py`, or product-output edits occurred.
This document is an independent report, not `ld-s10y-image/review@1`.

## Source-First Inspection

First individually opened the entire durable original:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-10.png`

Then opened the actual `fig-10.preview.png` and read the complete spec,
SVG and render report under `.tmp/s10y-image/6-8g/fig-10/`.
Applied the previously read image skill and quality gate.

Independent inventory from original pixels:

- **Upper left:** one near-horizontal straight line, four distinct interior
  marked points in left-to-right order, unequal gaps, extension beyond both
  outer points. No labels.
- **Lower left:** three marked base points on one near-horizontal line and
  a fourth marked upper point, horizontally between the middle and right
  base points. Three sloping lines through that upper point and each base
  point; the base is the fourth line. Every line extends beyond its defining
  points. No point names, filled triangle, or counts.
- **Right:** four marked convex-quadrilateral vertices: lower left,
  upper left, upper right, lower right. Upper left is higher than upper right;
  the lower pair share the base line. Four sides and two diagonals, all
  extended past their defining vertices. The diagonal crossing is **not**
  a marked fifth point. No labels, counts, arrows, or dimensions.

Source has four marked points in each configuration, 12 total. The modern
figure preserves the single unframed top-left/lower-left/right arrangement.
Stroke thickness, blank spacing, and unmeasured coordinates are modern
regularization, not invented numerical givens. The original has no marked
scale or required exact ratios; upper-left unequal spacing and all
qualitative source positions remain preserved. Bottom-edge scan remnants
and stroke-end ink are not additional defining points.

## Current Edition Text

Read only exercise 37's task text and figure reference from:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c1-s4/exercises.template.json`

SHA-256:
`a1369d84a8882a6b5e0766782bd1c128aeb3b0792b532fd6c2cf49908f7bd469`.

The spec cites the **complete exact current `text` field**:

```text
37.* 如图10所示，四点可以确定$1$、$4$或$6$条直线．证明不存在其他的情况．
```

Exercise 37 references `fig-10`. Geometry was reviewed against original
facts only, not an answer key or a derived solution. No answers, choices,
model services, environment files, database, network, tests, or other
workers' review/output files were inspected or changed.

## Actual SVG Mathematics

Exactly **12 visible ellipses**, **11 visible line elements**, and **zero
SVG text elements**. All 22 renderer-created endpoint helper ellipses are
`display="none"` and `visibility:hidden`. Hidden default-colored helper
paths/ellipses do not leak into the visual output.

Defining centers in the actual 1040 x 480 SVG canvas:

| Configuration | Defining Points, Internal IDs Only | Visible / Independently Derived Unique Pair Lines |
| --- | --- | --- |
| one | a `(110,35)`, b `(210,35)`, c `(370,35)`, d `(510,35)` | 1 / 1 |
| four | a `(110,370)`, b `(310,370)`, c `(510,370)`, d `(410,150)` | 4 / 4 |
| six | a `(630,375)`, b `(690,70)`, c `(920,130)`, d `(1010,375)` | 6 / 6 |

Internal IDs above are not displayed point labels. Every actual center
matches the spec-to-canvas transform within `1e-7` canvas pixels.

All four triples in the upper-left group are collinear, not just one
checked triple. Lower-left a/b/c are collinear; all three triples involving
the upper point are noncollinear. Right-hand group's four triples have
absolute doubled canvas areas **73750, 115900, 93100, 50950 px squared**:
none is collinear. Cyclic vertex order gives a convex quadrilateral.
Unique pair-line counts were computed from actual centers and normalized
line coefficients, not assumed from metadata object counts.

Every actual finite line's endpoints were compared with the transformed
spec coordinates. For every defining point, calculated perpendicular
distance to the actual SVG line and its normalized endpoint parameter `t`.
Every distance is below `1e-7` canvas pixels; every point has `0 < t < 1`,
so the visible stroke extends past both outer defining points.

| Actual Line | First Endpoint | Second Endpoint | Defining-Point t Range |
| --- | --- | --- | --- |
| one-line | `(30,35)` | `(565,35)` | 0.149533 to 0.897196, all four points |
| four-base | `(30,370)` | `(565,370)` | 0.149533 to 0.897196, all three base points |
| four-left | `(70,399.333333)` | `(470,106)` | 0.100000 to 0.850000 |
| four-middle | `(290,414)` | `(430,106)` | 0.142857 to 0.857143 |
| four-right | `(530,414)` | `(390,106)` | 0.142857 to 0.857143 |
| six-ab | `(622,415.666667)` | `(697,34.416667)` | 0.106667 to 0.906667 |
| six-ac | `(595,404.568966)` | `(965,91.982759)` | 0.094595 to 0.878378 |
| six-ad | `(590,375)` | `(1032,375)` | 0.090498 to 0.950226 |
| six-bc | `(645,58.260870)` | `(1030,158.695652)` | 0.116883 to 0.714286 |
| six-bd | `(655,36.640625)` | `(1030,394.062500)` | 0.093333 to 0.946667 |
| six-cd | `(895,61.944444)` | `(1030,429.444444)` | 0.185185 to 0.851852 |

Actual diagonal intersection is approximately `(831.444411,204.814204)`.
No visible ellipse is at or near that crossing; it remains an ordinary
unmarked line intersection.

All **34 declared assertions** independently pass: collinearity,
displacements, and endpoint-on-defining-line assertions. Largest spec
residual is approximately `2.7e-15`. Inventory object/assertion references
resolve; every source point has within-group relationship coverage.

## Offline Browser / Scroll / Visual Evidence

Used existing `app/node_modules/playwright` with headed Chromium and device
scale factor 1. In-memory offline test HTML embedded the **complete actual
unchanged SVG**, not a reconstruction, and the entire original PNG as a
data URI. Used the existing app figure-media rules, semantic tokens, and
scroll rule: `40em` at 16 px = **640 px actual media**, despite the
1040 px source canvas.

Context offline, service workers blocked, all URL routes aborted:
**zero attempted requests and zero page errors**.

| Measured Host Width | Actual SVG Width | Actual SVG Height | Maximum / Reached scrollLeft | Right Edge Reachable |
| --- | --- | --- | --- | --- |
| 280 | 640 | 295.375 | 360 / 360 | PASS |
| 310 | 640 | 295.375 | 330 / 330 | PASS |
| 358 | 640 | 295.375 | 282 / 282 | PASS |
| 640 | 640 | 295.375 | 0 / 0 | PASS, entire canvas fits |

Exact-width checks were measured before and after screenshots. The initial
stacked comparison page's document scrollbar temporarily narrowed mobile
hosts by 15 px; reran with a stable, scrollbar-free harness and replaced
only this review's screenshots. The table records the verified exact
host widths, not their initial nominal widths.

At scroll start, the left configurations are visible; at the measured end,
the **entire right-hand configuration, including all four vertices and its
right/bottom extensions**, is visible even in the 280 px host. Intermediate
canvas content remains reachable by continuous horizontal scrolling.
No document-level horizontal overflow. Intentional viewport clipping at
scroll start is not permanent SVG clipping.

Individually opened all nine screenshots:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/`

- `fig-10-independent-{280,310,358,640}-scroll-start.png`
- `fig-10-independent-{280,310,358,640}-scroll-end.png`
- `fig-10-independent-1040-native-themes.png`

The full original remains aspect-preserved and visible, including its
right/bottom edges. Native source dimensions **1086 x 345** were also
displayed completely at desktop size. Opened the complete modern preview
and inspected the entire actual 1040 x 480 SVG, then the 640 px media.
Native width is an additional full-resolution check, not a substitute for
the fixed 640 px product-media check.

No finite painted point or line is clipped by the SVG bounds. Closest
right endpoint is x=1032; its 1.25 px half-stroke still leaves 6.75 px
inside the canvas. No spurious point/line overlaps beyond the original
intended collinearity and intersections. No figure labels exist, so the
16 px text gate is **not applicable**, consistent with render metadata's
`measuredMinPx: null`; it is not a claim of measured text.

Neutral and accent media remain semantically colored `ink` on `paper`;
print rule was additionally exercised with print media at native size.
All visible strokes/dots compute to `rgb(21,32,31)` on white, with no
visible hard-coded non-semantic color attributes or cultural material.

Browser canvas rasterization of the actual SVG is nonblank in every mode:
**7965 nonwhite pixels at 640 px**, including **962 in the rightmost 10%**
and **321 in the bottom 20%**. At 1040 px: **17868**, with **2189 right**
and **726 bottom**. Visual comparison confirms complete source structure
and no black/broken raster output. No numeric counts or solution
annotations were added to the drawing.

## SHA-256 Bindings

All paths are rooted at the absolute repository root above.

```text
source  ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-10.png
        b7673802d63aaac2195e1281a00eadbe2492529e40105fa056b924411f8c16eb
spec    .tmp/s10y-image/6-8g/fig-10/fig-10.spec.json
        c911c860f1f1f29a36622d6d81305b999a707538c8565cd9b8079e5e50e7abe4
svg     .tmp/s10y-image/6-8g/fig-10/fig-10.svg
        e39bb131032a0460f61de31a46cc0064779d458ab148a48a3c06270d8f6c3504
render  .tmp/s10y-image/6-8g/fig-10/fig-10.render.json
        59eba3afcb453a11c843d036ed8d178e13888c4e13c33609f13c27d898e39222
preview .tmp/s10y-image/6-8g/fig-10/fig-10.preview.png
        98d9a79ecef6d39a31daa5b83e078c1a67142a5a69fe0c2c2803e4468441123e
```

Source hash matches the spec. Spec and SVG hashes match render metadata;
render status is `pass`. All five artifact hashes were unchanged after
browser inspection. Any subsequent source/spec/SVG/render/preview change
invalidates this figure's report. Broader live product, manifest, and final
promotion gates were not inspected or certified.
