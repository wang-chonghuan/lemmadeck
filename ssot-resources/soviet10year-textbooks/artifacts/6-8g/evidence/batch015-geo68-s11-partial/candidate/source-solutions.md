# Independent Source Solutions, Before Drafting

These are author derivations, not an independent semantic review or approval.
All 17 selected written seeds are accounted for before alternatives are drafted.
Only the four allowed JSON files and fig-59 final SVG supply source facts.

## Input And Figure Evidence

Official `prepare.py inspect --book 6-8g --lesson geo68-c1-s11` succeeded.
The official `prepare.prepare_seed` function produced the exact seed projection;
its JSON stdout was persisted using apply_patch to obey the scratch-write rule.
The original official canonical digest is
`1fb9c2596d8968761d1dacf192df569fe028a9a981c333e961fa18cbe7c1f890`.
Selected paragraphs 0, 3, 4, 8, 11 and 18 are definitions/conventions, not solved
exercises. Figures 54 and 56 are illustrative references in definitions whose
complete textual statements suffice; no claim depends on their pixels.

Actual fig-59 observation: the entire 640 by 780 canvas was visible, including
the rightmost labels a), b) and the bottom. Panel a is two concentric circular
boundaries with oblique hatching only between them and an unhatched central hole.
Panel b has a curved upper boundary, straight horizontal diameter and hatching
throughout the enclosed half-disk region. Thus b includes interior, not just arc.
This is input observation only; passed figure/display reviews are not repeated.
Asset SHA-256: `fafd77ca974c3bb2436977de88725f385bc800f6d442ee43c2e6d03172745bcf`.

Renderer recovery: loading native resvg inside the app's Node REPL failed with
different-Team-IDs code-signature error and produced no image. The exact existing
offline svg_raster.js then ran in a child Node with explicit cwd W and its output
captured in memory, without any filesystem writes. First image opening contained
only a), b): resvg did not resolve SVG CSS variables. A necessary second opening
resolved only each asset-declared `var(--role, #hex)` fallback in memory, through
the same existing renderer. Geometry, dimensions and canonical bytes remained
unchanged. This yielded the complete visible figure described above. No crops,
resize, OCR, composite, new diagram or asset was made.

Usage: two image openings total, two native full-canvas observations (first
unusable, second usable), zero fresh agents, zero paid calls, zero new assets.
No images are returned to the parent. No further image openings are planned.

## Solutions

107: A valid freely constructed triangle, quadrilateral or pentagon has perimeter
equal to the sum of its 3, 4 or 5 measured side lengths, each counted once including
the closing side. No unique numerical answer exists before a particular drawing
and measurements. Recognition can assess summation but not drawing or measurement.
Any supplied numeric side lengths in the choice stem will be explicitly authored
data, never claimed to be original measurements.

108: In a simple closed polygonal chain, every vertex has the next edge in cyclic
order; this is a bijection, so n=p. The closing edge prevents the open-chain n-1 rule.

109: False for arbitrary polygonal chains. A finite open segment can be bypassed
around an endpoint; its complement is connected. A simple closed chain separates
two regions by supplied paragraph 0. A self-crossing bow-tie chain has two bounded
lobes and an exterior, so closed alone does not imply exactly two regions.

110(1): UNRESOLVED. The allowed lesson does not define whether an angle is only
its rays or a filled sector, nor the permitted angular range (including reflex
angles). Do not key a vertex-count answer. Conditional result only: if both are
proper convex filled sectors, their bounded positive-area polygonal intersection
has 3 or 4 sides, since it is the intersection of four half-planes. Four occurs
for opposite-facing wedges making a diamond. Three occurs from sectors
{x>=0,y>=0} and {y>=1,x+y<=2}, giving (0,1),(1,1),(0,2).
These supplemental conditional models do not establish the missing source domain.
The entire source task 110(1) remains deferred.

110(2) and 111: A triangle is a filled polygon by paragraph 3 and is convex.
The intersection of two triangles is convex and bounded, with at most six active
side lines. A positive-area polygon therefore has 3,4,5 or 6 vertices.
Degenerate intersections can also be empty, a point or a segment.
Existence witnesses, with T=conv{(0,0),(6,0),(0,6)}:
triangle: T intersect itself.
quadrilateral: intersect T with conv{(-10,11),(11,-10),(11,11)}, imposing x+y>=1;
vertices (1,0),(6,0),(0,6),(0,1).
pentagon: intersect T with conv{(4,4),(4,-14),(-14,4)}, imposing x<=4,y<=4;
vertices (0,0),(4,0),(4,2),(2,4),(0,4).
hexagon: intersect T with conv{(4,4),(4,-3),(-3,4)}, additionally x+y>=1;
vertices (1,0),(4,0),(4,2),(2,4),(0,4),(0,1).
empty: translate T by (10,10). Point: T intersect -T gives {(0,0)}.
segment: reflect T across its bottom side, giving [(0,0),(6,0)].
No nonconvex polygon occurs. No heptagon occurs. These are existence examples,
not a claim that every polygon of each type is representable.
Choice recognition loses original construction of the witnesses.

