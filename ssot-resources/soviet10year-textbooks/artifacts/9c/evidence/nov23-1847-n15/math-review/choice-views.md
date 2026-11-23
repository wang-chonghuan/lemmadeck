# N15 blind learner-view review

STEMROBIN-184; ana9-c3-s1-n15; 2026-11-23; TEXT-ONLY; finish=review.
Only new disclosure: `.tmp/stemrobin-184-six/n15-nov23-recovery/choices/learner-views.json`.
View SHA-256: `6b37c5888e32784e983b89afabb6d325fb58f26c3f19ad221ae3ae465294fe19`.
Prepared seed SHA-256: `16a8424424383422c83f3e1028faa7e245e646bf5e6cf15f1e7eeab1c85dbd1d`.
Reused source freeze SHA-256: `4b37e257aaafb965f205d7d4f6b961a8592edc4558f59e15f04ea75310ae62ef`.
Task/leakage inspection preceded determination of option truths. No draft, author's source-solutions/report, current answers, internal key, or other undisclosed file was read.

## Task, Coverage and Leakage

- **[P2] Q5/Q6 universal-tail wording needs its canonical-expansion qualification.** Both stems say their digit/enclosure claim holds for all compatible subsequent digits, but neither states the no-eventually-all-nine convention retained in the source binding. Under that convention, each has the single true option C. If arbitrary eventually-all-nine tails are included, both operands can attain their upper endpoint values and invalidate C's strict upper bound; then neither question has a universally true option. This is a domain/wording ambiguity, not an arithmetic error in the frozen bounds. State the canonical convention in the learner-visible context or stems.
- **Coverage gap, Q2 / source 119(d):** every table option contains the identical correct \(\sqrt{11}\) row \(3.3,3.4\). All four cases are displayed, but a correct selection never tests that row or its two endpoints. Other rows discriminate negative truncation, rounding versus lower bounds, and rational-expression errors.
- **Limited discrimination, not wrong mathematics:** Q7 retains nearest rounding and the required terminal zero, but has no distractor dropping the zero as `3.65`. Q8's actual truncations also equal nearest three-place rounding for these two numbers, so successful selection alone cannot distinguish those methods despite the explicit no-rounding instruction.
- **No direct key/answer leakage or duplicate complete options found.** Q4's A/F both expose the same correct \(\sqrt3\) fractional prefix and tenths/hundredths bounds while differing at units. This can help with Q8(a), a genuine cross-question prerequisite dependency; it does not explicitly reveal Q8's complete ordered answer pair. Shared operands already occur in the source exercises, so this is not an invented author-key leak, but the two tasks are not fully independent assessments.
- **Fidelity:** all eight source exercises and their operands are represented; Q4 covers all four complete profiles at units/tenths/hundredths with nonnegative fractional-tail digits. Q3/Q8 use full truncated decimals rather than bare fractional digit strings, preserving the underlying tasks; Q8 explicitly says to keep the integer part. For clarity, Q3 should say “小数点后四位” rather than “小数展开的前四位”. Selected definitions are applied through bounds/precision tasks, not separately exhaustively tested for their abstract quantifiers or existence claims.
- **Redundancy/position observation:** near-matching compound distractors are mathematically distinct, not duplicate answers. After truth determination, all seven single-choice keys lie at B/C (three B, four C); this is a presentation bias, not visible correctness metadata or a proof that an option is true.

## Complete True Sets

`T*` below means true under the seed/source-freeze canonical-expansion convention. Q5/Q6's missing learner-visible qualification is the finding above; under an arbitrary-tail reading their universal true sets are empty.

| Alias | Learner-view ID | Mode / options | Complete true set |
|---|---|---|---|
| Q1 | `n15-bounds-proof` | single / 3 | {B} |
| Q2 | `n15-tenths-table` | single / 4 | {C} |
| Q3 | `n15-nested-prefix` | single / 4 | {C} |
| Q4 | `n15-characteristic-profiles` | multiple / 8 | {B, C, F, H} |
| Q5 | `n15-sum-prefix` | single / 4 | {C}* |
| Q6 | `n15-product-prefix` | single / 4 | {C}* |
| Q7 | `n15-four-significant-sums` | single / 4 | {B} |
| Q8 | `n15-actual-product-digits` | single / 3 | {B} |

## All 34 Option Truths

