# STEMROBIN-184 / geo910-c1-s1-t14 / Source Math AUTHOR Freeze

Status: AUTHOR_COMPLETE_FROZEN. This is a source-based, derived standard-answer
precursor for parent comparison, not an independent review, choice draft,
official answer key, approved edition, publication, or production acceptance.
Completed on 2026-11-16 in the assigned active workspace.

## Scope And Bindings

- Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
- Sole author scope: all 32 original written exercises 121-152, including every
  numbered subpart, construction, proof, possibility question, and investigation.
- Authoritative exercise text: original
  `ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-t14/{lesson.json,exercises.json,lesson.md}`.
- Assembly binding: original `artifacts/9-10g/book.json` SHA-256
  `09b7503438ca530df95ef569c48d762e1f8fb8e8fc8ceb384995074008065e24`.
  This is the assembled book JSON hash, not the source PDF hash. The parent's
  152-task/57-figure assembly description is not a claim of a counter run here.
- Actual original PNGs, each opened exactly once before drafting:
  - `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-54.png`
    SHA-256 `73f9540d57e421709a2c2c04e594ec8ed48ef8dfc3c08e2f537be96d7b0e51b9`.
  - `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-55.png`
    SHA-256 `6f203be966b1afd76d7937ac2784d2663361e831eac293503d3163265375ce2e`.
  - `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-56.png`
    SHA-256 `18b6d23fc5f1cdcb5d6b233929a956854fa501315873dab8c056b70459821c93`.
- One image batch, 3 images, current-context total 3/24; zero crops and reopens.
  Earlier lesson Markdown image links were read as text only, not opened.
- Original earlier prose read, without exercises/answers/choices/tests:
  n1, n2, n4, n6, n7, n8, n9, n10, n11, n12, n13 `lesson.md`.
  n13 was consulted only for the meaning and properties of a pictorial
  construction; no n13 exercise was inspected or solved.
- The companion manifest binds every file read for this work and freezes the
  report and the companion derived-answer precursor by their byte hashes.
- No old answers, choices, tests, ticket math reviews, modern templates or
  modern figures were consulted. No independent-review claim or communication
  to another chat/reviewer was made.
- Only the three assigned scratch outputs were written. No durable/source,
  figure, tool, index, Git, database, app, or other-chat changes were made.
  No counter, prepare/finalize, validator, test, render, or browser ran.
- The user's explicit source-only/scratch-only override supersedes the
  lesson/answer skills' default production workflow for this assignment.
  Production answer-key creation remains prohibited until approved edition
  text and figures exist.

## Source Semantics And Optical Boundaries

These original definitions govern this report; replacing them with common
strict-parallel conventions would change several answers.

1. n4: a line is parallel to itself. Through a point on a line, its unique
   parallel is that same line.
2. n7: a line is parallel to a plane if it is disjoint from the plane **or
   contained in it**. Equivalently its direction belongs to the plane's
   direction space. "Intersects a plane" means exactly one common point.
3. n10: parallel planes may be disjoint **or coincident**. Equivalently their
   two-dimensional direction spaces agree.
4. n12: parallel projection has a fixed direction v transverse to the target
   plane. The stated noncollapse properties there explicitly exclude shapes
   parallel to v; exercise 149 asks for the collapse cases too.
5. t14 lesson prose: constructions here and in certain later exercises mean
   pictorial constructions. The constructions below prove existence and
   describe auxiliary lines/planes; they do not supply newly rendered assets.
6. A tetrahedron/parallelepiped/cube is nondegenerate. A symbol `(XYZ)` names a
   unique plane only if X,Y,Z are noncollinear; `(XY)` names a line only if
   X != Y. Closed segment/face membership is not silently changed to interior
   membership.

Optical uncertainty is not a mathematical erratum:

- **125 symbol macro UNKNOWN.** The supplied transcription contains
  `a\dot{-}b`. n6 separately uses that macro for skew lines, but this author
  does not certify the task-125 printed glyph. The construction works for any
  two lines not through M, independent of their mutual relationship.
- **fig54 p/rho optical UNKNOWN.** The lower glyph on the common vertical
  line is kept undecoded. The math only needs the common line of the two
  planes; it does not require identifying that glyph.
- **151 separator UNKNOWN.** No new source-page pixels were opened to settle
  the reported separator. The supplied noncollinearity and projection
  conditions suffice for the case-complete geometry.
- **146 `face [BCD]` stays literal.** The quoted source wording is
  "和平行面$[BCD]$". The usual geometric meaning is the face BCD and its
  supporting plane, and this semantic interpretation is stated explicitly
  below. No bracket correction, automatic erratum, or source modification
  is asserted.

## Actual Figure Inventory

### fig54 / Exercise 126

