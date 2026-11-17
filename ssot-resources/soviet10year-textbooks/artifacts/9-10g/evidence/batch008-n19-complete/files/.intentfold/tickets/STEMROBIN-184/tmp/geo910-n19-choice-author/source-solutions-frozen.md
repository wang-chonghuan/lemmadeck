# Source-only independent solution freeze

Author: answer-blind n19 author, STEMROBIN-184, continuous invocation of 2026-11-16.
This file is created before any draft, alternatives, key or option derivation.
Do not amend it after alternatives are introduced. It is internal, not a learner payload.

## Authority and scope

Repository: /Users/yong/.codex/worktrees/a07e/lemmadeck.
TMP means .intentfold/tickets/STEMROBIN-184/tmp.
Only the named seed and its actual referenced image bytes supply mathematical source input.
No previous questions, answers, interactions, judging files, templates, tests,
ticket outputs or old skill versions have been consulted.

Seed canonical SHA-256:
21aba5ade30915e19ae40469c14a891e7b70f16f33ac4e9c32f7fe14536de2f4.
Seed file SHA-256:
387ab4aeea2bb091ca3e07ce97dfb23e0854c05e27eb4a5c826e2a499c1d3e96.
Source numbers: 186, 187, 188, 189, 190, 191.
Selected definition blocks: 1, 2, 5, 8, 9.

Definitions used: opposite vectors sum to zero; reversing endpoints negates a
vector; c=a-b means c+b=a; subtraction adds the opposite; for arbitrary spatial
points, OB-OA=AB. Free vectors can be translated without changing length or
direction. No angle, length or special regularity is inferred from a schematic.

## Actual image observations

Rendered once in an isolated, headless Chrome context using the existing app
Playwright dependency, no persistent profile, no app server and no network.
Each whole image was viewed once at the normal fixed media width of 640 px.
Total image opens: 2; source reopens: 0.

fig-75:
- Asset: ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-75.svg.
- SHA-256: 95df61862b6419a63d457e08bdbcfed93f0edc04fa2a3bdd47f687c2e6aa256a.
- Natural/rendered size: 640 by 400.
- Full evidence: geo910-n19-choice-author/fig-75-normal-640.png.
- Evidence SHA-256: 7adfa5876a761ea72604752c0853eac50f65b5fee09980182d0d58a0403f8e44.
- Upper sloping arrow is labelled vector a and points up-left; the lower
  parallel arrow is labelled vector -a and points down-right. Their displayed
  lengths agree, and the tails are distinct. Both heads, tails and labels are
  visible, including the lower/rightmost head. This illustrates translated
  opposite vectors, not a claim that they must share an initial point.

fig-76:
- Asset: ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-76.svg.
- SHA-256: a4c46e416463c9301e152d28a92b192c09c372e03ee4081a7b1fba98f3ea43a8.
- Natural/rendered size: 640 by 640.
- Full evidence: geo910-n19-choice-author/fig-76-normal-640.png.
- Evidence SHA-256: 357a794bca9ad19e0376917a94f89281577ea5847fdbafc38a09d391540f077a.
- A is at the left, B at the upper right, O at the lower right. The arrows are
  OA, AB and OB: OA points from O to A, AB from A to B, OB from O to B.
  Thus OA+AB=OB and OB-OA=AB. The dot at O and every arrowhead and label,
  including the bottom O label and right B label, are visible. The sloped
  OB line is not an asserted vertical/perpendicular line.

These approved source figures need no new-figure gate. They are conceptual
references, not missing diagrams for these six figure-free written exercises.
No authored image is mathematically necessary: exact symbolic and midpoint
descriptions specify the required spatial constructions without hiding data.

## 186: three opposite vectors from A

Full task: in the nondegenerate tetrahedron ABCD, construct at A the opposites
of DB, CD and BC, in that order. Preserve tetrahedral, not merely planar, data.

Take A as origin, b=AB, c=AC, d=AD. Then DB=b-d, CD=d-c, BC=c-b.
Their opposites are d-b, c-d and b-c. If the required terminal points are X,Y,Z,
AX=d-b, AY=c-d, AZ=b-c. Equivalently, translate BD, DC and CB to initial
point A, retaining their lengths and directions. A parallel through A and the
corresponding directed length on that parallel fixes each endpoint uniquely.
The tetrahedron implies b,c,d are independent and the three edge vectors
being reversed are nonzero. Their sum is zero, but that alone would not
identify the three ordered vectors.

Distinction: negate a directed edge first, then translate to the prescribed
initial point; endpoint labels of the original edge are not the new endpoints.
Lost production in any selection: drawing the three translated arrows.

## 187: noncollinearity and ordered parallelogram

Full task: O,A,B are not collinear and OC=OA-OB. Prove that OBAC, in that
vertex order, is a nondegenerate parallelogram.

Take O as origin, a=OA, b=OB, c=OC. Then c=a-b. A and B are independent
directions, so C lies in plane OAB and is distinct from O,A,B. The diagonals
of OBAC are OA and BC. Their midpoints are a/2 and (b+c)/2=a/2.
The diagonals therefore bisect each other. Noncollinearity rules out a
collapsed quadrilateral, proving the stated parallelogram in its stated order.
Also OB=CA=b and BA=OC=a-b, which gives a direct opposite-side proof.

