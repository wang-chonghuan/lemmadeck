# Stage 1: Independent Source Solutions

Ticket STEMROBIN-184; independent worker184-3. Sole command cwd:
`/Users/yong/.codex/worktrees/a07e/lemmadeck`.

This document was written before reading any choice seed, view, internal draft,
choice-author report, answer key or answer-author report. It is a mathematical
checkpoint, not a choice review, answer Gate2 approval or repeat figure approval.
Only the new reviewer directory is owned. The directory was verified absent
twice and created by an exclusive `mkdir` before writing.

## Authority and Conventions

Read the complete durable modern lesson, exercises and figure manifest for
`geo910-c1-s3-n36`, the complete four current FigureSpecs, the choice skill and
contract/review references, image-batch rules, and answer Gate2 reference.
Lesson prose index 0 states the theorem. Indices 1, 4 and 5 are proof context,
not additional definitions or solved-example seeds.

For a normal AC, oblique AB and its nonzero in-plane projection CB, and a
direction u parallel to the projection plane,
`AB = AC + CB` as directed vectors and `u dot AC = 0`; consequently
`u dot AB = u dot CB`. This proves both directions of the theorem.

Perpendicularity of spatial lines here concerns their directions, including
skew lines. This is required by the lesson's own fig-131: m intersects the
extension of CB to the right of B, not necessarily AB. Direction parallel to
a plane is not the same as a line lying in that plane.

If X has orthogonal projection H on a plane, height h, and l is a line in that
plane, then `d(X,l)^2 = h^2 + d(H,l)^2`. The foot in the plane and the
three-perpendicular theorem justify that this is the shortest distance.

## Actual Image Observations

Before opening, byte equality of each sibling spec/SVG with its durable
edition pair was established. Existing render reports hash the same spec/SVG
and say pass. For 131/132, display-check.json binds spec, SVG, render and PNG.
For 133/134, report.json binds the current spec, SVG, render and PNG; successful
render.call.json names that PNG and spec, and offline-display-check.json binds
the same SVG. All four PNG hashes equal the supplied hashes. No rerender.

1. fig-131: complete 640 x 460 preview, opened once. A is on the upper patch,
   above-left of C; AC and AB are solid and end at C and B on the common
   horizontal base. C is left of B. The alpha oval has a solid lower contour
   and dashed upper contour. m crosses the extended base right of B, solid
   below-left and dashed above-right, with one small projected angle marker.
   A, B, C, alpha and m are readable; right and bottom contours are visible.
   The perspective depiction does not license measuring spatial angles.
2. fig-132: complete 640 x 520 preview, opened once. Directed arrows are A to C,
   A to B, C to B, and M to N. C and B are on the plane oval; m is a separate
   solid carrier continuing past M/N, with M's dot below-left of N. All labels,
   including the rightmost N and bottom m/oval boundary, are visible. No
   right-angle assumption or scalar-product answer is printed.
3. fig-133: complete 640 x 560 preview, opened once. M above A; A rear-left,
   B front-left, C front-right and D rear-right in the affine rectangle
   depiction. All eight solid segments AB, BC, CD, DA, MA, MB, MC, MD are
   visible. MC crosses AD without a marked point: this is a projection
   crossing, not another spatial vertex. No AC diagonal, dimensions or
   right-angle answer marks. Rightmost D and bottom B/C labels are readable.
4. fig-134: complete 640 x 560 preview, opened once. AB is the bottom edge;
   C is above-right of its midpoint. N is the top endpoint and M the lower
   endpoint of a solid vertical projected MN. M projects inside the triangle;
   MN crosses AC without a marked point and stops above AB. All five labels,
   endpoint dots and three triangle edges are readable, including bottom
   A/B. No construction feet or solved perpendiculars are supplied.
   The prose, not screen height/interiority, identifies the plane-normal
   situation. N is treated as the stated plane foot; N need not be inside
   the triangle. The diagram is not a planar equilateral metric drawing.

## 331

Both assertions are false under the lesson's spatial-direction convention.
Use alpha: z=0, C=(0,0,0), B=(1,0,0), A=(0,0,1).

1. The z-axis AC is perpendicular to CB, but its direction (0,0,1) has dot
   product -1 with AB=(1,0,-1), so it is not perpendicular to AB. The missing
   hypothesis is a line direction parallel to alpha (in-plane suffices).
