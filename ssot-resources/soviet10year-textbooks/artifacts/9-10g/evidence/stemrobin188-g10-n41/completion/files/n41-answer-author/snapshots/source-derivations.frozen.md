# N41 Independent Source Derivations

Author-only scope: STEMROBIN-188, SAME188-6 offline9-10g,
`geo910-c1-s3-n41`, exercises 391 through 404, in original order.
This document is completed before editing the prepared answer template.
No previous authored/reviewed answers or another worker's directory were read.
The once-prepared empty template contains no `bookRaw`; the explicit core
book root has no `answers.json`. All answers therefore have source `derived`.

## Authority And Figures

The first-input receipt binds the ready current lesson, all 17 prose blocks,
the 14 modern exercises, the untouched raw lesson/exercises, page facts
0140 through 0143, the modern figure manifest/specs/SVGs/render/review metadata,
and both original PNGs. The two figures are prose-owned; all 14 exercise
`figure_refs` and `figures` are empty. No exercise-owned image is missing.
The boundary is p0143#8, exercise 404; p0143#9 is the next chapter-review
heading, not part of this answer set.

I actually inspected, in order:

1. Original fig-160 PNG. S is above A,B,C; D is on SC before C. Solid SA,
   SB, SC, AD, DB; dashed AB through interior diamond N and dashed SM
   through N continuing to M. Gamma is ASB, beta ASC, alpha BSC.
   No numerical lengths, angles, right-angle marks or equality ticks.
2. Current referenced fig-160 SVG rendered to my own full 480 x 560 PNG
   by installed resvg. The same points, continuations, incidence, dashed
   construction and three angular labels are visible, unclipped.
3. Original fig-161 PNG. A1,S,A are collinear on opposite rays.
   SB and SC diverge to B,C; AB is dashed, AC and BC are irregular solid
   truncation boundaries. Labels identify gamma=ASB, beta=ASC,
   alpha=BSC, 180 degrees minus gamma=A1SB and 180 degrees minus beta=A1SC,
   with the source leaders.
4. Current referenced fig-161 SVG rendered to my own full 480 x 600 PNG.
   A1 subscript, opposite rays, dashed AB, curved outlines, all five angular
   labels and leaders are present. No diagram measurement is used as a
   spatial angle or length.

These observations match the FigureSpec source inventories and its
authoritativeText. They are author evidence, not a replacement figure review.
The current text at p0141#2 uses angle NSB in the cosine comparison.
Its registered erratum is present in page 0141 `meta.errata` and the modern
lesson. The raw page lines and embedded raw lesson still contain NSD.
For SD=SN>0, subtraction of the two cosine laws gives
DB^2-NB^2=2 SB SN (cos(NSB)-cos(alpha))>0. Thus the current
NSB comparison, not NSD, is the mathematical premise used here.
No raw or source text was edited.

## 391

A nondegenerate trihedral angle with face angles a,b,c in (0,180 degrees)
requires each smaller than the sum of the other two and a+b+c<360 degrees.

1. 120>100+10=110, so impossible.
2. 80=50+30, whereas strict inequality is required, so impossible.
3. 125+120+115=360, whereas strict total <360 is required, so impossible.

Three independently gradable negative decisions; display includes the
actual violated condition in each case.

## 392

For given b,c, the third face angle alpha satisfies
|b-c|<alpha<min(b+c,360-b-c,180), with strict endpoints.
These are also sufficient, by the current lesson's existence statement.

1. b=70,c=80: difference 10, sum 150, total cap 210, individual cap 180.
   Therefore 10 degrees<alpha<150 degrees.
2. b=100,c=120: difference 20, sum 220, total cap 140, individual cap 180.
   Therefore 20 degrees<alpha<140 degrees.

Both ranges are open. Using 220 as the second upper bound would be wrong.
Two exact interval parts use alpha consistently and accept an equivalent
membership-in-open-interval form, not non-equivalent endpoint variants.

## 393

