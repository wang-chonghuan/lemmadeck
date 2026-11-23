# N38 Independent SOURCE-FIRST

Outcome: SOURCE_FIRST_ONLY. Owner: Carver, original 188-7 context.
This is an independent source mathematics record, not a candidate, answer-key,
standard, figure-promotion, or whole-lesson publication approval.

## Authority and retained history

Sole working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`

P:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/preparation7`

Only mathematical inputs were P's raw
`artifacts/6-8g/lessons/geo68-c3-s2-n38/{lesson.json,lesson.md,exercises.json}`
and the seven explicitly authorized original PNGs 232-238. The Markdown's SVG
links were not followed. The manifest was hashed, not read as additional content.
The source boundary is `[p0174#1,p0178#9)`: 20 prose paragraphs in 32 prose-list
objects and 18 written exercises, 488-505.

These hashes were obtained before the pause and reused on resumption; no source
freshness, full-package hash, raw-page reread, or new source-fidelity gate ran:

| Input relative to P | SHA-256 |
| --- | --- |
| manifest.json | d81564cf41d32e54238525797e153b05c4de3e990c612937d305f078c81c2109 |
| artifacts/6-8g/lessons/geo68-c3-s2-n38/lesson.json | 85d228b7863c10e57a14d03bc8dc27e3bc6130f6b917745bc398a184d73d75b1 |
| artifacts/6-8g/lessons/geo68-c3-s2-n38/lesson.md | d07149535eda3a18fd4d4234c0e392cf82a0e02e631088251c71205fa160319d |
| artifacts/6-8g/lessons/geo68-c3-s2-n38/exercises.json | 72f5ec00aeac44328f9988db53e0db0720278075edb71699f20f3db3fe42086e |

The previously approved source-fidelity PASS with UNKNOWN, p0175 word-repair
PASS, and p0176 count-metadata recovery PASS are reused as direct human-supplied
facts, not independently reissued approvals.

The 2026-11-23 pause remains historical: no FIRST files then existed or were
sealed; seven originals had been loaded once each, modern previews zero, paid
external calls zero, and all owned commands had exited. The later direct human
resume authorized completing these missing records in the same context.
The prior observations and mathematical derivations below are retained, not
replaced by a fresh blind solve.

The original failed rule-path read is also retained:
`sed -n '1,300p' .agents/skills/ld-s10y-image/references/production-resume.md`
exited 1 with
`sed: .agents/skills/ld-s10y-image/references/production-resume.md: No such file or directory`.
The rule's actual routed file,
`.claude/skills/ld-s10y-lesson/references/production-resume.md`, was then read
successfully and was read again on the explicitly requested resume.
This was a local rule-path failure, not a source or mathematics failure.

## Provenance UNKNOWN and mathematical interpretation

All source-letter glyph/code identities, fine glyphs, and black-bar roles remain
provenance UNKNOWN. In particular, no black bar is interpreted as an equality,
angle, or proof-convention code. Current raw-text labels such as A, B, C, F, M,
N, K, L, and O name mathematical roles in this record, not adjudicated original
glyph encodings. Figure descriptions use topology and placement, not guessed
codes. The three literal `[UNKNOWN:493-2-*]` subpart markers stay unresolved;
their readable equal/greater/less conditions provide the task identities.

The current prose explicitly states triangle sum 180 degrees in theorem 47 and
calls each triangle's sum 2d in theorem 48's proof. Therefore, within this prose,
2d = 180 degrees, d = 90 degrees, and 4d = 360 degrees. This interpretation is
derived from those statements, not assumed from an old glyph convention.

Triangles are nondegenerate: their three interior angles are positive and sum
to 180 degrees. Polygon formulas concern ordinary simple polygons, n an integer
at least 3; the convex proofs require a genuine convex polygon and an interior,
not boundary, point O. Nonconvex extension concerns interior sums, not an
automatic extension of the convex exterior-angle theorem. A standard exterior
angle here is the supplement of its adjacent interior angle; count at most one
selected exterior per vertex when applying the exterior-sum theorem.

## Prose inventory and proof logic

The following lists all 32 raw prose-list objects in source order. Numbers are
inventory ordinals, not replacement source-block identifiers.