One drawing, not a multi-panel figure. Two outlined plane patches meet along
the drawn vertical line. Alpha is on the right patch, beta on the left.
The line labelled m crosses the upper part and the common line at labelled
point M. Its left continuation is dashed and its right part is solid.
The line labelled n crosses the lower part and the common line at labelled
point N. Its left part is solid and its right continuation is dashed.
A labelled point P is on the common line between M and N in the depiction.
The common line has the additional lower p/rho-uncertain glyph.
There are no lengths, angular values, tick marks, or equal-segment marks.
The patches are finite drawing devices, not bounded mathematical planes.
Text binds m and n as skew and P as off both. The drawing depicts the
solvable transversal case; it does not assert that every admissible P works.

### fig55 / Exercise 133

Three source panels, labelled Cyrillic а), б), в). Each is a perspective
tetrahedron ABCD with D above and A below/front, B left and C right.
The rear BC is dashed. Each panel has a hatched section and alpha, plus the
given M, N, P.

- **а)**: hatched quadrilateral EFGH. E is on AB, F on AC, G on DC,
  H on DB. M lies on EF in face ABC; N on EH in face ABD; P on FG
  in face ACD. N1 is on AB and P1 on AC, obtained along DN and DP.
  NP and N1P1 extend to the exterior point K at the left. Auxiliary
  lines through K and dashed portions behind the section are visible.
- **б)**: hatched quadrilateral EFGH with the same edge assignment.
  M on EF, N on EH, P on FG. The displayed construction uses the
  parallel EF/NP case; no exterior K or labelled N1/P1 appears.
- **в)**: hatched **triangle EFG**, not a quadrilateral with a hidden H.
  E is on AB, F on AC, G on AD. M on EF, N on EG, P on GF.
  K, N1 on AB, P1 on AC, and their auxiliary lines are visible.
  G is shared by the traces in ABD and ACD; it must not be counted twice.

No panel gives numerical coordinates, lengths, equalities, or angles.
Visible incidences above describe these particular panels. They do not
justify requiring E on AB in every instance of the text's problem.

### fig56 / Exercises 150 And 151

Two panels labelled Cyrillic а), б), each with a closed oval-like outline
representing plane alpha, not a conic used as mathematical data.

- **а)**: distinct labelled A1, B1 above the plane depiction; labelled
  feet A, B within it; solid connector A1A and connector B1B.
  Neither the source line A1B1, its projected line AB, nor their
  intersection has already been drawn.
- **б)**: labelled A1, B1, C1 above; feet A, B, C within; three solid
  projection connectors. The displayed feet are distinct and depicted
  noncollinearly. No source triangle edges, projected triangle edges, or
  plane-plane intersection line is already drawn.

No perpendicular signs, lengths, heights, or angular data appear.
Parallel projection direction comes from the source prose, not from
measuring the hand-drawn connector slopes. No 151 separator is decoded
from these figure pixels.

## Construction Rule H

The following finite, explicit rule is used where the exercise gives variable
points, including endpoints, rather than numerical coordinates. It specifies
the actual section, not merely a test for whether a section exists.

For noncollinear points X,Y,Z, let
`u = (Y-X) x (Z-X)` and `h(T) = u dot (T-X)`. Their plane is h=0.
All computations may be interpreted in any affine coordinate frame; only
incidence and affine ratios are used, not right angles or lengths.

For every edge [V,W] of the solid:

- h(V)=h(W)=0: include the entire edge.
- h(V)=0 or h(W)=0: include that endpoint.
- h(V)h(W)<0: include the point
  `R = (h(V) W - h(W) V)/(h(V)-h(W))`.
- Otherwise the edge contributes no point.

Deduplicate shared vertices, take the convex hull in h=0, and order its
boundary by face incidence. Remove redundant collinear boundary points, but
do not discard the included edge. In a face, join the two extreme section
points; if the whole face lies in h=0, keep that face. These are pictorial
straightedge/parallel-line operations with directed ratios.

Completeness: a convex polytope section is the convex hull of these edge
intersections. A vertex of the section is on a polytope edge, unless the
plane contains a face, which is covered explicitly. Thus H handles
vertex hits, coincident edge traces, face coincidence and ordinary cuts.
No division by zero is treated as a finite intersection.

If X,Y,Z have affine rank 1, there is instead a pencil of planes through
their common line. If their affine rank is 0, there is a family of all
planes through that point. Without another constraint, there is no
uniquely specified `(XYZ)` or uniquely specified section. For that case
family, choose any nonzero normal annihilating the given line direction
(rank 1), or any nonzero normal (rank 0), and apply the same edge rule.
This records all completions, rather than selecting one without authority.

## 121

Request: count the distinct planes through triples of n points, n>=4,
no four coplanar.

Answer: `C(n,3)=n(n-1)(n-2)/6`.

No three of the given points can be collinear: those three together with
any fourth point would lie in a plane. Thus every triple determines a
plane. Two different triples cannot determine the same plane, since
their union contains at least four points. Every plane asked for is
obtained from a triple, so the count is exact.

## 122

Let E,F,G,H be the midpoints of AB,BC,CD,DA in that cyclic order.
They are coplanar and are the vertices of a nondegenerate parallelogram.

