# n46 independent choice review: Stage 2 VIEW

Ticket: ongoing STEMROBIN-184 / 184-6. Finish: review.
Book/lesson: 9c / ana9-c4-s2-n46. Reviewer: independent_agent, OPEN.
Stage 1 is unchanged. Stage 2 VIEW only is released. Stage 3 is NOT_RELEASED.
This is not a final-schema review or comparison with an author's key.

## Release and input binding

Parent reports FULL Stage 1 intake complete, including outputs 1b52ca, 3bfa54,
db90ba, ac1337 and intake n46-choice-stage1-full-intake-nov21 exit 0 (38451c).
These are dispatch/reported facts under the existing human authority, not a
new claim that I inspected parent machinery or received a separate human prompt.
The earlier Stage 1 wording is qualified here without changing its frozen bytes.

Exactly one new content input was opened, after its byte/hash binding matched:

`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n46-choices-recovered/view-only.json`

Encoded bytes: 4862.
SHA-256: `5ae09f0c1645ee4dd01801cb61bd0aa2826c3320ea2786645df32bc67b5a0e80`.
Binding occurred before JSON parsing or displaying its content.
It contains five `{id,view}` entries: three native single questions with four
options each, and two native multiple questions with seven options each.
All figure lists are empty. No image or rendered page was opened.

