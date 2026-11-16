# fig-32 deterministic author notes

STEMROBIN-184; 2026-11-16. Parent-agent delegation under existing human
ticket authority. Sole assigned output is this scratch fig32 package.
Not independent review, manifest update, promotion or choice authorship.

## Source/context before spec

Read the supplied official `context.json` and the retained own
`source-inventory.md`, then independently reopened the actual durable original
PNG at original resolution before drafting the FigureSpec.
The source is one tilted elliptical projection of a circular instrument dial,
with visible front thickness, two tubular spirit levels on the rear portions
of two crossing diameter direction strokes, M/M1/N/N1 rim-position labels
without dot markers, and the object wording 度盘. Solid rear versus broken
front guides remain instructional structure. No 90-degree mark or reading
exists. No answer/choice, other spec/review or parent source solution was read.

Current source PNG SHA-256:
`3a4dacdc9c1b902b5f45349631041cffdab19ac68a6027e3a423f0e4279ff1df`.
Official context SHA-256:
`619540382b36fe42c5aefd356a8af4080221f4e308b61edade03ed674f3b1330`.
Retained own inventory SHA-256:
`b77c2ae904668268e1953964c0ac20d33e757f4af435dd135906279d2be9a8e7`.

The spec's authoritativeText is the exact COMPLETE exercise84 text from
that official context, including both written subparts. The context has no
prose entries; none were invented. English "Dial" translates the source
object label without adding a measurement, answer or scale.

## Construction and unmeasured simplifications

Use existing JSXGraph segment/point/text primitives and deterministic
svgPath contours, not a new engine or image model.
Screen projection of a unit circular plate is
`(u,v) -> (320+260u, 210-10u+100v)`.
The rim's opposite pairs use source-position directions
`M=(-0.8,-0.6)`, `M1=(0.8,0.6)`,
`N=(0.8,-0.6)`, `N1=(-0.8,0.6)`.
These are unmeasured illustration coordinates, not given angles or lengths.
The two circular-plane directions are distinct and are NOT orthogonal.

Both diameter pairs have one exact common midpoint; centralSymmetry and
collinear assertions cover all four labelled point anchors inside the
same pointRelationships group. Anchor markers are hidden but labels visible.
No named or marked centre is added. Rear/front segments extend slightly
past the rim with anonymous endpoints, not extra source points.

Clean cubic contours approximate the projected ellipse. The front band
adds modest unmeasured thickness; its light semantic-role fill is casing,
not solution/locus shading. Both housings are separate rounded tubes on the
rear diameter portions, with near-end cap contours and simple viewing slots.
Their alignment is asserted; slot shapes do not depict a calibrated state
or bubble reading. The total path count does not independently prove two
tubes: the two specific mapped housing objects preserve that source count
for the parent's independent visual review.

Dash spacing and precise contour dimensions are modern cleanup, not recovered
source measurements. No grid, ticks, values, angle square, 90 label, extra
level, endpoint dots or answer annotation is added.

## Intended display and bounded execution

Native canvas: 640x400. Intended inline maximum:346px.
Declared actual/intended widths:240,280,310,343,346px; all labels46 native px,
nominally17.25px even at240px. The native640 screenshot is also required.
Author must inspect native output,240px neutral and346px print screenshots.
This is output checking, not self-issued independent approval.

Existing renderer launcher was read before execution: isolated
`chromium.launch({executablePath:..., headless:true})`, fresh page, task-owned
browser closed in finally. Use `env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never`.
No user profile/CDP, desktop/window/tab activation or system input.

At most one actual first render and one smallest targeted layout repair are
authorized. Preserve any first failed spec/SVG/report/PNG bytes before that
repair; a second failing result stops. No blocked fig21 retry or other
figure directory edit is authorized.

## First result and sole targeted layout repair

First explicit draft validation: exit0, status pass, errors[].
First actual JSXGraph renderer: exit2, status fail,17 objects/five labels.
All five display widths pass the16px checks; failures are only label-stroke
clearance, each score10000:

- M1 and N1 padded text boxes intersect the visible front-thickness band.
- Dial's padded text box intersects the rear/top ellipse boundary.

The actual native640 preview was opened. Preserve complete first bytes under
`rejected-first-layout/` before any edit:

| Initial artifact | SHA-256 |
| --- | --- |
| spec | `1b11b4bdbda8918e640e8d5cd070257e1482a64666293029e77a8b8f360f0d5c` |
| SVG | `99539676246179caf3d62778e5b741b7e934ec753cee40321ca624bb2bf3155a` |
| render report | `7708549bb0068c480a39cb9c2d7147e159fcdd949fcc2c709199d0fd6b4b2493` |
| native PNG | `d81c561c232b85508ff74466ccb3ea523059129b7cd955e647d600b039f9376d` |

A targeted read of the existing SVG in an isolated headless browser confirmed
those exact stroke intersections. An initial root-level module resolution
attempt failed before file copying/browser launch; the diagnostic then used
the skill's existing installed playwright-core. No install/tool change and
no extra renderer invocation occurred.

Sole repair: M1 south gap55->86, N1 south gap55->80,
Dial placement offset[0,16] in screen pixels. All mathematical anchors,
plate/tube/guide geometry, source/context text, objects other than these
three labelPlacement fields, inventory and assertions remain identical.
Do not lower fonts, suppress failed report fields or hand-edit SVG.

## Final author result and handoff

Second/final actual renderer: exit0, PASS,17 objects/five labels,
collisions[]. Its built-in draft validator passed before rendering.
Exactly two actual renderer invocations were made, with exactly one
targeted label-only repair. No further correction or renderer retry.

Read-only structured comparison restored only those three labelPlacement
fields in memory and recovered complete equality with the first spec.
All protected geometry, source, inventory, display settings and assertions
are unchanged. Full authoritativeText equals the complete exercise projection
from the CURRENT supplied context; its source PNG identity matches.

| Intended inline width | Actual renderer minimum label px | Result |
| --- | --- | --- |
| 240 | 17.25 | PASS |
| 280 | 20.125 | PASS |
| 310 | 22.28125 | PASS |
| 343 | 24.653125 | PASS |
| 346 | 24.86875 | PASS |

Opened each actual final PNG individually: native640x400,240px neutral,
346px print. In each, two rear tubular levels, crossing diameter strokes,
four endpoint labels, English Dial label and solid front thickness remain
visible; no marker dots, readings or angle marks appear. Labels no longer
touch the rim or thickness band. These are author output observations,
NOT the parent's independent semantic/visual approval.

The two width-specific PNGs are screenshots of the SAME current SVG, not
renderer regenerations. They were captured using the skill's existing
playwright-core in isolated headless browsers, SVG at actual inline media
widths with maxWidth346px, print media for346 and neutral roles for240.
Measured media/document widths:240/240 and346/346, no horizontal overflow,
all five label boxes inside the SVG. Minimum actual CTM font sizes:
17.25px and24.86875px. Native labels are46px.
These scratch SVG-media checks are not a full lesson/app display acceptance;
parent owns that downstream gate.

Every task-owned page/browser was closed in finally. No user desktop,
profile/CDP, window/tab activation, system input, network/model/API,
answer/choice, source/tool, manifest, DB or other figure was touched.
No independent review file or approval was written.

Package directory:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-32/`.

| Current artifact | SHA-256 |
| --- | --- |
| `fig-32.spec.json` | `67998d09bd828417a42ff6f6dbca738c2a9963b8700d28116579de5a5351b75a` |
| `fig-32.svg` | `1bfc153bab0b540bb4d97edfdee4742847b0e225d277e06edfd303fada72941c` |
| `fig-32.render.json` | `383fb006ec7d656b26849d97ffe1dce82cc5fac7c008d5343a2de1d31c4e8091` |
| `fig-32.preview.png` | `a1ed63b694a19e84bfe69f83176993ff9c69349e028da01fe8deb55e75b6e742` |
| `fig-32.240.neutral.png` | `4b7898c1c7a5ae81166ce34bea63aa3145f174bae64bd23ba17538290e0cb190` |
| `fig-32.346.print.png` | `5b5c6fc748f7f47c186118c0cfcf2422ea7bc8d1e732b0336e2ab0eb64d20046` |

Existing inventory/context hashes at the start of these notes remain
unchanged. `rejected-first-layout/` retains the first FAIL full spec/SVG/
report/PNG and pre-repair author notes. Do not confuse those bytes with
the current PASS package.

Author scratch package ready for the parent's unique independent full
source/spec/visual gate. Not promoted, not independently approved, and not
permission to begin choices. Stop after handoff.
