# N35 independent comparison after bounded disclosure

Date: 2026-11-23. Ticket: STEMROBIN-188. Lesson: geo68-c3-s2-n35.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Owned directory:
`.intentfold/tickets/STEMROBIN-188/tmp/n35-content-independent7/`.

The two SOURCE-FIRST files remain byte-identical and mode 0444. This comparison
does not replace their pre-disclosure solutions or historical UNKNOWN states.
Only the five newly disclosed files, two authorized raw JSON inputs, and the
existing source-first review were used. No other lesson, redundant parent
163/164 attempt, source page, modern image or 450 answer was inspected.

New image loads: 0. Reopens/crops: 0. Cumulative original loads: 5, once each
for 214-218 in SOURCE-FIRST. The image-bearing context remains 5/24.
No native finalizer, native layout/flow tool, renderer, DB, environment,
network, install, Git, peer/supervisor, worktree or chat action was performed.
The ordinary read-only JSON comparison imported no repository/native modules.
Only this report pair was written; all source/author/candidate files were
left untouched. Report pair is sealed mode 0444 after completion.

## Actual findings

F01 / medium / learner-facing subpart labels / FAIL:
Candidate answers 452, 453 and 459 use second-subpart token U+0431 followed
by `)` in `displayAnswer`; 459 also uses third-subpart token U+0432 followed
by `)`. The disclosed modern prompts use `b)` and `c)`, respectively.
Thus the displayed answer labels do not match the displayed prompt labels.
This is not a finding about the original printed alphabet, which remains
UNKNOWN, and not a mathematical failure of the solutions.

Exact candidate JSON pointers: `/answers/1/displayAnswer`,
`/answers/2/displayAnswer`, `/answers/8/displayAnswer`.
Corresponding modern prompt pointers: `/exercises/2/text`,
`/exercises/3/text`, `/exercises/9/text`.
Repair only the learner-facing subpart tokens to the already disclosed modern
`a/b/c` mapping. Preserve archival `source_text`, raw source tokens, all
formulas, answer order, derived/ungraded metadata and empty `parts`.
No source image or identity gate is needed for this local text repair.

F02 / low / natural Chinese construction clause / FAIL:
Answer 457's first paragraph contains the consecutive Chinese characters
U+5373 U+4F7F (`ji shi`, "even if") immediately before the midpoint clause.
The intended clause explains the unconditional identities
O'=2P-O and M'=2P-M; it must not introduce an "even if" concession.
In the sentence's current sequence, the wording makes the midpoint step
grammatically misleading even though the formulas and later proof are correct.

Exact candidate pointer: `/answers/6/displayAnswer`, first paragraph.
Use an unambiguous explanatory phrase, for example "that is, make P the
midpoint of OO' and MM', respectively" (Chinese replacement recorded in JSON).
Do not alter the center, point formulas or construction cases.

No other actual mathematical, source-fidelity, order or textual-boundary
failure was found in the disclosed scope. These two findings do not revoke
unchanged source/figure/native approvals.

## Verdicts

Each row is one actual verdict for its stated scope. FAIL is limited to the
two actual learner-facing findings above; ambiguity notes below are not
additional failures.

| Scope | Verdict | Reason |
| --- | --- | --- |
| Complete modern prose, 13 text blocks | PASS | Definitions, all three properties, direction class, theorem 43, theorem 39 reference, proof and converse preserved |
| All ten modern prompts, 450-459 | PASS | Source numbers, ordered subparts, givens, formulas, figure references and common instructions preserved |
| Textual layout/flow boundaries | PASS | 16 derived paragraphs and boundaries 6,9,10,15 follow coherent concept transitions |
| Source bindings and read-only answer contract | PASS | Raw snapshots match; nine answers are derived, ungraded, parts=[] |
| Answer 451 | PASS | One ray per specified direction and fixed origin; all M positions included |
| Answer 452 | FAIL | Math complete and correct; F01 displayed subpart-token mismatch |
| Answer 453 | FAIL | Math complete and correct; F01 displayed subpart-token mismatch |
| Answer 454 | PASS | Infinitely many rays, one available direction; fixed-origin distinction preserved |
| Answer 455 | PASS | Available totals 2/4/6; subset/max/finite-edge interpretations explicit and distinct |
| Answer 456 | PASS | Symmetric, not reflexive, not transitive; valid distinct-ray counterexample |
| Answer 457 | FAIL | Correct whole-ray construction and center cases; F02 natural-Chinese clause |
| Answer 458 | PASS | Unique midpoint center, whole-ray image and equal-origin cases proved |
| Answer 459 | FAIL | All mathematical counts/examples/proofs correct; F01 displayed subpart-token mismatch |
| Aggregate nine candidate answers | FAIL | Five full-scope PASS, four FAIL affected only by F01/F02 |
| Aggregate disclosed content | FAIL | Modern text/prompts pass; candidate learner-facing answers need the two local repairs |

