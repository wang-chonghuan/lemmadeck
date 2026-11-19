# FIRST: Source-Only Independent Inquiry

Ticket: STEMROBIN-184 B, n13 "13. 循环小数".
This is an independent mathematics/source-text inquiry, not authoring, source
correction, publication approval, visual review, or a live-ticket handoff.
All reasoning and expectations below were authored before running the check.
Stop after freeze and return these textual files for parent intake.

## Independence and Boundaries

Mathematical sources: exclusively canonical 9c pages 0055, 0056, 0057 `page.json`.
Start at page55 `/blocks/1` (n13 h3); stop before page57 `/blocks/5` (n14 h3).
Do not use preceding exercise114 or following n14. Page52 is unnecessary and was
not read. References below are JSON pointers with ZERO-BASED indices, not an
assumed repository errata-reference numbering convention.

Read the required `.intentfold/readme.md`, binding engineering, lesson SKILL.md
in full, and production-resume.md; also operations.md, the IntentFold routing
skill, and only the text-normalization implementation in `tools/blocks.py`.
No IntentFold capability was invoked. No setup, freshness, backend, Git, DB,
publisher, browser, images, paid calls, or messages to other chats occurred.
No modern lesson, author answer, choice, draft, prior review, canonical errata,
or source metadata assessment was disclosed. Only structural keys and scoped
source block text were printed. Source metadata, including any errata, was not
used to drive the reasoning.

Source bindings, recorded on the first source inventory:

| Source | Bytes | SHA-256 |
| --- | ---: | --- |
| 0055/page.json | 5274 | dde98491e1c31c0e7cc56af1e09f85f693a25c78c839821d899264b141542e77 |
| 0056/page.json | 5709 | 1aa23cce5149a69f3b3699bd0408c53134bbe7e5b3b1a1a73bd634133eddf00f |
| 0057/page.json | 5044 | 5a8e2c4dafa5f1560c7f2ebc4a7f602f5c7f16f978f10ef4a8e4c9bc71be5985 |

Full-file hashes bind the canonical version; the generated scoped snapshot
retains ONLY the 21 in-scope blocks' textual fields, normalized semantic text,
and individual hashes. It does not duplicate whole pages, pixels, figures,
modern content, metadata/errata, or an earlier evidence package. Source bytes
are rechecked against the above expectations before deriving that snapshot.

## Conventions Derived From the Source

For `a_0.a_1a_2...`, fractional digits satisfy `a_i in {0,...,9}`, `i >= 1`.
Here `a_0` is an integer, not necessarily a single digit; a negative integer
part carries the bar. This is a SIGN ON THE INTEGER ONLY:

`bar(q).u = -q + 0.u`, not `-(q + 0.u)`.

The source's statement that the fractional part is nonnegative rational
(0056 `/blocks/0`) and its integer-bar example (0055 `/blocks/4`) fix the
appropriate decomposition as `a_0 = floor(r)` and `0 <= r-a_0 < 1`.
This conclusion concerns the given text's convention, not unobserved pixels
or the unconsulted preceding section.

For the digit-period definition, require `N >= 1`, `p >= 1`, and integer
indices `n >= N`. A zero period would make `a_(n+p)=a_n` vacuous and would not
define repetition. If a convention counts zero as a natural number, these
positivity restrictions must still be imposed. `N` and `p` need not be minimal;
a later `N` or a positive multiple of a valid `p` also works. "循环节" is a
digit string, possibly containing a leading zero, not just an integer value.
Parentheses and an integer bar have completely different roles.

## Independent Exercise 115 Solutions

Source: 0057 `/blocks/4`. The four source labels are Cyrillic
`а, б, в, г` (U+0430, U+0431, U+0432, U+0433), not Latin a, b, c, d.
English part names below are intake labels only.

### 115a: 7/3

`7 = 3*2 + 1`. Integer part 2; decimal remainder 1.
Each next step gives `10 = 3*3 + 1`, so the same remainder and digit 3 recur.

`7/3 = 2.333333... = 2.(3)`.

`N=1`, `p=1`; all `a_n=3`. Exact reverse check:
`2 + 3/9 = 7/3`. This is purely periodic after the decimal point.

