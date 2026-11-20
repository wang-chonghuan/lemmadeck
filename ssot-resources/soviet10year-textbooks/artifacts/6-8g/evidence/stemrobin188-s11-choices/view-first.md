# View-first independent review

Read only `s11-choice-author/view-only.json` after source-first.md was written and hashed. No author IDs, source_solution, key, rationale, derivation, limitations or coverage have been read at this stage.

Source-first file-byte SHA-256: `4f912158f7e5a3e38f01d96627e21b069cefc1d4a1b04f6bb71245f2be0e12d4`.
View-only file-byte SHA-256: `2b9325ff5e0afe90f24574f38121b0826b944e243528da86cbd2c8cc37d12f47`.
Questions: 13 in array order V01-V13. Options: 58, all evaluated below. New images opened in this stage: 0. Cumulative reviewer-context image loads: 1.

## Purpose gate recorded before option truth/key comparison

| View | Fidelity | Redundancy | Leakage |
| --- | --- | --- | --- |
| V01 | Provisional pass: retains sums over complete boundaries of triangle, quadrilateral and pentagon with common cm units. Supplies all lengths, so loses ALL free construction, ruler work and measurement recording; author must explicitly retain those losses. It does not complete written source 107. | Pass: four complete triples test different addition/count/product procedures; no isolated response cells. | Pass: numerical answers are not supplied, only side data needing addition. |
| V02 | Pass: preserves universal closed-boundary vertex/edge relation. | Pass: alternatives test open-chain extra endpoint, double count, and extra edge. | Pass: neither n nor p is assigned a value or key relation. |
| V03 | Pass: preserves universal claim and requires a genuine open-chain counterexample. | Pass: complete arguments differ in universal truth and closure reasoning. | Pass: options state competing justifications, not an external answer cue. |
| V04 | Provisional pass: preserves both vertex-count questions AND all triangle-intersection categories, including point, segment and empty. Explicitly retains full selected angle regions, including reflex ones. Loses self-generated construction drawings from 111; must be recorded. Excluding straight angles does not change bounded-polygon possibilities. | Pass: 3/4 versus 5 angle vertices, lower-dimensional triangle cases, 3-6 convex polygon cases, nonconvex and seventh-edge errors are distinct checks. D permits elimination of E/F after the classification is established; reasonable elimination is not a defect. | Pass: supplying the actual angle convention is necessary input, not a vertex-count answer. V09 discusses a general intersection proof but gives no particular count/existence construction for V04. |
| V05 | Provisional pass: recognizes examples of convex sets and all three source 113 cases, distinguishes finite vertex sets from filled triangle. Cannot demonstrate free recall of examples in 112; retain that limitation. | Pass: segment, ray, three-point set, line, plane, singleton, empty and punctured segment test different domain/quantifier issues. | Pass: no stated classification in the stem. |
| V06 | Pass: filled triangles and all simple quadrilaterals, including nonconvex ones, are interpreted correctly. | Pass: four complete truth-pair classifications, not duplicate labels. | Pass: boundary/interior clarification does not say convex. |
| V07 | Pass: all four source 115 sets present with actual fig-59; disk versus circumference and half-disk versus arc clarified. | Pass: annular hole, deleted center, deleted arbitrary point, and filled half-disk are distinct witnesses. | Pass: actual set definitions avoid ambiguity without supplying convexity; the image hatching conveys the intended region, not the answer. |
| V08 | Provisional pass: tests an existential convex disk union, disjoint nonconvex union, overlapping disks and general convex unions. Concrete disks are convex-set witnesses for 117. Loses drawing and free invention, not the existence contrast; must be recorded. | Pass: containment, separation, overlap and generalization are different mathematical relationships. C gives a counterexample to D, but still requires establishing C false rather than a bare wording cue. | Pass: neither overlap nor common-point information is a convexity key. |
| V09 | Provisional pass: preserves the universal P,Q proof mechanism and intersection membership. Selects a supplied proof and does not produce an independent proof; retain that loss and empty/singleton convention. | Pass: union/intersection implication, wrong subset direction, two separate convexity inclusions and universal-set convexity are different proof errors. | Pass: P,Q in the intersection is required hypothesis; no correct inclusion chain is stated in stem. |
| V10 | Provisional pass: combines any-two-points convexity distinction with universal versus existential diagonal containment; reverse implication requires actual polygon reasoning. No free drawings or self-written explanation for 119/122. | Pass: boundary inclusion and every-versus-at-least-one diagonal distinction differ. B does not imply D; inward diagonal counterexample matters. | Pass: definition of diagonal is task input; V06 does not classify all nonconvex polygon diagonals. |
| V11 | Pass: preserves both sharp minimum vertex counts. | Pass: four complete count pairs represent degeneracy/triangle/concave-quad errors. | Pass: V06 establishes convex triangles, a shared prerequisite, but does not supply the sharp nonconvex minimum construction. Concept reuse alone is not leakage. |
| V12 | Pass: preserves common vertex, whole polygon, triangles and n>3; fan triangle count not cutting-ray count. | Pass: n-3, n-2, n-1, n distinguish cut count/triangle count/boundary-edge counts. | Pass: no fan count or answer expression singled out in stem. |
| V13 | Pass: preserves both equality and strict inequality existence cases, strengthened to sharp threshold. | Pass: five, at least six, four, and all n>3 test equality versus inequality thresholds. | Pass: definition and undirected convention do not supply formula or threshold. |