All actual exec calls use
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck`.
Author material, draft, intent, key, solutions, manifest, answer artifacts,
author-root inventory, raw pages, other lessons and history remain unread.
authorRead=false; viewRead=true. Image views/decodes/reopens/crops/screenshots=0.
Parent permanent image context is reported 24/24; hidden internals UNKNOWN.
No Git/backend/freshness/setup/paid/env/network/new-chat or peer/supervisor
message operation was performed.

## Unchanged Stage 1 bindings

- `stage1-source.md`: 17552 bytes;
  `777e52542b397058096922af07b5fb24dcfe3fed0ceffd7334579c9dabf442c7`.
- `stage1-source.json`: 21524 bytes;
  `2cca7ec1f53cee557e0d2e2cac66741ea15ee01cbfcbe464d859cffb88bf628e`.
- `stage1-receipt.json`: 12050 bytes;
  `57df3e9385d2b78cbf89ab955bb0f0cfa49b722b6e19d11abaa8b1fc998248c3`.
- `n46-choice-independent-stage1-check-failure.json`: 2195 bytes;
  `910d5bd6f2799097caadcae89dc476d63de3dfe54bb866439c522b7983f6c1eb`.

Each still has mode 0444; root is 0755. The recovered missing closing `$` in
Stage 1 remains documented in its original failure receipt.

## Fidelity, redundancy and leakage: recorded before option solution sets

This first section is written before the Stage 2 independent option-classification
pass, and before any author internals. Its exact prefix and the corresponding
structured fidelity object will be hash-bound before mathematics is appended.
Verdicts below concern visible task design, not agreement with an unread key.
Native single asks for one complete expression/row. Native multiple asks for all
true statements; it does not promise one true statement in each apparent pair.

### n46-choice-01

Visible task: select the complete row of derivatives for x^4, x^3 and (x-4)^4.
Independent source mapping: all three subparts of written 375.

Task fidelity: PASS within the derivative-to-row-recognition adaptation. All
three original functions and the x-4 shift are retained; the response unit is a
whole derivative row, not separate data-copy cells. The learner must distinguish
power differentiation and preservation of the affine translation.

Redundancy: PASS with a concrete discrimination limitation. The g column always
co-varies with the f column: whenever a row has the appropriate f power pattern,
its g entry has the corresponding cubic-power pattern. Thus the f and h entries
can distinguish the row without a separate g calculation. This is not evidence
of independent performance on 375(b), but repeating the same power rule in a
complete-row recognition task is not by itself a failed source task.

Answer leakage: PASS. No row is marked as an answer, no source-to-answer mapping
is displayed, and the stem supplies the functions rather than their derivatives.
The co-variation permits ordinary elimination, not a logically forced key from
wording alone. No other question supplies this complete derivative row.

Capacity loss: selecting a complete row does not demonstrate independently
writing any of the three derivative functions, particularly the g entry.
The central power-rule/translation distinctions remain present.

### n46-choice-02

Visible task: choose the derivative of 2x^5-3x^4+7x^2-5x+9.
Independent source mapping: written 376(a).

Task fidelity: PASS. Every source term and sign is retained. A complete polynomial
derivative is the response unit, so constant, linear, exponent and coefficient
handling remain mathematical distinctions rather than copied source data.

Redundancy: PASS. The four expressions differ in retaining the source constant,
dropping the linear term's derivative, or omitting power-rule multipliers.
They are not identical verbal restatements. No other question asks for this
same polynomial derivative.

Answer leakage: PASS. The source constant is not described as a derivative,
no correctness marker is present, and another question does not state this
polynomial's derivative. Reusing f as a local function name is not a shared key.

Capacity loss: expression recognition replaces free production of a derivative;
the substantive termwise differentiation task remains represented.

### n46-choice-03

Visible task: choose the derivative of 7-2x^9+x^4-3x^9.
Independent source mapping: written 376(b).

Task fidelity: PASS. Both ninth-power terms remain visible, in the original
order around x^4. Combining like terms, signs, exponent multipliers and removal
of the constant are still needed to distinguish the complete expressions.

Redundancy: PASS. The alternatives vary the ninth-power coefficient/sign,
power multipliers and treatment of the constant. This is not a duplicate of
question 02; the two separated ninth-power terms add a distinct relationship.

Answer leakage: PASS. No other visible question gives the combined ninth-power
coefficient or this full derivative. Shared differentiation rules are ordinary
learning transfer, not a source answer supplied by a preceding question.

Capacity loss: expression recognition replaces independent written derivation,
but the like-power combination distinction survives.

### n46-choice-04

Visible task: select all true statements about y=x^2(x-2). The statements concern
axis contact/crossing, extrema, monotonicity and tails. No curve is displayed.
Independent source mapping: written 377(a), which asks to construct a graph.

Task fidelity: REVISE. The formula and several essential landmarks are retained,
but selecting detached statements never constructs or recognizes a complete
curve. Curvature, the inflection at (2/3,-16/27), its nonzero slope and the
translated central symmetry are absent from every option. A learner can decide
the listed algebraic/first-derivative facts while not integrating them into the
source's complete graph. This is more loss than simply writing versus recognizing
a complete graph/table, and cannot be silently approved as equivalent.

Redundancy: PASS with mathematical coupling noted. Options b/f deliberately
repeat the same claimed maximum and minimum x-coordinate but change the minimum
y-sign. Options a/e contrast touch versus crossing. Those differences are genuine
graph distinctions. Extrema and monotonicity are mathematically linked, so the
options are not independent performance samples, but the shared facts do not
make their differing claims equivalent.

Answer leakage: PASS. No option is labelled correct. Repetition of the maximum
in b/f may offer an unmarked consensus cue, but native multiple does not guarantee
either statement true; both may be false in principle. The a/e and b/f pairs do
not reveal which member is true from wording alone. No other question provides
this curve's extrema or intercept multiplicities.

Capacity loss: no graph production or complete-curve recognition; no assessed
concavity/inflection, translated center of symmetry, inflection tangent, range
or domain determination. The source formula implies a real polynomial, but
the selection response does not assess recognizing its domain/range. The
integrated graph-construction task remains unperformed.

### n46-choice-05

Visible task: select all true statements about y=x^3-6x, concerning intercepts,
extrema, origin symmetry, monotonicity and an end-behavior alternative.
Independent source mapping: written 377(b), which asks to construct a graph.

Task fidelity: REVISE. Separating intercepts +/-sqrt(6) from stationary points
 +/-sqrt(2) and recognizing odd symmetry preserves substantial mathematics.
Nevertheless no produced or displayed curve is judged. No option assesses
concavity on either side of zero, the nonstationary origin inflection or its
tangent y=-6x. Correctly selecting the listed facts cannot establish a complete
graph construction or complete-curve recognition.

Redundancy: PASS with coupling. Intercept and extremum statements intentionally
contrast sqrt(6) with sqrt(2), rather than merely repeating one conclusion.
Global-decrease and piecewise-monotonicity alternatives differ mathematically.
Local extrema help infer nearby direction but do not alone prove monotonicity
on the entire stated intervals; those are related, not identical, claims.

Answer leakage: PASS. The stem does not provide evaluated intercepts or extrema.
The origin-symmetry claim does not decide the direction of the infinite tails.
Native multiple does not require one item from each apparent pair. Question 04
uses a different cubic and cannot supply the exact zeros or stationary heights
here. No author's complete true set has been consulted.

Capacity loss: no graph production/complete-curve recognition; no assessed
curvature, nonstationary inflection/tangent, domain/range or explicit proof
that all three simple intercepts are crossings. Rejecting a combined reversed-tail
statement can use just one end and does not demonstrate both correct limits
individually. Integrated graph construction remains unperformed.

## Package dependence, coverage and construction losses

There are five visible questions for all seven written function tasks. The
mapping above is independently inferred from identical function formulas, not
read from an author intent or coverage field.

- Written 375: all three functions appear in one complete-row question. No source
  function is absent; independent written production and separate g discrimination
  are lost. Recognition/ordinary elimination alone does not fail the power task.
- Written 376: both full polynomials appear, separately, without omitted terms.
  Free derivation is replaced by expression recognition.
- Written 377: both formulas and many first-order graph landmarks appear. However,
  both requested complete graph constructions are replaced by property bundles.
  Neither a graph nor a full-shape description with curvature/inflection is a
  response option. This is the essential capacity loss driving REVISE.
- Common domain/range, curvature/inflection and full curve integration are
  supporting dimensions of the graph tasks, not seven additional tasks invented
  by this review. Their absence explains why the original constructions are not
  established by the visible responses.
- There is no literal cross-question answer handoff. Questions 01-03 reuse
  the same general power rule; that is ordinary source-topic transfer. Questions
  04-05 share positive-leading cubics but not their exact intercept/extremum data.
  No question must be answered by relying on a previous selected option/key.
- Within-question statements are mathematically coupled; do not count selecting
  extrema plus monotonicity as proof of two independent performances.
- Author limitations, omission rationale, misconceptions, internal correct sets
  and any approval of the graph-task adaptation remain UNKNOWN/unread.
  Their possible existence cannot erase the visible construction loss.

Pre-key task-design outcome: REVISE, specifically the graph construction fidelity
and written 377 coverage. No final overall-schema approval is issued.
Stage 2 option mathematics has not yet been appended at this checkpoint.

## Independently solved visible questions: appended after fidelity checkpoint

The preceding complete prefix was bound at
`2026-11-21T04:27:48.502434+00:00`: 12358 bytes,
SHA-256 `5207b5130238ce4440330baddc4c81b13a6ca4cb7ebbce3e8688b254e6c25341`.
The unchanged JSON fidelity object was canonically bound as 8849 bytes,
SHA-256 `6408f7b9236f7bfe156715b883291c20e980e4204d5dedd4bdc8bc4fc655a4d0`.
No true sets were recorded in that checkpoint. The following calculations
start afresh from each visible stem, without an author's solution or key.
English option descriptions below preserve the visible mathematical claims;
the exact Chinese source of the view remains bound by its input hash.

### n46-choice-01: native single

Fresh solution: the power rule gives `(x^4)'=4x^3`, `(x^3)'=3x^2`.
Expanding `(x-4)^4=x^4-16x^3+96x^2-256x+256` and differentiating gives
`4x^3-48x^2+192x-256=4(x-4)^3`. These are function identities for real x,
not equalities at one special point.

- a: FALSE. All three expressions omit the power multiplier. At x=1 its
  f entry is 1 rather than 4; its g entry is 1 rather than 3.
- b: FALSE. It multiplies by the original exponent but does not reduce that
  exponent. At x=2 its f entry is 64 instead of the derivative 32;
  its g entry is 24 rather than 12.
- c: TRUE. All three entries exactly equal the freshly derived functions.
- d: FALSE. Its f/g entries are right, but its h entry loses the shift:
  at x=0 it gives 0, while `h'(0)=4*(-4)^3=-256`.

