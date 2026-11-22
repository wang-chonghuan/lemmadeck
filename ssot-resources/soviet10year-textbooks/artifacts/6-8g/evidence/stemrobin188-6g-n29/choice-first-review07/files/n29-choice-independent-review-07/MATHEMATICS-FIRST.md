# Independent visible-option mathematics, key not yet read

This uses the sealed source FIRST and the visible candidate options only.
Complete predicted correct sets, in candidate order:

- n29-distance-classification: B
- n29-points-on-rays: A,B,D
- n29-fixed-radius-contact: C
- n29-tangent-at-point: A
- n29-two-ray-construction: A,B,D,E
- n29-center-locus: B
- n29-finite-triangle-incircle: D
- n29-nearest-point-proof: C
- n29-written370-common-tangent-definition-07: a

## Every alternative

### n29-distance-classification

A incorrect: h>r gives x^2=r^2-h^2<0, not two roots; h<r gives two
roots, not zero. This is reversal of the outside/inside distance comparisons.
B correct: h>r -> zero; h<r -> two; h=r -> one. The order is exactly
the visible order and includes h=0 in the middle case.
C incorrect: h<r is secancy, not tangency; h=r is tangency, not secancy.
D incorrect: equality gives the perpendicular foot as a common point, not none.

### n29-points-on-rays

A correct: every forward ray has the unique point at positive distance a
from O, obtained by intersecting the O-centered circle.
B correct: the M-centered circle is the distance-a locus; intersections with
the supporting line followed by nonnegative-ray filtering yield exactly the
desired points, including the endpoint.
C incorrect: e.g. positive coordinate-axis rays, M=(1,1), a=2. Distance
to each supporting line is 1<2, but x-axis roots 1+/-sqrt(3) contain only
one nonnegative root. Zero is also possible with an obtuse angle and a
negative projection: M=(-1,1), a=1.1, positive x-axis, other ray at 150
degrees. Both roots -1+/-sqrt(0.21) are negative. The line count is not
the ray count.
D correct: if a=|OM| then O lies on the circle centered at M, and the
vertex belongs to each ray. It is one shared geometric point, not two
distinct points in a union; the option does not claim distinctness.
E incorrect: positive coordinate-axis rays, M=(1,1), a=1.2<sqrt(2)=|OM|.
On each side roots 1+/-sqrt(0.44) are both positive, so four distinct
ray points exist. Comparing a with OM alone does not decide side existence.

### n29-fixed-radius-contact

A incorrect: centers on a have distance 0<r to a; each circumference is
secant to a, not tangent at M.
B incorrect: M is the circle's center, not a circumference point for r>0;
a through M is a diameter line.
C correct: the two centers on the perpendicular through M, at distance r,
have radius to M perpendicular to a; necessity of that condition excludes
every other center. Exactly two circles, both sides retained.
D incorrect AS AN ANSWER TO "ALL": yields one valid tangent circle but
omits its opposite-side counterpart. It is not rejected as individually
nontangent; the complete-set quantifier makes the option false.

### n29-tangent-at-point

A correct: line through P perpendicular to nonzero CP is the unique tangent.
B incorrect: the parallel line through C does not contain P, since CP is
nonzero and perpendicular to that line; it also passes through the center.
C incorrect: CP's full line is a secant diameter line.
D incorrect: at 45 degrees, center-to-line distance is r*sin(45)=r/sqrt(2)<r,
so the line intersects the circle twice, including P, and is not tangent.

### n29-two-ray-construction