### 115b: 23/30

Integer part 0. `230 = 30*7 + 20`, followed by
`200 = 30*6 + 20`. Remainder 20 repeats at every subsequent step.

`23/30 = 0.766666... = 0.7(6)`.

`N=2`, `p=1`; `a_1=7`, and all `a_n=6` for `n>=2`.
Exact reverse check: `7/10 + 6/(10*9) = 23/30`.
It is not `0.(76)` and the nonrepeating prefix is exactly one digit.

### 115c: -3/7

For the source convention, `floor(-3/7)=-1` and fractional part
`-3/7-(-1)=4/7`. Divide 4 by 7:

| Incoming remainder | Scaled | Digit | Outgoing remainder |
| ---: | ---: | ---: | ---: |
| 4 | 40 | 5 | 5 |
| 5 | 50 | 7 | 1 |
| 1 | 10 | 1 | 3 |
| 3 | 30 | 4 | 2 |
| 2 | 20 | 2 | 6 |
| 6 | 60 | 8 | 4 |

The initial remainder 4 returns after six steps.
`-3/7 = bar(1).571428571428... = bar(1).(571428)`.

`N=1`, `p=6`. Exact reverse check:
`-1 + 571428/999999 = -1 + 4/7 = -3/7`.
All six remainders before the return are distinct, so this is the shortest
period in the source's floor-integer representation.

Equivalent WHOLE-NUMBER-minus notation:
`-0.428571428571... = -0.(428571)`.
It is not interchangeable with an integer-only `bar(1).(428571)`;
that last expression equals `-4/7`, not `-3/7`.

### 115d: -29/11

`floor(-29/11)=-3`; fractional part `-29/11+3=4/11`.
`40 = 11*3 + 7`, and `70 = 11*6 + 4`. The initial remainder returns.

`-29/11 = bar(3).363636... = bar(3).(36)`.

`N=1`, `p=2`. Exact reverse check:
`-3 + 36/99 = -3 + 4/11 = -29/11`.
The two different remainders prove the shortest period is two digits.

Equivalent WHOLE-NUMBER-minus notation:
`-2.636363... = -2.(63)`.
An integer-only `bar(2).(63)` is different: `-2+7/11=-15/11`.

All four are eventually periodic because deterministic long division has
finitely many remainder states. The tables prove the exact periods here,
not merely their existence.

## Complete Source-Block Coverage

### Page55 /blocks/1: Title

Exact target h3 "13. 循环小数". No mathematical proposition; it starts scope.

### Page55 /blocks/2: Informal Description

Digits eventually repeat in `0.12500000...` and `3.6666666...`.
Both examples satisfy the later definition. Trailing zeros are included:
finite decimals acquire an infinite zero tail. A finite number of visibly
written repeated digits plus an ellipsis denotes an infinite continuation;
the precise number of displayed zeros/sixes is not mathematical data.

### Page55 /blocks/3: Definition

`a_(n+p)=a_n` for every `n>=N` is eventual periodicity with positive integer
`N,p`. It does NOT require repetition from the first decimal place, a
single-digit period, a minimal period, or a positive number. It includes
zero-tail decimals. Positivity, digit domains and integer-part convention
are stated above; no preceding-section definitions were silently imported.

### Page55 /blocks/4: Every Example and Notation

`3.666...`: `N=1,p=1`, `a_(n+1)=a_n=6`, true.
`0.125000...`: `N=4,p=1`, `a_(n+1)=a_n=0` for `n>=4`, true.
The raw `a_(n+1)` formula contains one physical-wrap `U+21B5`; stripping it
preserves `a_(n+1)=a_n=0`.

`bar(2).17838383...`: `a_1=1`, `a_2=7`, then `8,3,8,3,...`.
Thus `N=3,p=2`, `a_(n+2)=a_n` for all `n>=3`. The parity statements
"odd n -> 8, even n -> 3" are correct WITHIN THAT TAIL DOMAIN ONLY.
They are false globally: at odd `n=1` the digit is 1, and at even `n=2`
the digit is 7. This is contextual scope, not a mathematical contradiction
when read with the immediately preceding `n>=3`.

