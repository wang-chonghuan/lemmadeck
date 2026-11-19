# n38 Independent CHOICE Review: Stage1 Source Solves

Date: 2026-11-19. Reviewer: fresh independent CHOICE reviewer, n38.
Ticket: STEMROBIN-182. Mode: authorized offline, Stage1 ONLY.
Checkout: /Users/yong/.codex/worktrees/d9b1/lemmadeck.
Branch: codex/STEMROBIN-182-textbooks.
Observed HEAD: e16207d939526da0ebb2cfc528f084f0c3791afb.

## Snapshot And Boundary

Original tool-prepared seed:
`.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n38-choice-author/source.json`.
Byte SHA-256:
`77bf17157ed5f78d99c9fe777a8ee7780bf133aaa08bbdffbfeea351e282df37`.
Contract canonical seed SHA-256:
`7408cddfd1708375927eedd577eed061db345b7befc28caead8e875c72826875`.
Exercises 799-805; concept blocks 1,2,3,5,10,11,15; figures [].

This record was independently derived before receiving any VIEW packet. It is
not a complete `s10y-choice-review-v1`: draft binding, fidelity, coverage,
redundancy, leakage, options, keys and final verdict are deferred to their proper
stages. No such judgment is inferred here. No new convention or supplemental
cell is prohibited merely because it is absent from this initial seed.

Source inputs were the unchanged seed, capture-33..40.json, and the two expressly
allowed rules files. Referenced PDFs/images, upstream lesson files, earlier
reviews and author products were NOT opened. Capture provenance is textual
primary-cell evidence supplied by another reviewer, not my own pixel inspection.
Image opens: 0.

## Mathematical Conventions

`M(row,column)` denotes an actual III main-cell value; `C(row,digit)` an actual
III correction integer. A correction integer is multiplied by the last-place
unit of the selected main value, not by a universal fixed decimal.

For normalized coefficient `m` in [1,10), write `x=m*10^k`, so
`x^2=m^2*10^(2k)`. Three significant coefficient digits use the main cell.
For fourth digit d<=5, ADD C(row,d) to the lower main cell. For d>5, use the
NEXT main coefficient and SUBTRACT C(row,10-d). The III instruction is explicit;
IV's additive examples do not replace it.

`R4` below is direct mathematical rounding to four significant digits, retaining
trailing significant zeroes. It is NOT a claim to have read a printed cell.
Directly rounded main values have the seed block10 half-last-place property.
Corrected values do not inherit that guarantee and need not equal direct R4.
Printed correction integers are row-based rounded approximations, not exact
per-argument increments.

Codes:

- P: result derived by applying the required operation to captured printed cells.
- D: derived main-cell reference using the stated four-figure rounding rule;
  no literal main-cell transcription for that address is in the allowed packet.
- U: the required correction integer is unavailable; symbolic table result and
  exact mathematical reference are solved, but no actual printed-route result
  is asserted.
- E: exact algebra from source prose, with no table premise.

## 799: Nineteen Squares

The source explicitly requires table use, not unrestricted exact multiplication.
All a/b tasks are direct main lookups; c tasks require actual corrections.

| Task | Input | Exact Mathematical Square | Direct R4 | III Route And Result |
| --- | --- | --- | --- | --- |
| 799.a1 | 1.3 | 1.69 | 1.690 | D: M(1.3,0), derived 1.690 |
| 799.a2 | 4.7 | 22.09 | 22.09 | D: M(4.7,0), derived 22.09 |
| 799.a3 | 2.8 | 7.84 | 7.840 | D: M(2.8,0), derived 7.840 |
| 799.a4 | 5.7 | 32.49 | 32.49 | D: M(5.7,0), derived 32.49 |
| 799.a5 | 8.3 | 68.89 | 68.89 | D: M(8.3,0), derived 68.89 |
| 799.a6 | 7.2 | 51.84 | 51.84 | D: M(7.2,0), derived 51.84 |
| 799.a7 | 9.6 | 92.16 | 92.16 | D: M(9.6,0), derived 92.16 |
| 799.b1 | 2.34 | 5.4756 | 5.476 | P: M(2.3,4)=5.476, capture33 record3 |
| 799.b2 | 5.12 | 26.2144 | 26.21 | D: M(5.1,2), derived 26.21 |
| 799.b3 | 8.37 | 70.0569 | 70.06 | D: M(8.3,7), derived 70.06 |
| 799.b4 | 9.56 | 91.3936 | 91.39 | D: M(9.5,6), derived 91.39 |
| 799.b5 | 3.04 | 9.2416 | 9.242 | D: M(3.0,4), derived 9.242 |
| 799.b6 | 6.19 | 38.3161 | 38.32 | D: M(6.1,9), derived 38.32 |
| 799.c1 | 1.243 | 1.545049 | 1.545 | P: 1.538+7*0.001=1.545 |
| 799.c2 | 4.325 | 18.705625 | 18.71 | P: 18.66+5*0.01=18.71 |
| 799.c3 | 7.239 | 52.403121 | 52.40 | P: NEXT 52.42-1*0.01=52.41; not direct R4 |
| 799.c4 | 8.127 | 66.048129 | 66.05 | P: NEXT 66.10-5*0.01=66.05 |
| 799.c5 | 6.571 | 43.178041 | 43.18 | P: 43.16+1*0.01=43.17; not direct R4 |
| 799.c6 | 9.044 | 81.793936 | 81.79 | P: 81.72+7*0.01=81.79 |

