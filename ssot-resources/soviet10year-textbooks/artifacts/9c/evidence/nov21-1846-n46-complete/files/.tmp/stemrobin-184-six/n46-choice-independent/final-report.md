# n46 staged independent review: final comparison, OPEN

Reviewer: Pascal (01a1fc52-037d-7c73-9823-d84e260a924f), independent_agent.
Ticket: ongoing STEMROBIN-184 / 184-6; finish=review.
Lesson: 9c / ana9-c4-s2-n46.
Semantic outcome: REVISE. Reviewer state: OPEN pending FULL parent Stage 3 intake.
No candidate edit, retention, completion, publication, closure or image operation.

## Findings first

1. n46-choice-04 / written 377(a): REVISE. The response retains touch versus
   crossing, both local extrema, monotonicity and tails, but never asks the learner
   to judge a coherent full shape or the curve's unique concavity switch and
   nonstationary inflection. The missing source-shape distinction is not repaired
   by selecting all correct detached first-order statements.
2. n46-choice-05 / written 377(b): REVISE. Roots versus stationary abscissas,
   origin symmetry, monotonicity and tails are retained. A curve with those facts
   but extra inflections would still pass every queried property. No complete-shape
   response tests the unique origin concavity switch or its nonstationary crossing.

The original Stage 2 REVISE findings and capacity-loss/coupling observations remain
frozen and unchanged. This final rationale is narrower: failure to demonstrate
unaided drawing, plotting, scaling or written calculation is NOT independently
a blocker. Recognition and reasonable elimination are allowed by the current
semantic contract. The retained defect is absence of a substantive complete-shape
mathematical judgment, not the choice response format itself.

## Concrete mathematical evidence for the retained shape omission

Let p(x)=x^3-2x^2 and q(x)=x^3-6x. Their actual second derivatives are
p''=6x-4 and q''=6x, giving one inflection each. In particular both are concave
up throughout (3,4).

For a countermodel to the sufficiency of the *queried properties*, take N=1000000
and define the following C2 bump, not a candidate drawing or new source function:

```text
B(x) = 10^-9 * sin^4(pi*(x-3)) * sin(N*(x-3.5)),  3 <= x <= 4
B(x) = 0,                                      otherwise
```

The sin^4 factor makes B and its first/second derivatives vanish at its support
endpoints. Its first-derivative magnitude is at most
10^-9*(4*pi+N) < .002; its amplitude is at most 10^-9.
At x=3.5+pi/(2N), B'' is approximately -1000; at
x=3.5+3pi/(2N), it is approximately +1000. Bounding the window's second
derivative by 16*pi^2 proves opposite total curvature signs even after adding
the original cubic curvature (which is below 24 on this interval).

- p+B has exactly the same tested roots, touch/cross behavior, stationary points,
  stationary values, monotonic intervals and tails as p. Its derivative remains
  positive on the support because p'>=15 there and |B'|<.002. It has wrong
  additional curvature switches. It also need not preserve the source's untested
  translated central symmetry.
- q+B(x)-B(-x) retains origin symmetry, all tested roots and extrema, monotonic
  intervals and tails. Its derivative stays positive on both support intervals
  because q'>=21 there. Its curvature nevertheless has extra switches.
- The support is beyond every queried finite root/stationary coordinate;
  all option truth values, including the false alternatives, remain unchanged.
- These countermodels do NOT satisfy the source equations. They show precisely
  that the assessed graph properties do not distinguish a correct complete shape
  from a wrong complete shape. The source formulas uniquely determine the target;
  a complete-shape response would demand the presently absent distinction.

No image was generated, opened, decoded, cropped or viewed for this argument.
Local arithmetic bounded |B'| by .0010000125663706145 and confirmed the two
total-curvature bounds have opposite signs. This is analytical evidence only.

## Smallest affected repair

Affected units: n46-choice-04, n46-choice-05 and the source 377 coverage/limitations
records that depend on them. Questions 01-03 need no mathematical or semantic
repair from this review. No full-source or full-package review replay is requested.

One coherent full-shape recognition response for each cubic can resolve the issue.
This can be an authorized complete-curve option or a complete mathematical graph
descriptor/table; it need not require independently drawing or writing a solution.
Do not repair by appending more isolated true/false cells or by merely changing
an internal limitation statement.

Concrete response evidence must connect the existing intercept/extremum/direction/
tail facts to the regional curvature and unique inflection:

- For p: down-concavity before 2/3, up-concavity after 2/3, the unique inflection
  (2/3,-16/27) between the maximum at 0 and minimum at 4/3, and its nonzero slope
  -4/3. Preserve the touch at 0, crossing at 2 and the negative minimum ordinate.
  A complete descriptor can also state the center (2/3,-16/27), rather than
  treating p as odd about the origin.
- For q: down-concavity before 0, up-concavity after 0, the unique nonstationary
  origin inflection with slope -6 between the two extrema, while preserving
  the distinct roots +/-sqrt(6), stationary abscissas +/-sqrt(2), and origin symmetry.