Distinction: vector subtraction fixes the fourth vertex and the correct
diagonal pairing; order and the noncollinear premise cannot be discarded.
Lost production in a selection: a learner-written complete proof.

## 188: three constructions from an out-of-plane point

Full task: ABC is a nondegenerate triangle and O is outside its plane.
Construct at O the vectors OA-OB, -OA-OC, OA+OB-OC, in that order.
No replacement of the spatial configuration by a planar special case.

Take O as origin and a=OA,b=OB,c=OC. The required endpoints are
x=a-b, y=-a-c, z=a+b-c. Let P be the midpoint of OA, M the midpoint of
AC and N the midpoint of AB. Then p=a/2,m=(a+c)/2,n=(a+b)/2:
- x=2p-b: X is the reflection of B in point P, so P is the midpoint of BX.
- y=-2m: Y lies on the ray from O opposite to OM, with OY=2*OM in length.
- z=2n-c: Z is the reflection of C in point N, so N is the midpoint of CZ.

These are complete constructions by midpoint extension, doubling an opposite
ray, and midpoint extension, respectively. Each produces the exact ordered
vector with initial point O. Because O is out of plane ABC, a,b,c are
linearly independent. In particular M differs from O, so the ray and length
used for Y are well-defined. P,N exist and each reflection is unique.
Direct alternatives to this construction are translating BA to O, composing
the negatives of OA and OC, and taking a parallelogram endpoint a+b before
translating the opposite of OC.

Distinction: common-origin subtraction, distributing a negative, and signed
three-vector composition are different operations, but their ordered
construction results form one coherent task.
Lost production in a selection: independently drawing all three spatial arrows.

## 189: direct theorem and converse

Full task: prove for triangle ABC that a right angle ACB implies
|CA+CB|=|CA-CB|; decide the converse. The triangle is nondegenerate.

Write u=CA,v=CB; both vectors are nonzero and not collinear. The two diagonals
of the parallelogram on u,v are u+v and u-v. If the angle is right, this
parallelogram is a rectangle and its diagonals are equal. Equivalently both
lengths equal sqrt(|u|^2+|v|^2), by the Pythagorean theorem.

Conversely, equality of the diagonal lengths makes this parallelogram a
rectangle: applying the cosine rule to triangles with included supplementary
angles gives
|u+v|^2=|u|^2+|v|^2+2|u||v|cos(theta),
|u-v|^2=|u|^2+|v|^2-2|u||v|cos(theta).
Equality forces 4|u||v|cos(theta)=0. The nonzero side lengths and
0<theta<pi force theta=pi/2. The converse is therefore true. No equal-leg
condition is required; e.g. legs of lengths 3 and 4 give both diagonal
lengths 5. Equality here is equality of magnitudes, not of vectors.

Distinction: the direct implication, its converse, and magnitude-versus-vector
equality; no added isosceles hypothesis.
Lost production in a selection: complete direct and converse proofs.

## 190: parallelogram identity for an arbitrary spatial origin

Full task: ABCD is a nondegenerate parallelogram, O any point of space.
Prove OA+OC=OB+OD, even when O is not in the parallelogram's plane.

Let M be the common midpoint of AC and BD. For every point Q in space,
QA=QM+MA, QC=QM+MC, and MA+MC=0; hence QA+QC=2QM.
Similarly QB+QD=2QM because MB+MD=0. In particular at Q=O the source
equality follows. If the initial point changes to arbitrary P, the common sum
is 2PM, not generally 2OM. Since PM=OM-OP, the new common sum is
the old one minus 2OP. The equality is origin-independent; the common vector
value is not. Q=M yields zero; no origin or endpoint needs to be distinct.

Distinction: cancelling opposite midpoint vectors, the factor two, and
preserving arbitrary spatial origins rather than assuming the origin is the center.
Lost production in a selection: a complete written proof for arbitrary O.

## 191: tetrahedron identity and completely general four points

Full task: first prove AD+BC=BD+AC in tetrahedron ABCD; then determine
whether it holds for any four points. General points may be coplanar,
collinear, coincident, or otherwise degenerate.

At any auxiliary origin, write position vectors a,b,c,d. Then
AD+BC=(d-a)+(c-b)=c+d-a-b,
BD+AC=(d-b)+(c-a)=c+d-a-b.
This proves both the tetrahedral case and the completely general case.
There is no division, independence requirement, or nonzero-vector premise.
Another source-only proof is AD=AB+BD and AC=AB+BC, so each side is
AB+BD+BC.

If M is the midpoint of AB and N the midpoint of CD, then
2MN=2[(c+d)/2-(a+b)/2]=c+d-a-b, the common vector.
Both midpoints exist even if vertices coincide. The common value may be zero.

Distinction: head-to-tail addition and algebraic cancellation are valid beyond
the drawing's nondegenerate tetrahedron; directed vectors are not unsigned lengths.
Lost production in a selection: the complete tetrahedral proof and an independently
written proof covering all degenerate four-point configurations.

## Frozen boundaries

Every full seed has now been solved independently, including all written
construction/proof work and all extensions asked by the seed. The next stage
may recognize exact constructions and decisive claims; it must not claim
that clicking selections produces or proves these tasks. Original written
tasks remain read-only in the seed. Coverage must retain these production losses.
No ambiguity or unreadable source figure remains. No options exist at freeze time.
