# Source-first independent review

Stage sealed before opening view-only.json, draft.json, source-solution or handoff. Date: 2026-11-19. Reviewer: STEMROBIN-188-6 independent semantic reviewer. Scope: 6-8g / geo68-c1-s11 / all 17 sources, 107-123.

Seed canonical SHA-256: `e0a2ede7b0fe880b5d336209c15f07efcb070aefce99e76e85afec022667bb12`.
Seed file-byte SHA-256: `d5dd07e701b1d4e9d1009ca6ca2ce8e59d63870dbd2606d817e01cd5f2f4417f`.

## Definitions and actual visual evidence

- Selected seed definitions: polygon is a simple closed polygonal line together with its interior; perimeter sums every boundary edge; convexity quantifies over every pair of points and the entire joining segment; singleton and empty set are convex.
- Authorized supplemental definitions only: `ssot-resources/soviet10year-textbooks/artifacts/6-8g/lessons/geo68-c1-s1/lesson.md`, lines 29 and 43, circle circumference means distance exactly r; circle means closed disk, distance at most positive r. File SHA-256 `7cf15f6e59773f90b6f156b504c5e7227106ea31548113c144be8a35fb98b73a`.
- `ssot-resources/soviet10year-textbooks/artifacts/6-8g/lessons/geo68-c1-s12/lesson.md`, lines 17, 23, 27 and 31: half-plane includes its boundary; an angle includes the two rays AND the selected region; the two regions can give a convex and a nonconvex angle. File SHA-256 `97232b523e70612cbc5b0008bb6102c28d61dd578344905d370d3577c068d97f`. No examples or answers were consulted.
- Actual fig-59 asset: `ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-59.svg`; byte SHA-256 `fafd77ca974c3bb2436977de88725f385bc800f6d442ee43c2e6d03172745bcf`.
- Local complete rendered evidence: `.intentfold/tickets/STEMROBIN-188/tmp/s11-choice-review/fig-59-full.png`; byte SHA-256 `fe3d49f7aae3738ce74c2c6165c00efa03e37143265a5f8db447f17020213fbf`. SVG bounds 640x780, no crop, rendered with white background.
- One batch; exactly ONE image loaded into reviewer context by `view_image`, with zero reopens/crops. Batch count 1 <= 8; cumulative context count 1 <= 24. The SVG text read is not a second visual inspection. Observed all of upper a), lower b), their rightmost edges and bottommost label: a) concentric circular boundaries, hatching only in the annulus, central hole white; b) filled/hatched upper half-disk with a straight horizontal diameter forming part of the boundary, NOT just a semicircular arc. No authored figures.

## Independent source solutions

### 107
Draw a valid triangle, quadrilateral and pentagon; measure EACH side in one common length unit and add all side lengths. No fixed numerical answer exists without the learner's own drawings/measurements. Mathematical sample constructions (not a claim of executed ruler work): a 3-4-5 right triangle has perimeter 12; a 2-by-3 rectangle has perimeter 10; pentagon (0,0),(2,0),(3,2),(1,3),(-1,2) has perimeter 2+4sqrt(5). Production skills include making three figures, choosing measurements and recording units and measured sums.

### 108
n=p. The simple closed boundary traverses one edge from each vertex to the next cyclically, so vertices and edges correspond one-to-one. Interior triangulation edges are not polygon sides.

### 109
False. An open two-segment broken line does not enclose a separate region: one can travel around either end. A simple CLOSED broken line separates inside and outside. The universal statement fails regardless of whether self-intersecting closed broken lines are also permitted. A crossing closed line can additionally produce more than two complement regions.

### 110
1) A bounded polygon that is exactly the intersection of two complete angle regions can have 3 or 4 vertices, and both are possible. This result MUST NOT be justified by assuming all angles convex or by treating angles as two rays.

Two convex angles: at most four boundary half-planes, hence at most four polygon edges. A polygon has at least three. Example triangle: C={x>=0,y>=0}; D={x+y<=1,x+2y>=-1}; the second inequality of D is redundant on the triangle. Example quadrilateral: C as above, D={x+y<=3,2x+y<=4}; vertices (0,0),(2,0),(1,2),(0,3).

One convex angle C and one reflex angle R: R=H1 union H2 for two closed half-planes. A bounded C intersect R is the union of the bounded sets C intersect H1 and C intersect H2. Each positive-area such set is a triangle cut from C and includes C's apex: the retaining half-plane must cut both recession rays at positive finite intercepts. If one triangle contains the other, the union is a triangle; if their two ray intercepts have opposite order, the union is a concave quadrilateral. Explicit latter example: C={x>=0,y>=0}, R={2x+y<=3 OR x+2y<=3}; intersection has vertices (0,0),(3,0),(1,1),(0,3), with reflex angle at (1,1). There cannot be a fifth edge.

Two reflex angles cannot have a bounded nonempty polygonal intersection: each excludes an open sector of angular width <180 degrees; those two omitted direction sectors cannot cover all 360 degrees. A direction outside both gives common points arbitrarily far away. Straight angles are convex half-planes and do not create extra possibilities. Unbounded, empty or lower-dimensional intersections are not polygons in this part.

2) Two triangles are convex, so a polygonal intersection is convex and uses at most their six supporting boundary lines: 3,4,5,6 vertices, all realizable. For T1={x>=0,y>=0,x+y<=4}, T2={x<=3,y<=3,x+y>=1} yields hexagon (0,1),(1,0),(3,0),(3,1),(1,3),(0,3). Replace y<=3 by y<=5 to get a pentagon; additionally replace x+y>=1 by x+y>=-1 to get a quadrilateral; containment gives a triangle.

