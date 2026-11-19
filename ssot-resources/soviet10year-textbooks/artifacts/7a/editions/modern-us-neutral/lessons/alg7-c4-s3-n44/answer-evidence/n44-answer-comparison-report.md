# N44 Independent Written-Answer Candidate Comparison

Verdict: MATCH for all 15 originals, all 64 source subparts and all 120
exercise atomic tasks. Issue units: 0. No missing answer, mathematical
mismatch, requested-method omission or cultural/notation defect was found.
This is a content comparison of the specified draft, not a production,
runtime, finalization, publication or choice-review verdict.

## Frozen Authority And Exact Inputs

All paths below are relative to
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

| Input | SHA-256 |
| --- | --- |
| `n44-answer-review/results0444.json` | `c7e9f81171681735de1bc0eada9a43bc24ccac3744f49a5505837399133bb94e` |
| `n44-answer-review/source-solutions.json` | `73d9a4beedd992344673afe97d87eb1eddad6a21d0843e3e3c80420d8da7c89d` |
| `n44-answer-review/report.md` | `7684a5586f0b01d501275a8866e3d045e138b20ba7928e49631b74f5c0d25208` |
| `n44-answer-review/method-obligations.json` | `5e7943183dae6b1ef809d61c1303d331e54d300dbcbe169cd6ae27959c1e468b` |
| `n44-answer-review/coverage.json` | `fc15fa0bcd3c4c3924b929e51508adc8e222b6ab812e316b518abcebf5fc3070` |
| `n44-answer-review/input-hashes.json` | `f505eba1e71016e6502e2bfd3c044c8715de3eef19525e0ab142060d2e14df93` |
| `n44-answer-review/freeze.json` | `d913ed8e51d0ea7b309dd803dae460dc82cd241b3eccba79504fd0345760cefd` |
| `n44-answer-comparison/reuse-input-acknowledgement.json` | `921ae5e7b31f391952c1cb7c634d9af7764c3a6b7db5f3e613a86f889531412d` |
| `n44-answer-author/FINAL/answer-keys.json` | `d1f846dc8eb37ccbceb933fdb2b290d7f8d86ae309b32d0cfb593089430d7ac6` |
| `n44-answer-author/FINAL/answer-methods.md` | `f8bfb909cacbb3562036060202f3bb0fcd655f547c01bd0f7e0a7bb97c2408b5` |
| `n44-answer-author/FINAL/evidence-inputs.json` | `96ce382ce1829f1155534e23d497b53da915eb88fd4e2e0bc5ac6840ed429847` |
| `n44-answer-author/FINAL/same-book-source-cells.json` (hash only) | `c4f526083b47071c21c9e6ed98f782f2cfb2204e1a5933aea49e148ebb3b54b8` |
| Durable modern `exercises.json` | `3ce1d1c18854e9be5b485ea4a2ee43b72c141bc30a84ead690b7b2c9c4317ec0` |
| Answer gate | `9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9` |
| Production-resume | `8d489fdcdd1a00866e951958009f6c8602e6b970108f8e7fc87368c3197b6a58` |

The abbreviated `n44-*` paths are under
`.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/`.
The durable file is
`ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s3-n44/exercises.json`.
The gate and resume files are respectively
`.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md`
and `.claude/skills/ld-s10y-lesson/references/production-resume.md`.

The inherited result hash and its bound files were read and matched first.
The original 132-task Stage1 completion (120 exercise tasks plus 12 lesson
tasks) was already frozen before keys. This comparison reuses it without
re-solving anything. The reuse acknowledgement was written, sealed 0444 and
hashed before any author candidate content access. Durable modern exercises
match the inherited input bytes. The 12 lesson tasks are inherited context,
not counted again as candidate-answer tasks.

`answer-methods.md` and its stable `evidence-inputs.json` references were read.
The latter is a provenance manifest, not independent mathematical authority.
Its referenced author calculations, choice files, validator, profile, images
and source capture were not opened or executed. The same-book cell filename
was hashed only; table content authority remains the frozen reviewer solutions
and method obligations. No live ticket access was attempted because the direct
human request expressly excludes network access and supplies the approved
read-only contract.