- The response must discriminate a coherent wrong shape, for example wrong
  regional curvature or extra inflections despite otherwise correct landmarks.
  It should not impose arbitrary source-absent plotting scales.

These are repair criteria, not edits or new authoring authorization. Any changed
view must receive a fresh affected-only VIEW stage before its changed internals.
Existing frozen independent true sets describe only the current fixed snapshot.
No image work is authorized here.

## Complete internal comparison

Released fixed draft, bound before content display:

`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n46-choices-recovered/draft.json`

24374 bytes;
encoded SHA-256 `5113bf73ae9f52e5b3311dc828302bd9977046b551d2d483db70cf9acd50dcef`;
canonical SHA-256 `b49784eb9e0c6535ce759631ba8296014124969fa617bcfb8b1debc42658373f`.

The entire released draft was read: all five intents/source_solution strings,
unit reasons, limitations, 26 key rationales, 15 misconception derivations and
all three coverage/omission records. No referenced source-solutions.md was opened.
The author's assertion that its own solution file predated options is a reported
claim, not independently verified provenance.

The draft's id/view projection serialized as UTF-8 JSON with indent=2 and a final
newline is exactly 4862 bytes and has SHA-256
`5ae09f0c1645ee4dd01801cb61bd0aa2826c3320ea2786645df32bc67b5a0e80`,
matching the Stage 2 released view without reopening any other author file.
The draft seed digest matches the unchanged Stage 1 seed snapshot.

| Question | Frozen independent set | Author set | Mathematics | Fidelity |
| --- | --- | --- | --- | --- |
| n46-choice-01 | c | c | pass | pass |
| n46-choice-02 | b | b | pass | pass |
| n46-choice-03 | d | d | pass | pass |
| n46-choice-04 | a,c,d,f | a,c,d,f | pass | revise |
| n46-choice-05 | a,c,e,g | a,c,e,g | pass | revise |

All 26 author per-option truth values agree with the frozen Stage 2 checks;
all 11 correct-option derivations are valid and have null misconceptions.
No independent set was altered. There is no mathematical key disagreement.
Mathematics agreement does not imply graph fidelity.

## Every wrong-procedure derivation

- 01/a: u^n -> u^(n-1) generates all three missing-multiplier entries.
- 01/b: u^n -> n*u^n generates all three unreduced-exponent entries.
- 01/d: replacing (x-4)^4 by x^4-4, then differentiating, produces 4x^3;
  the other two derivatives are deliberately correct.
- 02/a: correctly differentiate nonconstant terms but retain 9; this yields
  the displayed +9 result, which is false at x=0.
- 02/c: incorrectly delete both degree-0/degree-1 term derivatives, leaving
  only 10x^4-12x^3+14x. It loses the true -5.
- 02/d: decrement each positive exponent without its multiplier; the linear
  term becomes -5x^0=-5, so the exact distractor is generated.
- 03/a: replace -2+(-3) by -2-(-3)=1; differentiating the resulting wrong
  7+x^9+x^4 gives 9x^8+4x^3 exactly.
- 03/b: combine to -5x^9, then omit factors 9 and 4; result -5x^8+x^3.
- 03/c: correctly differentiate nonconstant terms but retain constant 7.
- 04/b: correctly locate extrema but evaluate the minimum with 2-x instead
  of x-2; (16/9)*(2/3)=+32/27. Maximum remains zero; false ordinate generated.
- 04/e: find both zeros and apply the erroneous every-zero-crosses rule,
  ignoring the double root. This yields exactly the two-crossing claim.
- 04/g: discard the nonconstant quadratic derivative, leaving 3x^2; that
  wrong derivative would imply global strict increase despite its isolated zero.
  The actual derivative is negative on (0,4/3).
- 05/b: solve q=0 instead of q'=0, take the two nonzero roots and assign the
  usual left-max/right-min roles; their zero heights yield the exact false points.
  Actual derivative at both abscissas is 12.
- 05/d: differentiate only -6x and omit x^3; the wrong derivative -6
  generates the asserted global decrease, contradicted by q(2)<q(3).
- 05/f: use -6x, not dominant x^3, for tails; that term generates exactly
  the reversed limits. The actual cubic has opposite tails.

All 15 procedures actually yield their distractors, and every distractor is
false for the source function. These diagnoses were checked after the frozen
option truths, not used to reverse-engineer them.

## Source coverage and capacity-loss judgment

375: all three functions remain in a complete-row decision. Shared power-rule
reasoning plus the shift is substantive. Its g column is not independently
discriminating, and free writing/expansion is lost; those limitations remain
recorded, but reasonable complete-row recognition is not itself a failure.

376: both full polynomials remain. The split distinguishes coefficient/linear/
constant handling from combining two separated negative ninth powers. Recognition
replaces written simplification, but no essential algebraic relationship is removed.

