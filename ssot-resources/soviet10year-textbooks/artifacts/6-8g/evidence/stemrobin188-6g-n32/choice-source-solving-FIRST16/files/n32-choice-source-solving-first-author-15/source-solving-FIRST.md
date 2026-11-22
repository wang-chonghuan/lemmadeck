# N32 source-solving FIRST: blind author, written sources only

Ticket: STEMROBIN-188 / SAME188-6. Date: 2026-11-22.

This is the author's independent mathematical source solving, completed for
ALL written seeds 432--440 before any alternatives. It is NOT an independent
review, an answer-production artifact, a prepared tool seed, a choice draft,
or approval of the whole lesson. No options, option identifiers, choice keys,
judging/interaction fields, or prior choice artifacts were consulted or created.
The proposed response units at the end follow the complete source solutions.
The phase ends at this record, its seal, a report, and a manifest.

## Bound input snapshot

All paths below are in
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/`.

| Input name | Exact relative path | Actual byte SHA-256 |
| --- | --- | --- |
| Source-only authorization | `.intentfold/tickets/STEMROBIN-188/tmp/n32-choice-source-only-inputs-15/source-only.json` | `92c3245b241593f3caa35f25a92ca11a623cf327fe9d9b71afee8aaa1964f75b` |
| N32 written lesson | `.intentfold/tickets/STEMROBIN-188/tmp/n32-text-candidate-10/lesson.template.json` | `8cfdd2b2d53487af12c2099acebcd5f020db8522aa38e3ee49e10bb2d1d23cd4` |
| N32 written exercises | `.intentfold/tickets/STEMROBIN-188/tmp/n32-438-modern-submarkers-revision1-13/exercises.template.json` | `5ad97637caff38ecc7f76ff6704e9e8300e051711d184065c6b79543008a3138` |
| N31 supplemental statements | `.intentfold/tickets/STEMROBIN-188/tmp/n31-text-candidate-09/lesson.template.json` | `2d1ddf717d2eeaf1acebb1ce4456d90a91b68f028447963a56fb43f41f46ecb9` |
| Original fig-208 PNG | `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-208.png` | `a87ef68e5938055d0d8c87753b319b64fa0cb4c19209c72135cdee15581eadfa` |
| Approved current fig-208 SVG | `ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-208.svg` | `971ee90792f601f7bcc221d92febbb8c6d95a3f2915ce310edb38544d343ada2` |

Structured projections exposed only N32 exercise numbers/text/figure references,
N32 statement blocks 1, 2, 6, 8, 15, and N31 statement blocks 0, 3, 16.
Hashing other bytes of these named input files did not expose their content.
No remaining N31 prose, proof, exercise, figure, or solved example was read.

## Authoritative statements and dependency vocabulary

The following is a faithful mathematical transcription of the selected
statement blocks, not a reconstruction from solved examples.

- N31 block 0, definition, source ref `p0149#5`: two lines in one plane are
  parallel if they have no common point OR coincide. Thus `a || a` is true.
- N31 block 3, theorem 39, source ref `p0149#8`: two lines centrally symmetric
  with respect to a center are parallel.
- N31 block 16, theorem 40, source ref `p0150#11`: two lines perpendicular to
  the same line are parallel. This includes their possible coincidence.
- N32 block 1, axiom 41: through a point there is at most one line parallel
  to a given line. This is uniqueness, NOT existence by itself.
- N32 block 2, corollary 1: a line intersecting one of two parallel lines
  also intersects the other.
- N32 block 6, corollary 2: a perpendicular and an oblique line to one line
  intersect.
- N32 block 8, corollary 3: lines parallel to the same line are parallel.
- N32 block 15, theorem 42: two parallel lines are centrally symmetric.
  The statement asserts existence of a center, not uniqueness of that center
  and not that every point is a center.

