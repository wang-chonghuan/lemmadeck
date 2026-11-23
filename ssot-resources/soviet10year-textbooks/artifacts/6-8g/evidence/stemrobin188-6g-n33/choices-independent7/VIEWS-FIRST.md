# N33 CHOICE independent7: view-first second handoff

Stage: view-only review and independent option solving, before author
comparison. This is not a final CHOICE approval.

## Snapshot and boundaries

- Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
- Mathematical input opened this stage:
  `.intentfold/tickets/STEMROBIN-188/tmp/n33-choices7/view-only.json` only.
- Exact byte SHA-256:
  `9d6c3ae3f3d6e9101a99b0231b21f120f9b3cbf404f8c325a1b8c22221b3c912`.
- Four questions, 17 options. All stem and option figure lists are empty.
  Actual images opened this stage: **0**; cumulative actual images: **0**.
- Source-first reasoning was collected once and remained locked. Both
  source seals were hash/permission checked without reopening their
  contents for solving:
  `SOURCE-FIRST.md`, 0444,
  `f18ea75f77d4bc0d64dcd32821a67c5d858b233fa2d059890a3f77240633608c`;
  `source-review.json`, 0444,
  `b13b313e99d46a1b4cf919de8e6e09897891b70487f380f0136a03b7a9fb6834`.
- No author draft, SOURCE-SOLVING, keys, AUTHOR-HANDOFF, earlier reviews,
  source lesson files, browser, DB, Git, app/canonical edit, new reviewer,
  subagent, model service, or new diagram was used.

## First assessment: fidelity, redundancy, and leakage

These assessments were made against the locked source tasks before
determining the visible complete true sets. They are separate from the
proof-completeness finding in the later mathematical assessment.

### n33-equivalence

Task fidelity: pass for the requested task representation. The stem
preserves both directions of A/B equivalence, "at most one", the common
intersection case, and the point-on-given-line case. It supplies the
neutral perpendicular facts and auxiliary constructions rather than
requiring their invention. The learner must distinguish an unconditional
use of uniqueness, a malformed contrapositive, an existence/uniqueness
confusion, and a two-direction argument.

Redundancy: pass. Several first or second paragraphs are repeated, but
the full alternatives are not equivalent: their distinct errors concern
different implications or logical prerequisites. Repetition makes
comparison easier; repetition alone does not establish which paragraph
is valid. No equivalence-class duplicate correct responses are present.

Answer leakage: pass. Saying equivalence requires both directions is
the supplied definition, not a key. The constructions do not identify b
with m or prove uniqueness. A learner still has to check applicability
and both proof directions, including all quantified line cases.

Written-production losses: finding the auxiliary perpendiculars,
producing both proofs from scratch, and writing the separate trivial
point cases are replaced by scaffolded full-argument recognition.

### n33-axiom-dependence

Task fidelity: pass with an explicit scope strengthening and losses.
It merges the open example requests 442/443 into classifying five
different propositions. It defines dependence intrinsically, whereas
442 literally asks for examples in whose proofs A was applied. Intrinsic
dependence is a stronger question than exhibiting an A-using proof; the
selected propositions can be judged at that stronger level, so this
does not remove the dependence distinction. It must not later be
described as an unchanged demand for historical/proof-use examples.

Redundancy: pass. Parallel transitivity, isosceles base angles,
forward corresponding-angle equality, triangle-angle sum, and triangle
inequality have different hypotheses and mathematical mechanisms.
Items a and d are both A-dependent examples, but not the same example.
Item c is the forward direction, not 444's neutral converse.

Answer leakage: pass. Both dependence labels occur on true and false
judgments: a/d versus e for "depends", and b versus c for "independent".
The word choice alone does not determine selection. The other questions'
neutral statements do not justify changing the direction of c.

Written-production losses: inventing examples and producing their
proofs/dependence explanations is replaced by recognizing supplied
classifications. The view additionally demands intrinsic necessity
rather than merely a proof route using A.

### n33-corresponding-criterion

Task fidelity: pass. The view preserves corresponding-angle congruence
as sufficient for parallelism, states distinct transversal intersections,
and explicitly avoids both A and treating the forward theorem as given.
This strengthens 444 to its valid neutral route. Recognizing a complete
contradiction proof still tests the angle/direction relationship.

Redundancy: pass. The alternatives confuse converse logic, supplement
arithmetic, and incidence separately. The valid neutral strategy requires
turning the corresponding pair into a remote-interior/exterior pair;
it is not just the calculation of an exterior angle in the fourth item.

