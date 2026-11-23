# N18 Stage A: independent mathematics review

Status: independent source-mathematics review complete for comparison; not an author-solution or publication approval.
Date: 2026-11-23.
Ticket / target: STEMROBIN-184 / ana9-c3-s1-n18.
Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Evidence boundary

The only mathematical inputs are:

- Approved N18-only page-70 text in `ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n18/source70-context.json`. The envelope records source-page JSON SHA-256 `6f597649f82619230e21bcd37e3072367fbe8c2e1539e6622a589e9c95cc4a03`. Page 70 was not reopened as an image, and its unrelated N17 exercises were not inspected.
- Original page-71 PNG SHA-256 `4b95e479cc416ad7ee6ec88bcb889fc6d810c4580f9f979778faef4988926cfb`, independently opened once before reading the prior-page envelope.
- The pre-draft observations frozen in `reviewer/source-first.md`.

No author mathematics, historical page-71 Markdown, answer key, choices, draft lesson, native count or expected total was read. There are no independently confirmed N18 exercise questions in these inputs. The review therefore examines the complete visible N18 exposition; it does not invent exercises or solution obligations.

Image usage remains 1 image in the batch and 1 in context, with no crops or reopens.

## Complete N18 content map

The approved page-70 text introduces the limitations of working only in the rationals, finite-decimal approximation in practice, rational density on the real axis, a lamp metaphor for that density, the presence of irrational points, and a concrete enumeration of rational numbers.

Its last paragraph ends in the middle of `一一对应`. Frozen page-71 A01-A04 completes that paragraph: rational numbers have the same cardinality as natural numbers, whereas any real-number sequence omits a real number. A05-A08 is N18's final historical/reading paragraph.

The section heading `§ 6. 无穷数列·数列的极限` and unit heading `19. 无穷数列` close the N18 scope. The digit, truncation and excess-approximation formulas below them are N19 boundary content, not N18 mathematical tasks.

## Rational numbers, real numbers and finite decimals

The example that rational-only arithmetic lacks an exact square root of 2 is correct. If a reduced fraction p/q with positive denominator satisfied (p/q)^2=2, then p^2=2q^2 forces p even, and substitution forces q even, contradicting reduction.

The statement that not every real-axis point has a rational coordinate is also correct under the usual real-coordinate model; for example the point with coordinate sqrt(2) is excluded from rational coordinates.

Finite decimals provide arbitrarily accurate real-number approximations. For any real x and integer k >= 0, the finite decimal floor(10^k x)/10^k differs from x by less than 10^(-k). This does not mean every real number equals a finite decimal. The source's practical claim must not be rewritten as exact finite-decimal representation of all reals.

This approximation explanation is an independent mathematical check, not a source formula added to the frozen transcription.

## Density and the closed-interval qualification

For u < v, choose k with 10^k(v-u) > 1 and put p=floor(10^k u)+1. Then

```text
u < p/10^k <= u+1/10^k < v.
```

Thus even the finite decimals, a subset of the rationals, meet every nonempty open interval. Every nondegenerate closed interval also contains rational points. There are infinitely many: apply the same argument inside infinitely many disjoint open subintervals of (u,v).

**Source wording qualification:** the approved page-70 text literally says `在坐标轴的任何闭区间上，至少存在一个有理点（也就是说存在无限多个有理点）`. This is correct for a closed interval with distinct endpoints. Taken literally to include a singleton closed interval, it is false: `[sqrt(2),sqrt(2)]` contains no rational point, and `[0,0]` contains only one.

The parenthetical infinite-point assertion requires the same nondegeneracy condition. The report flags this missing condition; it does not edit the approved source, register an erratum, or approve a modern correction. It is a wording issue in the supplied prior-page text, not a new page-71 printing defect.

The lamp passage is an illustration of there being no open interval devoid of rational points. It must not be used to claim that all real points are rational or that density determines cardinality.

Irrational points also occur in every nonempty open interval: choose a rational r in (u-sqrt(2),v-sqrt(2)); then r+sqrt(2) is irrational and lies in (u,v). Repeating in disjoint subintervals gives infinitely many irrational points. This validates the contrast in the source without importing an exercise or a figure.

## Independent check of the rational enumeration

The source orders reduced fractions p/q by increasing |p|+q and, for a fixed sum, increasing numerator p.

The mathematical verification uses the usual canonical rational representation: p is an integer, q is a positive integer, gcd(|p|,q)=1, and zero is represented by 0/1. The positive-denominator convention is necessary for the argument and is not presented here as an additional line printed on page 70.