A correct: equal positive supporting-line distances give a positive radius;
both feet on the actual rays give both required ray tangencies. Necessity is
also true, though this option only states a construction conditional.
B correct: because T belongs to the first side and to a circle tangent there,
T must be its contact point. CT perpendicular to L1 is therefore necessary.
Equal second-line distance to CT and forward second foot are necessary and,
with the visible positive-radius condition and T on the first ray, sufficient
for the circle centered at C with radius CT. No first foot is silently lost:
it is T. The option does not promise a solution for every T.
C incorrect: for positive coordinate-axis rays C=(1,-1) has both distances
1; the y-axis foot (0,-1) is not on the positive y-ray. Tangency to both full
lines does not imply tangency to both rays.
D correct: distinct supporting lines through O are nonparallel. A circle
through T=O tangent to both would need CO perpendicular to two different
lines; no nonzero vector can do so. Radius zero is disallowed. This assertion
does not cover opposite rays, whose supporting line is the same.
E correct: opposite rays share only O; any C!=O on the perpendicular at O
has positive radius CO and sole line contact O, which belongs to both rays.
There are infinitely many such circles. This explicitly handles straight angles.

The criterion in A/B works also for reflex and coincident rays. It never requires
C to be inside the specified angle. For reflex rays it selects the smaller
complementary-angle center branch; for opposite rays only the shared contact O;
for coincident rays it retains every forward-foot center off the common line.

### n29-center-locus

A incorrect: C=(1,-1) for positive coordinate-axis rays is equidistant
but its second foot is behind the second ray's origin.
B correct: tangent-radius necessity forces equality of both distances to the
positive radius and both contacts onto the rays; conversely the given
predicate constructs a circle with those two tangent contacts. This is a full
necessary/sufficient set, including straight/reflex/coincident conventions.
C incorrect: C=(1,2) for positive coordinate-axis rays has both feet
(1,0),(0,2) forward and both distances positive, but the distances are 2
and 1. No single positive radius can be both simultaneously.

### n29-finite-triangle-incircle

A incorrect universally: circumcenter construction gives a circle through
vertices, so AB has two circle intersections A,B, not a tangent contact.
B incorrect: A-internal/B-external intersection is the A-excenter. In the
3-4-5 triangle A=(0,0), B=(4,0), C=(0,3), it is (6,6). Its AB foot
is (6,0), beyond B; AC foot is (0,6), beyond C. Tangencies to supporting
lines do not meet the three finite-side requirement.
C incorrect universally: in that same triangle centroid G=(4/3,1) has
distance 1 from AB and 4/3 from AC. Radius 1 cannot touch AC.
An equilateral triangle would be a special success, insufficient for "every".
D correct: two internal bisectors intersect at the incenter, equidistant
from all three lines with feet inside the corresponding finite sides; the
common distance gives the incircle for every nondegenerate triangle.

### n29-nearest-point-proof

A incorrect: with H!=O the right angle is at H; AO, not AH, is the
hypotenuse. Also AH>AO would be consistent with O being nearer, so the
claimed contradiction is unsupported.
B incorrect: membership H,O in p does not give equal distances to A.
With A off p and H the foot, H!=O implies strict AH<AO.
C correct: if H!=O, Pythagoras gives AO^2=AH^2+HO^2>AH^2,
contradicting AO<=AH from minimality. Thus O=H, giving AO perpendicular p.
D incorrect as a proof: O in p alone does not force AO perpendicular p
(p the x-axis, A=(0,1), arbitrary O=(1,0)). The indispensable minimization
premise is not used. The conclusion is true under the full premises, but this
stated reason does not establish it.

### n29-written370-common-tangent-definition-07

a correct: S13 external h=r1+r2 makes A between centers by triangle-
inequality equality; internal h=r1-r2 makes the smaller center between the
larger center and A. Both put O1,A,O2 on the same line. The unique full
line through A perpendicular to it is perpendicular to both radii and hence
tangent to both circles. O1!=O2 follows from genuine single-point tangency.
b incorrect: internal tangency has centers on the same side of A but still
has the common perpendicular tangent. Between-centers ordering is not necessary.
c incorrect: external tangency has centers on opposite sides of A but still
has the same perpendicular tangent. Same-side ordering is not necessary.
d incorrect AS A WHOLE: the both-case existence claim is true, but the line
of centers passes through each center and is a diameter secant, not a tangent.
Each positive-radius circle has another antipodal intersection with that line.

All 37 alternatives have an independent decision. No alternative truth is
inferred from an author key, and no image or answer artifact was consulted.
