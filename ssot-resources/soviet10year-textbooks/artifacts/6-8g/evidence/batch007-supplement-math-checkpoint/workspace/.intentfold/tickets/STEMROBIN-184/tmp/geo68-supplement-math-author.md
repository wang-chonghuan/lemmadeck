# geo68-c1-ex: Original-Only Source Math Author Package

## Request and Authority

- Ticket: STEMROBIN-184, continuation of the same invocation.
- Requested checkout: `/Users/yong/.codex/worktrees/a07e/lemmadeck`, requested branch `codex/STEMROBIN-184-textbooks`. No Git command was run to inspect or change it.
- Role: SOURCE MATH AUTHOR, not an independent reviewer.
- Scope: all 30 original tasks 152-181 of newly closed original lesson `geo68-c1-ex`, including every subpart, proof, construction, existence condition and relevant configuration.
- Ownership: this scratch Markdown and its companion `.manifest.json` only. No optional derived-answer precursor was produced.
- Authority: original `lesson.json`, `lesson.md`, `exercises.json` in `ssot-resources/soviet10year-textbooks/artifacts/6-8g/lessons/geo68-c1-ex/`; original prior lessons' `lesson.md` for definitions; actual original PNGs 76-79 for diagram data.
- Book identity supplied by the request: SHA-256 `86894f57b51cc78557505014c5af4ec17762a7c48306ff0703415e16914fe59c`. This is a supplied binding, not a claim that this author reopened or rehashed the PDF.
- The companion manifest binds the exact input bytes and all exercise source blocks. The source lesson contains no expository prose; its Markdown is a title and chapter heading.
- No previous author package, review, answer, modern edition, choice, test or source page scan was consulted. No browser, freshness initialization, Grill, live-ticket query, gate, project check, DB, publication, Git/index or chat operation was performed.
- The only computation outside manual derivation was a read-only, in-memory shortest-path calculation from the ten roads actually observed in fig-76. It produced no file and is not a reviewer gate.

**Completion:** AUTHOR_COMPLETE_WITH_EXPLICIT_HOLDS. All 30 tasks are addressed below. This is neither independent PASS nor permission to promote/publish. Optical UNKNOWNs and interpretation holds remain disclosed. The parent owns Stage A freezing and any later original-only review.

## Source Conventions

These are taken from original prior lessons, not substituted modern conventions:

1. `geo68-c1-s1`: a circumference is the set at distance exactly a **positive** radius; a circle is the closed disk at distance at most that positive radius.
2. `geo68-c1-s3`: quantities have numerical values relative to a common unit; a ratio requires its second quantity to be nonzero.
3. `geo68-c1-s4`: distance is positive for distinct points, symmetric and satisfies the non-strict triangle inequality. Distinct named points/lines are the normal convention. A line through two distinct points is unique.
4. `geo68-c1-s5`: a point between two others is distinct from both and satisfies distance additivity. For distinct Euclidean points, this is equivalent to collinearity with the middle point in between. Noncollinear triples satisfy strict triangle inequality.
5. `geo68-c1-s6`: a segment includes its endpoints; a ray includes its starting point.
6. `geo68-c1-s7`: coordinates depend on origin, positive direction and unit segment; distance equals the absolute difference of coordinates.
7. `geo68-c1-s8`: a simple open broken line has at least two segments; successive segments are not collinear and nonsuccessive segments have no common point. A simple closed broken line has the analogous cyclic requirements. The source explicitly says subsequent uses of broken line mean simple, open or closed. Length is the sum of segment lengths, not just endpoint distance.
8. `geo68-c1-s10`: a region has (i) polygonal/segment connectivity between every pair of its points, and (ii) a positive-radius closed disk about each point contained in it. A region excludes its boundary. A circle's strict interior and strict exterior are regions; the closed disk itself is not a region.
9. `geo68-c1-s11`: a polygon is a simple closed broken line together with its interior. It includes its boundary. A diagonal joins nonadjacent vertices, without requiring it to lie inside a nonconvex polygon. Convex means containing the segment between every pair of its points; the empty set and a singleton are explicitly convex.
10. `geo68-c1-s12`: half-planes include their boundary lines. An angle includes its two rays and either one of the two regions they bound, so both convex and reflex/nonconvex angles are allowed. A circular arc is circumference intersected with a selected central angle; it contains its two distinct endpoints. A proper arc, not an entire circumference or a one-point degeneration, is used in task 177.
11. `geo68-c1-s13`: distinct circumferences are externally tangent when center distance is the sum of radii, internally tangent when it is their positive absolute difference, crossing when it is strictly between difference and sum, and disjoint otherwise. Concentric means equal centers. Coincident equal-radius circumferences are not tangent and must not be counted as a one-point intersection.

Coordinates and named auxiliary points introduced below are **author construction witnesses**, not additional source givens.

## Actual Figure Inventory

One batch of four images was loaded. Each named PNG was opened **exactly once**, before any diagram-dependent solution. No reopen, crop, other image, generated diagram or image payload to the parent was used. Batch count = 4; context count = 4; limits = 8 per batch and 24 per context.

### fig-76, task 157

Observed seven labels A, B, C, D, E, F, G. Ten undirected roads and their printed lengths in km:

| Road | Length | Observed placement |
|---|---:|---|
| AF | 8 | Left outer curve from A up toward F |
| FB | 2 | Upper-left connection from F to B |
| BC | 5 | Inner downward curve from B to C |
| BD | 6 | Upper/right outer curve from B to D |
| AC | 5 | Middle connection from A to C |
| CD | 2 | Short upper-right connection from C to D |
| CE | 2 | Short downward connection from C to E |
| DE | 5 | Right outer curve from D to E |
| AG | 4 | Lower-left connection from A to G |
| GE | 3 | Lower connection from G to E |

There is no directly printed AB, AE or AD road. F is a named point on the upper-left road, not an unnamed crossing. Every drawn road terminates at the named nodes listed above; there is no additional road junction to invent.

### fig-77, task 162

Observed rectangular grid with **16 columns and 7 rows**. The horizontal marked coordinate line is on the fourth grid interval boundary below the top, extending from the left boundary to the right boundary. Six labeled points, in left-to-right order:

