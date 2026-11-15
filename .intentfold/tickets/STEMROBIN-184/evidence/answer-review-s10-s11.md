# STEMROBIN-184: Independent Answer Review, s10/s11

Date: 2026-11-15. Reviewer did not author these answers.
Scope: s10 exercises 101-106 (6), s11 exercises 107-123 (17).

## Phase 1: Independent Solutions, Frozen Before Author Answers

This entire phase was written before opening either
`geo68-c1-s10-answers-authored.json` or
`geo68-c1-s11-answers-authored.json`. Only the actual ready modern lesson
and exercise templates, referenced original PNGs, current SVGs and their
existing complete PNG previews were read for these solutions. No choice
questions, previous answers, or answer-key references were consulted.
The solutions below are not revised to agree with the authored files;
later comparison findings belong in Phase 2.

### Definitions And Figure Reading

- A region is polygonally connected and open in the plane. Its boundary
  does not belong to it.
- A polygon is its simple closed polygonal boundary together with its
  interior. A disk includes its circumference; an open circular interior
  does not. The partition drawings in 101 use the drawn circular boundaries.
- A convex figure contains the full segment between each pair of its
  points. The lesson explicitly includes empty sets and singletons.
- A diagonal joins nonadjacent polygon vertices, whether or not the
  segment lies entirely inside a nonconvex polygon.
- Original/current figures 49, 51, 52, 53 and 59 were inspected in full.
  Figure 51 has two disjoint circles. Figure 52 is an overlap chain:
  left-middle and middle-right cross twice; left-right are disjoint.
  Figure 53 uses rays with finite origins, not their complete supporting
  lines. Figure 49 depicts open ellipse interior, polygon exterior and
  wedge interior. Figure 59 depicts an annulus and a filled half-disk.
- Figure-only label note for the separate image reviewers: in current
  fig53(d), O2/O3/O4 labels crowd the lower-right origin cluster.
  The SVG binds O2 to (1060,255), O3 to (1120,310), O4 to (1160,365);
  O4's label anchor is (1131.8,324.8), near O3. This is a specific label
  association concern, not a second figure review or a mathematical
  blocker for the ray count.

### 101

1a: **3 regions** in fig51: each circular interior and the shared exterior.
1b: **6 regions** in fig52: the exterior, the three exclusive interiors,
and the two lens overlaps. There is no left-right lens or triple overlap.

2a: For two distinct positive-radius circumferences, **3 or 4** regions.
Disjoint/nested/nonintersecting and external/internal tangent circles give
3; two transverse intersection points give 4. If coincidence is allowed,
two identical circumferences give 2. Thus without a distinctness premise:
**2,3,4**.

2b: For three distinct circumferences, **4,5,6,7,8**, all attainable.
Examples: three disjoint (4); exactly one crossing pair plus an isolated
third (5); the actual chain in fig52 (6); three pairwise-crossing circles
with one shared triple crossing (7); pairwise crossings with six distinct
intersection points (8). A tangency is not a transverse crossing, and
coincident circles add no boundary. With coincidences allowed, **2 through
8**, since one/two distinct boundaries also realize 2 and 3.
Adding a distinct circle adds at least one region and at most four after
the first two; hence there are no counts outside these classifications.

### 102

In the source order a,b,c,d: **3,2,4,1**.
The three rays at O in a give three sectors. In b the two rays cross but
their finite beginnings can be bypassed; only two ends go to infinity,
so there are two regions, not four. In c there is one bounded triangular
region plus three exterior regions. In d the four nonintersecting rays
have bypassable finite beginnings and enclose nothing; the complement is
connected. Do not extend the rays backward into complete lines.

### 103

1: **2**, the triangle's interior and exterior.
2: **7**, for the three nonparallel, nonconcurrent side lines.
Noncollinearity makes their three pairwise intersections distinct.
Adding the first, second and third lines yields 2,4,7.

### 104

