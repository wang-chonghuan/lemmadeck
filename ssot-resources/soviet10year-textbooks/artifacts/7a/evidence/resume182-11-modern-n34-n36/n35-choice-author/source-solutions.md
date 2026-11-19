# Frozen Independent Source Solutions

Status: all seven written originals solved independently before any options.
Formal seed PREPARE is waiting for the parent's modern-finalize notice.
These are internal author work, not learner-facing content or an answer-key lookup.
Do not alter this file to match later options.

## Authority and Definitions

Current modern authority:
- `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s1-n35/lesson.json`
  SHA-256 `332e6059405170221cb64f4a949b47dbae2da32908a9a98fe6a4d2f3ecdae0df`.
- `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s1-n35/exercises.json`
  SHA-256 `f3b226eb11e093235ff8098a62678658382ca50bf28bf99fe231388215c1813a`.

Intended definition paragraph whitelist: 0, 6, 15, 16.
Block 0 states the real square-root domain including zero. Its initial statement
"when x > 0 the radical is meaningful" is true and sufficient, not an iff statement;
the following sentence and domain explicitly include zero. No erratum is proposed.
Block 6 states strict increase for nonnegative arguments.
Blocks 15 and 16 state range and the mapping from the nonnegative ray to itself.
Exclude blocks 2, 3, 5, 7-11, 14 and the numerical table: no solved examples,
worked proof, plotted numerical results or mixed definition/example paragraph
will be copied into the formal seed. Include fig-54 through `--concept-figure`
because the generic graph references in 754 and 758 have empty explicit figure lists.

## One-Time Graph Observations

The before-view ledger is `image-ledger-before-view.json`.
Exactly two images were opened once each, with no pages, crops or reopens.

Original graph54: SHA-256
`480bb2e509e6e900b0d620376a1ddf4932fe3ae98fdbff66ca893696f27be46d`.
The original shows a densely ruled coordinate grid, an increasing concave-down
curve from the origin in the first quadrant, the label y = sqrt(x), readable
x-axis labels 0 through 9 and readable y-axis labels 1, 2, 3. An upper y-axis
label is obscured and supplies no numerical datum. The right edge of the
curve is not a labelled terminal value and supplies no endpoint claim.
The curve is near (4,2) and (9,3). Vertical readings at x = 2.5, 5.5, 8.4
are about 1.6, 2.3, 2.9. Horizontal readings at y = 1.2, 1.7, 2.5
give x about 1.4, 2.9, 6.3. These are approximate visual readings, not
exact values measured from pixels.

Current B complete preview: SHA-256
`8c039a4a34d3a0907232252da287db8f395b402ce4d070769c947fc4cb587a49`.
The complete preview shows the coordinate grid, readable x labels 0-9,
y labels 1-3, the square-root label, and an increasing concave-down curve
from the origin. It supports the same queried approximate readings and
the crossing near (4,2). No upper obscured source label or right-edge
endpoint value is inferred. Independent figure approval belongs to the
parallel gate; this observation is not a figure approval.

## 754: Six Graph Readings

Task a: determine y for x = 2.5, 5.5, 8.4 by vertical graph reading.
Observed approximate ordered values: (1.6, 2.3, 2.9).
Task b: determine x for y = 1.2, 1.7, 2.5 by horizontal graph reading.
Observed approximate ordered values: (1.4, 2.9, 6.3).

Reference calculation only, not a claim of exact graph reading:
sqrt(2.5) = sqrt(10)/2, approximately 1.5811;
sqrt(5.5) = sqrt(22)/2, approximately 2.3452;
sqrt(8.4) = sqrt(210)/5, approximately 2.8983.
Squaring the three supplied y values gives 1.44, 2.89, 6.25 exactly
as algebraic reference coordinates. This does not make the graph readings exact.
The forward/reverse distinction is which coordinate is fixed and which is read.
Choosing approximate ordered triples will lose independent drawing of projection
lines and self-produced readings; retain the actual graph and disclose that loss.

## 755: Four Point-Membership Tasks

A(64,8) belongs: 64 >= 0, 8 >= 0, and 8^2 = 64.
B(10000,100) belongs: 10000 >= 0, 100 >= 0, and 100^2 = 10000.
C(-81,9) does not belong: a negative x is outside the real domain.
D(25,-5) does not belong: sqrt(25) = 5, not -5; the principal root is nonnegative.
The equivalent test is x >= 0, y >= 0, y^2 = x. Squaring alone is insufficient.