| Point | Column index from left boundary |
|---|---:|
| A | 1 |
| B | 4 |
| O | 6 |
| E | 9 |
| D | 13 |
| C | 16 |

Thus adjacent labeled gaps are AB = 3, BO = 2, OE = 3, ED = 4, DC = 3 grid intervals. The source has no printed numerical axis ticks. The equal grid intervals are used to determine ratios, not mistaken for either problem's unit segment. C lies on the right boundary. No cropped or extrapolated point is used.

### fig-78, task 163

There are 32 distinct Cyrillic glyph subfigures, two rows of 16:

- Upper: А Б В Г Д Е Ж З И Й К Л М Н О П.
- Lower: Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я.

No Ё is displayed. These are literal segment drawings, not smooth typographic curves. Connections, stems, extra bars and disconnected marks count. In particular О is a rectangular closed contour, and Й has a detached short accent above its И-shaped body.

| Glyph | Actual segment structure relevant to classification |
|---|---|
| А | Two sloping legs with a crossbar attached at interior leg points |
| Б | Upper stem/bar and a lower rectangular loop |
| В | Two rectangular/angular loops attached to one left stem |
| Г | One vertical and one horizontal segment meeting at an end |
| Д | Triangular contour on an extended base with short projecting feet |
| Е | Vertical spine with top, middle and bottom horizontal arms |
| Ж | Crossing/branching diagonals and a vertical stem |
| З | One continuous angular zigzag with top and bottom horizontal ends |
| И | Two vertical strokes joined by one diagonal, one open chain |
| Й | Same И body plus a separate accent segment |
| К | Vertical stem with a branching horizontal/diagonal junction |
| Л | Two sloping segments meeting at the top, open lower ends |
| М | Four connected segments in one open zigzag |
| Н | Two vertical stems joined by an interior horizontal bar |
| О | Four sides of one rectangular closed contour |
| П | Two vertical stems joined across the top, open lower ends |
| Р | Upper rectangular loop with a projecting lower stem |
| С | Three sides of an open rectangular contour |
| Т | Vertical stem attached to the interior of a top bar |
| У | Three arms meeting at one junction |
| Ф | Rectangular loop traversed by a vertical stem with extensions |
| Х | Two intersecting diagonal strokes |
| Ц | U-shaped body with a projecting lower-right tail at a junction |
| Ч | Bent upper-left arm attached to the interior of a right stem |
| Ш | Three vertical stems joined by a lower horizontal bar |
| Щ | Ш body with a further lower-right projection |
| Ъ | Upper hook/stem attached to a lower rectangular loop |
| Ы | Lower loop/stem and a separate right vertical stroke |
| Ь | Lower rectangular loop with projecting upper stem |
| Э | Open three-sided contour with a middle arm attached to its spine |
| Ю | Left stem and connector attached to a right rectangular loop |
| Я | Upper rectangular loop with descending stem/diagonal branches |

No metric values, point labels or shaded interiors occur in this figure.

### fig-79, task 175

- Subfigure а: one outer and one inner circular outline, visually concentric, with diagonal hatching **only between** them. Both outlines are solid, not dashed. The central disk is unhatched. No center, radius, numerical value, or explicit endpoint/boundary-membership legend is printed.
- Subfigure б: two unfilled circular contours meeting at a single point, one above the other. The upper circle is visibly smaller. Their interiors are not hatched. No crossing at two points, shared area, connector, center label, radius value or equality-of-radii mark appears.
- Limitation: the raster supplies the intended annular placement and external tangency, not a numerical proof of exact concentricity. More importantly, solid ring outlines plus hatching do not alone settle whether the two annular boundary circumferences are members of the requested set. The source definitions distinguish these sets. Task 175(1) therefore explicitly holds this membership interpretation rather than silently selecting a modern annulus convention.

## Solutions, Tasks 152-181

### 152

**Source request/binding:** `p0063#5`; five receiving-area drawings for A, B, C, with AB = 12 km, BC = 15 km, AC = 21 km, receiving radii 9, 12, 18 km, and 1 cm : 3 km.

On the map construct AB = 4 cm; intersect circles about A of radius 7 cm and B of radius 5 cm to obtain C. Either of the two mirror-image positions is valid. The strict triangle inequalities hold, so these are genuine triangles.

An exact witness is A = (0,0), B = (4,0), C = (5,2√6) in map centimeters. It has AC = 7 and BC = 5. Reflection in AB is the other configuration.

Let D_A, D_B, D_C be the **closed** disks of radii 3, 4, 6 map cm about these points. Boundaries are included by the source circle definition.

1. Draw each of D_A, D_B, D_C separately.
2. For points able to receive **both** A and B, shade D_A ∩ D_B.
3. For points able to receive **both** B and C, shade D_B ∩ D_C.
4. For points able to receive all three, shade D_A ∩ D_B ∩ D_C.
5. For points able to receive at least one, shade D_A ∪ D_B ∪ D_C.

These intersections are not empty: (2,0) lies strictly in all three disks, since its distances are 2, 2, √33 < 6. Thus the triple overlap has an interior, not just a tangent point. Each pair of bounding circumferences crosses, since respectively 1 < 4 < 7, 2 < 5 < 10, and 3 < 7 < 9.

**Language limitation:** the printed wording of (2)-(3) does not explicitly say “同时”. The progression to “所有三个” and “至少…一个” supports the simultaneous-reception interpretation above. If “两站的有效接收区域” is instead meant collectively, its corresponding set is D_A ∪ D_B or D_B ∪ D_C; it must not be mislabeled as simultaneous reception. This is a disclosed reading distinction, not a changed premise.

### 153

**Source request/binding:** `p0063#6`; AB is literally **2 km**, but the four equalities/inequalities use **cm** and no drawing scale is stated.

**Literal same-distance-unit solution:** 2 km = 200000 cm.

1. Empty set: AX = BX = 0.5 cm would imply AB ≤ 1 cm.
2. Empty set: AX = BX = 1 cm would imply AB ≤ 2 cm.
3. Empty set: AX < 1.5 cm and BX < 1.5 cm would imply AB < 3 cm.
4. All points strictly outside both closed disks of radius 1.5 cm about A and B. Equivalently, the plane minus their union. Neither circumference belongs. The two disks are very far apart and disjoint.