Complete independent true set: `["c"]`. Exactly one, matching native single.

### n46-choice-02: native single

Fresh solution: differentiating the five original terms separately yields
`10x^4`, `-12x^3`, `14x`, `-5`, `0`.
Thus the derivative is `10x^4-12x^3+14x-5`.

- a: FALSE. The extra +9 retains the source constant instead of differentiating
  it to 0; at x=0 this gives 4 rather than -5.
- b: TRUE. Its entire expression is the termwise derivative.
- c: FALSE. It drops the -5 contribution of the source linear term -5x;
  at x=0 it gives 0 rather than -5.
- d: FALSE. Its coefficients 2, -3 and 7 omit the factors 5, 4 and 2;
  at x=1 it gives 1 rather than the true derivative 7.

Complete independent true set: `["b"]`. Exactly one, matching native single.

### n46-choice-03: native single

Fresh solution: the separated ninth powers differentiate to `-18x^8` and
`-27x^8`, x^4 differentiates to `4x^3`, and 7 differentiates to 0.
The derivative is `-45x^8+4x^3`. Combining first as `7+x^4-5x^9`
independently gives the same result.

- a: FALSE. The ninth-power derivative coefficient must be -45, not +9.
  At x=1 the option is 13 versus the true derivative -41.
- b: FALSE. It reduces exponents but omits the factors 9 and 4:
  at x=1 it is -4 rather than -41.
- c: FALSE. It has the correct nonconstant terms but retains +7;
  at x=0 it is 7 rather than the true derivative 0.
- d: TRUE. It exactly equals `-45x^8+4x^3`.

Complete independent true set: `["d"]`. Exactly one, matching native single.

### n46-choice-04: native multiple

