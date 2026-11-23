# N19 independent choice semantic review

Date: 2026-11-23. Ticket: STEMROBIN-184. Offline, finish=review.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
Verdict: **PASS for independent choice semantics. No authoring/math defect found.**

## Independent order and bindings

FIRST read only learner-visible `reviewer/choice-views.json` and official
`choices/seed.json`. Then read the installed choice skill,
`references/review.md` and `references/contract.md`. Reused own immutable
`exercise-math-first.json`; no source/math or modern-answer review was replayed.

Persisted `reviewer/choice-view-first.json` with all forty option judgments,
ten complete true sets, fidelity/leakage/redundancy evidence and recognition
losses BEFORE reading `choices/draft.json`, `source-solving.md` or
`author-report.md`. The first freeze stays unchanged.

After disclosure, every `{id, view}` subtree matched the view-only projection.
The initially different hashes resolve without a content repair:
`choice-views.json` records the draft BYTE SHA-256
`c751e28e2bfd3a544f8efe79bd95ba1568b8005edc5b61e125b856f3738e5565`;
the caller's draft CANONICAL SHA-256 is
`072aed17a0ac39fc5a961456a5178236dd4cf5c0d3983afe1ba3843c745454cd`.
Both match the actual draft using their respective conventions.
The seed canonical digest also matches the draft's `seed_sha256`.

`choices/review.json` uses the installed `s10y-choice-review-v1` schema and
CANONICAL seed/draft bindings, not byte digests. The reviewer is genuinely
separate from the choice author; source and visible-option judgments preceded
internal disclosure. No peer or supervisor messaging was used.

## Semantic findings

Ten native single questions, forty options: each has exactly one true option.
All ten authored keys and all forty rationale truths agree with the independent
view freeze. All thirty wrong procedures were compared with their displayed
results and checked to be actually false for the source task.

| Question | True set | Distinction retained |
| --- | --- | --- |
| `n19-rational-successor` | C | Whole four-output tuple; successor shifts both numerator/denominator; adjacent difference |
| `n19-exponential-successor` | D | Whole four-output tuple; exponent shifts; nonzero adjacent ratio |
| `n19-prefix-reciprocal-power` | B | All five positive-index terms; power versus product and fraction scope |
| `n19-prefix-power-plus-reciprocal` | C | Both index-dependent power summands; whole ordered prefix |
| `n19-prefix-reciprocal-index` | D | Reciprocal index versus multiplication or whole-sum division |
| `n19-prefix-parity-rational` | A | Alternating numerator sign and whole-numerator denominator |
| `n19-strict-bound-indices` | B | Strict >200, all indices103 onward, not a singleton |
| `n19-upper-bound-indices` | D | Non-strict <=30, exactly positive indices1..43, no0 or44 |
| `n19-additive-recurrence-result` | C | Complete prefix plus formula5n-15 satisfying the first term and+5 law |
| `n19-negation-recurrence-result` | B | Complete prefix plus formula4(-1)^(n-1) with the correct initial phase |

The full review records every option's true/false evidence and wrong-algorithm
correspondence. Examples: rational B advances only the numerator; exponential
A freezes the exponent; reciprocal-power D divides both constants by2^n;
parity D divides only the alternating summand; strict-bound D returns only the
first solution; upper-bound C admits forbidden index0. The recurrence A options
have deliberately correct finite prefixes but wrong nth-term initial values,
and their rationales explicitly recognize that paired inconsistency.

All stems retain the relevant original formula, positive-natural domain,
requested quantities/order, inequality direction and full-set quantifiers.
There are no changed units, missing conditions or unresolved source conventions.
Only `view` is learner-facing: source mappings, solutions, keys, derivations,
limitations and coverage remain internal. No correct answer is given by a stem,
internal rationale, original exercise number or another question's stem.

## Coverage and production losses

All five selected sources and ten mathematical tasks are represented:
148 has two complete four-quantity tuples;149 has four complete five-term
prefixes;150/151 each has one complete satisfying index set;152 has two complete
prefix-and-formula pairs. Coverage question IDs exactly match actual source
citations. The selected concept blocks5/7/8/14 support the definition, positive
index domain and analytic formula method; block21 additionally supports both
recurrence tasks. No unrelated example answer is used as extra task data.

Splits reflect independent functions/recurrence mechanisms, not individual
answer blanks or a quota. Similar-looking prefix questions do not repeat the
same function; the two bounds use different formulas and different solution
sets. There is no cross-question answer dependency.

All ten intent limitations and all five coverage records explicitly recognize
loss of unaided written evaluation, derivation, sequence generation and formula
construction. Choosing a full tuple/list may be achieved by checking fewer
coordinates or eliminating alternatives; it cannot certify production of each
requested component. Those limitations are real and preserved, but do not
destroy the represented mathematical distinctions under the installed semantic
gate. No drawing or proof task was silently dropped. No new keyboard interaction
delivery is authored or authorized by this review.

## Hashes and pending work

Paths are relative to the sole cwd above.
`C = .tmp/stemrobin-184-six/n19-nov23-source7274/choices`.
`R = ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n19/reviewer`.

| Input / preserved first freeze | BYTE SHA-256 |
| --- | --- |
| `C/seed.json` | `a20c4d9ef3bc645734a72ba713dfeb9ed96ea0ac92ce0cd97920dd4a154c09a6` |
| `C/draft.json` | `c751e28e2bfd3a544f8efe79bd95ba1568b8005edc5b61e125b856f3738e5565` |
| `C/source-solving.md` | `988f004c14f018f0127c290a9c063212033a600bd22c18f779aef2e2f9cdc931` |
| `C/author-report.md` | `ba198e8cac633e1b83eb5a4ed294cc87489fedf544aef5fd60d52b822d3d3882` |
| `R/choice-views.json` | `e150cf4ea90d0955ab7a3c1ca08903f61dceb3c65c6cdfa33c41264fecaa32a3` |
| `R/choice-view-first.json` | `0cf8c67f96ed4f50f783a097fbb29a11b81df98830950e15b5aa543c3602add5` |
| `R/exercise-math-first.json` | `769ded42b8702b0590e04762a010204ee388bd236ac72a671460be7ae6b13cdb` |

Seed CANONICAL SHA-256:
`f509542a201c44b67e77c391e9ed17248b19b32abb2e21c1d365c02afc13e2df`.
Draft CANONICAL SHA-256:
`072aed17a0ac39fc5a961456a5178236dd4cf5c0d3983afe1ba3843c745454cd`.
Canonicalization follows the installed contract's sorted-key, ASCII-escaped,
compact JSON convention.

The author reports one completed `check_draft` structural pass and a preserved
preliminary command-parsing failure. Neither was replayed or overwritten.
This reviewer ran no official validator or source refresh and does not claim
freshness of the seed's traced original files. The parent owns full CLI
validation and retention. Semantic PASS is not those pending mechanical stages.

Source figures0, new figures0, images opened/decoded/reopened0, paid generation
or service/API calls0. Browser/keyboard/render/test executions0. No `.env`, DB,
Git, application/dependency change, network, other-lesson work or peer message.
Only the view-only freeze and requested review files were written with
`apply_patch`; all original drafts, source freezes and failures are preserved.

Rendered-display evidence remains pending. The later caller-requested single
eight-image headless display review has not begun and is not claimed here.