Answer leakage: pass. The permitted exterior-angle property is a
legitimate prerequisite. No visible answer tells which corresponding
angles become an exterior/interior pair. The fourth question states the
exterior-angle goal, but that shared theorem is already allowed here.

Written-production losses: selecting and writing the contradiction
configuration and managing its ray orientations are replaced by judging
a verbal proof sketch.

### n33-exterior-angle

Task fidelity: pass. The target is strict comparison with EACH remote
angle without A or the triangle-sum equality. D lies beyond A on BA;
H lies beyond A on CA. Both midpoint/extension constructions are
textually complete. The response tests SAS vertex matching, strict
interior-ray inclusion, and vertical transfer between the two exteriors.

Redundancy: pass. Equality instead of strict inclusion, interchanged
SAS correspondences, and unsupported bisection are different wrong
procedures. They can accidentally coincide in a specially symmetric
triangle, but the claim and correct argument are universal.

Answer leakage: pass. The requested theorem states its target, as a
proof question should. It does not establish the SAS match or bisection.
The criterion item permits the exterior-angle theorem but does not
supply these midpoint identities or determine the valid argument.

Written-production losses: independent auxiliary-point discovery,
executing a drawing/construction, and writing the full neutral proof
are replaced by a fully specified textual construction and proof
recognition. No visual construction competence is demonstrated.

## Second assessment: independent mathematics, every option

An alternative is true here only if the entire displayed argument or
classification is valid as stated, not merely if its final theorem
happens to be true. Intersecting lines retain the locked convention:
distinct lines with a common point, not coincident copies of one line.

### 1. n33-equivalence

**Complete true set under that convention: empty.**
Option c is the unique near-valid argument, but its second paragraph
omits one quantified case. This is a narrow, repairable proof defect,
not a claim that A and B are inequivalent.

- a: incorrect. In A implies B, A identifies two parallels through Q
  only after both have been shown parallel to a. It cannot identify
  an arbitrary b through Q with m. For example, in the Euclidean plane
  a: y=0, c: x=0, Q=(0,1), m: y=1, b: y=x+1 satisfy A and the
  source hypotheses. Here b is oblique to c, b meets a at (-1,0),
  and b is not m. The asserted equality b=m is false. The shared
  second paragraph also has the n=c domain gap described under c.
- b: incorrect. The first direction is valid: under the nonintersection
  assumption b and m are distinct parallels to a through Q. The second
  direction takes the wrong contrapositive. With l perpendicular to c,
  B has form
  `[n intersects c AND n not perpendicular c] => [n intersects l]`.
  Its contrapositive is
  `[n does not intersect l] => [n does not intersect c OR n perpendicular c]`,
  not the first disjunct alone. In the Euclidean example
  l: y=0, c: x=0, P=(0,1), n=m: y=1, n is parallel to l and
  intersects c at P; it falls in the perpendicular disjunct.
- c: incorrect as a COMPLETE proof under the locked convention.
  The first direction is valid. In the second, every line n through P
  different from m is indeed not perpendicular to c by perpendicular
  uniqueness. However, the quantified family includes n=c: P lies on c
  and c is different from m. A line coincident with c is not a distinct
  line intersecting c, so B does not apply to this case. For n different
  from both m and c, intersection at P is proper and B proves n meets l.
  For n=c, the required conclusion is true directly because c is
  perpendicular to l, but that case is not proved by the stated use of B.
  Repair: add "if n=c, it already meets l at the perpendicular foot",
  then apply B to n different from c,m; alternatively consider only
  candidate parallels n to l, which automatically exclude c. The
  reviewer has made neither edit.
- d: incorrect. The first direction is valid. The second constructs
  one parallel, establishing existence, and then asserts at most one
  without excluding any other candidate. `there exists m` does not
  imply `there do not exist distinct m,n`; a two-element candidate
  set already refutes that inference. The displayed second direction
  never uses B to obtain uniqueness.

The defect in c cannot be cured by silently treating coincident lines
as intersecting: that changes the locked convention, and the stem's
first-paragraph notation Q=b intersect c denotes a point, not a line.
This finding is about the applicability domain of a proof step, not a
counterexample to its true final conclusion.

### 2. n33-axiom-dependence

**Complete true set: {a, b, d}.**

The view explicitly asks for intrinsic dependence. Thus an A-using
proof alone is insufficient evidence for a/d or against c. In addition
to neutral proofs, the following mathematical counterexamples make the
necessity distinction concrete without historical research.

Use the neutral upper-half-plane geometry y>0 with metric
`ds^2=(dx^2+dy^2)/y^2`; lines are vertical lines and semicircles
orthogonal to y=0, and angles are Euclidean tangent angles. This geometry
has ordinary neutral incidence/order/congruence, but not A. This is a
mathematical counterexample, not an external model-service call.