112: Examples include empty set and singleton (paragraph 18), segments, rays,
filled triangles and filled squares. Each segment joining two points stays in the
set (for a ray, nonnegative parameters stay nonnegative under convex combination).
Free recall of further examples cannot be verified by a closed option inventory.

113: Segment yes; ray yes; set of three distinct points no. For the finite set,
choose any two distinct points: their segment has infinitely many points absent
from the three-point set. Collinearity does not save convexity.

114: Every filled triangle is convex, e.g. it is an intersection of three
half-planes. Quadrilaterals need not have one common verdict: square yes; the
simple quadrilateral (0,0),(4,0),(1,1),(0,4) no. Its diagonal from (4,0) to
(0,4) contains midpoint (2,2), outside the polygon.

115: a is an annular region, nonconvex: opposite points on a circle lying within
the ring have midpoint in the hole. The punctured plane is nonconvex: choose
P+v and P-v around its removed point P, v nonzero; their midpoint P is missing.
b is the shown filled half-disk, convex as intersection of a disk and half-plane.
Disk convexity follows ||(1-t)u+tv|| <= (1-t)||u||+t||v|| <= r, 0<=t<=1.
For (2), the allowed definition of "circle" is absent but the verdict is invariant:
a positive-radius disk without center lacks the midpoint of two antipodal points;
a circumference also lacks that midpoint (removing its center changes nothing).
Retain the original term and this unresolved semantic distinction. This invariant
classification is NOT a resolution of the general circle convention.

116: UNRESOLVED. If "circle" is a filled disk, two nested disks have convex union.
If it means two positive-radius circumferences, their union is not convex:
each line meets the union in at most four points, while a segment between two
distinct union points contains infinitely many points. No textual definition in
the supplied lesson binds this noun, and fig-59 has no pair of circles or caption
defining the general term. Defer the source task; do not reuse answers.

117: Unions can be convex or nonconvex. Two overlapping collinear segments
[0,2] and [1,3] yield [0,3], convex. Disjoint [0,1] and [2,3] miss points between.
Connected alone is insufficient: perpendicular segments through the origin miss
the midpoint (1/2,1/2) between (1,0) and (0,1). A square and a smaller contained
square have the larger square as their convex union. Choice loses drawing examples.

118: For arbitrary X,Y in A intersect B, both belong to A and B. Convexity of
each gives [X,Y] subset A and subset B, hence subset A intersect B. Empty and
singleton intersections are convex per paragraph 18. Recognition of a proof is
not independent proof production.

119: A convex polygon contains every segment between its points; a nonconvex
one has a pair whose segment escapes. Square and concave quadrilateral above
give examples. Difference concerns the filled polygon, not merely the outline.
Choice cannot demonstrate drawing either example.

120: Minimum 3 vertices for a polygon and for a convex polygon. Triangles are
convex, so nonconvex polygons need at least 4; the concave quadrilateral above
realizes 4. A pentagon is not the first possible concave example.

121: From one vertex draw n-3 diagonals to nonadjacent vertices. They stay inside,
do not cross except at the common endpoint, and each adds one region: 1+(n-3)=n-2.
Equivalently the n-1 rays to the other vertices bound n-2 successive triangles.
Adding a ray through an edge interior adds a triangle, so n-2 is the minimum
among such triangular partitions. Drawing the fan is not assessed by selection.

122: A convex polygon contains all diagonals by its segment definition.
For a nonconvex simple polygon, take a reflex vertex V with neighbors U,W. The
diagonal UW crosses the excluded local wedge at V, so some portion escapes.
Thus "all contained" characterizes convexity and "at least one escapes"
characterizes nonconvexity. Triangles have no diagonals: universal containment
is vacuously true and triangles are convex. Treat containment as including
boundary points, consistent with paragraph 3. Alternative pairs must differ
mathematically, not by synonymous labels for nonconvexity.

123: Each vertex joins n-3 nonadjacent vertices, giving n(n-3) endpoint counts.
Every diagonal counted twice, so D=n(n-3)/2. For n>=3, D=n iff n-3=2, hence n=5.
D>n iff n-3>2, hence n>=6. A pentagon has 5 diagonals; a hexagon has 9>6.
This counts pairs and works for simple convex or nonconvex polygons.

## Handoff Status

Drafting may now proceed for invariant meaningful tasks. Source 110(1) is
partially deferred and 116 entirely deferred. Every construction/measurement/
free-recall/proof-production loss will be explicit in coverage. No full resolution
of the source conventions, no semantic approval, no descendants.