| No. | Kind | Source refs | Mathematical role |
| --- | --- | --- | --- |
| 1 | fig | p0174#2 | 232: interior and adjacent supplementary exterior |
| 2 | p | p0174#3 | Convex interior definition; exterior BAG supplements the interior at A |
| 3 | cap | p0174#4 | Caption 232 |
| 4 | p | p0174#5 | Introduces triangle-sum proof |
| 5 | p | p0174#6 | Theorem 47: triangle sum 180 degrees |
| 6 | fig | p0174#7 | 233: numbered angles 1-6 and auxiliary parallel |
| 7 | p | p0174#8 | Angles 1, 2, 3 are triangle interiors |
| 8 | p | p0174#9 | Explicit sum to prove |
| 9 | p | p0174#10, p0174#12 | Through C draw MN parallel AB; extend AC and BC |
| 10 | cap | p0174#11 | Caption 233 |
| 11 | p | p0174#13 | Same-directed ray pairs give angle 1 = angle 4 |
| 12 | p | p0174#14 | Corresponding same-directed pairs give angle 3 = angle 6 |
| 13 | p | p0174#15, p0175#1 | Vertical 2 = 5; adjacent 4+5+6 form straight MCN; conclude sum |
| 14 | p | p0174#16 | Footnote: angle may denote its measure |
| 15 | p | p0175#2 | Corollary 1: a right/obtuse interior leaves two acute interiors |
| 16 | p | p0175#3 | Corollary 2: equilateral triangle has three 60-degree interiors |
| 17 | p | p0175#4 | Corollary 3: exterior equals sum of two nonadjacent interiors |
| 18 | fig | p0175#5 | 234: side continuation at the exterior vertex |
| 19 | cap | p0175#6 | Caption 234 |
| 20 | p | p0175#7 | Both exterior+C and A+B+C equal 180; cancel C |
| 21 | p | p0175#8 | Theorem 48: convex n-gon sum 2d(n-2) |
| 22 | p | p0175#9, p0175#12, p0176#1 | Interior O fan: n triangle sums minus full turn at O |
| 23 | fig | p0175#10 | 235: interior fan, all spokes remain inside |
| 24 | cap | p0175#11 | Caption 235 |
| 25 | p | p0176#2 | Quadrilateral specialization: 4d |
| 26 | p | p0176#3 | Theorem 49: one exterior at each convex vertex totals 4d |
| 27 | p | p0176#4 | n supplementary pairs total 2dn; subtract interior sum |
| 28 | fig | p0176#5 | 236: selected supplementary exteriors |
| 29 | fig | p0176#6 | 237: nonconvex example with internal triangulation |
| 30 | cap | p0176#7 | Caption 236 |
| 31 | cap | p0176#8 | Caption 237 |
| 32 | p | p0176#9 | Nonconvex pentagon splits into three triangles: 6d |

Theorem 47's figure-specific logic is sound on the observed topology. At C the
upper half-plane ray order, left to right, is CM, the continuation of BC beyond
C, the continuation of AC beyond C, CN. These delimit angles 6, 5, 4. Angle 1
at A is between AB and AC; its rays have the same directions as CN and the
AC continuation at C. Angle 3 at B is between BA and BC; its rays have the same
directions as CM and the BC continuation at C. Angle 2 below C is vertical to
angle 5 above C. Thus 1=4, 3=6, 2=5 and 4+5+6=180. This uses prose-defined
relations, not the appearance or count of arc/bar marks.

Corollary 1 follows because the remaining positive sum is at most 90 degrees,
so each remaining angle is less than 90. Corollary 2 additionally needs the
equal-side/equal-opposite-angle fact, then 180/3=60; triangle sum alone does not
establish equilateral equiangularity. Corollary 3 subtracts the same adjacent
interior from two 180-degree sums, so it applies to either chosen supplementary
exterior at that vertex.

In theorem 48 each spoke at an interior O stays inside by convexity. The n
triangles partition the polygon; triangle angles at polygon vertices partition
the original interiors, while the O angles sum to a full turn. Consequently
S=180n-360=180(n-2). The illustration is a seven-vertex instance, not a numerical
restriction on n. Theorem 49 takes one positive supplementary exterior at every
convex vertex and yields E=180n-S=360. The nonconvex pentagon note is supported
by the actual three-triangle partition: the reflex interior is also partitioned,
not replaced by its small outside angle. For arbitrary nonconvex simple polygons
the broader statement requires an internal triangulation; a fan from an
arbitrary point is not justified by the convex proof.

## Actual original-figure basis and counter ledger

