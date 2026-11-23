# N33 fig209/210 independent source-first inventory

Date: 2026-11-23. Sole working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Scope: fig-209 and fig-210 only; source211/212 excluded.

This record was written after reading the image SKILL, quality gate and
production-resume SOP, the current approved lesson/exercise text, and exactly
the two original PNGs. No author FigureSpec, render report, SVG, screenshot,
author report or other review was read before this record was sealed. These
observations are independently derived from source pixels and approved text.
This is not a formal review@1, publication approval or full-lesson review.

## Inputs and load ledger at source-first seal

Paths below are relative to the sole working directory.

| Input | SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s1-n33/lesson.template.json` | `b26d414ab2e289d960d2d726353113dda0885dcf793d5bb2cb7bc407693a991f` |
| `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s1-n33/exercises.template.json` | `54fdb88f7a17e29bc871142690624bf46710c4968c28fed43f1d18c61f16e5f2` |
| `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-209.png` | `1f60c3d2fe06e463fbfcb225a115e3db4bf65557fe863a06ef8fcd5d2b5a5d3f` |
| `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-210.png` | `fc88111eaa54c7c6b72d09f38958b385b366fe3bbd866b921e7bcb16b92ccd67` |

Load 1: original fig-209.png, complete image, one opening.
Load 2: original fig-210.png, complete image, one opening.
Actual batch/context image loads so far: 2. Limit: 8 batch / 24 context.
No crops, reopens, rasterized SVGs, page images or image payloads sent elsewhere.

## Approved text and constraints

The lesson's `prose[0].text` states E: if line a is perpendicular to c, and b
intersects c but is not perpendicular to c, then a and b intersect (fig209).
Exact applicable sentence:

> 例如，作为这样的论断 $E$ 可以采用下述命题：垂直线与斜线相交，或者更精确地说，如果直线 $a$ 与 $c$ 垂直，而直线 $b$ 与 $c$ 相交，但不与直线 $c$ 垂直，那么直线 $a$ 和 $b$ 相交（图 209）．

The lesson's `prose[5].text` attributes the parallel postulate to Euclid.
Its condition is a STRICT sum of SAME-SIDE INTERIOR angles less than two right
angles, not equality of angles, not a non-strict inequality, and not a claim
inferred from the endpoints of drawn finite strokes. The two lines, infinitely
extended, meet on the very side of the transversal where that strict condition
holds. Exact applicable sentence:

> 欧几里得本人采用如下命题作为平行公理：“如果一条直线与另外两条直线相交，在一侧构成的两个同侧内角的和小于两直角，那么，当这两条直线无限延长时，就在同侧内角和小于两直角的那一侧相交”（图 210）．

Read exercise prompts 441-445, no answers or choice keys. None has a figure_ref.
Exercise 441 restates the fig209 condition as proposition B in its own
equivalence task; that local naming does not rename the lesson's E.
Exercise 444's corresponding-angle congruence condition is a different task;
it must NOT become an equality annotation on fig210.
Other lesson prose was read as text context only; no fig211/212 pixels or
candidate files were examined, and no verdict on those figures is made.

## Independent fig209 inventory

One unpartitioned diagram, not multiple subfigures; three line traces.

- `s209-a`: nearly vertical trace at the left, named by an a-shaped lowercase
  label to its upper right. Runs above and below the horizontal crossing, and
  through the low a/b meeting position; a thin/broken continuation is visible
  below that meeting toward the lower image edge.
- `s209-c`: nearly horizontal trace across the upper-middle image, named by a
  c-shaped lowercase label near its right end, below the stroke. Crosses a at
  the left and b farther right. Both crossings are unlabelled.
- `s209-b`: oblique rising-right trace from the bottom-left region through the
  low a/b meeting, then through c, toward the upper-right region. A b-shaped
  lowercase label lies to its upper-right. There is visible whitening/breaking
  near the b/c crossing in the scan; it is not a new named point.
- `s209-M`: uppercase M-shaped name just right of the LOW a/b meeting.
  The scan has a small dark meeting artifact but does not require a new filled
  point marker. M is not at a/c or b/c and must remain incident with BOTH a,b.
- `s209-right-angle`: one square corner at a/c, in its upper-left sector.
  This explicitly marks a perpendicular to c. No square is present at b/c
  or at M; b/c is visibly oblique and the text says not perpendicular.
- `s209-incidence`: a/c unlabelled crossing; b/c unlabelled crossing; a/b
  named M crossing. Each trace continues on both sides of its crossings.
  In the visible ordering, a meets c above M, and b meets c above/right of M.
- `s209-absences`: no numbers, units, coordinates, axis/ticks, equal-angle
  arcs, arrowheads, segment-length marks, additional points, N or subpanels.

Independent required relationships:
`r209-ac-perpendicular`, `r209-bc-intersect`,
`r209-bc-not-perpendicular`, `r209-M-on-a-and-b`,
`r209-crossing-order`, `r209-unlabelled-ac-bc`, and
`r209-lines-not-coordinate-axes`.
These implement the stated condition and conclusion without adding values.

Exact original glyph codepoints/script of a/b/c/M: UNKNOWN from raster pixels.
Apparent scan breaks/thinning do not establish a formal dashed-line role:
UNKNOWN. A clean solid rendering of the three stated lines is permissible;
do not invent hidden-line, axis, auxiliary-line or endpoint semantics.

## Independent fig210 inventory

One unpartitioned diagram, not multiple subfigures; three line traces.

- `s210-b`: near-vertical solid transversal left of center, named b-shaped
  lowercase label above/right. It intersects the other two traces at two
  DISTINCT unlabelled positions and continues above and below both.
- `s210-a2`: upper trace runs almost horizontally, with slight downward-right
  tilt. Label a with subscript 2 lies left/below its solid left portion.
  The left/central portion is solid; the rightward continuation is visibly
  dashed, through the N meeting and onward past it toward the right margin.
- `s210-a1`: lower-left to upper-right rising oblique trace, label a with
  subscript 1 above its left portion. It crosses b below the a2/b crossing.
  Its left/central portion is solid and rightward portion dashed; the dashed
  continuation meets a2 at N and runs beyond N to the upper right.
- `s210-alpha`: alpha-shaped glyph just right/below the upper b/a2 crossing.
  One visible arc occupies the INTERIOR sector to the RIGHT of b, between the
  downward ray of b and the rightward ray of a2.
- `s210-beta`: beta-shaped glyph just right/above the lower b/a1 crossing.
  Two close curved arc traces occupy the INTERIOR sector to the RIGHT of b,
  between the upward ray of b and the rightward/upward ray of a1. This differs
  from the single upper arc; it is not an equal-angle marking.
- `s210-N`: uppercase N-shaped name above the rightward meeting of a1/a2,
  on their dashed portions. It names the meeting of these two lines, not
  either transversal crossing; no additional dot is required.
- `s210-incidence-and-side`: b meets a2 above its a1 meeting; both marked
  angles are between those crossings and on the SAME, RIGHT side of b.
  Both a1/a2 rightward continuations meet at N on that right side. The finite
  raster stroke endpoints are not mathematical line endpoints.
- `s210-absences`: no M, numeric angles, degree signs, units, coordinate
  frame, arrowheads, right-angle square, angle-equality sign, third angle,
  segment-length marks or separate subpanels.

Independent required relationships:
`r210-two-distinct-transversal-crossings`,
`r210-alpha-upper-right-interior`, `r210-beta-lower-right-interior`,
`r210-strict-interior-sum-less-than-two-right-angles`,
`r210-N-on-a1-and-a2-right-of-b`, `r210-rightward-continuations`,
`r210-solid-dashed-distinction`, `r210-different-arc-counts`, and
`r210-no-equality-or-finite-endpoint-inference`.
Modern alpha/beta labels may be typographically clear mathematical symbols;
do not invent a numerical angle or extra equation in the figure.

Exact source glyph codepoints/script of a1/a2/b/N and angle glyphs: UNKNOWN
from raster pixels. The lower/upper labels are described by visual forms,
not asserted source encoding. The visible solid/dashed pattern is a fact;
its formal authored dash role beyond the textual extension context remains
UNKNOWN. It must not be recast as hidden geometry, angle equality or a
human approval gate. The approved text, not dash decoding or drawn finite
endpoints, supplies the strict condition and infinite extension side.

## Sealing protocol

Immediately after creation, this record is set to actual mode 0444 and its
SHA-256 and mode are read back before accessing any author candidate.
The resulting seal hash is recorded in REPORT.md and report.json.
This source-first record will not be edited after sealing.