## 756: Four Comparisons

a: sqrt(68) < sqrt(72), since 0 <= 68 < 72.
b: sqrt(0.12) > sqrt(0.015), since 0.12 = 0.120 > 0.015.
c: sqrt(24.7) < 5, since 5 = sqrt(25) and 24.7 < 25.
d: 8 > sqrt(60), since 8 = sqrt(64) and 64 > 60.
Every comparison is justified on the nonnegative square-root domain.
The distinction is comparison of radicands after expressing a positive integer
as its own principal square root, not comparison of a radicand directly to the integer.

## 757: Four Bounds / Interval-Image Tasks

a: for 0 <= x <= 4, exactly 0 <= sqrt(x) <= 2, with both endpoints attained.
b1: [0,9] maps onto [0,3].
b2: [100,400] maps onto [10,20].
b3: ]0.01,1[ maps onto ]0.1,1[; neither endpoint is attained.
Strict increase sends the endpoint values in order. Surjectivity onto each claimed
image follows because y in that image is nonnegative and x = y^2 lies in the
specified input interval. Endpoint openness is preserved here.

## 758: Three Graph-Based Solution-Set Tasks

The graph crosses the horizontal level y = 2 near (4,2), in agreement with the
exact defining relation sqrt(4) = 2. On the domain x >= 0 it is strictly increasing.
a: sqrt(x) = 2 iff x = 4.
b: sqrt(x) > 2 iff x > 4.
c: sqrt(x) < 2 iff 0 <= x < 4.
The finite visible window does not restrict the function's full domain;
continuation and uniqueness are justified by the supplied square-root definition
and monotonicity, not an invented terminal graph coordinate.
Choice recognition retains the graphical comparison but loses drawing the
horizontal line, marking the intersection and producing the explanation.

## 759: Nine Distinct Requested Conditions

All statements concern real x in the square-root domain x >= 0.
Squaring is order-preserving between the nonnegative quantities involved.

a1 sqrt(x) = 10: {100}.
a2 sqrt(x) >= 10: [100,+infinity[.
a3 sqrt(x) <= 10: [0,100].

b1 sqrt(x) = sqrt(7): {7}.
b2 sqrt(x) > sqrt(7): ]7,+infinity[.
b3 sqrt(x) < sqrt(7): [0,7[.

c1 sqrt(x) = 2: {4}.
c2 sqrt(x) > 2: ]4,+infinity[.
c3 sqrt(x) < 2: [0,4[.

Do not merge 759c into 758 or drop either equation or inequality in any row.
Equality identifies a singleton; a strict inequality excludes its threshold;
a non-strict inequality includes it. Every lower solution interval includes zero.
In each row the three conditions form one coherent threshold task, suitable for
complete ordered solution-set triples. Future alternatives must vary every
independent requested output across the option set: no correct singleton,
threshold, domain bound or solution set may be a constant shared by all options.

## 760: Six Domains

a (12y-1)/y: all real y except 0. The numerator imposes no restriction.
b (3x+1)/(15x-4): all real x except 4/15, solving 15x-4 != 0.
c (13x+7)/(2|x|-6): all real x except -3 and 3, because |x| != 3.
d (3x^2-x)/(4|x|+8): all real x, because 4|x|+8 >= 8 > 0.
e sqrt(6-2x): x <= 3, because 6-2x >= 0 and division by -2 reverses order.
f sqrt((5-x)/(x^2+1)): x <= 5. The denominator is strictly positive
for every real x, since x^2+1 >= 1. Thus nonnegativity of the quotient
is equivalent to 5-x >= 0. There is no real denominator zero and no
exclusion of x = 0, x = -1 or x = 1; x = 5 is allowed.

The rational tasks distinguish zero-denominator exclusions from numerator roots;
the radical tasks distinguish nonnegative radicands from strictly positive ones.

## Coverage Count

754: 6; 755: 4; 756: 4; 757: 4; 758: 3; 759: 9; 760: 6.
Total: 36 written tasks across all 7 original numbers.
No task is mathematically unsolved or deferred. Graphical production capacities
will be explicit choice-format losses, not falsely certified as preserved writing.
No options, question keys, old interaction architecture or answer candidates
were inspected or constructed before this freeze.