**Map-metric HOLD:** if “在图上” instead means AX and BX measured on a map while AB = 2 km is a ground distance, the map distance d = AB in centimeters is unknown. Task 152's scale must not be silently imported and “km” must not be changed to “cm”.

All map configurations, conditional on d > 0, are:

- Equal distances s = 0.5 or 1 cm: two points when d < 2s, the midpoint alone when d = 2s, no points when d > 2s. With A = (0,0), B = (d,0), the two points are (d/2, ±√(s²-d²/4)).
- Both distances < 1.5 cm: an open lens when 0 < d < 3, empty when d ≥ 3. The meeting point at d = 3 is excluded by the strict inequalities.
- Both distances > 1.5 cm: the plane minus the union of the two closed disks, for every d > 0; disjoint, tangent or overlapping disk positions follow d > 3, d = 3 or d < 3. This set is not the exterior of only one disk, and no circular boundary is included.

The literal conclusion is complete. A single intended map answer remains held for a source-authorized scale/unit interpretation.

### 154

**Source request/binding:** `p0064#1`; five set operations on two intersecting circles/circumferences. User-supplied optical UNKNOWN: **cap symbol**, unresolved here.

Let D_i = {X : O_iX ≤ r_i} and C_i = {X : O_iX = r_i}, r_i > 0. Choose crossing circumferences with |r_1-r_2| < O_1O_2 < r_1+r_2 and crossings P,Q. Such a drawing is allowed; “intersecting disks” alone would also allow containment, so the crossing condition is explicitly the configuration chosen, not a universal consequence of disk intersection.

For the current transcription's intersection symbols:

1. C_1 ∩ C_2 = {P,Q}.
2. D_1 ∩ C_2 is the closed arc of C_2 inside D_1, including P and Q, not a filled lens and not a chord.
3. D_1 ∩ D_2 is the closed filled lens, including both bounding arcs.
4. D_1 ∪ D_2 is both filled disks together.
5. C_1 ∪ C_2 is both circumferences, without filling either interior.

For any other overlapping-disk configuration, the same set predicates are the full answer: circumferences can have 0, 1, 2 or, for coincident circles, infinitely many common points; D_1 ∩ C_2 can be empty, a point, an arc or all of C_2; disk intersection can be a point or the smaller disk instead of a lens. The crossing construction above avoids these ambiguities without claiming all overlap has that shape.

**HOLD:** the derivation does not resolve the optical UNKNOWN. In particular, if the uncertain glyph is union rather than intersection, its answer must use union. The companion records the exact transcription hash, not an optical approval.

### 155

**Source request/binding:** `p0064#2`; prove x_1:x_2 = y_1:y_2 under two units.

Both units measure the same kind of quantity and are positive. Write e_2 = k e_1 with k > 0. Then

a = x_1 e_1 = y_1 e_2 = k y_1 e_1,  
b = x_2 e_1 = y_2 e_2 = k y_2 e_1.

Hence x_1 = k y_1 and x_2 = k y_2, so x_1/x_2 = y_1/y_2. The source ratio definition requires b ≠ 0 (equivalently x_2,y_2 ≠ 0); if b = 0 neither ratio is defined and no equality of defined ratios is asserted.

### 156

**Source request/binding:** `p0064#3`; A “在圆 (O,r) 内”, OA = a; show circle (A,r-a) is within circle (O,r).

For 0 ≤ a < r, let X belong to the closed disk (A,r-a). Triangle inequality gives

OX ≤ OA + AX ≤ a + (r-a) = r.

Thus every such X belongs to the original **closed** disk (O,r).

Boundary qualifications are essential:

- If a = 0, the two disks are equal, so “within” cannot mean proper subset.
- If 0 < a < r, the smaller disk meets the larger circumference at the point on ray OA at distance r from O. Therefore the entire smaller closed disk is **not** contained in the larger disk's strict interior.
- If “A is in the circle” were taken as arbitrary closed-disk membership, a = r is allowed, but r-a = 0 is not a circle radius under the source's positive-radius definition. That boundary case is undefined as a circle, not something silently repaired by declaring a radius-zero circle. If one separately allowed the singleton {A}, its containment would hold.

The valid proof is closed-disk containment for the positive-radius case. A reading that demands strict interior containment is false; a closed-membership reading permitting a = r needs the stated qualification.

### 157

**Source request/binding:** `p0064#4`, `p0064#7`; fig-76; four shortest-road distances, three metric properties, and points between three pairs.

1. Distances in km:
   - а) AB = 10, achieved by A-F-B = 8+2 and also A-C-B = 5+5.
   - б) BC = 5, by the direct road.
   - в) CD = 2, by the direct road.
   - г) ED = 4, by E-C-D = 2+2, shorter than road ED = 5.
2. All three basic distance properties hold. All road lengths are positive and the graph is connected, so distinct nodes have a positive shortest distance and a node has distance zero to itself. Reversing a road path preserves its length, proving symmetry. Concatenating a shortest U-V path and a shortest V-W path gives a U-W route, whose length is at least the shortest U-W distance; hence d(U,W) ≤ d(U,V)+d(V,W). The concatenated route may repeat a node; removing any resulting positive-length cycle only shortens it.
3. Use the source's **distance-additivity definition** of between, now with the road metric; do not use the nodes' visual Euclidean positions.
   - Between A and B: C and F. Both shortest routes must be retained.
   - Between A and E: C and G, from A-C-E = 5+2 and A-G-E = 4+3.
   - Between A and D: C, from A-C-D = 5+2.

For completeness, the distance matrix is:

| | A | B | C | D | E | F | G |
|---|---:|---:|---:|---:|---:|---:|---:|
| A | 0 | 10 | 5 | 7 | 7 | 8 | 4 |
| B | 10 | 0 | 5 | 6 | 7 | 2 | 10 |
| C | 5 | 5 | 0 | 2 | 2 | 7 | 5 |
| D | 7 | 6 | 2 | 0 | 4 | 8 | 7 |
| E | 7 | 7 | 2 | 4 | 0 | 9 | 3 |
| F | 8 | 2 | 7 | 8 | 9 | 0 | 12 |
| G | 4 | 10 | 5 | 7 | 3 | 12 | 0 |

