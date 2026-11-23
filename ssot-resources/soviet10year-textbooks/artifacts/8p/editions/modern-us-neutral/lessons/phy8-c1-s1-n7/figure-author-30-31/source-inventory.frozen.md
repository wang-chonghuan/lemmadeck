# Source pixel inventory: n7 figures 30 and 31

Author-only, STEMROBIN-180/180-7. Each actual original was opened once,
before this inventory and before constructing the candidates. No source crop,
source page, answer key, prior author output, or prior figure spec was used.
This is not independent source-fidelity approval.

## Figure 30

Source: `ssot-resources/soviet10year-textbooks/artifacts/8p/figures/fig-30.png`

SHA-256: `402f5e35de8725ba140829c183aeabdbadabd3c35c5cd1608fb2648b76a3253c`

One shared velocity/time frame, not two separate panels:

- Vertical velocity axis, positive arrow at its upper endpoint, extends below
  the origin. Horizontal time axis, positive arrow at its right endpoint,
  extends slightly left of the origin.
- Printed axis symbols `v` at the top and `t` near the right end, and digit `0`
  below-left of their intersection. No numbered ticks or physical units.
- Upper horizontal constant-velocity line starts at the velocity axis above
  zero and extends right; its printed identifier is Roman `I`.
- Lower horizontal constant-velocity line starts at the velocity axis below
  zero and extends right, with a slightly shorter rightward extent than the
  upper line; its printed identifier is Roman `II`.
- The upper line is farther above zero than the lower line is below it.
  Neither line has an arrowhead or point marker. No numerical speeds/times
  or equal-length/equal-speed claim is printed.

Executable map: `source-frame` includes `origin`, `time-left`, `time-tip`,
`velocity-bottom`, `velocity-tip`, both arrows and the three labels; each
endpoint maps to `frame-*` displacement, collinearity, perpendicularity or
connects assertion IDs. `source-positive-I` includes origin, both upper-line
endpoints, line and identifier; it maps to `positive-*` and
`I-parallel-time`. `source-negative-II` maps all corresponding lower points,
line and identifier to `negative-*` and `II-parallel-time`. Every mapped
point belongs to a wholly in-group multi-point assertion, not objectCount.

## Figure 31

Source: `ssot-resources/soviet10year-textbooks/artifacts/8p/figures/fig-31.png`

SHA-256: `7dc4cae7edc2dc990f57c565b252346419c5f2fbde1b6ba133ae6be70a3d839f`

One shared velocity/time frame, containing both hatched rectangles:

- Vertical axis has a positive upper arrow and extends below the lower
  rectangle. Horizontal axis has a positive right arrow and extends left
  of the origin and right of both rectangles.
- `v` appears near the vertical-axis arrow AND at the upper rectangle's
  left/top level. `v_1` appears at the lower rectangle's left/bottom level.
  `0` is below-left of the intersection; `t` is near the right time-axis end.
  There is no minus sign printed before the axis-level `v_1`.
- Upper rectangle: lower-left is the origin, upper-left is on the positive
  velocity axis, lower-right is on the positive time axis, upper-right is
  directly above lower-right. Upper edge is the positive-velocity line.
  Its diagonal hatching rises to the right in mathematical coordinates.
  The printed interior formula is `s = vt`.
- Lower rectangle: upper-left is the same origin, lower-left is on the
  negative velocity axis, upper-right is on the positive time axis,
  lower-right is directly below upper-right. Lower edge is the
  negative-velocity line. Its hatching falls to the right in mathematical
  coordinates, opposite to the upper hatching.
  The printed interior formula is `s_1 = |v_1|t`, including both subscript
  ones and both absolute-value bars.
- The lower right boundary is visibly left of the upper right boundary.
  Its depth is slightly greater than the upper height. Both left edges
  coincide with the velocity axis; both axis-side horizontal boundaries
  coincide with the time axis. Rectangles share an origin, not a common
  right boundary. The right time-axis `t` is a symbol, not a printed
  endpoint tick. Source prose describes separate displacement magnitudes;
  no signed negative-area formula, `v_2`, numeric dimensions, equal-duration
  geometric claim, grid or numbered ticks is supplied.
- Source hatching is locally interrupted behind each formula for legibility;
  this does not erase the rectangle boundaries.

Executable map: `source-frame` maps all frame endpoints to `frame-*`.
`source-positive-rectangle` maps origin plus the other three vertices to
`upper-width`, `upper-height`, `upper-right-height`,
`upper-top-horizontal`, `upper-right-angle`, and formula containment;
all boundary segments have `*-connects` assertions. The corresponding
`source-negative-rectangle` maps every vertex to `lower-*` assertions.
`source-distinct-extents` maps both right-axis corners and both velocity
levels to `right-boundaries-differ` and `velocity-levels-differ`.
Every hatch segment has executable endpoint and slope assertions, and
both endpoint locations lie on the rectangle boundary or the justified
formula-clearance boundary. No objectCount substitution is used.

## Modern normalization, not source data

Coordinates are normalized drawing units, never measured physical values.
Axes and rectangle edges are straightened while preserving signs, sharing,
orientation and unequal extents. Uniform 25px source-canvas math labels,
semantic ink/muted/accent roles, even hatch spacing, and small rectangular
hatch clearances around formulas replace the irregular scan strokes.
Construction vertices use 0.1px markers on existing edges, not added
instructional dots. No endpoint ticks, units, explanatory prose, legend,
signed-area reinterpretation or new quantity is added.

The read-only modern lesson/exercise templates are semantic authority.
Their input hashes at author entry:

- `lesson.template.json`: `a5986e949ace9639c7633bf2d579e4622b2a7246dc192d031cef7bb0dc1283f8`
- `exercises.template.json`: `a108f745dddf0051e04839b409b3f4697c599a0faa522ddfbdb3197c755c7e20`

The parent reported independent source n7 PASS after the p41 missing-text
repair. This author does not independently repeat or claim that review.