All tasks are considered in one Euclidean plane. In the line-position
statements, "intersect" means distinct lines meeting in one point; it does
not mean coincident lines merely sharing points. This is the usual three-way
classification: coincident, distinct parallel, or crossing.

Elementary mathematical dependencies used transparently below:

- A perpendicular line can be drawn through an arbitrary point to a given
  line; a midpoint exists; two distinct points determine one line.
- Distinct crossing lines meet in exactly one point.
- A half-turn is `H_O(X) = 2O - X`, is involutive, maps lines to lines,
  reverses both directions, and preserves angle measures and distances.
  A line is fixed by `H_O` exactly when it contains O.
- Vertical angles are equal and adjacent linear-pair angles sum to 180 degrees.
- A nondegenerate quadrilateral has four distinct vertices in boundary order.

These elementary facts are explicit proof dependencies, not additional
consulted textbook blocks. No unsupplied theorem about parallel-line angle
equality or parallelogram side lengths is assumed without derivation.

## Actual figure observation and image ledger

One batch; initial image-bearing context count 0. Three actual image-view
attempts were made, all returned images. The second was a low-contrast technical
preview and was retained. No crops, thumbnails, native geometry regeneration,
browser session, image-model call, new source approval, or new candidate figure.

| Charged attempt | Loaded pixels | Result |
| --- | --- | --- |
| 1 | Original fig-208 PNG, SHA `a87ef68e5938055d0d8c87753b319b64fa0cb4c19209c72135cdee15581eadfa` | Full original opened; line and angle inventory readable. |
| 2 | Complete current-SVG raster `fig-208-current-full.png`, SHA `7e0ee932cf45410b062bba880011962a047b70d2707a114d8e468f1f2e697225` | Full 1280 x 1488 pixels opened; transparent background had poor contrast in the viewer. Retained as first technical outcome, not source or content failure. |
| 3 | White-backed existing raster `fig-208-current-full-white.png`, SHA `28e6ae883786e87936176166bc0567cf4bcaba42d49b19722055c72874ba013b` | Full 1280 x 1488 pixels opened; all lines, labels, angle marks, rightmost endpoints, and bottommost transversal endpoint visible. |

Charged image-view attempts: 3/8. Context images loaded: 3/24.
Raster operations: one existing-SVG rasterization at density 144, then one
white-background composition of that existing PNG, with no second SVG render.
Paid/image-model attempts: 0. Source PNG and SVG hashes were preserved.
The approved SVG's bytes are the source of the complete preview; the preview
is inspection evidence, not an approved replacement or a figure to publish.

Runtime: existing bundled
`/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.cjs`.
The repository did not resolve `sharp` or `@resvg/resvg-js`; no package was
installed. Rasterization and white backing both exited 0.

Parent image budget is inherited as permanently 24/24. Parent new images: 0.
Return text only; do not send these image payloads to the parent.
Inherited original FIRST failures and UNKNOWN states were not read, reconstructed,
cleared, or reset. This ledger accounts only for this author's actual operations.

### Pixel inventory common to original and complete modern rendering

There are two distinct oblique parallel lines, a above b, both running from
lower-left to upper-right. A steeper transversal c runs from bottom-left
toward top-right and crosses a at the upper vertex P, then b at the lower
vertex Q. P and Q are names introduced here for reasoning; neither image
labels the vertices with those names.

At P, in order around the crossing:

- Angle 1 is between the up-right ray of a and the upward ray of c.
- Angle 2 is between the up-right ray of a and the downward ray of c.
- Angle 5 is between the down-left ray of a and the downward ray of c.
- Angle 6 is between the down-left ray of a and the upward ray of c.

At Q:

- Angle 8 is between the up-right ray of b and the upward ray of c.
- Angle 7 is between the up-right ray of b and the downward ray of c.
- Angle 3 is between the down-left ray of b and the downward ray of c.
- Angle 4 is between the down-left ray of b and the upward ray of c.