- a: correct. Under A, if a and b both parallel c met at X, they would
  be two different parallels to c through X, contradicting uniqueness.
  Conversely, the stated transitivity for three pairwise different
  lines implies A: two different parallels to l through X would be
  parallel to each other by transitivity, yet share X. Thus this
  proposition is equivalent to A over the neutral background.
  Concrete failure without A: take c: x=0, b: x=1, and a the semicircle
  `(x-1)^2+y^2=1/4`, y>0. Both a and b are disjoint from c; they
  intersect at (1,1/2). All three lines are pairwise different.
- b: correct. In AB=AC, compare triangles ABC and ACB by SSS:
  AB=AC, AC=AB, BC=CB. Corresponding angles at B and C are equal.
  The congruence argument does not use A.
- c: incorrect. It reverses the dependence classification of the
  forward theorem. In the neutral counterexample, lines x=0 and x=1
  are parallel. The transversal `x^2+y^2=4`, y>0, meets them at
  (0,2) and (1,sqrt(3)). For the upward vertical rays and the same
  clockwise/eastward transversal direction, corresponding angles
  are 90 and 120 degrees: tangent vectors can be taken as (1,0)
  and (sqrt(3),-1). They are not congruent. This is not a counterexample
  to 444: its equal-angle hypothesis is absent.
  Also the forward theorem would imply A: use a perpendicular
  transversal from a point X outside l to l. Any parallel through X
  would make a right corresponding angle and hence be the unique
  perpendicular at X. All candidate parallels would coincide.
- d: correct. The usual parallel-through-a-vertex proof of triangle
  sum uses A through the forward parallel-angle theorem. Intrinsic
  nonderivability from the neutral background is exhibited by the
  upper-half-plane triangle with vertices U=(0,1), V=(1,1), W=(0,2).
  UW is vertical; UV has circle center (1/2,0); VW has center (-1,0).
  Tangent directions at U give angle arctan(2); at V the directions
  (-1,1/2) and (-1,2) give arctan(3/4); at W the downward vertical
  and direction (1,-1/2) give arctan(2). Hence the sum is
  `2 arctan(2) + arctan(3/4) = 163.739795... degrees`, not 180.
- e: incorrect. The triangle inequality is neutral. For example,
  extend BA beyond A to D with AD=AC. Then BD=BA+AC.
  In isosceles ACD, angle ADC=angle ACD, and angle BDC=angle ADC.
  Since CA is interior to angle BCD, angle BCD>angle ACD=angle BDC.
  Neutral opposite-side/angle comparison gives BD>BC, so BA+AC>BC.
  That side/angle comparison itself follows from isosceles angles
  and the strict neutral exterior-angle theorem: mark a segment
  equal to the shorter side on the longer side, use the isosceles
  base-angle equality and an exterior-angle inequality, and reverse
  the implication by side-length trichotomy. No A or triangle-angle
  sum is required. Relabeling proves all three inequalities.

### 3. n33-corresponding-criterion

**Complete true set: {b}.**

- a: incorrect as an argument. Knowing P implies Q does not establish
  Q implies P; truth values P=false,Q=true already distinguish those
  implications. Here the proposed forward theorem is additionally
  not a permitted neutral premise. The desired converse is true,
  but must be proved, not obtained by swapping clauses.
- b: correct. Suppose a,b meet at R. R is off c because P and Q
  are distinct. Equality transfers to all matching corresponding
  pairs by simultaneous supplements/vertical angles. Choose both
  rays toward R and the c direction from Q toward P. If Q-P-T,
  the equal pair becomes angle RPT=angle PQR. RPT is exterior
  to triangle PQR and PQR is a remote interior angle. The strict
  neutral exterior-angle inequality contradicts that equality.
  Thus there is no R and the lines are parallel, without A.
- c: incorrect. If the original angles have equal measure alpha,
  both supplements have measure 180-alpha and remain equal.
  For example, two 40-degree angles have two 140-degree supplements.
  The claimed initial noncongruence is false regardless of R.
- d: incorrect. Distinct intersections with c do not exclude an
  intersection elsewhere. Euclidean lines c: y=0, a: y=x, b: y=-x+2
  meet c at P=(0,0), Q=(2,0), yet a,b meet at R=(1,1).
  This example tests the displayed incidence inference; it does
  not satisfy the equal-corresponding-angle hypothesis and is not
  claimed as a counterexample to the true target theorem. The
  option supplies no valid use of that hypothesis to remove R.

### 4. n33-exterior-angle

**Complete true set: {b}.**