This checks exhaustiveness: an unlisted node does not satisfy d(A,X)+d(X,Y)=d(A,Y). If road interiors as well as named residents' nodes are in the question's universe, all internal points of the corresponding shortest routes are also between: interiors of A-F-B and A-C-B; A-C-E and A-G-E; A-C-D, respectively. Endpoints are excluded by the source definition. The road metric does not make these visually curved routes Euclidean straight lines.

### 158

**Source request/binding:** `p0064#8`; construct five distinct points determining 1, 5, 6, 8 and 10 distinct straight lines.

Coordinate witnesses:

1. **1 line:** (0,0),(1,0),(2,0),(3,0),(4,0), all collinear.
2. **5 lines:** (0,0),(1,0),(2,0),(3,0),(0,1). One base line plus four different lines from the off-line point to the base points.
3. **6 lines:** (-1,0),(0,0),(1,0),(0,1),(0,-1). The horizontal and vertical three-point lines plus four diagonals joining the off-axis-endpoint pairs. These are distinct; there is no third three-point line.
4. **8 lines:** (0,0),(1,0),(2,0),(0,1),(2,3). Exactly the first three are collinear; their three pair-lines count as one, reducing the ten pair-lines by two. The other two points create no further collinear triple.
5. **10 lines:** (t,t²) for t = 0,1,2,3,4. No line contains three of them: substituting a nonvertical line into y = x² gives a quadratic with at most two roots, and a vertical line contains just one. Each of the ten unordered pairs determines a different line.

These constructions illustrate existence, not a claim of uniqueness of each arrangement.

### 159

**Source request/binding:** `p0064#9`; C between A,B and X between A,C; prove all four collinear.

By the source betweenness/collinearity equivalence, A,C,B lie on their unique line. Likewise A,X,C lie on their unique line. Both lines contain the distinct points A,C, so line uniqueness makes them the same line. All four lie on it. Their actual order is A-X-C-B or its reversal.

### 160

**Source request/binding:** `p0064#10`; A,B,C,D not all collinear; printed target is literally `AD < |AB|+|BC|+|CD|`. User-supplied optical UNKNOWN: **bars**.

**Literal diagnosis:** AD denotes a segment under the source notation, whereas |AD| denotes its length. A segment cannot be compared to a sum of lengths with `<`. The displayed target is not a well-typed mathematical inequality if the bars are truly absent. No source file is changed.

**Conditional length solution, explicitly not an optical repair:**

|AD| ≤ |AC|+|CD| ≤ |AB|+|BC|+|CD|.

If equality held throughout, B would be between A,C, and C between A,D, by the equality condition for distance additivity. The unique line through A,C would then contain B and D, contradicting the premise. Therefore |AD| < |AB|+|BC|+|CD|. Equivalently, at least one of the two triangle inequalities must be strict.

**HOLD:** whether the original target actually has absolute-distance bars. The proof above resolves the intended length claim conditionally, not the unresolved source glyph.

### 161

**Source request/binding:** `p0065#1`; X on line p through distinct A,B; four loci.

Choose coordinate A = 0 and B = d > 0. Let M be the midpoint, coordinate d/2, and let A' have coordinate -d, so A is the midpoint of A'B. By |AX| = |x| and |BX| = |x-d|:

1. |x| = |x-d| iff x = d/2: the single point M.
2. |x| ≤ d iff -d ≤ x ≤ d: the closed segment A'B.
3. |x|-|x-d| = d iff x ≥ d: the closed ray from B directed away from A, including B.
4. |x| ≥ |x-d| iff x ≥ d/2: the closed ray from M toward B, including M.

For (3), the difference is -d for x ≤ 0, 2x-d for 0 ≤ x ≤ d, and d for x ≥ d. This proves necessity as well as sufficiency. For (4), squaring the nonnegative distances gives x² ≥ (x-d)² iff x ≥ d/2.

### 162

**Source request/binding:** `p0065#2`; fig-77; both origins/units and all eight requested distance values.

1. Origin O, positive ray OC, unit OE = 3 grid intervals:
   - A = -5/3, B = -2/3, C = 10/3, D = 7/3.
   - In this same unit: AC = 5, BD = 3, OA = 5/3, CD = 1.
2. Origin A, positive ray AD, unit AE = 8 grid intervals:
   - O = 5/8, B = 3/8, C = 15/8, D = 12/8 = 3/2.
   - In this unit: AC = 15/8, BD = 9/8, OA = 5/8, CD = 3/8.

The grid counts are AC = 15, BD = 9, OA = 5, CD = 3. Divide by 3 or 8 respectively. The coordinate conversion from (1) to (2) is x' = (3x+5)/8; moving the origin does not change a distance, but changing the unit changes its numerical value.

### 163

**Source request/binding:** `p0065#5`; classify all actual subfigures in fig-78.

1. Simple open broken lines: **Г, З, И, Л, М, П, С**.
2. Simple closed broken lines: **О**.

Each listed open shape is one connected chain, with two endpoints, noncollinear successive segments and no intersection of nonsuccessive segments. О is one four-segment cycle with the analogous cyclic conditions. It is not an open simple broken line, since the first and last segments have a common point that is permitted only in the cyclic definition.

All remaining 24 glyphs fail:

- А, Б, В, Д, Е, Ж, К, Н, Р, Т, У, Ф, Х, Ц, Ч, Ш, Щ, Ъ, Ь, Э, Ю, Я have a branch/crossing or a loop with attached segment; the entire set is not one simple chain/cycle.
- Й and Ы contain disconnected components. In Й the accent must not be discarded.

Closed polygonal contours within a larger glyph do not make the **whole glyph** a simple closed broken line. Nor may a crossing be treated as a harmless overpass: these are coplanar segment unions.

### 164

**Source request/binding:** `p0065#8`; three prescribed length lists for a closed broken line. User-supplied optical UNKNOWN: **word**, unresolved here.

For any closed polygonal chain, each segment connects points also connected by the remaining path; triangle inequality implies that its length cannot exceed the sum of all the others. For a simple closed broken line the inequality is strict: equality would force the return path onto the same straight segment, contradicting simplicity/noncollinearity.