In triangles ABC and ADC, EF and HG are parallel to AC and equal to
half AC. Similarly FG and EH are parallel to BD and equal to half BD.
AC and BD have independent directions: parallel or intersecting lines
would put A,B,C,D in one plane. Therefore E,F,H are noncollinear and
determine a plane; the parallel-line construction or
`E+G=F+H=(A+B+C+D)/2` places G in it. Opposite sides are parallel and
equal. The original noncoplanarity excludes a collapsed parallelogram.

## 123

Answers to 1)-5): **no, yes, yes, yes, yes**.
Count distinct original edges with a common point, not distinct
intersection points. Meeting a vertex meets its three incident edges.

Use one face ABCD of a nondegenerate parallelepiped:

1. Exactly one edge: impossible for a line contained in this face's
   supporting plane. A line cutting the face has two boundary contacts;
   touching only a vertex already meets three edges. A line coinciding
   with a side meets that side and the other incident edges at both
   endpoints, five edges total.
2. Exactly two edges: pass through relative-interior points of two
   opposite sides, avoiding all vertices and not coinciding with a side.
3. Exactly three edges: a supporting line through a single vertex,
   lying outside the face except at that vertex and along neither
   adjacent side. It meets just the three edges at the vertex.
4. Exactly four edges: pass from one vertex through the relative
   interior of a nonincident side. The vertex contributes three edges,
   the second contact one.
5. Six edges: the line through opposite face vertices A,C meets three
   incident edges at A and three at C, all different.

No edge disjoint from this face can be met in its supporting plane.
The opposite four transverse edges meet this plane only at the face
vertices; opposite-face edges are disjoint. These examples and the
boundary classification establish the stated possibilities without
generic-position assumptions.

## 124

Yes, the n6 sufficient criterion is necessary **as an existential
choice of an auxiliary plane**.

For skew a,b choose any point B on b, and take the plane through a
and B. B is not on a. The entire line b cannot be in that plane,
because then a and b would be coplanar. Consequently b meets it at
exactly B, while a is contained in it. This is the stated criterion.

It is not necessary that an arbitrarily prechosen plane through a
meet b: a plane through a parallel to b can be disjoint from b.
The criterion does not have the quantifier "every plane through a."

## 125

Construction valid without decoding the UNKNOWN printed relation:
take planes sigma=(a,M) and tau=(b,M). Choose a point X outside
their union and draw c=MX.

Such X exists: one or two planes do not exhaust space. In the
coincident-plane case choose X outside that single plane.
c meets sigma only at M, and M is not on a; n6 therefore makes c
skew to a. Applying the same argument to tau makes c skew to b.
This gives infinitely many valid choices; uniqueness was not asked.

The construction uses only M not on a,b. Even though the n6
definition associates the supplied macro with skewness, no optical
decoding claim is needed or made for the task-125 glyph.

## 126

Let sigma=(m,P), tau=(n,P). They are distinct, since a common plane
would contain both skew lines. Draw their intersection c. This is
the **only candidate** for a transversal through P: any line through
P meeting m lies in sigma, and one meeting n lies in tau.

If c meets both m and n at finite points M,N, c is the unique solution.
If c is parallel to either line, it cannot meet that line and there
is no solution. P is off each line, so coincident-line cases do not arise.

An exact existence description is available. Let Pi_m be the plane
through m with direction span(dir m,dir n), and Pi_n the corresponding
plane through n. These are distinct parallel planes. There is no
solution precisely when P lies in Pi_m or Pi_n:

- P in Pi_m gives c parallel to n and disjoint from n.
- P in Pi_n gives c parallel to m and disjoint from m.
- Outside both, neither failure occurs, so the two finite
  intersections exist.

The two failures cannot occur simultaneously for one P because
Pi_m and Pi_n are disjoint. Figure 54 explicitly depicts the
successful case, with P,M,N on the common line. The uncertain
p/rho label does not affect this construction. The text's condition
P not on m,n alone is not an unconditional existence guarantee.

## 127

Literal answer: a,b may **intersect, be distinct parallel, or be skew**.
They cannot coincide. The given conditions do not determine one
of the three relationships.

Since alpha cap beta=m and a cap m=A, we have a cap beta=A.
But beta cap b=B!=A does not state b subset alpha or B subset m.
Even adding B subset m would still not settle the relationship.

Concrete examples already with B on m:
take alpha:z=0, beta:y=0, m={(t,0,0)},
a={(0,t,0)}, A=(0,0,0), B=(1,0,0).

- b={(1-t,t,0)} intersects a at (0,1,0).
- b={(1,t,0)} is parallel to a.
- b={(1,t,t)} is skew to a.

Each has beta cap b={B}. Coincidence would require the same
intersection with beta, contrary to A!=B. No unstated b-incidence
is inserted.

## 128

No. A line a intersecting alpha at exactly one point has a direction
outside alpha's direction space. Every line contained in alpha
has direction in that space; none can be parallel to a.