Original and modern images agree on every number, its sector, line label,
ordering of the vertices, and crossing geometry. The modern image regularizes
the drawing and lettering and shows the same single-arc and double-arc sectors.
The rendered canvas is complete, including c at top and bottom, a's right
endpoint and label, and b's right endpoint and label; no right or bottom
content is cropped.

The sectors 1, 5, 8, 3 look acute and 2, 6, 7, 4 look obtuse in the drawing.
That appearance supplies NO numerical angle or measured slope. Arc style is
an observed graphic feature, not a premise proving equality.
The exercise's parallelism and the geometric proofs, not visual measurement
or shared marks, establish the relationships below.

## Seed 432: existence AND uniqueness through an arbitrary point

Written task: prove that through any point P of the plane there is exactly
one line parallel to a given line a. Conditions: P may lie on a; the parallel
definition includes coincidence. No external-point assumption is present.

Independent solution:

1. If P lies on a, a itself is a parallel through P by the coincident-line
   clause of N31 block 0. Axiom 41 permits at most one such line, so it is a.
2. If P does not lie on a, draw d through P perpendicular to a. Draw e through
   P perpendicular to d. Both a and e are perpendicular to d, so theorem 40
   gives `e || a`. Since P is not on a, e cannot coincide with a.
3. In either case existence has been established separately. Axiom 41 then
   supplies uniqueness. Combining at least one with at most one gives exactly one.

An independently derived existence route using the other supplied statements
is also available: choose A on a and take O as the midpoint of AP. The line
`H_O(a)` passes through P and is parallel to a by theorem 39. If P is on a,
O is on a and the image line is a itself. Axiom 41 again gives uniqueness.
This is a proof route, NOT a choice alternative.

Dependencies: N31 0 and 16; N32 1; elementary perpendicular existence.
The second route uses N31 3 and midpoint/half-turn facts instead of perpendicular
existence. Theorem 42 is not needed to prove this statement.

Distinction to preserve: "at most one" is not "one and only one"; the P-on-a
case has a genuine solution under the supplied convention.

## Seed 433: simultaneous parallelism to two crossing lines

Written task: can one construct a line parallel to each of two intersecting
lines a and b? Conditions: a and b cross, so they are distinct and nonparallel;
"each" is a simultaneous universal requirement, not a choice of one line.

Independent solution: no. Suppose d were parallel to both a and b. Symmetry
of parallelism gives `a || d` and `b || d`; corollary 3 gives `a || b`.
That contradicts their crossing. Taking d equal to a or b does not evade the
contradiction: either selected line crosses the other and is not parallel to it.

Dependencies: N31 0 for symmetry/complement of crossing; N32 8 for common-
parallel transitivity. An equivalent contradiction is at the crossing P:
both a and b would be distinct parallels to d through P, violating axiom 41.

Distinction: pairwise feasible parallels to one line do not supply a single
parallel to two incompatible directions.

## Seed 434: five relational claims, including degeneracies

Written conditions: a, b, c are lines in the same plane. They are not declared
pairwise distinct; coincident cases cannot be silently excluded.

Claim 1: `a || a`. TRUE. The lines coincide, which is explicitly parallel
by N31 block 0.

Claim 2: if `a || b`, then `b || a`. TRUE. Having no common point is symmetric,
as is equality of the two lines. The argument includes `a = b`.

Claim 3: if `a || b` and `a || c`, then `b || c`. TRUE. By claim 2,
b and c are both parallel to a; N32 corollary 3 applies. This includes
`a = b`, `a = c`, or `b = c`. It does not require three distinct lines.

Claim 4: if `a perpendicular b` and `b perpendicular c`, then
`a perpendicular c`. FALSE as a universal implication.
Perpendicularity is symmetric, so a and c are both perpendicular to b.
Theorem 40 gives `a || c`, not perpendicularity.
An all-distinct counterexample is `a: y = 0`, `b: x = 0`, `c: y = 1`.
Both premises hold, but a and c are disjoint parallels.
A coincident counterexample is `a = c: y = 0`, `b: x = 0`.
Both premises still hold, but a is not perpendicular to itself.
Thus allowing coincidence does not rescue perpendicular transitivity.