## Per-Original Comparison

Each candidate location is `answer-keys.json#/answers/I/displayAnswer`;
each independent location is `source-solutions.json#/exercises/I`.
Indices I=0..14 follow originals 858..872. Every expected value below is
reused from that frozen independent record and matches the candidate; root
sets are unordered. Every displayed intermediate, definition and method was
also compared, not only the terminal answer.

### 858 / Key 0: MATCH, 24/24 Tasks

All eight `(a,b,c); D; distinct-real-root-count` rows match:

- a: `(2,3,1); 1; 2`.
- b: `(3,7,2); 25; 2`.
- c: `(2,1,1); -7; 0`.
- d: `(4,4,1); 0; 1`.
- e: `(1,5,-6); 49; 2`.
- f: `(1,2,2); -4; 0`.
- g: `(9,-6,1); 0; 1`.
- h: `(4,-7,-2); 81; 2`.

Every displayed discriminant substitution matches. The D<0/D=0/D>0
classification is correct for these nonzero leading coefficients. The
candidate explicitly counts a repeated quadratic root as one distinct value.

### 859 / Key 1: MATCH, 20/20 Tasks

All ten requested formula substitutions and complete root sets match:

- a: D=1, `x=(7 +/- 1)/6`, `{1,4/3}`.
- b: D=4, `x=(8 +/- 2)/10`, `{3/5,1}`.
- c: D=1, `x=(13 +/- 1)/6`, `{2,7/3}`.
- d: D=9, `y=(9 +/- 3)/4`, `{3/2,3}`.
- e: D=16, `y=(6 +/- 4)/10`, `{1/5,1}`.
- f: D=529=23^2, `x=(1 +/- 23)/8`, `{-11/4,3}`.
- g: D=64, `z=(-32 +/- 8)/6`, `{-20/3,-4}`.
- h: D=289=17^2, `x=(-7 +/- 17)/2`, `{-12,5}`.
- i: D=196=14^2, `y=(10 +/- 14)/2`, `{-2,12}`.
- j: D=361=19^2, `p=(-1 +/- 19)/2`, `{-10,9}`.

The general formula states a!=0 and both signs. Generic u in that formula
does not replace any actual part variable. No requested formula method is
replaced by factorization or bare roots.

### 860 / Key 2: MATCH, 8/8 Tasks

All conversions, supporting discriminants and roots match:

- a: `5x^2-9x-2=0`, D=121, `{-1/5,2}`.
- b: `x^2+5x-14=0`, D=81, `{-7,2}`; sign reversal is preserved.
- c: `x^2+6x+9=(x+3)^2=0`, D=0, sole root -3.
- d: `z^2-z-20=0`, D=81, `{-4,5}`.
- e: `y^2-52y+576=0`, D=400, `{16,36}`.
- f: `15y^2-22y-37=0`, D=2704=52^2, `{-1,37/15}`.
- g: `25p^2-10p+1=(5p-1)^2=0`, D=0, sole root 1/5.
- h: `2x^2+9x-486=0`, D=3969=63^2, `{-18,27/2}`.

Formula arithmetic, actual variables and one-value repeated-root sets match.

### 861 / Key 3: MATCH, 8/8 Tasks

All four explicit expansions, zero forms and complete roots match:

- a: `x^2+8x+16-3x-40=0` -> `x^2+5x-24=0`, D=121, `{-8,3}`.
- b: `4x^2-12x+9-11x+19=0` -> `4x^2-23x+28=0`, D=81, `{7/4,4}`.
- c: `x^2+2x+1-7918+2x=0` -> `x^2+4x-7917=0`, D=31684=178^2, `{-91,87}`.
- d: `x^2+4x+4-3131+2x=0` -> `x^2+6x-3127=0`, D=12544=112^2, `{-59,53}`.