Let the unit edge vectors be u,v,w. All face angles 90 degrees mean their
pairwise dot products vanish. In a plane perpendicular to u, the two adjacent
face traces have directions v,w and meet at 90 degrees. The same argument
works at v and w. All three interior dihedral angles are 90 degrees.
Three numeric parts correspond to the three edges.

## 394

Let the face angles be alpha,beta,gamma. From the strict trihedral inequality,
alpha<beta+gamma=180-alpha, so 2alpha<180 and alpha<90.
The cyclic arguments give beta<90 and gamma<90. Face angles are positive,
so all three are acute. This is a proof, with no auto grading.

## 395

The two noncoplanar triangles ABC and ABD imply A,B,C,D are affinely
independent. At B the nondegenerate trihedral angle with edges BA,BC,BD gives
angle CBD<angle CBA+angle ABD. At A the trihedral angle with edges AB,AC,AD
gives angle DAC<angle DAB+angle BAC. Add these strict inequalities and the
two remaining angles:

angle ACB+angle CBD+angle BDA+angle DAC
< (angle ACB+angle CBA+angle BAC)
 + (angle ABD+angle BDA+angle DAB)
=180+180=360 degrees.

The strictness comes from noncoplanarity, not a flat quadrilateral formula.
Ungraded proof.

## 396

Use the shared edge as the z-axis. For unit edge vectors u=(0,0,1),
v=(1/sqrt(2),0,1/sqrt(2)),
w=(0,1/sqrt(2),1/sqrt(2)), the two given faces are each 45 degrees
and their planes are perpendicular. The dot product v.w=1/2;
their angle is 60 degrees.

Equivalent synthetic derivation: take A,B at equal distance l on the two
nonshared edges and drop perpendiculars to the common edge at H.
SA=SB=l and SH=AH=BH=l/sqrt(2). The given dihedral angle makes AH
perpendicular to BH; hence AB^2=AH^2+BH^2=l^2, so SAB is equilateral.
The third face angle is 60 degrees. One numeric part.

## 397

Take P on the first edge at SP=a>0, and Q,R on the other two edges with
SQ=SR=a. Each face angle is 60 degrees, so SPQ,SPR,SQR are equilateral
and every edge of tetrahedron SPQR has length a.

Let M be the center of equilateral triangle SQR. Its circumradius is
SM=a/sqrt(3). Since P is equally distant from S,Q,R, its perpendicular
projection to plane SQR is M (intersection of the perpendicular bisectors).
Thus PM^2=PS^2-SM^2=a^2-a^2/3=2a^2/3, and
PM=a sqrt(2/3)=a sqrt(6)/3.
One expression part; both displayed radical forms are equivalent for a>0.

## 398

Let the right face lie in the xy-plane, with its two edge rays along positive
x and y. For a unit vector w=(x,y,z) on the opposite edge, the two 60 degree
face angles give x=y=cos60=1/2. Hence z^2=1-1/4-1/4=1/2.
The inclination theta to the xy-plane satisfies sin(theta)=|z|=1/sqrt(2);
theta in [0,90 degrees] is 45 degrees.

Alternatively, for SP=l, the projection H to the right-face plane has
coordinates (l/2,l/2), so SH=l/sqrt(2) and cos(theta)=SH/SP=1/sqrt(2).
One numeric part.

## 399

The prompt says all points and does not restrict them to the inside of the
trihedral angle. It also does not specify whether distance to an edge means
distance to its ray as a point set or its supporting line. These are
different problems; the answer will state both explicitly, not silently
replace rays by lines.

Put S at the origin and use independent unit directions u,v,w for the three
edge rays. For a point with vector x, minimizing |x-tu|^2 over t>=0 gives:

d(x,ray(u))^2 = |x|^2 - max(x.u,0)^2.

Equal distances to all three rays therefore require their three positive
parts to be equal. If this common part is zero, x.u,x.v,x.w are all <=0.
This is the entire closed cone
K={x:x.u<=0, x.v<=0, x.w<=0}, including S and points behind all rays.
If the common part is t>0, then x.u=x.v=x.w=t. Independence gives the
unique vector n with n.u=n.v=n.w=1, so x=t n.
Consequently the complete ray-distance locus is
K union {t n:t>=0}.