Claim 5: if a crosses b and b crosses c, then a crosses c. FALSE as a
universal implication.
The same all-distinct counterexample `a: y = 0`, `b: x = 0`, `c: y = 1`
has both premises, while a and c are disjoint.
The coincident example `a = c: y = 0`, `b: x = 0` has both premises,
while a and c coincide rather than cross.
Crossing is also possible: `a: y = 0`, `b: x = 0`, `c: y = x + 1`
has the premises and makes a cross c at (-1, 0).
Hence the premises alone do not determine which of the three a/c positions
holds. The claim's falsity requires only one valid counterexample, not a
claim that a and c are always parallel.

Complete determination in original order: true, true, true, false, false.
These are source-claim evaluations, not a keyed choice draft.

Dependencies: N31 0 and 16; N32 8; elementary line intersection and
perpendicularity. The decisive distinction is between equivalence-like
parallelism and the failure of transitivity for perpendicularity/crossing.

## Seed 435: parallelism as a relation on plane lines

Written task: decide whether the parallel relation on the set of lines is
reflexive, symmetric, and transitive. The ambient plane and inclusive
definition are carried from the lesson.

Independent solution: all three properties hold.

- Reflexive: every line coincides with itself, so every a satisfies `a || a`.
- Symmetric: `a || b` means equality or empty intersection, each symmetric.
- Transitive: if `a || b` and `b || c`, symmetry gives `a || b` and `c || b`;
  corollary 3 then gives `a || c`. Equal-line cases are included.

Therefore parallelism is an equivalence relation on the set of plane lines.
Its equivalence classes are families of lines of the same undirected direction,
including each line itself. This last description is a derived interpretation,
not an additional input definition.

Dependencies: N31 0; N32 8. It is invalid here to use the different modern
convention "parallel means distinct and nonintersecting" and declare reflexivity
false. Claims 1--3 of 434 are the elementwise version of these same properties
(the common-first-line form of transitivity is converted by symmetry).

## Seed 436: transfer of crossing across parallel lines

Written conditions: `a || b` and b crosses c. Determine a/c's position.

Independent solution: a and c cross in exactly one point.
This is N32 corollary 1 with c as transversal. For a direct proof, if a
and c were parallel (including coincidence), then b and c would be parallel
by symmetry and corollary 3, contradicting b's crossing with c.
The planar line classification leaves only crossing.

Coincident-parallel case: if `a = b`, the conclusion is just the given
crossing, at the same point. If a and b are distinct parallels, c cannot
coincide with either, and its two crossing points are distinct.

Dependencies: N31 0; N32 2 or 8. No claim about the crossing angle's
size is implied, and perpendicular crossing is not ruled out.

## Seed 437: perpendicular to an acute angle side

Written task: prove that a line perpendicular to one side of an acute angle
necessarily intersects its other side. Let the angle be between rays u and v,
with vertex V and measure `0 < theta < 90 degrees`. Let l be perpendicular
to the supporting line of u.

Supporting-line interpretation: v's supporting line is oblique, not
perpendicular, to u's supporting line, since the angle is acute. The
perpendicular l and that oblique supporting line intersect by corollary 2.
Alternatively, if l were parallel to v's supporting line, a perpendicular
to u through V would have to be v's supporting line by axiom 41 and
theorem 40; that contradicts the acute angle. This proves crossing of the
supporting lines.

Ray interpretation WITH perpendicular foot on u: place V = (0, 0), take
`u = {(x, 0): x >= 0}`, and
`v = {t(cos(theta), sin(theta)): t >= 0}`.
If l's foot is (d, 0) on u, then `d >= 0` and `l: x = d`.
The unique intersection parameter is `t = d / cos(theta) >= 0`.
The intersection is
`(d, d tan(theta))`, on v. For d = 0 it is the common vertex.
For d > 0 it is beyond the vertex on v.