## 800: Eight Squares And Squared Scaling

Every task retains an actual correction operation even when the normalized
coefficient is shared. Sharing a base computation does not silently omit the
four distinct scaling judgments in either group.

| Task | Input | Exact Mathematical Square | Direct R4 | III Route And Result |
| --- | --- | --- | --- | --- |
| 800.a1 | 5.243 | 27.489049 | 27.49 | P: (27.46+3*0.01)*10^0=27.49 |
| 800.a2 | 52.43 | 2748.9049 | 2749 | P: (27.46+3*0.01)*10^2=2749 |
| 800.a3 | 5243 | 27489049 | 2.749e7 | P: (27.46+3*0.01)*10^6=2.749e7 |
| 800.a4 | 0.5243 | 0.27489049 | 0.2749 | P: (27.46+3*0.01)*10^-2=0.2749 |
| 800.b1 | 1.315 | 1.729225 | 1.729 | P: (1.716+13*0.001)*10^0=1.729 |
| 800.b2 | 0.1315 | 0.01729225 | 0.01729 | P: (1.716+13*0.001)*10^-2=0.01729 |
| 800.b3 | 131.5 | 17292.25 | 1.729e4 | P: (1.716+13*0.001)*10^4=1.729e4 |
| 800.b4 | 13150 | 172922500 | 1.729e8 | P: (1.716+13*0.001)*10^8=1.729e8 |

## 801: Eight Squares

Normalization exponents must be squared, including the very small and very
large inputs. In particular, corrected route outputs in e/f/h differ from
direct exact-square rounding and must not be silently replaced by it.

| Task | Input | Exact Mathematical Square | Direct R4 | III Route And Result |
| --- | --- | --- | --- | --- |
| 801.a | 0.254 | 0.064516 | 0.06452 | D: M(2.5,4)*10^-2, derived 6.452*10^-2 |
| 801.b | 0.716 | 0.512656 | 0.5127 | D: M(7.1,6)*10^-2, derived 51.27*10^-2 |
| 801.c | 934 | 872356 | 8.724e5 | D: M(9.3,4)*10^4, derived 87.24*10^4 |
| 801.d | 61.7 | 3806.89 | 3807 | D: M(6.1,7)*10^2, derived 38.07*10^2 |
| 801.e | 0.5892 | 0.34715664 | 0.3472 | P: (34.69+2*0.01)*10^-2=0.3471 |
| 801.f | 23.41 | 548.0281 | 548.0 | P: (5.476+5*0.001)*10^2=548.1 |
| 801.g | 0.06789 | 0.0046090521 | 0.004609 | P: NEXT (46.10-1*0.01)*10^-4=0.004609 |
| 801.h | 987600 | 975353760000 | 9.754e11 | P: NEXT (97.61-8*0.01)*10^10=9.753e11 |

## Eighteen Fully Captured Correction Operations

Record numbers are zero-based positions in `records_in_request_address_order`.
Only the selected address's printed main, next-main and correction strings are
used; an `id` or `key` is a locator, never an answer authority.