No view-visible definite defect at this stage. Fidelity passes are conditional only where the not-yet-read author losses/coverage need inspection, not conditional on an author's key.

## Independent solutions of every visible option

T = correct under the actual question asked; F = incorrect. For V09 this judges validity of the proposed inference, not merely whether its final conclusion happens to be true under all source hypotheses.

### V01: correct set B

- A F: triangle 3+4+5=12, but quadrilateral 2+3+2+3=10, not 5; pentagon 10.
- B T: the complete sums are 12,10,10 cm.
- C F: 60=3x4x5; 36=2x3x2x3; 32=2^5 are products of side lengths, not perimeters.
- D F: pentagon has five sides, 5x2=10, not four sides' sum 8.

### V02: correct set C

- A F: n=p+1 is an open chain endpoint relation, not a closed polygon.
- B F: cyclic boundary has one edge per vertex, not p=2n.
- C T: n=p by cyclic vertex/edge correspondence.
- D F: cyclic closure joins last vertex to the first without adding an extra vertex or surplus edge; p=n.

### V03: correct set D

- A F: finite open chain has no enclosed inside; the universal premise is false.
- B F: a simple closed broken line does enclose an inside.
- C F: supplementing an open chain to close a triangle creates an inside that the original lacks.
- D T: two adjacent finite segments give an open path around whose endpoints points can be connected; no enclosed inside.

### V04: correct set A,C,D

- A T: two convex angle regions give at most four supporting lines; a convex angle intersect a reflex angle is a union of at most two bounded triangles sharing the convex apex, hence triangle or quadrilateral. Two reflex angles have an unbounded common direction. Triangle and quadrilateral examples are in source-first 110; the reflex example C={x>=0,y>=0}, R={2x+y<=3 OR x+2y<=3} yields the concave quadrilateral (0,0),(3,0),(1,1),(0,3).
- B F: a fifth vertex is impossible in all angle cases just enumerated, not merely in the convex-convex case.
- C T: disjoint triangles, vertex-only touching, and common-base/opposite-side triangles realize empty, point and segment respectively.
- D T: triangle intersection is convex, bounded and defined by at most six half-planes. Containment and 110's explicit clipped-triangle constructions realize each of 3,4,5,6.
- E F: intersection of convex filled triangles cannot contain two points while omitting their segment; a concave quadrilateral would violate this.
- F F: each intersection side must lie on one of the six triangle side lines, and convexity allows at most one side on each; no seventh side.

### V05: correct set A,B,D,E,F,G

- A T: a between-points subsegment is contained in the original segment.
- B T: nonnegative ray parameters stay nonnegative under convex combination.
- C F: a three-point finite set omits some intermediate points between any two distinct points, even when all three are collinear.
- D T: line parameters can take any real value, so every joining segment remains on the line.
- E T: all planar joining segment points are in the entire plane.
- F T: singleton convex by the explicit convention (also only degenerate self-segments).
- G T: empty convex by explicit convention; no pair contradicts it.
- H F: original segment endpoints remain, but their joining segment contains the deleted midpoint.