Substantive wording boundary: if "perpendicular to a side" only means
perpendicular to its supporting line and imposes NO foot-on-ray condition,
the unconditional claim about intersection with the OTHER RAY is false.
Take theta = 45 degrees, u the positive x-axis, v the ray `(t, t), t >= 0`,
and `l: x = -1`. Then l is perpendicular to u's supporting line but meets
v's supporting line only at (-1, -1), outside v.

Consequently the source is valid under either (i) the usual supporting-line
reading of line-position language, or (ii) a ray reading that requires the
perpendicular foot on the first side. The supplied statement blocks do not
specify which line/ray wording convention is intended. A later choice stem
must make one of those two scopes visible, not quietly assert the false
unrestricted ray claim. This is a wording clarification, not permission to
invent a new geometric premise and hide the change.

The acute hypothesis is substantive: if theta = 90 degrees and d > 0,
l is parallel to the second side's supporting line and does not meet it.
For an obtuse angle and d > 0, `cos(theta) < 0`, so the support-line crossing
can lie on the backward extension of the second ray.

Dependencies: N32 6; elementary angle/perpendicular definitions.
The coordinate calculation is an independent check of the ray boundary,
not a consulted solved example.

## Seed 438: all ten numbered angle relationships

Written conditions: a and b are parallel; c crosses both; fig-208 is provided.
The figure establishes two distinct crossings P and Q, hence `a != b` in
this pictured task even though the general parallel definition permits
coincidence. No numerical angle is given.

Independent core proof:

Let O be the midpoint of PQ. The half-turn `H_O` sends P to Q and fixes c
as a line because O lies on c. By theorem 39, `H_O(a)` is parallel to a.
It also passes through Q. Since b passes through Q and is parallel to a,
axiom 41 forces `H_O(a) = b`; involution also gives `H_O(b) = a`.
Thus O is specifically a center interchanging the two parallel lines.

Theorem 42 supplies the general existence statement for a center between
parallel lines, but does not by itself identify O as the required center.
The preceding theorem-39/axiom-41 argument identifies O rather than assuming it.
Under this half-turn both rays of each angle reverse:
`1 maps to 3`, `2 maps to 4`, `5 maps to 8`, `6 maps to 7`.
Angle preservation gives those four equalities independently of arc marks.

At P, vertical angles give `1 = 5` and `2 = 6`.
At Q, vertical angles give `3 = 8` and `4 = 7`.
At P, a linear pair gives `1 + 2 = 180 degrees`.
These facts settle every requested relationship:

| Original subtask | Exact relationship | Proof dependency and positional type |
| --- | --- | --- |
| 1 | `1 = 3` | Half-turn P to Q; alternate exterior angles. |
| 2 | `1 = 8` | `1 = 3` by half-turn and `3 = 8` by vertical angles; corresponding angles. |
| 3 | `6 = 7` | Half-turn P to Q; alternate exterior angles. |
| 4 | `3 = 5` | `3 = 1` by half-turn and `1 = 5` by vertical angles; corresponding angles. |
| 5 | `4 = 6` | `4 = 2` by half-turn and `2 = 6` by vertical angles; corresponding angles. |
| 6 | `7 = 2` | `7 = 4` by vertical angles and `4 = 2` by half-turn; corresponding angles. |
| 7 | `5 = 8` | Half-turn P to Q; alternate interior angles, matching the footnote. |
| 8 | `2 = 4` | Half-turn P to Q; alternate interior angles, matching the footnote. |
| 9 | `2 + 8 = 180 degrees` | `8 = 1` and linear pair `2 + 1 = 180`; same-side interior angles. |
| 10 | `7 + 1 = 180 degrees` | `7 = 2` and linear pair `2 + 1 = 180`; same-side exterior angles. |