| Operation | Capture And Record | Normalized Coefficient | Selected Main Coefficient | Main | Unit | Digit | Sign | Integer | Scale | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 799.c1 | 33:0 | 1.243 | 1.24 | 1.538 | 0.001 | 3 | ADD | 7 | 0 | 1.545 |
| 799.c2 | 33:1 | 4.325 | 4.32 | 18.66 | 0.01 | 5 | ADD | 5 | 0 | 18.71 |
| 799.c3 | 34:0 | 7.239 | 7.24 | 52.42 | 0.01 | 1 | SUBTRACT | 1 | 0 | 52.41 |
| 799.c4 | 34:1 | 8.127 | 8.13 | 66.10 | 0.01 | 3 | SUBTRACT | 5 | 0 | 66.05 |
| 799.c5 | 34:2 | 6.571 | 6.57 | 43.16 | 0.01 | 1 | ADD | 1 | 0 | 43.17 |
| 799.c6 | 35:0 | 9.044 | 9.04 | 81.72 | 0.01 | 4 | ADD | 7 | 0 | 81.79 |
| 800.a1 | 34:3 | 5.243 | 5.24 | 27.46 | 0.01 | 3 | ADD | 3 | 0 | 27.49 |
| 800.a2 | 34:3 | 5.243 | 5.24 | 27.46 | 0.01 | 3 | ADD | 3 | 2 | 2749 |
| 800.a3 | 34:3 | 5.243 | 5.24 | 27.46 | 0.01 | 3 | ADD | 3 | 6 | 2.749e7 |
| 800.a4 | 34:3 | 5.243 | 5.24 | 27.46 | 0.01 | 3 | ADD | 3 | -2 | 0.2749 |
| 800.b1 | 33:2 | 1.315 | 1.31 | 1.716 | 0.001 | 5 | ADD | 13 | 0 | 1.729 |
| 800.b2 | 33:2 | 1.315 | 1.31 | 1.716 | 0.001 | 5 | ADD | 13 | -2 | 0.01729 |
| 800.b3 | 33:2 | 1.315 | 1.31 | 1.716 | 0.001 | 5 | ADD | 13 | 4 | 1.729e4 |
| 800.b4 | 33:2 | 1.315 | 1.31 | 1.716 | 0.001 | 5 | ADD | 13 | 8 | 1.729e8 |
| 801.e | 34:4 | 5.892 | 5.89 | 34.69 | 0.01 | 2 | ADD | 2 | -2 | 0.3471 |
| 801.f | 33:3 | 2.341 | 2.34 | 5.476 | 0.001 | 1 | ADD | 5 | 2 | 548.1 |
| 801.g | 34:5 | 6.789 | 6.79 | 46.10 | 0.01 | 1 | SUBTRACT | 1 | -4 | 0.004609 |
| 801.h | 35:1 | 9.876 | 9.88 | 97.61 | 0.01 | 4 | SUBTRACT | 8 | 10 | 9.753e11 |

The 18 operations cover 12 distinct normalized coefficients: 6+2+4.
There are 14 ADD and 4 next-entry SUBTRACT operations. Disagreements from direct
R4 occur in exactly 799.c3,799.c5,801.e,801.f,801.h.

## 802: Four Input-Rounding-Then-Squaring Tasks

The explicit source rounding instruction supplies positive half-up
preprocessing for c: 41.405 -> 41.41, NOT 41.40. Squaring the original unrounded
input changes the task. The exact-square column squares the required rounded
input, not the original. These four corrections have no captured printed cells.

| Task | Input And Required Rounded Input | Exact Mathematical Square | Direct R4 | III Route And Result |
| --- | --- | --- | --- | --- |
| 802.a | 3.1238 -> 3.124 | 9.759376 | 9.759 | U: M(3.1,2)+0.001*C(3.1-upper,4); derived main 9.734 |
| 802.b | 0.10058 -> 0.1006 | 0.01012036 | 0.01012 | U: NEXT [M(1.0,1)-0.001*C(1.0,4)]*10^-2; derived main 1.020 |
| 802.c | 41.405 -> 41.41 | 1714.7881 | 1715 | U: [M(4.1,4)+0.01*C(4.1,1)]*10^2; derived main 17.14 |
| 802.d | 67752 -> 67750 | 4590062500 | 4.590e9 | U: [M(6.7,7)+0.01*C(6.7,5)]*10^8; derived main 45.83 |

The row3.1 main coefficient 3.12 is on the upper physical line: its square is
below 10 and its correction unit is 0.001. Do not borrow the lower line's
hundredth-unit corrections. The b route is high-digit SUBTRACT after rounding.

As derived mathematical comparisons only, rounding the exact increments to
these units gives integers 25,8,1,7 respectively, and conditional route outputs
9.759,0.01012,1715,4.590e9. That construction is not the captured table's
row-average construction and does NOT authenticate those printed integers.
The symbolic results remain U until the missing premise is supplied.

For contrast, squares of the four ORIGINAL inputs are respectively
9.75812644,0.0101163364,1714.374025,4590333504. They are not 802's requested
post-preprocessing squares.

## 803: Two Compound Calculations

| Task | Input Expression | Exact Mathematical Value | Direct R4 | III Route And Result |
| --- | --- | --- | --- | --- |
| 803.a | 17.3^2+1.64^2 | 301.9796 | 302.0 | D: 100*M(1.7,3)+M(1.6,4), derived 299.3+2.690=301.990 |
| 803.b | 8.14^2-3.265^2 | 55.599375 | 55.60 | U: M(8.1,4)-[M(3.2,6)+0.01*C(3.2,5)], derived 55.63-0.01*C(3.2,5) |

a exact calculation: 299.29+2.6896=301.9796.
b exact calculation: 66.2596-10.660225=55.599375.
The b fourth digit is 5, so the required route is lower ADD, not next SUBTRACT.
If a newly stated derived correction were 3, b's assembled table result would
be 66.26-(10.63+0.03)=55.60. The actual C(3.2,5) is unavailable in Stage1.