Equivalently, a parallel to such a line would be parallel to
alpha by n7, inconsistent with a singleton intersection.

## 129

Two possibilities: a intersects alpha in exactly one point, or
a is disjoint from alpha (hence strictly parallel to it).
a cannot be contained in alpha because then a and every line
in alpha would be coplanar, not skew.

Both cases exist. For alpha:z=0 and b the x-axis:
a={(0,1,t)} intersects alpha and is skew to b;
a={(0,t,1)} is disjoint from alpha and skew to b.
The word parallel here must exclude containment only because
the skew premise has independently excluded that case.

## 130

Let c be the unique line through M parallel to a. Then c subset alpha.

Under n7, a parallel to alpha means its direction lies in alpha's
direction space. Since M is in alpha, the whole line through M
with that direction lies in alpha, and it is the unique c by n4.
This includes a subset alpha and the possibility M on a, when c=a.

Synthetic argument for a disjoint from alpha: the plane through
a and M cuts alpha in a line through M parallel to a by n7's
trace theorem. Uniqueness identifies that trace with c.

## 131

a is parallel to b, allowing coincidence.

If m is disjoint from alpha, the trace theorem in beta and gamma
gives a parallel m and b parallel m; transitivity gives a parallel b.
If m subset alpha, the stated line intersections force
a=beta cap alpha=m and b=gamma cap alpha=m.
Thus the conclusion still holds in the source's inclusive sense.
beta=gamma can also make a=b; no distinctness is silently imposed.

## 132

The unique section is a nondegenerate parallelogram.

Draw the line through M parallel AB in face ABC; it meets AC at E
and BC at F. Through E in ACD draw a parallel to CD, meeting AD
at H. Through F in BCD draw a parallel to CD, meeting BD at G.
Join G,H. The section is EFGH, with EF parallel GH parallel AB,
EH parallel FG parallel CD.

Existence, edge membership and completeness can be checked exactly:
write M=aA+bB+cC, a,b,c>0 and a+b+c=1. The cutting plane is
lambda_C+lambda_D=c in tetrahedral barycentric coordinates.
Its four vertices are

- E=(1-c)A+cC, F=(1-c)B+cC;
- G=(1-c)B+cD, H=(1-c)A+cD.

All four are in the relative interiors of the named edges and
their convex hull is the whole section. Opposite edges AB,CD
have independent directions, so they determine a unique plane
direction through M. No endpoint or collapsed case survives
the explicitly strict face-interior premise.

## 133

There is a unique plane sigma=(MNP) and its section is a triangle
or quadrilateral, including a triangular vertex-hit boundary case.
The result must include the actual construction, not just name
its possible shapes.

M,N,P are in the interiors of the three different faces ABC,ABD,ACD.
They cannot be collinear: a line not contained in a face of a convex
tetrahedron has at most two boundary points; a line contained in a
face cannot include interior points of the other two faces.

Construction:

1. In ABD draw DN to N1=DN cap AB; in ACD draw DP to
   P1=DP cap AC. These are finite, distinct edge-interior points.
   Then N1P1=(DNP) cap (ABC).
2. If NP is not parallel to (ABC), take K=NP cap N1P1 and draw
   KM. If NP is parallel to (ABC), draw through M the parallel
   to NP. This is the trace sigma cap (ABC).
3. Clip this trace to triangle ABC. Its two extreme endpoints,
   with vertex coincidences retained, are the first section vertices.
4. On each adjacent face, join its known boundary endpoint to
   its given interior point (N in ABD, P in ACD) when applicable.
   Continue the trace into the next edge and into BCD if reached.
   Shared vertices are one vertex, not two. Equivalently apply H
   to the explicit six edges AB,AC,AD,BC,BD,CD to obtain the
   complete polygon even when a trace exits via a different edge
   from the illustrative panels.

For fig55а,б this yields E on AB, F on AC, G on CD, H on BD:
M on EF, N on EH, P on FG, section EFGH.
For fig55в it yields E on AB, F on AC, G on AD:
M on EF, N on EG, P on GF, section EFG. There is no fourth
vertex H in that panel.

Why only three or four vertices: a tetrahedron has four faces.
More specifically, let h be the plane functional. h(A) cannot
be zero, since the three face-interior points would then require
h(B),h(C),h(D) to be pairwise opposite signs, impossible.
After choosing h(A)>0, at least two of h(B),h(C),h(D) are negative.
All three negative give a triangle across AB,AC,AD; exactly two
negative and the third positive give a quadrilateral; exactly two
negative and the third zero give a triangle through that
tetrahedron vertex. Two zero values there
would violate one face-interior condition.

The supplied solved text is original **exercise content**, not an
old answer key. Its E-on-AB panel naming is not imposed as a
universal additional hypothesis.

## 134

Source membership is closed: M in triangle ADC, N in triangle BDC,
P in [AB]. It does not exclude endpoints or collinearity.

