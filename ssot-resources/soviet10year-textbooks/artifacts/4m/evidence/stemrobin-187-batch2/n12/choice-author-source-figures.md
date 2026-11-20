# n12: independent graph-source solutions

Status: independently solved and frozen before constructing graph alternatives
or integrating the final draft. First-stage frozen solutions and partial draft
remain unchanged. Input authority is the same seed and the three actual modern
previews authorized by the user, not originals, specifications or review files.

Full 21-source seed canonical SHA-256:
`5d8aa59109541e3d04545e70fca625fe13ed618b76f9e4da2d4d37244bb95cb5`.
Actual images loaded: exactly 3 total, each preview once. No reopens or crops.

## Actual-image observations and binding

- `tbl-p0048-01`: opened
  `.tmp/stemrobin-187/batch2/n12-figures-a/tbl-p0048-01.label-repair.png`.
  Complete table, both three-row halves visible. Columns are No., Name and
  Height (cm). Entries are 1 Alex 124, 2 Blake 135, 3 Casey 127,
  4 Drew 123, 5 Emery 136, 6 Flynn 141. The row numbers are identifiers,
  not a height order. Preview PNG byte SHA-256:
  `47410762a13385b716b0513063368a5b1703b4f9cb2ff5dc9c5946b6cdcc47ca`.
  Same-basename scratch SVG and the durable seed SVG both hash to
  `d2391f7ede875f20c57e570cd3a2c71088c90b461bf7ab395c266e450941dc7d`.
- `fig-59`: opened
  `.tmp/stemrobin-187/batch2/n12-figures-a/fig-59.source-label-repair.png`.
  Complete outer border and all vertex labels visible. Grid has three equal
  columns and two equal rows. Top: A, B, C, D; middle: M, K, P, T;
  bottom: X, L, Y, E. All drawn edges are horizontal or vertical.
  Preview PNG byte SHA-256:
  `735cea052affb965fc7001b7071d62e26d5fe048ab5e8059ea34460daaf65271`.
  Same-basename scratch SVG and the durable seed SVG both hash to
  `a1bc3b456c5183bb05ade520fb020700f7308f64ded1aaac452208e831785e4a`.
- `fig-60`: opened
  `.tmp/stemrobin-187/batch2/n12-figure-b/fig-60.canvas-repair.png`.
  A horizontal continuous segment joins four marked points in strict left-to-right
  order A, B, C, D. All four labels and endpoint dots are fully visible.
  No equal-spacing claim is needed or inferred.
  Preview PNG byte SHA-256:
  `f1c92879446039434204f99a2d183c7446fc1385eda1438f31d52469b0f88a49`.
  Same-basename scratch SVG and the durable seed SVG both hash to
  `2c2b0de65cee8bcbe2cddec1feb06ef2ad07451e4a78be569417a621bfa5c6ce`.

SVG verification was byte hashing only: no SVG source interpretation, rendering,
specification, source scan, answer, interaction or review artifact was read.

## 171: both height orders

Task: name all six students from shortest to tallest and from tallest to shortest.

Observed heights:
Alex 124 cm; Blake 135 cm; Casey 127 cm; Drew 123 cm; Emery 136 cm;
Flynn 141 cm. Every height is different, so both orders are unique.

- Shortest to tallest:
  Drew (123), Alex (124), Casey (127), Blake (135), Emery (136), Flynn (141).
  Check: 123 < 124 < 127 < 135 < 136 < 141.
- Tallest to shortest:
  Flynn (141), Emery (136), Blake (135), Casey (127), Alex (124), Drew (123).
  Check: 141 > 136 > 135 > 127 > 124 > 123.

Reading the table across its two halves does not sort heights. Both directions,
all six names, and the near-neighbour comparisons 123/124 and 135/136 must remain.
Choice recognition does not prove actually saying the six names in both orders.

## 172: every drawn square and every congruence class

Task: count all squares whose complete sides follow the drawn grid lines and
determine which are congruent. Vertex names below follow the boundary in order.
Let one small-cell side be u; this is a mathematical normalization, not a new
figure or a physical measurement.

- Top row, side u: ABKM, BCPK, CDTP.
- Bottom row, side u: MKLX, KPYL, PTEY.
- Side 2u: ACYX and BDEL.

These are eight distinct squares. For side u there are 3 * 2 = 6 positions.
For side 2u there are (3-2+1) * (2-2+1) = 2 positions. A side 3u square
cannot fit two rows. No tilted square has its sides drawn; do not insert diagonals.
The full outer quadrilateral ADEX has width 3u and height 2u, so is not square.

Complete congruence partition:

1. {ABKM, BCPK, CDTP, MKLX, KPYL, PTEY}: all side u, mutually congruent.
2. {ACYX, BDEL}: both side 2u, congruent to each other.

No member of the first class is congruent to a member of the second. All eight
are squares, but merely sharing the square shape gives similarity, not equal size.
Counting only cells loses the two larger squares; classifying only the larger
pair loses the complete smaller class. A choice does not prove independent
exhaustive enumeration or writing the full congruence classification.

## 181: complete membership, including endpoints

Task: identify every named segment containing C and every named segment not
containing B. From four collinear marked points there are six endpoint pairs:
AB, AC, AD, BC, BD, CD. A segment includes both endpoints.

| Segment | C belongs? | B belongs? | Reason |
| --- | --- | --- | --- |
| AB | No | Yes | C is right of B; B is the right endpoint. |
| AC | Yes | Yes | C is the right endpoint; B is interior. |
| AD | Yes | Yes | Both B and C are interior. |
| BC | Yes | Yes | C and B are its two endpoints. |
| BD | Yes | Yes | C is interior; B is the left endpoint. |
| CD | Yes | No | C is the left endpoint; B is strictly to its left. |

Thus C belongs to AC, AD, BC, BD, CD, and does not belong to AB.
B does not belong to CD only; it belongs to AB, AC, AD, BC, BD.
The endpoint cases are decisive: C is not restricted to AD and BD, and B is
not excluded from AB, BC or BD merely because it is an endpoint.
No lengths or equal intervals are required. Recognition does not prove independently
listing all six segments and constructing an exhaustive membership argument.

## Freeze boundary

This file records all tasks of 171, 172 and 181, independently of alternatives.
After the first byte SHA-256 is recorded, do not rewrite this snapshot.
