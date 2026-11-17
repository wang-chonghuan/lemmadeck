# Independent solve checkpoint

Stage: solved before authoring any options. This is internal author evidence,
not a semantic review, learner view, or answer publication.

Seed: `geo910-n15-choice-seed.json`

Canonical seed SHA-256:
`ae036d4c9fee63d425d062afe4d5250e052276cb72df9582f1624807c4ef7143`

Selected written exercises: 159, 160, 161, 162, 163, in full.
Selected definition: lesson.prose block 4 only, defining a displacement as a
distance-preserving space transformation. Blocks containing proofs, properties,
or the unrelated congruence definition were not selected. Figure 60 is not needed.

## Actual figure

Viewed a complete Quick Look rendering of the seed's actual final `fig-61.svg`,
not its spec or review. One image load, no crops or reopens.

Actual SVG:
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-61.svg`

SHA-256: `12931945b0b68256968b9893a0f0b6020661a59c92d812dbe744d29428b4343c`

Rendering evidence:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-choice-figure-view/fig-61.svg.png`

The entire plane outline and alpha label are visible, along with M, N above it,
M_1, N_1 below it, their aligned joining segments, the two marked intermediate
points, and the separate line l crossing the plane at a marked point. The upper
and lower ends of l and the bottom labels are not clipped. Solid/dashed segment
portions distinguish the drawing's visibility. There is no right-angle mark.
The drawing alone does not establish l perpendicular to alpha, equal lengths,
or a length comparison between MN and M_1N_1. Use the prose for the midpoint
condition and analyze both oblique and perpendicular directions.

## 159: full-space distance preservation

Space means Euclidean R^3; a space transformation is a bijection of it to itself.
Let F preserve every distance. Injection follows from
F(x)=F(y) => |x-y|=0 => x=y. Injection alone is not a surjectivity argument for
an infinite set.

For surjection without assuming an inverse outside the image, choose an
orthonormal frame with origin 0 and unit vectors e_1,e_2,e_3. Put b=F(0) and
u_i=F(e_i)-b. Distance preservation gives |u_i|=1 and |u_i-u_j|^2=2;
therefore u_i dot u_j=0 for i!=j. The three u_i form an orthonormal basis
of R^3. For any x put v=F(x)-b. Squared-distance differences give
v dot u_i = (|v|^2+1-|v-u_i|^2)/2 = x_i.
Consequently F(x)=b+sum_i x_i u_i. For any target y take
x_i=(y-b) dot u_i, obtaining F(x)=y. Thus F is a transformation, and
indeed a displacement under definition 4.

Before surjectivity has been proved, its set-theoretic inverse is defined only
on F(R^3). For y,z in that domain, write y=F(x),z=F(w); then
|F^{-1}(y)-F^{-1}(z)|=|x-w|=|y-z|. Surjectivity subsequently establishes
that this domain is all R^3. Do not reverse this order of reasoning.

## 160: transverse directional reflection

"l intersects alpha" here is the transverse case, a unique intersection, as
required for the construction. It includes oblique and perpendicular directions,
not a direction lying in alpha.

Write alpha as n dot x=c with |n|=1, and let d be a nonzero direction
of l; n dot d !=0. The midpoint construction uniquely gives
T(x)=x-2(n dot x-c)d/(n dot d).
This formula also fixes every x in alpha. Substituting it twice gives T(T(x))=x,
so every point has exactly one original and T is always a transformation.

If d is parallel to n, this is orthogonal plane reflection: the tangent
components stay fixed and the normal component changes sign, preserving
all distances.

For an oblique direction normalize n dot d=1 and write d=n+v with
v tangent to alpha and v!=0. Choose p in alpha. The points p and p+n
have distance 1, but T(p)=p and T(p+n)=p-n-2v, at distance
sqrt(1+4|v|^2)>1. Thus oblique directional reflection is not a displacement.
The exact answer is "always transformation; displacement iff l perpendicular
to alpha", not an unconditional rejection based on the illustrative drawing.

## 161: all three parallel relations

Apply the same distance argument to any displacement F. It has form
F(x)=b+Qx with Q orthogonal and invertible. Thus a line a+span(u)
maps to b+Qa+span(Qu), and a plane a+U maps to b+Qa+QU.

Parallel is inclusive here: equal directions may give coincident lines or
planes, and line-plane parallel includes containment.

