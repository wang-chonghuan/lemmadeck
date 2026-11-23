# N19 independent source solving

Author-only, key-blind, offline source record. This file is written before the
choice draft and frozen before constructing options. It contains no option IDs
or choice keys. Authority is only the prepared seed.json in this directory.

Seed canonical SHA-256:
f509542a201c44b67e77c391e9ed17248b19b32abb2e21c1d365c02afc13e2df

Seed byte SHA-256:
a20c4d9ef3bc645734a72ba713dfeb9ed96ea0ac92ce0cd97920dd4a154c09a6

Selected written exercises: 148, 149, 150, 151, 152.
Selected definition blocks: 5, 7, 8, 14, 21.
Original figures: none. All tasks are symbolic; no new diagram is needed.

## Conditions and definitions

Blocks 5, 7 and 8 define a sequence as a numerical function whose domain is
N = {1, 2, 3, ...}. In particular, every index below is a positive integer;
zero is not an index and the first five terms have indices 1 through 5.
Block 14 says an analytic formula computes the term from its index.
Block 21 specifies recurrence data as a first term together with a rule for
computing the next term for n >= 1. Its reference to an example supplies no
extra task facts here; only the supplied definition is used.

All formulas in the seed have unambiguous grouping. All denominators in the
selected tasks are nonzero on the specified domain. There are no missing
figures, unresolved conventions, source answers or external facts to consult.

## Exercise 148(a): evaluation, successor and difference

The learner must evaluate two specified terms, substitute n+1 for every
occurrence of n, and compute the exact difference of adjacent terms.

x_n = (2n+1)/(n+3).
x_10 = (2*10+1)/(10+3) = 21/13.
x_25 = (2*25+1)/(25+3) = 51/28.
x_(n+1) = [2(n+1)+1]/[(n+1)+3] = (2n+3)/(n+4).

Using a common denominator,
x_(n+1) - x_n
= [(2n+3)(n+3) - (2n+1)(n+4)]/[(n+3)(n+4)]
= [(2n^2+9n+9) - (2n^2+9n+4)]/[(n+3)(n+4)]
= 5/[(n+3)(n+4)].

This holds for every n >= 1. The distinction is between a term's value, its
index-shifted expression and the difference of two rational expressions;
index substitution must affect the entire formula.

## Exercise 148(b): evaluation, successor and ratio

The learner must evaluate two specified terms, advance the index in both the
numerator and the exponential denominator, and divide adjacent terms.

b_n = n/3^n.
b_3 = 3/27 = 1/9.
b_5 = 5/243.
b_(n+1) = (n+1)/3^(n+1).
b_(n+1)/b_n = [(n+1)/3^(n+1)] * [3^n/n] = (n+1)/(3n).

The division is valid because b_n is positive for n >= 1. The exponent changes
with the index, and the ratio is not a constant: both the linear numerator and
the power of three matter.

## Exercise 149(a): first five terms of 1 + 1/2^n

The learner must map indices 1, 2, 3, 4, 5 to an ordered five-term prefix.

y_1 = 1+1/2 = 3/2.
y_2 = 1+1/4 = 5/4.
y_3 = 1+1/8 = 9/8.
y_4 = 1+1/16 = 17/16.
y_5 = 1+1/32 = 33/32.

Complete prefix: (3/2, 5/4, 9/8, 17/16, 33/32).
The leading 1 lies outside the fraction; the denominator is exponential, not
the product 2n, and enumeration starts at n=1.

## Exercise 149(b): first five terms of 2^n + 1/2^n

The learner must evaluate the exponential term and its reciprocal at the same
index, then add them in order.

x_1 = 2+1/2 = 5/2.
x_2 = 4+1/4 = 17/4.
x_3 = 8+1/8 = 65/8.
x_4 = 16+1/16 = 257/16.
x_5 = 32+1/32 = 1025/32.

Complete prefix: (5/2, 17/4, 65/8, 257/16, 1025/32).
The same exponent n governs both summands; a power, a product and a reciprocal
are different operations.

## Exercise 149(c): first five terms of 2 + 3/n

The learner must evaluate the reciprocal-index contribution without extending
its denominator to the leading constant.

