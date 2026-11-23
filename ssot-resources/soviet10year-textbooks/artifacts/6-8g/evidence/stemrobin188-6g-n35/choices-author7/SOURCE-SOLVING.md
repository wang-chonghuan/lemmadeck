# N35 independent source solving

Authority: the native `seed.json` only, canonical SHA-256
`029294324997c6b097f467ae580c8d06323565798041adb236bce6c4ab524058`,
written seeds 450-459 and definition blocks 1, 2, 7, 8, 9, 12, 13, 14, 20.
No written answers, old choices, other lesson material, figure specifications,
original scans, reviewer results or ticket output were consulted.
This is source mathematics, not a review or a set of authored alternatives.

## Conventions and actual-image evidence

A ray includes its origin. Write `[AB)` for the ray starting at A through a
distinct B. Collinear same-direction rays contain one another, with equality
allowed. Rays on distinct parallel supports are compared by the two half-planes
bounded by the line through their origins. Direction is the whole same-direction
equivalence class, not the origin, length of the naming segment or an undirected
support line. The supplied `uu` / `ud` notation is respectively
`\uparrow\uparrow` / `\uparrow\downarrow`.

The supplied modern SVG bytes have SHA-256
`1641c74779d32ecd40817bf218eb08eb9c2e193583c9d40ae9adf0c43e361ad6`.
One completed headed/offline full-page screenshot, `fig218-headed.png`, was
opened once; no crops or reopens. The image itself occupies 640 by 420 pixels
at the upper left of the 1440 by 960 screenshot. It is complete, not clipped:
upper horizontal order A-Q-B; lower horizontal order C-P-D; diagonal order
F-P-Q-E from lower left to upper right. The far-right B and far-bottom F,
and both diagonal end extensions, are visible. P and Q sit at the two
intersections. Lines AB and CD are parallel as the seed states.
These are observed modern transport labels only. Original-source glyph
identity, historical lettering correspondence and printing roles are UNKNOWN;
no such correspondence is inferred.

The first standalone-SVG screenshot call timed out, with no image opened.
Its script and observed error were preserved. The recovery displayed the exact
same SVG bytes as an offline HTML img; it made no new mathematical figure.
Both browser executions closed their browsers in `finally`.
No unrequested concept figures were loaded; their definition prose suffices.

## 450 - full direction classification

On the horizontal supports the distinct nameable rightward rays are
`[AB), [QB), [CD), [PD)` and the distinct leftward rays are
`[BA), [QA), [DC), [PC)`. Each list is one same-direction group; every ray
in the first is opposite to every ray in the second.
Naming equalities: `[AQ)=[AB)`, `[BQ)=[BA)`, `[CP)=[CD)`, `[DP)=[DC)`.

On the diagonal support the upward-right rays are `[FP), [PQ), [QE)` and
the downward-left rays are `[EQ), [QP), [PF)`. Each list is one
same-direction group and the two groups are opposite.
Additional names do not make new rays:
`[FP)=[FQ)=[FE)`, `[PQ)=[PE)`,
`[EQ)=[EP)=[EF)`, `[QP)=[QF)`.
Horizontal and diagonal rays are neither same-direction nor opposite because
their support lines are not parallel. Thus this enumerates every ray nameable
using two different observed collinear labelled points, without pretending the
finite strokes are the entire rays.

## 451 - fixed origin

Let u be a nonzero vector in the direction B-A. For any specified M, including
M=A or a point on or off line AB, exactly one ray `M+t u, t>=0` is same-direction,
and exactly one ray `M-t u, t>=0` is opposite-direction. Positive rescalings of u
give the same ray, not additional rays. Uniqueness also follows by choosing the
unique line through M parallel to AB (or AB itself when M lies on it), and its
two oriented halves. The two halves have a common origin but are distinct and
neither contains the other. Counts: 1 and 1.

## 452 - four constructions and notation

Concrete exact constructions, with coordinates used only as self-contained
descriptions of positions:

* Same-direction, different supports:
  M=(0,0), A=(2,0), K=(0,2), B=(3,2).
  Direction vectors (2,0) and (3,0) are positive scalar multiples.
* Same-direction, same support:
  M=(0,0), A=(2,0), K=(3,0), B=(5,0).
  Both rays go right; the second is contained in the first.