377: author text openly says the units are partial property judgments rather than
replacements for the written drawings. Its omissions cover coherent construction,
curvature/inflection, p's translated symmetry, explicit domain/range and function
sign intervals, plus q's simple-root crossing classification. There is no silent
omission. Nevertheless honest recording does not repair the absent complete-shape
judgment demonstrated above.

Separate assessment of every frozen auxiliary fact is not demanded. Domain/range
follow from the real cubic formulas and need not become isolated extra questions.
Independent plotting/scale selection, written calculations and drawing production
are nonblocking recognition losses here. The retained blocker is meaningful
whole-shape/unique-inflection discrimination within the two graph tasks.

Package dependence/leakage judgments from Stage 2 remain: no literal inter-question
answer handoff, and ordinary power-rule transfer is acceptable. Within each graph
question, extrema/direction and contrasting pairs are mathematically coupled, not
independent samples or guarantees of one true item per pair. No key normalization.

## Staging, unchanged evidence and strict compliance

Parent reports FULL Stage 2 intake: outputs 463cba, 00aa9d, 38dca6; stage
n46-choice-stage2-full-intake-nov21 exit 0, reference 6de1d6. This is dispatch/
reported fact under existing human authority, not independent parent inspection.
Only then was the fixed draft explicitly released.

All seven Stage 1/2 files retained their exact sizes/SHA-256 and 0444 modes:
the four original source/receipt/failure files and the three Stage 2 files.
No original finding, set, option check, failure or exposure declaration was edited.
Their full absolute bindings are in stage3-receipt.json.

Actual exposure chronology: Stage 1 authorRead=false/viewRead=false; Stage 2
authorRead=false/viewRead=true; Stage 3 authorRead=true/viewRead=true for only the
fixed draft. No other author file/root inventory, old answer/history, raw page,
other lesson or parent mathematical repair was read.
Actual image views/decodes/reopens/crops/screenshots=0. Parent context remains
reported permanently 24/24; hidden parent internals remain UNKNOWN.
Author pre-options chronology remains UNKNOWN beyond its released textual claim.

strictCompliance: compliant with the staged content boundaries. Current contract,
review and validator/prepare helper code were read as tooling instructions, not
additional mathematical source. Every actual exec cwd is ROOT. No Git, backend,
setup, freshness replay, environment/credential inspection, paid/model/network
call, descendant/new chat, peer/supervisor message or source168+ work occurred.
The run-stage wrapper's ordinary inherited subprocess environment is not an
inspection/export of credentials and its explicitly authorized generated logs
are not manual-content edits.

The first Stage 1 copied-source label failure remains retained, recovered before
that freeze. It was not erased or counted as semantic approval. No Stage 3 math
uncertainty or candidate edit is present.

## One first full draft-and-review structure check

The authorized existing run-stage.mjs captured this one uniquely named stage:
`n46-choice-first-full-review-validation-nov21`.
The full current check_draft and check_review functions ran together against
the unchanged Stage 1 prepared seed snapshot and released draft/review. They check
exact fields, snapshot digests, all relationships/sets and verdict aggregation.

The CLI check_seed freshness path is intentionally not invoked: it would reopen
book/lesson/source files outside the staged projection and is not needed for this
first draft+review structural agreement check. No monkeypatch, schema weakening,
structural-only author rerun or claim of refreshed source freshness is made.
No image asset exists in either seed or draft.

Structure preserved semantic REVISE and returned exit 3, not pass.
The single call ran at 2026-11-21T04:39:44.445Z through
2026-11-21T04:39:44.482Z, with no signal/error. Output states that current
draft+review mechanical checks passed on the frozen authorized source snapshot,
but semantic review outcome is revise. Canonical review digest:
`e4d03dd61b3fdbc84f8606253acad6c84e8b3de51d6966501a88de764ac64e48`.

Full saved evidence, each subsequently frozen 0444:

- `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/stages/n46-choice-first-full-review-validation-nov21.stdout`:
  590 bytes; `bc472a5fcba258381b4fe41c6a8edf02c03dd13b39cf4252d61e4d072735e005`.
- `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/stages/n46-choice-first-full-review-validation-nov21.stderr`:
  97 bytes; `a152bd0367c365c37008365697b99cdd82c4e925dc5d2c8340660ee63c5f9ac2`.
- `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/stages/n46-choice-first-full-review-validation-nov21.receipt.json`:
  2642 bytes; `fc81646fc25c251ca80710222c9956b931847976392ba907d8d8ea9052c39e8f`.

This is not a CLI seed-freshness pass or proof of semantic correctness.
No structural-only author check was rerun. No second full review check occurred.

## Stop gate

STOP OPEN for FULL parent Stage 3 intake of review.json, this report, the Stage 3
receipt and full validation logs/receipt, including the nonpassing outcome.
Any affected repair needs a separate explicit authorization for questions 04/05
and their source 377 relationships; otherwise await explicit actual close.
No retention/completion/publication follows from this review.
