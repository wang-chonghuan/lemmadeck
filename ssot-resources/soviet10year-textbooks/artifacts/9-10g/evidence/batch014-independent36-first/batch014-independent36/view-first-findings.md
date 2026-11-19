# Stage 2: View-First Findings

Independent worker184-3, STEMROBIN-184. This was persisted before opening the
internal repaired draft or any answer key/report. No original choice draft or
author reports were read. Stage1 files were already persisted and verified.

Stage1 file SHA256:
`79087cd44af05567da1cbed97a6444e9c79d70e13aa47e1b35e1c02bfe6b2061`.
Independent solution SHA256:
`d5d65b9f60d73b7699bc9ab38b4b652d6b94983486fbab35ba63ee484040a995`.
Seed file SHA256:
`d27e1efda0c8fd7e08834c2c070bfd149e1d1b2cfc1cb423029e82d1c21b933a`.
Canonical seed SHA256:
`f402f9dcfa3c9ab9d7869fc34ed0b794c1801ae1e04cb2a00179943083efcc2f`.
View-only file SHA256:
`21aaa3a2dcb106db3563b22e6f439a1f0ffcd238a173b78bce9e09751c3ce134`.

Seed prose and figure_refs exactly match all eleven durable exercises; concept
block 0 exactly matches the durable theorem. All three seed SVGs have the same
bytes previously bound to the opened modern previews. The three durable JSON
file hashes match Stage1, as does the seed trace. No source/image review replay.

## Independent Complete Option Sets

The following truths were obtained from Stage1 reasoning and the visible text,
not an author's key. Symbolic formulas are evaluated as valid formulas over
the stated parameter domain, not merely as coincidences at one chosen value.

| Question | Complete True Set |
| --- | --- |
| n36-claims | a, b |
| n36-parallel-extension | c |
| n36-vector-reduction | a |
| n36-planar-construction | d |
| n36-rectangle | b |
| n36-triangle-construction | d |
| n36-right-triangle-distance | b |
| n36-scalene-distance | a |
| n36-equidistant-parallels | c |
| n36-parallel-distance-branches | a, b |
| n36-equilateral-distance | b |
| n36-polygon-equidistance | a, c, e, f |

## Every Visible Option

### n36-claims

- a true: AC direction (0,0,1) has dot product 0 with projection (1,0,0),
  but -1 with oblique direction (1,0,-1). This is a valid counterexample.
- b true: (0,t,2) has direction (0,1,0); both dot products are zero, while
  every point has z=2 rather than z=0.
- c false: option a's normal-line counterexample disproves the universal claim.
- d false: option b's offset parallel line disproves containment.

### n36-parallel-extension

- a false: necessary direction also follows from equal dot products.
- b false: sufficient direction also follows from equal dot products.
- c true: translating a plane-parallel line leaves its direction unchanged;
  both perpendicularities are equivalent by u dot AB = u dot CB.
- d false: offset cannot destroy either direction of the equivalence.

### n36-vector-reduction

- a true: AB=AC+CB and u dot AC=0 imply the displayed equality.
- b false: it discards u dot CB, which need not vanish. Choose u along CB.
- c false: normal AC is not oblique AB; choosing u along CB gives nonzero
  u dot AB.
- d false: the actual dot products on the left and first right term are
  equal, whereas the additional |u|^2|AC|^2 is strictly positive.

### n36-planar-construction

- a false: when a is normal its projection is a point, not a nonzero line.
- b false: normal a admits every plane direction, not exactly one; oblique
  a admits a unique perpendicular direction, not every direction.
- c false: for oblique a choose P on its projection line, P not I. PI is then
  parallel to the projection and not perpendicular to a.
- d true: it separates the normal case and the nonzero projection case,
  using the theorem only where a projection line exists.

### n36-rectangle

- a false: right angles are at B and D, not C. With A=(0,0,0),
  B=(x,0,0), D=(0,y,0), C=(x,y,0), M=(0,0,h), CM dot CB=y^2>0.
- b true: MB projects to AB perpendicular to BC; MD projects to AD
  perpendicular to DC. MC^2=h^2+x^2+y^2 and MA^2=h^2 give the extrema.
- c false: MC^2 exceeds MB^2 by y^2 and MD^2 exceeds MA^2 by y^2.
- d false: it reverses both extrema. BM dot CM=x^2+h^2>0 also rules out
  its proposed right angle at M.

### n36-triangle-construction

- a false: joining to the opposite vertex works only for specially positioned
  F on the corresponding altitude; arbitrary F does not give a perpendicular
  projection to that side.
- b false: the projection from F toward T is a nonzero parallel-to-side
  vector, whose dot product with the side direction is not zero.
- c false: lines parallel to MN have direction perpendicular to the plane,
  but the one normal line through both endpoints generally meets the plane
  only at F, not at all three side lines. It cannot supply their three feet.
- d true in the displayed seed situation: MH and NH have projection FH,
  perpendicular to the side, and meet the side at H. F need not be a center.
  If F is on a side but neither endpoint equals F, both joins are still
  nonzero normal lines and work. The displayed M and N are distinct from
  every side line in projection, so neither can coincide with H. Extending
  the question beyond those displayed conditions to allow an in-plane
  endpoint ON a side would require a separate planar-perpendicular branch,
  as recorded in Stage1; that degenerate endpoint is not depicted here.

### n36-right-triangle-distance

- a false: a^2+b^2 is the hypotenuse squared, not the altitude squared.
- b true: planar altitude ab/sqrt(a^2+b^2), then orthogonal height combination.
- c false: for h>0 and altitude>0, their sum strictly exceeds the root of
  the sum of their squares.
- d false: it omits the strictly positive normal-height contribution.