All seven PNGs below were loaded in the original, single authorized image batch,
once each. This is retained mathematical structural evidence, not a renewed
crop/source-fidelity review. No images were loaded on resumption. No SVG, source
page, grid, crop, modern figure, unreviewed FigureSpec, or other lesson was opened.

| Figure | SHA-256 | Needed and observed basis |
| --- | --- | --- |
| 232 | d27c7f9fc754bc2e9f761a07ff582b3ee7eed84e2baf160319e97d225f544a42 | Convex six-vertex outline, shaded inside; at the bottom-left role A, two adjacent sides and an opposite continuation of the bottom side establish interior versus supplement. |
| 233 | 9a154605af91a9da0d4ffc8425420a6e56331ab74d26f8d28d6697d8e2397a0c | Triangle base below C, parallel through C, both sides continued above C; numbered-angle placement supplies the 1-6 proof and exercise 491. |
| 234 | 591754f84242a6e0ba18eef352a6acfd6bc9f2f29cc2b8d0c6526338e40788b3 | Triangle has the bottom side continued beyond the bottom-right vertex; marked exterior is adjacent, not a remote interior. |
| 235 | a25712949bf83f2da5a035f26370ca99455bb8918914cc9dc62e89c4e6f97154 | Seven-vertex convex outline and interior hub, with a spoke to each vertex; used only for the n-triangle partition. |
| 236 | ef2a1413c532803c95104ac9f72d40a948da09d0ca374ae83ed1dd68a7cdfcef | Convex five-vertex outline with one side continuation and adjacent exterior sector at each vertex; supports selected-exterior counting, not a claim that all exterior sizes match. |
| 237 | 35cc2da5d1bfb1e6128d655314555f555dc4e807b4e27e744115922ac49afbfe | Five boundary vertices include an inward notch. Internal segments from the notch to lower-left and upper-left roles partition the region into three triangles. The notch is a reflex interior. |
| 238 | 5144e3c7d6b7db54d0ea08d95963e67eb890c310a3b2a342878406ecf5013bfc | Two parallel horizontal lines: A on upper line, C on lower line to the left of A, B between lines and to the right of both; AN and CL point right. A-B-C forms the two sloping sides of the left-opening angle at B. |

PNG paths are P + `artifacts/6-8g/figures/fig-NNN.png`.
The exact paths, one-load records, and mathematical roles are in source-review.json.

Counters retained without reset:

- Original image budget: 7 of 7 used; no original slots remain.
- Assignment image budget: 7 of 8 used; the remaining one is reserved exclusively
  for a later explicitly approved modern figure-238 preview.
- Current image-bearing context: 7 of 24; original batch: 7 of 8.
- Original reopens/crops/SVG loads: 0; modern previews: 0.
- Paid external model/image calls: 0; new image loads on resume: 0.
- No owned background or persistent execution process was started.

## All 18 source tasks and complete solutions

All vertex names introduced below are mathematical role labels. Each solution
uses only the current source request and the retained original observations.

### 488 -- three proportional-angle cases

