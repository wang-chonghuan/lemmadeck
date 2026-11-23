# STEMROBIN-184 NEW N11: independent initial mathematical freeze

Date: 2026-11-23. Sole working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
This file accompanies `source-first.md` in this same durable directory.
That record binds the four originals and the already-reviewed 0045 context
by path/SHA-256 and preserves physical source boundaries.
Actual visually loaded image total: **4**, exactly one opening each of
0046, 0047, 0048, 0049; no crops, reopens, or other images.

All derivations below were made independently of author candidates/reports,
modern drafts, answer keys/drafts, and choice drafts. None was read.
No sources or drafts were edited. No finalize, recount, publisher, database,
app, `.env`, dependency, Git, network, browser, or other-agent operation was run.
Only the two new reviewer records were written.

## Model conventions, not added source facts

For the dice examples, use independent fair six-sided dice and independent
throws, consistent with the source's explicitly equally probable outcomes.
For physical selections of products, tickets, balls, and melons, use uniformly
chosen distinct objects without replacement. This is the standard reading of
drawing multiple objects from a finite collection; the pages do not explicitly
add a replacement mechanism. Results below depend on that model.
For hats, use a uniform permutation of the five distinct hats, one per guest.
For factorial equations/inequalities, use nonnegative integer factorial
arguments and `0!=1`; do not extend to Gamma functions or real roots.
Any separate convention requiring variables to be positive intersects these
sets. The source pages do not themselves resolve the zero convention.
Use `A_N^s=N!/(N-s)!` and `C_N^s=binom(N,s)` as distinct notations.
Derived answers are mathematical review results, not printed source answers.

## Worked example 1: P46-E1a / P46-F1

Four rolls have `6^4=1296` ordered outcomes. Avoiding six on every roll leaves
`5^4=625`. Thus the favourable outcomes are
`1296-625=671`, and

```latex
P(\text{at least one six in four rolls})
=1-\left(\frac56\right)^4
=\frac{671}{1296}
=0.517746913580\ldots.
```

The source's preliminary `6^3=216`, four-roll count `1296`, avoidance count
`625`, favourable count `671`, rounded `0.52`, and strict `>1/2` all check.
In particular `2*671=1342>1296`. The complement event is zero sixes; do not
misread the question as exactly one six.

## Worked example 1: P46-E1b / P46-F2

For a pair of dice, each throw has `6*6=36` ordered outcomes and exactly one
double-six outcome. Avoidance probability is `35/36`. Over 24 independent
throws, the source's counts `36^24`, `35^24`, and `36^24-35^24` give

```latex
P(\text{at least one double six in 24 paired throws})
=\frac{36^{24}-35^{24}}{36^{24}}
=1-\left(\frac{35}{36}\right)^{24}
=0.491403876131\ldots<\frac12.
```

The per-throw probability `1/36` is indeed one sixth of `1/6`; that premise
is correct. Multiplying the number of throws by six (`4*6=24`) does not
preserve the probability of at least one success, because the complement is
exponential rather than linear. The proposed more-than-half conclusion is
false, as the text explains. The final conclusion "slightly less than half"
is correct.

**Independent numerical finding M46-decimal:** P46-F2 clearly prints
`\approx0.48`. Its exact preceding expression evaluates to
`0.491403876131...`, which rounds to **0.49**, not **0.48**, at the displayed
two-decimal precision. The discrepancy from 0.48 is about 0.011403876.
This is an inaccurate numerical approximation at that precision, not an
incorrect complement formula and not an ambiguous source glyph.
Retain the literal source 0.48. A later authorized correction could use
`0.49` (or an explicitly higher-precision value); this review does not register
canonical errata or edit a source/modern artifact.

The star's footnote `用对数计算` is mathematically relevant:
the power may be evaluated via `24*log(35/36)` and exponentiation.
It is not scan noise and should remain associated with this example.
No external historical verification of the Pascal narrative was attempted.

## Worked example 2: P47-E2q / P47-F1-F4

Population 100, defective 10, sound 90, sample 20. Let `D` be the number of
defectives sampled. The target is `D>=1`, whose complement is `D=0`.
Using the **ordered** sample space employed by the printed solution:

```latex
T=A_{100}^{20}=\frac{100!}{80!},\qquad
B=A_{90}^{20}=\frac{90!}{70!},
```

```latex
P(D\ge1)=\frac{T-B}{T}
=1-\frac{90!80!}{100!70!}
=1-\prod_{i=0}^{19}\frac{90-i}{100-i}
=0.904883727569\ldots.
```

Thus the printed approximation `0.9049` is correct to four decimals.
An unordered check gives exactly the same probability:

```latex
1-\frac{\binom{90}{20}}{\binom{100}{20}},
```

because the `20!` factors cancel. The literal `A` notation is not a glyph
to "correct" to `C`. The phrase "抽法总数" needs an ordered-sample interpretation
to equal `A_{100}^{20}`; unordered subsets instead number `C_{100}^{20}`.
That modelling clarification does not invalidate the printed probability.
Do not use independent replacement trials `1-0.9^20`: sampling is from
distinct products in a fixed batch.