If M,N,P are noncollinear, construct their plane and section as
follows. Use barycentric coordinates ordered A,B,C,D:
M=(m_A,0,m_C,m_D), N=(0,n_B,n_C,n_D),
P=(1-p,p,0,0), all coefficients nonnegative with sums one.
Find a nonzero coefficient vector (k_A,k_B,k_C,k_D) satisfying
`k dot M=k dot N=k dot P=0`; it is unique up to scale.
The section is
`{lambda_i>=0, sum lambda_i=1, sum k_i lambda_i=0}`.
On every edge IJ with opposite signs k_I,k_J take
`R_IJ=(k_I J-k_J I)/(k_I-k_J)`; include zero vertices or whole
zero edges. Join by face incidence as in H. This gives the actual
unique triangle or quadrilateral, including a whole face if the
plane is its supporting plane. It is at least two-dimensional
because it contains three noncollinear given points.

P is already a section point and, when P is an interior point of
AB, is a section vertex unless AB is contained in the plane.
No division by k_I-k_J is made when both are zero.

If the three points are collinear/coincident, `(MNP)` is not a
uniquely defined plane: report the rank-1/rank-0 family in H,
not an arbitrarily chosen section. This is a real admissible case.
For example M=N=C and P=A gives the pencil through AC; planes
ABC and ACD are different allowed completions. Taking
M=N=P=D is not compatible with P in AB, so rank-0 is in fact
impossible for these particular disjoint domains. Rank-1 remains
possible, for instance the preceding example. No missing
noncollinearity is silently repaired.

## 135

1) Correct. If a,b are the given intersecting lines in beta,
choose X in alpha and draw through X a' parallel a and b'
parallel b. Their directions belong to alpha's direction
space because alpha and beta are parallel. The lines are
distinct and intersect at X. If alpha=beta the same construction
works, including choosing the original two lines.

2) Two planes are parallel if and only if one contains two
intersecting lines respectively parallel to two lines in the
other. Necessity is 1). For sufficiency the two independent
directions span the first plane's direction space and also
span the second, so the direction spaces agree. Equivalently,
a putative intersection trace would have to be parallel to
two distinct intersecting directions, impossible.
Coincidence is an allowed parallel case.

## 136

1) alpha and beta must be **distinct intersecting planes**.
A line with a unique intersection with alpha has a direction
outside alpha. Being parallel to beta puts that direction in
beta. Equal direction spaces, including coincident planes,
are impossible. Two unequal plane direction spaces in
three-dimensional space give intersecting planes.
Example: alpha:z=0, beta:y=0, line {(0,1,t)}.

2) alpha and beta are parallel in the original inclusive sense:
they may be disjoint or coincident. Every alpha direction is
parallel to beta, so its two-dimensional direction space is
contained in, and thus equals, beta's. Conversely equal direction
spaces make every line in alpha parallel to beta, even when
it lies in beta.

## 137

No, the conclusion is not forced. Both parallel planes
(including equal ones) and distinct intersecting planes are possible.

Counterexample: alpha:z=0, beta:y=0,
a={(t,1,0)}. The line is in alpha and disjoint from beta,
but alpha and beta intersect along the x-axis.
With alpha=beta, or two disjoint planes of the same direction,
the premise also holds and the conclusion is true.

## 138

True under the original definition, including containment.
Parallel alpha,beta have equal direction spaces. The direction
of a belongs to alpha's and therefore beta's direction space.
It follows that a is either contained in beta or disjoint from
it: in both cases a parallel beta.

An answer that rules out a subset beta would incorrectly use
a strict definition not used by this source.

## 139

On the domain where the named lines exist (A!=C and B!=D),
AC is parallel to BD.

AB and CD intersect at M and are distinct lines. Their plane
gamma contains A,C in alpha and B,D in beta. Its traces on
the two distinct parallel planes are AC and BD. These traces
are disjoint coplanar lines, hence parallel.

There is a literal-domain gap: the written set memberships and
segment intersection alone do **not** guarantee A!=C or B!=D.
For example alpha:z=0, beta:z=1,
A=C=(0,0,0), B=(1,0,1), D=(0,1,1).
The segments meet exactly at A, but `(AC)` is undefined.
Therefore the theorem is a valid proof with the named-line
distinctness condition, not an unconditional formula for all
assignments satisfying only the printed set conditions.
No source amendment is made.

## 140

1) Correct. A line in alpha has direction in alpha's direction
space, equal to beta's; it is parallel to beta. If alpha=beta
it is contained in beta, still parallel by n7.

2) Incorrect. For alpha:z=0, beta:y=0 choose
a={(t,1,0)}, b={(t,0,1)}. They are disjoint, even parallel,
and lie in their specified planes; alpha,beta nevertheless
intersect along the x-axis. Mere disjointness of one pair of
lines is not the two-direction plane-parallel criterion.

## 141

The planes are distinct parallel planes.

