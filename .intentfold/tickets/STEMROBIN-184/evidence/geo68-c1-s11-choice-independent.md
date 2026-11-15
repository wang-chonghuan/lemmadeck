# geo68-c1-s11 Choice Review: Frozen Stage1 Source Conclusions

Date: 2026-11-15. Ticket: STEMROBIN-184.
Role: independent choice reviewer, not choice author.
Stage: **SOURCE-ONLY COMPLETE; FROZEN BEFORE VIEWS OR AUTHOR INTERNALS**.
All17 selected exercises107-123 and their subparts are covered below.
There is no choice-package PASS, option true set, or author-key comparison here.

## Input And Independence

Only current choice SKILL/review/contract, the supplied seed, its actual SVG
bytes and existing matching image-render evidence were read for this stage.
No draft, views, author solution, standard answer, old choice artifact,
interaction, other choice review, environment, DB, app or service was opened.
The explicitly authorized already-completed figure observations are reused;
the figure gate was not repeated. No browser, renderer, structural validator
or test was run. The official `prepare.py digest` command only computed the
canonical seed digest.

Seed:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo68-c1-s11-choice-seed.json`

- Canonical SHA-256:
  `fa922ce3d46fa1528168fbe44fb02d560c07ad2d66ec7e2cfbe2d407c194fc51`.
- Raw-file SHA-256:
  `d35e9bfa3efbc88fd5081ed52611fded7b323a85cbf177af9c1781a721e5840e`.
- Exercises:107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123.
- Selected concept blocks:0,3,4,8,11,18.
- Concept figures:54,56,58; exercise115 also uses59.

The seed's trace records are retained as supplied provenance; their source
JSON files were not opened or refreshed during this seed-only stage.
This is not a new whole-book freshness or assembly check.

## Actual Figure Bindings And Carried-Forward Observations

Each complete durable SVG was read and hashed. It is byte-identical to the
already independently observed approved SVG, including repaired56. Thus
the prior complete image observations apply to these actual seed assets.
No source image or previously passed preview was reopened for another gate.
The observations below are used for solving, not as a new figure approval.

### fig54

Actual asset:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-54.svg`

SHA-256:
`4b58ac8bfb5391a2e15a6c12747e876ed2604dfa18a93a39fd86bd16e7a35222`.
Complete SVG viewBox640x480, label p only.
Matching previously opened complete640x480 PNG SHA-256:
`75479624609392567efe5a648e9b274be37d8b19417f059aaf7a18774ac62416`.

A simple closed14-turn rectilinear outline bounds a hatched spiral-like band.
The white inward channel remains connected to the exterior through its
lower-right notch; it is not a separate enclosed hole. The oblique full line p
is outside the polygon. Distinguish the bounded filled polygon, its boundary,
its open internal region and its open external region. No vertex labels,
grid units, measured side lengths or extra mathematical points are supplied.

### fig56

Actual asset:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-56.svg`

SHA-256:
`79915f1cb107c8ff71b1ac83fe7ef5abea5a7cd88fec08efb9b5fadef90d2fda`.
Complete SVG viewBox960x360, all six labels A/B/C/D/E/F.
Matching previously opened complete960x360 PNG SHA-256:
`2985295a43d23663387b5dece3fae8d85eb8112b2c26fe8c0514b93fc48e081c`.

Three separate hatched polygons have5/5/6 vertices. Left AB is an internal
diagonal of a convex pentagon. Middle CD joins the nonadjacent top vertices
across the blank V-shaped notch of a concave pentagon. Right EF is a full
diagonal of the concave hexagon and has a portion outside the polygon.
Thus being a diagonal is an endpoint/nonadjacency condition; it is not
defined by full containment. B's repaired label is below-right of the actual
unchanged lower-right AB endpoint. The rightmost F/polygon are present.

### fig58

Actual asset:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-58.svg`

SHA-256:
`82f715304228fdfeae3e7ceee67afc63ec9b7d6a99cacda84aefa84478f40f5e`.
Complete SVG viewBox1200x320, three captions a/b/c.
Matching previously opened complete1200x320 PNG SHA-256:
`bddfb4209e529106a92fc06e75e0616d3bdf4d338fbb04ff3c88bd8c335245b6`.