Independent neutral derivation: E is the midpoint of AC and B-E-F
with EB=EF. SAS gives triangles CEB and AEF congruent:
CE=AE, EB=EF, and the included vertical angles are equal.
Hence angle CAF=angle ACB. F lies opposite B across AC and on
the C side of AB, so AF is strictly inside angle DAC.
Likewise triangles BMC and AMG are congruent by SAS, giving
angle BAG=angle ABC. G lies opposite C across AB and on the B
side of AC, so AG is strictly inside angle HAB. Therefore
DAC>ACB and HAB>ABC. DAC and HAB are vertical, proving the two
strict comparisons for DAC. This is the locked neutral construction
with the view's point names, not a triangle-sum proof.

A single permitted Euclidean instance distinguishes the false
correspondences and bisection claims:
A=(0,0), B=(4,0), C=(0,3), D=(-1,0), H=(0,-1),
E=(0,3/2), F=(-4,3), M=(2,0), G=(4,-3).
Both exteriors are 90 degrees; ABC=arctan(3/4)=36.869897...,
ACB=arctan(4/3)=53.130102...; CAF=53.130102... and BAG=36.869897....

- a: incorrect. The congruences and strict interior placements are
  correct, but a proper subangle is smaller than the whole angle,
  not equal. In the instance, 90 is neither 53.130102 nor 36.869897.
- b: correct. It uses the actual SAS matches, strict rather than
  weak/equal inclusion, and vertical equality to obtain BOTH remote
  angle comparisons. No parallel premise or triangle-sum equality
  is used.
- c: incorrect. It interchanges the SAS vertex correspondences:
  CAF equals ACB, not ABC; BAG equals ABC, not ACB. The instance
  has 53.130102 unequal to 36.869897. The true final theorem does
  not rescue its false intermediate identities.
- d: incorrect. Being strictly inside an angle does not imply
  bisecting it. In the instance the subangles are about 53.13
  and 36.87, not 45; twice ACB is 106.260204... and twice ABC
  is 73.739795..., neither the 90-degree exterior. The two
  constructed rays need not be bisectors.

## Coverage, package relationships, and recorded losses

- 441: the stem represents both directions and the point cases, but
  the displayed complete arguments leave no valid single response
  under the locked intersection convention. Coverage needs revision
  at option c's n=c case, not a new source solve.
- 442/443 merge: the five classifications genuinely cover both
  dependence categories. Correct a/d are distinct A-dependent
  examples; b is a neutral example, and rejecting e requires
  recognizing triangle inequality as neutral. Questions 3/4 give
  further neutral examples with proof reasoning. Independent example
  generation and proof writing are lost; the intrinsic-dependence
  strengthening must be retained as a stated scope change.
- 444: corresponding equality remains a sufficient condition, and
  the proof choice distinguishes the converse from the A-dependent
  forward theorem. Its neutral exterior-angle prerequisite is
  legitimate; no preceding question must be answered correctly.
- 445: both strict remote-angle conclusions and the no-A requirement
  are covered. The two textual constructions carry the necessary
  point order without requiring any image. Independent discovery
  and execution of the construction are not assessed.
- Cross-question dependencies: the criterion uses the neutral
  exterior-angle theorem that the exterior item asks to prove.
  It still requires converting corresponding equality to an
  exterior/interior equality, whereas the exterior item requires
  SAS matching and proper subangle comparison. Those are distinct
  mathematical judgments, not duplicate keys. The forward theorem
  in the dependence item must not be inferred from the reverse
  criterion. The triangle-sum equality and exterior strict inequality
  also have different dependency classifications.
- No deterministic wording/key leakage or essential silent source
  omission was found apart from the equivalence proof-domain gap.
  The recorded production losses are review findings; author
  limitations/coverage declarations have not yet been opened.

## Definite finding and handoff status

F1, revise: `n33-equivalence`, option c, second paragraph quantifies
over n=c while applying a proposition about distinct intersecting
lines. The shared second paragraph in a has the same gap, although
a already fails its first paragraph. Add the direct n=c case or
restrict to candidate parallels to repair c. No option or canonical
file has been edited.

Independent complete true sets:

- n33-equivalence: []
- n33-axiom-dependence: [a, b, d]
- n33-corresponding-criterion: [b]
- n33-exterior-angle: [b]

`view-review.json` is a staged view-only record, not a completed
`s10y-choice-review-v1`. Its independent sets and 17 checks do not
assert agreement with an undisclosed author key. View-stage result:
revise for F1; author-key comparison and final aggregate verdict are
not performed. Stop here. Seal these two new records 0444 and leave
the two original source seals unchanged.