Use the independent affine edge basis AB,AD,AA1 with A=(0,0,0).
Then B=(1,0,0), D=(0,1,0), A1=(0,0,1);
C=(1,1,0), D1=(0,1,1), B1=(1,0,1).
Plane (A1DB) is x+y+z=1 and plane (D1CB1) is x+y+z=2.
Their direction spaces agree and they are disjoint.

These are affine coordinates for any parallelepiped, not an
assumption that the given solid is rectangular.

## 142

Two answers under the printed point-order information:
**10 cm or 50 cm**.

Set M as affine origin on line a and choose orientation with
the signed coordinate of A1 equal to 8 cm. The distance
|A1A2|=12 cm allows the signed coordinate of A2 to be
20 cm or -4 cm. It does not allow another same-ray
closer-to-M positive coordinate.

Projection from M between distinct parallel planes is a
homothety. Thus
`|A1B1|/|A2B2|=|MA1|/|MA2|`.

- M-A1-A2, M outside the slab: `25*8/20=10 cm`.
- A1-M-A2, M between the planes: `25*8/4=50 cm`.

The 12 cm gap excludes coincident planes. The given
25 cm length excludes coincident lines a,b and degenerate
triangles. No figure is attached to fix an order. Reporting
only 10 cm would add an unstated order assumption.

## 143

m is parallel to b, allowing coincidence.

From m subset gamma and m parallel a subset alpha,
m is parallel to alpha. Since alpha parallel beta,
exercise 138 gives m parallel beta. In delta, whose trace
on beta is b, the n7 trace theorem gives m parallel b.

If m subset beta, the stated intersection line is b=m.
If alpha=beta, or m=a, the same argument still applies.

## 144

The union is the **unique plane through the given point
parallel to the given plane**.

Let X be the point, pi that unique parallel plane. Every
admissible line through X has a direction in pi and hence
is contained in pi. Conversely each Y!=X in pi lies on
the line XY, whose direction is parallel to the given
plane; X itself is also on admissible lines. Thus their
union is exactly pi.

If X is in the given plane, pi is that same plane, not
the empty set: contained lines count as parallel in n7.

## 145

For both subparts use the parallelepiped's independent
affine edge coordinates with vertices
A000, B100, C110, D010, A1 001, B1 101, C1 111, D1 011.
Coordinate intervals below are closed, as are the source faces.

1) Write M=(m,0,0), N=(0,n_y,n_z),
P=(1,p_y,p_z), all parameters in [0,1].
Set u=(N-M) x (P-M) and h(T)=u dot (T-M).
If u!=0, take h=0 and apply H to the twelve edges listed below.
M is included on AB; all retained crossings and included
zero edges are joined in their face order.

2) Write M=(m_x,m_y,0), N=(n_x,0,n_z),
P=(1,p_y,p_z), all parameters in [0,1].
Use the same explicit normal and edge construction.

The twelve edges are
AB,BC,CD,DA; A1B1,B1C1,C1D1,D1A1;
AA1,BB1,CC1,DD1.
For each, H supplies the intersection formula, including
endpoints and whole contained edges. This is a complete
parameterized standard construction for either input placement.
For noncollinear inputs the result is a unique convex polygon
with 3-6 true vertices, possibly a whole face with four vertices.
No universal named polygon can be extracted without point data.

Both subparts admit collinear/coincident inputs, since face
boundaries are not excluded. For 1), M=A,N=A,P=B;
for 2), M=A,N=A,P=B. The named `(MNP)` then does not
specify a plane. Report the plane pencil through AB and
apply H to each completion, rather than pick one.
Rank 0 is also possible in 2), e.g. M=N=P=B, since B
belongs to all three specified closed faces. Rank 0 is
impossible in 1), whose two opposite specified faces
are disjoint; rank 1 is still possible.

This supplies both construction and investigation, including
the cases in which the printed data do not determine a unique plane.

## 146

Literal retained condition: the cutting plane passes through
N in [DM] and is parallel to "face [BCD]".
Interpret the face's parallelism semantically as parallelism
to its supporting plane (BCD). No bracket erratum is asserted.

Let t=|DN|/|DM|, 0<=t<=1. Since
M=(A+B+C)/3, N=(1-t)D+t(A+B+C)/3.
The unique requested plane has barycentric equation
`lambda_A=t/3`, because a plane parallel to (BCD)
has constant lambda_A.

Its complete section is triangle UVW, with

- U=(t/3)A+(1-t/3)B on AB;
- V=(t/3)A+(1-t/3)C on AC;
- W=(t/3)A+(1-t/3)D on AD.

Construct through N the two parallels to BC and BD;
their plane is the required plane. Obtain U,V,W from
the equal directed ratios
`AU/AB=AV/AC=AW/AD=1-t/3`, or from its face traces,
and join them. The triangle is homothetic to BCD
with centre A and ratio 1-t/3.

- N=D (t=0): the plane is (BCD) itself and the section
  is the whole face BCD, allowed by n10.
- 0<t<1: three interior edge points, ratio in (2/3,1).
- N=M (t=1): ratio 2/3 and a nondegenerate triangle.