All three shaded sets in fig49 satisfy the two region requirements.
Ellipse interior and the open wedge permit direct segment connections.
For the polygon exterior, a segment may enter the excluded polygon, but
a polygonal detour outside it connects any two exterior points.
Every point in each set has positive distance from its excluded boundary;
a sufficiently small disk about that point remains within the same set.
Finite hatch endpoints are drawing limits, not extra closed borders.

### 105

1a: A segment contains no two-dimensional neighborhood around its points.
1b: A simple closed polygonal line alone contains no disk neighborhood.
1c: The complement of an open circular interior includes the circumference;
at a circumference point any positive-radius disk contains forbidden
interior points. Hence it fails openness.

2: **Not always.** Two open disk interiors have a region as their union
exactly when they intersect. If disjoint or externally tangent, they form
two components; external tangency does not join excluded boundary points.
If intersecting, a point in the overlap joins paths from both disks.
Containment, internal tangency and coincidence all give overlapping
interiors. For positive radii the condition is **d < r1+r2**.

### 106

Two distinct lines: **3** if parallel, **4** if crossing.
If coincident lines are allowed, also **2**.

Three distinct lines: **4** if all parallel; **6** if exactly one parallel
pair or all concurrent; **7** if pairwise nonparallel with three different
intersection points. With coincidences allowed, the complete set is
**2,3,4,6,7**. Five is impossible. A newly added distinct line crossing
k distinct existing intersection locations adds k+1 regions; coincidence
adds none.

### 107

This is a drawing/measurement task, so there is no unique numerical
perimeter without the student's drawings. Measure every side in the same
unit and sum. Valid illustrative examples: a 3-4-5 triangle has perimeter
12 units; a square of side 2 has perimeter 8; a regular pentagon of side
2 has perimeter 10. Such numbers must be labelled examples, not givens.

### 108

**n=p**. The simple closed boundary has one edge from each vertex to the
next, including the final edge returning to the starting vertex.

### 109

**False.** A finite segment or open simple polygonal line leaves one
connected complementary region. A simple closed polygonal line gives two;
an arbitrary self-intersecting polygonal line can behave differently.
The adjective "simple closed" cannot be omitted from the two-region rule.

### 110

1: If the whole intersection is a genuine bounded polygon, it has **3 or
4 vertices**. This is not "four only," and the premise rules out empty,
point, segment and unbounded intersections.

Examples using closed angles:
- A={x>=0,y>=0}, B={y>=0,x+y<=1} give a triangle.
- A={x>=abs(y)}, B={x<=2-abs(y)} give a quadrilateral.

Do not assume every angle is convex. A convex angle intersected with a
reflex angle can give a concave quadrilateral: take A as the first
quadrant and B={x+2y<=3 OR 2x+y<=3}. B is a closed reflex angle; A
intersect B has vertices (0,0),(3,0),(1,1),(0,3).
Two genuine reflex angles cannot have a bounded polygon as their whole
intersection, since the two excluded convex direction sectors cannot
cover all directions at infinity.
For a bounded intersection, each of the four boundary rays contributes
at most one side; at least three are needed for a polygon. Allowing a
reflex angle changes convexity possibilities, not the 3/4 count.

2: **3,4,5,6 vertices**. Two filled triangles are convex, so their
full-dimensional intersection is convex. It is bounded by at most the
six side lines, hence has at most six sides, and every count is realizable.
Degenerate intersections belong to 111, not to 110's polygon premise.

### 111

Complete possibilities: **empty set, one point, a nonzero segment, or a
convex triangle/quadrilateral/pentagon/hexagon**. There is no nonconvex
or disconnected intersection of two convex triangles.

For reproducible sketches fix T=triangle[(0,0),(4,0),(0,4)] and use:
- Empty: U=triangle[(5,0),(6,0),(5,1)].
- Point: U=triangle[(4,0),(5,0),(4,-1)].
- Segment: U=triangle[(0,0),(4,0),(0,-4)].
- Triangle: U=triangle[(1,1),(2,1),(1,2)], contained in T.
- Quadrilateral: U=triangle[(-10,11),(11,-10),(11,11)].
  Intersection vertices: (1,0),(4,0),(0,4),(0,1).
