# N43 source-first figure inventory

Scope: preview authorship only for fig-g10-03, fig-g10-04, fig-g10-05.
Source PNGs were actually opened once each, in that order, before this inventory
or any FigureSpec was written. No source SVG, answer key, old exercise, other
author's drawing, or independent review was used to infer the figures.

## Shared source facts

Each image contains one shared spatial frame, not multiple panels. Its unlabelled
common tail has no separately printed point marker or O label. The four/five ray
tips are arrowheads, not labelled dots. The letters name vectors, with overhead
vector strokes. The i direction runs down-left, j runs right, and k runs up.
These are projections of the spatial basis, not a planar orthonormal diagram.
There are no axis names x/y/z, coordinates, ticks, grid, numerical givens,
dimension lines, right-angle squares, dashed/hidden edges, or construction dots.
All rays and angle traces are solid. Raster roughness and book-paper artefacts
are not mathematical objects.

The modern point objects are invisible marker anchors with visible vector
labels, not new dots. The unlabelled common tail is the literal [0,0].
Every ray gets a connects assertion. Each labelled anchor also participates in
a mapped, intra-group displacement assertion, whose values describe ONLY the
chosen screen projection. This does not assert spatial length or angle.

## fig-g10-03

Use: teaching prose, Problem 1, the length of a=(x,y,z).
Source: ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-03.png
SHA-256: 86b778026de5ca4cb4d66708a9d5ac4882202028ddce77ef88781a8908afb99c

- One unlabelled junction near the lower-left interior.
- Four solid outward arrows share that junction: i down-left, j right,
  k up, a upper-right between j and k in the screen projection.
- Four vector labels: i near the lower-left tip, j below its right-hand tip,
  k left of its upper tip, a right/below its upper-right tip.
- No angle arcs or angle names. No b vector.

Mapping: s03-shared-frame contains i-tip/j-tip/k-tip/a-tip and
i-vector/j-vector/k-vector/a-vector. Endpoint assertions are
connect-i/connect-j/connect-k/connect-a. Projected relative-position assertions
are projection-i-j/projection-j-k/projection-k-a.
Arrow and arc cardinality assertions are four-vectors/no-angle-arcs.

## fig-g10-04

Use: teaching prose, Problem 2, the angle phi between nonzero a and b.
Source: ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-04.png
SHA-256: 8b1e49d641ff926c1a19d259d4294e44aca181fc9e7772ffa0533c08cacd1fa0

- One unlabelled junction near the lower-left interior.
- Five solid outward arrows share it: i down-left, j right, k up,
  a steeply upper-right, b more shallowly upper-right.
- Five vector labels: i/j/k as in 03, a right of the steep tip,
  b above the shallow upper-right ray near its tip.
- One thin solid, unarrowed angle trace joins the a and b directions close
  to the common tail. Its Greek label is phi (varphi), between these rays.
- No alpha/beta/gamma; no numbers, angle solution, or extra ray.

Mapping: s04-shared-frame contains all five labelled tips and vectors.
connect-i/connect-j/connect-k/connect-a/connect-b bind every ray.
projection-i-j/projection-j-k/projection-k-a/projection-a-b cover every anchor.
s04-phi maps phi-arc/phi-label and binds the intended start/end rays through
phi-start-ray/phi-end-ray; one-angle-arc checks count, not relationships.

## fig-g10-05

Use: Exercise 14, a=(p,q,r), with direction angles alpha/beta/gamma to i/j/k.
Source: ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-05.png
SHA-256: ead0b7efbccc03c7d8205535a406dd7b6be2da7697567dd34b596337255f2cc7

- One unlabelled junction near the lower-left interior.
- Four solid outward arrows: i down-left, j right, k up, a steep upper-right.
- Four vector labels: i at the lower-left tip, j below the right tip,
  k left of the upper tip, a right of the upper-right ray near its tip.
- Three solid unarrowed direction-angle traces. The left/broad trace and
  alpha label associate i with a; the right trace and beta label associate
  j with a; the upper closely spaced trace and gamma label associate k
  with a. The alpha trace crosses the projected k direction. The upper
  source strokes are crowded/curved spatial-angle projections, not
  perpendicularity marks or additional numeric givens.
- Greek alpha is left of the tail, beta is upper-right of the tail,
  gamma is higher, between k and a. No phi or b.
- No p/q/r coordinate annotation, cosine formula, unit-vector coordinate,
  60-degree label, computed gamma, or any other question answer is printed.

Mapping: s05-shared-frame maps i/j/k/a labelled tips and vectors.
connect-i/connect-j/connect-k/connect-a bind all arrows.
projection-i-j/projection-j-k/projection-k-a cover every anchor.
s05-direction-angles maps alpha/beta/gamma arc and text objects; the six
*-start-ray/*-end-ray assertions bind the i-a, j-a, k-a endpoint directions,
and three-angle-arcs checks count separately.

## Declared modernization, not source facts

- Remove raster/book texture; use semantic ink and paper roles.
- Keep a single uncluttered common-tail frame without adding an origin label,
  point dots, tick marks, coordinate text, metric data or answers.
- Normalize straight rays, arrowheads, label offsets and line thickness.
- Replace crowded spatial angle traces with separated native JSXGraph circular
  schematic glyphs, preserving ray incidence and Greek label association.
  Their screen radii, curvature and sweep sizes are layout only. They are NOT
  measurements of the three-dimensional direction angles; no planar
  perpendicular/equal-length assertions or numeric angle claims are made.
- Retain original vector notation and Greek mathematical labels. There is
  no cultural text, texture, iconography, or new instructional annotation.
- Inline instructional display: maxWidthPx=480, widths=[300,358,480],
  minTextPx=16. No scroll fallback is planned.

Author visual inspection is not independent approval. No record_review pass,
promotion, core edition write, lesson approval, or release is authorized here.
