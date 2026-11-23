# N33 CHOICE independent7: sealed source-first handoff

Stage: independent source solving only. This is not a final CHOICE review,
not a source-coverage approval, and not a final PASS.

## Input and independence boundary

- Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
- Sole output ownership: `.intentfold/tickets/STEMROBIN-188/tmp/n33-choice-independent7/`.
- Mathematical input: `.intentfold/tickets/STEMROBIN-188/tmp/n33-choices7/seed.json`,
  exercises 441--445 and concept block 0 only.
- Verified canonical seed SHA-256:
  `3054db83f5626520746f912236dd975a731c6b70ef48faed34ef6d5753c34e7d`.
- Read the requested choice skill, `references/review.md`,
  `references/contract.md`, and binding lesson `production-resume.md`.
  Also read the repository session router and engineering charter.
- No author SOURCE-SOLVING, drafts, views, keys, lesson answers, earlier
  choices/reviews, or seed trace targets were opened.
- Seed `figures`, all five exercise `figure_ids`, and
  `source.concept_figure_ids` are empty. Concept 0 mentions figure 209 in
  prose, but no asset was supplied or opened.
- Actual image count: **0**. Source asset observations: none.
- No DB, Git, app edits, peer messages, model calls, browsers, external
  research, or new diagrams. No whole-package validator was run.

## Definitions, quantifiers, and permitted background

Work in one ordered metric plane. Parallel means distinct coplanar lines
with no common point. Intersecting lines are distinct and have a common
point. A transversal of two distinct lines meets them at distinct points.
Corresponding angles use the same transversal direction and matching
sides, not arbitrary angles of equal measure.

Let N denote the ordinary neutral background: incidence and plane
separation/order, segment and ray extension, midpoints, angle addition,
linear pairs and vertical angles, congruence (including SAS/SSS), and
existence/uniqueness of the usual perpendicular constructions. None of
these invokes the parallel axiom. The exterior-angle inequality is proved
below from this background, not assumed from a triangle-sum theorem.

The source axiom A is the universal statement:
for every line l and every point X, there is at most one line through X
parallel to l. This is uniqueness, not an assertion of exactly one for
every point. If X lies on l, no line through X is disjoint from l.

The source proposition B is also universal:
for every admissible triple a,b,c, if a is perpendicular to c and b
intersects c but is not perpendicular to c, then a intersects b.
Equivalence means both implications over the same background N. Concept
0 calls this same second statement E; the exercise calls it B.

## Independent solution: 445, the neutral prerequisite

For every nondegenerate triangle ABC, take D on line CA beyond A
(C-A-D). Put epsilon = angle BAD, the exterior angle adjacent and
supplementary to the interior angle A. Required:

`epsilon > angle ABC` AND `epsilon > angle ACB`.

The word "or" in the source means either chosen remote angle: both strict
inequalities must hold, not merely one of them and not equality.

First remote angle:

1. Let M be the midpoint of AB. Extend CM beyond M to N with CM = MN,
   so C-M-N.
2. Triangles BMC and AMN have BM = AM, MC = MN, and equal included
   vertical angles BMC and AMN. SAS gives angle MAN = angle MBC =
   angle ABC.
3. This auxiliary ray really lies inside the exterior angle. C and N
   are on opposite sides of AB because CN crosses AB at M. M and B
   are on the same side of AC. Segment MN cannot cross AC: line CM
   meets AC only at C, and C is outside MN. Thus N is on the B side
   of AC and on the side of AB opposite C, precisely inside angle BAD.
4. Since AM is ray AB and AN is strictly interior, angle BAD is
   strictly greater than angle MAN = angle ABC.

Second remote angle:

1. Take E on line BA beyond A (B-A-E). Let K be the midpoint of AC.
   Extend BK beyond K to L with BK = KL.
2. Triangles CKB and AKL are congruent by SAS using CK = AK,
   KB = KL and the included vertical angles. Consequently
   angle CAL = angle ACB.
