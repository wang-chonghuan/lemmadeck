# N35: independent source solving, exercises 451-459

## Scope and sequence

- Date: 2026-11-23.
- Sole execution cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
- Owned output directory: `.intentfold/tickets/STEMROBIN-188/tmp/n35-nine-answers-author7/`.
- Role: written ANSWER AUTHOR only; no finalization, review approval, canonical edits, interactions, judging, publication, or native-ten completeness claim.
- Authorized identities: book `6-8g`, lesson `geo68-c3-s2-n35`, group `g1` / `问题和习题`, source exercise numbers `451` through `459`.
- Exercise 450 is ABSENT / DEFERRED pending approved modern218. No answer is supplied for 450.
- The caller established absent bookRaw at N34. No book-answer file, prior answer, choice, or key was consulted; every solution below is independently derived.
- Actual images viewed/generated: 0 / 0. The authorized nine each have empty `figure_refs` and `figures`.
- Read the answer skill, gate 2, and binding production-resume SOP. The caller's author-only offline authorization controls; no downstream skill stage is authorized.
- All nine derivations and the independent arithmetic check below were completed before this file was written. Modern template filenames were listed, but their contents were not yet consulted.
- Seal this file with mode `0444` before creating `candidate-answer-keys.json`. Later prompt binding is explicitly pending; a candidate is not an approved or complete native lesson.

## Bound inputs

Source paths below are relative to the sole cwd.

- `ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n35/preparation7/artifacts/6-8g/lessons/geo68-c3-s2-n35/lesson.json`
  SHA-256: `06daaf76cd0a2915fd089b563086ffb37fc7ce8545048d4fd9a3c9c7b1247ada`
- `ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n35/preparation7/artifacts/6-8g/lessons/geo68-c3-s2-n35/exercises.json`
  SHA-256: `6f8fe3ef2022c0bc446bd7f3a1214ce599db37c47351c4a37c44a1e387b436c3`

Definitions used: a ray includes its origin; its second named point must differ from its origin. Same-direction collinear rays are nested (including equality); opposite-direction collinear rays are not nested. A direction is the equivalence class of all rays having that direction. Central symmetry with center P sends X to 2P-X. These are derived from the supplied prose, not from inspecting its referenced illustrations.

Letters naming different objects do not silently impose distinct origins across rays. A=B within the notation of a single ray AB would be invalid; M=A as an independently named starting point in 451, or equal origins of two otherwise valid rays in 453/458, is allowed.

## 451

Source identity: `451`, refs `p0164#6`, `p0164#8`.

Source text:
> 已知射线$AB$。1) 与射线$AB$同方向、始点在点$M$的射线有几条？2) 与射线$AB$方向相反、始点在点$M$的射线有几条？

Given A != B, let u=B-A != 0.

1. Exactly one: R+={M+t u : t>=0}.
2. Exactly one: R-={M-t u : t>=0}.

Through M the support line parallel to AB is unique if M is off AB, and is AB itself if M is on it. That line has precisely two orientations; the specified one determines the ray uniquely. The two answers remain 1 and 1 when M=A, M=B, or any other point. No distinct-origin restriction is needed.

## 452

Source identity: `452`, ref `p0164#9`; labels include source Cyrillic `б`.

Source text:
> 1) 分别作两条方向相同的射线$MA$和$KB$：a) 它们不在一条直线上；б) 它们在一条直线上。2) 分别作两条方向相反的射线$MC$和$KD$：a) 它们不在一条直线上；б) 它们在一条直线上。3) 利用规定的表示方法写出：射线$MA$和射线$KB$方向相同，射线$MC$和射线$KD$方向相反。

Use four separate constructions. Coordinate descriptions below are complete read-only standard examples: mark the stated points and extend the ray from its first point through its second point indefinitely.

1. a) M=(0,0), A=(1,0), K=(0,1), B=(1,1). Both rays point right, supported on y=0 and y=1. The line MK is x=0; their non-origin points lie in its same right half-plane.
   б) M=(0,0), A=(1,0), K=(2,0), B=(3,0). Both point right on y=0. [KB) is contained in [MA), so they have the same direction.
2. a) M=(0,0), C=(1,0), K=(0,1), D=(-1,1). The first points right and the second left, on distinct parallel lines. Their non-origin points lie in opposite half-planes of MK.
   б) M=(0,0), C=(1,0), K=(2,0), D=(1,0). The rays point toward one another on y=0; neither contains the other. They have opposite directions even though they overlap.