All nine answer mathematics scopes individually PASS. This is not nine-answer
publication approval: four answer presentation scopes fail. Answer 450 remains
deferred, without PASS/FAIL or final-answer approval, until its later authorized
disclosure with approved modern 218.

## Complete prose comparison

P01 / p0161#8: The introduction now addresses the learner singularly and uses
natural modern wording. It retains the definition sequence and prior-grade
context. PASS.

P02 / p0161#9: Distinct parallel supports, the origin-connecting line AC,
same/opposite half-plane conditions, and figure 214's two ordered panel
references remain intact. The original open/closed-half-plane shorthand is
retained; the modern text does not add an incorrect open-side condition. PASS.

P03 / p0161#10: The parallel-ray/segment footnote remains attached after its
asterisk reference and makes no length or intersection assertion. PASS.

P04 / p0162#5: Common-support containment definition is preserved and is not
changed to strict containment. Figure 215's a/b panel mapping is positional
modern transport, not an original alphabet assertion. PASS.

P05 / p0162#6: Both ray-direction formulas and their ordered endpoints are
identical to the raw source. Line breaks isolate readable formulas without
changing their meaning. PASS.

P06 / p0162#7 + p0163#1: Reflexivity, symmetry and transitivity retain order
1,2,3 and all indexed ray formulas, including the adjacent math spans in the
conclusion. The blank paragraph before item 3 is not a new section boundary
and does not detach it from the three-property statement. PASS.

P07 / p0163#2: Same direction, not opposition, remains the asserted equivalence
relation. PASS.

P08 / p0163#3: The word meaning "all" remains in the direction-class
definition. A representative specifies the entire class, not a selected finite
subset. Figure 216's second-panel reference stays attached. PASS.

P09 / p0163#4: Heading is reordered to theorem 43 without changing its number.
The claim still concerns symmetry about the midpoint of origins. It does not
add an unequal-origin restriction or a defining-point length equality. PASS.

P10 / p0163#5: Proof setup retains distinct supporting lines, opposite rays,
the O midpoint given and figure 217. PASS.

P11 / p0163#8: Natural phrasing replaces the old "center O" construction;
A maps to A_1, theorem 39 sends the support to the parallel support, the
half-planes exchange, and the unique target ray is identified. It does not
claim B maps specifically to B_1 or require AB=A_1B_1. PASS.

P12 / p0164#1: The coincident-support case is retained rather than omitted
from the theorem. The source's concise proof-by-analogy is not replaced by
a narrower case. PASS.

P13 / p0164#2: The converse remains separate after the proof: centrally
symmetric rays have opposite direction. PASS.

All 21 prose records remain in order: 13 text records, four figure records
214-217, and their four captions. The lesson manifest also retains figure 218
for exercise 450. There is no accidental fifth prose image or omitted caption.
The 43/39 theorem numbers, five figure IDs and raw source references match.

## All ten modern prompts

450: The AB/CD parallel given remains separate before the two questions.
Same-direction question precedes opposite-direction question; fig-218 remains
the sole exercise figure. The prompt adds no inter-point rays or arrow roles.
Prompt PASS only; final answer remains deferred.

451: Both questions retain fixed origin M and the given ray AB. "Origin" is
modernized consistently in the prompt, without excluding M=A or M=B. PASS.

452: Same-direction construction precedes opposite-direction construction;
each has off-line then common-line a/b cases. The third request still asks for
both prescribed relation notations. Four ray names and the shared command
remain correctly ordered. PASS.