Both large-integer roots in c and d and all formula signs are present.

### 862 / Key 4: MATCH, 12/12 Tasks, 4/4 Actual Methods

The inherited table is physical346/printed340, natural numbers 1 through 99,
with printed tens-row and units-column labels. Candidate printed-page and
address descriptions agree with the frozen actual source, not an external
table or invented historical rounding convention.

| Part | Exact route | Actual N; row/column; literal | Candidate table arithmetic, both signs | Final 0.01 |
| --- | --- | --- | --- | --- |
| a | D=21, `x=(1 +/- sqrt(21))/10` | 21; 2/1; 4.583 | 0.5583, -0.3583 | -0.36, 0.56 |
| b | D=17, `x=(-7 +/- sqrt(17))/4` | 17; 1/7; 4.123 | -0.71925, -2.78075 | -2.78, -0.72 |
| c | `3y^2-y-6=0`, D=73, `y=(1 +/- sqrt(73))/6` | 73; 7/3; 8.544 | 1.590666..., -1.257333... | -1.26, 1.59 |
| d | `y^2+8y-11=0`, D=108, D/4=27, `y=-4 +/- sqrt(27)` | 27; 2/7; 5.196 | 1.196, -9.196 | -9.20, 1.20 |

Exact radical pairs, transformed equations, intermediate signs and all eight
final roots agree. In d the 108 discriminant is reduced to radicand 27; no
nonexistent 108 table lookup is claimed. Final trailing zeros are retained.
Approximation signs distinguish numerical roots from exact radical formulas.

The candidate's four positive square brackets agree with the frozen
integer-square proof: endpoints for 21 are 9165/2000 and 9167/2000; for 17,
8245/2000 and 8247/2000; for 73, 17087/2000 and 17089/2000; for 27,
10391/2000 and 10393/2000. The squared endpoint decimals in answer-methods.md
are the decimal representations of those frozen square numerators over
4000000. Its displayed propagated intervals agree with the inherited strict
cell/root bounds and stay inside the final hundredth bins. This comparison
did not recompute square roots, solve equations or open the table.

The three-decimal literals have a last printed place of 0.001. Both candidate
display and methods explicitly decline to infer an error guarantee or tie
rule from that format. Nearest-hundredth reporting is a mathematical reporting
step, not a historical-table rule. No interpolation, truncation or universal
nearest-0.001 table convention is invented. Thus all four *actual-method*
obligations are satisfied, not merely eight calculator-like final answers.

### 863 / Key 5: MATCH, 6/6 Tasks

All exact decimal/fraction transformations and real solutions match:

- a: multiply by 10 -> `7x^2-13x-20=0`, D=729=27^2, `{-1,20/7}`.
- b: multiply by 5 -> `y^2+2y-35=0`, D=144, `{-7,5}`.
- c: multiply by 25 -> `25x^2-40x-9=0`, D=2500, `{-1/5,9/5}`.
- d: D=-7.64<0 for `z^2-2z+2.91=0`, empty real solution set.
- e: multiply by 5 -> `y^2-50y+625=(y-25)^2=0`, sole root 25.
- f: multiply by 3 -> `x^2+6x-27=0`, D=144, `{-9,3}`.

The nonzero-scaling condition is stated; the negative discriminant and
repeated-root multiplicity are not omitted. Displayed formula arithmetic
matches in every part that uses it.

### 864 / Key 6: MATCH, 2/2 Tasks

- a: `9a^2-3a-0.24=0`, scale 25/3 -> `75a^2-25a-2=0`, D=1225=35^2, `a=(25 +/- 35)/150`, all witnesses `{-1/15,2/5}`.
- b: `0.16a^2-0.4a+0.24=0`, scale 25/2 -> `2a^2-5a+3=0`, D=1, `a=(5 +/- 1)/4`, all witnesses `{1,3/2}`.

Both existence answers are yes and all satisfying values are given, not only
a single witness or an unsupported yes/no.