3. [MA) ↑↑ [KB), and [MC) ↑↓ [KD).

Other locations and lengths may give equally valid drawings. Collinear examples need not have distinct origins across the two rays: common-origin right/right rays coincide, while common-origin right/left rays are opposite. Every individual ray still needs a distinct second point. A displayed example or selected choice is not evidence that a learner has produced a drawing.

## 453

Source identity: `453`, ref `p0164#10`; labels include `a`, `б`.

Source text:
> 1) 方向相同的两条射线$AB$和$CD$在一条直线上。a)这两条射线的并可以是怎样的图形；б) 这两条射线的交可以是怎样的图形？2) 方向相反的两条射线$AM$和$BD$在一条直线上。a)这两条射线的并可以是怎样的图形；б) 这两条射线的交可以是怎样的图形？作图表示各种可能的情况，并且用规定的符号写出答案。

Choose a coordinate x on the common support line l. Reversing x handles the mirror-image orientation without introducing a new case.

1. Orient x in the common ray direction. With a=x(A), c=x(C), we have [AB)=[a,+infinity), [CD)=[c,+infinity).
   a) Union is [min(a,c),+infinity), always a ray.
   б) Intersection is [max(a,c),+infinity), always a ray.
   If a<c: union [AB), intersection [CD). If a>c: union [CD), intersection [AB). If a=c: the rays coincide, and both union and intersection equal that same ray.
   Complete schematic examples: origins (a,c)=(0,2), (2,0), (0,0); extend both rays to the right, selecting B,D one unit past their respective origins.

2. Orient x along AM: [AM)=[a,+infinity), [BD)=(-infinity,b], with b=x(B). The second ray's point D must lie to the left of B.
   - a<b (distinct origins, inward-pointing rays): a) union=l; б) intersection=[AB], the closed segment including A and B.
   - a=b (coincident origins): a) union=l; б) intersection={A}={B}, a single point. The support l still exists even though the notation "line AB" would not define it in this case.
   - a>b (distinct origins, outward-pointing rays): a) union=l minus the open gap {X in l : b<x(X)<a}, a disconnected union of two rays including both origins; б) intersection=empty set.
   Complete schematic examples: (a,b)=(0,2), (0,0), (2,0). In each example extend AM right and BD left, with M=a+1 and D=b-1.

This accounts for every possible relative order, equal origins, overlap, and disjointness. Opposite directions do not imply that the origins meet or that the rays overlap. Same directions do not require disjoint or distinct rays.

## 454

Source identity: `454`; exact source prefix `$454^{\bullet}.$`, ref `p0165#1`.

Source text:
> $454^{\bullet}.$ 与已知射线方向相同的射线有多少条？

Infinitely many. For a fixed nonzero direction vector u, every point X of the plane gives a ray {X+t u:t>=0}. Different origins give different rays because a ray's origin is determined by its point set. Thus there is one same-direction ray per origin, and there are infinitely many possible origins. Even on one support line the origins vary continuously; in the Euclidean plane the full class has the cardinality of the continuum. Excluding the originally given ray, if intended, does not change the infinite answer.

This does not conflict with 451: fixing M makes the same-direction ray unique; 454 does not fix M. An infinite family of rays here has just one direction, not infinitely many directions.

## 455

Source identity: `455`, exact source prefix `455.`, ref `p0165#2`; the source uses `可以有`, not an explicit maximum quantifier.

Source text:
> 455. 1) 在一条直线上；2) 在两条相交的直线上；3) 在三角形的三条边上，给出的射线可以有多少个不同的方向？

Under the ordinary geometric reading, the rays are supported on the stated lines; for triangle sides, extend each side's supporting line (an oriented side determines an extended ray).

1. A line supports exactly two available directions, represented by u and -u. Maximum=2.
2. Two distinct intersecting lines have distinct unoriented support directions. Each contributes two orientations, none equal to those on the other line. Maximum=4.
3. A nondegenerate triangle has three pairwise nonparallel side lines. Each contributes two orientations. Maximum=6.

The source does not specify that an arbitrary given collection realizes every available direction. For a nonempty chosen subset, realized counts are respectively 1 or 2; 1,2,3,4; 1,2,3,4,5,6. An empty collection realizes 0. If there is an additional requirement to choose at least one ray on each of the two/three support lines, the corresponding minima become 2 and 3, with maxima unchanged.