* Opposite-direction, different supports:
  M=(0,0), C=(1,0), K=(0,2), D=(-1,2).
  Direction vectors (1,0) and (-1,0) point to opposite half-planes.
* Opposite-direction, same support:
  M=(0,0), C=(1,0), K=(3,0), D=(2,0).
  One ray goes right and one left; neither contains the other.

The requested relations are `[MA)\uparrow\uparrow[KB)` and
`[MC)\uparrow\downarrow[KD)`. The second naming point determines orientation
relative to the origin, not by its absolute coordinate alone. In particular
D=(2,0) is left of K=(3,0) even though D has a positive x coordinate.
Choosing completed coordinate constructions cannot demonstrate that a learner
can draw them or independently write the required symbols.

## 453 - all union and intersection cases

Choose a coordinate x on the common line, and include every ray origin.
Same-direction rightward rays U=[a,infinity), V=[c,infinity) satisfy
U union V=[min(a,c),infinity), U intersection V=[max(a,c),infinity).
Thus both sets are rays. For a=c they are equal and both results are that
same ray. Leftward versions follow by reversing the coordinate.

For opposite directions put U=[a,infinity), V=(-infinity,b].

* a<b: union is the entire line R; intersection is the closed nondegenerate
  segment [a,b], including both origins.
* a=b: union is R; intersection is the singleton {a}. This is not the empty
  set; if someone calls it a zero-length segment, specify the singleton anyway.
* a>b: intersection is empty; union is the two disjoint rays
  (-infinity,b] union [a,infinity), not a line. The open gap (b,a) is missing
  but its endpoints are included.

This is exhaustive after possibly interchanging the two rays or reversing x.
Original task also requests drawings of all cases and writing union/intersection
symbols. Choice recognition preserves the set distinctions but loses both
independent drawings and production of the symbolic answer.

## 454 - freely varying origin

With u fixed, every point X in the plane determines the same-direction ray
X+t u, t>=0. There are infinitely many; even taking X on a single support
line yields infinitely many different rays, each with a different origin.
Changing the naming point farther along a ray does not add a ray.
This is not in conflict with 451: there the origin M is fixed.

## 455 - preserve the quantifier ambiguity

The prose does not say whether it quantifies over all rays available on the
listed supports or over a specified selection of rays. No actual selection
is supplied. A finite triangle edge cannot contain an infinite ray; the
meaningful reading uses its supporting line and permits extension.

For ALL rays on the stated supports, each undirected line supplies two
directions. One line therefore supplies 2; two intersecting lines supply 4
(their orientations cannot agree); the supporting lines of a nondegenerate
triangle supply 6 (every pair intersects and none is parallel).

For an arbitrary nonempty SELECTION of these rays, not required to use every
support, possible counts are respectively every integer 1..2, 1..4 and 1..6.
One can choose one ray from each desired direction. A particular selection
has no determinate count without its members. If a different convention
requires at least one ray on EACH support, the possible ranges are instead
1..2, 2..4 and 3..6. An empty selection gives 0 when explicitly allowed.

The maximum in each reading is 2, 4, 6, but this does not license replacing the
source question with an unannounced maximum question. A candidate must state
its all-rays/selection convention visibly and account for the unresolved
original quantifier internally, rather than claim to settle it.

## 456 - opposite-direction relation

Opposition is not an equivalence relation. It is not reflexive: a ray contains
itself and has its own direction, never its opposite. It is symmetric:
u opposite v implies v opposite u. It is not transitive: choose three rays with
vectors (1,0), (-1,0), (1,0); the first opposes the second and the second opposes
the third, but the first and third have the same direction.
The three rays may have distinct origins, so the counterexample does not rely
on allowing the first and third object to be identical.
Selecting the complete property profile does not constitute writing this proof.

## 457 - construction with fixed versus chosen center

For ray O+t(M-O), t>=0, and specified center P, define O'=2P-O and M'=2P-M.
The unique image is `[O'M')`, whose direction vector is M'-O'=-(M-O):
S_P(O+t(M-O))=2P-O-t(M-O)=O'+t(M'-O').
The image support is parallel to OM. It equals line OM iff P lies on line OM,
since the image origin
2P-O lies on that line iff P does. If P is off that line, the parallel image
support is distinct. When P=O, the origins coincide and the ray reverses.

