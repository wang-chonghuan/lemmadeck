# Source FIRST - independent7

Date: 2026-11-22. Scope: STEMROBIN-188, N30, fig-192 and fig-193 only.
Reviewer: fresh NONFORK independent image context; no prior image-bearing
history was supplied. This is the sole currently assigned independent reviewer.
The author candidate inventory, geometry, assertions, SVG, render metadata,
retention mappings and screenshots have NOT been read at this checkpoint.
Only the required workflow rules, source.image locator/hash and the complete
source.authoritativeText arrays were read before the two original PNGs.

Root: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188

## Provenance and sequence

1. Extract source.image and source.authoritativeText only from the two bound
   candidate specs named by the caller.
2. Verify the original PNG hashes in this root.
3. Load fig-192.png once, then fig-193.png once, at their supplied resolutions.
4. Record this FIRST and the accompanying independent inventory before opening
   any candidate design or final display evidence.

Source fig-192:
ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-source139140/author-first04/files/source6g139140-author-first-04/work/6-8g/pages/0140/figures/fig-192.png
SHA256: 97fc027acde28dc8881978929b56d4d2172c9188d9a7176d6f3cd05374fb04c0

Source fig-193:
ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-source139140/author-first04/files/source6g139140-author-first-04/work/6-8g/pages/0140/figures/fig-193.png
SHA256: dea79f1adee3090d1e155539bd9d77b6b446a02dc205c46fad6e5e8852e063b2

Current edition text carrier:
ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n30/four-figure-metadata-rebindings18/files/n30-fig192193-bound-candidates-18/fig-192/fig-192.spec.json
and the corresponding fig-193/fig-193.spec.json.
The extracted fig-192 authoritativeText array has SHA256
2f71c5a9b42f50d4e4478f6385af166e9b707d71ff66ac3ceff4cbe0fe4f4da0
(UTF-8 jq -c array plus LF). Text equality will be checked after FIRST.

## Independent pixel inventory

### fig-192, left subfigure (a)

One unfilled circular outline. O is an interior center point below A. A is
inside the circle, visibly above O. Segment OA is drawn. A horizontal secant
passes through A and extends outside the circle on both sides. A second,
descending-right oblique secant passes through A and extends beyond the circle.
M is a marked point on that oblique line, to the right and below A, above and
right of O. OM is drawn and meets the oblique line at M. Labels O, A and M
are visible. The subfigure label reads a). No numeric radius or coordinate
value, axis, scale, grid, or finite lattice is present.

OA and OM are distinct segments, not a substituted common radial line. The
oblique line and OM look perpendicular, but there is no unambiguous printed
right-angle square at M. No equality tick pair is clearly present here.
The circle's lower-right arc / oblique-line crossing has worn or missing ink;
that damage cannot establish a deliberate dashed circumference or a new point.

### fig-192, right subfigure (b)

One circular outline. O is marked at its center below the top of the circle.
The top circle point is marked, with a worn A-like glyph above it. A horizontal
line p meets the circle at this top point and extends on both sides. Segment
from O to that point is drawn vertically. A small right-angle mark is visible
where the vertical radius meets the horizontal line. O and p are readable.
The bottom subfigure mark is Cyrillic b-equivalent, not English b. No numeric
radius, coordinate values, axes, scale or grid are present.

### fig-193, upper-left subfigure (a)

One circle centered at marked O, with external A to the right. M is on the
upper-right circle boundary and the ray from O through M continues to external
B. O, M, B are collinear in that order. A is connected to O, M and B. AM meets
the circle at M; visually it is tangent. OM and MB each carry a single tick,
and OA and AB each carry double ticks. Labels O, M, B, A and a) are visible.
No numeric radius is printed, no grid is present, and no clearly printed
right-angle square is visible at M. The circle is not concentric with any
second circle in this analysis subfigure.

### fig-193, right subfigure (b)

A small circle and a larger concentric circle share marked center O. A is
external to both, on the right. An additional large curved construction locus
passes through O and crosses the larger O-circle at marked B1 above-right and
B2 below-right. This third locus is only a visible left arc, not a full
on-canvas circle; its center is not separately marked by a center symbol.
Lines from O through B1 and B2 intersect the inner circle at M1 and M2,
respectively. A is joined to M1 and M2, with the joining strokes continuing
through the outer-circle region to A. M1 and M2 lie between O and B1/B2.
All O, A, B1, B2, M1, M2 labels are visible, and the subfigure mark is the
Cyrillic b-equivalent. There are no printed numeric radii, coordinate values,
equal-length ticks, or unambiguous right-angle boxes in this subfigure.
The construction arc has tails beyond B1/B2; these are not separate objects.

### fig-193, lower-left subfigure (c)

One circle centered at marked O, external A to the right, horizontal OA drawn.
Upper and lower oblique lines from A touch the circle at marked M1 and M2 and
continue past those points to the left. AM1 and AM2 each carry one equality
tick. Labels O, A, M1 and M2 are visible. The subfigure mark is a Cyrillic
c-equivalent. No radii OM1/OM2, numeric values, coordinates, grids or axes
are visibly supplied. The pair of tangents is arranged on opposite sides
of OA, approximately as reflections.

## Current text, independently separated from pixel facts

The task is the worked construction of tangents through a given point to
(O,r). It explicitly gives three cases: |OA| < r, = r and > r.
For the interior case it states every line through A cuts the circle and
there is no tangent. For the on-circle case it identifies A and prescribes
the unique p perpendicular to OA.

For the exterior case it supposes AM tangent, extends OM by MB = r, states
OM perpendicular to AM, OM = BM, O/B reflected across AM, and OA = AB.
It places B on both (O,2r) and (A,|OA|), with M the midpoint of OB.
The construction uses B1/B2 as the two circle intersections, M1/M2 on the
corresponding rays and inner circle, and AM1/AM2 as the two tangents.
Finally the text states AM1 = AM2 by reflection about OA.

Thus straightening approximate geometry, restoring worn circular ink,
regularizing the worn A glyph, and expressing true perpendicularity with
clear geometric marks can be supported by the supplied current text. These
are text-supported clarifications, NOT recovered pixels. Numeric coordinates
or a particular length/angle not given by the text must not become new givens.

## UNKNOWN retained

- The left fig-192 circumference/line crossing is worn. Its exact lost ink
  cannot be reconstructed as a source fact.
- The right fig-192 top glyph is A-like but damaged. Identification as A
  has explicit current-text authority, not certainty from the glyph alone.
- Neither supplied figure crop exposes a readable figure-number caption.
  Any historical caption/figure-number glyph ambiguity remains UNKNOWN.
  The locator and current edition text identify fig-192/fig-193; they do not
  make an absent or ambiguous source caption readable.
- Exact source radii/angles/coordinates and the complete off-canvas extent
  of the construction circle in fig-193(b) are not measured givens.
- No answer key or whole-page image was consulted.

## Image accounting at FIRST

One batch. Loaded 2 images of maximum 8; cumulative 2 of maximum 24.
Source loads: 2. Candidate/screenshot loads: 0. Crops: 0. Reopens: 0.
Image-load failures: 0. No renders, generation, paid calls or content repairs.
The preliminary output-directory existence check returned ENOENT because this
new owned evidence directory did not yet exist; this is not an image/content
failure. This FIRST will be made read-only before candidate inspection.

Historical facts supplied by the caller remain historical and unresolved:
Carver interrupted at 6/8 and 6/24 with no final report/review; do not treat
that work as PASS or resume the old agent. Original-author usage of 8 images,
6 content failures and 3 revisions is preserved, not reset by this fresh batch.