a_1 = 2+3 = 5.
a_2 = 2+3/2 = 7/2.
a_3 = 2+1 = 3.
a_4 = 2+3/4 = 11/4.
a_5 = 2+3/5 = 13/5.

Complete prefix: (5, 7/2, 3, 11/4, 13/5).
Only 3 is divided by n; the index starts at 1 and the reciprocal is not 3n.

## Exercise 149(d): first five terms of (2n + (-1)^n)/(3n)

The learner must evaluate parity together with the linear numerator and divide
the entire numerator by 3n.

b_1 = (2-1)/3 = 1/3.
b_2 = (4+1)/6 = 5/6.
b_3 = (6-1)/9 = 5/9.
b_4 = (8+1)/12 = 3/4.
b_5 = (10-1)/15 = 3/5.

Complete prefix: (1/3, 5/6, 5/9, 3/4, 3/5).
(-1)^n is -1 at odd indices and +1 at even indices. The parenthesized sum, not
just its second term, is divided by 3n.

## Exercise 150: all indices for a strict lower bound

The learner must determine every positive-integer index satisfying the bound,
not merely find one qualifying term or the first such term.

2n-5 > 200 iff 2n > 205 iff n > 205/2 = 102.5.
With n a positive integer, the complete solution is n in {103, 104, 105, ...}.
Boundary check: y_102 = 199 does not qualify; y_103 = 201 qualifies. Since the
expression increases by 2 at each step, every larger index also qualifies.

The distinction is the strict inequality, integer index restriction, and full
infinite tail rather than its first element.

## Exercise 151: all indices for a non-strict upper bound

The learner must determine every positive-integer index satisfying the upper
bound and retain the domain's lower endpoint.

3n-100 <= 30 iff 3n <= 130 iff n <= 130/3 = 43 + 1/3.
Intersecting with {1, 2, 3, ...} gives n in {1, 2, ..., 43}.
Boundary check: y_43 = 29 qualifies; y_44 = 32 does not. The expression is
increasing, so all indices from 1 to 43 and no larger indices qualify.

The distinction is the upper bound's integer endpoint, its direction, and the
positive-integer domain. Non-strictness does not admit n=44 here.

## Exercise 152(a): additive recurrence and analytic formula

The learner must generate the ordered first five terms from the initial value
and recurrence, then give a formula valid for every positive-integer index.

x_1 = -10.
x_2 = -10+5 = -5.
x_3 = -5+5 = 0.
x_4 = 0+5 = 5.
x_5 = 5+5 = 10.

Complete prefix: (-10, -5, 0, 5, 10).
Reaching index n from index 1 requires n-1 increments of 5, so
x_n = -10 + 5(n-1) = 5n-15, n >= 1.

Verification: the formula gives x_1=-10. If x_n=5n-15, then
x_(n+1)=x_n+5=5n-10=5(n+1)-15. Thus it satisfies both recurrence conditions
and, by repeated application of the given rule, gives every term uniquely.

The distinction is between an additive step and a multiplier, and between n
increments and n-1 increments from the specified first term.

## Exercise 152(b): alternating recurrence and analytic formula

The learner must repeatedly negate the preceding term and express its parity
dependence with the correct initial phase.

x_1 = 4.
x_2 = -4.
x_3 = -(-4) = 4.
x_4 = -4.
x_5 = 4.

Complete prefix: (4, -4, 4, -4, 4).
There are n-1 negations between indices 1 and n, so
x_n = 4(-1)^(n-1), n >= 1.

Verification: x_1=4(-1)^0=4, and
-x_n = -4(-1)^(n-1) = 4(-1)^n = x_(n+1).
Thus both recurrence conditions hold for all n >= 1. Equivalently the terms
are 4 at odd indices and -4 at even indices.

The distinction is repeated negation rather than a constant additive step,
and the phase determined by the given first term.

## Source completeness before response design

All ten tasks above are resolved using only the selected seed and its five
definition blocks. No source task is deferred or convention-dependent.
Choosing an answer later cannot certify unaided written calculation or formula
construction; any such response-format loss must be recorded in the draft's
intent and coverage rather than described as preserved production ability.
No figure generation, actual-image inspection or service call is needed.