- Pentagon: U=triangle[(-1,1),(4,-1),(4,4)].
  Intersection: (0,3/5),(3/2,0),(4,0),(3/2,5/2),(0,8/5).
- Hexagon: U=triangle[(-1,1),(3,-1),(3,3)].
  Intersection: (0,1/2),(1,0),(3,0),(3,1),(5/3,7/3),(0,3/2).

These are sketch instructions and independently derived examples, not
new source givens or new figure assets.

### 112

Examples: point, empty set, segment, ray, line, half-plane, triangle,
convex quadrilateral, closed disk, open disk interior, and a convex angle.
A circumference, punctured disk and reflex angle are not suitable
convex examples.

### 113

1: **Yes**, a segment contains all subsegments between its points.
2: **Yes**, a ray contains the segment between any two of its points.
3: **No**, for three distinct points: choose two; their full nonzero
segment has infinitely many points absent from the three-point set.
Even collinearity of the three does not make the set convex.

### 114

1: **Yes**, every filled triangle is convex.
2: **Not always**, quadrilaterals can be convex or concave.
This is about the filled polygon, not the bare boundary.

### 115

Answers in order: **No, No, No, Yes**.
An annulus contains two opposite points whose segment crosses the hole.
In a punctured disk choose opposite nearby points with the missing center
as their midpoint. In a punctured plane choose two points with the removed
point as midpoint. The filled half-disk in fig59(b) is the intersection
of a disk with a closed half-plane, so is convex; a bare semicircular arc
would not be the figure in the actual source.

### 116

**Yes**, when one closed disk contains the other, including coincidence
and internal tangency. For positive radii this is also necessary:
**d+min(r1,r2)<=max(r1,r2)**.
Ordinary overlapping disks without containment, externally tangent disks,
and disjoint disks have nonconvex unions.

Necessity: if neither disk contains the other, d>abs(r1-r2), so there is
a common external supporting tangent meeting the disks at distinct
points P,Q. The open segment PQ lies on that tangent and outside both
disks, although P,Q belong to their union. Thus the union is not convex.
Do not confuse this closed-disk containment condition with the open-disk
connectivity condition in 105.

### 117

Convex union example: [0,1]x[0,1] and [1,2]x[0,1] share a full edge and
their union is the rectangle [0,2]x[0,1]. Neither contains the other.
Nonconvex union example: two disjoint disks; a segment joining their
centers leaves the union. This shows the containment characterization
in 116 is specific to disks, not arbitrary convex sets.

### 118

Take P,Q in C intersect D. Convexity of C and D puts the entire segment
PQ in both, hence in C intersect D. Empty and singleton intersections
are convex by the lesson's explicit convention. This proves the claim.

### 119

Convex example: a square. Concave example: quadrilateral with ordered
vertices (0,0),(3,0),(1,1),(0,3).
Every pair's full connecting segment stays in a convex polygon. In the
concave example the diagonal from (3,0) to (0,3) has midpoint (3/2,3/2)
outside the polygon, proving failure. It is not enough to contrast only
appearance or the labels "convex"/"concave."

### 120

1: **3** vertices, attained by a triangle.
2: **4** vertices, attained by a concave quadrilateral; all triangles
are convex, so three cannot suffice.

### 121

The minimum is **n-2 triangles**. From a chosen vertex draw the n-3
diagonals/rays to all nonadjacent vertices, giving the usual n-2 fan.
For minimality, the opposite polygonal boundary chain has n-2 sides;
each nondegenerate triangle in a fan has a straight base and cannot
absorb a genuine boundary corner in the interior of that base.
There must therefore be at least n-2 triangle bases/pieces.
Extra rays ending inside a boundary side may subdivide pieces further,
so "every such ray partition gives exactly n-2" is false.

### 122

