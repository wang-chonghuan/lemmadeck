# 184-6 / n17 Choice Semantic Review / Stage 2

Stage 2 verdict: REVISE. The visible mathematics is determinate, but the
third distance result is disclosed identically in all four alternatives.
This is not a final semantic review or author-key comparison.

## Frozen Inputs And Review Order

- Visible input:
  `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n17-choices/view.json`
- Visible input raw SHA-256:
  `30922f925042461e50b1770184a9e574f98eddfbcb1a0057bb3ce827090d3e0d`
- Frozen Stage 1 Markdown:
  `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n17-choice-review/stage1-source-solutions.md`
  SHA-256 `229c9bb43e1cfab0245b41035452064affbfd7be9ce0e56983813517ef7dafbe`.
- Frozen Stage 1 JSON:
  `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n17-choice-review/stage1-source-solutions.json`
  SHA-256 `a3eb3f340113a018c4449c45384226cc79d1617be3cf0742a02750aa12494083`.
- First judged fidelity, redundancy and leakage against the frozen source
  solutions. The invariant third distance answer was identified before the
  option-truth enumeration below. Then independently solved all visible
  questions, all 48 alternatives and their complete true sets.
- Only id/view fields were disclosed. No draft, internal source mapping,
  intent, key, coverage, author report or author solution was read.
- All visible and seed figure references are empty. Additional images: 0.
  Previous figure budget remains 4/4 permanently exhausted.
- No DB, environment, network, model, dependency, app, Git, backend or
  delegation operation, and no draft-dependent validator, was used.

## Fidelity, Redundancy And Leakage First

| Question | Fidelity | Redundancy | Leakage | Concrete evidence |
| --- | --- | --- | --- | --- |
| n17-distance-proof | pass | pass | pass | Asks for a complete proof, comparing same-side subtraction, opposite-side addition and endpoint order. Knowing the theorem written in the stem does not identify a valid proof. Recognition cannot demonstrate independently composing the proof, but the proof's case distinctions remain. |
| n17-distance-results | revise | revise | revise | The four coordinate pairs are retained and whole-tuple recognition is legitimate in principle. However every alternative gives 3.6 as the third entry, so the distance of -3.6 from 0 is supplied without any mathematical judgment. This slot is non-discriminating and leaks that source task's result; the defect is not merely that ordinary elimination is possible. |
| n17-origin-equal-inside | pass | pass | pass | Preserves both the two-point equality set and strict interior interval. Related exterior questions require a different direction and boundary decision, not copying an identical answer. |
| n17-shifted-equal-inside | pass | pass | pass | Preserves center 10, radius 4, both equality branches and the non-strict interior. A later exterior question shares thresholds but still requires union and strict endpoint exclusion. |
| n17-outside-boundaries | pass | pass | pass | Preserves both exterior tasks and their different endpoint inclusions. Reusing thresholds -5/5 and 6/14 from other items does not settle >= versus >, interior versus exterior or one-ray versus two-ray membership. |
| n17-model-equal-distance | pass | pass | pass | Requires both translating distance from 5 into an equation and choosing the complete two-point set; 3/7 is not a distance result copied from another item. |
| n17-model-negative-center | pass | pass | pass | Retains variable a, center -1, strict radius 3.5, both bounds and the model plus set. The unrelated appearance of 3.5 as another point-pair distance does not supply bounds -4.5/2.5. |
| n17-model-small-radius | pass | pass | pass | Retains negative center -4.5, radius 0.2, non-strict interior and the translated inequality plus full set; no other item supplies these endpoints. |
| n17-model-opposite-coordinate | pass | pass | pass | Retains coordinate -b rather than b, non-strict exterior radius 1/48 and exact rational bounds. No preceding item's coordinates provide the required center transformation. |
| n17-plane-zero-product | pass | pass | pass | The alternatives retain union versus intersection, both complete lines, orientations and the sign of -3. Textual geometric recognition does not demonstrate drawing the lines oneself. |
| n17-plane-zero-quotient | pass | pass | pass | The multiple propositions require both y=x and the x!=1 domain restriction. Evaluating the universal statements and the x=1 proposition retains the excluded-point distinction; no other question supplies this denominator restriction. Text recognition does not demonstrate drawing the hole. |
| n17-plane-halfplanes | pass | pass | pass | Text distinguishes AND from OR, left from right, above from below, excluded x=0 and included negative-x part of y=-1. The explicit inclusion clause resolves the boundary in option B. Recognizing this region does not demonstrate shading it oneself. |

