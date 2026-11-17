# Figure 63: pixel inventory before specification

Inspected the original PNG once, 2026-11-16. SHA-256:
8bc29170e588184eb2c612dacba4c7bfbf0d83d88e1106454302ba50b8d8ac5f.

Four separate horizontal supporting lines, in a vertical stack.

- a: O1 lies left of O2, both are printed dots. h1 is the rightward ray from
  O1, h2 the rightward ray from O2. The left continuation is thin.
- b: O1 lies left of O2, both printed dots. h1 runs left from O1; h2 runs
  right from O2. The intervening supporting-line piece is thinner.
- c: O1 lies left of O2, both printed dots. h1 runs right from O1; h2 runs
  left from O2. Their bold traces overlap between the origins.
- d: one common printed dot is labelled O1 = O2. h1 runs left, h2 right.
- Each row has h1/h2 above and origin labels below; Cyrillic row labels are
  a/b/c/d. No numerical givens, grids, equality marks on lengths or dashed
  linework are printed. Uneven/dotted scan pixels are not a dashed-line code.

Planned groups: source-a through source-d, with labelled origins, supporting
continuation, both ray traces and row labels. Endpoint connection and
collinearity assertions remain within each group. A data-only executable
check distinguishes all four ray-intersection branches.

Modern additions: typeset labels, English row letters and arrowheads.
Finite opposite-ray extents in b/c/d are regularized to equal parameters,
without length markings; centralSymmetry assertions explicitly cover BOTH
origins and BOTH finite tips. These are construction checks, not a claim that
the source printed equal ray lengths. Ray direction, order, coincidence and
solid thin/bold distinction are source facts.