Thus, if P is already fixed, only ONE of the source's two positional cases
can occur; one cannot produce both by moving the image origin freely.
If the instruction permits choosing P, choose P on OM for case 1, off OM
for case 2. Example: O=(0,0), M=(2,0):
P=(1,0) gives O'=(2,0), M'=(0,0);
P=(1,2) gives O'=(2,4), M'=(0,4).
These are exact completed construction witnesses, not evidence of learner
construction. The candidate must state whether its center is fixed or chosen.

## 458 - proofs and center, including coincident origins

For opposite collinear rays r=A+t u and s=B-t v, t>=0, u and v point the
same way and may be normalized to the same nonzero vector. The center must
map the origin A to origin B, so it is uniquely P=(A+B)/2. This works:
S_P(A+t u)=B-t u, exactly the second ray. The same statement works when
A=B: P=A, with the two opposing rays sharing their origin. It also works
whether rays overlap in a segment, meet only at that origin, or are disjoint.
Taking the midpoint of arbitrary through-points, rather than the origins,
does not in general map rays to rays with the required origins.

For any ray X+t u and any fixed P,
S_P(X+t u)=(2P-X)+t(-u), t>=0.
Its origin is reflected and its orientation reverses, on either the same
support or a distinct parallel support. This proves the plane-wide statement
without silently restricting P to the support. It is compatible with supplied
blocks 14 and 20 but is derived independently here.
Choice judgments can recognize the center and universal reversal, not verify
the learner can produce either proof.

## 459 - genuine convex-polygon and odd-vertex task

For an ordinary convex polygon with no flat vertices, at most two sides can
have a given undirected orientation: they lie on the two extreme supporting
lines perpendicular to its normal. A third parallel side cannot be a distinct
supporting side of such a convex polygon. Consequently parallel pairs use
disjoint sides and their number is at most floor(n/2).

The number is NOT fixed by convexity and side count. All possibilities are:
quadrilateral {0,1,2}, pentagon {0,1,2}, hexagon {0,1,2,3}.
Explicit counterclockwise vertices below witness every count. Consecutive
edge cross-products are positive and the listed boundaries are simple;
checking their edge slopes gives exactly the indicated pairs.

| n | pairs | vertices in boundary order |
| --- | --- | --- |
| 4 | 0 | (0,0), (4,0), (3,2), (0,3) |
| 4 | 1 | (0,0), (4,0), (3,2), (1,2) |
| 4 | 2 | (0,0), (4,0), (4,3), (0,3) |
| 5 | 0 | (0,0), (4,0), (4,2), (2,4), (-1,3) |
| 5 | 1 | (0,0), (4,0), (4,2), (2,4), (-1,4) |
| 5 | 2 | (0,0), (4,0), (4,2), (2,4), (0,4) |
| 6 | 0 | (0,0), (3,0), (4,2), (3,4), (0,5), (-1,1) |
| 6 | 1 | (0,0), (3,0), (4,2), (3,4), (0,4), (-1,1) |
| 6 | 2 | (0,0), (6,0), (8,4), (6,8), (0,8), (-1,6) |
| 6 | 3 | (0,0), (3,0), (4,2), (3,4), (0,4), (-1,2) |

In the two-pair hexagon the horizontal edges pair, and edge vectors (2,4)
and (-1,-2) pair. The remaining slopes -2 and -6 are distinct. Its opposite
vertex-pair midpoints are (3,4), (3,4), (7/2,5), so it is NOT centrally
symmetric. Evenness alone is not sufficient.
In the three-pair hexagon opposite vertex midpoints are all (3/2,2), so that
particular hexagon DOES have a center.

A centrally symmetric ordinary polygon has its genuine vertices paired by
the half-turn. In a convex polygon its center is interior and cannot be a
vertex, so no vertex is fixed and the vertex count is even. The argument also
applies to an ordinary simple nonconvex polygon with no flat vertices:
a vertex fixed at the center would have its two incident edge rays interchanged
by the half-turn, forcing a straight angle, contrary to being a genuine vertex.
Thus an odd-sided ordinary polygon cannot have a symmetry center.

The wording of part 1 is underdetermined if read as asking for a fixed count
for an unspecified polygon. The full possibility sets resolve the invariant
mathematics, without claiming a unique count, changing it to a maximum,
assuming regular polygons or substituting a ray-equivalence exercise.
Choice recognition loses independent supporting-line proof, witness
construction and vertex-pairing explanation.