M being the centroid of ABC does not make the cutting
plane parallel to ABC. Replacing the literal BCD by ABC
would solve a different problem.

## 147

For any three points on three pairwise-skew edges, the
three points are automatically noncollinear, even at endpoints.
Thus the requested plane and section are unique.

After vertex/direction relabelling, every such triple of
edges can be represented by AB,CC1,A1D1 in the affine
unit-cube frame. To see exhaustiveness, fix an x-edge
at y=z=0. A skew z-edge must have y=1; a skew y-edge
must have z=1. For those latter two to be skew, their
fixed x coordinates must differ. Reverse x if needed
to obtain the displayed representative.

Write M=(m,0,0), N=(1,1,n), P=(0,p,1),
with m,n,p in [0,1]. Their plane normal is
`u=(1-np, -(1-m+nm), (1-m)p+m)`.
This never vanishes. Indeed u_x=0 requires n=p=1,
and then u_y=-1. Hence no endpoint choice creates
an undefined plane.

Construct h(T)=u dot (T-M)=0, intersect the twelve
parallelepiped edges by H, and join by face incidence.
This gives the actual unique polygon, with 3-6 true
vertices. A cut may pass through a vertex or contain
another whole edge; both are retained by H.
No drawing, modern regularization, or assumption that
the points are edge-interior is needed.

## 148

Answers to 1)-5): **yes, yes, no, yes, no**.
For a cube [0,a]^3, a>0:

1. x+y+z=s, 0<s<=a, cuts an equilateral triangle at
   (s,0,0),(0,s,0),(0,0,s), with side s*sqrt(2).
2. z=a/2 cuts a square of side a.
3. A regular pentagon is impossible. A genuine pentagonal
   section uses five of the six faces, so by the three
   opposite-face pairs at least one pair of its sides
   lies in opposite parallel face planes. Those sides
   are parallel. A regular pentagon has no parallel
   sides, contradiction.
4. x+y+z=3a/2 cuts the six permutations of
   (a,a/2,0). The successive sides have length a/sqrt(2)
   and successive interior angles 120 degrees, giving
   a regular hexagon.
5. A convex planar section has at most one boundary
   side from each of the cube's six faces, so it has
   at most six true sides. Face-coincidence and
   vertex hits cannot create eight true sides.

The nonexistence arguments refer to actual section
vertices, not redundant collinear points on one side.

## 149

Under the n12 parallel projection, allowing collapse:

1. Point -> point.
2. Line -> line or point.
3. Nonzero segment -> segment or point.
4. Ray -> ray or point.
5. Nondegenerate angle -> angle, ray, or line. If the source's
   angle convention also includes straight/zero angles, a point
   is additionally possible for those degenerate inputs.
6. Plane -> plane or line.

Proof: projection is affine with a one-dimensional kernel
span(v). A line direction in the kernel collapses;
otherwise its affine parameter is preserved, giving
the specified line/segment/ray. A plane's direction
space has dimension two and meets the kernel in
dimension zero or one, never two, so its image has
dimension two or one.

For an angle's two distinct noncollinear ray directions,
their projected vectors can be independent (an angle),
on the same half-line (a ray), or on opposite half-lines
(a line). One ray may collapse while the other gives
a ray. Both cannot collapse, since a one-dimensional
kernel cannot contain both independent original
directions. Thus a nondegenerate angle cannot project
to a point, segment, or plane.

For example with vertical projection to z=0, the
directions (1,0,0),(0,1,0) give an angle;
(1,0,0),(1,0,1) give one ray;
(1,0,0),(-1,0,1) give a line.
The same nondegenerate classification holds whether an angle is
represented by its two boundary rays or the usual filled convex
angular region. The printed question says only "angle"; the
consulted n1-n13 prose does not define whether straight/zero
angles are included. This semantic boundary is therefore explicit:
a straight angle (two opposite rays) projects to a line or a
point, and a zero angle (one repeated ray) projects to a ray or
a point. If those inputs are allowed, include point in 5)'s
possibility set. It is not legitimate to assert the nondegenerate
no-point proof for collinear defining rays, nor to claim that
the source convention has been settled from these materials.

## 150

For the distinct feet A,B depicted in fig56а, draw the
two full lines L=(A1B1) and L'=(AB). When they meet
at a single finite point R, R is the requested
intersection L cap alpha.

Proof: L lies in the plane spanned by L and the
projection direction. Its trace on alpha is L'.
A point on both full lines therefore belongs to
L and alpha; conversely any L cap alpha projects
to itself and lies in L'. Extensions outside the
drawn alpha outline are allowed.

Complete cases:

- A!=B and L,L' intersect in one point: that point
  is the unique solution.
- A!=B and the full lines are distinct parallel:
  L is disjoint from alpha, so no intersection point.
- A!=B and L=L': L subset alpha; infinitely many
  common points, not a uniquely named point.
- A=B and A1!=B1: L is a projection fibre and
  L cap alpha=A, uniquely.
