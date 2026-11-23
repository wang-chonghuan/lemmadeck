# STEMROBIN-184: independent mathematics, final N11 pages 0050-0051

Status: INITIAL INDEPENDENT SOURCE/MATH REVIEW ONLY.
Date: 2026-11-23.

Source objects were independently frozen in:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n11/reviewer5051/source-first.md`.

All derivations below use only the two original images and that independent
freeze. No author, faithful-transcription, modern-edition, answer, choice or
other reviewer candidate was read. No external lookup or calculation tool was
used. No source, application, dependency, Git, database, .env, browser,
finalizer, counting helper or other-agent operation was performed.

## Scope and assumptions

- `C_N^r = N!/[r!(N-r)!]`, with integer `N >= 0` and `0 <= r <= N`.
  In particular `C_N^0=1`. There is no implicit zero extension to `r>N`
  and no extension to noninteger indices. This convention is declared here,
  not borrowed from unseen earlier pages.
- Digits, books, keys and individual people are distinguishable. Selections
  are unordered unless a prefix, suffix, row position or named office
  distinguishes them. Books occupy a linear shelf, not a circular order.
- In 103 the five selected people are different; chair and secretary are
  distinct offices, but the three editor seats are not individually labeled.
  In 104/105 no unprinted ordering of posts or team boards is imposed.
- Ball distinguishability is not printed in 106; both principal answers are
  derived. The flower-selection result in 107 assumes individually selectable
  flowers, with no additional arrangement order inside a bouquet.
- Binomial expansion order is `T_1=a^N`, then increasing exponent of the
  second summand. This fixes the positional meaning in 109 and 111.
- There is no visible worked example on these pages. Every complete visible
  exercise 94-112 is solved below. The inbound `数之和.` fragment is
  insufficient to reconstruct or solve its missing request and is not
  silently assigned an exercise number.

## 94: sum of four-digit numbers

There are `4!` numbers. Each of 1, 3, 5 and 7 occupies each fixed decimal
place in exactly `3!` permutations of the other digits. Thus

$$
S=3!(1+3+5+7)(1000+100+10+1)
  =6\cdot16\cdot1111
  =106656.
$$

No leading-zero restriction is needed because zero is not a given digit.
The requested sum is 106656, not the number `4!=24`.

## 95: restricted permutations of 1 through 7

а) Prefix 123 fixed: permute the remaining four digits, giving `4!=24`.

б) Suffix 123 fixed: again `4!=24`.

в) The first three positions contain 1, 2 and 3 in any order, followed by
the remaining four digits in any order:

$$
3!\,4!=144.
$$

г) The initial two positions can be 12 or 21, each followed by the remaining
five digits in any order:

$$
2!\,5!=240.
$$

The last question does not specify the single fixed prefix 12.

## 96: adjacency of two particular volumes

Treat volumes 1 and 2 as one block. The block and the other 28 volumes make
29 distinguishable objects; the block has two internal orders.

$$
\text{б, adjacent}=2\cdot29!,\qquad
\text{а, nonadjacent}=30!-2\cdot29!=28\cdot29!.
$$

These exhaust and partition the `30!` linear arrangements.

## 97: equations and admissible domains

### а) `C_n^3 = (1/5) C_{n+2}^4`

Domain: integer `n>=3`; both binomial coefficients are positive.

$$
\frac{C_{n+2}^4}{C_n^3}
=\frac{(n+2)(n+1)}{4(n-2)}.
$$

The printed equation requires this ratio to equal 5:

$$
(n+2)(n+1)=20(n-2),
\qquad n^2-17n+42=(n-3)(n-14)=0.
$$

Both roots are admissible: **n=3 or 14**.
Direct checks: `C_3^3=1=(1/5)C_5^4`;
`C_{14}^3=364=(1/5)C_{16}^4`, since `C_{16}^4=1820`.

### б) `3 C_{2n}^{n-1} = 5 C_{2n-1}^n`

Domain: integer `n>=1`.

$$
\frac{C_{2n}^{n-1}}{C_{2n-1}^{n}}
=\frac{(2n)!}{(n-1)!(n+1)!}
 \frac{n!(n-1)!}{(2n-1)!}
=\frac{2n}{n+1}.
$$

Consequently `6n/(n+1)=5`, so **n=5**.
Direct check: `3 C_{10}^4=3*210=630=5*126=5 C_9^5`.

### в) `C_{2n}^{n+1}/C_{2n+1}^{n-1} = 7/13`

Domain: integer `n>=1`.

$$
\frac{C_{2n}^{n+1}}{C_{2n+1}^{n-1}}
=\frac{(2n)!}{(n+1)!(n-1)!}
 \frac{(n-1)!(n+2)!}{(2n+1)!}
=\frac{n+2}{2n+1}.
$$

`13(n+2)=7(2n+1)` gives **n=19**.
Substitution in the derived exact ratio gives `21/39=7/13`.

### г) `C_{2n-1}^n/C_{2n}^{n-1} = 9/17`

Domain: integer `n>=1`. This is the reciprocal of the ratio in б:

$$
\frac{C_{2n-1}^{n}}{C_{2n}^{n-1}}=\frac{n+1}{2n}.
$$

`17(n+1)=18n` gives **n=17**.
The resulting ratio is `18/34=9/17`.

All denominator cancellations use positive, defined binomial coefficients.
No discarded zero or out-of-domain candidate is reinstated.

## 98: neighboring binomial coefficients

Both subquestions have integer domain `n>=5`.

$$
\frac{C_n^5}{C_n^4}=\frac{n-4}{5}.
$$

а) Ratio less than 1: `n<9`, hence **n=5,6,7,8**.

б) Ratio greater than 1: `n>9`, hence **all integers n>=10**.

At `n=9` the two coefficients are equal, satisfying neither strict
inequality. Values below 5 are outside the stated combinatorial domain.

## 99: four inequalities

### а) `C_n^5 < C_n^3`

Domain: integer `n>=5`.

$$
\frac{C_n^5}{C_n^3}
=\frac{(n-3)(n-4)}{20}<1
\iff (n-8)(n+1)<0.
$$

Thus **n=5,6,7**. Equality at `n=8` is excluded.

### б) `C_{2n}^7 > C_{2n}^5`

Domain: integer `n>=4`.

$$
\frac{C_{2n}^7}{C_{2n}^5}
=\frac{(2n-5)(2n-6)}{42}>1
\iff 2(2n+1)(n-6)>0.
$$

Therefore **all integers n>=7**. Equality at `n=6` is excluded.

### в) `C_{19}^{k-1} < C_{19}^k`

Domain: integer `1<=k<=19`.

$$
\frac{C_{19}^{k}}{C_{19}^{k-1}}=\frac{20-k}{k}>1
\iff k<10.
$$

Thus **k=1,2,...,9**. Equality at `k=10` is excluded.

### г) `C_{15}^{k-2} > C_{15}^k`

Domain: integer `2<=k<=15`.

$$
\frac{C_{15}^{k-2}}{C_{15}^k}
=\frac{k(k-1)}{(17-k)(16-k)}>1.
$$

Both denominator factors are positive throughout the domain. Comparing
numerators gives

$$
k^2-k>272-33k+k^2
\iff 32k>272
\iff k>\frac{17}{2}.
$$

Hence **k=9,10,...,15**.

## 100: circles through triples of points

Each three-point subset determines one circle because the three points are
not collinear. Two different triples cannot determine the same circle:
their union would contain at least four given points on that circle,
contrary to the printed no-four-concyclic condition.

Thus the triple-to-circle map is injective and

$$
\text{number of distinct circles}=C_{10}^3=120.
$$

Dropping either of the two printed geometric restrictions would invalidate
this argument.

## 101*: binomial identity

Count ten-element subsets of `{1,2,...,21}` by their greatest element `m`.
Necessarily `m=10,11,...,21`. Once the greatest element is fixed, the other
nine are selected from `{1,...,m-1}`, in `C_{m-1}^9` ways.
These cases are disjoint and exhaustive, so

$$
C_{21}^{10}
=\sum_{m=10}^{21}C_{m-1}^9
=C_9^9+C_{10}^9+\cdots+C_{20}^9.
$$

This proof needs no undefined coefficient such as `C_9^{10}` and no
implicit zero-extension convention. The common numerical value is 352716.

## 102: simultaneous subsets of piano keys

Assume an outcome is identified by the selected key subset; no unprinted
acoustic equivalence identifies different subsets. Simultaneous pressing
adds no ordering factor.

$$
\sum_{r=3}^{10}C_{10}^r
=2^{10}-C_{10}^0-C_{10}^1-C_{10}^2
=1024-1-10-45
=968.
$$

## 103: chair, secretary and three editors

Choose the chair in 40 ways, the different secretary in 39 ways, then an
unordered three-person editor group from the remaining 38.

$$
40\cdot39\cdot C_{38}^3
=40\cdot39\cdot8436
=13160160.
$$

There is no factor `3!` for unspecified editor positions.

## 104: three soldiers and one officer

Select an unordered soldier triple and one of the five officers:

$$
C_{60}^3 C_5^1
=34220\cdot5
=171100.
$$

Ordering three unspecified sentry posts would add information absent from
the source.

## 105: chess-team membership

Independent unordered selections from the three printed categories give

$$
C_{10}^4 C_8^1 C_5^2
=210\cdot8\cdot10
=16800.
$$

This counts membership, not unprinted assignments to seven chess boards.

## 106: nonadjacent black balls, conditional on distinguishability

Assume integer `m,n>=0` with the printed `m>n`. First place the white balls
in a row; there are `m+1` gaps, including both ends. At most one black ball
can occupy each gap. Selecting `n` of these gaps guarantees, and uniquely
describes, the absence of adjacent black balls.

If balls of a given color are indistinguishable:

$$
\boxed{C_{m+1}^{n}}.
$$

If all individual balls are distinguishable, independently order the
white balls, choose the occupied gaps and order the black balls in them:

$$
\boxed{m!\,C_{m+1}^{n}\,n!}.
$$

For mixed conventions, omit only the factorial for the indistinguishable
color. For `n=0` these formulas correctly reduce to 1 or `m!`.

The printed `m>n` guarantees enough gaps but does not decide individual
distinguishability. Choosing one of these answers without declaring that
assumption would be unjustified; this is not an established source misprint.

## 107: bouquet selection

Under the stated individually selectable-flower convention:

$$
C_{10}^2 C_8^3=45\cdot56=2520.
$$

No additional factor for arranging a bouquet is specified. If flowers were
indistinguishable within each variety and only the color/variety composition
were recorded, the fixed composition would instead give one outcome; that
is a different object convention, not a mathematical correction to the
printed values.

## 108: coefficients equidistant from the ends

In

$$
(a+b)^n=\sum_{r=0}^{n}C_n^r a^{n-r}b^r,
$$

position `r+1` has binomial coefficient `C_n^r`; its reflected position
`n-r+1` has coefficient `C_n^{n-r}`.

$$
C_n^r=\frac{n!}{r!(n-r)!}=C_n^{n-r}.
$$

This proves the printed assertion. It does not assert equality of the
complete terms `C_n^r a^{n-r}b^r` and `C_n^{n-r}a^r b^{n-r}` for arbitrary
unequal `a,b`.

## 109: even-position sum and the target exponent

Number terms from 1, so even positions correspond to odd `r`. For `n>=1`,
the sums of odd and even binomial coefficients satisfy

$$
\sum_{r\ {\rm even}}C_n^r+\sum_{r\ {\rm odd}}C_n^r=2^n,
\qquad
\sum_{r\ {\rm even}}C_n^r-\sum_{r\ {\rm odd}}C_n^r=0.
$$

Thus the printed even-position coefficient sum is `2^{n-1}=32`, giving
**n=6**. The case `n=0` has no even-position term and cannot satisfy 32.

For the two printed radicals the general term is

$$
T_{r+1}
=C_6^r (y^{1/3})^{6-r}(y^{3/5})^r
=C_6^r y^{2+4r/15},
\qquad 0\le r\le6.
$$

Conditional on the preferred source reading `2.8=14/5`:

$$
2+\frac{4r}{15}=\frac{14}{5}
\iff 30+4r=42
\iff r=3.
$$

The requested term is therefore the **fourth term**:

$$
\boxed{T_4=C_6^3y^{14/5}=20y^{14/5}=20y^{2.8}}.
$$

Real-root domain check: let `y=t^{15}` with real `t`. Then the cube root
of `y` is `t^5`, and the fifth root of `y^3` is `t^9`. Their sixth-power
expansion has terms `C_6^r t^{30+4r}`. The target rational power `y^{14/5}`
is `t^{42}`. This verifies the result without imposing an unprinted
positivity restriction on `y`; the decimal exponent is treated exactly as
the rational number 14/5, not as a floating-point operation.

If the source dot were multiplication, the requested exponent would be
16. The expansion exponents range only from 2 to `18/5`; solving
`2+4r/15=16` would require `r=105/2`, outside the integer range 0-6.
There would be no such term.

That incompatibility supports the decimal interpretation but cannot
certify an ambiguous glyph or authorize an erratum. The answer remains
conditional on the recorded decimal reading; source-first.md preserves
the unresolved dot separately.

## 110: signed coefficient sum

The expansion is a polynomial in `x,y` with distinct exponent pairs:

$$
(5x^2-4y^3)^7
=\sum_{r=0}^{7}C_7^r5^{7-r}(-4)^r x^{14-2r}y^{3r}.
$$

Setting `x=y=1` sums its signed coefficients:

$$
\sum_{r=0}^{7}C_7^r5^{7-r}(-4)^r=(5-4)^7=\boxed{1}.
$$

This is neither the unsigned sum nor merely the sum of `C_7^r`.

## 111*: largest terms, not just largest coefficients

For positive summands `a,b` and `r=0,...,100`,

$$
T_{r+1}=C_{100}^r a^{100-r}b^r,
\qquad
\frac{T_{r+2}}{T_{r+1}}
=\frac{100-r}{r+1}\frac{b}{a}
\quad(0\le r<100).
$$

The ratio strictly decreases with `r`. Locate where it crosses 1:

а) `a=b=1/2`: ratio at `r=49` is `51/50>1`, and at `r=50` is
`50/51<1`. The unique maximum is `r=50`, hence **term 51**,
with value `C_{100}^{50}/2^{100}`.

б) `a=2/3,b=1/3`: ratio at `r=32` is `68/66>1`, and at `r=33`
is `67/68<1`. The unique maximum is `r=33`, hence **term 34**,
with value `C_{100}^{33}(2/3)^{67}(1/3)^{33}`.

в) `a=9/10,b=1/10`: ratio at `r=9` is `91/90>1`, and at `r=10`
is `90/99<1`. The unique maximum is `r=10`, hence **term 11**,
with value `C_{100}^{10}(9/10)^{90}(1/10)^{10}`.

There is no adjacent equal-maximum pair in any of these three cases.

## 112*: number of retained terms and a rounding qualification

Let `t_r=C_{10}^r(0.01)^r`, beginning at `r=0`, and let
`S_q=sum_{r=0}^{q-1} t_r` denote retaining the first q terms.
Every omitted term is positive. The exact expansion terms are

```text
r=0     1
r=1     0.1
r=2     0.0045
r=3     0.00012
r=4     0.0000021
r=5     0.0000000252
r=6     0.000000000210
r=7     0.00000000000120
r=8     0.0000000000000045
r=9     0.000000000000000010
r=10    0.00000000000000000001
```

Their exact sum is

$$
(1.01)^{10}=1.10462212541120451001.
$$

For an absolute truncation error below **0.001**, two terms are insufficient
because the next term alone is `0.0045>0.001`. Three terms give

$$
S_3=1.1045,\qquad
R_3=(1.01)^{10}-S_3=0.00012212541120451001<0.001.
$$

Thus the minimum is **3 terms**.

For an absolute truncation error below **0.000001**, four terms are
insufficient because the next term alone is `0.0000021>0.000001`.
Five terms give

$$
S_5=1.1046221,\qquad
R_5=(1.01)^{10}-S_5=0.00000002541120451001<0.000001.
$$

Thus the minimum is **5 terms**.

Independent tail bounds, without depending on the stated full decimal sum:

$$
\frac{t_{r+1}}{t_r}=\frac{10-r}{r+1}\,0.01.
$$

For the tail starting at `r=3`, subsequent ratios are at most `7/400`:

$$
R_3\le\frac{0.00012}{1-7/400}<0.000123<0.001.
$$

For the tail starting at `r=5`, subsequent ratios are at most `1/120`:

$$
R_5\le\frac{0.0000000252}{1-1/120}
<0.0000000255<0.000001.
$$

Both errors are also below half the respective precision unit, while the
previous truncations have errors larger than that half-unit.

If "精确到" requires a correctly rounded decimal display, the tie rule matters:

- Conventional decimal half-up rounding gives `S_3 -> 1.105`, the same
  three-decimal result as the exact value. `S_5 -> 1.104622` also matches
  the exact six-decimal result. Under that convention the answer is again
  **3 and 5**.
- `S_3=1.1045` is exactly a three-decimal midpoint. Naively rounding just
  this truncated sum with ties-to-even gives `1.104`, whereas the exact
  value rounds to `1.105`. If that procedure is required, **4 terms**
  are needed for the three-decimal output; 5 still suffice for six decimals.
  Alternatively, knowing the omitted tail is strictly positive resolves the
  midpoint upward without computing its next term.

The source does not specify a tie rule or that truncation-and-rounding
procedure. The primary answer **3,5** explicitly uses absolute-error
accuracy (also agreeing with customary half-up rounding). This qualification
is not a source misprint.

## Verdict and stop boundary

All complete printed exercises on the two authorized pages have independent
derivations. No definite mathematical source error is established.
Do not conflate a potentially unknown dot in 109, distinguishability in
106, or the precision convention in 112 with an approved correction.

Page 0050's inbound fragment remains unresolved; it cannot be solved without
its missing source request. Page 0051's final exercise 112* is closed before
the approved page-0052 chapter-start text. No claim is made about earlier N11
pages, candidate fidelity, candidate answers/options, figures, rendering,
publication or production acceptance.

Actual original image views remain exactly 2, one per specified page.
Only the two assigned reports were created. Initial freeze is complete;
candidate comparison is NOT PERFORMED. Stop here pending an explicit later
request.