Abbreviations `3.(6)`, `0.125(0)`, `bar(2).17(83)` are correct.
The last value is
`-2 + 17/100 + 83/(100*99) = -2 + 883/4950 = -9017/4950`.
It is also `-(1.82(16))`, NOT `-(2.17(83))`.
The parentheses contain the repeating digit string; source reading names
are notation, not arithmetic. The several different written lengths of
the `83` repetition still describe the same stream, as do different
written lengths of a zero tail.

### Page55 /blocks/5: Theorem 1

Every rational number has an infinite eventually periodic decimal.
Proof: write `r=a_0+m/n` with `a_0=floor(r)`, integers `n>0`,
`0<=m<n`. Start `r_0=m`. For each digit,
`10*r_(j-1)=n*a_j+r_j`, with `0<=r_j<n`.
There are only n remainder states; determinism makes a repeated state
produce the same future digits. A zero remainder stays zero. See the
counting details under page56 /blocks/4. This handles negative rationals,
integers (m=0), zero, and terminating decimals as zero-tail infinite decimals.

### Page55 /blocks/6 and /blocks/7: Footnotes

/blocks/6 is the translator's historical note about nonuniform Chinese
pronunciation. It supplies no mathematical rule. This inquiry reports
what the source says, not a verified claim about current Chinese usage.
/blocks/7 is the folio "48"; it is not lesson mathematics.

### Page56 /blocks/0: Reduction to a Nonnegative Fractional Part

Correct with the integer-only bar/floor convention:
the digits of `r` equal the digits of `r-floor(r)`, which is a nonnegative
rational less than 1. The whole-number leading minus convention would
instead use `abs(r)`'s digits and would not justify this same wording for
negative r. Do not silently switch conventions between examples and answers.

### Page56 /blocks/1, /blocks/2, /blocks/3: 12/55

/blocks/1 and /blocks/3 are the two textual portions of an open/cont
paragraph, separated by /blocks/2, a figure with label "长除法" and no
textual lines. The figure's pixels, internal numbers, linework and
typography are UNKNOWN in this zero-image inquiry.

Independent arithmetic chain (not a claimed observation of the figure):

| Step j | Incoming remainder | Times 10 | Digit | Product 55*digit | Remainder |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 12 | 120 | 2 | 110 | 10 |
| 2 | 10 | 100 | 1 | 55 | 45 |
| 3 | 45 | 450 | 8 | 440 | 10 |
| 4 | 10 | 100 | 1 | 55 | 45 |
| 5 | 45 | 450 | 8 | 440 | 10 |

The second occurrence of remainder 10 is at step3, not step2;
"第二次得到余数10" means the second occurrence, not the second division step.
After the one-digit prefix 2 the block 18 repeats:
`12/55=0.2181818...=0.2(18)`.
Reverse check: `2/10+18/(10*99)=12/55`.
Every numerical entry above is exact, independently derived and checked.
Agreement between that chain and unobserved figure contents is NOT certified.

The canonical TEXT uses `象` in "象余数那样". The user's already-known
physical glyph question `象/像` remains UNKNOWN. A JSON character is not
pixel evidence. Both readings express the same mathematical comparison:
remainder repetition forces digit repetition.

### Page56 /blocks/4: Repeated Remainder and the Bound

The divisor must be a POSITIVE integer n; n=0 has no division or remainder
state set. The possible remainders are exactly the n states
`0,1,...,n-1`. After n digit transitions, the list
`r_0,r_1,...,r_n` contains n+1 entries, so some pair repeats.
This proves "不超过n步" when the initial remainder after the integer
division is included. If one counts only n newly emitted remainders, the
bare pigeonhole argument alone would not force a repetition; do not omit
the initial state. For n=1 this matters especially: initial and next
remainders are both zero, giving the bound of one transition.

A repeated state `r_i=r_j` forces identical digit production from then on,
with period `j-i>0`, since the quotient digit and next remainder are
uniquely determined by `floor(10*r/n)` and `10*r mod n`.
The argument gives existence and an upper bound, not the shortest period
or necessarily a nonzero digit period.

### Page56 /blocks/5: Zero Remainder Note

