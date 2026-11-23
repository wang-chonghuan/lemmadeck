# N10 choice review: Stage B blind learner-view freeze

Date: 2026-11-23.

## Scope and exact bindings

Sole working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

Evidence directory relative to that directory:
`ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/`.

- Visible candidate: `reviewer/choice-view-only.json`.
  SHA-256: `9702aa34b360f4737712d68b27ceb752cbd9d8d6bc7b8308d28818a7d989e31d`.
- Exact official seed: `.tmp/stemrobin-184-six/n10-nov23-source4345/choices/seed.json`.
  SHA-256: `1b387525f90b3c09dd18b0a2b578a6e7e6d0f4937de502676d8226eaeff71d3f`.
  Frozen canonical contract digest:
  `d5ff3a99b5a540ded47eade0b4f86bca321a733eedbb6038fead4eb8ab77635d`.
- Stage A freeze: `reviewer/choice-source-first.md`.
  SHA-256: `f6c0592d021385c38150fdb0c7863cb7d7c14e7ec483bf0bf6c72949b376b534`.
  Its seed binding was rechecked and is unchanged.
- Retained independent original mathematics: `reviewer/source-math.md`.
  Retained SHA-256: `20a7e58bc2cbdc868ff43b7061f0d860f64d5b62daf6a7972e405a2b4d137712`.
- Approved modern exercise snapshot referenced by Stage A:
  SHA-256 `aaa9ece85802646032ca3c36d1a6f1b8ca78023f6efbb79b9c6c809df1b57c96`.

The learner projection was opened once in this Stage B run. Its retained
contents, not a second candidate view, were used after continuation. It contains
six questions, all with `mode: single`; all question and option `figure_ids`
are empty. Extra image opens: **0**. No source images were reopened.

Only the permitted learner projection and frozen seed/source-first evidence
were exposed in Stage B. No choice draft, author source-first report, author
keys, rationales, coverage or other author internals were read. Earlier freezes
and candidate files remain unchanged. This report evaluates visible artifacts;
it does not assert anything about unseen author option-generation procedures.

## Visible fidelity assessment, before option solving

The following task, redundancy and leakage assessment preceded the calculation
freeze below. Source identity and conditions are taken from the exact Stage A
seed binding, not from an answer key.

| Visible question | Source number | Preserved task and conditions |
| --- | --- | --- |
| `letter-line` | 74 | Six distinct P, L, A, N, E, T cards; use all cards in a uniformly random full permutation; target the specified word PLANET. |
| `two-ball-order` | 75 | Labels 1 through 5; two sequential draws without replacement; each remaining ball equally likely; strict increase, not necessarily consecutive labels. |
| `full-ball-order` | 76 | The same five labeled balls, but draw all five without replacement; the entire sequence must strictly increase. |
| `four-odd-balls` | 77 | Four distinct balls from five, uniform subsets; all four labels must be odd. The original impossible event is retained. |
| `book-pair-value` | 78 | Ten distinct books; price multiplicities 5, 2, 3 at 4, 3, 1 dollars; two different books, uniform pairs; target total 5 dollars. |
| `irreducible-fraction` | 79 | Exact values 2, 4, 6, 7, 8, 11, 12, 13; two different cards, uniform pairs; ask whether the resulting fraction is irreducible. |

No visible source-task omission or material change was found. All six source
tasks have separate visible questions. The PLANET and dollar substitutions
preserve distinctness, multiplicities and event identity. Positive card values
make the denominator nonzero; numerator orientation does not change
coprimality. The tasks implement the finite equiprobable outcome model bound
in Stage A to actual definition block 2. Price groups, odd/even groups and
fraction values are not substituted for equally likely elementary outcomes.

Redundancy: questions 75 and 76 share an urn but have different draw lengths
and events. Keeping both preserves the original two-ball versus full-sequence
distinction. Questions 74 and 76 both admit permutation counting but target
different original tasks. No duplicate question replaces or crowds out another
source task.

Leakage: none of the visible stems states its computed target probability.
Options are numerical proposed answers without worked reasoning or correctness
markers. Recognizing that question 77 has too few odd labels is solving the
retained impossible-event task, not a leaked answer. Valid elimination by
counting, symmetry or coprimality is not itself a fidelity defect.

Cross-question dependence: no question supplies the result or favorable-outcome
count required by another. Shared numbers and counting concepts do not reveal
another correct selection; each task is independently answerable from its own
stem. Source numbers and the frozen mathematics used for review are not exposed
in the learner projection.

Some stems place list punctuation inside math delimiters. The visible text
still identifies the exact lists unambiguously. This text-only review does not
claim a rendering failure without rendering evidence.

## Independent visible-question and per-option mathematics

Each calculation below solves the displayed task and assesses every displayed
option. The complete true sets are frozen from these calculations, not inferred
from author keys. They agree with the retained original mathematics.

### `letter-line` / source 74

All six distinct cards are used once. There are
`6! = 6 * 5 * 4 * 3 * 2 * 1 = 720` equally likely permutations.
Exactly one reads PLANET, so the probability is `1/720`.

| Option | Display | Independent evidence | Truth |
| --- | --- | --- | --- |
| a | `1/6` | Equals `120/720`; would require 120 favorable permutations, but there is exactly one. | False |
| b | `1/46656` | `46656 = 6^6`, whereas the no-repetition full-permutation space has 720 outcomes. Also `1/46656 != 1/720`. | False |
| c | `1/720` | One specified order divided by all 720 equally likely orders. | True |

Complete true set: **`{c}`**.

### `two-ball-order` / source 75