1: **Convex polygons** contain all their diagonals.
2: **Nonconvex polygons** have at least one diagonal not wholly contained
in them. The containment is of the whole segment, not just its endpoints.
Triangles have no diagonals and are already convex. Boundary segments
are included in the polygon, not required to be strictly interior.

### 123

For any simple n-gon, D=C(n,2)-n=n(n-3)/2. Each vertex has n-3
nonadjacent partners; division by two removes double-counting.
1: **Yes, precisely n=5**; a pentagon has five diagonals and five sides.
2: **Yes, every n>=6**; n(n-3)/2>n is equivalent to n>5.
Nonconvex diagonals still count under the lesson definition; intersections
of diagonals do not create additional diagonals.

### Frozen Input Hashes

Template root:
`.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/`.

| Template | SHA-256 |
| --- | --- |
| `geo68-c1-s10/lesson.template.json` | `57bbee1b4557e77389429cd48dff0f897fe4a0ce713be936ae3c3599289e1174` |
| `geo68-c1-s10/exercises.template.json` | `d3096a389042aa1a725e2bab0a5d00c41243afa692d34f21758d37c55379da90` |
| `geo68-c1-s11/lesson.template.json` | `b0428edca585492499fa24bf3b2e0923ced7cec6c3a47b608a702a9602baabd7` |
| `geo68-c1-s11/exercises.template.json` | `24cb45635bb1f08ce123832f71ef75390b9c3341c30e8505393e55de44231aff` |