2. The line `(0,t,1)` has direction (0,1,0), perpendicular to both AB and CB,
   but lies at z=1, not in alpha. The two perpendicularities force a direction
   parallel to alpha, not containment. Imposing intersection with both lines
   would change the lesson's convention and the assertion's interpretation.

## 332

The replacement is true in both directions. A line parallel to alpha has
direction u with zero normal component. Thus `u dot AB = u dot CB`, regardless
of the line's offset from the plane. The proof also covers in-plane lines as
directions; strict disjoint line-plane parallelism still satisfies it.

## 333

Use the actual arrow directions: `vector(AB)=vector(AC)+vector(CB)`.
For nonzero `u=vector(MN)` parallel to alpha,
`u dot vector(AC)=0`, hence
`u dot vector(AB)=u dot vector(CB)`.
Either dot product vanishes exactly when the other vanishes. This proves the
necessary and sufficient condition by scalar products, not merely one
implication. Screen angles and the particular displayed direction of MN are
not perpendicularity givens.

## 334

Let O=a intersect alpha and P be the given in-plane point.
If a is oblique, choose Q on a outside alpha, drop QH perpendicular to alpha,
and obtain its nonzero projection line OH. In alpha construct the unique
line through P perpendicular to OH. The theorem proves it perpendicular to a.
If a is perpendicular to alpha, its projection is a point and every in-plane
line through P is perpendicular to a; there is no unique solution. A
perpendicular in direction need not meet a at the given P. Drawing recognition
alone cannot evidence that the learner independently executed this construction.

## 335

Write AB=x>0, AD=y>0, MA=h (the figure depicts M off the plane).
The projections of MB and MD are AB and AD. Since BC perpendicular to AB
and DC perpendicular to AD in the rectangle, MB perpendicular to BC and
MD perpendicular to DC. The right angles are at B in MBC and D in MDC.

`MA^2=h^2`, `MB^2=h^2+x^2`, `MD^2=h^2+y^2`,
`MC^2=h^2+x^2+y^2`.
Therefore MC is strictly longest and MA strictly shortest. The order of
MB and MD depends on x versus y; they are equal only for a square. The
unmarked projected crossing MC/AD adds no spatial incidence.

## 336

For each supporting side line l in {AB, BC, CA}, construct its perpendicular
foot F_l from N in the triangle's plane; extensions of sides may be necessary.
The lines NF_AB, NF_BC, NF_CA give the three planar perpendiculars through N.
Join M to the same three feet. Their projections are NF_l, so by the theorem
MF_AB, MF_BC, MF_CA are perpendicular to their corresponding side lines.
These are three perpendicular constructions through each point, not a single
new line through both M and N perpendicular to all three nonparallel sides.

In an affine spatial drawing the plane perpendicular directions can be
obtained by lines parallel to the appropriate altitudes/medians of the
equilateral triangle; one must not use the page's Euclidean angle as a spatial
right angle. No centroid, midpoint or N-inside-triangle assumption is given.
If N lies on a supporting line, its planar perpendicular is still constructed
through N and MN is the perpendicular from M to that line; NF is then a
zero-length foot segment, not a nonzero projection for theorem application.

## 337

1. The planar altitude to the hypotenuse is
   `r=ab/sqrt(a^2+b^2)` by equality of triangle-area formulas. If F is its
   foot, MF is perpendicular to the hypotenuse, and
   `d=sqrt(h^2 + a^2*b^2/(a^2+b^2))`, for a,b>0.
2. The largest angle is opposite side 75 cm. Semiperimeter is 80 cm;
   Heron's formula gives area
   `sqrt(80*60*15*5)=600 cm^2`. Its altitude is `2*600/75=16 cm`.
   Therefore the spatial distance is
   `sqrt(60^2+16^2)=sqrt(3856)=4*sqrt(241) cm`.
   The planar foot is on the 75-cm segment: using its adjacent side 20 cm,
   its coordinate from that endpoint is
   `(20^2+75^2-65^2)/(2*75)=12 cm`, between 0 and 75.

## 338

1. Let H be the projection of s. Removing the common h^2 shows H is
   equidistant from the two distinct parallel lines. H is on their middle
   parallel, at distance m/2 from each. The common distance is
   `sqrt(h^2+m^2/4)`, for m>0, h>=0.