All choice questions lose independent production of a written solution.
For the proof and planar tasks the particular losses are independent proof
construction and independent plotting/shading. The visible package retains
their mathematical distinctions, so those recognition losses alone do not
make the items fail. They must be honestly recorded during later internal
comparison; this stage cannot inspect whether the author has recorded them.

## Independent Mathematics And Every Option

### n17-distance-proof: Complete True Set {B}

Independent proof: order x_A<=x_B. On the positive ray subtract x_A from
x_B; on the negative ray subtract -x_B from -x_A; across 0 add -x_A and
x_B. Each gives x_B-x_A, and swapping endpoints yields the absolute value.
Equality of coordinates gives zero, including at the origin.

- A: false. For x_A=1, x_B=3 it predicts 1+3=4, but AB=3-1=2.
  Addition through the origin double-counts the nearer positive segment.
- B: true. Its three ordered cases give x_B-x_A, including coincident
  endpoints and an endpoint at 0; swapping A/B handles reverse order.
- C: false. For x_A=-3, x_B=-1 its negative-ray subtraction gives
  |OB|-|OA|=1-3=-2, although the length is 2.
- D: false. With x_A=3, x_B=1 it gives x_B-x_A=-2, although AB=2.
  Omitting endpoint ordering invalidates its directed-difference conclusion.

### n17-distance-results: Complete True Set {C}

Independent distances in order:
|(-2)-1.5|=3.5; |6.2-(-10.3)|=16.5;
|0-(-3.6)|=3.6; |(-7.1)-(-5.7)|=1.4.

- A: false. The final entry is 12.8=5.7+7.1; same-side negative points
  instead have distance 7.1-5.7=1.4.
- B: false. The first entry 0.5=|1.5+(-2)| is not |(-2)-1.5|=3.5;
  its second 4.1=|-10.3+6.2| is not 16.5.
- C: true. All four entries equal the four independently computed absolute
  coordinate differences.
- D: false. Its first -3.5 and last -1.4 are directed differences, not
  nonnegative distances.

### n17-origin-equal-inside: Complete True Set {D}

|x|=5 gives {-5,5}; |x|<5 gives -5<x<5.

- A: false. The second set includes 5 and -5, which have |x|=5, not <5.
- B: false. The equality set omits -5; the second set admits -6, although
  |-6|=6 fails the strict inequality.
- C: false. Its second exterior set admits 6 and excludes 0, opposite
  to their membership under |x|<5.
- D: true. The two-point equality set and open interval are both correct.

### n17-shifted-equal-inside: Complete True Set {A}

|x-10|=4 gives x=6 or 14; |x-10|<=4 gives 6<=x<=14.

- A: true. Both equality branches and the closed interval are correct.
- B: false. At x=-6, |x-10|=16, not 4; its negative-centered sets also
  exclude the valid interior point x=10.
- C: false. It excludes endpoints 6 and 14 from the second set although
  both have distance 4 and satisfy <=4.
- D: false. Its equality set omits 6; its second ray admits 0 although
  |0-10|=10>4.

### n17-outside-boundaries: Complete True Set {C}

|x|>=5 gives x<=-5 OR x>=5.
|x-10|>4 gives x<6 OR x>14.

- A: false. Its first set admits 0, failing >=5; its second admits 10,
  whose distance from 10 is 0, failing >4.
- B: false. It excludes -5 and 5 from the >=5 set and includes 6 and
  14 in the >4 set, reversing both required endpoint decisions.
- C: true. Both exterior unions have exactly the required finite endpoints.
- D: false. It omits the valid left branch in each set: -6 satisfies
  |x|>=5, and 0 satisfies |x-10|>4.

### n17-model-equal-distance: Complete True Set {B}

Distance from M(5) is |x-5|, so equality to 2 gives x=3 or 7.

- A: false. It centers at -5; its admitted x=-3 has actual distance 8
  from 5, not 2.
- B: true. |x-5|=2 and {3,7} correctly give the model and both solutions.
- C: false. The signed equation x-5=2 misses x=3, whose distance from 5 is 2.
- D: false. Its <= model admits x=5, whose distance is 0, not exactly 2.

### n17-model-negative-center: Complete True Set {D}

Distance from -1 is |a+1|. Thus |a+1|<3.5 iff -4.5<a<2.5.

- A: false. It centers at +1; a=4 is in its set but is 5 from -1.
- B: false. It includes a=-4.5 and 2.5, whose distance is exactly 3.5.
- C: false. It drops the lower bound: a=-5 satisfies a+1=-4<3.5,
  but its actual distance 4 is too large.