Literal bounded-side reading: a nondegenerate ray is infinite, so no complete ray can be contained in a finite triangle edge. Under that literal containment reading the third set is empty (0 directions), not 6. Preserve this wording ambiguity; do not silently alter the source. The pedagogical support-line interpretation gives 2,4,6 available directions.

The number of rays supported on even one whole line is infinite; the number of their different directions is only two.

## 456

Source identity: `456`; exact source prefix `$456^{\bullet}.$`, ref `p0165#3`.

Source text:
> $456^{\bullet}.$ 在一个平面的射线的集合上，方向相反的关系是等价关系吗？

No. An equivalence relation must be reflexive, symmetric, and transitive.

- Not reflexive: a nondegenerate ray with direction u cannot have direction -u itself, since u != 0. In the source's collinear definition it contains itself, so it is not opposite to itself.
- Symmetric: if r is opposite to s then s is opposite to r.
- Not transitive: use three distinct collinear rays r={(t,0):t>=0}, s={(1-t,0):t>=0}, q={(2+t,0):t>=0}. r is opposite to s and s is opposite to q, but r and q have the same direction.

Using three distinct rays avoids an unnecessary restriction or reliance on naming the first and third rays identically. If they were allowed to be identical, that would also be a valid counterexample. Same-direction, not opposite-direction, is the lesson's equivalence relation.

## 457

Source identity: `457`, exact source prefix `457.`, ref `p0165#4`.

Source text:
> 457. 已知射线 $OM$。作一条射线，使它与射线 $OM$ 关于中心$P$ 成中心对称，而且 1) 这条射线在直线 $OM$ 上；2) 这条射线不在直线 $OM$ 上。

Given O != M, central symmetry about P is unique. Construct O'=2P-O and M'=2P-M, making P the midpoint of OO' and MM'. The complete image ray is [O'M'), pointing opposite to OM. For any X=O+t(M-O), t>=0, its image is O'+t(M'-O'), so the entire ray, not just two selected points, is mapped correctly.

1. If P is on l=line OM, the image support is l itself. Standard example: O=(0,0), M=(1,0), P=(2,0) gives O'=(4,0), M'=(3,0), a left-pointing ray on y=0.
2. If P is not on l, the image support is a distinct line parallel to l. Standard example: the same O,M with P=(0,1) gives O'=(0,2), M'=(-1,2), a left-pointing ray on y=2.

Necessity: reflection of l in P equals l exactly when P lies on l (its perpendicular offset changes from d to -d). Thus for a preassigned fixed P only the appropriate one of these two cases is possible. If the exercise means choose P separately for its two constructions, choose it on l in (1) and off l in (2). Do not claim both constructions can be made for every fixed P.

Edge cases: P=O gives O'=O and reverses the ray at the same origin. P=M gives M'=M and O'=2M-O. Neither case requires constructing an undefined line from two coincident points; a point equal to P is its own image. Other collinear locations of P are allowed. The standard examples do not prove that a learner made a drawing.

## 458

Source identity: `458`, exact source prefix `458.`, ref `p0165#5`.

Source text:
> 458. 1) 求证：在一条直线上方向相反的两条射线是中心对称的。怎样求出这两条射线的对称中心？2) 求证：在中心对称下，平面上每一条射线映射到与它方向相反的射线。

1. Let the origins be A and B and choose a common nonzero vector u oriented along the first ray. The rays are r={A+t u:t>=0} and s={B-t u:t>=0}; no equal lengths of originally named segments are required. Let C=(A+B)/2, the midpoint of the origins. Then
   2C-(A+t u)=B-t u.
   This maps every point of r into s and every point of s back into r, so the rays are centrally symmetric. C is unique because symmetry must send the first origin to the second. If A=B, C=A=B; a zero-length origin segment means simply use that common point. Overlapping, inward, outward/disjoint, and same-origin rays are all covered.
2. For arbitrary plane center P and ray r={A+t u:t>=0}, symmetry gives {2P-A-t u:t>=0}. The new origin is A'=2P-A and the direction is -u, opposite to u. Its supporting line is the same if P lies on the old support and is a distinct parallel line otherwise. If P=A the origin stays fixed, but the direction still reverses. This proves the claim for every ray and every center, not only a pictured example.

## 459

Source identity: `459`; exact source prefix `$459^{*}.$`, ref `p0165#6`; labels `a`, `б`, `в`.

Source text:
> $459^{*}.$ 1) 下面的图形分别有多少对互相平行的边？a) 凸四边形；б) 凸五边形；в) 凸六边形。2) 边数是奇数的多边形有对称中心吗？