### 865 / Key 7: MATCH, 4/4 Requested Methods

- a: coefficients `(12,7,0)`, D=49, formula `x=(-7 +/- 7)/24`; factorization `x(12x+7)=0`; both give `{0,-7/12}`.
- b: coefficients `(1,0,-25)`, D=100, formula `x=(0 +/- 10)/2`; factorization `(x-5)(x+5)=0`; both give `{-5,5}`.

Formula AND factorization are actually displayed for BOTH equations. The
zero-product reasoning and warning against dividing by x preserve the zero
root; the negative root and both signs remain.

### 866 / Key 8: MATCH, 4/4 Tasks

- a: D=4-12t<0 -> `(1/3,+infinity)`.
- b: D=324-20t<0 -> `(81/5,+infinity)`.
- c: D=t^2-16<0 -> `(-4,4)`.
- d: D=t^2+960>0 for every real t -> empty no-root parameter set.

The modern b/c order is followed, not the interleaved historical source
layout. All strict endpoints, real domain and fixed nonzero leading
coefficients match. D=0 endpoints are explicitly excluded.

### 867 / Key 9: MATCH, 5/5 Tasks

- a: D=1600-40v>0 -> `(-infinity,40)`.
- b: D=v^2-144>0 -> `(-infinity,-12) union (12,+infinity)`.
- c: for v!=0, D=36-4v>0 -> v<9; v=0 gives only x=1/6; final `(-infinity,0) union (0,9)`.
- d: D=v^2+700>0 for every real v with leading coefficient 7 -> all real v.

Two roots is explicitly defined as distinct real roots. Linear v=0 and
all repeated-root endpoints are excluded for the right reasons. There is no
erroneous blanket exclusion of zero in d.

### 868 / Key 10: MATCH, 5/5 Tasks

- a: D=k^2-576; k=-24 gives x=3/4, k=24 gives x=-3/4; formula -k/32.
- b: D=8100-60k; k=135 gives the unique x=3.
- c: for k!=0, D=10000-4k^2; k=-50 gives x=-1, k=50 gives x=1; formula 50/k only in this nonzero case. Separately k=0 gives -100x=0, x=0; complete set `{-50,0,50}`.
- d: D=k^2-200; k=-10sqrt(2) gives x=sqrt(2)/5, k=10sqrt(2) gives x=-sqrt(2)/5; formula -k/50.

The quadratic D=0 criterion is qualified as nondegenerate. Both parameter
signs, their root associations and the actual as-written linear case match.
No unstated strictly-quadratic restriction removes k=0.

### 869 / Key 11: MATCH, 4/4 Tasks

- a: `a^2+12a+40=(a+6)^2+4>=4>0`, minimum 4 at a=-6.
- b: `a^2-6a+13=(a-3)^2+4>=4`, equality at a=3.

Both completing-square identities and nonnegative-square universal proofs
are displayed. The b conclusion is not incorrectly strengthened to >4.

### 870 / Key 12: MATCH, 15/15 Tasks

- a forward: `C(-8)->C'(-11)`, `D(6.5)->D'(3.5)`, `E(7)->E'(4)`.
- a inverse: given `F'(0)`, input `F(3)`, with x-3=0.
- a proof: each x has one output x-3; every real target y has preimage y+3; image all real numbers.
- b forward: `B(5.5)->B'(11)`, `C(-8.25)->C'(-16.5)`.
- b inverse: given `D'(10)`, input `D(5)`; given `E'(-15)`, input `E(-7.5)`.
- b proof: each x has one output 2x; every real target y has preimage y/2; onto the real line.
- b fixed point: 2x=x iff x=0, sole fixed origin.
- c forward: `A(1.5)->A'(2.25)`, `B(-1.5)->B'(2.25)`.
- c inverse existence: no real input for `C'(-1)` because x^2>=0.
- c image proof: all outputs nonnegative, every y>=0 attained by sqrt(y), hence exact image `[0,+infinity)` including 0; positive targets also have -sqrt(y).

