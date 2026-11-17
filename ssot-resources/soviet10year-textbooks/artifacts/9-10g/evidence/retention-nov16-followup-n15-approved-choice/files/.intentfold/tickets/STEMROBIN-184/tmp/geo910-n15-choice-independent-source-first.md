# STEMROBIN-184 n15: Independent Source-First Freeze

Stage: 1, frozen before opening either learner-view file.
Date: 2026-11-16.
Reviewer stance: fresh, independent source-first reviewer; no author solution, key, draft, predecessor, handoff, or other choice material consulted.
Scope: offline evidence, not a final semantic review or approval.

## Input Binding and Read Boundary

- Seed: `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-choice-seed.json`.
- Seed byte SHA-256: `44ab111e16ac35919a1286e3b29741e4d443911bb8f25f9f050e8a7e587fd2dc`.
- Seed canonical SHA-256: `ae036d4c9fee63d425d062afe4d5250e052276cb72df9582f1624807c4ef7143`.
- Actual asset: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-61.svg`.
- Actual asset SHA-256, computed from its bytes and matching seed: `12931945b0b68256968b9893a0f0b6020661a59c92d812dbe744d29428b4343c`.
- Procedural reads only: choice SKILL, its review and contract references, and image SKILL including image-batch rules.
- Mathematical input only: the named seed's five exercise texts, concept block 4, and this actual figure.
- No trace-target JSON, figure specification, author artifact, source pipeline, database, environment file, application, browser, Git, or history was read.
- One actual image successfully inspected, as a full-frame in-memory rasterization of the unchanged SVG. No image file was created, no crop was used, and no diagram was authored. Earlier unsupported decoding attempts provided no inspectable image and no mathematical evidence. Successful image count: 1; batch/context ceilings: 8/24.

## Actual Figure 61 Observation

The full image contains a polygonal representation of plane alpha, label alpha at the left interior, M and N above the plane, M_1 and N_1 below it, upper connector MN, lower connector M_1N_1, and two complete joining lines MM_1 and NN_1 with marked crossings at the plane. The lower hidden portions of those joining lines are dashed. At the right is the complete reference line l, with its label near its top and a marked plane crossing; its hidden portion is dashed. All bottom labels M_1 and N_1 and the rightmost line l are present, not cropped.

The three joining/reference lines illustrate a common direction. The diagram is a perspective sketch, not a numerical length measurement. No right-angle symbol or perpendicular condition is supplied. The midpoint condition comes from the source prose; it is not inferred from equal screen lengths. Thus an orthogonal-reflection hypothesis must not be silently added.

## Conventions and Count

The seed calls a distance-preserving space transformation a movement (concept block 4). I use the ordinary meaning of a space transformation as a bijection of Euclidean three-space. The seed includes no explicit definition deciding whether "parallel" includes coincident lines/planes; below I always distinguish equality from distinct parallelism. Likewise the ordinary distinct-object readings of "two parallel planes", "two intersecting planes", and "a line intersecting a plane" are stated explicitly.

The actual source response/task inventory has **15**, not 13, separately requested units:

| Source | Explicit units | Count |
| --- | --- | --- |
| 159 | One universal isometry-to-transformation judgment | 1 |
| 160 | Transformation? Movement? | 2 |
| 161 | Line-line, line-plane, plane-plane preservation | 3 |
| 162 | Line-image property, plane-image property | 2 |
| 163 | Seven separately numbered figures | 7 |
| Total | 1 + 2 + 3 + 2 + 7 | 15 |

Merging units into choice questions may be defensible but cannot change this source inventory. The requested "13 source taskunits" is not supported by the seed numbering.

## 159: Every Distance-Preserving Self-Mapping Is a Transformation

Answer: yes in Euclidean three-space, even if surjectivity was not initially assumed.

Let F preserve all distances, b = F(0), and u_i = F(e_i) - b for the three unit coordinate vectors e_i. Distance preservation gives |u_i| = 1 and |u_i - u_j|^2 = 2 for i != j, so the u_i form an orthonormal basis. For x = (x_1,x_2,x_3), put w = F(x) - b. Then |w|^2 = |x|^2 and |w-u_i|^2 = |x-e_i|^2. Subtracting these equations gives w dot u_i = x_i, hence F(x) = b + sum_i x_i u_i. Its linear part is orthogonal and therefore invertible.

For any target y, take x_i = (y-b) dot u_i; then F(x) = y. This proves surjectivity. Injectivity also follows immediately: F(x)=F(z) implies |x-z|=0. Merely establishing injectivity would leave the requested transformation conclusion unjustified.

Unit U159: universal bijectivity, with the essential finite-dimensional surjectivity argument.

## 160: Oblique Reflection Along l

The source says l intersects alpha. Under the intended unique-intersection reading, l is transverse, neither contained in alpha nor parallel to it. For M outside alpha, its line parallel to l meets alpha at a unique H; define F(M) = 2H-M. For M in alpha, F(M)=M.

### U160.1: Transformation

Answer: yes for every such transverse direction.

The point F(M) lies on the same line through H; its midpoint with M is still H, so F(F(M))=M. Fixed plane points satisfy this as well. Thus F is an involution, and its own inverse, proving both existence/uniqueness of images and bijectivity.

For an explicit check set alpha: z=0 and direction l=(a,b,c), c != 0. Then

`F(x,y,z) = (x - 2az/c, y - 2bz/c, -z)`.

Applying this formula twice returns (x,y,z).

### U160.2: Movement

Answer: not necessarily; precisely when l is perpendicular to alpha.

With the same coordinates, take A=(0,0,0) and M=(0,0,1). A is fixed. Initially |AM|=1; after mapping,

`|F(M)-F(A)|^2 = 1 + 4(a^2+b^2)/c^2`.

For any oblique direction, at least one of a,b is nonzero, so this distance increases. Therefore the arbitrary transverse case is not a movement in general. If a=b=0, F(x,y,z)=(x,y,-z), an orthogonal reflection; all squared pairwise distances are unchanged. These two observations give the necessary and sufficient condition.

Figure 61 is consistent with the oblique construction, but no angle or metric conclusion is being measured from its perspective drawing.

## 161: Preservation of Three Parallel Relations

Answers: yes, yes, yes. Here a movement means an isometry that is a space transformation.

The argument for 159 represents any movement as F(x)=Qx+b with Q orthogonal. It maps entire lines to lines and entire planes to planes, preserves dimensions and incidence, and, by its inverse, preserves disjointness.

### U161.1: Two Parallel Lines

Write the lines as A+Rv and B+Rv. Their image directions are both Qv. If the originals are distinct and disjoint, image coincidence or intersection would pull back to coincidence or intersection. Thus their images remain distinct parallel lines. Coplanarity is also preserved.

### U161.2: A Line Parallel to a Plane

Write plane alpha as A+V, with V a two-dimensional direction space, and line l as B+Rv where v belongs to V and B does not belong to alpha. Their images have directions QV and Qv, with Qv belonging to QV. They remain disjoint by bijectivity. The image line is therefore parallel to, not contained in, the image plane.

### U161.3: Two Parallel Planes

Write the planes as A+V and B+V, distinct. Images share direction QV and remain distinct and disjoint, hence parallel. Equivalently, their common normal n becomes Qn, while their nonzero separation is preserved.

## 162: Central Symmetry Images, Including Coincidence

Let the symmetry center be O and S_O(x)=2O-x.

### U162.1: Image of a Line

For line l=A+Rv,

`S_O(l) = (2O-A) + Rv`.

The direction is unchanged, since negating the parameter does not change Rv. The image equals l exactly when 2(O-A) belongs to Rv, equivalently O belongs to l. Otherwise it is a distinct parallel line.

Thus the precise conclusion is "parallel or coincident"; an unconditional assertion of distinct parallelism is false. Counterexample: O=(0,0,0), l the x-axis, whose image is itself.

### U162.2: Image of a Plane

For plane alpha: n dot x=c, substitution gives the image equation

`n dot x = 2(n dot O)-c`.

The normal is unchanged. The image equals alpha exactly when n dot O=c, equivalently O belongs to alpha; otherwise it is a distinct parallel plane.

Again the complete conclusion is "parallel or coincident". Counterexample to unconditional distinctness: O=(0,0,0), alpha: z=0.

The seed's unqualified wording is valid if its "parallel" means equal directions including coincidence, or if its intended theorem carries an implicit center-outside qualification. The seed alone does not resolve that terminology. The mathematical classification above is resolved and will be the fidelity baseline; a learner view should not silently demand distinctness for all centers.

## 163: All Seven Complete Center Loci

A center O must satisfy S_O(E)=E as a set. Counting alone is too weak for comparing infinite cases: the exact locus is independently derived here.

| Unit | Figure | Complete center locus | Number |
| --- | --- | --- | --- |
| U163.1 | Segment [A,B] | {(A+B)/2} | One |
| U163.2 | Entire line l | l | Infinitely many, a line |
| U163.3 | Entire plane alpha | alpha | Infinitely many, a plane |
| U163.4 | Union of two distinct parallel planes | Their equidistant middle plane | Infinitely many, a plane |
| U163.5 | Union of two distinct intersecting planes | Their intersection line | Infinitely many, a line |
| U163.6 | Union of a plane and a line meeting it at one point P | {P} | One |
| U163.7 | Union of a plane and a strictly parallel, disjoint line | Empty set | Zero |

### U163.1: Segment

An isometry of a segment to itself permutes its two endpoints. A nondegenerate segment cannot have both endpoints fixed by central symmetry (each fixed point must be O), so endpoints swap: 2O-A=B, giving O=(A+B)/2. Conversely this center maps A+t(B-A), 0<=t<=1, to A+(1-t)(B-A), hence maps the entire segment to itself. A zero-length segment, if allowed, still has its single point as its unique center.

### U163.2: Line

The line calculation in 162 proves S_O(l)=l exactly when O belongs to l. Every such O works; no point outside l works.

### U163.3: Plane

The plane calculation in 162 proves S_O(alpha)=alpha exactly when O belongs to alpha. Every such O works; no point outside alpha works.

### U163.4: Two Parallel Planes

Write them n dot x=c_1 and n dot x=c_2 with c_1!=c_2. Symmetry maps their levels to 2(n dot O)-c_1 and 2(n dot O)-c_2. For the union to be invariant the unordered level set must stay {c_1,c_2}. Fixing both levels separately would require n dot O=c_1=c_2, impossible. Swapping them gives the single condition

`n dot O = (c_1+c_2)/2`.

Thus the complete locus is the middle plane. It is not either original plane, their union, the whole space, or just one chosen midpoint of a perpendicular connecting segment.

### U163.5: Two Intersecting Planes

The two planes have different direction spaces, and S_O preserves each direction space. Therefore it cannot swap them: each must be invariant individually. More formally an entire image plane cannot be contained in the union of these two planes without equaling one of them. Individual invariance requires O in both original planes, so the complete locus is their intersection line. Conversely every O on that line fixes each plane setwise.

### U163.6: Intersecting Line and Plane

Assume l meets alpha at exactly one point P, not that l is contained in alpha. An image plane contained in alpha union l must equal alpha: a different plane has off-alpha points forming more than a single line. Hence O belongs to alpha. The image line must equal l as well. It has the transverse direction of l, cannot be contained in alpha, and its off-alpha points must lie on l; two such points force the same line. Consequently O belongs to l as well, so O=P. Conversely reflection about P fixes both components setwise.

If "intersecting" were allowed to mean l contained in alpha, the union would simply be alpha and its center locus would be alpha. This is a different source-degeneracy reading, not the ordinary unique-intersection case used above.

### U163.7: Parallel Line and Plane

Assume strict line-plane parallelism, so l is disjoint from alpha. Again invariance of the union forces the plane to be invariant, hence O in alpha. The off-plane image line must be l, which would require O in l. These requirements are incompatible.

A direct countercheck uses alpha:z=0 and l={(t,0,h):t in R}, h!=0. Plane invariance gives O_z=0. Then the image of l has height -h, not h; it cannot coincide with the original line. Thus there are no centers, even at arbitrary points of alpha or l.

If a line contained in alpha were included in "parallel", the union would instead be alpha; the strict disjoint convention is essential and has been exposed rather than guessed.

## Coverage Baseline for the Unseen Views

All 15 source units above have been solved before any learner views. None is silently omitted in this source freeze. A later coverage check must separately account for U159, U160.1-U160.2, U161.1-U161.3, U162.1-U162.2, and U163.1-U163.7, even if several share one response.

Essential distinctions to preserve: surjectivity in 159; bijectivity versus distance preservation and the perpendicular exception in 160; all three incidence types in 161; direction preservation plus equality exceptions in 162; and all seven complete loci/counts in 163, especially the middle plane, intersection line, unique intersection point, and empty locus.

Potential choice-format losses requiring honest accounting are independent proof production for 159/162, and independently deriving a locus or argument rather than recognizing supplied alternatives for 163. Recognition is not automatically a fidelity failure, but removing an essential mathematical relationship is.

This file is now the immutable Stage 1 baseline. Learner-view option identities and truths are intentionally absent. Stage 2 may consult only the named learner-view JSON/Markdown. No author-internal disclosure or final review is authorized.
