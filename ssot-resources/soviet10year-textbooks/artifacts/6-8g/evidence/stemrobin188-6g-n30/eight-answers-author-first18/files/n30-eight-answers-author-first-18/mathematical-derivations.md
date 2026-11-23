# N30 independent answer derivations

Status: draft candidate, not an independent gate verdict.
Authorization: OFFLINE SAME188-6 / STEMROBIN-188 N30.
Lesson: geo68-c2-s4-n30, book 6-8g, edition modern-us-neutral.
Coverage: eight exercises, fourteen ordered source subparts:
373(4), 374(2), 375(1), 376(1), 377(1), 378(1), 379(2), 380(2).

Only the initial prepared exercise text and the same retained lesson's raw
exercise text were used. All eight `figure_refs` and `figures` arrays are empty.
No image, textbook figure, other lesson key, choice, or book-answer text was
opened. No retained `answers.json` exists at the checked retained and canonical
book locations. Every answer is derived; no `bookRaw` is manufactured.

All lengths used as radii or sides must be positive unless a zero boundary is
explicitly being discussed. Circles are nondegenerate and distinct when said
to be tangent. Triangle altitudes are perpendicular distances to supporting
lines; an additional requirement that a foot lie on a side segment is not
silently imposed.

## 373.1: hypotenuse c, leg b

Construct AB=c, its diameter circle, and the circle centered at A with radius b.
An intersection C gives AC=b and angle ACB=90 degrees by Thales' theorem.
Conversely every triangle with these data has C on both circles.

Take A=(0,0), B=(c,0). The intersection equations give
C_x=b^2/c and C_y^2=b^2(1-b^2/c^2).
There are exactly two reflected noncollinear intersections when 0<b<c.
The other leg is sqrt(c^2-b^2); the triangle is unique up to congruence.
At b=0 or b=c, C equals A or B. Nonpositive c, negative b, or b>c
cannot give the requested nondegenerate triangle.

## 373.2: two legs a,b

On perpendicular rays from C, take CA=a and CB=b, then join AB.
The Pythagorean theorem gives AB=sqrt(a^2+b^2).
Positive a,b suffice and are necessary. All ray-side choices give congruent
triangles; zero legs are degenerate and negative lengths are invalid.

## 373.3: leg a and its adjacent acute angle beta

Let C=(0,0), A=(a,0). At C draw the perpendicular to CA, and at A draw a
ray making the prescribed beta with the ray AC, on either side of CA.
For 0<beta<90 degrees their intersection is
B=(0,+/- a tan(beta)), giving CB=a tan(beta), AB=a/cos(beta).
Thus a>0 and an acute beta are necessary and sufficient.
At beta=0 the vertices B,C coincide. At beta=90 degrees the two constructed
lines are parallel and there is no finite vertex. Nonacute beta is outside
the stated adjacent-acute-angle data. Reflection is the only duplication.

## 373.4: leg a and altitude h to the hypotenuse

Fix C=(0,0), A=(a,0), a>0. Construct the diameter circle of CA and the
circle centered at C of radius h. Their intersection D must satisfy
|D|^2=a D_x=h^2. For 0<h<a the intersections are

- D_x=h^2/a;
- D_y=+/- h sqrt(a^2-h^2)/a.

Thales' theorem gives CD perpendicular to AD. Let B be the intersection of
AD with the perpendicular to CA at C. Direct substitution gives

- CB=b=ah/sqrt(a^2-h^2);
- AB=c=a^2/sqrt(a^2-h^2);
- CD=h.

D is genuinely on the hypotenuse segment, not merely its extension:
AD=sqrt(a^2-h^2)>0, DB=h^2/sqrt(a^2-h^2)>0, and AD+DB=c.
The altitude also follows from h=ab/c.

Necessity follows for every finite right triangle from
h=ab/sqrt(a^2+b^2), so 0<h<a. Conversely the construction above works for
every such h. The two D's yield mirror images, not two noncongruent shapes.

Boundary branches:

- h=0: D=C and the construction is collinear/degenerate.
- h=a: D=A, so AD is not defined by two distinct points. The formula for b
  tends to infinity; this is not a finite triangle.
- h>a: the auxiliary circles do not meet.
- a<=0 or h<0: invalid nondegenerate side/altitude data.

## 374.1: equal legs b, base altitude h

Construct CH=h and the line through H perpendicular to CH.
Its intersections A,B with the circle centered at C, radius b, have
HA=HB=sqrt(b^2-h^2). Thus AB=2sqrt(b^2-h^2).
This is an isosceles triangle and CH is its base altitude.