453: Both co-directed and opposite-ray union/intersection questions remain in
the correct a/b order. The common drawing-and-symbols instruction is a separate
paragraph and applies to both main parts, not just the last intersection. PASS.

454: The marked formula and the unbounded-origin question are unchanged. PASS.

455: Moving the common modal question before conditions 1,2,3 is a readable
layout change. No "maximum", "every selected set", regularity, full-direction
selection or replacement of finite sides is inserted into the prompt. PASS.

456: The marked formula and relation-on-all-plane-rays question remain intact.
PASS.

457: The ray OM, center P and on-line/off-line cases remain in order. The
source's fixed-versus-selected-center ambiguity is not silently resolved in
the prompt. PASS.

458: Number 458 is separated from the two proof requests. The first retains
both central symmetry and how to locate the center; the second retains the
universal every-ray assertion. PASS.

459: Marked source number 459 and a/b/c cases retain quadrilateral, pentagon,
hexagon order. Odd-sided polygon symmetry remains the separate second request.
Neither regularity nor "maximum" is silently supplied. PASS.

Every exercise retains source_number, group_id, pages and figure metadata.
All source formula spans and numeric sequences are preserved. Prompt `lines`
join exactly to its `text`; no prompt or answer is added or lost.

## Nine substantive answer comparisons

451: R(M,u), R(M,-u) with u=B-A != 0 are unique. On/off-support and
M=A/B edge cases match the sealed solution. Math PASS.

452: All four coordinates satisfy their stated support and direction
conditions. The last same-line opposite example uses C=D=(1,0), but each ray's
origin differs from its defining point, so it is valid; different ray labels
need not mean four distinct points. Overlap does not invalidate opposition.
Both source relation formulas and equal-origin remarks are correct. Math PASS.

453: Min/max formulas for nested rays cover both origin orders and equality.
Opposite rays have whole-line union/closed-segment intersection for a<b,
whole-line union/singleton for equality, and disjoint-tail union/empty
intersection for a>b. All three construction examples are present, and the
common support is not named by coincident origins. Math PASS.

454: An origin parametrizes exactly one co-directed ray. Infinitely many
origins yield infinitely many rays, while the whole class is one direction.
The continuum refinement is correct in the stated real plane. Math PASS.

455: The first three responses identify available totals 2/4/6 and maxima,
then expressly say these are not universal counts for arbitrary selections.
Nonempty subset ranges, possible empty subset, and every-support-selected
minima are stated only as separate added premises. The finite-edge literal
reading is explicitly separated from the ordinary support-line interpretation.
The source prompt is not silently changed to "maximum" or a subset question.
Math/fidelity PASS.

456: The distinct rays r=[0,infinity), s=(-infinity,1], q=[2,infinity)
give two opposite relations but co-directed r/q. Opposition is symmetric but
fails reflexivity and transitivity, exactly as in the sealed proof. Math PASS.

457: Both reflected defining-point formulas and the whole-ray parameter
calculation are correct. The examples place P on/off the whole support,
with correct image origins/defining points. Fixed P allows only its matching
case; separately chosen centers give both examples. P=O and P=M are allowed.
Math PASS; only F02 affects the full answer verdict.

458: Both opposite rays can use the same chosen vector magnitude, because
ray sets do not prescribe a finite defining-point length. Midpoint of origins
is the unique center, including coincident origins; all overlap cases survive.
For arbitrary P, the image direction vector is -u. Math PASS.

459: Possible pair counts are 0,1,2 / 0,1,2 / 0,1,2,3, not one fixed
count for all shapes. The convex bound floor(n/2), ten realizability examples,
and odd-sided simple-polygon cyclic-order proof are correct. No regularity or
central-symmetry given is fabricated. Math PASS.

Independent checks of the actual 459 candidate examples, not the author's
assertion of previous checks:

| Shape/count | Consecutive edge vectors in candidate order | Positive consecutive cross-products | All parallel pairs |
| --- | --- | --- | --- |
| 4/0 | (4,0),(-1,2),(-3,1),(0,-3) | 8,5,9,12 | none |
| 4/1 | (4,0),(-1,2),(-2,0),(-1,-2) | 8,4,4,8 | (1,3) |
| 4/2 | (4,0),(0,3),(-4,0),(0,-3) | 12,12,12,12 | (1,3),(2,4) |
| 5/0 | (4,0),(1,2),(-2,2),(-3,-1),(0,-3) | 8,6,8,9,12 | none |
| 5/1 | (4,0),(1,2),(-2,1),(-3,0),(0,-3) | 8,5,3,9,12 | (1,4) |
| 5/2 | (4,0),(0,2),(-1,1),(-3,0),(0,-3) | 8,2,3,9,12 | (1,4),(2,5) |
| 6/0 | (3,0),(2,2),(-1,3),(-3,1),(-3,-4),(2,-2) | 6,8,8,15,14,6 | none |
| 6/1 | (3,0),(2,2),(-1,3),(-3,0),(-2,-3),(1,-2) | 6,8,9,9,7,6 | (1,4) |
| 6/2 | (3,0),(2,2),(-1,3),(-3,0),(-3,-3),(2,-2) | 6,8,9,9,12,6 | (1,4),(2,5) |
| 6/3 | (3,0),(1,2),(-1,2),(-3,0),(-1,-2),(1,-2) | 6,4,6,6,4,6 | (1,4),(2,5),(3,6) |

These ordered polygons are simple and strictly convex; the listed edges exhaust
the pair relations by zero/nonzero determinants. The candidate coordinates may
differ from the sealed independent examples without changing the source task.
No drawing, image or native validation tool was used.

## Layout and ambiguity boundaries

The retained flow has 16 paragraphs from the 13 text blocks and three internal
blank-paragraph splits. Its four section boundaries are:
6, notation -> three equivalence properties;
9, equivalence conclusion -> full direction class;
10, direction definition -> theorem 43;
15, theorem proof/common-line case -> converse.
None is inserted between theorem and proof, or between the two halves of the
half-plane/ray uniqueness argument. Footnote, captions and source order remain
coherent. This is a textual-boundary verdict, not a rendered mobile/desktop,
font-size, media or pixel-layout verdict.

Retained genuine source ambiguities, not additional FAIL findings:

- P02: Open/closed half-plane boundary convention remains implicit.
  The unchanged phrase admits the usual closed-side/non-origin interpretation;
  no strict open-side claim or excluded boundary origin was added.
- 455: Finite edge versus side-support shorthand and available/max versus
  chosen-subset quantifiers remain explicit in the answer. Standard available
  totals stay 2/4/6; alternative domains are identified as alternatives.
- 457: Fixed P versus separate choice of P remains explicit in the answer;
  the support-line criterion is correct in either interpretation.
- 459: Edge count alone does not determine one exact parallel-pair count.
  The prompt remains source-faithful, and the answer gives all realizable
  counts with maximums separately identified. Genuine-vertex/nondegenerate
  domain is stated, not a hidden new shape or regular-polygon premise.

Historical glyph/script/printing/dash UNKNOWN states remain UNKNOWN. The
author record's source-review wording is not adopted as a request to redo
approved source identities. Current modern label-token consistency is a
different, local text question.

## Bindings, preservation and stop

`comparison-review.json` records all nine current SHA-256 input bindings:
the two sealed baselines, two raw JSONs and five disclosed files. The baseline
hashes still match the received SOURCE-FIRST handoff. Raw JSON hashes still
match that baseline. Retained lesson/exercise/flow hashes match their author
record's authored-output bindings; author metadata is not mathematical proof.

The author's first recorded failure remains in the untouched author-record
at `/mechanical_evidence/technical_recovery`: the parser rejected the reversed
43-theorem heading order. It is a recorded technical parser failure, not a
new content failure. No failure record, source file or candidate was rewritten.

All nine answers remain `source=derived`, `grading=ungraded`, `parts=[]`;
no book answer, grading key, interactions or automated learner drawing
completion is asserted. Correct coordinate instructions are read-only standard
solutions, not evidence that a learner completed a drawing.

Stop at this report. There is no final 450-answer or modern-218 review or
whole-lesson publication approval. Only an authorized later disclosure can
advance that deferred comparison. F01/F02 can be repaired locally and reviewed
only in their affected displayed-answer spans; no full source/image/native
redo or new gate is requested.
