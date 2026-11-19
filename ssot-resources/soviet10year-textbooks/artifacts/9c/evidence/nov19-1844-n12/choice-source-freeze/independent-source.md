# STEMROBIN-184B / n12 / Stage 1

Source mathematics only. All 6 parts of 113 and all 4 parts of 114 were solved
before access to author questions, options, reasoning or keys. This document is
not a formal choice review and grants no choice-package approval. Mechanical
finalize/render success supplies no mathematical approval.

Root: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck`

Authority: current canonical
`ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c3-s1-n12/`
exercise prose and unsolved lesson definitions. Metadata and exercise projections
confirm **0 images**. No solved examples, parent answers, author active outputs,
keys, historical material, adaptation audit or render reports were consulted.
The session router `.intentfold/readme.md` was read for governance only.

## Input Bytes

Snapshot observed at `2026-11-19T16:04:14.022Z`; timezone `Europe/Dublin`.
SHA-256 below hashes actual file bytes, not a stored manifest hash.

| File within canonical n12 directory | Bytes | Byte SHA-256 |
| --- | ---: | --- |
| `lesson.json` | 17874 | `0b6cd64d5d9221644cd480c06531d0be68bdb963cd9cc4ed1b9764a7075746f3` |
| `exercises.json` | 3767 | `73248f6bdbd017c52987168541db3df2cac3c554d4fadc121818c5b7401fa03f` |
| `figures.json` | 153 | `8ca3f81abbe72289c4a3619f53b36b1dd8e25136db824725166541e71c5dbed8` |

The JSON records byte hashes of `SKILL.md`, `references/review.md` and
`references/contract.md` too. `freeze.json` binds all six inputs and both
independent-source output files, with the freeze time. No seed was manufactured.

## Definitions And Scope

Selected zero-based lesson blocks: 4 and 5, only their initial rules before
numeric examples; 6, 7, 10 and 12, general definitions/conventions in full;
8, 11 and 13, only the text before the first example marker.

Write

$$r=m+u,\qquad m\in\mathbb Z,\quad 0\le u<1.$$

Then $m\le r<m+1$, so $m=\lfloor r\rfloor$. For a negative noninteger, this is
not truncation toward zero. The notation

$$\overline{n}.d_1d_2\ldots=-n+0.d_1d_2\ldots$$

bars **only the integer digits**. It does not denote the negative of the whole
decimal magnitude. An ordinary leading minus in the exercise prose has its
ordinary whole-magnitude scope.

Terminating decimals use infinitely many trailing zeros. Eventually-all-nine
equivalent expansions are excluded. For equal integer parts, the first different
fractional digit decides the order, including with negative integer parts.
There is no second sign reversal after converting to barred notation.

The all-nine exclusion matters: equality can otherwise arise at a first different
digit by exact compensation from an all-nine tail versus an all-zero tail.
Repetition below is written with digits and ellipsis, leaving integer-bar scope
unambiguous.

## Exercise 113

Task: write each source number as an infinite decimal.

### a) $7$

$7\le7<8$ gives $m=7$ and $u=0$. Thus

$$7=7.000000\ldots.$$

Boundary: $u=0$ is permitted at the lower endpoint of $[7,8)$. The zero tail
starts at fractional position 1. Although $6.999999\ldots$ is equal as a real
number, it is not the permitted standard expansion.

### b) $12.38$

$12\le12.38<13$, so $m=12$ and $u=0.38=19/50$. Preserve the two given digits,
then extend with zeros:

$$12.38=12.380000\ldots.$$

Boundary: $0\le19/50<1$; the zero tail starts at position 3. Appending recurring
8s would change the value. The equivalent $12.379999\ldots$ is excluded.

### c) $-7.935$

$-8\le-7.935<-7$ gives $m=-8$. The nonnegative fractional part is

$$u=-7.935-(-8)=0.065=13/200.$$

Therefore

$$-7.935=\overline{8}.065000\ldots=-8+0.065000\ldots.$$

Boundary: the floor interval is $[-8,-7)$, and the leading fractional zero is
essential. Choosing integer part $-7$ would require forbidden fractional part
$-0.935$. Negating the whole displayed magnitude $8.065$ would instead give
$-8.065$. Ordinary $-7.935000\ldots$ is numerically equivalent but uses another
minus scope. The zero tail starts at position 4; the equal representation
$-8+0.064999\ldots$ is excluded.

### d) $\frac14$

$0\le1/4<1$, so $m=0$ and $u=1/4=25/100$:

$$\frac14=0.250000\ldots.$$

Boundary: the floor interval is $[0,1)$; zero is not barred. Reduced denominator
$2^2$ permits termination. The zero tail starts at position 3; equal
$0.249999\ldots$ is excluded.

### e) $-\frac14$

$-1\le-1/4<0$ gives $m=-1$ and

$$u=-1/4-(-1)=3/4=0.75.$$

Hence

$$-\frac14=\overline{1}.750000\ldots=-1+0.750000\ldots.$$

Boundary: for this negative noninteger below unit magnitude, the fractional part
is $1-1/4$, not $1/4$. Barred $1.250000\ldots$ would mean $-3/4$. Negating the
whole magnitude $1.750000\ldots$ gives $-7/4$. Ordinary $-0.250000\ldots$ is
numerically equal with whole-magnitude minus scope. The zero tail starts at
position 3; $-1+0.749999\ldots$ is excluded.

### f) $-\frac23$

$-1\le-2/3<0$, so $m=-1$ and $u=1/3$. Division gives digit 3 and remainder 1
at every step. Equivalently,

$$\sum_{k=1}^{\infty}\frac3{10^k}
=\frac{3/10}{1-1/10}=\frac13.$$

Consequently

$$-\frac23=\overline{1}.333333\ldots=-1+0.333333\ldots.$$

Boundary: this is a nonzero repeating tail, period 3 from position 1.
Denominator 3 cannot divide a power of 10, so no finite zero-tail expansion is
exact. Truncation after $N$ fractional 3s yields
$-2/3-1/(3\cdot10^N)$, strictly below the infinite value. Barred
$1.666666\ldots$ means $-1/3$, while a whole-magnitude negative reading of
$1.333333\ldots$ gives $-4/3$. Ordinary $-0.666666\ldots$ is equal, but its
magnitude's repeating 6 is not the required barred fractional tail's repeating 3.

## Exercise 114

Task: compare each source pair. Position 0 is the integer part; fractional
positions 1, 2, ... count from the decimal point.

### a) $17.586631$ and $17.586897$

Integer parts agree at 17. Fractional positions 1 through 3 agree at 5, 8, 6.
At position 4, $6<8$, hence

$$17.586631<17.586897.$$

Exact left-minus-right difference:
$-266/10^6=-133/500000$.

Boundary: the deciding place is the fourth fractional digit, ten-thousandths.
Both zero tails begin at position 7. Later digits cannot reverse the strict
comparison under the standard convention.

### b) $-2.37561$ and $-2.37571$

Both integer parts are $-3$, since both numbers lie in $[-3,-2)$:

$$-2.37561=\overline{3}.624390000\ldots,$$
$$-2.37571=\overline{3}.624290000\ldots.$$

The first three fractional digits agree at 6, 2, 4. At position 4, $3>2$:

$$-2.37561>-2.37571.$$

Exact left-minus-right difference: $0.00010=1/10000$.
The ordinary-magnitude check also agrees: $2.37561<2.37571$, and negation
reverses that ordinary comparison.

Boundary: do not reinterpret the source's ordinary minus as an integer bar.
After the proper conversion, the digits are 3 and 2, not the magnitude digits
6 and 7. Do not reverse the barred fractional comparison again. Both zero
tails start at position 6; the difference is not zero.

### c) $-0.786$ and $0.687$

Directly, $-0.786<0<0.687$. In the lesson's representation,

$$-0.786=\overline{1}.214000\ldots,\qquad
0.687=0.687000\ldots.$$

Integer parts $-1<0$ already decide the order at position 0:

$$-0.786<0.687.$$

Exact left-minus-right difference: $-1.473=-1473/1000$.

Boundary: the left integer part is $-1$, not negative zero. Comparing unsigned
786 and 687 ignores the deciding sign/integer difference. Both source values
are nonzero and both zero tails start at position 4.

### d) $0.2444444444\ldots$ and $0.244$

The displayed run of 4s followed by ellipsis denotes recurring 4s after the
initial nonrepeating digit 2. Both integer parts are zero; fractional positions
1 through 3 agree at 2, 4, 4. The finite right value is $0.244000\ldots$.
At position 4, $4>0$, therefore

$$0.2444444444\ldots>0.244.$$

Independently,

$$0.244444\ldots
=\frac15+\sum_{k=2}^{\infty}\frac4{10^k}
=\frac15+\frac2{45}=\frac{11}{45},$$

$$\frac{11}{45}-\frac{244}{1000}
=\frac{11}{45}-\frac{61}{250}
=\frac1{2250}>0.$$

Boundary: a shared finite prefix is not equality; the fourth digit is needed.
The repeating period is 4 from position 2, not the block 244. The conventional
recurring-tail meaning is used, not an arbitrary unspecified continuation.
If continuation were explicitly declared arbitrary, a finite prefix alone
would not determine the exact rational; the source makes no such declaration.
For the recurring left value truncated after $N\ge4$ digits, its positive gap
over $0.244$ is
$(1/2250)(1-10^{-(N-3)})$, tending to $1/2250$.

## Verification And Stop

Local exact BigInt rational arithmetic independently reproduced the integer
parts $(7,12,-8,0,-1,-1)$, fractional parts
$(0,19/50,13/200,1/4,3/4,1/3)$, and the four exact comparison differences
listed above. Mathematical evidence is the per-part reasoning, not an exit
status.

All 10 source parts are frozen. Choice-task fidelity, redundancy, leakage,
question coverage, every-option truth and author-key agreement remain
unassessed.

Stop after returning these paths and hashes. Await the parent's completed seed
and view-only package for Stage 2. Independently freeze every visible question
and every option before receiving an author key. Do not overwrite this source
freeze or turn it into an approval record.