Complete solution system: let alpha be the measure of angle 1. Then

`1 = 3 = 5 = 8 = alpha`,

`2 = 4 = 6 = 7 = 180 degrees - alpha`,

with `0 < alpha < 180 degrees` for crossing lines. The conditions do not
determine alpha numerically. If the transversal is perpendicular to the
parallels, all eight measures are 90 degrees; the ten relationships still
hold, even though that special case is not the drawn appearance.

The full correspondence inventory is `(1,8), (2,7), (5,3), (6,4)`.
The full vertical inventory is `(1,5), (2,6), (3,8), (4,7)`.
These are descriptions of the pictured mathematical positions, not option sets.
The internal alternate pairs are `(2,4), (5,8)` and the external alternate
pairs are `(1,3), (6,7)`. Thus all eight equality claims and both
supplementarity claims are separately accounted for, not collapsed by
counting printed parts.

If a and b coincided, P and Q would coincide and this two-vertex eight-label
figure would no longer be the stated pictured configuration. The later task
must retain the shared figure or explicitly state the distinct-line condition;
it must not extend the pictured labeling silently to a coincident-line model.

Dependencies: N31 3; N32 1 and the meaning of N32 15; elementary midpoint,
half-turn, vertical-angle, and linear-pair facts. No unsupplied parallel-angle
theorem, hidden key, or equality inferred from marks is used.

## Seed 439: exact center counts AND loci, with all line cases

Written tasks: count centers of symmetry of (1) the union of two parallel
lines; (2) the union of three lines, at least two parallel; (3) the union of
two lines. No spacing of three parallel lines and no pairwise-distinct
condition is specified. Under N31 block 0 a repeated line qualifies as a
parallel pair, but a set union removes multiplicity.

A center of a union S means a point O with `H_O(S) = S`. It need not lie in
S. This is different from asking for one particular pair of points' midpoint.

### Independently derived classification lemma

For a finite union of distinct infinite lines, a half-turn permutes those
component lines. Indeed, the image of one component is an infinite line
contained in the union; if it were different from every component, it could
meet each in at most one point, leaving at most finitely many points in
the union, a contradiction.

By theorem 39 a component can be swapped only with a parallel component.
A component fixed as a line requires O on that line.

For parallel lines write a common unit normal n and equations
`n dot X = s_i`. Under `H_O`, the offset becomes `2(n dot O) - s_i`.
Thus invariance is exactly reflection of the finite offset set about
`h = n dot O`. This yields the center LOCUS, not merely a center's existence.

### Subtask 1: two parallel lines

If the two lines are distinct, with offsets s1 and s2, the half-turn must
swap them. This is equivalent to
`n dot O = (s1 + s2)/2`.
Every point of the mid-parallel line satisfies it; no other point does.
There are infinitely many centers (a whole line).
Theorem 42's existence is consistent with this, but does not by itself
give the count.

If the lines coincide with L, their union is L and every point of L is
a center; no point off L is a center. Again infinitely many, but the
center locus is L itself, not a distinct midline.

### Subtask 2: three lines, with a parallel pair

First remove duplicate components and let k be the number of distinct lines.

- k = 1: a single line. Infinitely many centers, exactly that line.
- k = 2, the distinct lines parallel: infinitely many centers on their
  mid-parallel. This includes a third written line repeating either member
  of a distinct parallel pair.
- k = 2, the distinct lines crossing: exactly one center, their crossing.
  This occurs when the designated parallel pair coincides and the third line
  crosses their common line.
- k = 3, exactly two lines parallel and the third crossing them: exactly one
  center. The crossing line must be fixed, so O lies on it; the parallel pair
  must be swapped, so O lies on their mid-parallel. Those two center conditions
  meet at exactly one point. Equivalently O is the midpoint of the third line's
  two intersections with the parallel pair. At that O all three components
  have the required images, proving sufficiency as well as necessity.