Fresh solution: set `p(x)=x^2(x-2)=x^3-2x^2`.
Zeros are 0 (double) and 2 (simple). Near zero p is negative on both
sides and `p'(0)=0`, so the graph touches the x-axis there. At 2,
`p'(2)=4`, and the sign changes negative to positive.
`p'(x)=3x^2-4x=x(3x-4)` has signs +, -, + on
`(-infinity,0)`, `(0,4/3)`, `(4/3,infinity)`.
Therefore the local maximum is `(0,0)` and the local minimum is
`(4/3,-32/27)`. Positive leading x^3 gives the negative/positive infinite tails.
The word describing extrema is interpreted literally as local extrema, not
absolute extrema; this cubic has no absolute maximum or minimum.

- a: TRUE. Both clauses hold: touch/tangency at `(0,0)` and crossing at `(2,0)`.
- b: FALSE. The maximum clause is true, but the stated minimum has the wrong
  positive ordinate. Direct substitution gives
  `(4/3)^2*(4/3-2)=-32/27`, not +32/27.
- c: TRUE. Every stated open interval has the indicated derivative sign:
  increasing, decreasing, increasing. Excluding stationary endpoints does not
  invalidate the claims on these intervals.
- d: TRUE. Both displayed infinite limits agree with the positive-leading cubic.
- e: FALSE. The crossing at 2 is true, but the crossing at 0 is false:
  p has the same negative sign on both sides of its double zero.
- f: TRUE. Both local-extremum coordinates and their roles match the sign chart
  and exact evaluation.
- g: FALSE. For example `p(0)=0>p(1)=-1`, contradicting global increase;
  equivalently p' is negative on `(0,4/3)`.

Complete independent true set: `["a","c","d","f"]`.
All four are required by native multiple; neither an arbitrary subset nor one
choice from each apparent pair is a complete answer.
The correct statement set does not repair the graph-construction fidelity loss.

### n46-choice-05: native multiple

Fresh solution: set `q(x)=x^3-6x=x(x^2-6)`.
The zeros are `-sqrt(6),0,sqrt(6)`.
`q'(x)=3x^2-6=3(x^2-2)`, so the stationary abscissas are
`-sqrt(2),sqrt(2)` and its derivative signs are +, -, +.
Substituting gives local maximum `(-sqrt(2),4sqrt(2))` and local minimum
`(sqrt(2),-4sqrt(2))`. Oddness `q(-x)=-q(x)` gives origin symmetry.
The leading x^3 gives negative-infinite left and positive-infinite right tails.

- a: TRUE. Factoring q gives exactly the three listed x-intercepts and no others.
- b: FALSE. Both listed abscissas are roots, not stationary points:
  `q'(+/-sqrt(6))=3*6-6=12`, so neither is a local extremum.
- c: TRUE. `q(-x)=-q(x)` is exact, hence central symmetry about the origin.
- d: FALSE. The function is increasing outside the stationary abscissas;
  for instance `q(2)=-4<q(3)=9` contradicts global decrease.
- e: TRUE. The derivative sign changes establish the stated maximum/minimum,
  and substitution gives the exact opposite ordinates +/-4sqrt(2).
- f: FALSE. Both asserted limits are reversed. In fact q tends to negative
  infinity on the left and positive infinity on the right.
- g: TRUE. All three stated open intervals have exactly the specified
  derivative signs and directions.

Complete independent true set: `["a","c","e","g"]`.
All four are required by native multiple. This mathematics determination
does not supply the missing full graph/curvature/inflection assessment.

## Independent mathematical completion and stop

All five visible questions and all 26 options are classified: 11 true, 15 false.
Each single question has exactly one true option; each multiple question has
four. No option was accepted because of an author's key. Author correct sets,
rationales, limitations and omission explanations remain UNKNOWN/unread.

Independent visible mathematics: PASS as a determinate option-classification
record, not a claim of matching an author or of final-schema validity.
Visible task-design/graph-coverage outcome: REVISE, unchanged from the
fidelity-first checkpoint. Correct options do not normalize the capacity losses.

Stage 2 content review has two definite findings: n46-choice-04 and
n46-choice-05 do not preserve the complete construction task of written 377.
No candidate was edited and no new figure was requested or generated.
There is no Stage 2 execution failure or mathematical ambiguity.
Stage 1's recovered transcription failure remains retained and unchanged.

HOLD: STOP OPEN for FULL parent Stage 2 intake of MD/JSON/receipt, all exact
bindings, chronology, every option determination, both graph-fidelity findings,
all omissions/capacity losses and zero usage.
Stage 3 INTERNAL_KEY remains NOT_RELEASED; a separate explicit scoped release
after that full intake is required before reading any author's internal material.
No final-schema approval, closure, retention, publication, merge or deploy.