1. The shape category alone does not determine one fixed parallel-edge count. For ordinary nondegenerate convex polygons with genuine vertices:
   a) A convex quadrilateral can have 0,1,2 pairs; maximum 2.
   б) A convex pentagon can have 0,1,2 pairs; maximum 2.
   в) A convex hexagon can have 0,1,2,3 pairs; maximum 3.

   Proof of the bound: traverse a convex polygon counterclockwise. At every genuine vertex the edge direction turns by a positive angle less than a straight angle, and the total turn is one full revolution. A given oriented direction occurs at most once. Therefore an unoriented parallel class has at most two edges, in opposite traversal directions; parallel pairs use disjoint pairs of edges. With n edges, there are at most floor(n/2) pairs. Adjacent genuine sides are not parallel.

   Complete coordinate examples follow. Connect the vertices cyclically in the listed order. e_i joins vertex i to i+1, with the last joining the first. The pair list enumerates all parallel pairs:

   | n | Count | Vertices in cyclic order | Parallel edge pairs |
   | --- | --- | --- | --- |
   | 4 | 0 | (0,0),(4,0),(3,2),(0,3) | none |
   | 4 | 1 | (0,0),(4,0),(3,2),(1,2) | (e1,e3) |
   | 4 | 2 | (0,0),(4,0),(4,3),(0,3) | (e1,e3),(e2,e4) |
   | 5 | 0 | (0,0),(4,0),(5,2),(3,4),(0,3) | none |
   | 5 | 1 | (0,0),(4,0),(5,2),(3,3),(0,3) | (e1,e4) |
   | 5 | 2 | (0,0),(4,0),(4,2),(3,3),(0,3) | (e1,e4),(e2,e5) |
   | 6 | 0 | (0,0),(3,0),(5,2),(4,5),(1,6),(-2,2) | none |
   | 6 | 1 | (0,0),(3,0),(5,2),(4,5),(1,5),(-1,2) | (e1,e4) |
   | 6 | 2 | (0,0),(3,0),(5,2),(4,5),(1,5),(-2,2) | (e1,e4),(e2,e5) |
   | 6 | 3 | (0,0),(3,0),(4,2),(3,4),(0,4),(-1,2) | (e1,e4),(e2,e5),(e3,e6) |

   Independent integer arithmetic checked every nonincident vertex strictly to the left of every oriented edge (strict convexity) and counted every edge pair whose determinant is zero. All ten examples satisfied both the intended count and convexity; command exit 0. These are author-generated examples, not prior keys.

   Source wording does not explicitly say "at most"; do not present maxima as universal exact counts. If "convex polygon" is weakened to permit redundant collinear marked vertices subdividing a side, the genuine-vertex argument no longer applies; no count for that different convention is asserted here.

2. No ordinary nondegenerate simple polygon with an odd number of genuine sides/vertices has a center of symmetry. This is not limited to convex polygons. A half-turn maps genuine vertices to genuine vertices and preserves their cyclic boundary order, acting by a cyclic shift k. Applying it twice gives 2k=0 modulo n. For odd n this forces k=0 modulo n, so every vertex would be fixed. A half-turn fixes only its center, contradicting a nondegenerate polygon's distinct vertices. Equivalently, in a centrally symmetric polygon, genuine vertices are matched in distinct pairs and the number of sides is even. Redundant collinear labels do not turn an actually even-sided polygon into an odd-sided one.

## Execution facts and limitations at source seal

- No DB access, environment/secrets access, network call, installation, Git action, peer message, new worktree/chat, browser interaction, keyboard/input interaction, full-source-page recheck, figure viewing, or choice/key viewing.
- No source or shared file was edited.
- One directory-existence probe returned exit 1 because the owned output directory did not yet exist. This is a technical probe result, not a mathematical failure; this file creates the authorized directory.
- One boundary deviation: the first `sed` read of the source exercises JSON unintentionally emitted 450's textual entry along with the nine authorized entries. No 450 figure, source scan, or image was viewed; no 450 solution was attempted. Subsequent exercise/template reads must filter to 451-459. Record this over-read, rather than claiming 450's text was never exposed.
- Content/arithmetic failures so far: 0. Image calls, image failures, and images: 0. No substantive review or gate approval is claimed.
- All numerical geometry examples above are independently derived and complete; the eventual candidate must use `source: derived`, `grading: ungraded`, `parts: []`, with all subparts included in `displayAnswer`.