### 111
Full intersection classification for two closed, filled, nondegenerate triangles: empty set, singleton, nonzero segment, or a filled convex polygon with 3,4,5,6 vertices. It is never a nonconvex polygon, never an unbounded region, and never just a hollow polygonal boundary. Empty: separate triangles. Point: triangles touching at one vertex on opposite sides. Segment: triangles with common base and third vertices strictly on opposite sides. Triangle: containment. Quadrilateral/pentagon/hexagon: the explicit half-plane examples in 110. Independent source capability includes actually constructing drawings for these cases, not just naming categories.

### 112
Examples: point, empty set, segment, ray, line, closed half-plane, filled triangle, convex quadrilateral, closed disk. Disk convexity follows from |(1-t)P+tQ-O| <= (1-t)|P-O|+t|Q-O| <= r. A circumference is not convex, since the segment between opposite points leaves the circumference.

### 113
1) Segment: convex; all between-points segments remain in it.
2) Ray: convex; writing points O+su with s>=0, their convex combinations have nonnegative parameter.
3) Exactly three distinct points alone: not convex, whether collinear or noncollinear. A segment between two distinct points has infinitely many intermediate points; a finite three-point set cannot contain all of it. Three vertices alone are not a filled triangle.

### 114
1) Filled triangle: convex, equivalently intersection of three closed half-planes.
2) Quadrilateral: not necessarily convex. A rectangle is convex; the simple quadrilateral (0,0),(3,0),(1,1),(0,3) is concave, and the segment joining (3,0) and (0,3) is not contained in it.

### 115
1) Annulus fig-59 a): not convex; two opposite points in the annulus have a joining segment through the missing central disk.
2) Closed disk minus its center: not convex; opposite retained diameter endpoints have a segment passing through the deleted center.
3) Plane minus one point O: not convex; take O-v,O+v with v nonzero, both retained, but their segment contains O.
4) Filled semicircle fig-59 b): convex, being a closed disk intersected with a closed half-plane. Its diameter is present. Do not replace it by a semicircular arc.

### 116
Yes. Two disks with one contained in the other have union equal to the larger convex disk (equal disks work as well). The claim is existential, not a claim that every pair of disks has convex union. Two disjoint positive-radius disks give a nonconvex union.

### 117
Both are possible. Convex union example: adjacent closed rectangles [0,1]x[0,1] and [1,2]x[0,1], union [0,2]x[0,1]. Nonconvex example: [0,1]x[0,1] and [2,3]x[0,1]; the segment from (1,1/2) to (2,1/2) has interior points in neither rectangle. These are mathematical construction descriptions; the source requests drawings as independent production.

### 118
For arbitrary P,Q in A intersect B, convexity of A gives [P,Q] subset A, and convexity of B gives [P,Q] subset B. Thus [P,Q] subset A intersect B. If the intersection is empty or singleton, the convention explicitly includes it as convex. This is a universally quantified proof, not one pictured example.

### 119
Convex construction: rectangle (0,0),(3,0),(3,2),(0,2). Nonconvex construction: (0,0),(3,0),(1,1),(0,3); (3,0) to (0,3) leaves its interior. The difference is containment of the complete segment for EVERY pair of points, not just some pairs, connectedness, smoothness or whether the boundary is closed. Drawing both and explaining the definition are independent capacities.

### 120
Convex minimum: 3, a nondegenerate triangle. Nonconvex minimum: 4, since every triangle is convex but the concave quadrilateral above exists. Collinear/zero-area chains are not polygons with an interior.

### 121
A fan from one vertex to all n-3 nonneighbor vertices yields n-2 triangles. Convexity keeps all fan diagonals inside. If a decomposition uses only rays from that vertex and all resulting pieces are triangles, each of the n-2 opposite original boundary edges requires a triangular piece; rays that hit an edge interior can subdivide further, not reduce the minimum.

### 122
1) Convex polygons contain every diagonal, since all diagonal endpoints are points of the polygon.
2) Every nonconvex simple filled polygon has at least one diagonal not contained in it. The reverse implication needs proof; the definition alone directly proves only the forward implication.

Proof of reverse: let H be the convex hull of the polygon's vertices. Hull edges join polygon vertices. If every such edge lies in polygon P, then boundary H subset P. P is a simple polygon and its exterior is connected. Any point of H outside P would have a path to infinity in the exterior of P, necessarily crossing boundary H subset P, a contradiction. Thus P=H and P is convex. Contrapositively, a nonconvex P has a hull edge not wholly in P; it joins two nonadjacent polygon vertices (an actual side is contained in P), hence is an external diagonal. For a triangle the universal diagonal condition is vacuously true, consistently with convexity.

### 123
D=n(n-3)/2: each vertex connects diagonally to n-3 vertices, with each segment counted at its two endpoints.
1) D=n iff n(n-3)=2n; since n>=3, n=5. A pentagon has five sides and five diagonals.
2) D>n iff n>5, i.e. every integer n>=6. A hexagon has nine diagonals and six sides. Convexity does not alter this vertex-pair count for a simple n-gon.

## Production limits to retain in later review

Written-to-choice work can preserve mathematical distinctions while losing free drawing, ruler handling, measured recording and self-generated proof/explanation. Sources 107,111,117,118,119 require explicit loss accounting. A selection response is never evidence that these independent production tasks have been completed. No course/publication approval is being issued.