Original root:
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/`.
Current SVG root: `.tmp/s10y-image/6-8g/fig-NN/`.

| Figure | Original PNG SHA-256 | Current SVG SHA-256 |
| --- | --- | --- |
| 49 | `140f34ad04740fc748d60d3a6ed3418e2ac13c2e414e69eaebea0951f072599a` | `af7f48245d2fea4b1c85f7fac6d6e48fde08266c97f60fca04605be212ae1976` |
| 51 | `61e257a803d7a2d88095344664997396b0a863f6018acd28a06c25df6e22f9b9` | `ec36a7d680c8a327038949114b617def6e604ec5fd31c43f12e740e06d4da84a` |
| 52 | `1949938c9d86ce633ead03f99b3f6be43c458560fcffe44eb151072d67babe6c` | `cd0290994808388cc08fba51053331ba5f3a0b5876ac6e63f225aadb0b95f905` |
| 53 | `de291023adcc61a513976e65c8125bf168b133cd27aa173bd5fd05bb51469533` | `10eaae48f3599418c84119bed645cc177f99709f2bf0ff0e1aedfcd2dd327471` |
| 59 | `32c7a17f1236bc42acf886421065d7a3413906199f3f348bbc91799443f594f0` | `fafd77ca974c3bb2436977de88725f385bc800f6d442ee43c2e6d03172745bcf` |

## Phase 2: Authored-Answer Comparison

Completed: **s10 6/6 PASS; s11 17/17 PASS; 0 REJECT; 0 answer BLOCKED**.
This is independent substantive answer review, not figure approval,
lesson integration, automatic grading rollout or publication.

The complete pre-comparison report was already on disk before either
authored file was opened. Its SHA-256 was
`cd0cb53238e897f124d02090c32c7524bccaa4c85d2cf28389813600fd92064f`.
The exact Phase 1 prefix, ending immediately before this Phase 2 heading,
has SHA-256
`716ac1cf179574e619230d4027f46e84bbeb10ca0a77de0eb9069f0a7e2fafa0`.
That independent prefix is retained byte-for-byte; only Phase 2 is updated.

### Compared Drafts

Both files are schema `ld-s10y-answer/lesson-answers@1`, edition
`modern-us-neutral`, status `draft`, and all answer sources are `derived`.
Their exercise IDs and order match the modern exercise templates exactly.

| Authored file under `.intentfold/tickets/STEMROBIN-184/tmp/` | SHA-256 |
| --- | --- |
| `geo68-c1-s10-answers-authored.json` | `6fa169bf475b7f795689fc4767caa05bb829462a866dd6a38a94ceb155fcca39` |
| `geo68-c1-s11-answers-authored.json` | `3c60f21b380f69ba84cd737a02b8906b34b2c65ba97bd8d070998f0d90294d38` |

Read every `displayAnswer`, `notes`, and `parts` entry in these two current
drafts only, after the independent solutions were written. No previous
answer collection or choice-question file was read.

### Per-Exercise Findings

| Exercise | Verdict | Substantive comparison |
| --- | --- | --- |
| 101 | PASS | Actual figures give 3 and 6. Distinct-circle ranges 3/4 and 4-8 are correct; coincidence additions 2 and 3 are included. The notes' three mutually externally tangent circles example correctly gives five regions: three interiors, the bounded central gap, and the outer region. The answer explicitly distinguishes circular boundaries from deleting filled disks. |
| 102 | PASS | a,b,c,d=3,2,4,1 matches the actual source's ray directions and finite origins. No backward extensions are used. The fig53(d) label-cluster note is separate and does not change the ray counts. |
| 103 | PASS | 2 for the closed triangle boundary and 7 for its three full side lines. Both automatic numeric fields also match ["2"], ["7"]. |
| 104 | PASS | Both required region properties are explained for all three subfigures. The polygon exterior uses a finite polygonal detour rather than a false convexity claim. Boundary exclusion is retained. |
| 105 | PASS | Segment, boundary-only polygon and exterior-plus-circumference fail the local-disk condition. The open-interior union criterion is intersection/nonintersection, and external tangency is correctly excluded. |
| 106 | PASS | Distinct-line classifications 3/4 and 4/6/7 are correct; coincidence cases recover 2/3/4. Parallel, concurrent and general-position cases are distinguished; five is correctly impossible. |
| 107 | PASS | Author's equilateral triangle example differs from the reviewer's right triangle example, but both are valid optional drawings. The author's 9cm/8cm/10cm perimeters are correct and expressly illustrative, not newly introduced givens. |
| 108 | PASS | p=n>=3 follows the boundary vertex-edge correspondence. |
| 109 | PASS | Correct counterexample logic for a finite open simple polygonal line; the answer does not claim that arbitrary polygonal lines always divide the plane into two regions. |
| 110 | PASS | Gives every polygon count: 3/4 for two angles and 3/4/5/6 for two triangles, not only maxima. The first part does not assert that both angles or the resulting quadrilateral must be convex; the convexity statement is confined to triangle intersections. The reviewer's reflex-angle example confirms the count remains valid while a quadrilateral can be concave. Degenerate intersections are correctly not treated as polygons. |
| 111 | PASS | Complete set: empty, singleton, segment, and convex polygons with 3-6 sides. The separated, single-touch, shared-edge, containment and successive corner-truncation sketches are realizable; opposite triangles' central hexagon is the intersection, not the nonconvex six-pointed union. |
| 112 | PASS | Valid convex examples and explicit empty/singleton convention. It distinguishes a filled disk from its nonconvex circumference. |
| 113 | PASS | Yes/yes/no; even three collinear distinct points do not contain the full connecting segments. |
| 114 | PASS | Every filled triangle is convex; quadrilaterals need not be. The simple concave example is valid. |
| 115 | PASS | No/no/no/yes. Each negative case has a segment through a missing point/hole; fig59(b) is a filled half-disk including its diameter, not a bare arc. |
| 116 | PASS | Correct necessary and sufficient containment classification for two closed positive-radius disks. Coincidence is covered; internal tangency belongs to containment. Partial overlap, external tangency and separation do not suffice. The local outer-boundary chord argument near a transverse circle intersection is valid and agrees with the independent supporting-tangent proof. |
| 117 | PASS | Two equal adjacent closed squares form a convex rectangle without either containing the other; two disjoint disks give a nonconvex union. Does not generalize the disk-only containment condition to all convex sets. |
| 118 | PASS | Arbitrary A,B in the intersection imply the full segment lies in both original convex sets. Empty/singleton cases are explicitly included. |
| 119 | PASS | Square plus author's ordered concave quadrilateral (0,0),(4,0),(1,1),(0,4) are valid. Its BD diagonal leaves the filled polygon; this is the same substantive counterexample as the reviewer's scaled example. |
| 120 | PASS | Minimum vertex counts 3 and 4 are correct and attainable. Automatic numeric fields ["3"], ["4"] match independently solved results. |
| 121 | PASS | Correct minimum n-2 and attainable fan using n-3 rays to nonadjacent vertices. It does not assert that adding arbitrary extra rays still leaves exactly n-2 pieces. The lower-bound explanation is brief; see nonblocking note below. |
| 122 | PASS | Convex polygons contain all diagonals; nonconvex ones omit some portion of at least one diagonal. Endpoints/boundaries are included, and whole-segment containment is required. |
| 123 | PASS | n(n-3)/2 correctly counts nonadjacent vertex pairs once. Equality gives precisely n=5; strict excess gives every n>=6. The result does not depend on convexity or count diagonal crossings as new diagonals. |

### Nonblocking Notes And Rejection Register

- **121 explanation gap:** the draft demonstrates that n-2 is attainable
  and counts the standard fan, but does not separately spell out why fewer
  triangles cannot cover the full opposite boundary chain. The stated
  answer is correct, and the question does not explicitly request a
  proof, so this is not a mathematical reject. Phase 1 supplies the
  independent minimality reasoning. No draft has been rewritten.
- **110 convention:** allowing reflex angles permits a concave
  quadrilateral. The draft's 3/4 classification remains correct and it
  makes no contradictory all-angles-convex assertion. The independent
  reflex construction is retained in Phase 1; its absence as an authored
  extra example is not a reason to reject the count.
- **Figure 53(d):** retain the specific O2/O3/O4 association concern above
  for the already assigned figure reviewers. No image gate is rerun, and
  no answer is blocked because the source and complete current geometry
  suffice for solving 102. The concurrent update below supersedes the
  old label anchors; the old concern remains as inspected evidence.
- **Reject register:** empty. There is no rejected answer whose reason is
  hidden or repaired away. If either author's file changes, this comparison
  binds the hashes above, not a future revision.

### Concurrent Figure 53 Update

The first final current-input guard returned nonzero because another
worker changed fig53's SVG during this answer comparison. The four modern
template hashes and both authored-answer hashes still matched. The
original PNG and other four referenced SVGs remained unchanged.
The old fig53 SVG hash in Phase 1 is retained as the actually inspected
full-preview version, not silently replaced.

New fig53 SVG SHA-256:
`ed0679c926887b50271bdf6daf3d36af0c3e81917632ef4f2dfbe11d83bd3663`.
Read only the changed SVG's ray/origin/label geometry for the affected
answer dependency. All twelve ray endpoints/directions and all ten marked
origin coordinates are identical to those read before independent solving.
Only label placement/panel label positions changed in these inspected
elements: b/O2 moved to (358.2,60), d/O2 to (1031.8,296.2), d/O4 to
(1175.8,324.8), and a-d panel labels moved from y=398 to y=374.
The labels still denote the same original origins.

Exercise 102 remains PASS against the unchanged source and ray geometry.
No renderer or image-gate check was rerun, and no independent visual
approval of the updated label layout is claimed; that remains with the
assigned figure reviewers. The failed guard and old association concern
are preserved rather than converted into a false "all SVGs unchanged."

### Completion Boundaries

The only file written for this answer-review phase is this report.
The two authored drafts and modern/source layers are unchanged.
No figures were reauthored or rerendered; no answer/choice pipeline, old
answer reference, dependency, database, application, publication,
promotion, expense, browser launch, user window/tab/input control or
commit was used. Figure35 and other figure-review blockers are separate
and are neither waived nor rechecked by these answer PASS decisions.
