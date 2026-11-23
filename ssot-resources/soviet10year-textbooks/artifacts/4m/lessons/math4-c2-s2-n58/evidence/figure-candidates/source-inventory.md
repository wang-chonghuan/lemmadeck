# N58 figure source inventory, before drawing

Ticket: STEMROBIN-187. Author candidates only; no promotion or independent review.
Source PNGs were each visually opened exactly once before this inventory.
The current edition exercise template was read for complete 967 and 974 entries.
No solutions, answer keys, choices, or other lesson outputs were consulted.

## fig-222

- One diagram, one shared vertex A at the left.
- Four solid straight ray strokes, clockwise in image space: upper AO, AM,
  AK, lower AP. The upper endpoint glyph looks Q-shaped, not a clean O.
  M is upper-right, K lower-right, P below-right, and A left of the vertex.
- Exactly one small arc spans the minor region between AK and AP at A.
- No arrowheads, equality ticks, numeric degrees, solved labels, or other
  subfigures. Endpoint strokes are not equal-length givens.
- Pixel structure maps to points `fig222-A`, `fig222-O`, `fig222-M`,
  `fig222-K`, `fig222-P`, segments `fig222-AO`, `fig222-AM`,
  `fig222-AK`, `fig222-AP`, and arc `fig222-KAP`.
- All five points will belong to the same inventory group. Four `connects`
  assertions will cover every point within that group; `angleRegion` will
  bind the sole arc to the minor KAP region.
- Current 967 text says AK bisects OAP and AM bisects OAK. It asks to measure
  KAP and calculate OAM. It uses O, not Q.

### Disclosed modern regularization

- Use clean O because of the authoritative text. This is not a claimed
  source-pixel reading.
- Retain a numerical ordinary approximate fit to the source AK/AP directions;
  no dewarping, exact-paper prerequisite, or convenient fixed textbook angle.
- Derive modern AO and AM from the two textual bisector conditions, rather
  than claiming the hand-drawn source is exactly bisected.
- If tiny visible point anchors are used, they are modern additions, not
  source endpoint dots or givens. Do not add angle/equality/answer marks.

## tbl-p0216-01

- One table, complete outer border and three internal lines in each direction:
  four rows and four columns including headers.
- Blank corner at row 0, column 0.
- Top header row, left to right after the corner: 0.35, 0.72, 1.14.
- Left header column, top to bottom after the corner: 5.43, 0.68, 1.71.
- All nine interior cells are blank. No plus sign, corner zero, or results.
- Source lattice maps to `tbl974-grid`, asserted by `tbl974-4x4`.
  Header values map to stable row/column IDs. A text object count of six
  is supplemental only; it does not replace the 4-row/4-column assertion.
- Current 974 explicitly says each internal blank uses its immediately
  adjacent above and left values and that the corner remains blank.
  This is recursive propagation, not pairing each row header with each
  column header independently. No computed values will be drawn.

### Disclosed modern regularization

- Straight, even grid lines and centered modern decimal labels replace the
  hand-drawn line wobble and spacing. All cells, values, and blanks survive.

## Image ledger

1. Original `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/fig-222.png`.
2. Original `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/tbl-p0216-01.png`.

Two planned 640-pixel previews remain to be loaded, once each. No crops,
alternate renders, or image payloads will be returned to the parent.