## N11 exercises on physical 0048

### 80: two white balls

For `a` white and `b` black, total `a+b>=2`:

```latex
P=\frac{\binom a2}{\binom{a+b}2}
=\frac{a(a-1)}{(a+b)(a+b-1)}
=\frac{a}{a+b}\frac{a-1}{a+b-1}.
```

The zero-favourable case `a<2` has probability zero. `a,b` are nonnegative
counts. Replacement would change the result to a square and is not the
finite-selection reading used here.

### 81: five tickets from ten, two winning

Total subsets: `C(10,5)=252`. There are eight losing tickets.

- `а)`: exactly one win gives `C(2,1)C(8,4)=2*70=140`, hence `140/252=5/9`.
- `б)`: exactly two wins gives `C(2,2)C(8,3)=56`, hence `56/252=2/9`.
- `в)`: at least one gives `1-C(8,5)/252=1-56/252=7/9`.

The three exact win-count probabilities are `2/9` (zero), `5/9` (one),
`2/9` (two), summing to one. Part в equals parts а plus б, not part а alone.

### 82: two ripe melons

```latex
P=\frac{\binom{50}{2}}{\binom{60}{2}}
=\frac{1225}{1770}
=\frac{245}{354}
=0.692090395480\ldots.
```

Sequential check: `(50/60)*(49/59)` yields the same fraction. The second
denominator is 59, not 60.

### 83: the two strongest players

Condition on the group containing the first designated player. Among the
other 15 players, seven share that group and eight are in the other group.
Therefore `а) 7/15`, `б) 8/15`. They sum to one.
The labelled-versus-unlabelled naming of the two groups does not change this
pair event.

### 84: exactly l defectives, unresolved total-count glyph

**U84-total is unresolved in the source record.** The visible total letter
is r-like but not securely distinguished from `n`. Use reviewer-only `N`
for that total in the derivation; it is **not** a proposed transcription.
The readable source parameters are `k` defectives, `s` sampled, `l` required:

```latex
P(D=l)=
\frac{\binom{k}{l}\binom{N-k}{s-l}}{\binom{N}{s}}.
```

Choose the `l` defective objects and `s-l` sound objects independently as
subsets, then divide by all `s`-subsets. Require integers
`N>=0`, `0<=k<=N`, `0<=s<=N`. Feasible target values satisfy
`max(0,s-(N-k))<=l<=min(k,s)`; otherwise the probability is zero.
For ordered draws, arranging each selected subset contributes `s!` to both
numerator and denominator and cancels.
This derivation establishes the mathematical dependency, **not the glyph**.

### 85: k dice results all different

Each roll is a new independent die outcome. For `k<=6`, the distinct ordered
results number `A_6^k=6!/(6-k)!` out of `6^k`:

```latex
P_k=\frac{6!}{(6-k)!\,6^k}
=\prod_{j=0}^{k-1}\frac{6-j}{6}.
```

| Printed k | Independent probability |
| --- | --- |
| 2 | `5/6` |
| 3 | `5/9` |
| 4 | `5/18` |
| 5 | `5/54` |
| 6 | `5/324` |

Pairwise distinctness is essential. Requiring only unequal consecutive
results would yield `(5/6)^(k-1)`, a different event.

### 86: all five hats belong to someone else

The sample space is the `5!=120` bijections of hats to guests.
Exclude every assignment with a fixed point by inclusion-exclusion:

```latex
!5=5!-\binom51 4!+\binom52 3!-\binom53 2!
    +\binom54 1!-\binom55 0!
=120-120+60-20+5-1=44.
```

Consequently `P=44/120=11/30`. All five guests, not just one guest, must
avoid their own hats. Hats cannot be modelled as five independent choices
with replacement.

## N11 exercises on physical 0049

### 87: two designated books adjacent

There are `8!` shelf permutations. Treat the designated pair as one block;
the block and the other six books give `7!` arrangements, and the block has
two internal orders. Thus `P=2*7!/8!=1/4`.
The pair need not occur at a shelf endpoint.

### 88: partition into pairwise different specified sizes

For disjoint groups of respective sizes `m_1,...,m_k` with sum `n`,
successive choices give

```latex
\binom{n}{m_1}\binom{n-m_1}{m_2}\cdots
=\frac{n!}{m_1!m_2!\cdots m_k!}.
```

Alternatively, order all `n` distinct elements and cut into blocks of the
specified sizes; the within-block permutations overcount by
`m_1!m_2!...m_k!`.
For unnamed groups, pairwise unequal sizes identify the groups uniquely by
size, so there is no additional `k!` overcount. This explains why the source's
**pairwise unequal** condition matters. It must not be erased and then the
same formula asserted for arbitrary repeated-size unnamed groups.
The sum's physical line break before `=n` does not alter the condition.

### 89: two triples and two pairs

For the natural **unnamed-group** reading, first count groups in specified
slots of sizes 3,3,2,2, then remove permutations of equal-sized groups:

```latex
Q_{\rm slots}=\frac{10!}{3!3!2!2!}=25200,\qquad
Q_{\rm unnamed}=\frac{10!}{3!3!2!2!\,2!\,2!}=6300.
```

