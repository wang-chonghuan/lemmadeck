# Fig 60 Source Inventory

Author observation, 2026-11-16. Recorded after opening the original PNG and before authoring a FigureSpec. Not an independent review or approval.

Source: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-60.png`
SHA-256: `aae24ebf204aa8bbe9d0e7db308e94ae36e8bc15215fd511aeaf8d399c435ccb`

## Actual Pixels

- One diagram, in a closed, irregular rounded outline denoting plane alpha. Alpha is printed near the lower interior. The outline is a schematic plane patch, not a metric boundary.
- Five black point dots: M1 at approximately (109,35), N1 at (128,202), O at (277,192), N at (430,181), and M at (450,350), in source screen pixels. M1 and N1 have subscript 1; no other point labels appear.
- Four solid straight connections: M1--N1, N--M, M1--M through O, and N1--N through O. There are no arrows, dashed edges, angle marks, equality ticks, coordinates, lengths, grids, rows, columns, or numerical givens.
- M1 is upper left, N1 is left and slightly lower than O, N is right and slightly above O, and M is lower right. The two long connections intersect at the marked O.
- The source supports paired opposite points about O and corresponding outer segments. Exact midpoint and distance relationships come from the approved lesson, not measurements of an imperfect scan.

## Planned Mapping

- `source-point-configuration`: points `m1`, `n1`, `o`, `n`, `m`; segments `m1-n1`, `n-m`, `m1-m`, `n1-n`. All five points share one inventory group requiring `pointRelationships`.
- M1/M and N1/N: `opposite-pairs`; O on both spanning segments: `o-on-mm1`, `o-on-nn1`; equal half-spans: `m-midpoint`, `n-midpoint`; equal corresponding outer segments: `corresponding-distances`; parallel outer segments: `corresponding-parallel`.
- Each of the four meaningful segments has its own `connects` assertion: `edge-m1-n1`, `edge-n-m`, `edge-m1-m`, `edge-n1-n`.
- `source-plane-patch`: `alpha-plane`, `alpha`. Each source dot and the alpha text anchor get explicit `inside` assertions.

## Modern Additions And Limitations

- The irregular outline will become a regularized deterministic plane-patch polygon; its vertices are not new labelled source points. Its opposite corners will be checked about O so the schematic border does not contradict the lesson's half-turn.
- Exact central pairing, consistent spacing, semantic ink roles, clean type, and a white background are modern regularization. No extra teaching labels, axes, values, answer statements, or exercise solutions will be added.
- The two-dimensional drawing depicts a common plane in space; it does not assert that its finite outline is the entire infinite plane.
- Source observation count so far: two original images in this batch/context. No crop or repeated opening.