- k = 3, all parallel: order the distinct signed offsets as `s1 < s2 < s3`.
  Reflection must swap the outer lines and fix the middle line, requiring
  `2 s2 = s1 + s3`. If the adjacent perpendicular gaps are equal, there are
  infinitely many centers, all points on the middle line. If the gaps are
  unequal, there are zero centers.

Examples establishing the substantive conditionality, not candidate options:
`y = 0, y = 1, x = 0` has the single center (0, 1/2).
`y = 0, y = 1, y = 2` has the entire line y = 1 as center locus.
`y = 0, y = 1, y = 3` has no center.
All three examples meet the written "at least two parallel" condition.
Consequently subtask 2 has NO unique unconditional numerical count.
Its exact mathematical answer is the preceding case classification.

### Subtask 3: union of two lines without a prescribed position

- Coincident: infinitely many centers, exactly the common line.
- Distinct parallel: infinitely many centers, exactly the mid-parallel.
- Crossing: exactly one center, exactly the intersection.

For crossing lines, theorem 39 prevents swapping the two directions.
Both lines must instead be fixed, so their intersection is the only possible
center. A half-turn about the intersection fixes both lines, proving existence.
There is never a zero-center case for the union of only two lines.

Dependencies: N31 0 and 3; N32 15 for the general parallel-pair symmetry
statement; independently proved permutation/offset lemmas and half-turn facts.
No count of centers is inferred merely from theorem 42 or a representative sketch.

Source underdetermination: subtasks 2 and 3 request a count without fixing
all component positions; complete conditional answers resolve the written
tasks. A future demand for one unconditional count would be blocked by the
source, not repaired by assuming distinctness, a transversal, or equal spacing.

## Seed 440: complete angle-and-side determination

Written conditions: quadrilateral ABCD has opposite sides parallel,
angle A = 30 degrees, |AB| = 2 cm, |BC| = 4 cm.
ABCD is the usual nondegenerate quadrilateral in boundary order, so
`AB || CD`, `BC || AD` refer to distinct opposite supporting lines.
Inclusive parallelism does not authorize collapsing it to one line;
in particular the given nonzero 30-degree vertex excludes a collinear collapse.

Independent proof of equal opposite sides/angles, without an assumed
parallelogram length theorem:

Take O as the midpoint of AC. The image of supporting line AB under `H_O`
passes through C and is parallel to AB by theorem 39, so axiom 41 identifies
it with CD. Likewise the image of BC passes through A and is parallel to BC,
so it is AD. Thus B, the intersection of AB and BC, maps to D, the
intersection of CD and AD. A maps to C. The half-turn preserves distances
and angles, so `|AB| = |CD|`, `|BC| = |DA|`,
`angle A = angle C`, and `angle B = angle D`.

Since AD is parallel to BC and AB is their transversal, adjacent interior
angles A and B are supplementary by the result independently derived in
438. Hence `angle B = 180 - 30 = 150 degrees`.

Complete result in boundary order:

| Vertex | Angle |
| --- | --- |
| A | 30 degrees |
| B | 150 degrees |
| C | 30 degrees |
| D | 150 degrees |

| Side | Length |
| --- | --- |
| AB | 2 cm |
| BC | 4 cm |
| CD | 2 cm |
| DA (AD) | 4 cm |

The four angles sum to 360 degrees, an arithmetic consistency check, not
the premise establishing any individual value. All lengths retain cm.
A reflected orientation of the quadrilateral gives the same complete result.
No area, diagonal length, or perimeter was requested and none replaces the
required angle/side determination.

Dependencies: N31 3; N32 1; the independently proved parallel-angle
supplementarity in 438; elementary half-turn distance/angle preservation.
The proof also identifies a center consistent with theorem 42.

## Proposed coherent response units, AFTER all independent solutions

These are task-level proposals only, not stems, alternatives, option keys,
a fixed item quota, or a formal artifact seed. A later formal `prepare.py`
seed is required after the first N32 modern native installation.