| View | Option | Truth | Independent reason against the frozen mathematics |
|---|---|---|---|
| Q1 | A | F | Correct square comparison, but lower/upper roles are reversed: 2.7 cannot be the lower bound. |
| Q1 | B | T | Positive monotone squaring gives \(2.6<\sqrt7<2.7\); endpoint gap 0.1 certifies the ordered approximation pair. |
| Q1 | C | F | Squared-value errors 0.24/0.29 are not the errors of the proposed root approximations. |
| Q2 | A | F | Negative row is wrong: \(-1.27<-1.2\); the correct pair is \(-1.3,-1.2\). |
| Q2 | B | F | 0.3 exceeds 0.2664 and 1.2 exceeds \(7/6\); both purported lower bounds fail. |
| Q2 | C | T | All four ordered pairs match the freeze: (0.2,0.3), (-1.3,-1.2), (1.1,1.2), (3.3,3.4). |
| Q2 | D | F | \(2-5/6=7/6\), not a negative number enclosed by (-0.5,-0.4). |
| Q3 | A | F | Chooses the upper integer 36092, not the floor 36091; this is not four-place truncation. |
| Q3 | B | F | Three-place truncation followed by padding loses the known fourth fractional digit 1. |
| Q3 | C | T | \(36091<10^4x<36092\) fixes the integer part of \(10^4x\); truncation is 3.6091. |
| Q3 | D | F | Variability after the fourth fractional digit does not unsettle the already fixed prefix 6091. |
| Q4 | A | F | \(\sqrt3\) has units bounds (1,2), not (2,3); the rest of the profile does not rescue this conjunction. |
| Q4 | B | T | All three negative bound pairs, integer characteristic -4, and nonnegative tail digits 666 match \(-10/3=-4+2/3\). |
| Q4 | C | T | All three pairs and characteristic 0 / tail 214 match \(3/14\). |
| Q4 | D | F | Correct bound pairs and characteristic, but actual nonnegative-tail digits are 267, not rounded 268. |
| Q4 | E | F | Fractional pairs and digits do not match \(3/14=0.214\ldots\); 0.8 is already too large as a lower bound. |
| Q4 | F | T | Units/tenths/hundredths pairs, characteristic 1, and digits 732 match \(\sqrt3\). |
| Q4 | G | F | Uses the whole-number-minus convention incorrectly: characteristic is -4, not -3, and the requested tail is 666, not 333; its lower bounds also exceed \(-10/3\). |
| Q4 | H | T | All pairs and characteristic -2 match; \(2-\sqrt3=0.267\ldots\) gives the requested nonnegative-tail digits. |
| Q5 | A | F | Digits are right, but the interval lies below the frozen minimum 1.9053238. |
| Q5 | B | F | Both the digits 80422 and the enclosure conflict with the frozen sum bounds. |
| Q5 | C | T* | Canonical prefix bounds give \(1.9053238\le x+y<1.9053240\), fixing digits 90532. |
| Q5 | D | F | The displayed enclosure fixes 90532, not 90533; both digit and interval claims must hold. |
| Q6 | A | F | Digit pair 31 is right, but adding only \(10^{-4}\) to the product lower bound is insufficient; admissible tails exceed this upper bound. |
| Q6 | B | F | Neither digits 68 nor this approximately 3.69 enclosure matches the product's frozen bounds. |
| Q6 | C | T* | Canonical positive-factor bounds give \(3.31272708\le xy<3.31309608\), fixing digits 31. |
| Q6 | D | F | The upper bound allows change in only one factor; both positive tails may increase and exceed 3.31288139. |
| Q7 | A | F | 1.747 is truncation, not the explicitly requested nearest four-significant-figure result. |
| Q7 | B | T | Correct nearest results are 1.748 and 3.650, with four significant figures and the terminal zero retained. |
| Q7 | C | F | 1.7475 / 3.6503 have five significant figures (four decimal places), not four significant figures. |
| Q7 | D | F | Second sum rounds to 3.650, not 3.651. |
| Q8 | A | F | Both claimed prefixes disagree with the frozen actual truncations 0.247 / 3.162. |
| Q8 | B | T | Actual three-place truncations are 0.247 and 3.162; the explicit integer-part presentation is satisfied. |
| Q8 | C | F | Moves to upper-unit values 0.248 / 3.163 instead of retaining the actual fractional digits. |

All compound options were judged as whole statements, including every listed profile component and every interval, not merely by a matching numeric substring. Under the canonical convention there are 11 true options and 23 false options, with no extra true option in any single-choice view.
These are independent view-only determinations, not an internal-key comparison. Only this new `math-review/choice-views.md` is authored. No images, shell commands, producer/checker actions, Git/DB/app/env/dependencies, peers, or forbidden answer/author files. Stop after this report; internal comparison remains undisclosed.
