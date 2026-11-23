# Frozen pixel inventory: FIRST batch 15-18

Author only. Recorded on 2026-11-23 after exactly four individual original
image opens and before any FigureSpec was drawn. No crops, reopens, or other
images were loaded. This is source observation, not independent review.

## Inputs and authority

All paths below are relative to
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

Original root: `ssot-resources/soviet10year-textbooks/artifacts/8p/figures/`.

| Original | SHA-256 |
| --- | --- |
| fig-15.png | 0f6c36251427b0f83722ccd7f638e159fd8ae76ef66b6c1d5fb328238c4a9b43 |
| fig-16.png | 244cc3d546a70fa6d65b9e440e33162346f32ee37e9cdc0076d310aa7516d888 |
| fig-17.png | 74ea7dcd9365da08431b4e1a406ab401f396b3d4a01ee791e6f12163a5a55c9d |
| fig-18.png | d93d3fef8cbcb120b0b5d9be02e11a92d686ff17f283ca65e165861c841af110 |

Candidate authority:
`.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c1-s1-n5/lesson.template.json`
SHA-256 `5b158d8fffc12ace22c18514a68f00f6b5aa84091a8f54625afee12d1a4c8d23`.
The three complete addition paragraphs are p0028#10 + p0029#5, p0029#6,
and p0029#11 + p0030#1. The projection discussion is excluded. Raw
`lessons/phy8-c1-s1-n5/lesson.md` was read only as secondary context.

## Fig-15

Two source subfigures, neither with a printed panel identifier.

- Left: an independent vector a points down-left; an independent vector b
  beneath/right of it points down. Both have vector-arrow letter labels.
- Right: the translated a and b share the upper-right origin. a ends at
  upper-left; b ends at lower-right. Dashed completion sides meet at
  lower-left. The diagonal from the shared origin to lower-left is directed
  down-left and labelled a + b with vector notation. Its scanned shaft is
  heavier/outlined, not another addend.
- There are four construction vertices in the parallelogram and four
  independent input endpoints. No printed point names, point dots, axes,
  ticks, numeric lengths, angles, or grid.
- Required relations: copies preserve vector magnitude and direction;
  opposite parallelogram sides are parallel and equal; the diagonal reaches
  the opposite vertex and equals the sum of the two starting-side vectors.

Stable mapping: `input-a-start/end`, `input-b-start/end`, `sum-origin`,
`sum-a-end`, `sum-b-end`, `sum-end`; arrows `input-a`, `input-b`, `sum-a`,
`sum-b`, `sum-result`; dashed segments `completion-b`, `completion-a`;
texts `input-a-text`, `input-b-text`, `sum-a-text`, `sum-b-text`,
`sum-result-text`. Each arrow has its own `*-connects` assertion.
One complete internal relationship group includes all eight defining points,
all connecting arrows, and all relevant vector/completion assertions.

## Fig-16

Three source subfigures, neither a simplified triangle alone nor one order only.

- Left: separate a down-left and b down, with vector-arrow labels.
- Middle: a runs from upper-right to the left-middle joint; b runs down from
  that joint to the bottom. The resultant joins the first start to the final
  end, points down-left, and is labelled a + b.
- Right: b runs down from the upper-right origin to the right-middle joint;
  a runs down-left from there to the bottom-left final end. The resultant
  again joins the first start to the final end and is labelled a + b, not a
  newly invented b + a label.
- Resultant shafts in the scan are outlined/heavier. There are no separate
  auxiliary axes, ticks, given lengths, point names, or dot markers.
- Required relations: all copies of a retain magnitude and direction; all
  copies of b retain magnitude and direction; both chains share endpoints
  head-to-tail and produce equal resultant vectors.