Request (p0176#11): find the three interior angles, in the printed ratio order,
for (1) 1:2:3, (2) 3:7:8, (3) 1:1:3.
For positive ratio entries r,s,t, the scale is 180/(r+s+t).

1. Scale 30: angles 30, 60, 90 degrees.
2. Scale 10: angles 30, 70, 80 degrees.
3. Scale 36: angles 36, 36, 108 degrees.

Each triple is positive with sum 180, so each is realizable by a nondegenerate
triangle. Ratio order is retained; the third case is not forced to be acute.

### 489 -- corresponding third angles

Request (p0177#1): prove the third angles congruent when two angle pairs in two
triangles are correspondingly congruent.
Label the correspondence A<->A', B<->B', C<->C'. Then
C=180-A-B=180-A'-B'=C'. Equal measures establish angle congruence.
The correspondence must be consistent. This proves neither equal side lengths
nor congruence of the whole triangles.

### 490 -- construction of the three opposite-side parallels

Request (p0177#2): A=25, B=68 degrees in triangle ABC; through each vertex draw
the line parallel to its opposite side and find the new triangle's angles.
First C=180-25-68=87 degrees.

Construct a through A parallel BC, b through B parallel CA, and c through C
parallel AB. Define U=b intersect c, V=c intersect a, W=a intersect b. These
three pairwise intersections are distinct for a nondegenerate ABC and constitute
a triangle. Its vertex-aligned answer is U=25, V=68, W=87 degrees.

An exact verification uses position vectors:
U=B+C-A, V=C+A-B, W=A+B-C. The differences from U to V and W are
2(A-B) and 2(A-C); reversing both original A-vertex rays preserves their angle.
The other two vertices work cyclically. A, B, C are the midpoints of VW, WU, UV,
respectively. Do not replace these angles by arbitrary supplementary line angles.

### 491 -- foundations used by the actual theorem-47 proof

Request (p0177#3): identify the axioms and previously established theorems used
in the source triangle-sum proof.
Required construction/incidence facts are line/side extension and existence of
a parallel through the point C outside AB. The angle-measure facts are a
straight angle of 180 degrees, additivity for adjacent nonoverlapping sectors,
and substitution/addition of equal measures.
The specifically invoked theorem in current prose is the section-37 equality
of angles with respectively same-directed rays; the proof also uses equality
of vertical angles. The parallel construction selects the matching directions.

These yield 1=4, 3=6, 2=5, and 4+5+6=180. Neither the new exterior-angle
corollary nor the new polygon-sum theorem is an earlier premise.
The exact historical axiom names, numbers, and full wording are UNKNOWN because
earlier lessons were not read. No missing historical catalog is fabricated.

### 492 -- can an exterior be smaller than an interior?

Request (p0177#4): decide whether this can happen.
At A the exterior e=180-A=B+C. Hence e>B and e>C: it cannot be smaller than
either nonadjacent interior. But e<A exactly when A>90 degrees.
Thus the literal answer is yes, at the adjacent obtuse vertex; for example
interiors 120,30,30 give adjacent exterior 60<120.
The complete adjacent cases are e<A for obtuse A, e=A for right A, and e>A
for acute A. Omitting adjacency would lose the meaning of the printed question.

### 493 -- definitions and all three readable comparison conditions

Request (p0177#5), part 1: define obtuse, right, and acute triangles.
They have, respectively, one interior greater than 90 degrees, one interior
equal to 90 degrees, or all three interiors less than 90 degrees. Positive
triangle sum excludes two right/obtuse interiors.

Part 2's source marker glyphs remain
`[UNKNOWN:493-2-1]`, `[UNKNOWN:493-2-2]`, `[UNKNOWN:493-2-3]`.
Use their readable conditions, not guessed letters. Let the singled-out angle
be A and the other two B,C.

1. A=B+C: 2A=180, so A=90 and the triangle is right; B,C are acute.
2. A>B+C: 2A>180, so A>90 and the triangle is obtuse; B,C are acute.
3. A<B+C: 2A<180, so only A<90 is established. The triangle's overall type is
   not uniquely determined: (60,60,60) is acute, (40,90,50) is right, and
   (40,100,40) is obtuse. In every example A<B+C.

The third literal condition is genuinely underdetermined for the requested
whole-triangle classification. This is a source-derived logical limitation,
not an accusation about an unseen modern author and not permission to change
"one interior" to "every interior."

### 494 -- universal pair-sum condition

Request (p0177#6): classify a triangle when any two of its interiors have sum
greater than 90 degrees. "Any" applies to all three pairs.
For each angle A, the other pair has B+C>90, hence A=180-(B+C)<90.
The same holds at B and C, so the triangle is acute.
A condition about merely one pair would not suffice.

### 495* -- every pair of altitude lines and internal-bisector lines

Request (p0177#7): two interiors are 60 and 72 degrees; find the smaller angle
between (1) every pair of altitude supporting lines and (2) every pair of
internal angle-bisector supporting lines.
Assign A=60, B=72, C=48 degrees. Let h_A,h_B,h_C be altitudes from their
subscripted vertices and b_A,b_B,b_C their internal bisectors.

| Pair of vertex lines | Smaller altitude-line angle | Smaller bisector-line angle |
| --- | --- | --- |
| A,B | C = 48 degrees | 90-C/2 = 66 degrees |
| B,C | A = 60 degrees | 90-A/2 = 60 degrees |
| C,A | B = 72 degrees | 90-B/2 = 54 degrees |

Altitude supporting lines are perpendicular to their opposite sides, so their
smaller pair angle is min(theta,180-theta) for the corresponding side angle
theta. All source interiors here are acute, giving the first column directly.

For bisectors, their common internal intersection I lies on all three: equality
of distances to the two sides of each of the first two bisected angles implies
equality of distances to the third side pair, and I lies inside the triangle.
In triangle AIB, angle AIB=180-A/2-B/2=90+C/2=114 degrees, so the smaller
supporting-line angle is its supplement, 66. Similarly BIC=120 gives 60 and
CIA=126 gives 54. The three obtuse ray angles 114,120,126 are not the requested
smaller line angles. All six results and vertex pairings are retained.

### 496 -- both isosceles possibilities

Request (p0177#8): an isosceles triangle has an exterior of 100 degrees; find
all three interiors. Its adjacent interior is 80 degrees.

1. If 80 is the apex angle, the equal base angles are (180-80)/2=50:
   apex/base/base = 80,50,50.
2. If 80 is a base angle, the other base angle is 80 and the apex is
   180-160=20: apex/base/base = 20,80,80.

Both are nondegenerate and realizable. These exhaust the possible vertex roles;
the source does not identify which vertex carries the given exterior.

### 497 -- impossibility and the distinct-vertex scope

Request (p0177#9): prove a triangle cannot have two acute exteriors.
For exteriors selected at different vertices, e_A<90 and e_B<90 would imply
A>90 and B>90, contradicting A+B+C=180 with C>0.
Equivalently each acute exterior corresponds to an obtuse adjacent interior.

The usual one-exterior-per-vertex counting convention is essential. If both
supplementary exteriors at a single obtuse vertex are counted separately, they
are two acute geometric sectors with the same measure, so the unrestricted
literal wording is false. The current prose expressly selects one exterior per
vertex in theorem 49. Retain that scope rather than silently counting duplicates.

### 498 -- both printed parts and every equality placement

Request (p0177#10): classify a triangle whose exterior (1) is acute or
(2) equals an interior.

1. e_A<90 implies A=180-e_A>90: the triangle is obtuse.
2. If e_A equals its adjacent interior A, then 180-A=A, so A=90:
   the triangle is right. If instead e_A=B, the exterior relation B+C=B
   forces C=0; if e_A=C, it forces B=0. Both remote-equality branches are
   impossible for a nondegenerate triangle. Therefore the only possible
   equality is to the adjacent right interior, and the triangle is right.

The unspecified interior's vertex must not be silently assumed nonadjacent.

### 499 -- actual figure-238-dependent proof

Request (p0177#11): MN parallel KL in figure 238; prove
angle ABC = angle NAB + angle BCL.
This proof uses the retained actual PNG, not an invented generic zigzag.

Observed source basis: A is on the upper line, C on the lower line to the left
of A, and B is strictly between the two lines and to the right of both. The
rays AN and CL both point right along the parallel lines. At B, BA points
up-left and BC down-left.

Construct through B the parallel to MN/KL and select its left-pointing ray BX.
On this actual configuration BX is strictly inside the ordinary angle ABC.
Thus angle ABC = angle ABX + angle XBC. Reversing both rays of angle NAB gives
the directions BA and BX, hence angle ABX=angle NAB. Reversing both rays of
angle BCL gives directions BC and BX, hence angle XBC=angle BCL. Sum to obtain
the requested equality.

For precise orientation rather than visual angle measurement, choose the x-axis
along AN and CL and write A=(a,h), C=(c,0), B=(b,t). The observed constraints are
0<t<h and c<a<b. Then NAB and BCL are positive acute angles, while ABC is
the positive angle less than 180 containing the negative-x ray. These inequalities
explain why addition, not subtraction or a supplementary-angle replacement,
is valid. MN parallel KL alone without this incidence/order/ray information does
not guarantee the equality for arbitrary point placements.

No original glyph code is inferred by this role assignment. No modern figure
has been approved. A later modern preview may only be compared to this sealed
orientation basis using the remaining single authorized image slot.

### 500 -- four polygon sums

Request (p0178#3): interior sums for (1) 10, (2) 12, (3) 30, (4) 96 sides.
For ordinary simple polygons S=180(n-2) degrees:
1440, 1800, 5040, 16920 degrees, respectively.
Each n is an integer at least 3; regular convex instances establish existence.

### 501 -- four inverse sum calculations

Request (p0178#4): number of sides for sums (1) 1080, (2) 1620,
(3) 3960, (4) 1800 degrees.
Use n=S/180+2, giving 8, 11, 24, 12 sides in printed order.
All four pass the integer n>=3 existence condition.

### 502 -- four equiangular cases, not assumed equilateral

Request (p0178#5): every interior equals (1) 144, (2) 150, (3) 170,
(4) 171 degrees; find the side counts.
For a simple equiangular polygon n*alpha=180(n-2), so
n=360/(180-alpha). The denominators are 36,30,10,9 degrees, giving
10,12,36,40 sides, respectively.
All given angles lie strictly between 0 and 180, and all n are integers at
least 3. Regular convex polygons supply construction/existence witnesses.
Equal angles alone do not require equal sides.

### 503 -- both convex exterior-count impossibilities

Request (p0178#6): prove no such polygon has (1) more than four right exteriors
or (2) more than three obtuse exteriors.
Apply the current convex-polygon convention and choose one exterior per vertex.

1. Five or more right exteriors contribute at least 5*90=450 degrees,
   greater than the full 360-degree exterior sum.
2. Four or more obtuse exteriors contribute strictly more than 4*90=360
   degrees, again impossible, with all remaining convex exteriors positive.

Convexity and distinct selected vertices matter. The printed exercise does not
repeat "convex," but the exterior definition/theorem supplying this argument
does. The subsequent nonconvex note extends interior sums only; it does not
license the same positive-exterior counting argument at reflex vertices.

### 504 -- all five feasibility requests

Request (p0178#7): can a polygon interior sum equal (1) 9180 degrees,
(2) 3600 degrees, (3) 2040 degrees, (4) 11d, (5) 18d?
The necessary and sufficient simple-polygon sum condition is
S=180(n-2)=2d(n-2) with integer n>=3.

1. Yes: n=9180/180+2=53.
2. Yes: n=3600/180+2=22.
3. No: n=2040/180+2=40/3, not an integer.
4. No: n=11/2+2=15/2, not an integer.
5. Yes: n=18/2+2=11.

For each yes, a regular convex n-gon is an existence witness. The d relation
comes from the current prose as recorded above, not an assumed source symbol.

### 505* -- two genuinely different proof constructions

Request (p0178#8): prove (1) triangle sum and (2) convex-polygon sum by methods
different from section 38's given proofs.

1. Use half-turn copies, not the source's two side extensions and numbered
   vertical-angle construction. For nondegenerate ABC, let D be midpoint AC
   and E midpoint BC. Half-turn the whole triangle about D, sending A to C,
   C to A, and B to a new point X. Half-turn the triangle about E, sending
   B to C, C to B, and A to a new point Y. Rigid half-turns preserve angles:
   angle XCA=A and angle BCY=B, while the original angle ACB=C.
   In position vectors X=A+C-B and Y=B+C-A, so CX=A-B and CY=B-A are opposite
   rays. On the side of XY containing A and B, the successive rays are
   CX, CA, CB, CY. Their three adjacent sectors fill a straight angle:
   A+C+B=180 degrees. This uses half-turn isometry, midpoint construction,
   straight-angle measure, and sector additivity; it does not assume triangle
   sum or the exterior corollary being proved. The derived line XY happens
   to be parallel AB, but the construction and proof are not a renaming of
   the source's MN/side-extension/vertical-angle argument.
2. For a convex n-gon with boundary vertices V1,...,Vn, draw diagonals from
   V1 to V3,...,V(n-1). Convexity keeps all n-3 diagonals internal and yields
   exactly n-2 triangles V1,Vi,V(i+1), i=2,...,n-1. Their vertex sectors
   partition precisely the polygon interiors, without an additional interior
   point or a full-turn subtraction. The sum is therefore 180(n-2)=2d(n-2).
   For n=3 there are zero diagonals and one triangle. An arbitrary nonconvex
   polygon cannot be assumed to admit this particular fan.

## Source-derived limitations and handoff boundary

No provenance UNKNOWN was classified as a mathematical error or repaired.
The definite logical underdetermination is 493's single-angle less-than case.
The important literal scope qualifications are adjacency in 492/498,
distinct selected exterior vertices in 497, convex exterior counting in 503,
and actual incidence/ray order from figure 238 in 499. The historical axiom
catalog requested in 491 remains provenance UNKNOWN, with the complete
mathematical dependency list retained.

All 18 written tasks, constructions, proofs, printed subparts, and expanded
cases are covered. No essential figure observation is missing from the retained
history; no new source-image load or substitute worker was needed.

After sealing, stop at SOURCE_FIRST_ONLY. Await the parent before any candidate
disclosure/comparison. No candidate/standard/answer/choice approval, modern
figure gate, source re-solving/reopening, DB, Git, deployment, paid call,
producer, shared-tool invocation, message, timer, or other lesson is authorized
by this record.