1. 2,3,4,10 cm: **no**, since 10 > 2+3+4 = 9.
2. 3,3,4,4 cm: **yes**. Draw a kite with sides 3,3,4,4 in the requested cyclic order as follows: A = (0,0), C = (4,0), B = (2,√5), D = (2,-√12). Then AB = BC = 3 and CD = DA = 4. The four edges form a simple convex kite, not a self-crossing chain. A rectangle of side lengths 3 and 4 is also a witness if the list is unordered, but its cyclic order is 3,4,3,4 rather than 3,3,4,4.
3. 4,5,0.5 cm: **no**, since 5 > 4+0.5 = 4.5.

The chosen witness in (2) respects even the stricter reading that the printed lengths are in cyclic order. No equal-max-length degeneration occurs in these data. The outcomes remain no/yes/no even if the uncertain word allowed a nonsimple closed chain, because the two impossibilities violate the non-strict inequality and the positive witness is simple.

**HOLD:** the optical word itself is not independently resolved. The current transcript's closed-chain request has been solved; if that word changes the kind of requested object, the conditional authority must be reconsidered.

### 165

**Source request/binding:** `p0066#1`; three segments, total 3a, containing all square vertices; prove neither count nor length can be reduced. Let a > 0.

For square vertices A = (0,0), B = (a,0), C = (a,a), D = (0,a), take open chain A-B-C-D. Its three segments each have length a; it contains all four vertices and is simple.

**Length minimality, including vertices lying in segment interiors:** parameterize any containing polygonal chain by traversal. Record the first encounter with each of the four distinct square vertices, in traversal order V_1,V_2,V_3,V_4. The three portions between those encounters have lengths at least |V_1V_2|, |V_2V_3|, |V_3V_4|. Any distinct square vertices are at distance at least a. Therefore the chain's total length is at least 3a. Any path before the first encounter or after the last only adds length. For a closed chain choose any traversal starting point and apply the same lower bound.

**Segment-count minimality:** one straight segment cannot contain all four corners. If two joined segments contained all four, neither supporting line could contain more than two corners, so each would have to contain exactly a pair and the pairs would be disjoint. There are three pairings:

- Two opposite sides have parallel supporting lines, so the segments cannot join.
- The other opposite-side pairing is likewise parallel.
- The two diagonals meet at the square's center, inside both corner-to-corner diagonals. Two successive segments sharing an endpoint at that center cannot each extend to both opposite vertices on their own line. Moreover full crossing diagonals would not be a simple chain.

Thus at least three segments are required, and the witness attains both minima. No premise that all square vertices must be chain vertices is needed.

### 166

**Source request/binding:** `p0066#2`; literal “棱长为 a 的正方形”, seven segments of total 7a, and claim that these cannot be reduced. **正方形 is retained. No cube correction is made.**

**Diagnosis:** “棱长” is not a defined square dimension in the source; even granting a as the square's side length, the requested seven-segment/7a minimality is false by task 165's three-segment/3a construction.

The existence part can nevertheless be witnessed under that stated side-length interpretation:

A = (0,0), B = (a,0), C = (a,a), D = (0,a),  
E = (0,2a), F = (-a,2a), G = (-a,3a), H = (-2a,3a).

Chain A-B-C-D-E-F-G-H has exactly seven segments, each of length a. Successive segments alternate directions, nonsuccessive segments do not meet, and all four square vertices occur. It is a simple open chain of length 7a.

The seven segments and 7a **can** be reduced to three and 3a, respectively, and task 165 proves these are the square's true minima. Hence the literal combined task cannot receive a valid proof of its last sentence. If “棱长” is insisted upon without a square side interpretation, the dimensional terminology itself is also unresolved. This package diagnoses both issues; it does not offer a cube solution or a repaired source request.

### 167

**Source request/binding:** `p0066#3`; decide whether union/intersection of two regions is always a region.

Both universal propositions are **false**, using the source's two region properties.

1. Let U = {X : OX < 1} and V = {X : OX > 1}. Both are source-defined regions. U ∪ V excludes the unit circumference; no polygonal path from an inside point to an outside point can stay in that union, since the continuous distance from O must take value 1. Thus the union fails connectivity. Its openness alone is not enough.
2. Let U = { (x,y) : x²+y² > 1 }, the circle's exterior region, and V = { (x,y) : |y| < 1/2 }, an open strip. V is convex and contains a positive-radius disk about each point, so it is a region. Their intersection contains (-2,0) and (2,0), but contains no point with x = 0. Any connecting polygonal path would have to reach x = 0. Thus it is disconnected, although nonempty and open.

Positive cases exist too: overlapping open disks can have a connected open-lens intersection and a connected open union. In general openness is preserved by finite union/intersection, but connectivity is not. If a union/intersection is nonempty and polygonally connected, it is a region. The counterexamples above do not depend on deciding whether the source's two universal conditions admit the empty set vacuously.

### 168

**Source request/binding:** `p0066#4`; any convex n-gon as intersection of n half-planes.

For every side A_iA_{i+1}, draw its supporting line p_i and select the **closed** half-plane H_i that contains the polygon's interior. Convexity puts the whole polygon in H_i: if there were polygon points on opposite sides of a side's line, convexity would put segments across that side and make the side cease to be a boundary side.

Hence P ⊆ H_1 ∩ ... ∩ H_n. Conversely take X outside P and an interior point Q. Segment QX first exits P at Y before X. If Y is inside a side, the side's signed half-plane distance is positive at Q and zero at Y; along the same line beyond Y it is negative, so X is outside that H_i. If Y is a vertex, apply the same argument to its incident supporting lines; Q is strictly inside their half-planes and X beyond Y is outside them. Thus an outside X cannot lie in all H_i.

Therefore P = ⋂ H_i. Include every boundary line: open half-planes would give the strict interior and omit the source polygon's edges and vertices. Any reflection, rotation or scale of the construction has the same property.

### 169

**Source request/binding:** `p0066#5`; for a convex quadrilateral, half-perimeter < sum of diagonal lengths < perimeter.

Let vertices be A,B,C,D in boundary order, p = AB+BC+CD+DA and s = AC+BD.

Upper bound:

AC < AB+BC and AC < AD+DC give 2AC < p.  
BD < BA+AD and BD < BC+CD give 2BD < p.

Adding yields s < p. All four triangles are noncollinear because the convex quadrilateral is nondegenerate with no collinear consecutive sides.