Stable mapping: four input endpoints; `ab-origin/joint/end`;
`ba-origin/joint/end`; arrows `input-a/b`, `ab-a/b/result`, `ba-b/a/result`;
six source vector-label instances beyond the two input labels, namely
`ab-a-text`, `ab-b-text`, `ab-result-text`, `ba-b-text`, `ba-a-text`,
`ba-result-text` (six construction labels, eight total).
Every arrow maps to `*-connects`. The internal relationship group includes
all ten points and the translated-vector and resultant assertions.

## Fig-17

One six-vertex polygonal construction. Source letter labels are O, A, B, C,
D, E, in that order along the chain.

- O is bottom-right. O -> A points left along the bottom.
- A -> B points up-left to the leftmost middle vertex.
- B -> C points up-right.
- C -> D points steeply up-right to the upper-left vertex.
- D -> E points right/slightly down to the upper-right vertex.
- The resultant O -> E points upward/slightly right and has an
  outlined/heavier scanned shaft.
- All six endpoint/joint letters must remain. There are five addend arrows
  plus one resultant arrow. No numeric values, vector-letter labels,
  grid, axes, ticks, or distinct dot markers.
- Required relations: consecutive arrows join at exactly A, B, C, D;
  the resultant starts at O and ends at E; its displacement equals the
  total displacement of all five addends. Do not collapse the intermediate
  bends into one triangle.

Stable mapping: `chain-O/A/B/C/D/E`, arrows `chain-OA/AB/BC/CD/DE/OE`,
texts `chain-O-text` through `chain-E-text`, and six `*-connects`.
The internal relationship group contains all six points and all six arrows.

## Fig-18

Two standalone input rows and a lower addition construction with a separate
resultant row.

- Top input: vector a points right.
- Next input: longer vector b points right, starting farther right than the
  standalone a. Both have vector-arrow labels.
- Lower construction: a points right, immediately followed by b pointing
  right on the same baseline. The joint is a's head and b's tail.
- Beneath that chain: an outlined/heavier rightward resultant, aligned with
  the chain's start and end, labelled a + b with vector notation.
- No marked point names/dots, numeric lengths, sign-axis, ticks, or grid.
- Required relations: copies retain magnitude and direction; b is longer
  than a without a numerical ratio being asserted as source data; all
  three chain vertices are collinear; resultant length is the sum of
  the two lengths and its direction is right. Its offset display row
  denotes the same displacement, not a different start in physical space.

Stable mapping: `input-a-start/end`, `input-b-start/end`,
`chain-start/joint/end`, `result-start/end`; arrows `input-a/b`, `chain-a/b`,
`result`; texts `input-a-text`, `input-b-text`, `chain-a-text`,
`chain-b-text`, `result-text`; five `*-connects`.
The internal relationship group includes all nine defining points, the
collinearity assertion, and the vector-copy/resultant assertions.

## Separately declared modern additions

Not source facts: exact modern coordinates and lengths, mathematically exact
parallelism/equality, regularized line spacing, English panel identifiers,
36 px labels, semantic ink/accent/muted roles, and replacement of outlined
scanned resultants with single clear directional arrows. Panel labels identify
the preserved source subfigures; they add no new mathematical task.
No invented numerical ratio or coordinate is to appear as a visible given.
All defining points default to hidden because the originals do not mark dots.

Requested display contract: canvas width 640; instructional inline widths
318, 358, 480; font size 36 px, nominally 17.8875 px at width 318.
This arithmetic is not renderer or owning-lesson product measurement.

## Tool conflict identified before validation

The existing validator at
`.agents/skills/ld-s10y-image/scripts/validate_spec.py` rejects any
inventory-mapped object with `visible: false` (its visible-object inventory
check), including construction points. Its `pointRelationships` gate also
requires mapped point objects. The requested hidden-point and wholly internal
point-group requirements therefore conflict for these figures. Do not hide
this by omitting point mapping, making dots visible, changing shared tools,
or weakening assertions. Keep the actual first validation failure and hold
the dependent render stage unless the owning tool contract is repaired under
separate authorization.