Recomputing the first groups from that rule gives:

| Height | Fractions in increasing numerator order |
|---|---|
| 1 | 0/1 |
| 2 | -1/1, 1/1 |
| 3 | -2/1, -1/2, 1/2, 2/1 |
| 4 | -3/1, -1/3, 1/3, 3/1 |
| 5 | -4/1, -3/2, -2/3, -1/4, 1/4, 2/3, 3/2, 4/1 |
| 6, visible prefix | -5/1, -1/5, ... |

These groups match the supplied two printed formula rows, including the transition from -4/1 at the end of the first row to -3/2 at the start of the next. Nonreduced fractions such as -2/2 are correctly absent. No omission or ordering defect was found in the supplied prefix.

For every height h there are finitely many eligible pairs. Every rational number's canonical pair has some finite height, so it appears after finitely many preceding groups. Unique reduced positive-denominator representation prevents duplicates. The listed set is infinite, hence its enumeration gives a bijection with the positive integers.

The convention of whether a natural-number set begins at 0 or 1 does not change this cardinality conclusion. The sequence indexing in the source starts with r_1, which is compatible with the positive-integer enumeration.

## Independent check of real-number nonenumerability

Frozen page-71 A03-A04 says that for any real-number sequence (x_1,x_2,...,x_n,...), a real x outside the sequence can be found. This statement is correct, including sequences with repetitions.

A proof must address the ambiguity 0.4999...=0.5000.... Here is an independent construction that does:

1. For each n with x_n in [0,1), choose its decimal expansion that is not eventually all 9s, using trailing zeros for terminating expansions. Let d_n be its nth fractional digit. For x_n outside [0,1), define d_n=0 merely to complete the construction.
2. Set b_n=2 when d_n=1, and b_n=1 otherwise.
3. Let y=0.b_1b_2b_3.... Its digits are exclusively 1 and 2, so 0<y<1 and its expansion is neither eventually all zeros nor eventually all 9s.
4. If x_n is in [0,1), the nth chosen digit differs from b_n; uniqueness under the chosen expansion convention ensures y != x_n. If x_n is outside [0,1), y != x_n by location.

Therefore y is a real number omitted by every entry of the arbitrary supplied sequence. This verifies the source theorem without consulting an author solution and without silently relying on a flawed digit-only comparison.

The proof is review reasoning, not a claim that this construction is visibly printed on page 71.

## Meaning of irrational points being "more numerous"

The approved text's qualified phrase `从某种意义上说，无理点甚至“多于”有理点` is mathematically justified when that meaning is cardinality.

The rationals are countably infinite by the verified enumeration. The reals are uncountable by the verified diagonal argument. If the irrational numbers were countable, combining their enumeration with a rational enumeration would enumerate all real numbers, a contradiction. Thus the irrationals are uncountable and cannot be put in one-to-one correspondence with the naturals.

This contrast concerns cardinality, not visual spacing, a larger finite count on an axis, or one of the sets failing to be dense. Both rational and irrational points are dense.

## Historical paragraph and N19 isolation

Page-71 A02 attributes the nonenumerability result to Cantor in 1874. A05-A08 gives historical motivation and a reading recommendation. This offline mathematics review preserves those printed literals; it does not independently establish historical chronology from external sources.

The visible N19 formulas are frozen in `source-first.md`. In particular its G01/G02 `m` versus `n` uncertainties are not resolved by guessing that truncation formulas should use an nth digit and 10^n. No replacement N19 formula, answer, exercise, or source erratum is produced here. N19's final printed sentence remains open beyond this page.

## Stage A findings

- N18's supplied rational enumeration prefix and its equal-cardinality conclusion are mathematically sound under the standard reduced positive-denominator convention.
- The real-number nonenumerability assertion is sound; an independently constructed diagonal argument was checked with the decimal-representation ambiguity handled.
- The density and irrational-cardinality discussion is sound with the meanings and interval condition stated above.
- The phrase `任何闭区间` needs a nondegeneracy qualification if read as a precise universal mathematical assertion. It remains unchanged in the source evidence.
- No N18 exercise or instructional figure has been confirmed; none is invented, counted or solved.
- N18 closes before the §6 heading. New page-71 N19 formulas retain their ink readings and explicit ambiguity rather than inferred mathematical corrections.

Only the two owned reviewer reports have been created. No source finalization or rewrite, figure generation, application/dependency/environment access, Git/database/network action, or contact with another agent was performed. Stage A ends here, awaiting the parent's historical-source comparison.