For the lower bound, the diagonals of a convex quadrilateral meet at O in the interior of each. In each of the four triangles around O:

AB < AO+OB, BC < BO+OC, CD < CO+OD, DA < DO+OA.

Adding yields p < 2(AO+OC+BO+OD) = 2s, so p/2 < s. The strictness follows because O is not on a side. The convexity assumption is used for the interior intersection and must not be omitted.

### 170

**Source request/binding:** `p0066#6`; prove diagonal count n(n-3)/2.

Each of n vertices can be joined to n-3 other vertices that are neither itself nor its two boundary neighbors. This counts n(n-3) directed vertex-to-vertex choices. Every diagonal occurs twice, once from each endpoint, so there are n(n-3)/2 diagonals.

Equivalently, subtract n sides from all n(n-1)/2 unordered pairs. The result includes nonconvex polygons because the source defines a diagonal by vertex adjacency, not by lying in the interior. For n = 3 the answer is zero.

### 171

**Source request/binding:** `p0066#7`; concepts used in defining (1) simple closed broken line, (2) polygon.

1. Direct source definition uses a simple open broken line A_1...A_n and the joining segment A_nA_1; cyclic adjacency of segments; collinearity of successive segments; having/no common points for nonsuccessive segments; and set union. Expanding the prerequisite simple-line definition uses points/vertices, segments, their order and intersection. It is not enough to say merely “a line whose ends coincide”; this omits simplicity and cyclic noncollinearity.
2. The source polygon definition uses a **simple closed broken line**, its **internal region** in the plane, and their **union**. Its boundary/inside distinction is essential. The prerequisite internal region uses the plane split by the closed line and the source concept of region. Side, vertex and perimeter are then defined from the broken line; they are not substitutes for the polygon definition.

### 172

**Source request/binding:** `p0066#8`; two triangles whose union is a square and intersection a segment.

Draw square ABCD and its diagonal AC. Let T_1 be filled closed triangle ABC and T_2 be filled closed triangle ACD. The diagonal partitions the square into these two halves, so T_1 ∪ T_2 is the square and T_1 ∩ T_2 = [AC], including A and C. The alternative diagonal BD works equally.

These are source polygons with their interiors, not just three-segment triangular outlines. Two outlines would not fill the square.

### 173

**Source request/binding:** `p0066#9`; definitions of tangent, crossing, disjoint and concentric circumferences.

For distinct positive-radius circumferences:

1. Tangent: exactly one common point, the point of tangency. External tangency has d = r_1+r_2; internal tangency has d = |r_1-r_2| > 0.
2. Crossing/intersecting in the source's narrower terminology: exactly two common points, equivalently |r_1-r_2| < d < r_1+r_2.
3. Disjoint: no common point, equivalently d > r_1+r_2 or d < |r_1-r_2|. The latter includes distinct concentric unequal-radius circles.
4. Concentric: centers coincide, d = 0. For distinct circumferences this forces unequal radii and no common points.

Coincident equal-radius circles have infinitely many common points; they are neither tangent nor crossing in the above source senses. Set-theoretic “have nonempty intersection” is broader than the textbook's two-point “相交”.

### 174

**Source request/binding:** `p0066#10`; four center-distance/radius triples.

1. d = 5, r_1 = 2, r_2 = 3: externally tangent, since 5 = 2+3.
2. d = 7, r_1 = r_2 = 3: externally disjoint, since 7 > 6.
3. d = 7, r_1 = 10, r_2 = 3: internally tangent, since 7 = 10-3; circumference 2 lies inside circle 1 except for the tangency point.
4. d = 3, r_1 = 2, r_2 = 5: internally tangent, since 3 = 5-2; circumference 1 lies inside circle 2 except for the tangency point.

Each tangent case has exactly one common circumference point.

### 175

**Source request/binding:** `p0066#11`, `p0067#1`; fig-79; define ring а and figure-eight б.

1. The annular shape is bounded by two concentric circumferences with 0 < r < R and common center O. Its unambiguous strict middle is {X : r < OX < R}. If **both** drawn boundaries belong, the full definition is

   K = {X : r ≤ OX ≤ R}
     = circle(O,R) minus the strict interior of circle(O,r).

   This is a closed annular set, not a region in the source sense. By contrast, circle(O,R) minus circle(O,r) gives r < OX ≤ R and excludes the inner boundary. It is not the same set. The strict annular region excludes both boundaries; the remaining half-open possibility r ≤ OX < R excludes only the outer.

   **HOLD, exactly:** fig-79 shows hatching between solid contours but supplies no explicit membership rule for those contours. The source's closed-circle and open-region definitions do not by themselves define the new term “圆环”. This author does not silently certify one of these four sets as the uniquely intended source definition. The boundary-included definition above is a complete conditional standard answer, with all alternative memberships explicitly distinguished. No equal-radius ring or exact numeric radius is inferred from the raster.
2. The figure-eight is C_1 ∪ C_2 for two **externally tangent circumferences**, with O_1O_2 = r_1+r_2 and r_i > 0. The union contains their common tangency point and both unfilled contours. Equal radii are not required and are not shown. It is not the union of two filled disks, nor two crossing circumferences with two intersection points. Reflection, rotation, or different unequal positive radii preserves the definition.

### 176

**Source request/binding:** `p0067#2`; show circle(O,r) minus circumference(O,r) is a region.

The set is U = {X : OX < r}, with r > 0.

For any P,Q in U and X = (1-t)P+tQ on their segment, 0 ≤ t ≤ 1,

OX ≤ (1-t)OP+tOQ < r.

Thus [PQ] ⊆ U, proving the source's first region property, even with a segment instead of a broken line. For any P in U choose ε = (r-OP)/2 > 0. If PX ≤ ε, then

OX ≤ OP+PX ≤ OP+ε < r.

So the positive-radius **closed** disk about P of radius ε is contained in U, proving the second property. Excluding the circumference is necessary; a boundary point of the original closed disk admits no such neighborhood.

### 177

**Source request/binding:** `p0067#5`; count regions of the plane after removing each complete specified set. Boundary objects themselves are not counted as regions.

