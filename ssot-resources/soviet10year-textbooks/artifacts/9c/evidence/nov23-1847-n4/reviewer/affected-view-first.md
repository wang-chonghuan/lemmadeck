# N4 Revision1 Affected-View Review

Date: 2026-11-23.
Ticket: STEMROBIN-184.
Stage: D1, affected learner views only.
Outcome: PASS for q10 and q18 at the view level.

## Snapshot and Honest Scope

Workdir: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

Input:
`.tmp/stemrobin-184-six/n4-nov23-source2324/revision1-affected-views.json`.

Input byte SHA-256:
`6f70c5623e68b494312a984ed6c244d767a56b58110c60a44d2aedd562417932`.

Input canonical JSON SHA-256:
`bc426639daf6224188a2bc2aec2b97e4687e8938778dad366d8d2b4b0f2abc34`.

Canonical JSON uses sorted keys, ASCII escaping and compact separators.
The input contains only q10 and q18, each with a `single` view and four
options a,b,c,d. There are eight options, no figure IDs and no internal
reasoning, keys, rationale or coverage fields.

This is an affected review, not a fresh blind review. The original author
keys and first rejected internal draft were already seen in Phase C.
The present revision's internals have not been opened. The retained source
solutions and relevant Phase B option evidence are reused; no source is
solved again and no unchanged learner view receives another review.

Retained references, unchanged:

- `reviewer/source-first.md`, byte SHA-256
  `88285638b7bd029d302eb0dcc1ac5d532a2d5525bc03aef29bde128d821898e7`.
- `reviewer/view-first.md`, byte SHA-256
  `e0325448bd31548664f9849881905113cee119d345bd6c115d93f1658104442b`.
- `reviewer/first-choice-review.json`, byte SHA-256
  `ce086579eba6e4d26a6d325272adbb7d54a4c2a2a8963bac8187017a9ecca500`.
- `reviewer/internal-comparison.md`, byte SHA-256
  `ca83e253017af6802d2806713a0c933ea3bf0489ecf1e52c5137ac3c88bde479`.

No `revision1-draft.json` or other current internal file was read.

## Changed Scope, Fidelity, Redundancy and Leakage

These judgments precede comparison with any current revision internals.

### q10: PASS

The new stem explicitly asks which option calculates **both** the
positive-integer branch and the k=0 branch correctly. The old permission
to adopt only the positive branch under one convention for N is absent.
Thus the zero value is within every option's required truth scope, not
an optional unused statement.

Task fidelity: PASS. The original factorial quotient is unchanged.
The positive cancellation domain and the explicitly considered zero
boundary agree with the retained source solution and its stated extension.
The task no longer depends on whether N includes zero.

Redundancy: PASS. One response checks a general positive-domain expression
and a separate boundary value; neither is an interchangeable duplicate of
the other. Matching the positive branch alone cannot fulfill the new stem.

Answer leakage: PASS. The stem specifies domain and $0!=1$ but supplies
neither the simplified positive expression nor the quotient's zero value.
Those conventions enable the calculation without giving its outcome.

The original q10 scope defect is resolved at the learner-view level.

### q18: PASS

The four requested conditions and their order are unchanged. Option b now
gives 120 as the first count, while a,c,d give 24. The starts-with-3 count
is no longer identical in every alternative.

Task fidelity: PASS. A meaningful incorrect first-count alternative now
distinguishes counting the full five-digit permutation set from fixing
the first digit. The tuple still checks ordered prefixes of lengths one,
two and three, and both complement directions.

Redundancy: PASS. Each requested relationship has a discriminating
alternative. The first count is no longer an invariant response coordinate.
The other three components retain their previously accepted distinct
prefix/complement judgments.

Answer leakage: PASS. No stem text supplies the first count, and the options
do not all supply the same first count. The old direct invariant-answer
copying is removed. Three options agreeing on 24 is not an unconditional
given; accepting that value still requires judging it against 120.

A learner may eliminate a tuple using one of its other wrong components;
reasonable elimination of a complete response is not a new failure.
This does not establish independent written production of four counting
derivations, which was never guaranteed by a choice response. No extra
requirement that every component be asked as a separate question is imposed.

The original q18 view-level fidelity/leakage defect is resolved.

## Affected Option Checks and Frozen True Sets

These checks use the retained mathematical solutions, not the known original
keys as mathematical evidence. Every changed-view option is accounted for.

### q10: Complete True Set `{a}`

Retained source mathematics: for positive integer k, cancel the identical
nonzero factors in $(2k)!=2k(2k-1)(2k-2)!$ to obtain $1/(2k-2)!$.
At k=0, direct substitution in the original quotient gives
$0\cdot(-1)/0!=0$. The already-frozen k=2 value is $1/2$.

| Option | Truth | Evidence under the new both-branches requirement |
| --- | --- | --- |
| a | T | The positive expression is $1/(2k-2)!$ and the zero value is 0. Both agree with the retained solution. |
| b | F | Its positive branch is correct, but its zero branch gives 1 instead of the original quotient's value 0. The new stem requires this branch to be judged, so b can no longer be accepted under a positive-only reading. |
| c | F | Its zero value is correct, but at the retained positive test k=2 its expression is $1/3!=1/6$, not $1/2$. |
| d | F | Its zero value is correct, but at k=2 its expression is $2!=2$, not $1/2$. |

Exactly one option satisfies both branches. `single` is now consistent
with the complete true set, with no convention-dependent alternative set.

### q18: Complete True Set `{c}`

Retained source mathematics gives the ordered tuple $(24,96,6,118)$:
the full set has 120 numbers; fixing leading 3 leaves 24; excluding leading
5 leaves 96; fixing ordered 54 leaves 6; excluding ordered 543 removes only
54312 and 54321, leaving 118.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | First three counts are correct, but 114 removes six numbers rather than the two with prefix 543. The retained counterexample 54123 must remain counted. |
| b | F | The changed first value 120 counts all five-digit permutations without enforcing leading 3; the retained fixed-prefix count is 24. Its second value 24 counts the prohibited leading-5 set rather than complement 96, and its last value 2 counts the prohibited prefix-543 set rather than complement 118. Only the third value 6 is correct. |
| c | T | All four counts agree with the retained tuple $(24,96,6,118)$. |
| d | F | First two counts are correct, but ordered prefix 54 leaves 6 completions, not 12, and the final complement is 118, not 108. |

Exactly one complete tuple is true. Its agreement with the previously known
original key is an observation, not the basis for the judgment.

## D1 Conclusion and Next Boundary

D1 PASS: q10 has unique true set `{a}` with both branches mandatory; q18
has unique true set `{c}` with a non-invariant, mathematically meaningful
first-count alternative. No actual residual affected-view defect was found.

The 16 unchanged learner-view assessments and source solutions remain retained,
not reviewed again. q13's unchanged view and its formerly defective internal
exception statement were not reassessed in D1. The revised q13 rationale,
source 36/42 coverage and current keys/rationales remain unverified until
the authorized internal-only comparison.

Only this new `reviewer/affected-view-first.md` was written. Original failed
draft/review/freezes remain unchanged. No official final review or checker
was run, and this view-level pass is not approval of undisclosed internals.
No images/browser, DB/environment, app/skill/dependency change, new service,
chat, worktree, timer, commit, push or peer message was used.

Status: READY FOR INTERNAL-ONLY REVISION1 COMPARISON.