All 11 named point-direction/existence queries, both onto-self proofs, the
fixed-point query and the half-line image proof match. Every prime and sign
is preserved. One output per input is distinguished from one-to-one; two
inputs yielding the same square do not prevent the rule being a mapping.
Optional injectivity proofs in the independent a/b solutions are not
additional source obligations. Candidate onto and well-definedness proofs
are complete without requiring those optional proofs.

### 871 / Key 13: MATCH, 2/2 Tasks

- a: distribute sqrt(7)/7; the frozen simplifications sqrt(147)=7sqrt(3), sqrt(98)=7sqrt(2), sqrt(245)=7sqrt(5), sqrt(20)=2sqrt(5) give cancellation of -2sqrt(5)+2sqrt(5); result sqrt(3)+sqrt(2).
- b: separate the conjugate product; 5-3=2 and -sqrt(75)+sqrt(45)+sqrt(75)=3sqrt(5); result 2+3sqrt(5).

The complete distribution/cancellation steps and positive principal-radical
notation agree; neither answer drops a sign or factor.

### 872 / Key 14: MATCH, 1/1 Task

For real a!=0, the full expansion includes mixed term 2a*(1/a)=2 and yields
`(a+1/a)^2-a^2=2+1/a^2>2`. The argument a^2>0 -> 1/a^2>0 is displayed.
Strictness is preserved, there is no finite nonzero equality case, and a=0
is explicitly outside the domain rather than offered as an equality case.

## Completeness, Contract And Cultural Notation

The 15 candidate keys occur exactly once and in current modern exercise
order, book7a/lesson alg7-c4-s3-n44/edition modern-us-neutral. Count=15 and
draft status match this comparison-only assignment. All have source=derived,
grading=ungraded, parts=[], nonempty displayAnswer, no bookRaw and empty
historical_entities. Stable author evidence/method filenames in notes match
the supplied FINAL package; a filename reference does not promote the
author's own calculations to independent review evidence.

All 64 modern subpart labels and the unlettered 872 proof are present.
Task coverage is 24+20+8+8+12+6+2+4+4+5+5+4+15+2+1=120.
The actual-table method count is four, in addition to its exact-root and
hundredth tasks. There are no omitted internal 870 coordinate/proof queries.

The approved read-only ticket contract overrides the gate's general
auto-part splitting route. Keeping parts=[] is intentional, not an omission.
No expected, judge or input interaction is required or manufactured. The
gate's MathLive keyboard/serialization clause is inapplicable to these
ungraded empty-part candidates; no runtime pass is claimed.

Manual cultural/notation comparison found no reintroduced fictional Soviet
persons, places, currency or unit substitutions. Candidate a..j labels are
Latin modern labels, not historical Cyrillic labels. x/y/z/p/a and t/v/k
roles are retained; dot decimals, LaTeX fractions, real sets, strict interval
endpoints, approximation signs and mapping primes have their intended
meanings. The same-book printed-page reference is actual source provenance,
not a cultural invention. Empty historical_entities is appropriate.
English explanatory prose does not change the mathematical meaning of the
Chinese modern questions; no language requirement is added by this review.
All tasks are dimensionless algebra/coordinate tasks, so no physical unit
is missing. No renderer or culture-profile validator was run.

## Issue Units And Boundary

Issue units: `[]`. Mathematical mismatches: 0. Completeness issues: 0.
Actual-method omissions: 0. Cultural/notation issues: 0.
No author revision or canonical change is requested by this comparison.

Writes are confined to n44-answer-comparison. Existing reviewer and author
files remain unchanged and read-only. New solves=0; image opens=0; browser,
validator, finalizer, producer, app, DB, env, network, dependency and commit
operations=0. No other chat was messaged and no choice key/review was opened.
The author manifest's choice provenance filenames/hashes were not followed.
The concurrent choice reviewer receives nothing from this comparison.
Stop after sealing this report, results0444.json and freeze0444.json.