Five unhatched outlines are grouped as a:triangle;
b:concave quadrilateral plus convex quadrilateral;
c:concave pentagon plus convex pentagon. All five, including the rightmost
pentagon, are visible. The inward corners remain genuine reentrant corners.
These are polygon illustrations; the source definition supplies the
boundary-plus-interior point set even when an illustration is unhatched.
There are no supplied lengths, units, diagonals or vertex names.

### fig59

Actual asset:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-59.svg`

SHA-256:
`fafd77ca974c3bb2436977de88725f385bc800f6d442ee43c2e6d03172745bcf`.
Complete SVG viewBox640x780, captions a/b.
Matching previously opened complete640x780 PNG SHA-256:
`aed02f586bb863471362eedcd481dd890302a1c5d91d963d26db809e106ed6a7`.

Top a is a hatched annulus with two complete concentric boundaries and a
blank central hole. Bottom b is an upper semicircular disk, not merely an
arc: its interior is hatched and its full solid diameter is present.
The bottommost diameter/caption are included. No removed-centre mark,
radius value, point label, counterexample segment or classification answer
is printed. This picture fixes the filled-half-disk reading in115(4).

## Definitions And Honest Convention Boundaries

Block0 says a simple closed broken line separates its planar complement into
an internal and external region; the line itself belongs to neither region.
Block3 defines a polygon as that boundary united with its interior. Block4
defines vertices, sides and perimeter as the sum of side lengths.
Block8 defines a diagonal by nonadjacent vertex endpoints.
Block11 quantifies over every pair of points of a convex figure and requires
their entire connecting segment in the figure. Block18 expressly includes
the empty set and a singleton among convex figures.

Consequently, a polygon is a filled point set, not only its perimeter.
Convexity is not a statement that only some segments, adjacent sides, or
the vertices themselves belong. Boundary endpoints are allowed.

The selected seed does not reproduce the earlier definitions of angle,
circle/disk or simple broken-line vertex noncollinearity. These are not
silently manufactured prerequisites:

-110(1) is solved below for the usual closed filled angular sectors. The
  numerical3/4-corner result does not license saying all angles/intersections
  are convex when a reflex-angle convention has not been established.
-115(1)/(4) have the actual filled pictures. For the word circle in115(2)
  and116, the source-intended disk reading is recorded explicitly. No new
  assertion that a circumference contains its centre is made.115(2)'s
  nonconvexity also holds for an open disk;116's positive disk example does
  not transfer to a positive-radius circumference.
- Vertex-count bounds and the121 fan count use genuine corners of ordinary
  nondegenerate polygons, not arbitrarily inserted collinear marks. If
  redundant collinear points were called extra vertices, that convention
  would need separate source evidence; no such evidence was read here.

These boundaries are available for subsequent view scrutiny. They are not
an author-defect finding before any author content has been inspected.

## Independent Complete Source Solutions

###107: Drawing, Measuring And Perimeter

There is no supplied drawing, length or unique numerical perimeter. Any
valid triangle/quadrilateral/pentagon, with consistent measurements and
the sum of all its boundary side lengths, solves the respective task.
For vertices V1..Vk in cyclic order,
`P = sum(|Vi V(i+1)|)`, with V(k+1)=V1; count the closing side exactly once.
Do not include diagonals, double the total or use area.

Exact reproducible exemplars, using coordinates in centimetres:
- Triangle `(0,0),(3,0),(0,4)`: side lengths3,5,4; perimeter12cm.
- Square `(0,0),(2,0),(2,2),(0,2)`: four sides2; perimeter8cm.
- Pentagon `(0,0),(4,0),(4,3),(2,4.5),(0,3)`: cyclic side lengths
  4,3,2.5,2.5,3; perimeter15cm. Roof edges have length
  `sqrt(2^2+1.5^2)=2.5`.

The examples are chosen independent constructions, not source-given numbers.
No physical drawing/measurement was performed or claimed in this notes-only
stage. The source requires producing drawings and obtaining their side
measurements; a later choice task must disclose recognition/calculation in
place of physical production if it cannot assess that capacity.

###108: Vertices And Sides

`n=p`. A simple closed cyclic boundary pairs each vertex with its following
side, including the last-to-first side. A polygon has at least3 genuine
vertices/sides. This is not the `p=n-1` count of an open chain.
Convexity versus concavity does not change the equality.

###109: Not Every Broken Line Separates The Plane Into Two Regions

The statement is false. An open L-shaped chain with vertices
`(0,0),(1,0),(1,1)` has a connected complement: paths can go around either
free endpoint, so the two apparent local sides are not separate regions.
An open chain need not enclose any bounded region.

For another distinction, the closed self-crossing chain
`(0,0),(2,2),(0,2),(2,0),(0,0)` crosses at `(1,1)` and leaves two triangular
lobes plus the exterior, three complement regions. The sufficient theorem
actually supplied is for a **simple closed** broken line (block0), not any
broken line. No converse that every nonsimple line has a fixed count is claimed.

###110(1): A Polygon Which Is The Intersection Of Two Angles

For usual closed filled planar angular sectors and a nondegenerate polygonal
intersection, possible genuine corner counts are **3 or4**.
The angular boundaries supply at most four straight bounding rays; a bounded
two-dimensional polygon needs at least3 sides.

Both counts have exact closed-convex-sector constructions:
- Triangle: intersect `x>=0,y>=0` with `y>=0,x+y<=1`.
  These are sectors with vertices `(0,0)` and `(1,0)`.
  The intersection has vertices `(0,0),(1,0),(0,1)`.
- Quadrilateral: intersect `x>=0,y>=0` with `x<=1,y<=1`.
  Sector vertices `(0,0)` and `(1,1)`; intersection is `[0,1]^2`.

The condition that the intersection already is a polygon excludes empty,
point, segment and unbounded intersections from this subquestion. It does
not say every pair of angles has a polygonal intersection.
No claim is made that the two angles themselves have equal measure.

The seed omits the angular primitive definition. In particular, if reflex
filled angular regions are allowed, a bounded concave quadrilateral can also
occur: intersect the first quadrant with the reflex sector at `(1,1)` outside
the forward sector whose boundary directions are `(1,-1/2)` and `(-1/2,1)`.
The intersection has cyclic vertices `(0,0),(3,0),(1,1),(0,3)`.
This still has4 corners but is not convex. Therefore "the intersection of
two angles is always convex" is not justified by this seed alone.

###110(2): A Polygon Which Is The Intersection Of Two Triangles

Possible corner counts are **3,4,5,6**. Filled triangles are convex; their
intersection is convex and bounded. Each triangle is the intersection of
three closed side half-planes, giving at most six active supporting lines.
A nondegenerate polygon has at least3 corners. The next source supplies
explicit constructions realizing all four counts, without answer access.
As in(1), the premise that the result is a polygon excludes degeneracies.

###111: All Possible Types Of Two-Triangle Intersections

For two closed filled coplanar nondegenerate triangles, the intersection can
be **empty, a singleton, a nondegenerate segment, or a convex polygon with
3,4,5 or6 genuine vertices**. It cannot be a concave polygon, an annulus,
a positive-area curved disk, or an unbounded set.
An intersection with empty interior is at most a segment/point/empty because
it is compact and convex; with interior, its boundary is on at most six lines.

The following exact constructions realize every listed type. Let
`T=conv{(0,0),(4,0),(0,4)}={x>=0,y>=0,x+y<=4}`:
- Empty: intersect T with `conv{(10,0),(14,0),(10,4)}`.
- Singleton: intersect T with `conv{(4,0),(6,0),(4,-2)}`.
  Only `(4,0)` is common.
- Segment: intersect T with `conv{(0,0),(4,0),(0,-4)}`.
  Exactly `{(x,0):0<=x<=4}` remains, including both endpoints.
- Triangle: intersect T with
  `conv{(-1,-1),(9,-1),(-1,9)}`; the latter contains T.
- Quadrilateral: intersect T with
  `{x<=3,y<=5,x+y>=-1}=conv{(3,5),(-6,5),(3,-4)}`.
  Result vertices `(0,0),(3,0),(3,1),(0,4)`.
- Pentagon: intersect T with
  `{x<=3,y<=3,x+y>=-1}=conv{(3,3),(-4,3),(3,-4)}`.
  Result `(0,0),(3,0),(3,1),(1,3),(0,3)`.
- Hexagon: intersect T with
  `{x<=3,y<=3,x+y>=1}=conv{(3,3),(-2,3),(3,-2)}`.
  Result `(1,0),(3,0),(3,1),(1,3),(0,3),(0,1)`.

These are constructive examples and an exhaustive **type/count** list,
not an assertion that every convex hexagon can be so represented.
Indeed a specific convex hexagon with cyclic vertices
`(0,-3),(2,-2),(3,0),(2,2),(6/5,3),(0,4)` cannot be an intersection of two
triangles. Its first five edges have outward normals with positive x
component; only the closing side x=0 has a negative-x outward normal.
Any triangle using only three of the first five supporting half-planes is
unbounded to the left. A6-sided intersection of two triangles needs six
distinct active triangle sides; both triangles would need the sole x=0
supporting side to be bounded, leaving at most5 distinct sides, a contradiction.
Thus a universal "any convex3-to6-gon" statement is too strong.
For a given6-gon, its six supporting half-planes must admit a partition
into two triples each bounding a containing triangle. Count alone is not
a construction for every individual shape.

###112: Examples Of Convex Figures

Many answers are possible; no unique finite list is supplied.
Examples with a direct segment-containment justification: singleton, empty
set (explicit block18), whole plane, straight line, ray, segment, filled
triangle, square/rectangle, a closed disk defined as `{|X-O|<=r}`, half-disk,
and intersection of half-planes such as a strip.
For a line/ray/segment, convex combinations stay on the same line and within
the appropriate parameter interval. A rectangle is the intersection of four
coordinate half-planes. For a disk the triangle inequality gives
`|(1-t)X+tY-O| <= (1-t)|X-O|+t|Y-O| <= r`.

The explicitly defined disk example does not rely on changing the meaning of
an unqualified circumference. A circle boundary, a three-distinct-point set,
an annulus or a concave polygon is not a convex example.

###113: Segment, Ray, Three-Point Set

1) A segment is convex: between any two of its points is still in that segment.
2) A ray is convex: use nonnegative line parameters; every parameter between
two nonnegative parameters remains nonnegative.
3) A set of exactly three distinct points is **not convex**, whether or not
the points are collinear. Between two distinct points there are infinitely
many points, and a three-element set omits some. The connecting segments
are not included just because their endpoints or one midpoint are included.

If three named positions coincide, the actual set might have cardinality1,
but that is not a figure consisting of exactly three points. A singleton
has the different, explicitly convex status in block18.

###114: Triangle And Quadrilateral

1) Every filled nondegenerate triangle is convex. Its three side half-planes
contain every connecting segment of points in their intersection.
2) A quadrilateral can be convex or nonconvex; the answer is not universally
yes or universally no. A square is convex. The simple quadrilateral
`A=(0,0),B=(2,0),C=(1/2,1/2),D=(0,2)` is concave at C.
BD has midpoint `(1,1)` outside the filled quadrilateral, disproving convexity.
Fig58(b) supplies both kinds. A crossed bow-tie is not accepted as a polygon
under the simple-closed-boundary definition.

###115: Four Convexity Decisions

1) Annulus, fig59(a): **not convex**. For inner/outer radii `0<r<R`,
choose opposite points at radius `(r+R)/2`. Both lie strictly in the band,
but their connecting segment passes through the excluded centre/hole.
This counterexample does not depend on inner-boundary inclusion.
2) Disk with its centre removed: **not convex**. Two opposite points at
distance half the positive radius are retained; their midpoint is the
deleted centre. The same argument works for an open punctured disk.
3) Plane with one point P removed: **not convex**. For nonzero planar vector v,
both `P+v` and `P-v` remain, while the segment contains missing P.
4) Semicircular disk, fig59(b): **convex**. It is the intersection of a disk
with the closed half-plane above its diameter. Disk convexity follows from
the triangle inequality; half-plane convexity from linear inequalities.
Every connecting segment remains in both. The complete actual diameter
and hatched interior distinguish this object from only a semicircular arc.

The four decisions are therefore **no,no,no,yes**.
The seed does not quote the earlier circle definition; the centre-removal
operation and filled figure context indicate the disk reading, but this
does not authorize silently substituting "disk" in an unrelated ambiguous task.

###116: Can The Union Of Two Disks Be Convex?

**Yes, it can**; it need not always be convex. An exact positive example is
two concentric closed disks of radii1 and2. Their union is the radius2 disk.
Distinct disks are used, so equality of the two objects is not needed.

A negative example is radius1 disks centred at `(0,0)` and `(3,0)`.
The centres belong to their union, but midpoint `(1.5,0)` belongs to neither.
Boundary contact or nonempty overlap is not a general convexity guarantee.
For two positive-radius Euclidean disks in the same plane, containment of
one in the other is the convex-union case; when neither contains the other,
a common supporting tangent exposes separated contact points with a missing
portion of their connecting segment (the two distinct circular boundaries
cannot fill that straight support segment).

Convention boundary: this is explicitly a **disk** solution under the
source-intended circle reading. A union of two positive-radius circumferences
is not a filled disk and is not convex. The source seed contains no separate
circle/disk definition to be used as fresh proof of that terminology.
The existential task does not assert anything about arbitrary spatial finite
point sets or circles in different planes.

###117: Two Convex Sets Can Have Convex Or Nonconvex Union

Constructive convex case:
`A=[0,1]x[0,1]`, `B=[1,2]x[0,1]`. Each is a convex closed rectangle;
their union `[0,2]x[0,1]` is a convex rectangle. They are distinct and neither
contains the other, illustrating why the disk-specific containment criterion
from116 must not be applied to every pair of convex figures.

Constructive nonconvex case:
`C=[0,2]x[0,1]`, `D=[0,1]x[0,2]`, each convex. Their union is an L-shaped
filled region. Points `(2,1)` and `(1,2)` belong, but their midpoint
`(1.5,1.5)` belongs to neither. This example even has substantial overlap,
so overlap or nonempty intersection is not sufficient for a convex union.

These coordinate rectangles and their shared edge/notch supply exact drawing
instructions and a containment witness, not a physical drawing claim.

###118: Intersection Of Two Convex Figures Is Convex

Let X,Y be arbitrary points of `A intersect B`. Because A and B are convex,
the entire closed segment `[X,Y]` is contained in A and contained in B.
It is therefore contained in `A intersect B`. This proves the universal
condition in block11. No finiteness, positive area, overlap-size or disk
assumption is needed.

If the intersection is empty, the quantified condition is vacuous and block18
explicitly treats it as convex. A singleton is also convex. A proof requiring
two distinct points or a polygonal nonempty interior would wrongly omit those
cases. This theorem is about intersection, not union.

###119: Convex Versus Nonconvex Polygon Construction And Difference

Convex example: the square `(0,0),(2,0),(2,2),(0,2)` with its filled interior.
Any segment between any two points stays within `0<=x,y<=2`.
Nonconvex example: the simple filled quadrilateral
`(0,0),(2,0),(1/2,1/2),(0,2)` in that cyclic order.
Its inward C corner and missing middle of BD distinguish it from a convex hull;
`B=(2,0),D=(0,2)` are in the polygon, `(1,1)` is not.

The precise distinction is the universal all-pairs segment condition versus
at least one pair whose segment is not wholly contained. An indentation or
reflex vertex supplies a visual witness; merely "looks round/regular" is not
the definition. Equal side lengths, symmetry and a particular orientation
are unnecessary. Fig58(b)/(c) and fig56 supply additional independent
examples with more sides.
Drawing production is a genuine source task; these notes supply construction
instructions rather than claiming newly rendered drawings.

###120: Minimum Vertex Counts

1) A convex polygon needs at least **3** genuine vertices; any nondegenerate
triangle realizes3.
2) A nonconvex polygon needs at least **4** genuine vertices. Every3-vertex
polygon is a filled triangle and is convex, so3 cannot work; the preceding
simple concave quadrilateral realizes4. Nonconvexity does not first require5.
Point/segment/empty-set convexity does not make those objects polygons.

###121: Fan Partition From One Vertex

For an ordinary convex n-gon with `n>3` genuine corners, the minimum number
of nondegenerate triangular pieces is **n-2**.
Label the vertices cyclically V0,V1,...,V(n-1). From V0 draw rays through
V2,...,V(n-2). Inside the polygon these are the n-3 fan diagonals.
The resulting triangles are
`V0 Vi V(i+1)` for `i=1,...,n-2`, exactly n-2 pieces.
Convexity keeps the joining segments inside and the fan covers the polygon
without gaps or overlapping interiors.

For minimality, the opposite boundary chain contains n-2 genuine sides.
Each triangular fan piece has its base on one such side; a triangle cannot
use two successive noncollinear sides as one straight base. Thus at least
n-2 pieces are needed. Rays meeting new points along sides can add pieces;
they cannot reduce this genuine-corner minimum.

Distinguish **n-3 internal rays/cuts** from **n-2 triangles**. Boundary rays
along the two incident sides do not count as internal cuts. Rays continue
outside the polygon but the question counts pieces inside it.

Vertex convention matters: if a rectangle's bottom side is subdivided by
an extra collinear point and that point is called a fifth vertex, a fan from
a bottom corner still needs only2 nondegenerate triangles, not5-2=3.
The usual geometric-corner reading avoids that counterexample. No unquoted
earlier simple-polyline definition was reopened to silently settle it.

###122: Diagonal Containment Characterizes Convex Polygons

1) **Convex polygons** contain all their diagonals: both endpoints are polygon
points, so block11 contains their segment. A triangle also satisfies this
vacuously because it has no diagonals.
2) **Nonconvex simple polygons** have at least one diagonal not wholly in the
polygon. At a reflex vertex, the chord joining the two neighbouring vertices
cannot be wholly contained: together with their two incident sides it would
otherwise enclose an exterior pocket disconnected from the exterior of the
simple polygon. Equivalently the standard convex-polygon characterization
is that every vertex-to-vertex diagonal is contained.

The concave quadrilateral above gives explicit diagonal BD with missing
midpoint; fig56's CD and EF show further outside portions. "Not contained"
means at least one portion/point leaves, not that every point of that diagonal
is outside (its endpoints are always included polygon vertices).
An outside diagonal remains a diagonal; containment is not its definition.

###123: Diagonal Count Equal To Or Greater Than Side Count

For a simple n-gon, each vertex has n-3 nonadjacent partners. Count all
endpoint incidences and divide by2 because each diagonal has two ends:
`d=n(n-3)/2`. Alternatively subtract n adjacent pairs from `n(n-1)/2`.
This counts the diagonals even when a concave polygon does not contain them.

1) Yes: `d=n` gives `n(n-3)/2=n`, hence n=5 for positive n.
Every ordinary pentagon has5 diagonals and5 sides.
2) Yes: `d>n` is equivalent to `n(n-5)>0`; for polygon integers n>=3,
this means **n>=6**. A hexagon has9 diagonals versus6 sides.
For comparison: triangle0<3, quadrilateral2<4, pentagon5=5.
There is no parity, regularity or convexity restriction on this count formula.

## Stage Boundary And Later Review Targets

The source conclusions above were completed before any view/option/key
access. They are now frozen for reuse; Stage2 must not describe unchanged
source work as a fresh blind solve.

No option truth or task-fidelity decision is possible until authorized views
arrive. Subsequent review must preserve:
- all107 drawing/measurement/calculation parts and their genuine production loss;
- both110 counts plus111 degeneracies, constructions and the limit on universal
  arbitrary-shape claims;
- every113/114/115 subpart, including three collinear but distinct points;
-116 existential convex union versus117 general union cases and118 intersection proof;
-119 constructions/difference,120 minima,121 rays versus triangle count;
-122 full versus partial containment and123 the full integer range n>=6;
- the stated circle/angle/vertex convention boundaries and all actual figure objects.

Only this assigned scratch report was written. No author or product artifact
was edited. Stop here for separate view-ready authorization.
