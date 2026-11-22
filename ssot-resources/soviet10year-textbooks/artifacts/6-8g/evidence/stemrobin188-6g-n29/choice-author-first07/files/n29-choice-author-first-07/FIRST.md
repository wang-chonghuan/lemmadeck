# FIRST: independent source solving, before alternatives

Scope: AUTHOR_ONLY, SAME188-6, N29, continuous OFFLINE, finish=review.
Written sources: canonical modern geo68-c2-s4-n29, exercises 364--372.
Seed canonical SHA-256:
`a2e92cf7a7f551c8d5bf20b38d484f51bee1ad411624f7004a4f23260ac2e898`.
This document contains no alternatives, option IDs, correct sets or borrowed
solutions. No answer/interactions/old-choice/review/install/parent solution
output has been consulted. No source image is required or loaded.

The seed contains actual statement blocks 5, 7, 10, 11, 15, 17. No proof block
or worked example is a concept. The inspect inventory is not a solution source.
Line-circle tangency is the one-contact situation; statements 35 and 37 give
the perpendicular-radius criterion in both directions.

The source does not state an acute-angle restriction or an angle-range
convention. Angle sides are rays, not whole supporting lines. The solution
methods below retain a ray-membership filter and therefore do not depend on
guessing whether the book's word "angle" includes a straight or nonconvex angle.
Those cases are conditional geometric checks, not invented textbook conventions.
Lengths used as radii are positive; a zero-radius point is not a circle.

## 364: classify all three positions

Task: determine the circle-line relationship for center-to-line distance
greater than, smaller than, and equal to r, in that printed order.

Independent solution: if h>r no point of the line belongs to the circle
(statement 5). If h<r there are two intersection points (statement 11), so the
line is a secant. If h=r there is exactly one intersection (statement 7), so the
line is tangent. Thus the complete ordered classification is disjoint, secant,
tangent, with intersection counts 0, 2, 1. The line is infinite; truncating it
to a segment would invalidate the inference. The radius is positive and the
equality case must not be grouped into a strict inequality.

Distinction: distance comparison controls the full classification, not three
independent answer slots. No source task is blocked.

## 365: both constructions on the two rays

Task 1: on each angle side find all points at distance a from O.
Task 2: on each side find all points at distance a from the interior point M.

Task 1 solution: construct the circle (O,a), a>0. Its intersection with each
ray is its single point at ray parameter a. If the rays coincide the two
descriptions identify the same point; no unsupported two-distinct-point claim
is needed. The ray's opposite extension is not another allowed solution.

Task 2 solution: construct (M,a), intersect it with each supporting line, and
retain exactly the points on the actual ray, including its endpoint when it
satisfies the equation. This gives every solution and only solutions.
For a complete existence/count check, let u be a unit direction of a side,
m=(M-O).u, h the perpendicular distance of M from its supporting line, and
write P=O+t*u. Then MP^2=(t-m)^2+h^2. If a<h there are no line roots. If a=h
the one root is t=m; it is admissible only when m>=0. If a>h, the two line
roots are t=m +/- sqrt(a^2-h^2); keep each root with t>=0. There may be 0, 1 or
2 admissible points on an individual ray. A point on both sides, such as O
when a=OM, is counted as one geometric point in the union.

Neither M being "interior" nor a<h/a>h alone places the foot on a ray:
in an obtuse convex angle an interior M close to the opposite side may have
negative projection on a side. In a nonconvex region this issue is even more
apparent. No generic acute-angle premise is used. Example for checking the
logic, not a source datum: with O=(0,0), one ray the positive x-axis,
M=(-1,1), a=6/5, h=1<a, both supporting-line roots
-1 +/- sqrt(11)/5 are negative, so that ray has no solution.

Distinction: locus intersection plus ray filtering, including the endpoint;
the vertex-centered and interior-point-centered tasks remain accounted for.
Loss in a choice response: the learner will not actually draw either circle
or physically enumerate intersections. The full construction can be recognized.

## 366: radius-fixed tangent circles at the prescribed point

Task: construct every circle of positive radius r tangent to line a at M.

Any center C must satisfy CM perpendicular to a by statement 37 and CM=r
because M lies on the circle. Construct the perpendicular to a through M and
mark its two points C+ and C- at distance r from M. The circles (C+,r) and
(C-,r) are tangent at M by statement 35. Necessity restricts every solution
to these two points, so this is the entire solution family, one circle on
each side of the infinite line. Choosing a center on a gives a secant instead.