There are `5 * 4 = 20` equally likely ordered pairs of distinct labels.
The increasing pairs are
`(1,2), (1,3), (1,4), (1,5), (2,3), (2,4), (2,5), (3,4), (3,5), (4,5)`.
Thus there are ten favorable outcomes and the probability is `10/20 = 1/2`.
For example, `(1,5)` is favorable despite not being consecutive.

| Option | Display | Independent evidence | Truth |
| --- | --- | --- | --- |
| a | `2/5` | Equals `8/20`, but the displayed strict-increase event has ten, not eight, favorable pairs. | False |
| b | `1/2` | Equals `10/20`, matching the explicit increasing-pair enumeration. | True |
| c | `1/5` | Equals `4/20`, but ten pairs satisfy strict increase. | False |

Complete true set: **`{b}`**.

### `full-ball-order` / source 76

All `5! = 120` full draw sequences are equally likely. Strict increase through
all five distinct labels requires the unique sequence `(1,2,3,4,5)`.
Its probability is also directly
`(1/5) * (1/4) * (1/3) * (1/2) * 1 = 1/120`.

| Option | Display | Independent evidence | Truth |
| --- | --- | --- | --- |
| a | `1/120` | One favorable full sequence among 120. | True |
| b | `1/16` | Would require `120/16 = 15/2` favorable equally likely sequences, whereas the actual count is one. | False |
| c | `1/5` | Equals `24/120`, whereas only one sequence is increasing. | False |

Complete true set: **`{a}`**.

### `four-odd-balls` / source 77

The odd labels are exactly `1,3,5`, only three distinct balls. Choosing four
distinct balls cannot produce four odd labels. Of the
`C(5,4) = 5` equally likely subsets, none is favorable, so the probability is
`0/5 = 0`. No replacement or altered draw size is used.

| Option | Display | Independent evidence | Truth |
| --- | --- | --- | --- |
| a | `81/625` | Positive (`81 > 0`, `625 > 0`), contradicting the empty favorable event. | False |
| b | `0` | Exactly `0/5`, since there are only three odd balls. | True |
| c | `2/5` | Would require two favorable four-ball subsets; the actual count is zero. | False |

Complete true set: **`{b}`**.

### `book-pair-value` / source 78

Ten distinct books yield `C(10,2) = 45` equally likely pairs.
The only available price combination totaling 5 dollars is `4 + 1`.
It contributes `5 * 3 = 15` distinct book pairs, so the probability is
`15/45 = 1/3`.

As a check, the full price-pair counts are:
`4+4: 10`, `4+3: 10`, `4+1: 15`, `3+3: 1`, `3+1: 6`, `1+1: 3`.
They total 45. Price categories therefore are not equally likely.
Equivalently, ordered distinct-book draws give 90 outcomes and
`5*3 + 3*5 = 30` favorable outcomes.

| Option | Display | Independent evidence | Truth |
| --- | --- | --- | --- |
| a | `1/6` | Equals `15/90`, whereas the ordered space has 30 favorable outcomes. | False |
| b | `2/3` | Equals `60/90` (or `30/45`), twice the actual favorable proportion. | False |
| c | `1/3` | Equals both `15/45` and `30/90`, with the preserved dollar values and book multiplicities. | True |
| d | `3/10` | Equals `27/90`, whereas the actual favorable count is 30. | False |

Complete true set: **`{c}`**.

### `irreducible-fraction` / source 79

There are `C(8,2) = 28` equally likely distinct-card pairs. Irreducibility is
exactly `gcd(x,y) = 1`, independent of numerator orientation.

The five values `2,4,6,8,12` are all even. Their `C(5,2) = 10` pairs
have gcd at least 2 and are all unfavorable.
The other three values are the actual primes `7,11,13`. None divides any
of the five listed even values, so each has gcd 1 with all five.
This gives `3 * 5 = 15` favorable prime-even pairs:

- `7` with each of `2,4,6,8,12`;
- `11` with each of `2,4,6,8,12`;
- `13` with each of `2,4,6,8,12`.

The three pairs `(7,11), (7,13), (11,13)` are also coprime.
The complete favorable count is therefore `15 + 3 = 18`, with
`18 + 10 = 28` accounting for every pair.
Probability: `18/28 = 9/14`.

This reasoning uses the actual list, not the inaccurate general premise that
both entries must be prime: `(4,7)`, for example, is favorable although 4 is
composite.

| Option | Display | Independent evidence | Truth |
| --- | --- | --- | --- |
| a | `9/14` | Equals `18/28`, including all fifteen prime-even and all three prime-prime pairs. | True |
| b | `15/28` | Fifteen is only the prime-even subtotal; the three coprime prime-prime pairs also satisfy the visible task. | False |
| c | `3/14` | Equals `6/28`, whereas the exhaustive favorable count is eighteen. | False |

Complete true set: **`{a}`**.

## Frozen result and cross-question conclusion

| Question | Source number | Full true set | Derived probability |
| --- | --- | --- | --- |
| `letter-line` | 74 | `{c}` | `1/720` |
| `two-ball-order` | 75 | `{b}` | `1/2` |
| `full-ball-order` | 76 | `{a}` | `1/120` |
| `four-odd-balls` | 77 | `{b}` | `0` |
| `book-pair-value` | 78 | `{c}` | `1/3` |
| `irreducible-fraction` | 79 | `{a}` | `9/14` |

Six questions and all nineteen options were assessed. Each full true set is a
singleton, consistent with its visible `single` mode. No equivalent duplicate
correct option, visible mathematical defect, inaccurate premise, ambiguity
affecting the answer, source-task omission, answer leakage or harmful
cross-question redundancy was found.

These are Stage B learner-view findings only. Author keys, rationales and
coverage remain unseen. No internals comparison or candidate edits were
performed; the review stops at this freeze.
