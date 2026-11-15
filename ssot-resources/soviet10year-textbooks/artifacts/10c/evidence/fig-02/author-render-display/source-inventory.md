# 10c Fig-02 Source Inventory (Frozen Before FigureSpec)

Role: figure author, not independent reviewer. The full original PNG was
actually opened before this inventory or any FigureSpec was authored.

Source: `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-02.png`

SHA-256: `1bf66c3d6aa81cc25d8ea816ce1b538a1e988057d13e3ccaed0415dc3927b8e6`

Dimensions: 633 x 329 pixels.

Existing context: `.tmp/s10y-image/10c-fig02/context.json`

SHA-256: `2cc138d82f7e9868fdb034ff44f48b7bbd2f69649ae830436890d43cdaa5a5bc`

## Actual Pixels

- One shared Cartesian frame, not separate panels. The horizontal axis has
  an arrow at its positive/right end; the vertical axis has an arrow at its
  positive/upper end. They intersect at the origin.
- Exactly three printed labels: `x`, `y`, `0`. The zero is below/right of
  the origin. There are no other numerical axis values or ticks.
- One solid, smooth sine-shaped curve: its left end is below the x-axis,
  descending to one negative trough; it rises through the origin, reaches
  one positive crest, and descends at the right end, still above the x-axis.
- Exactly two solid tangent strokes: a rising diagonal through the origin,
  continuing into quadrants III and I, and a horizontal stroke through the
  positive crest. The horizontal stroke starts a little right of the y-axis
  and extends beyond the crest.
- The diagonal and horizontal tangent strokes meet to the left of the crest.
- There is no third tangent or visible point at `(pi,0)`. There are no named
  contact points, deliberate point dots, guides, dashed lines, grid, shading,
  curve-equation labels or tangent-equation labels. Thick ink at intersections
  is not an explicit point marker.
- No curve endpoints or tangent stroke endpoints are numerically given.
  Raster locations must not be turned into supplied coordinates.

## Full Modern Context Read

Read the complete current
`artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s1-n76/lesson.json`,
including all 14 nonempty paragraph blocks. It remains a draft pending figure
approval. The existing context contains no exercise reference to this figure.

The example discusses sine tangents at `0`, `pi/2`, and `pi`. Only the first
two cases explicitly reference Fig. 2. They identify the origin tangent as
`y=x` (the quadrant I/III bisector) and the crest tangent as `y=1`. The third
case gives `y=pi-x` in prose but is absent from the source image. It must not
be added to Fig. 2 merely because it occurs in nearby text.

## Planned Source-to-Object Mapping

- Shared axes and positive arrows: `x-axis`, `y-axis`;
  `axes-perpendicular`, `origin-on-x-axis`, `origin-on-y-axis`,
  `axis-arrow-count`.
- Printed labels: `x-label`, `y-label`, `origin-label`; `label-count`.
- One sine curve and its contact/trough/crest structure: `sine-curve`;
  `curve-count`. Its analytic shape and slopes will be checked in separate
  author math evidence because the existing native assertion vocabulary
  has no sine or tangency assertion.
- Exactly two source tangent strokes: `origin-tangent`, `crest-tangent`;
  `tangent-stroke-count`, `origin-on-origin-tangent`,
  `crest-on-crest-tangent`, `crest-tangent-parallel-x`,
  `origin-tangent-unit-slope`, `tangent-intersection-on-diagonal`,
  `tangent-intersection-on-horizontal`.

No `pointRelationships` inventory group is claimed: there are no explicit
visible source point objects. Unnamed, invisible construction points may
support exact incidence assertions without introducing source point markers.

## Modern Layout Choices, Not Source Givens

The author will use equal x/y screen scales, a mathematically derived sine
path, uncluttered solid strokes, and readable English/math labels. Curve
limits, stroke endpoints, canvas margins, stroke weights and label offsets
are modern composition choices. They are not numerical data read from the
scan. No new ticks, contact dots, equation labels, third tangent or exercise
answer annotation is planned. The source inventory remains unchanged if
these layout choices require the one allowed local repair.