Distinction: prescribed contact determines the normal; prescribed radius
determines two centers. No source task is blocked. Drawing production is lost.

## 367: tangent through a point already on the circle

Task: construct the tangent at a given circle point P.

Join its center C to P. Construct through P the line perpendicular to CP.
Statement 35 proves it is tangent. Statement 37 requires every tangent at P
to be perpendicular to CP, and the perpendicular through a point is unique.
Hence the construction is complete and unique. A perpendicular through C
is not a substitute for a perpendicular through the contact point.

Distinction: which point the perpendicular passes through. No source task is
blocked. Constructing the line is not demonstrated by choosing its description.

## 368: tangent to both rays, first free and then through a side point

Let the given rays be R1 and R2 with vertex O, their supporting lines L1,L2.
For a proposed center C, construct its perpendicular feet H1,H2 on L1,L2.
The necessary and sufficient condition for a positive-radius circle to be
tangent to both original rays is

    d(C,L1)=d(C,L2)=r>0, H1 in R1, H2 in R2.

Necessity follows because each circle-line tangent has its foot as contact
(statement 37). Sufficiency follows from statement 35 at each foot. Equality
of distances alone is a supporting-line result and does not settle ray contact.

Task 1 construction: use equal-distance loci of the supporting lines, retain
only candidate centers with positive common distance and both feet on the
rays, and use that common distance as radius. For two distinct noncollinear
rays with smaller separation delta in (0,pi), the equal-distance lines are
the two bisectors of the supports. Of their four directions, only the
bisector ray in the smaller sector has nonnegative projections on both ray
directions. Choose any point C other than O there and drop a perpendicular
to either side. This works for an obtuse smaller sector as well as an acute
one. If the named angle is nonconvex, that ray may be outside its named
interior: the source asks tangency to sides, not containment of the disk in
the named interior. The negative bisector direction has both feet behind O;
the other bisector directions have opposite-signed projections.

Conditional straight-angle check: for opposite collinear rays, L1=L2 and
both ray tests force the common foot to be O. All nonvertex points on the
perpendicular through O are centers, with arbitrary positive distance to O
as radius. The contact is O on each ray. For coincident rays, should an
angle convention admit them, the universal foot condition still works; the
noncollinear bisector classification is not asserted.

Task 2: let T be the given point of R1. Because the circle passes through T
and is tangent to R1's supporting line, its unique contact there must be T.
Thus intersect the perpendicular through T to L1 with the equal-distance
locus, keep positive-distance centers, and check the second foot lies on
R2. Every retained center yields a circle (C,CT), and necessity excludes all
others. For distinct noncollinear rays and T!=O this gives a unique center
on the smaller-sector bisector. If t=OT, then OC=t/cos(delta/2) and
r=t*tan(delta/2)>0, with the other contact at ray parameter t. These are
derived relationships, not required extra data.
For those rays with T=O no solution exists: CO cannot be perpendicular to
two different supporting lines. For opposite rays, T=O gives the arbitrary
family on the perpendicular; T!=O gives no solution because the common
foot cannot be on both opposite rays. This also explains why a "unique
circle for every side point of every angle" claim would be unjustified.

Distinction: equal distance plus admissible feet, and fixing a side point
fixes the contact rather than only fixing a distance. Both tasks are solved;
there is no global HOLD arising from missing angle-range conventions.
Actual construction and visual inspection of the resulting circle are losses.

## 369: exact locus of centers with all boundaries retained

Task: find the entire center set for circles tangent to both angle sides.

The set is exactly

    {C: d(C,L1)=d(C,L2)>0 and both perpendicular feet belong to R1,R2}.

This uses the same necessary/sufficient tangent criterion as 368 but is a
different mathematical task: completeness of a locus, rather than producing
one circle or constraining it through T. For distinct noncollinear rays this
is the smaller-sector bisector ray with O excluded, not either whole
supporting-line bisector. The vertex is excluded by r>0. For opposite rays
the set is the whole perpendicular to their common line through O, with O
removed. Nonconvex named interiors do not change the two ray sets and hence
do not change the locus. Coincident-ray cases are covered by the intrinsic
foot condition without asserting an absent textbook convention.