Necessity and sufficiency are b>0, 0<h<b. At h=b the two base vertices
coincide; at h=0 the apex is on the base line; h>b gives no intersections.
The shape is unique up to congruence.

## 374.2: base a, altitude h to one equal leg

Take A=(0,0), B=(a,0), a>0. The apex C must lie on x=a/2.
The altitude from B to the supporting line AC must be h.
Construct the circle centered at B with radius h; AC must be one of the
lines from A tangent to that circle. For 0<h<a there are exactly two:
their slopes are +/- h/sqrt(a^2-h^2).
Their intersections with x=a/2 give reflected apices and

- base altitude H=ah/(2sqrt(a^2-h^2));
- equal leg L=a^2/(2sqrt(a^2-h^2)).

Both positive finite quantities and the tangency construction prove
sufficiency. Necessity also follows from h=a sin(angle A), where each
base angle is strictly between 0 and 90 degrees in any nondegenerate
isosceles triangle.

For h=a, A lies on the auxiliary circle and its unique tangent is x=0,
parallel to x=a/2. There is no finite apex. For h>a no tangent exists;
h=0 gives a collinear figure. Thus the unrestricted-altitude existence
condition is exactly a>0, 0<h<a.

Let D be the perpendicular foot from B to line AC. Projection gives
AD=sqrt(a^2-h^2), while AC=L. Since AD is positive:

- 0<h<a/sqrt(2): AD>AC, so D lies beyond C on the extension of AC.
  The apex angle is obtuse.
- h=a/sqrt(2): D=C; the apex angle is a right angle.
- a/sqrt(2)<h<a: 0<AD<AC; D is in the interior of the leg.
  The apex angle is acute.

If an unstated convention requires the altitude foot on the leg segment,
the condition is a/sqrt(2)<=h<a; if strictly inside, use strict inequality
at the lower endpoint. The candidate states this distinction, rather than
silently discarding the valid obtuse triangles.

## 375: number of tangents

For a circle with radius r>0, write d=OA.
A distinct external tangency point T must satisfy OT perpendicular to AT.
Hence d^2=r^2+AT^2. If d>r the diameter circle of OA intersects the given
circle at exactly two points, giving exactly two tangent lines.
If d=r the only tangent is the line through A perpendicular to OA.
If d<r the equation is impossible, so there are no tangents, including A=O.
The diameter-circle argument is not used to define AT when A=T.

## 376: construct every tangent through the given point

For OA>r, construct H, the midpoint of OA, and the circle (H,HO).
Its two intersections T_1,T_2 with (O,r) give AT_1 and AT_2.
Thales' theorem proves each is tangent; the converse proves completeness.
For OA=r use the perpendicular to OA at A.
For OA<r report no solution. In particular, do not attempt a diameter circle
with radius zero when A=O.

## 377: fixed tangent-segment-length locus

Write (O,r) for the given circle, r>0. For a tangent segment PT of length a,
the right triangle OTP gives OP^2=r^2+a^2.
If a>0 this forces P onto the circle centered at O of radius
sqrt(r^2+a^2), which is strictly outside the original circle.
Conversely every point there admits tangents, each with squared length a^2.
This proves equality of the entire locus, not merely containment.

If a=0 and a degenerate tangent segment is admitted, the locus is the
original circumference. If positive external tangent segments are required,
the a=0 locus is empty. A negative requested length has no solution.
An infinite tangent line has no finite length; the segment interpretation
is essential and is made explicit.

## 378: conditional full-chord interpretation, UNKNOWN source data

The source gives no length symbols and does not say whether the two lengths
are equal or prescribed separately. It also does not explicitly name the
segment endpoints. Therefore the intended data and endpoint convention
remain UNKNOWN. The following is a conditional complete construction for
the usual full-chord interpretation, not an assertion that the source
contains p,q or a common length.

Let V be the origin, with unit ray directions u,v and angle alpha satisfying
0<alpha<pi. Suppose the two specified positive full chord lengths really
are p,q. Let S_1=m_1 u, S_2=m_2 v be their midpoints.
If both chord endpoints lie on the respective positive ray then
m_1>=p/2 and m_2>=q/2. For a center P and radius R,

- P dot u=m_1 and P dot v=m_2, since radii to chord midpoints are normal
  to their chord lines;
- R^2=|P|^2-m_1^2+p^2/4=|P|^2-m_2^2+q^2/4.

It follows necessarily that
m_1^2-p^2/4=m_2^2-q^2/4=k>=0, the power of V.

