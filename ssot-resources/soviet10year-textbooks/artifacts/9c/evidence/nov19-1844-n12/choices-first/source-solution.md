# n12 Source-First Independent Solution

Author scope: STEMROBIN-184B, one-shot offline n12 author. This is an internal
solution of the written source, not a question draft or a semantic review.

## Input and Conventions

The single newly prepared seed selects book `9c`, lesson `ana9-c3-s1-n12`,
written exercises 113 and 114, and definition paragraphs 6, 7, 10, 12.
There are no figures. No answer material, old choices, interaction definitions,
history, images, PDFs, model services or other lessons are used.

Those definitions describe `r = a0 + 0.a1a2...`, with integer `a0` and decimal
digits from 0 through 9. Finite decimals take an infinite zero tail; an
eventually-all-nine alternative is not the selected standard expansion.
Thus the nonnegative decimal part lies in `[0,1)` and `a0 = floor(r)`.

The inspect projection's negative-integer notation rule places the overline
only on the integer part. Its mixed worked-example paragraph is not selected
as a definition seed and its example calculation is not used as a solution.
Here `\overline{m}.d1d2...` explicitly means `-m + 0.d1d2...`, not the negative
of the entire decimal. This convention will be stated in relevant new stems.

## Exercise 113: All Six Independent Conversions

### 113a: 7

`floor(7) = 7`, and `7 - 7 = 0`. Hence the integer part is 7 and every
fractional digit is zero:

`7 = 7.000000...`.

This is an infinite representation even though every digit of its tail is zero.
`6.999999...` has the same numerical limit but is not the selected standard
representation.

### 113b: 12.38

`12.38 = 619/50 = 12 + 19/50`. The fractional part
`19/50 = 38/100 = 0.38`. Appending zeros to the right does not change it:

`12.38 = 12.380000...`.

The first two fractional digits are 3 and 8; all later digits are zero.

### 113c: -7.935

`-7.935 = -7935/1000 = -1587/200`. Since
`-8 <= -7.935 < -7`, the integer part is -8, not -7.
The nonnegative remainder is
`-7935/1000 - (-8) = 65/1000 = 13/200 = 0.065`.

`-7.935 = -8 + 0.065 = \overline{8}.065000...`.

The fractional digits begin 0, 6, 5, then stay zero. The leading zero after
the decimal point is necessary. The overline does not negate this remainder.

### 113d: 1/4

The integer part is zero. Division gives `10 = 4*2 + 2`, followed by
`20 = 4*5 + 0`. These steps yield fractional digits 2 and 5 and a terminating
remainder; the standard infinite tail is then zero:

`1/4 = 0.250000...`.

Its fractional part is `25/100 = 1/4`.

### 113e: -1/4

`-1 <= -1/4 < 0`, so the integer part is -1. The fractional part is
`-1/4 - (-1) = 3/4`. Division gives
`30 = 4*7 + 2` and `20 = 4*5 + 0`, so it is `0.75`.

`-1/4 = -1 + 3/4 = \overline{1}.750000...`.

The ordinary negative magnitude `0.25` is not the nonnegative fractional
part in this signed-integer notation.

### 113f: -2/3

`-1 <= -2/3 < 0`, so the integer part is -1. The fractional part is
`-2/3 - (-1) = 1/3`. In long division, `10 = 3*3 + 1`; the same remainder
1 returns after every step, so the digit 3 repeats without termination.
Equivalently,
`sum(3/10^k, k=1..infinity) = (3/10)/(1-1/10) = 1/3`.

`-2/3 = -1 + 1/3 = \overline{1}.333333...`.

This is a recurring nonzero tail, not a finite prefix followed by zero.

## Exercise 114: All Four Independent Comparisons

### 114a: 17.586631 and 17.586897

Both integer parts are 17. Their first three fractional digits are 5, 8, 6.
At the fourth fractional digit, the left has 6 and the right has 8.
That is the first differing position, and `6 < 8`, hence

`17.586631 < 17.586897`.

Exact check: right minus left is
`(17586897 - 17586631)/1000000 = 266/1000000 = 133/500000 > 0`.

### 114b: -2.37561 and -2.37571

Both integer parts are -3 in the lesson's convention:
`-2.37561 = -3 + 0.62439`,
`-2.37571 = -3 + 0.62429`.
The first three fractional digits are 6, 2, 4. At the fourth digit,
`3 > 2`, so the left is larger:

`-2.37561 > -2.37571`.

Exact check: left minus right is
`(-237561 + 237571)/100000 = 10/100000 = 1/10000 > 0`.
The ordinary magnitudes obey `2.37561 < 2.37571`; negation reverses that order.

### 114c: -0.786 and 0.687

`-0.786 = -1 + 0.214` has integer part -1.
`0.687 = 0 + 0.687` has integer part 0.
The integer parts already settle the comparison because `-1 < 0`:

`-0.786 < 0.687`.

It is also a negative number compared with a positive number.
Exact check: right minus left is
`(687 + 786)/1000 = 1473/1000 > 0`.
Comparing only the magnitudes would discard an essential sign condition.

### 114d: 0.2444444444... and 0.244

Here every fractional digit after the initial 2 on the left is 4.
The right has standard expansion `0.2440000000...`.
Both integer parts are zero and their first three fractional digits are
2, 4, 4. The fourth digit is 4 on the left and 0 on the right. Hence

`0.2444444444... > 0.244`.

The left equals
`2/10 + sum(4/10^k, k=2..infinity)
 = 1/5 + (4/100)/(1-1/10) = 11/45`.
The right is `244/1000 = 61/250`, so their positive difference is
`11/45 - 61/250 = (2750-2745)/11250 = 1/2250`.
It is not legitimate to discard the repeating tail or await a nonexistent
last fractional digit before deciding the order.

## Task Coverage Before Options

All ten source tasks have determinate independent solutions under the supplied
standard convention. There is no mathematical omission or figure-dependent
blocker. Six complete representations and four complete pair comparisons are
the source response units. New choice responses can recognize those completed
results and their decisive structure, but cannot establish that the learner
independently wrote an expansion, performed long division, or produced a
comparison argument without visible alternatives. Those production losses must
remain explicit in the later draft coverage.

No question alternatives or option keys are present in this frozen solution.
Semantic review of any future draft remains assigned to another reviewer.