3. B and L are on opposite sides of AC. K and C are on the same
   side of AB, and KL cannot cross AB because line BK meets AB
   only at B, outside KL. Hence AL is strictly inside angle CAE.
4. angle CAE > angle CAL = angle ACB. Angles CAE and BAD are
   vertically opposite, so epsilon > angle ACB as well.

Dependencies: midpoint and extension constructions, SAS, vertical-angle
equality, plane order, and strict angle inclusion/addition. No A, B,
parallel-angle equality, triangle sum 180 degrees, or exterior-equals-
sum-of-remote-interiors formula is used. The same construction, relabeled,
is the neutral exterior-angle theorem used in the remaining solutions.

## Independent solution: 441, both directions

Neutral lemma: distinct perpendiculars to the same line at distinct feet
are disjoint. If they met, the triangle formed with the two feet would
have two right interior angles. The exterior angle at one foot would
also be right, contradicting 445's strict inequality against the right
interior angle at the other foot. This uses no parallel axiom.

### A implies B

Take arbitrary a,b,c with a perpendicular to c at P, b meeting c at Q,
and b not perpendicular to c.

- If P = Q, then P itself is a common point of a and b.
- Otherwise construct d through Q perpendicular to c. By the neutral
  lemma, d is parallel to a.
- Suppose a and b do not meet. Then b is also parallel to a through Q.
  Applying A to the line a and point Q gives b = d. This contradicts
  b not perpendicular to c. Therefore a and b intersect.

The only use of A is uniqueness of a parallel through Q. Parallel
existence here comes from the neutral double-perpendicular construction.

### B implies A

Take an arbitrary line a and point X.

- If X lies on a, there is no parallel to a through X; "at most one"
  holds immediately.
- If X is outside a, drop perpendicular c from X to a, with foot P.
  Construct d through X perpendicular to c. By the neutral lemma,
  d is parallel to a.
- Let b be any line through X parallel to a. It intersects c at X.
  If b were not perpendicular to c, B would imply that b intersects
  a, contrary to its being parallel. Thus b is perpendicular to c.
- Uniqueness of the perpendicular to c through X forces b = d.
  Every candidate parallel is this same d, proving A.

This is not a proof of B merely assuming A, nor a converse asserted
without proof. The equality b = d uses neutral perpendicular uniqueness,
not the parallel uniqueness that is being proved. Both universally
quantified implications have been established.

## Independent solution: 442, examples that use A

This is an open request for several examples, not a prescribed exhaustive
list. These examples come with proof routes showing where A is used.

1. For every pair of parallel lines cut by a proper transversal,
   corresponding angles are congruent; alternate interior angles are
   congruent, and same-side interior angles sum to 180 degrees.
   At the second intersection Q, copy the first corresponding angle
   with the matching direction to construct line n. The neutral
   criterion proved in 444 gives n parallel to the first line.
   The given second line is also parallel to the first through Q.
   A identifies it with n. Vertical-angle equality and linear pairs
   then yield the alternate/interior statements.
2. For every nondegenerate triangle, its three interior angles sum to
   180 degrees. Through C draw a line parallel to AB (neutral
   existence; A gives uniqueness). Using the parallel-angle theorem
   just established, the angles at A and B equal the two adjacent
   angles beside the angle at C on a straight line. Their sum is
   therefore 180 degrees. The dependence on A enters through the
   parallel-angle equalities.
3. For every exterior angle of a nondegenerate triangle, its measure
   equals the sum of the two remote interior angles. Subtract the
   adjacent interior angle from the triangle-sum equality and use
   the linear-pair equality. This proof inherits the use of A.

These are examples of proofs using A; no unproved historical account or
claim about every possible proof is needed. In particular, item 1 is the
direction "parallel implies equal angles", not 444's converse.

## Independent solution: 443, examples independent of A

This is likewise an open example request. Several valid choices are:

1. Every pair of vertically opposite angles is congruent. Each angle
   forms a linear pair with the same adjacent angle, so both equal
   180 degrees minus that angle. Only angle addition and linear
   pairs are used.