| Proposed unit | Written coverage and rationale | Provisional native mode | Concrete capacity loss |
| --- | --- | --- | --- |
| U432 | One full existence-and-uniqueness argument, explicitly distinguishing P on/off a and existence from at-most-one. These are coupled parts of "exactly one", not separate blanks. | single | Cannot demonstrate drawing the parallel or independently producing the two-case proof and construction. |
| U433 | One simultaneous-parallel impossibility judgment with the decisive contradiction. | single | Cannot demonstrate independently devising/writing the contradiction proof. |
| U434-435 | One coherent relation-property suite: all five elementwise claims of 434 plus their reflexive/symmetric/transitive generalization in 435. Their mathematical overlap justifies combination and avoids a redundant re-test of the same three positive claims. Perpendicular/crossing failures remain covered. | multiple, with the property generalization kept substantive | Cannot demonstrate independently formulating definitions, proving each universal property, or constructing counterexamples. A future design that covers only claims 1--3 would omit essential 434 tasks and is unacceptable. |
| U436 | One crossing-transfer implication, including the coincident-parallel case. It is an application of parallelism, not another property-name recall. | single | Cannot demonstrate an independently written proof or drawing both crossing configurations. |
| U437 | One acute-angle perpendicular/oblique intersection argument, with supporting lines OR visible foot-on-first-ray condition, never the false unrestricted ray interpretation. | single | Cannot demonstrate proof production or construction; a wording clarification must be recorded rather than hidden. The unresolved unrestricted ray claim is not eligible as an asserted theorem. |
| U438 | One complete relationship system tied to the shared image, retaining the half-turn pairing, vertical equalities, both equal-measure families, and the two supplementary deductions. All ten source relationships remain represented together because they are consequences of one geometric mechanism, not ten unrelated value slots. | single | Cannot demonstrate producing ten individual proofs or annotating the diagram. Numerical angle determination is unavailable from the source and must not be invented. A relation table without the core geometric inference would lose the source's proof task. |
| U439 | One complete center-count/locus classification across one, two, and three distinct component lines, with deduplication and equal/unequal three-parallel spacing. This unifies the overlap of subtasks 1 and 3 rather than assigning an unconditional number to each printed part. | single | Cannot demonstrate finding/drawing the center locus or independently proving necessity and sufficiency. Single unconditional counts for unspecified cases are unavailable, not valid simplifications. If a readable full classifier needs two units later, split by two-component versus three-component geometry, not by printed count. |
| U440 | One complete boundary-ordered angle-and-side result with its parallelism/symmetry reasoning. Angles and side lengths concern one quadrilateral and are not eight independent clicks. | single | Cannot demonstrate constructing the quadrilateral, deriving the half-turn or proving opposite-side equality unaided. |

All nine written seeds have a complete independent solution. No substantive
claim in 438 is omitted. 439 is solved conditionally rather than assigned a
fabricated unique count. The only unresolved source-wording issue requiring
explicit later treatment is 437's ray/support-line interpretation.
Coincidence and the ambient plane must remain visible or properly inherited.

No new figure is proposed or authorized at this phase. The approved current
fig-208 can be reused unchanged after formal tool preparation binds it.

## Seal and continuation contract

This file is the complete FIRST to be sealed by a separate actual
`chmod 0444`, followed by actual `stat` and SHA-256 commands.
The later report/manifest must bind those observed facts, not a claimed chmod.
Do not amend this file after sealing or re-solve its unchanged sources on
continuation. Reuse this immutable source solving once; any actual input drift
requires explicit affected-only handling, not silent mutation of the FIRST.

The formal tool seed, alternatives, keyed draft, independent review, structural
choice validation, answer production, native installation, and publication
are NOT performed in this phase. The next authorized phase waits for the
formal seed after N32 modern native installation.

Active exec sessions at source-solving completion: `[]`.
