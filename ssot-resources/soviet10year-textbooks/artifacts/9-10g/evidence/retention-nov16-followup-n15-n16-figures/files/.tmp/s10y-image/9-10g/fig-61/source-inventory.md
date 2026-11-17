# Fig 61 Source Inventory

Author observation, 2026-11-16. Recorded after opening the original PNG and before authoring a FigureSpec. Not an independent review or approval.

Source: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-61.png`
SHA-256: `18b2c7ab86e489cbb6b002382e324de5f84633c3ed0ea0399e3a5555f2287830`

## Actual Pixels

- One diagram: a closed, rounded oblique plane patch, labelled alpha in its left lower interior.
- Four labelled dots: M about (182,56), N about (327,102), M1 about (166,426), and N1 about (313,426). The lower labels have subscript 1.
- Three further black dots are unlabelled: the intersections of MM1, NN1, and line l with the plane, approximately (176,237), (321,262), and (436,240).
- Three solid transverse segments connect the two spans: M--N slopes down to the right in source screen space; the middle segment joins the two unlabelled plane-intersection dots with a smaller downward slope; M1--N1 is approximately horizontal. The upper and lower segments are not drawn parallel.
- Each M/M1 and N/N1 pair lies on a near-vertical slanted span. It is solid from the top point to its plane-intersection dot, dashed from that dot to the lower plane boundary, then solid from the boundary to the bottom point.
- A third similarly directed line is shown to the right: a solid upper portion labelled l, an unlabelled plane-intersection dot, a dashed portion below that dot inside the drawn patch, and a solid continuation below the patch. There are no arrowheads.
- The M half-spans are visibly longer than the N half-spans. The intersection dots occupy different positions in the projected plane. There are no named feet, right-angle marks, perpendicularity claims, equality ticks, measurement values, grids, rows, or columns.
- The handwritten line glyph resembles a tall L; its modern name is the lowercase mathematical l in the approved exercise.

## Planned Mapping

- `source-projection-configuration`: `m`, `n`, `m1`, `n1`, `m-alpha`, `n-alpha`, `l-alpha`, all in one source-local group requiring `pointRelationships`.
- Pair collinearity: `m-span-collinear`, `n-span-collinear`; bisection at the plane: `m-bisected`, `n-bisected`; pair directions parallel to line l: `m-parallel-l`, `n-parallel-l`; line dot on its own line: `l-dot-collinear`.
- All three transverse segments and all three solid/dashed portions of each of the three spans receive individual `connects` assertions. The middle connection is `m-alpha-n-alpha`, covered by `edge-midplane`. Boundary transition coordinates are unmarked construction coordinates, not invented source dots.
- `source-plane-patch`: `alpha-plane`, `alpha`, with `inside` assertions for the three plane dots and alpha text anchor. Four endpoints remain outside this schematic patch.

## Modern Additions And Limitations

- The outline will be a deterministic regularized polygon. Its finite shape and corners carry no mathematical condition.
- Parallel spans and exact midpoint coordinates are derived solely from the approved written exercise and source layout. Differing half-span lengths and differing upper/lower segment directions will be retained; no parallelogram or perpendicular projection will be substituted.
- Source intersection dots remain visible and unlabelled. No numerical coordinates, new labels, explanatory result, or answers to either question will be drawn.
- The line name l is typeset with the mathematical script-ell glyph U+2113 to distinguish it from an uppercase I; this is lettering regularization, not a renamed line.
- Solid/dashed transitions are depth conventions from the pixels, not claims of extra points or boundaries in the infinite plane.
- Source observation count so far: two original images in this batch/context. No crop or repeated opening.

## Author Correction

The initial inventory and first draft omitted the solid connection between the two unlabelled plane dots. Comparing the first output against the original already open in this context caught the omission before the one allowed repair. This corrected inventory records all three transverse connections; the repair restores the middle segment and its executable edge assertion. The initial mechanical pass did not establish source completeness.