2. In every nondegenerate triangle ABC with AB = AC, angles ABC and
   ACB are congruent. Compare triangles ABC and ACB: AB = AC,
   AC = AB, and BC = CB; neutral SSS congruence exchanges B and C.
   No parallel construction or A is involved.
3. Every pair of distinct perpendiculars to the same line is parallel.
   Perpendicular uniqueness rules out different perpendiculars at
   one foot; for distinct feet the neutral two-right-angles
   contradiction given under 441 proves disjointness.
4. Congruent corresponding angles imply the two lines are parallel,
   under the proper transversal convention. Use 444's neutral
   exterior-angle contradiction, not A.
5. Every exterior angle of a nondegenerate triangle is strictly
   greater than each remote interior angle. Use the midpoint/SAS/
   plane-order proof in 445.

Examples 3--5 involve parallel language or triangle angles, but that
language alone does not imply dependence on the parallel axiom.

## Independent solution: 444, the converse direction

For all distinct coplanar lines l,m and a proper transversal t with
distinct intersection points P,Q, congruence of a corresponding-angle
pair implies l and m are disjoint, hence parallel.

Suppose instead l and m meet at R. R is off t, since otherwise the
uniqueness of the intersections with t would give P = Q. Corresponding
angle equality passes to the other corresponding pairs by taking both
supplements or both vertical angles. Choose the rays on l and m toward
R and the same direction along t from Q toward P. If D lies on t
beyond P (Q-P-D), the resulting corresponding pair is:

`angle RPD = angle PQR`.

In triangle PQR, angle RPD is an exterior angle at P and angle PQR
is a remote interior angle. The neutral theorem proved in 445 gives
`angle RPD > angle PQR`, a contradiction. Thus l and m cannot meet.

Dependencies: line incidence, corresponding-pair conventions, linear
pairs/vertical angles, and neutral exterior-angle inequality. No use of
A or of the theorem "parallel lines have congruent corresponding
angles". An A-based construction proof would also be possible, but
would conceal the neutral route and is not needed here.

## Source findings and later-review obligations

- No mathematical source blocker was found under the ordinary plane,
  distinct-line, proper-transversal, and nondegenerate-triangle
  conventions stated above.
- 441 must preserve both quantified directions and the at-most-one
  wording, including the on-line point case. It must not assume A
  during the proof of B implies A.
- 442 and 443 are open example tasks; a later choice view must preserve
  mathematical judgment about axiom dependence and disclose any loss
  of independent example generation/proof production.
- 444 and the forward parallel-angle theorem have different dependence
  directions. Using equal vertical angles at a single intersection
  is not a substitute for the corresponding-angle/transversal premise.
- 445 requires two strict inequalities and an actually neutral route.
  A triangle-sum or exterior-angle-sum calculation would not satisfy
  its explicit "without the parallel axiom" condition.
- Concept 0's E and exercise 441's B are the same written assertion,
  not competing definitions. The unprovided figure 209 is unnecessary
  for these complete textual propositions; actual image count stays 0.
- Structural/documentation observation only: the supplied seed has
  `source.include_group_instructions = true`, a field not enumerated
  in the supplied contract table. The expected canonical digest matches.
  No structural validator acceptance or overall verdict is claimed.

`source-review.json` is a source-only projection of the contract's review
fields, not a completed `s10y-choice-review-v1` document. It intentionally
has no fabricated draft digest, question reviews, or aggregate outcome.
Its source coverage verdicts are `blocked` solely because the view-only
snapshot has not yet been disclosed, not because source mathematics
could not be solved. Its empty figure arrays record that no images
were inspected.

Next authorized stage, after this handoff only: receive the parent's
view-only snapshot; assess fidelity, redundancy and leakage without
keys, independently solve every option, then compare author keys.
No such stage has been performed. Both files are to be sealed with
mode 0444 after checking their saved contents.