- D: true. The strict model and open interval have center -1 and radius 3.5.

### n17-model-small-radius: Complete True Set {C}

Distance from -4.5 is |y+4.5|; <=0.2 gives -4.7<=y<=-4.3.

- A: false. It centers at +4.5 and admits y=4.5, which is 9 from -4.5.
- B: false. Its strict interval excludes y=-4.7 and -4.3 even though
  both have distance exactly 0.2 and should be included.
- C: true. The <= model and closed negative-centered interval are correct.
- D: false. It selects the exterior: y=-5 has distance 0.5 but is admitted;
  the valid center y=-4.5 is excluded.

### n17-model-opposite-coordinate: Complete True Set {A}

|(-b)-(-12)|=|12-b|=|b-12|>=1/48 gives
b<=575/48 OR b>=577/48.

- A: true. The center in b is +12 and both exterior endpoints are included.
- B: false. It changes the center in b to -12. At b=12 its inequality
  holds because |b+12|=24, but the actual two points coincide, distance 0.
- C: false. Its interior includes b=12, whose distance 0 is too small,
  and excludes b=0, whose distance 12 satisfies the source condition.
- D: false. It excludes b=575/48 and 577/48, each at distance exactly 1/48.

### n17-plane-zero-product: Complete True Set {D}

(x-2)(y+3)=0 iff x=2 OR y=-3: union of two complete lines.

- A: false. (2,0) satisfies the product equation but is not (2,-3).
- B: false. Its horizontal line y=3 admits (0,3), where the product is
  (-2)(6)=-12; it also misses the valid point (0,-3).
- C: false. It misses (0,-3), which satisfies the zero-product condition.
- D: true. Correct vertical and horizontal lines, sign and union; their
  intersection (2,-3) is included.

### n17-plane-zero-quotient: Complete True Set {B,C}

The rational expression is defined only when x!=1.
Then it is zero iff y=x, so S={(t,t): t is real and t!=1}.

- A: false. Every point with x=1 has denominator 0; none belongs to S,
  including (1,1), where the expression is undefined 0/0.
- B: true. Every defined zero of the fraction has y-x=0, hence lies on y=x.
- C: true. Every point (t,t) with t!=1 has value 0/(t-1)=0 and belongs to S.
- D: false. (0,0) belongs to S but not the proposed x=1 line, while
  (1,0) is in the proposed remainder but has an undefined fraction.

### n17-plane-halfplanes: Complete True Set {B}

Intersect x<0 with y>=-1. Exclude x=0 and the corner (0,-1);
include the negative-x ray on y=-1.

- A: false. It includes the vertical axis, for example (0,0), failing x<0.
- B: true. Its excluded axis and explicit included left portion of y=-1
  describe exactly the required intersection.
- C: false. Its below region admits (-1,-2), failing y>=-1, and excludes
  the valid point (-1,0).
- D: false. Its union admits (1,0) through the upper half-plane and
  (-1,-2) through the left half-plane; each fails one required condition.

## Package Cross-Item Dependence

The proof establishes a reusable distance rule, not another item's numeric
answer. The origin/shifted interior and exterior items share boundary values,
but the inequality direction, union structure and finite endpoint inclusion
must still be decided. The modeling items require translating their own
coordinates, and the -b item adds a sign transformation not answered elsewhere.
The product, quotient and half-plane items test different operations:
OR from a zero product, a nonzero denominator, and AND of two inequalities.
No item explicitly refers to another item or requests copying its answer.

The distance bundle has one genuine invariant-answer leak: the third slot
is 3.6 in A, B, C and D. Its second-slot alternatives are also correlated
with the first slot, so eliminating a tuple can bypass the second calculation.
The latter is ordinary whole-tuple elimination and is not by itself a failure.
The former directly gives the entire result of one promised source task and
does require revision. Preserve all four point pairs; introduce a substantive
false third-distance alternative rather than treating that task as assessed.
No replacement option, new candidate or author repair is created in this stage.

## Frozen Stage 2 Result

12 questions, 48 option checks: 13 true and 35 false alternatives.
11 single questions each have one true option; the multiple question has B/C.
All independent mathematics verdicts are pass for determinacy of the visible
question and truth-set enumeration, without any claim of agreement with an
unseen author key.

Overall Stage 2 verdict is REVISE because n17-distance-results fails faithful
assessment of its third distance, has a non-discriminating slot and leaks 3.6.
Internal intent, recorded limitations, misconception derivations, exact key
agreement, source mappings/coverage and final semantic review remain deferred.