### n36-scalene-distance

- a true: Heron area600, altitude16 to side75, then sqrt(3600+256).
- b false: 76=60+16 adds perpendicular lengths instead of their squares.
- c false: 20sqrt(10)=sqrt(3600+400) uses side20 instead of altitude16.
- d false: 60sqrt(2)=sqrt(3600+3600) requires a planar altitude60,
  contradicting the computed16.

### n36-equidistant-parallels

- a false as a domain-valid formula: it uses m rather than the middle-strip
  distance m/2. For m>0 this differs from the true formula for every h.
- b false as a domain-valid formula: for h>0, h+m/2 is strictly larger than
  sqrt(h^2+m^2/4). It coincides numerically at h=0; that does not make it
  a valid general formula on h>=0. Do not claim it is always numerically
  unequal at the boundary.
- c true: equal planar distances force m/2, then add common h^2.
- d false: m/4 halves the already halved offset a second time.

### n36-parallel-distance-branches

- a true: projected c at +36 from a at0 and b at44 gives sqrt(8^2+15^2)=17.
- b true: projected c at -36 gives sqrt(80^2+15^2)=5sqrt(265).
- c false: sqrt(2161)=sqrt(44^2+15^2) would need a horizontal separation44,
  whereas the allowed separations from b are only8 or80.
- d false: sqrt(3457)=sqrt(44^2+36^2+15^2) treats collinear horizontal
  offsets as orthogonal; neither of the two signed configurations gives it.

### n36-equilateral-distance

- a false: a^2/3 uses circumradius squared; the side-line distance uses
  inradius squared a^2/12.
- b true: equal vertex distances project to circumcenter=incenter; use
  a*sqrt(3)/6 and height b.
- c false: a/2 is half a side, not the inradius.
- d false as a domain-valid formula: for b>0, b+inradius exceeds the correct
  root. It coincides at b=0 but is not a valid formula over b>=0.

### n36-polygon-equidistance

- a true under separate groups: equal distances after projection give equal
  chord lengths; the triangle is equilateral.
- b false: equal chords preclude a non-equilateral isosceles triangle.
- c true under the lesson's ordinary planar-quadrilateral meaning: equal
  chords force a cyclic rhombus, whose angles are all90 degrees.
- d false: unequal adjacent rectangle sides cannot be equal chords at the
  same distance from one circle center.
- e true: the rhombus with half-diagonals2 and1, point height1, has equal
  side-line distances3/sqrt(5) but unequal vertex distances sqrt(5)/sqrt(2).
- f true: for any positive chord, distance to its supporting line is strictly
  smaller than the endpoint radius; common height cannot erase that strict
  inequality. Thus the stronger cross-group numerical equality is impossible.

The view explicitly retains the source's question-mark-plus-period in English
("it?.") and distinguishes the two readings instead of silently declaring
an unqualified regular-polygon answer. Planarity is the ordinary definition
of triangle/quadrilateral in this lesson. If "quadrilateral" were intentionally
extended to a skew spatial four-cycle, c would fail (regular tetrahedron
counterexample), so no such extension is being approved.

## Fidelity, Redundancy and Leakage Before Key Disclosure

All twelve views retain the source's mathematical distinctions. Source331
requires evaluating both missing-hypothesis assertions; 332 tests both
directions for plane-parallel lines; 333 still requires recognizing the
correct scalar-product reduction, although vector decomposition is scaffolded
in the stem. 334 retains both allowed orientation cases. 335 combines both
right-angle locations and the two extrema, without assuming a square.
336 tests a shared projection foot for both endpoints and all three side
lines, without turning F into a centroid. No proof/construction production
is witnessed by choosing these recipes/results; those losses must remain
recorded internally.

Splitting337 preserves symbolic and numerical altitude computations. Splitting
338 preserves equal-distance midpoint reasoning and BOTH signed placement
branches. Source339 distinguishes inradius from circumradius. Merging340/341
retains the failed rhombus implication, the two regular-polygon conclusions,
and the stronger-reading impossibility rather than omitting the ambiguity.

Cross-question dependence was checked over the whole view:

- 331/332/333 share a theorem but test containment, an extension, and an
  algebraic proof respectively. No correct option is externally marked.
  The theorem/decomposition scaffold in333 is shared lesson knowledge;
  it does not turn331's omitted plane-direction hypothesis into valid logic.
- 334 and336 share projection reasoning but334's zero-projection orientation
  branch is distinct from336's three side-specific feet. Neither view
  discloses which recipe is correct in the other.
- 335's rectangle extrema do not supply337's hypotenuse altitude or339's
  inradius. 337(1)'s formula cannot be blindly substituted into the nonright
  20/65/75 triangle; independent area calculation is still required.
- 338(1)'s m/2 case is not the unknown signed36 placement in338(2).
  The explicit absence of side-position information preserves the quantifier
  "all positions", rather than disclosing a selected numerical key.
- 339's inradius formula does not decide340's non-square rhombus;341 adds a
  circumcenter condition absent from340. Within the merged question, the
  rhombus non-guarantee and the separate/common-group alternatives do not
  logically force one another without the projection/chord argument.

No source numbers, internal correct sets, author rationales, answer mappings,
external links or authored figures are exposed. Correct positions vary
(a,b / c / a / d / b / d / b / a / c / a,b / b / a,c,e,f); no same-position
cue or deterministic alternation establishes the answers. Domain boundary
coincidences of symbolic distractors are recorded above, not hidden.

View-first disposition: fidelity/redundancy/leakage supported for the stated
lesson domains, subject to later inspection of recorded production losses
and per-option misconception procedures. No final gate outcome claimed yet.
Image count remains4/8; none opened in this stage.