1. **One line and one circumference:**
   - No intersection: 3 regions. The line has two sides and the circle splits one of them into its interior and the remaining outside.
   - Tangency: 3 regions. One touching point does not split the circle's interior.
   - Two distinct crossings: 4 regions, the two disk-interior pieces and the two exterior pieces in the line's half-planes.
   - Therefore attainable counts are 3 and 4, not a universal single count.
2. **One line and one proper closed circular arc:**
   - With 0 or 1 distinct intersection point with the line: 2 regions. A finite unattached arc, a one-point attachment, or its portions with free ends creates no closed barrier within either half-plane.
   - With 2 distinct intersections: 3 regions. The subarc between those points and the line segment between them bound one additional circular cap. The rest of the arc, if any, has free ends and makes no additional region.
   - Crossings at the arc's endpoints count: an arc with both endpoints on the line can create the third region. One endpoint on the line alone does not.
   - Tangency at an interior arc point or endpoint is one distinct meeting point and gives 2, not 3.
   - A line meets the supporting circumference at most twice, so the arc gives no more than 3 regions. A whole circumference would fall under (1), but is not the proper two-distinct-endpoint arc defined by the source.
3. **One closed ray and one circumference:**
   - 3 regions iff the ray meets the circumference at two distinct points, so it contains a nondegenerate complete chord and divides the circular interior in two.
   - Otherwise 2 regions. This includes a disjoint ray, a tangent ray, a ray starting strictly inside and exiting once, and a ray starting on the circumference directed outward or tangentially.
   - If the ray starts on the circumference and points inward, its start plus its other exit are two distinct meetings, giving 3.
   - If it starts outside on a secant line, the inward direction gives 3 only when the **ray**, not merely its supporting line, reaches both meetings; pointing away gives 2.
   - The outer portion is a single ray attached to the circular boundary and going to infinity, possibly with an additional finite free-ended initial portion. It does not split the exterior into two components: paths can run around the circle and any finite free endpoint. Thus a ray must not be mistaken for an infinite line giving four regions.

The count is of maximal polygonally connected open pieces of the complement. Each has the source region's neighborhood property because the line/ray/circumference/closed arc removed is closed. The distinctions above retain endpoint membership and tangency, not just generic crossing drawings.

### 178

**Source request/binding:** `p0067#6`; can the intersection of two source-defined angles be convex or nonconvex?

Both are possible.

1. Convex example with two distinct angles at O = (0,0):
   - K_1 = {x ≥ 0, y ≥ 0}, the closed first-quadrant angle.
   - K_2 = {y ≥ 0, y ≤ x}, the closed 45-degree angle.
   - K_1 ∩ K_2 = K_2, which is convex, since both defining half-planes are convex.
2. Nonconvex example with two distinct reflex angles:
   - L_1 = {x ≤ 0 or y ≤ 0}, the closed reflex angle omitting only the open first quadrant.
   - L_2 = {x ≥ 0 or y ≥ 0}, the closed reflex angle omitting only the open third quadrant.
   - Their intersection contains P = (2,-1) and Q = (-1,2), but not their midpoint (1/2,1/2). It is therefore nonconvex.

Each reflex set is its two boundary rays together with the selected larger angular region, exactly as allowed by `geo68-c1-s12`. If both angles were required to be convex, their intersection would necessarily be convex, but the original request makes no such restriction.

### 179

**Source request/binding:** `p0067#7`; (1) locus of centers tangent at a specified A on a given circumference, (2) fixed-radius construction tangent to two given circumferences in disjoint/tangent/crossing positions.

#### 179(1): All centers, all tangency types

Let A lie on circumference(O,r), r > 0. For any desired center P the radius must be s = PA > 0. A tangency at A gives either OP = r+s or OP = |r-s|, and equality in the corresponding triangle inequality forces O,A,P collinear.

Conversely every point of line OA except **A and O** works: A would give zero radius; O would give the same circle, not tangency.

For an explicit exhaustive parameterization set A = 0 and O = r on the line, P = t:

- t < 0: centers on opposite sides of A; external tangency, s = -t.
- 0 < t < r: the desired smaller circle lies internally tangent inside the given one, s = t.
- t > r: the desired larger circle encloses the given circle with internal tangency, s = t.
- t = 0 and t = r are excluded as above.

Thus the locus is the entire line OA minus those two points, not just one ray or the line with only one point removed.

#### 179(2): Complete construction and existence test

Let prescribed radius r > 0 and original r_1,r_2 > 0. A center P is valid for circle i iff

PO_i = r_i+r (external), or PO_i = |r_i-r| > 0 (internal).

For each i draw the auxiliary circumference about O_i of radius E_i = r_i+r and, when positive, I_i = |r_i-r|. The latter's radius-zero case is **not** an auxiliary circle or an acceptable target center: r = r_i, P = O_i would coincide with original circle i.

Intersect every available pairing (E_1,E_2), (E_1,I_2), (I_1,E_2), (I_1,I_2). At each intersection P draw the circumference(P,r). Deduplicate identical centers across pairings; validate genuine one-point tangency to both originals. The first/second auxiliary choices encode the corresponding external/internal types, with no extra restriction that both be external.

For d = O_1O_2 > 0 and selected positive auxiliary radii a,b:

- |a-b| < d < a+b: two centers.
- d = a+b or d = |a-b| > 0: one center.
- d > a+b or d < |a-b|: no center.

These necessary and sufficient triangle conditions prove exhaustiveness: any desired center must lie in one of these pairs, and each admissible center gives the requested tangencies.

A straightedge/compass description is complete without numerical radii: form sums/differences by transferring given radii along a line, draw the auxiliary circumferences, and take their intersections. If coordinates are useful, for O_1 = (0,0), O_2 = (d,0), a given pair yields

x = (d²+a²-b²)/(2d), y = ±√(a²-x²).

Positive, zero, or nonexistent real square root gives two, one, or no centers. These are mathematical construction coordinates, not a new source grid.

Original-position cases:

- **а, externally disjoint**, d > r_1+r_2: a solution exists iff r ≥ (d-r_1-r_2)/2. Necessity follows because every auxiliary radius is at most its E_i and hence d ≤ r_1+r_2+2r is required. Sufficiency follows from the E_1/E_2 pair, whose radius difference is |r_1-r_2| < d. At equality that pair has one center; above it two. Other valid pairings still have to be included for all internal-tangency configurations.
- **а, strictly nested and disjoint**, 0 ≤ d < R-q with R = max(r_1,r_2), q = min(r_1,r_2): a solution exists exactly when the prescribed positive r is in at least one of

  [(R-q-d)/2, (R-q+d)/2] or [(R+q-d)/2, (R+q+d)/2].

  The first interval is for a target external to the smaller circle and internal to the larger: auxiliary radii q+r and R-r have difference |2r-(R-q)|. The second is for a target enclosing the smaller but lying inside the larger: radii r-q and R-r have difference |2r-(R+q)|. The required upper sum bounds hold automatically in the nested case. Other tangency combinations have auxiliary radius differences exceeding d, so contribute no missing solutions.
- **Concentric nested subcase**, d = 0, R > q: the intervals collapse to r = (R-q)/2 or r = (R+q)/2. For the first, all centers on the common-center circumference of radius (R+q)/2 work; for the second, all centers at radius (R-q)/2 work. Both are infinite families. This must not be reduced to two isolated centers. In the general auxiliary rule, d = 0 gives a whole auxiliary circumference when a = b > 0 and no intersection when a ≠ b.
- **б, externally tangent**, d = r_1+r_2: E_1/E_2 supplies two centers for every r > 0. All other available pairings are processed by the same test, including endpoint/equality cases.
- **б, internally tangent**, d = |r_1-r_2| > 0: E_1/E_2 supplies one center for every r > 0. The other pairings give any additional valid configurations; radius-zero/coincident targets remain excluded.
- **в, crossing**, |r_1-r_2| < d < r_1+r_2: E_1/E_2 supplies two centers for every r > 0. All other admissible pairings are again retained.

Coincident originals are outside the source's three distinct-circle position alternatives. If nevertheless considered, tangency to the repeated identical original is a one-circle constraint, with whole-circle center loci rather than the finite construction above.

A prescribed r therefore does **not** guarantee a solution for arbitrary disjoint originals. For example, r_1 = r_2 = 1, d = 5, r = 1/2 has none, since even E_1+E_2 = 3 < 5. These numbers are an author counterexample to an unconditional existence claim, not source givens.

### 180

**Source request/binding:** `p0067#8`; AB = 4 cm, BC = 5 cm, AC = 6 cm; three circles centered at the vertices, pairwise externally tangent.

Let radii be x at A, y at B, z at C. External tangency requires

x+y = 4, y+z = 5, x+z = 6.

Adding/subtracting gives the unique solution x = 5/2, y = 3/2, z = 7/2 cm. All are positive, and their pair sums check 4,5,6. Construct the nondegenerate 4-5-6 triangle and draw these three circumferences.

Each pair's tangent point lies on its side segment, at the assigned radius from the corresponding endpoint. In general positive radii are half the sums of the two incident sides minus the opposite side; their positivity is equivalent to the strict triangle inequalities, which these data satisfy. No inner tangencies or negative radii meet this request.

### 181

**Source request/binding:** `p0067#9`; three distinct circumferences tangent at the same M; first two internally tangent; find all three center distances and prove collinearity.

Internal tangency of circles 1 and 2 means their centers are on the **same** side of M on their common center line, with r_1 ≠ r_2. Thus

O_1O_2 = |r_1-r_2|.

Tangency of either with circle 3 at M forces O_3 onto the same line: the radii to M and the relevant sum/difference center-distance equality force the three points of that pair to be collinear. Therefore O_1,O_2,O_3,M are collinear.

The source does **not** specify which side O_3 occupies. Both configurations must be retained:

1. **O_3 on the same side of M as O_1,O_2:** all three pairs are internally tangent,
   - O_2O_3 = |r_2-r_3|,
   - O_1O_3 = |r_1-r_3|.
   Distinct circumferences require r_3 different from both r_1 and r_2 in this case. All possible radius orderings give these formulas; no ordering such as r_1 > r_2 > r_3 is assumed.
2. **O_3 on the opposite side of M:** the other two pairs are externally tangent,
   - O_2O_3 = r_2+r_3,
   - O_1O_3 = r_1+r_3.
   Here r_3 may equal either of the first two radii without circle coincidence.

Witnesses for both cases: choose a line through M = 0, put O_1 = r_1, O_2 = r_2 on it and O_3 = r_3 or -r_3, then draw the three circles with their respective positive radii. The stated pair-distance relations make M the unique tangency point for every pair. A configuration with one of pairs 1-3 and 2-3 external and the other internal is impossible because centers 1 and 2 are already on the same side of M.

## Exact Limitations and Handoff

- Author coverage is 30/30, not 30 independently approved answers. Every source subpart has a solution, literal inconsistency diagnosis or explicitly conditional/held interpretation.
- User-known optical UNKNOWNs remain: task 154's cap, task 160's distance bars, task 164's object word. Only current authoritative transcription was read; no scan was reopened to claim optical resolution.
- Task 153 has a literal cm/km solution, but its intended map scale/unit is held. No previous exercise scale was borrowed.
- Task 152's collective-versus-simultaneous wording is disclosed with both set meanings. The principal drawing sequence uses simultaneous reception.
- Task 156 proves closed-disk containment with positive radius; strict-interior containment is false, and the a = r radius-zero boundary is not a source circle.
- Task 166 retains literal 正方形. The seven-segment existence is conditional on interpreting a as its side; minimality is disproved, and “棱长” remains a terminology problem. No cube replacement is offered.
- Task 175(1)'s exact annular boundary membership is held; task 175(2)'s unfilled externally tangent circumference union is fully specified.
- Task 177 retains every relevant intersection, tangency, endpoint and ray-direction case; no single generic picture is made authoritative.
- Task 179 retains external/internal, finite/infinite, concentric, unavailable-radius and no-solution cases. Task 181 retains both sides for the third center.
- No source corrections, durable answer keys, modern prose, choice conversions or publication decisions are included. No artifact claims optical or independent mathematical PASS.
- Figure images must not be sent to or reopened by the parent as a batch. This text inventory and the manifest's existing absolute paths/hashes are the handoff evidence. Parent may disclose the frozen package to its original-only reviewer after Stage A freeze; no reviewer was contacted by this author.