2. Take a: y=0,z=0 and b: y=44,z=0 with the same free x direction.
   c's projection has distance `sqrt(39^2-15^2)=36 cm` from a, so it may
   have y=+36 or y=-36. Its height may have either sign, irrelevant to
   distance. The two distances to b are
   `sqrt(8^2+15^2)=17 cm` and
   `sqrt(80^2+15^2)=sqrt(6625)=5*sqrt(265) cm`.
   Both branches satisfy every stated condition. There is no premise that
   c's projection lies between a and b; returning only 17 cm loses a branch.

## 339

The projection H of M is equidistant from the three vertices after removing
the common height b^2. H is the circumcenter of the equilateral triangle,
also its incenter. Its distance to each supporting side line is
`r=a*sqrt(3)/6`. Hence each requested distance is
`sqrt(b^2+a^2/12)`. The circumradius `a*sqrt(3)/3` is not the side distance.

## 340

Not in general; all vertex distances are equal if and only if the rhombus
is a square. Projection H of the off-plane point is equidistant from each
opposite parallel side pair, hence is their middle-strip intersection, the
rhombus center O. With half-diagonals p,q and height h, vertex distances are
`sqrt(h^2+p^2)` and `sqrt(h^2+q^2)`. They coincide exactly when p=q,
equivalently the rhombus is a square.

Concrete counterexample: A=(2,0,0), B=(0,1,0), C=(-2,0,0), D=(0,-1,0),
M=(0,0,1). All four side-line distances are `3/sqrt(5)`, while distances
to A,C are sqrt(5) and to B,D are sqrt(2). An equal side-line distance
does not itself imply a circumcenter.

## 341: Literal Text and Interpretation Qualification

Exact durable text (including the question-mark-plus-period `？.`):

> 341°.
> 1) 空间一点到三角形的顶点等距，也同它的边所在的直线等距. 这个三角形是什么三角形？.
> 2) 对于四边形解答上题.

The normal textbook interpretation is TWO separate equal-distance groups:
all vertex distances equal to one another, and all supporting-side-line
distances equal to one another, not necessarily equal between the groups.
Use a nondegenerate planar triangle and an ordinary simple planar
quadrilateral. These qualifications are explicit, not an edit to the source.

Let H be the spatial point's projection and h its height. Equal vertex
distances give a common planar circumradius R about H. Equal side-line
distances give a common planar distance r from H. Each side is a chord
of that circle, of length `2*sqrt(R^2-r^2)`. Thus every side has equal length.

1. A nondegenerate triangle with three equal sides is equilateral. This
   also supplies the converse, using its common incenter/circumcenter and
   any height above it.
2. The planar quadrilateral is cyclic and has four equal sides, hence
   a rhombus. Opposite angles are equal in a rhombus and supplementary
   in a cyclic quadrilateral, so each is 90 degrees: it is a square.
   Its center and any height above it supply the converse.

If the words are instead read as ONE common numerical distance for vertices
and side lines, there is no nondegenerate solution: a positive-length chord
has supporting-line distance strictly less than its endpoint radius, and
adding the same h^2 preserves the strict inequality. Do not silently replace
that reading with an asserted regular polygon.

If "quadrilateral" is allowed to be skew in space, square is not forced:
a four-edge cycle through the vertices of a regular tetrahedron has equal
vertex distances and equal edge-line distances from its center, yet is not
planar. The square conclusion depends on the lesson's ordinary planar-polygon
meaning. A visible question must preserve or explicitly qualify that meaning.

## Usage and Deferred Gates

Current fresh worker context: four image opens total, one each 131-134,
zero crops/reopens/renders. Limit 8 for this task and continuation; 4 remain.
Parent historical use was supplied as 24/24 and is not reset or borrowed.
No paid calls, network, DB, installs, Git, publish, other-chat operations,
descendants, source edits or other writers' edits.

Choice fidelity/leakage, every visible option, internal rationales/keys and
whole-package coverage remain unexamined at this Stage1 checkpoint.
Answer Gate2 comparison, input-chain/finalization and product acceptance
are not approved. Construction/proof production losses must be judged when
the visible choice package is disclosed. No unresolved mathematical branch
has been silently removed.