Distinction: complete set with necessity, sufficiency and boundary exclusion.
No source task is blocked. Writing/drawing a locus and its own proof is lost.

## 370: concrete local HOLD, with conditional independent work preserved

Task: decide whether two circles tangent at A have a common tangent through A.

Available-source limitation: the selected lesson defines tangency of a LINE
and a circle and gives radius-perpendicular theorems. Its allowed concept
paragraphs do not define tangency of TWO circles, or state the centers/contact
collinearity rule. The exercise uses that term without supplying the rule.
No preceding lesson, answer, parent solution, old choice or install evidence
is being read to fill this specific gap.

Conditional solution, explicitly not an unconditional source resolution:
if "two circles tangent at A" means two distinct noncoincident circles whose
only common point is A, their centers C1,C2 and A must be collinear. Indeed,
if A were off C1C2, reflection in C1C2 would fix each center and preserve both
radii, giving a distinct second common point A'. This contradicts single
contact. The perpendicular to the center line through A is then perpendicular
to both contact radii, so statement 35 makes it tangent to each circle.
This works for internal as well as external contact and is unique. Coincident
circles are not covered by the distinct/single-contact premise.

Disposition: HOLD only exercise 370's unconditional question until an actual
allowed circle-circle tangency definition or equivalent statement is supplied.
Do not silently put the conditional premise into a learner question and call
it full source fidelity. Seed and this conditional derivation remain available;
no keyed draft item is fabricated for 370. This does not block the other eight.

## 371: circle tangent to three finite triangle sides

Task: construct a circle tangent to each actual side segment, not extensions.

For a nondegenerate triangle ABC construct its internal bisectors at A and B,
and let I be their intersection inside the triangle. Its equal distances to
AB,AC follow from the first bisector, and to BA,BC from the second, so all
three perpendicular distances equal r>0. The circle (I,r) is tangent to the
three supporting lines by statement 35.
The feet are strictly on the segments: at either endpoint of AB the line to
I makes half the triangle's interior angle, which lies in (0,90 degrees).
Therefore I projects forward from A along AB and forward from B along BA,
placing the foot strictly between A and B. The same argument works for the
other two sides, including obtuse triangles. Thus this circle is the incircle.

Completeness/uniqueness: any circle tangent to the two sides meeting at A has
a center on the admissible smaller-sector bisector ray at A (368's foot
argument). The corresponding condition at B requires its center on B's
internal bisector ray. Their unique intersection is I. External-bisector
centers only produce excircles tangent to extensions of two sides; they do
not satisfy all three finite-segment contacts. Perpendicular bisectors yield
a circumcircle through vertices, not the requested side tangencies.

Distinction: internal angle bisectors and common line distance, with segment
admissibility, not vertex-distance or arbitrary equal-distance constructions.
All source tasks solved. Actual compass/straightedge production is lost.

## 372: prove closest-point perpendicularity without borrowing theorem proof

Task: from O in p, A not in p, and AO<=AB for every B in p, prove AO perpendicular p.

Construct the perpendicular from A to p and call its foot H. This construction
does not assume the closest-point claim. If H!=O, AHO is a right triangle at H
and the Pythagorean theorem gives AO^2=AH^2+HO^2>AH^2, hence AH<AO. Since H
lies on p this contradicts O being a nearest point. Therefore H=O and AO is
perpendicular to p. A not in p gives AH>0 and avoids a degenerate zero segment.
If the nearest-point phrasing does not assert uniqueness, the same strict
comparison proves uniqueness. We do not invoke theorem 32 as a black box or
repeat the visible candidate proof of theorem 37, whose prerequisite includes
the nearest-point theorem.

Distinction: construct a perpendicular foot, use a strict hypotenuse comparison,
and contradict minimality; membership O in p alone does not prove perpendicularity.
No source task is blocked. Choosing the proof does not demonstrate writing it.

## Source completeness and next-stage boundary

Nine sources examined: eight fully solved, one concrete local definition HOLD.
Tasks within 365 and 368 are both solved; there is no dropped printed subpart.
No figures, generated diagrams, network, database, paid call or publication.
Next action is real chmod 0444, stat and raw hashing of this exact FIRST file,
before writing the draft. Only structural validation without review is allowed.
No semantic approval, retention, promotion, finalization or course completion.