- A1=B1 would not define a source line; it is
  outside the domain of the named-line question.

The actual PNG shows no already drawn target R and
supplies no point-order/height data proving a finite
intersection in every textual input. It uses ordinary
parallel, not necessarily perpendicular, projection.

## 151

Let sigma=(A1B1C1), a well-defined plane by the
explicit original noncollinearity condition.

If the feet A,B,C are noncollinear as depicted in
fig56б, draw source side lines and corresponding
projected side lines. A finite intersection of
one such pair is a point of sigma cap alpha.
Two distinct such points determine the trace.

Complete construction when a first pair is parallel
or the obtained points coincide:

1. If one source side is contained in alpha, that
   full side line is already the trace, unless
   the entire sigma equals alpha.
2. If two constructed intersections coincide at
   a source vertex in alpha, try the opposite
   side pair. If that pair has a finite intersection,
   join it to the first point. If it is parallel,
   draw through the first point the parallel to
   that opposite source side/projected side.
3. If two source sides intersect alpha in two
   distinct finite points, join those points.
   Do not count the same vertex twice.

An exact classification covers all remaining cases.
Choose the fixed projection vector v and write
A1=A+h_A v, B1=B+h_B v, C1=C+h_C v.
For noncollinear feet, sigma is the graph of the
unique affine height function h on alpha with
values h_A,h_B,h_C.

- All heights zero: sigma=alpha, intersection is
  the entire plane, not a unique line.
- All heights the same nonzero value: the planes
  are disjoint parallel, so there is no trace.
- Heights not all equal: the unique trace is
  the line h=0. On an ij side with h_i!=h_j,
  its intersection is the point at directed
  parameter `t=h_i/(h_i-h_j)` on both the source
  side and its projected side. Equal zero heights
  give a contained trace side; equal nonzero
  heights give the parallel-side case. These
  formulas justify the geometric steps above.

If the feet are collinear instead, sigma contains
the projection direction and its image is a
line. Its intersection with alpha is exactly
that line: draw the line through any two distinct
feet. Three noncollinear source points cannot
all have the same foot, so two distinct feet
exist. This case always has a unique trace.

The original separator remains UNKNOWN. No
mathematical classification here depends on
decoding it, or on measuring drawn connector
slopes/heights.

## 152

The plane pi=(ADM) is always well-defined, including
M=B or M=C, since AD is an edge skew to BC.
Line PQ is always defined because opposite edges
AB and CD are disjoint. There is either one
intersection or the whole line, never a disjoint
parallel case for these closed-segment inputs.

Pictorial construction: in base plane ABC draw
AM and CP. Unless M=C and P=A, they meet at a
unique S. The auxiliary plane (DPC) contains
PQ and intersects pi in DS. Draw R=PQ cap DS
when that intersection is a point.
If the two full lines coincide, PQ lies in pi.
For M=C,P=A the auxiliary plane equals pi and
PQ lies in it directly. The base lines do not
have a distinct-parallel failure: their
intersection denominator is 1-m+mp, which
vanishes only in that coincident case.

Exact answer and case proof:
write
`M=(1-m)B+mC`, `P=(1-p)A+pB`,
`Q=(1-q)C+qD`, with m,p,q in [0,1].
In barycentric coordinates pi is
`m lambda_B-(1-m)lambda_C=0`.
Its functional has values
`h(P)=mp>=0`, `h(Q)=-(1-m)(1-q)<=0`.
Set `S0=mp+(1-m)(1-q)`.

- If S0>0, the unique intersection is
  `R=((1-m)(1-q)P+mp Q)/S0`.
  It lies on [PQ], including an endpoint when
  one of the two weights is zero.
- If S0=0, both P,Q are in pi and the entire
  line PQ is the intersection. Explicitly:
  for 0<m<1 this means P=A,Q=D;
  for m=0 it means Q=D, with any P on AB;
  for m=1 it means P=A, with any Q on CD.

This completes the source construction and
all endpoint/existence cases without adding
a unique-intersection hypothesis.

## Freeze Summary

All source exercises 121-152 and their requested subparts have author
conclusions with arguments. All constructions have outputs, existence
conditions and degeneracy handling. Actual original figure observations
are separate from textual constraints and derived geometry.

Items needing parent attention before an edition-based answer workflow:
125 optical macro; fig54 p/rho glyph; 151 separator; literal 146 `[BCD]`;
126 nonexistent-transversal placements; 127 nondetermined relationship;
134/145 undefined-plane placements; 139 named-line distinctness domain;
142 two point orders; 149 angle-degeneracy convention;
150/151 absent or nonunique intersection requests;
152 contained-line cases. These are author findings, not reviewed decisions,
errata approvals, or permission to rewrite source/edition text.

The complete report and derived precursor are frozen by the companion
manifest. Parent may disclose this author material to an original-first
reviewer only after that reviewer's Stage A freeze. This author has not
messaged the reviewer or inspected their work. A later change must be a
separately authorized revision, not a silent overwrite of this freeze.