### V06: correct set B

- A F: quadrilateral (0,0),(3,0),(1,1),(0,3) is nonconvex.
- B T: a triangle is intersection of three closed half-planes; rectangles and the stated concave quadrilateral realize both quadrilateral types.
- C F: nondegenerate filled triangles cannot be nonconvex.
- D F: rectangles are convex quadrilaterals.

### V07: correct set D

- A F: fig-59 a)'s opposite annular points have a segment through its white hole.
- B F: opposite retained diameter endpoints have a segment through the deleted center.
- C F: choose O-v,O+v around the deleted point O; midpoint O is absent.
- D T: actually opened fig-59 b) is the filled closed half-disk with diameter present; disk intersect closed half-plane is convex.

### V08: correct set A,B

- A T: concentric radius-1 disk is contained in radius-3 disk; union is the latter.
- B T: center distance 3 exceeds radii sum 2; segment between centers crosses a nonempty gap.
- C F: set centers (0,0),(1,0); P=(0,1),Q=(1,1) are retained, but M=(1/2,1) is at distance sqrt(5)/2>1 from either center, so union is nonconvex despite overlap.
- D F: the same unit disks share points, e.g. (1/2,0), yet omit M on a joining segment. Common point is not sufficient.

### V09: correct set C

- A F: subset of a union does not imply subset of the intersection; the inference discards the separate membership needed. The correct conclusion is true here only through the unused convexity hypotheses.
- B F: A subset A intersect B is not given and is generally false; one has A intersect B subset A. For convex A=[0,2] and B=[0,1] on a line, A is not contained in the intersection.
- C T: P,Q belong to each convex set; segment is in each; simultaneous membership puts every segment point in the intersection.
- D F: not every set contains joining segments; the three-point or punctured-segment sets in V05 falsify this purported general rule. Convexity must actually be invoked.

### V10: correct set A,B

- A T: every pair's complete joining segment is inside a convex polygon; diagonals are a special pair of vertex endpoints.
- B T: nonconvexity gives a pair with missing segment point. Also at least one convex-hull edge is not wholly contained in a nonconvex simple polygon; its endpoints are nonadjacent vertices, so it is an external diagonal. If all hull edges lay in P, exterior connectedness would force P equal its convex hull (source-first 122).
- C F: the polygon includes its boundary and endpoints; convexity includes the entire diagonal, not just interior-to-interior segments.
- D F: in concave quadrilateral O=(0,0),X=(3,0),V=(1,1),Y=(0,3), diagonal XY leaves P, but diagonal OV is entirely contained. Nonconvex means at least one external diagonal, not all.

### V11: correct set D

- A F: two vertices cannot form a nonzero-area polygon; triangles are convex, not nonconvex examples.
- B F: a concave quadrilateral exists, so nonconvex minimum is four rather than five.
- C F: triangle already realizes convex minimum three.
- D T: every nondegenerate triangle is convex and a concave quadrilateral exists, giving 3,4.

### V12: correct set B

- A F: n-3 is the number of fan cuts to nonneighbor vertices, one less than number of triangles.
- B T: n-3 cuts produce n-2 fan triangles; opposite original boundary has n-2 edges, each requiring a triangular piece in such a ray decomposition.
- C F: n-1 counts too many; a quadrilateral needs two fan triangles, not three.
- D F: n counts too many; a quadrilateral needs two, not four.

### V13: correct set A,B

- A T: n(n-3)/2=5 for n=5, matching its five sides.
- B T: D-n=n(n-5)/2>0 exactly for integers n>=6.
- C F: quadrilateral has 4(4-3)/2=2 diagonals, not four.
- D F: n=4 and n=5 both exceed three but have D<n and D=n respectively, not D>n.

## Sealed pre-draft conclusion

Independent complete true sets by array position:
V01 B; V02 C; V03 D; V04 A,C,D; V05 A,B,D,E,F,G; V06 B; V07 D; V08 A,B; V09 C; V10 A,B; V11 D; V12 B; V13 A,B.

Author comparison must still inspect complete derivations (especially reflex-angle boundedness and the reverse diagonal implication), real false-option procedures and source loss/coverage. No mathematical conclusion here depends on matching an author key.
