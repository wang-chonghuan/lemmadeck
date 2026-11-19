# Independent Solves Before Alternatives

Author-only, 2026-11-19. Exact checkout:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`, branch
`codex/STEMROBIN-182-textbooks`, observed HEAD
`e16207d939526da0ebb2cfc528f084f0c3791afb`.

The actual durable seed is `source.json`, canonical digest
`7408cddfd1708375927eedd577eed061db345b7befc28caead8e875c72826875`.
It was created by prepare.py from the REAL checkout. All seven originals,
799-805, are copied unchanged. Selected definition blocks are 1, 2, 3, 5, 10,
11, 15. None is a solved example. There are no seed figures. No answer keys,
previous choices, input slots, tests or answer-author/reviewer packages were
read. The only outside seed data are the permitted source-only III captures
and the selected method definitions in the two permitted rule files.

## Task And Response Distinctions

799 requires direct main-table squares and corrected four-digit squares.
800 additionally requires squaring the normalization factor, not merely
moving the decimal in the answer by the input's displacement.
801 requires both directions of decimal scaling and both correction routes.
802 requires rounding the ORIGINAL base before lookup; rounding the square
of the unrounded base is a different operation.
803 requires arithmetic on two squared terms, preserving addition versus
subtraction, not squaring a sum or difference.
804 requires estimates at justified reporting precision; reporting precision
does not determine the exact unknown x or prove a universal error bound.
805 requires solving the actual systems and checking both equations, not
finding a pair that satisfies just one equation.

Supplementary-context.json will hold new view context separately. Captured
strings are primary SOURCE data, not supplied solved answers. Missing main
cells are new mathematically authored reference-grid cells with exact
integer-square derivations. Missing 802 corrections are explicitly new
linear-correction entries, not fake printed cells or fake figures.
No equivalence of the 2010 table edition to the historical table is claimed.

## 799: Direct Main Entries

The authored reference grid uses row N and main digit c for N + 0.01c.
Main entries are exact squares rounded once to four significant figures.
The seven values in a use column 0. Their squares are exact even when the
four-digit spelling includes a trailing zero.

| Original input | Row | Column | Exact square | Main-table spelling |
| --- | --- | --- | --- | --- |
| 1.3 | 1.3 | 0 | 1.69 | 1.690 |
| 4.7 | 4.7 | 0 | 22.09 | 22.09 |
| 2.8 | 2.8 | 0 | 7.84 | 7.840 |
| 5.7 | 5.7 | 0 | 32.49 | 32.49 |
| 8.3 | 8.3 | 0 | 68.89 | 68.89 |
| 7.2 | 7.2 | 0 | 51.84 | 51.84 |
| 9.6 | 9.6 | 0 | 92.16 | 92.16 |
| 2.34 | 2.3 | 4 | 5.4756 | 5.476 |
| 5.12 | 5.1 | 2 | 26.2144 | 26.21 |
| 8.37 | 8.3 | 7 | 70.0569 | 70.06 |
| 9.56 | 9.5 | 6 | 91.3936 | 91.39 |
| 3.04 | 3.0 | 4 | 9.2416 | 9.242 |
| 6.19 | 6.1 | 9 | 38.3161 | 38.32 |

For example, the 2.34 entry has absolute error 0.0004 < 0.0005.
The main-entry half-last-place bound is valid. It must NOT automatically be
extended to corrected entries below.

## 799: Six Independent Correction Calculations

Let u be the last printed decimal place of the main result. Digits d <= 5
use the lower main square plus correction d times u; d > 5 uses the next
main square minus correction (10-d) times u. This is the source III method,
not an assumption that all corrections are added.

| Input | Actual source-only calculation | Table-route result | Exact square |
| --- | --- | --- | --- |
| 1.243 | row 1.2, main 4: 1.538; correction 3: 7; 1.538 + 7(0.001) | 1.545 | 1.545049 |
| 4.325 | row 4.3, main 2: 18.66; correction 5: 5; 18.66 + 5(0.01) | 18.71 | 18.705625 |
| 7.239 | row 7.2, NEXT main 4: 52.42; complement correction 1: 1; 52.42 - 1(0.01) | 52.41 | 52.403121 |
| 8.127 | row 8.1, NEXT main 3: 66.10; complement correction 3: 5; 66.10 - 5(0.01) | 66.05 | 66.048129 |
| 6.571 | row 6.5, main 7: 43.16; correction 1: 1; 43.16 + 1(0.01) | 43.17 | 43.178041 |
| 9.044 | row 9.0, main 4: 81.72; correction 4: 7; 81.72 + 7(0.01) | 81.79 | 81.793936 |

For 7.239, the lower-add route would instead give 52.27 + 13(0.01) =
52.40. For 8.127 it gives 65.93 + 11(0.01) = 66.04. These are NOT the
specified high-digit route even when the difference is only a final unit.
For 6.571, rounding the exact square would give 43.18, not the specified
table result 43.17. This difference is source-bound and must not be repaired
by modifying the original task or substituting an exact-round key.
The corrected result for 7.239 has error 0.006879 > 0.005; the corrected
result for 6.571 has error 0.008041 > 0.005. Main-cell error theorems do not
provide those corrected-result guarantees.

## 800: Eight Correction-And-Scaling Calculations

The base computation for a is 5.243 squared:
row 5.2, main 4 gives 27.46, correction 3 gives 3 in hundredth units.
Thus the normalized result is 27.46 + 0.03 = 27.49.
The four original bases have powers k = 0, 1, 3, -1 respectively in
5.243 times 10^k. Square the factor as 10^(2k).

| Input | Squared factor | Table result | Exact square |
| --- | --- | --- | --- |
| 5.243 | 1 | 27.49 | 27.489049 |
| 52.43 | 100 | 2749 | 2748.9049 |
| 5243 | 1000000 | 27490000 | 27489049 |
| 0.5243 | 0.01 | 0.2749 | 0.27489049 |

The base computation for b is 1.315 squared:
row 1.3, main 1 gives 1.716, correction 5 gives 13 in thousandth units.
Thus 1.716 + 0.013 = 1.729.
The powers k = 0, -1, 2, 4 yield squared factors 1, 10^-2, 10^4, 10^8.

| Input | Squared factor | Table result | Exact square |
| --- | --- | --- | --- |
| 1.315 | 1 | 1.729 | 1.729225 |
| 0.1315 | 0.01 | 0.01729 | 0.01729225 |
| 131.5 | 10000 | 17290 | 17292.25 |
| 13150 | 100000000 | 172900000 | 172922500 |

These are eight original numerical lookups even though only two normalized
main/correction lookups are needed. Shared normalization is a mathematical
reason to use two coherent four-result response units.

## 801: Eight Numerical Values

| Input | Normalization and lookup | Table result | Exact square |
| --- | --- | --- | --- |
| 0.254 | 2.54(10^-1); row 2.5, main 4 = 6.452; factor 10^-2 | 0.06452 | 0.064516 |
| 0.716 | 7.16(10^-1); row 7.1, main 6 = 51.27; factor 10^-2 | 0.5127 | 0.512656 |
| 934 | 9.34(10^2); row 9.3, main 4 = 87.24; factor 10^4 | 872400 | 872356 |
| 61.7 | 6.17(10); row 6.1, main 7 = 38.07; factor 10^2 | 3807 | 3806.89 |
| 0.5892 | 5.892(10^-1); row 5.8, main 9 = 34.69, correction 2 = 2 hundredths; factor 10^-2 | 0.3471 | 0.34715664 |
| 23.41 | 2.341(10); row 2.3, main 4 = 5.476, correction 1 = 5 thousandths; factor 10^2 | 548.1 | 548.0281 |
| 0.06789 | 6.789(10^-2); row 6.7, NEXT main 9 = 46.10, complement correction 1 = 1 hundredth; factor 10^-4 | 0.004609 | 0.0046090521 |
| 987600 | 9.876(10^5); row 9.8, NEXT main 8 = 97.61, complement correction 4 = 8 hundredths; factor 10^10 | 975300000000 | 975353760000 |

Last four exact-round-to-four alternatives are 0.3472, 548.0, 0.004609,
975400000000. They are a DIFFERENT procedure, and three do not match the
III route. Lower-add for the final input would give 97.42 + 12(0.01) =
97.54, likewise not 97.53. A multiple question must not treat a single shared
value as making the entire exact-round vector correct.

## 802: Rounding First

The source explicitly says positive half-up rounding to four significant
figures FIRST. For 41.405 the exact half is rounded to 41.41; this convention
comes from the original 四舍五入, not from a Bradis solved example or an
alleged printed tie policy.

| Original base | Four-significant rounded base | Normalized authored-grid calculation | Table approximation |
| --- | --- | --- | --- |
| 3.1238 | 3.124 | 9.734 + 25(0.001) = 9.759 | 9.759 |
| 0.10058 | 0.1006 | 1.020 - 8(0.001) = 1.012; scale 10^-2 | 0.01012 |
| 41.405 | 41.41 | 17.14 + 1(0.01) = 17.15; scale 10^2 | 1715 |
| 67752 | 67750 | 45.83 + 7(0.01) = 45.90; scale 10^8 | 4590000000 |

Exact squares of the rounded bases are 9.759376, 0.01012036,
1714.7881, 4590062500. Exact squares of the unrounded originals are
9.75812644, 0.0101163364, 1714.374025, 4590333504.
The first step cannot be replaced by taking those latter squares and
rounding them. In particular the first and third results would change.
The four new correction entries have mathematical provenance explicitly
separate from the twelve captured source records.

## 803: Two Exact Arithmetic Tasks

No 查表 or rounding instruction appears in these original tasks.
Preserve the exact mathematical task rather than imposing an unstated
four-figure cutoff.

a: 17.3^2 + 1.64^2 = 299.29 + 2.6896 = 301.9796.
b: 8.14^2 - 3.265^2 = 66.2596 - 10.660225 = 55.599375.
Independently b = (8.14 - 3.265)(8.14 + 3.265)
= 4.875(11.405) = 55.599375.
Square-of-sum gives 18.94^2 = 358.7236, not a.
Square-of-difference gives 4.875^2 = 23.765625, not b.

If a separate view later explicitly requests a four-figure table calculation,
the rounded main/correction components yield a = 299.3 + 2.690 = 301.990
and b = 66.26 - (10.63 + 0.03) = 55.60. This is an APPROXIMATE
supplementary variant, not the original exact task, and is not substituted
for the frozen exact answers in this authoring job.

## 804: Six Estimates And An Accuracy Distinction

Original approximate inputs contain significant digits. The new view will
state the following reporting convention explicitly: square the displayed
estimate without intermediate rounding; make one final positive half-up
round to the same significant-figure count as that estimate. This is
consistent with the source-only general method paraphrase for squares.
It is not an accuracy guarantee or an assertion that x equals its estimate.

| Estimate | Exact square of estimate | Significant figures | Reported squared estimate |
| --- | --- | --- | --- |
| 3.26 | 10.6276 | 3 | 10.6 |
| 0.516 | 0.266256 | 3 | 0.266 |
| 47.8 | 2284.84 | 3 | 2.28 x 10^3 |
| 812 | 659344 | 3 | 6.59 x 10^5 |
| 4.82 x 10^5 | 2.32324 x 10^11 | 3 | 2.32 x 10^11 |
| 1.6 x 10^-4 | 2.56 x 10^-8 | 2 | 2.6 x 10^-8 |

Rounding 47.8^2 to four figures first gives 2285, then three gives 2290.
That double-round result differs from the required single final round
2280. A table-first staging must not be smuggled into the original.

For a rigorous DISTINCT supplemental error question, explicitly assume
812 was nearest-unit positive half-up rounding. Then 811.5 <= x < 812.5.
Squaring is increasing on that interval:
658532.25 <= x^2 < 660156.25.
The reported 659000 has error approaching 1156.25 near the upper end,
not bounded by 500. The chosen count of significant digits is not a proof
that the squared unknown is correct to half a last-place unit.
The exact witness x = 812.4 is inside
the interval, x^2 = 659993.76 and |659993.76 - 659000| = 993.76 > 500.
This concrete exact witness suffices.

## 805: Two Systems, Independent Elimination And Substitution

a: Multiply the first equation by 12:
3(x+y) - 4y = 24, hence 3x-y = 24.
Multiply the second by 5: x+y+5x = 75, hence 6x+y = 75.
Add to get 9x = 99, so x = 11 and y = 9.
Substitution in originals:
(11+9)/4 - 9/3 = 5-3 = 2;
(11+9)/5 + 11 = 4+11 = 15.
The determinant of rows (3,-1) and (6,1) is 9, so this solution is unique.

b: Multiply the first by 15:
5(x-y) + 3x = 120, hence 8x-5y = 120.
Multiply the second by 160:
16x-5y = 320.
Subtract first from second: 8x = 200, hence x = 25 and y = 16.
Substitution:
(25-16)/3 + 25/5 = 3+5 = 8;
25/10 - 16/32 = 2.5-0.5 = 2.
Determinant (8,-5),(16,-5) is 40, nonzero, so the solution is unique.
An initial scratch guess (80,192) satisfies ONLY the second equation;
the independent first-equation check rejected it before this solve freeze.
It is not a correct solution and no external solution package was used.

## Freeze Boundary

No options or draft have been created when this record is frozen.
The SHA receipt will bind this file, source.json and supplementary-context.json
before any option authoring. Frozen source and solve files will not be changed
to make a structural check succeed. Any real subsequent content defect must
retain this first record and use an affected-only addendum with fresh hashes.

All 49 original tasks have independent numerical solutions above. Exactly 18
original correction-and-scaling tasks are 799c (6), 800a/b (8), 801e-h (4).
802 adds four authored-grid corrections while retaining its original bases
and rounding instruction. No source task is deferred. Choice recognition
does not prove unaided production of written calculations or elimination.
Independent review is still required for provenance acceptability, task
fidelity, all option mathematics, leakage, rendering and precision conventions.
