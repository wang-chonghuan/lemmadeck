# N29 Author Reasoning

AUTHOR_ONLY. These are the producer's derivations, not an independent review or a
gate decision. The exact lesson, prompt and answer file bindings are generated in
Report.json and author-checks.json. All image, PDF, network, paid-call, backend,
database, publication and child-session usage is zero.

## Scope And Source

Only N29, geo68-c2-s4-n29, modern-us-neutral, exercises 364 through 372.
The supplied prepared record and both prepared templates were hash-checked before
copying. Sealed copies are separate byte-identical read-only files; only candidate
copies were edited. The embedded raw source objects remain unchanged.

The supplied instruction identifies installed db613601/corresponding093a4baa as
authority. Neither that installed authority nor shared/core sources were modified
or replaced. This assignment does not rerun any producer or native answer stage.

The optional canonical bookanswers.json and answers.json for 6-8g do not exist in
this checkout. All nine answers are newly derived; no bookRaw is fabricated.

Relevant textual source definition only: canonical pages 0051 and 0052 define an
angle using two rays and either region they bound, expressly include nonconvex
angles, and expressly include a straight angle. No page image or PDF was opened.
The earlier attempted angle lookup at pages 0041/0042 used the printed-page
location without the ten-page offset and was not used as mathematical evidence.
Those unrelated exercises were not solved, reviewed, changed or copied.

## Wording

- The 23 original blocks, including all figure and caption slots, remain in order.
  No modern figures are produced or approved. Figure slots are evidence of future
  work, not delivery of an image. The nine exercise figure_refs remain empty.
- The lesson keeps the original h>r, h=r, h<r sequence. Figure 187's Cyrillic
  а/б/в identities are kept literally and retain that correspondence.
- Exercise 364 separately keeps its original greater, less, equal sequence.
- Chinese punctuation is outside math; math-span contents and ordering are
  preserved exactly within each source paragraph and exercise.
- Part prefixes and each 1), 2), 3) item occupy separate lines.
- section_breaks are exact boundary objects from the existing prose_flow.mjs
  output, not manually calculated paragraph indices.
- Prepared visible prefixes 35, 36 and **37** are retained exactly as prefixes,
  without resolving their unknown black-printing-marker identities, converting
  them into new theorem IDs, or adding invented source readings. Any printing
  marks already removed by preparation are not reconstructed.
- Native figure 189's damaged labels stay unresolved. No figure data was opened.

Source wording defect at p0136#3: a nearest point is not "any point" of a line.
The original parenthesis conflates these claims. The candidate instead states
that the nearest distance already exceeds the radius, so all other distances do
too. This is an explicit source-logic note, not a silent mathematical erratum;
source_text, source.data, source_refs, formulas and errata remain unchanged.

The proof at p0137#4/p0137#7 needs the earlier three-case conclusion to infer that
other points on a tangent are outside the circle; a unique intersection alone is
not the stated justification. The candidate names the earlier cases without
adding a hypothesis or changing a formula. Its source reference to theorem32
is retained; the new solution of 372 does not rely on that theorem.

## Common Ray Lemma

Tangency to an angle side means tangency to its supporting line with the actual
contact point on the closed ray. Merely intersecting a ray at one point when the
supporting line is a secant is not tangency. All circles have positive radius.

For two noncollinear rays, no tangency contact can be their vertex: a circle
through that vertex and tangent to the other supporting line would have to touch
it at the same vertex too, contradicting uniqueness of the tangent there.
Let C be a center and T1,T2 its forward contact points. The right triangles
OCT1 and OCT2 have the same hypotenuse and equal radii, so are congruent.
Their angles at O are equal and acute since their feet are forward. Thus OC is
the bisector ray of the smaller sector, not a whole line, its opposite ray or the
other supporting-line bisector. Conversely a nonvertex center on this smaller
bisector has two equal positive perpendicular distances and both feet forward.
This gives necessity and sufficiency without assuming the chosen angle is convex.

For a straight angle the supporting lines coincide but the two closed rays meet
only at O. Both contact points must therefore be O. The centers are exactly the
perpendicular through O, with O removed; either side of the line is allowed.
Coincident rays do not bound two regions in the source definition and are not
introduced as an additional problem. No requirement of distinct contact points
or containment inside the selected angle is added.

## Exercise Derivations

### 364

By the lesson's distance trichotomy, the source-ordered intersection counts are
0, 2, 1. These correspond to no intersection, intersection and tangency.
The numeric parts expressly say "交点个数"; displayAnswer retains the full
positional description. Actual input/interaction behavior is not validated at
this author-only stage and remains for independent review and later native work.

### 365

For positive a, intersect each closed ray with the circle of radius a about the
specified center. This is both a construction and a complete locus argument.

For the M-centered circle consider one supporting line. Let H be the perpendicular
foot, d=MH and b=MO. If H is strictly forward at distance q=OH>0, points at equal
distance a from M on the line are symmetric about H. For a>d their distance from
H is t with t*t=a*a-d*d, while b*b=d*d+q*q. Thus t<q, t=q, t>q respectively mean
a<b, a=b, a>b: two forward intersections, the vertex plus one forward
intersection, or one forward and one backward intersection. At a=d the single
point H is retained; at a<d there is no line intersection. These identities are
author evidence only, not an advanced algorithm prescribed to the student.