If `r_j=0`, then `10*0=n*0+0`, so every subsequent digit and remainder
is zero. A terminating decimal therefore has an infinite zero-tail
representation with period0 (the DIGIT STRING "0"), and p=1.
This is not a period LENGTH zero.

### Page56 /blocks/6, /blocks/7 and Page57 /blocks/0: Theorem 2 Literal

The theorem is split across the page and must be read as one assertion:
every recurring decimal not having period9 represents a rational and can
be obtained by division of that rational. This assertion is correct for
the canonical, not-eventually-all-9 representation.

Rationality independently: take a nonrepeating prefix of t digits with
integer value A, and a repeating block of p digits with integer value B.
`x = a_0 + A/10^t + B/[10^t*(10^p-1)]`, `t>=0,p>=1`.
The geometric series has ratio `10^(-p)<1`. This is a rational even
when `B=10^p-1` (a block of all 9s). Leading zeros in A or B must keep
their digit lengths; replacing a string by its integer alone loses them.

For a tail NOT eventually all9, each residual decimal tail is strictly
less than 1. Thus every truncation is a floor truncation, and standard
deterministic long division recovers the given stream (up to equivalent
ways of grouping the same period). Zero tails are allowed.

IMPORTANT DISTINCTION: exclusion of period9 is needed for the
"obtained by ordinary division" clause, NOT for rationality as an
infinite-series numerical value. If the preceding question/answer wording
is read as asserting that a 9-tail is irrational, that stronger reading
is false: `0.23(9)=0.24=6/25`, and `0.(9)=1`.
The literal restricted theorem does not assert the excluded cases are
irrational, so this is a domain/wording caution, not a proved contradiction
of the theorem as printed.

"Period9" must mean an EVENTUAL ALL-9 TAIL, equivalently shortest
period9. Writing the same tail as `(99)` or `(999)` does not evade the
exception. A period that merely contains a 9, such as `(09)`, is not
excluded. Negative floor-integer decimals obey the same tail rule.

### Page56 /blocks/8: Folio

Printed folio49; no mathematics and no interruption of the theorem's
open/cont linkage.

### Page57 /blocks/1: Deferred Conversion

The source says it omits the theorem's proof and later will explain
conversion to m/n, except for a period9 tail; it also states division
recovers the given stream. This inquiry does not read that later material.
The independent geometric formula above justifies conversion, while the
non-9 restriction is required for exact standard-division stream recovery.
Integers m and positive n suffice for signed rationals. The next paragraph
explicitly concerns natural m,n and therefore a positive example, not
every negative rational.

### Page57 /blocks/2: Inequality, Complete k-Label Analysis

Both underbraces cover ALL the k fractional digits `2399...9`.
The preceding `0.` is OUTSIDE each underbrace. The literal exponent is
`-k`, not `-(k+2)`. The two `U+21B5` marks inside the annotation rows
are physical-wrap metadata removed by `blocks.text_of`; their addition
does not change a digit, bracket endpoint, k-domain or exponent. No pixel
claim is made about those rows.

For an integer `k>=3` let D_k be the displayed finite decimal with prefix
23 followed by k-2 nines. Then

`D_k = 23/100 + sum_(j=3)^k 9/10^j = 24/100 - 10^(-k)`.

So `0.24-D_k = 10^(-k)` EXACTLY, for instance:
`0.24-0.239=0.001` (k=3) and
`0.24-0.2399=0.0001` (k=4).
If one extends the truncation family to k=2, D_2=0.23 and the same
formula holds, but the displayed nines form naturally starts at k>=3.
If k instead counted only the nines, the exponent WOULD be -(k+2);
that is a different annotation, not what the bounded source text says.

For standard division of `r=m/n` with positive integers m,n, suppose
the resulting stream starts 0.23 and then produces only 9s.
After two digits its integer remainder R_2 satisfies
`r=23/100+R_2/(100*n)` and `0<=R_2<n`, so `r<0.24`.
An infinite nonzero9 tail means the remainder at every later truncation
is positive, so `r>D_k` for every k>=3.
Consequently `0 < delta=0.24-r < 10^(-k)` for every such k.
This is impossible: powers10^k are unbounded, so choose k with
`10^(-k)<delta`. Equivalently the exact denominator gives
`delta=(n-R_2)/(100*n)>=1/(100*n)`; any k with
`10^k>100*n` already contradicts the required strict bound.
Rationality is not required for the final positive-gap limiting argument,
but it is part of the division premise and provides this explicit bound.