Concrete geometric construction: choose A,B,C at equal positive distance
from S on the three edges. Let l be the line through S perpendicular to
plane ABC. Its direction has equal dot products with u,v,w; select the
half-ray pointing towards plane ABC, the one with positive projections on
all three edges. That ray is {t n:t>=0}. Construct K as the intersection
of the three closed half-spaces behind the planes through S perpendicular
to SA,SB,SC. This is a specific complete set construction.

For supporting-line distances, minimizing over all real t instead gives
d(x,line(u))^2=|x|^2-(x.u)^2. Equality means
|x.u|=|x.v|=|x.w|. Apart from S, select signs (epsilon1,epsilon2,epsilon3)
in {+1,-1}^3. The equations x.ui=t epsiloni give a line through S;
opposite sign triples give the same line, so there are exactly four lines.
A concrete construction uses A',B',C', the points opposite A,B,C about S:
the four perpendiculars through S to planes ABC, A'BC, AB'C, ABC'.
Equivalently they are intersections of the internal/external face-angle
bisector planes. They are not four complete lines of equal distance to
the rays: their negative parts generally lie in K only if all three
projections are nonpositive, and mixed-sign parts do not satisfy ray equality.

Do not call the positive equal-projection ray an always-interior axis.
For an obtuse spherical triangle it may lie outside the positive hull
of u,v,w; the prompt requests all points, so no such restriction is added.
Ungraded locus/proof. The semantic convention remains a review point;
both complete conditional solutions eliminate a fabricated fallback.

## 400

Choose independent unit edge vectors u,v,w. Their pairwise dot products are
the cosines of the three face angles, in some order. Since u,v,w are linearly
independent, u+v+w cannot be zero. Therefore
0<|u+v+w|^2=3+2(cos(alpha)+cos(beta)+cos(gamma)).
Subtract 3 and divide by 2 to obtain the strict bound >-3/2.
Equality would force u+v+w=0 and hence a degenerate coplanar configuration.
Ungraded proof.

## 401

Let u,v,w be unit vectors on SA,SB,SC. Choose, without loss of generality,
the two internal bisectors in faces SAB and SAC. Their direction vectors
are u+v and u+w, because both pairs consist of equal-length vectors.
The bisector of either adjacent supplementary angle in face SBC has direction
v-w or its opposite. But
(u+v)-(u+w)=v-w.
Thus the third bisector is in the plane spanned by the first two.
All three pass through S and are coplanar. Relabeling covers any choice of
the two face angles. Ungraded proof.

## 402

Under the convex-polyhedral-angle context of the current lesson:

1. 80+130+70+100=380 degrees, not less than 360; impossible for a convex
   polyhedral angle.
2. The largest angle is 160 degrees, while the sum of the other four is
   10+20+40+80=150 degrees. Every face angle must be strictly smaller than
   the sum of the others; hence impossible even without using convexity.

Semantic caveat: the exercise itself says polyhedral angle without repeating
the adjective convex, whereas the immediately preceding prose explicitly
limits the total-angle theorem to convex angles. Therefore the first negative
decision is keyed under that stated lesson context, and its display/notes
must expose the condition. It is not a universal impossibility theorem for
nonconvex polyhedral angles.

In fact a nonconvex example with the first data can be constructed: form a
trihedral SACB with face angles ASB=80, BSC=130, ASC=100 degrees, and on the
other side of plane SAC form SACD with CSD=70, DSA=100, ASC=100 degrees.
Both triples meet all strict triangle and total inequalities:
(80,130,100) has 130<180 and total 310; (70,100,100) has 100<170 and total 270.
Join their two spherical triangular sections along minor arc AC. Their
interiors are on opposite sides of great circle AC, so the outer arcs
AB,BC,CD,DA form a simple spherical quadrilateral, with the required angles
in their original order. Its cone is nonconvex because its face-angle sum
is 380. Thus without the lesson's convex condition the first answer is yes,
not no. The candidate includes this exact conditional construction.