If H=O or is behind O, distance from M increases strictly along the forward ray
starting at b. Hence the ray has no point when a<b, only O when a=b, and one
forward point when a>b. A reflex angle's interior M may have a backward foot;
the candidate does not wrongly apply only the full-line h versus a comparison.

Zero distance is a point-locus problem, not a zero-radius circle. Part1 gives O;
part2 cannot give M since M is strictly interior, not on a boundary ray.
Negative distance gives no points. Duplicate vertex membership is not a second
distinct point. Straight angles are covered by the same per-ray rules.

### 366

The tangent-radius perpendicular condition forces the center to be on the
perpendicular through M, at distance r from M. For r>0 there are precisely two
such centers, one in each half-plane. Both circles have the required tangent,
which proves sufficiency as well as completeness. Nonpositive r gives no circle.

### 367

Through the given point on a nondegenerate circle there is exactly one
perpendicular to its radius. Tangent-radius necessity and sufficiency make this
the unique solution. If the center is not marked it can be constructed from two
nonparallel chord bisectors, so the answer does not add a known center as a new
given or depend on an unseen diagram.

### 368

Part1 applies the common ray lemma: every positive position on the smaller-sector
bisector gives one circle, so infinitely many circles. Part2's known P belongs
to one ray. Since a tangent supporting line meets the circle once, passage
through P forces P to be that contact point. For P not equal to O, its
perpendicular intersects the forward smaller-sector bisector once: the half-angle
is acute, so this intersection is forward and its radius is positive.
The common ray lemma gives the other forward contact and excludes other centers.
For noncollinear sides and P=O there is no solution.

For the source-allowed straight angle, the common contact must be O. Part1 has
infinitely many centers on its nonzero perpendicular. Part2 has infinitely many
when P=O, none when P differs from O. A circle tangent at O cannot also meet the
supporting line at P. No larger-sector containment premise is present in the text.

### 369

The common ray lemma gives a necessary and sufficient locus, not just an
equidistance heuristic. For noncollinear rays it is one open-at-vertex bisector
ray. The other line bisector has one backward foot, and the reverse smaller
bisector has both feet backward. For opposite rays it is a punctured full
perpendicular through the vertex. A vertex may be a contact point for a straight
angle but cannot be a positive-radius circle center.

### 370

Distinct tangent circles have distinct centers; equal centers give disjoint or
coincident circles, not exactly one common point. Reflect their common point A
in the line of centers. If A were off the line, its distinct mirror would be a
second common point, contradiction. Thus both radii at A lie on that line.
The perpendicular at A is tangent to both circles and is unique.
The reasoning applies to both internal and external tangency and does not assume
that A is between the two centers.

### 371

For a nondegenerate triangle, an internal bisector from A meets the opposite
segment BC at an interior point X, and one from B meets AC at an interior point Y.
The segments AX and BY cross in the triangle's interior: B and Y lie on opposite
sides of the first bisector, and the intersection lies on both interior segments.
Call the crossing I. Its equal distances to AB and AC, then to AB and BC, make
all three line distances equal and positive. Since I is inside the angle at C,
it is on C's internal bisector as well.

Each foot is forward from each endpoint of its edge by the acute-half-angle
condition. It is therefore in the actual finite edge's interior, not merely on
the edge line. The equal-distance circle has all three required contacts.
Any other admissible circle has contacts on both forward rays at every vertex;
the common ray lemma forces its center onto both internal bisectors, hence I.
Its radius is forced too. An excircle cannot satisfy all three finite-segment
contacts and is excluded. A collinear triple is not a triangle input here.

### 372

Construct the perpendicular from A to p at H, without assuming any distance
minimization. If the claimed nearest point O differs from H, reflect A in p to
A'. The triangle AA'O is nondegenerate and strict triangle inequality gives
AA' < AO + OA' = 2 AO. Since AA'=2 AH, this forces AH<AO with H on p, contradiction.
Thus O=H and OA is perpendicular to p. This proof uses only reflection, basic
perpendicular construction and strict triangle inequality, never the converse
nearest-point theorem, tangent theorem or the lesson's citation of theorem32.

## Producer Diagnostics

The first local immutable/formula check detected that the initial wording of
364 omitted repeated math spans a and O. The candidate was corrected locally
with apply_patch to restore the exact formula sequence. No source bytes changed
and no preparation stage was repeated. The first assertion failure is retained
as a diagnostic in Report.json, not interpreted as mathematical review.

The first ownership-path inventory found that the dedicated output directory
did not yet exist; it was then created within the authorized scope. A lookup of
a nonexistent modern.py file was corrected to the actual edition.py string-array
convention. These were read-only lookup diagnostics, not formal holds.

No independent reviewer was launched, no self-approval was issued, and no whole
lesson/image approval is claimed. Text review and answer-key review are pending.