For the converse, choose an arbitrary auxiliary length t>=0, put k=t^2,
and construct m_1=sqrt(t^2+p^2/4), m_2=sqrt(t^2+q^2/4) as hypotenuses.
Mark S_1,S_2 on the rays. The two perpendiculars there meet in one finite
P because 0<alpha<pi. Choose X on the first ray with S_1X=p/2, and draw
the circle centered at P with radius PX. Its squared radius is
R^2=|P|^2-k; this is at least p^2/4>0.
The equality of the two formulas for R^2 proves the other chord length q.
The actual intersections have ray parameters
m_1+/-p/2 and m_2+/-q/2, all nonnegative.

Thus every p,q>0 has a nondegenerate circle for every t>=0, and every circle
with two full chords on these rays occurs in this one-parameter family.
There are infinitely many circles even once p,q are supplied.

Parameter and interpretation branches:

- t>0: all four ray parameters are positive. V is outside the circle,
  and neither chord includes the vertex.
- t=0: each nearer endpoint is V. Both chords share that endpoint;
  V and the two farther endpoints are noncollinear, so the circle is
  still nondegenerate. Exclude this boundary only if endpoints must be
  strictly away from V.
- k<0 would place V inside the circle. Each full secant chord would then
  extend to a negative ray parameter, so this is not a solution under
  the full-chord-on-rays convention.
- p<=0 or q<=0 is not a positive full chord. A zero chord is a tangent
  contact, not a nondegenerate intercepted segment. Negative lengths
  are impossible.
- For alpha=0 the rays coincide, so unequal full chord lengths cannot
  both occur; the equal-length problem has a different, less constrained
  family. For alpha=pi a positive full chord cannot lie entirely in each
  of the two opposite rays. These are degenerate angles, not silently
  accepted inputs to the ordinary-angle construction.

If, and only if, the intended datum is one common positive length ell,
specialize p=q=ell. Then m_1=m_2=m>=ell/2. Solving the projection equations
puts P on the internal angle bisector, at distance m/cos(alpha/2) from V.
The distance from P to either side line is m tan(alpha/2), so
R^2=ell^2/4+m^2 tan^2(alpha/2).
The external bisector has opposite-sign projections on the two rays;
it cannot satisfy both positive midpoint conditions. Equal distances
to the two infinite side lines alone are therefore insufficient.

If the intended segments instead start at V and end at a chosen circle
intersection, those endpoints must be clarified. Requiring the circle
also to pass through V and specifying two such positive lengths would
select the t=0 circumcircle through V and those two marked points.
Without that extra through-V requirement this is not the same problem.
Neither interpretation is silently chosen as the authoritative source.

## 379.1: tangent at a prescribed point of the given tangent line

Use coordinates a: y=0, T=(0,0), O=(0,r), r>0.
Let M=(m,0). A new circle tangent to a at M has center
P=(m,epsilon s), radius s>0, epsilon=+1 or -1.
Its center distance satisfies OP^2=m^2+(epsilon s-r)^2.

External tangency OP=r+s is equivalent to
m^2=2rs(1+epsilon).
Internal tangency OP=|r-s| is equivalent to
m^2=2rs(epsilon-1).
These equations exhaust both center half-planes and both tangency types.

For m!=0, only epsilon=+1 external tangency works, and it forces
s=m^2/(4r)>0. Thus there is one circle, not two circles obtained by
putting its center on arbitrary sides of the line. Directly
OP^2=m^2+(s-r)^2=(r+s)^2, proving external tangency and noncoincidence.

The required length s is compass-and-straightedge constructible:
from Q draw two noncollinear rays. On the first mark QX=4r, QY=|m|;
on the second mark QZ=|m|. Join XZ; the parallel through Y meets
the second ray at U. Similarity gives QU/|m|=|m|/(4r), hence QU=s.
Place P at distance s from M, normal to a into O's half-plane.

For m=0, hence M=T:

- epsilon=-1: every s>0 gives external tangency at T.
- epsilon=+1 and 0<s<r: every such s gives internal tangency at T,
  with the new circle inside the given circle.
- epsilon=+1 and s>r: internal tangency at T, with the new circle
  containing the given circle.
- epsilon=+1 and s=r: identical circles, excluded.
- s=0: a point, not a circle, excluded on both sides.

Equivalently choose any P on the full normal through T except T and O,
and radius PT. The families are infinite, even though both tangency
conditions use the same point T.

## 379.2: tangent at a prescribed point of the given circumference