The seed does not explicitly select a final output precision for 803, or mark
the operands as approximate data. Do not infer that notation alone fixes the
precision of true inputs. Table-assembled 301.990, its R4 value 302.0, and its
possible three-significant final value 302 are distinguishable stages. The
secondary reserve-digit guidance does not itself specify every mixed-operation
stage or a requested final count. This is a local context gap, not a verdict
against a later visibly specified convention.

## 804: Six Approximate-Input Squares

Here the source DOES mark x approximate and all its displayed digits significant.
The exact-square column is the square of the displayed approximation, not a
claim about the unknown true x^2.

The allowed method-rules file's G3-G7 summary states the approximate-square
significant-figure rule and one reserve digit for intermediate work, but labels
that summary secondary, not reobserved. Apply that distinction honestly:
a-e have three significant input digits; f has two. Do not promote the
four-significant main table's precision into more measured input accuracy.

| Task | Displayed Approximation | Square Of Displayed Approximation | Direct R4 | Precision And Table Judgment |
| --- | --- | --- | --- | --- |
| 804.a | 3.26 | 10.6276 | 10.63 | D main M(3.2,6); direct/table final R3=10.6 |
| 804.b | 0.516 | 0.266256 | 0.2663 | D main M(5.1,6)*10^-2; direct/table final R3=0.266 |
| 804.c | 47.8 | 2284.84 | 2285 | D main M(4.7,8)*10^2; direct final R3=2.28e3; table-half-up R3=2.29e3 |
| 804.d | 812 | 659344 | 6.593e5 | P main M(8.1,2)=65.93, capture34 record1; *10^4; final R3=6.59e5 |
| 804.e | 4.82e5 | 232324000000 | 2.323e11 | D main M(4.8,2)*10^10; direct/table final R3=2.32e11 |
| 804.f | 1.6e-4 | 0.0000000256 | 2.560e-8 | D main M(1.6,0)*10^-8; direct/table final R2=2.6e-8 |

804.c is a real double-rounding distinction: exact 2284.84 is below the
three-significant halfway value 2285, but its four-significant table reference
is exactly 2285. A half-up final step on that table value gives 2290; ties-to-even
on the same table value gives 2280. The allowed method capture reports no
explicit general exact-half policy. The original 802 preprocessing instruction
is explicit for its own task; it does not by itself choose 804's intermediate
and final policy. Record both mathematical routes, not a final authoring verdict.
A later visibly authored final-rounding/staging convention can settle the view.

The precision rules are not guaranteed uncertainty bounds. No exact interval
for the true x^2, or guarantee that its last digit is correct, is inferred.

## 805: Two Exact Linear Systems

| Task | Input | Exact Solution | Direct R4 | Independent Derivation |
| --- | --- | --- | --- | --- |
| 805.a | (x+y)/4-y/3=2; (x+y)/5+x=15 | x=11,y=9 | Not applicable | E: 3x-y=24, 6x+y=75; 9x=99 |
| 805.b | (x-y)/3+x/5=8; x/10-y/32=2 | x=25,y=16 | Not applicable | E: 8x-5y=120, 16x-5y=320; 8x=200 |

Both systems have nonzero coefficient determinants and unique solutions.
a substitution: 20/4-9/3=2, and 20/5+11=15.
b substitution: 9/3+25/5=8, and 25/10-16/32=2.
Each system is one original mathematical task with two jointly constrained
unknowns; merely treating its coordinates as independent copied slots loses
the system-solving relation. This is a source requirement, not a judgment on
any unseen choice unit.

## Stage1 Accounting

49 original tasks independently addressed:
799=19,800=8,801=8,802=4,803=2,804=6,805=2.
47 numerical tasks have exact mathematical references; 805's two systems have
exact solved pairs and substitution checks.

18 requested, fully captured correction operations were actually applied,
including all eight scaled tasks in 800. Five additional source-implied
correction operations (802a-d and803b) have fully derived normalization,
direction, units and symbolic expressions, but unavailable actual integers.
Thus the source implies 23 correction occurrences overall; the requested 18
captured occurrences must not erase these five contextual operations.

There are 28 distinct uncaptured required main-cell addresses and five distinct
uncaptured correction addresses. Main references can be computed under the
stated rounding rule, but are labelled D, not P. The actual corrections cannot
be authenticated from exact squares, row averages or other table IV cells.

Fidelity, redundancy, leakage, draft coverage and option truth are NOT reviewed.
No VIEW, key or author internal reasoning was received or accessed.
Stage1 is complete as an independent source-solving/evidence freeze, not as a
final semantic approval. Stop here for explicit Stage2 authorization.