This does NOT prove a series-valued `0.23(9)` cannot equal a rational:
its geometric value is exactly0.24. It proves ordinary remainder-based
division cannot emit that noncanonical tail. At r=0.24 the assumed
strict `r<0.24` is false, and ordinary division gives `0.24(0)`.
There is no contradiction or exponent error in the source argument
under its stated division and full-k-label premises.

### Page57 /blocks/3 and /blocks/4: Exercises

/blocks/3 is the exercise heading. /blocks/4 contains only exercise115,
with all four subparts fully solved above, including the reason for
eventual periodicity, exact values, sign convention and minimal periods.
The next h3 is excluded; no n14 prose entered this inquiry.

## Contradictions and Remaining Unknowns

No unconditional mathematical contradiction was established in the
in-scope TEXT with its contextual digit domains and integer-only bar.
No source correction, erratum, modern correction, or final author key
was written or approved.

Do not inflate that result into visual/source completeness:
the figure's internal long-division chain is unobserved; physical
`象/像` remains UNKNOWN; exact printed repetition counts remain UNKNOWN.
Textual spelling and ellipsis lengths are bound as given, not certified
from pixels. These unknowns do not affect the exact mathematics derived
from the provided rationals and streams. In particular the k-label and
literal exponent-k are not mathematical errors, and a whole-number
minus cannot replace a bar on the integer without complementing the tail.

## Verification and Freeze Contract

`FIRST-expectations.json` contains independently derived literal
expectations, not values copied from observed test output.
`FIRST-check.mjs` uses BigInt fraction arithmetic, geometric decimal
conversion, independently implemented remainder-based division,
period assertions, complete source-pointer coverage and source hashes.
It checks all four subparts, all numerical examples, every 12/55 row,
integer-only barnegative, zero tails, the full-k truncation identity,
9-tail rationality versus division, and exhaustive m/n remainder cases
for 1<=n<=128,0<=m<n. Finite checks SUPPORT the separate general proofs;
they do not replace them or certify image contents.

The runner captures actual child stdout, stderr, exit status and signal.
Three deliberately wrong candidates must exit1: a complemented-tail
sign error, an exponent-k-plus2 error, and a long-division remainder
error. A genuine positive check must exit0. All receipts and their
output-file hashes enter `FIRST-execution.json` before freeze.
The initial exploratory `rg` had exit2 solely because the permitted
output directory did not yet exist. Its actual stderr was:
`rg: .tmp/stemrobin-184-resume/n13-independent: No such file or directory (os error 2)`.
Valid stdout was a filename inventory of the lesson skill directory;
no file bodies, answers, images, or drafts were read from that inventory.
No content conclusion or passed check was inferred from that failure.
All other preparatory read commands returned exit0.

The first runner invocation then exited1 BEFORE creating a scoped snapshot
or running mathematical checks: the canonical boundary heading is literally
`14. 实 数`, while the temporary guard expected `14. 实数`.
`FIRST-technical-recovery.json` preserves its actual empty stdout, full
stderr, command and exit. Recovery changes only the scratch boundary
comparison to allow whitespace between these two characters. The exact
canonical title is preserved; no n14 body is disclosed and no source is
changed. Initial expectations and mathematics are unchanged. This is a
technical input-boundary mismatch, not a mathematical finding or an
already-frozen evidence revision.

Successful freezing writes `FIRST-freeze.json`, hashes every preceding
FIRST file, sets all FIRST files0444 and this directory0555, and prints
the final inventory including the freeze manifest's own hash. The
manifest does not claim a self-referential hash. FIRST evidence must
never be edited after this boundary. Any later disclosed-stage review
requires separate, newly authorized evidence outside these immutable
FIRST files; none is attempted now.

Usage: this worker opened ZERO images; parent cap permanently24/24,
worker allocation0. Browser calls0; paid model/tool calls0; token usage
UNKNOWN; monetary cost UNKNOWN. No model-cost figure is fabricated.