Here M must be on the original circle. Write M=O+r u, |u|=1, and let
w=u_y, so -1<=w<=1. The original tangent point T has w=-1, while the
opposite point U=2O-T has w=1.

Tangency at M requires the new center on line OM:
P=O+lambda r u, radius s=r|lambda-1|>0.
Tangency to a requires |P_y|=s, or
(1+lambda w)^2=(lambda-1)^2.
After factoring, the complete center equation is
lambda(1+w)[lambda(1-w)-2]=0.

For -1<w<1:

- lambda=0 gives P=O,s=r: the original circle, not a tangency of
  two distinct circles, so discard.
- lambda=2/(1-w)>1 gives a positive-radius circle with P beyond M.
  Then s=r(1+w)/(1-w), P_y=s>0, and OP=r lambda=r+s.
  Thus the new circle is externally tangent to the old one exactly at M.
- No other lambda exists, so there is no distinct internal solution or
  center on the other side of a.

With d=distance(M,a)=r(1+w), this unique new radius is
s=rd/(2r-d), where 0<d<2r.

For a ruler-and-compass construction draw b, the given circle's tangent
at M, and both angle bisectors of the intersecting lines a,b.
Centers tangent to both lines lie on those bisectors. The original O
lies on exactly one; discard that bisector's intersection O with OM.
The other bisector intersects OM at the unique new P just derived.
Take radius PM. This construction is used only for M!=T,U.

At M=U, w=1, the equation forces lambda=0. Thus only the identical
circle appears, and there is no distinct solution. The lines a,b are
parallel; equidistance and the normal OM select O, not a new center.
The singular denominator 2r-d is not an infinite-radius circle solution.

At M=T, w=-1, the factored equation vanishes for every lambda:
a=b and all centers on the common normal are candidates.
Exclude lambda=1 (s=0) and lambda=0 (identical circle).
For lambda>1 the center is below a and tangency is external.
For 0<lambda<1 the new circle is inside the old one, internally tangent;
for lambda<0 it contains the old one, internally tangent.
These are exactly the M=T families of part 1.

A point not on the given circle cannot be its prescribed tangency point.
No branch assumes a distinct prescribed point or excludes internal
tangency without checking the geometry.

## 380.1: construct points with equal tangent-segment lengths

External tangency gives D=O_1O_2=r_1+r_2, r_1,r_2>0.
Construct T on O_1O_2 with O_1T=r_1 (thus O_2T=r_2),
then the common tangent l through T perpendicular to O_1O_2.
Any M on l other than T lies outside both circles.
MT is a tangent segment to each, so the lengths agree and are positive.
At M=T both are zero if degenerate tangent segments are admitted.

## 380.2: prove the entire locus, including its boundary

Set T=(0,0), O_1=(-r_1,0), O_2=(r_2,0), M=(x,y).
For real tangent segments the squared lengths are the powers

- L_1^2=MO_1^2-r_1^2=x^2+y^2+2r_1x;
- L_2^2=MO_2^2-r_2^2=x^2+y^2-2r_2x.

Equality of lengths implies equality of squares, hence
2(r_1+r_2)x=0. Since r_1+r_2>0, x=0 is necessary.
Conversely on x=0 both powers equal y^2>=0; for y!=0 the point is
strictly outside each circle and both lengths are |y|. Thus sufficiency
and existence of real tangents are checked, not merely a formal
equal-power equation for possibly internal points.

The locus is l if zero lengths are allowed, and l with T removed if
positive tangent segments from external points are required.
At T there is one tangent line to each circle and it is the same line;
the segment length zero is not two positive external tangents.
For r_1=r_2, T is the midpoint of O_1O_2 and l is its perpendicular
bisector. For unequal radii it is not the perpendicular bisector.

## Authoring and verification limits

Every key is ungraded with empty `parts`, as required by the current
lesson-answer validator for ungraded answers. Numbered subparts remain
separately labeled in `displayAnswer` and in this report.
375 has a determined conditional count, but the source supplies neither
a point position nor numerical data for a single numeric response.
377 and 380 ask for geometric loci, not just expressions; the algebraic
radius/line equations do not alone justify automatic grading of the
entire requested response.

The accompanying local check uses only Node built-ins. It checks JSON
structure, the eight identities, fourteen labels, empty figure references,
source-snapshot equality, input/output hashes, and representative arithmetic
for the constructions. Such samples do not substitute for the derivations
or parent review. It does not import the app, invoke native prepare/finalize,
or emit a gate pass/fail verdict. Exercise 378 remains explicitly conditional.
