# Independent Source Pixel Inventory

Recorded before reading any candidate spec, cap1 inventory, author notes, compile script, draft check, or FIRST artifacts. Original opened first; only a vertical-axis crop was then opened to settle the label inventory. Image-open count at this checkpoint: 2.

Source: `ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-55.png`

SHA-256: `0923bc94f6867f6e07c0551fbf5fd92d40daa6823096675d1bb99de78cf8546f`

Dimensions: 1097 x 404 pixels. One black-on-white graph; no subpanels, named points, letters attached to curve features, or answer annotations. Slight scan skew and uneven ink thickness are nonmathematical printing artifacts.

## Structure

- One shared finite rectangular lattice and coordinate frame. Counting the visible half-unit intervals gives 36 columns and 12 rows, corresponding to x from -7 to 11 and y from -2 to 4. Source intervals are half-units on both axes; integer labels are spaced two cells apart. The scan is horizontally elongated rather than square on screen.
- Horizontal x-axis at y=0, vertical y-axis at x=0. Positive direction arrowheads, with `x` at the right and `y` at the top. The rightmost grid column reaches beyond the x-axis label, but the curve itself ends far earlier.
- Source x-value labels: `-6`, `-5`, `-4`, `-3`, `-2`, `-1`, `0`, `2`, `3`, `4`, `5`, `6`, `7`, `8`. No visible x=1 numeric label. Origin is represented once by `0`.
- Source y-value labels: `2`, `3` only. There is no y=1 numeric label near the y=1 gridline. The narrow vertical remnant between `3` and `2` lies on a gridline and is not a third numeral. This conclusion was checked in `source-ylabels-crop.png` (crop height 320, width 110, source offset top=20,left=350).
- One solid continuous curve, without a dashed portion, asymptotic branch, arrowheads, filled endpoint dots, or extra solution markers. Finite source domain approximately x=-6 through x=8; do not extend to the frame edges.

## Curve Readings From Pixels

These are approximate grid readings, not an exact function or an answer key. The source ink is broad and skewed.

- Left endpoint approximately (-6,-1.5); rising toward a single local maximum near (-2,2).
- First x-axis crossing near x=-4 (rough reading -4.15 to -3.85).
- Local maximum lies around x=-2.2 to -1.6, y=1.85 to 2.15. It is the only interior maximum.
- Descending branch meets the y-axis near y=0.7 (rough reading 0.6 to 0.9). It crosses the x-axis strictly to the right of 0 and left of 1, near x=0.6; visible ink supports roughly 0.45 to 0.75, not a forced exact x=0.5.
- One local minimum near (2,-1), with rough position x=1.8 to 2.3 and y=-1.1 to -0.85. It is the only interior minimum.
- Third crossing near x=3 (rough reading 2.85 to 3.15), then monotone rise toward the right endpoint near (8,3).
- Overall source graph reads approximately y from -1.5 to 3. Its largest y occurs at the finite right endpoint, not at the interior local maximum.
- Approximate visible values: f(-5) about -1.1, f(-3) about 1.35, f(-1) about 1.55, f(1) about -0.5, f(4) about 1.2, f(5) about 2.05, f(6) about 2.55, f(7) about 2.85. These observations are provisional pixel estimates, not prescribed exact interpolation knots.

## Preservation Requirements

Preserve the single shared frame, exact half-unit cell counts, sparse source label inventory, solid finite curve, sign pattern and relative branch relationships, two interior turns only, approximate source reading ranges, and unmarked endpoints. Regularized linework, readable type, neutral color roles, and margins may be modern additions; extra coordinate labels or answer-bearing annotations are not source facts.