This unresolved intended-convention point must be reported to the parent;
the context-bound auto part must not be approved as an unconditional key.
The second negative decision is unconditional.

## 403

Use the four rays in the stated cyclic order A,B,C,D. Cutting along face SAC
splits the ordinary nondegenerate convex four-face angle into two trihedral
angles SABC and SACD. Every face angle in each is 60 degrees.

For any all-60 trihedral angle, at an edge with unit direction u the traces
of the adjacent faces have directions
v_perp=v-(u.v)u and w_perp=w-(u.w)u. Here all pairwise dot products are 1/2.
Then v_perp.w_perp=1/2-1/4=1/4 and
|v_perp||w_perp|=(sqrt(3)/2)^2=3/4.
The interior dihedral angle theta therefore has cos(theta)=1/3, so
theta=arccos(1/3), between 0 and pi.

At SB and SD the four-face angle has only one such trihedral piece, hence
the two angles are theta. At SA and SC the two pieces are adjacent on opposite
sides of face SAC, hence each interior dihedral angle is 2theta. This is less
than pi because theta<pi/2.

Independent coordinate check: the unit B,D directions have equal projection
p onto span(A,C). Solving p.A=p.C=1/2 gives p=(A+C)/3,
|p|^2=1/3. Their normal components have norm sqrt(2/3) and opposite signs.
Thus B.D=1/3-2/3=-1/3. At SA the projected B,D traces have cosine
((-1/3)-(1/2)(1/2))/(3/4)=-7/9=2(1/3)^2-1=cos(2theta).

Answers by edge:
SA: 2 arccos(1/3); SB: arccos(1/3);
SC: 2 arccos(1/3); SD: arccos(1/3), in radians.
Their degree measures are 360/pi arccos(1/3) and 180/pi arccos(1/3).
Four numeric degree-measure parts avoid treating the cosine itself as the
angle, avoid rounded approximate-only keys, and use proper LaTeX inverse
cosine, not a programming-style function. The interior angle convention is
the ordinary convex four-face-angle convention; a reflex exterior sector is
not substituted.

## 404

Take any initial plane meeting all four rays of the convex four-face angle.
Its section is a convex quadrilateral ABCD. Let O be the intersection of
diagonals AC and BD. In vectors from S,
o=t a+(1-t)c=s b+(1-s)d for 0<t,s<1.
Choose points on the original rays by
a'=2t a, c'=2(1-t)c, b'=2s b, d'=2(1-s)d.
All four scaling factors are positive. Then
a'+c'=b'+d'=2o. Thus both diagonals A'C' and B'D' have O as midpoint.

The four endpoints are coplanar because d'=a'+c'-b'. A',B',C' are not
collinear: otherwise their plane would be the face plane SAC, which cannot
contain the distinct edge SB of a nondegenerate convex four-face angle.
The new plane does not pass through S, for the same reason, and cuts all
four rays at the constructed positive points. A nondegenerate coplanar
quadrilateral whose diagonals bisect one another is a parallelogram.
This is the requested cut plane.

Ruler-and-compass implementation of the positive scalings: in plane SAC
decompose SO into SE+SF with E on SA and F on SC, using lines through O
parallel to the two edge rays; then set SA'=2SE, SC'=2SF. Repeat in SBD
with G on SB and H on SD, set SB'=2SG, SD'=2SH. The midpoint equations
above prove that the resulting plane A'B'C' has the required section.
Ungraded construction and proof; no generic suggestion substitutes for
these actual points.

## Pre-Candidate Decisions

All 14 source exercises have complete constructive answers or proofs.
Provisional grading: auto 391,392,393,396,397,398,402,403; ungraded
394,395,399,400,401,404. Auto 402 is explicitly context-bound pending the
parent's convention review; without the convex context, its first part is
not the same question. No mathematical data or figure is missing.
No mechanical check has yet been claimed as mathematical proof.