1. Two lines with equal direction spaces retain equal direction spaces.
   Distinct parallel lines stay distinct; coincident lines stay coincident.
2. A line direction contained in a plane direction space remains so under Q.
   Containment remains containment, and strict disjoint parallel remains strict
   disjoint parallel.
3. Two planes with equal direction spaces retain equal direction spaces;
   equality and strict disjointness are preserved.

For any sets A,B, F(A) intersect F(B)=F(A intersect B), since F is injective.
Empty intersections therefore remain empty, but disjoint spatial lines can be
skew rather than parallel. Each parallel implication also has a converse,
using Q^{-1}, or F^{-1} whose domain is the whole space by the transformation
definition. An arbitrary displacement need not take a line parallel to itself:
a quarter turn can change its direction.

## 162: central symmetry and exceptional positions

Z_O(x)=2O-x. If L=a+span(u), its image is
2O-a+span(u). Therefore it is parallel to L, including coincidence.
Equality occurs precisely when 2(O-a) is in span(u), equivalently O in L.

If alpha=a+U with dim(U)=2, its image is 2O-a+U, again parallel,
including coincidence. Equality is equivalent to O-a in U, i.e. O in alpha.
If O is outside the respective line or plane the image is strictly parallel,
not intersecting. These conclusions do not assume generic placement.
Choice recognition will not demonstrate independently producing either proof;
that production loss must remain explicit in the draft and coverage.

## 163: all seven full center loci

A center is a point O for which Z_O(S)=S; it is not merely a point whose
own image belongs to S. The whole infinite line or plane is meant, not its
drawn finite representation.

1. Segment [A,B]: exactly the midpoint (A+B)/2. Central symmetry must exchange
   the endpoints. If A=B, fixing that single point still gives this same unique
   midpoint. No nondegeneracy assumption is needed.
2. Line L: exactly every point of L, by the equality criterion in 162.
   It has infinitely many centers.
3. Plane alpha: exactly every point of alpha, also infinitely many.
4. Two distinct parallel planes alpha,beta: centers comprise the entire
   midway parallel plane, infinitely many. Write their equations as
   n dot x=a and n dot x=b. The two levels become 2 n dot O-a and
   2 n dot O-b. They must exchange, so n dot O=(a+b)/2.
   They cannot both be individually fixed when a!=b. If alpha=beta,
   the union is just alpha, and its entire plane is the center locus.
5. Two distinct intersecting planes: exactly their whole intersection line,
   infinitely many. Central symmetry negates direction vectors, so each plane
   keeps its direction space. The two different direction spaces cannot be
   exchanged, including when the planes are perpendicular. Each plane must
   therefore be individually fixed, requiring O in both. If equality is
   included as a limiting common-plane case, the locus is the entire common
   plane, not a selected intersection point.
6. Line l meeting a plane alpha at a unique point P: exactly {P}, one center.
   The plane is the only two-dimensional affine plane contained in the union;
   its image must be that plane. Then O in alpha. The off-plane portions of l
   must also map to l, so O in l. Their intersection gives {P}; P suffices.
   This holds for oblique and perpendicular crossings, not only perpendicular
   ones. If "meeting" includes l contained in alpha, the union is alpha and
   the locus is all alpha, infinitely many.
7. Line l parallel to alpha: if l is strictly outside alpha, there are no
   centers. The plane cannot exchange with the line, by dimension; fixing
   each requires O simultaneously in alpha and l, impossible. If parallel
   includes l contained in alpha, the union is alpha and all its points are
   centers. Thus strict parallel gives zero, contained parallel gives
   infinitely many; do not silently use strict parallel throughout.

The dimension argument in 6 and 7 is about the whole union, not a premise
that every component of every union must be fixed. For example the distinct
parallel planes in 4 genuinely exchange.

## Prospective response units

Use one inverse/existence classification for 159, one two-property conditional
classification for 160, one multiple-selection relation task for all three
parts of 161, and one multiple-selection line/plane image task for 162.

For 163 group the bounded segment and affine line/plane together, the two
plane unions together, and the two line-plane unions together. Each group
requires complete-locus judgments with count implications and exceptional
positions. Do not offer a handwritten complete seven-answer table, one click
per printed subpart, source-target matching, or complete proofs as alternatives.

These are prospective units only. No options or correctness key existed when
this checkpoint was written. A separate reviewer remains responsible for
semantic approval of the eventual draft.