The final two factorials account separately for exchanging the two triples
and exchanging the two pairs. Do not divide by `4!`, because groups of
different sizes are not interchangeable specified slots.
**Interpretation note I89:** the source gives no group names. The preceding
88's unequal-size condition supports the unnamed-group answer **6300**.
If four specified slots were deliberately introduced, the answer would be
25200, but those labels are not a source fact. This is a semantic distinction,
not a damaged digit or a reason to alter the literal statement.

## Chapter-two supplementary exercises: separate group on 0049

These objects are frozen because they are in the authorized images. The
visible `第二章 补充习题` heading separates them from the N11 exercise group.
This review does not decide their canonical card ownership from a TOC/draft.

### 90: factorial equations

- `а)`: `n>=0`; `(n+2)!/n!=(n+2)(n+1)=72`.
  `n^2+3n-70=(n-7)(n+10)=0`, whose roots are **7 and -10**.
  More directly, `8*9=72`, so **n=7**; reject -10 by the factorial domain.
- `б)`: `k>=1`; `(k+1)!/(k-1)!=k(k+1)=30`.
  `(k-5)(k+6)=0`; the admissible solution is **k=5**.
- `в)`: `n>=2`; the literal right numerator is `20n!`, meaning `20*n!`.
  `(2n)(2n-1)(2n-2)=20n(n-1)`.
  Cancel the nonzero `n(n-1)` to obtain `4(2n-1)=20`;
  the admissible solution is **n=3**.
  Check: `6!/3!=120` and `20*3!/1!=120`.
- `г)`: `k>=4`; cancel the nonzero `k!` in
  `k!/(k-4)!=12k!/(k-2)!`.
  This gives `(k-2)(k-3)=12`, or `(k-6)(k+1)=0`;
  the admissible solution is **k=6**.
  Check: `6!/2!=360` and `12*6!/4!=360`.

No source equation correction is indicated by these derivations.
The numeric coefficients 20 and 12 must not be moved inside factorials.

### 91: factorial inequalities, strict endpoints

- `а)`: domain `n>=3`. Simplify to `(n-1)(n-2)<72`.
  At `n=9` the product is 56; at `n=10` it is exactly 72 and fails the
  strict inequality. The product is increasing on the domain.
  Solutions: **n=3,4,5,6,7,8,9**.
- `б)`: domain `n>=2`. Simplify to `(2n-1)(2n-2)>420`.
  At `n=11`, `21*20=420` fails; at `n=12`, `23*22=506` succeeds.
  The product is increasing on the domain. Solutions: **all integers n>=12**.
  The nearby handwritten annotation is not an authoritative answer or condition;
  U91-annotation remains unresolved independently of this solution.
- `в)`: domain `n>=0`. Since its denominator has no factorial,
  `(n+2)!/((n+1)(n+2))=n!`.
  `6!=720<1000<7!=5040`.
  Solutions under nonnegative-integer factorial convention:
  **n=0,1,2,3,4,5,6**.
  Under a positive-variable convention, remove only 0. The image itself
  gives no explicit domain selecting between those conventions.
- `г)`: domain `n>=3`, because only `(n-3)` is a factorial argument.
  Values at `n=3` and `n=4` have zero numerator and fail.
  For `n>=5`, cancel to get
  `(n-4)(n-3)/(n-3)!=1/(n-5)!`.
  The printed decimal is `0.00002=1/50000`.
  Thus `(n-5)!<50000`; `8!=40320<50000<9!=362880`.
  Solutions: **n=5,6,7,8,9,10,11,12,13**.

These derivations use the exact printed strict operators and ordinary products;
none warrants a source correction.

### 92: five-digit numbers using 0,1,2,3,4 once each

Five places without repetition force using all five supplied digits.
The leading digit has four nonzero choices; the remaining four digits have
`4!` orders. Count: **4*4!=96**.
Equivalent check: `5!-4!=120-24=96`; exclude leading-zero permutations.

### 93: physically unfinished

Only the stem through `一切三位` is visible. It gives digits 1,2,3 and no
repetitions, but the complete requested operation is not visible.
**No solution or completed question is frozen.** In particular, do not turn
the visible `求` into an inferred request to count numbers or sum them.
The boundary remains open to physical 0050, which was not read.

## Review disposition and stop

- Verified the exact combinatorial expressions and independent derivations for
  both worked examples and every complete exercise visible on 0046-0049.
- Mathematical finding **M46-decimal**: printed `0.48` is not the two-decimal
  rounding of the exact paired-dice probability; `0.49` is. Formula and
  less-than-half conclusion remain correct. No source/errata edit was made.
- Source unknowns remain **U84-total**, **U91-annotation**, **U93-tail**, and
  the provenance of the visible underline under `集合论`.
- **I89** and the zero-domain convention in 91в are interpretation questions,
  not source glyph errors. No expected answer was used to choose source ink.
- Historical claims, candidate fidelity, edition display, answer/choice
  quality, source reconciliation, and publication were not reviewed or claimed.

This initial independent freeze is complete. Stop here pending a separately
authorized affected comparison; no additional image or draft inspection follows.
