# n42 Independent Source Solutions: Stage1 Only

Ticket: STEMROBIN-182.
Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.
Owner: `resume182-13/n42-choice-review/` only.

This is the source-only checkpoint before candidate disclosure. I did not author
the seed, options or figures. I have not read author notes, drafts, views, author
solves, coverage, draft hashes, answer keys or new figures. No candidate or package
approval is issued here. Stage2 requires the parent's later disclosure.

## Input Binding

- Seed: `n42-choice-author/seed.json`.
- Seed byte SHA-256: `fa5f3a648841b17ea459a3bad31a5701b9d89746d86d70ef35bc58187a53ead5`.
- Seed canonical SHA-256: `f2b1ddedd65a6580839232eace5c4252fb608047d0d2caa75778d1b08142ae6a`.
- Source: book `7a`, lesson `alg7-c4-s3-n42`, exercises 851-854.
- Definitions: blocks 3, 4, 6 and 9 only, as included in the seed.
- The seed declares no figures, including no exercise figure references.
- The seed trace was not followed or refreshed. No lesson/answer/configuration
  files were opened through it.

The permitted current Figure58 spec was parsed for the given correspondence only.
It names the original PNG and the worked example $x^2=8-2x$. Figure58 is not a
graph of exercise 852 or the six equations in 853. I did not follow the spec's
render, review or prior-evidence references, or use its example roots as answers
to these exercises.

## Actual Image Observation

Image-call budget: 2. Calls made: 2. Images successfully loaded: 1.
Reopens/crops/historical reloads: 0.

1. Original `7a/figures/fig-58.png` was opened once.
   SHA-256: `a2983bfa283fa37d7b6d3f9171a61ceb3463b502bb47ab1263438405a834e600`.
   The full tall scan is visible through its upper ends, rightmost arrow and
   descending-line endpoint, and bottom grid with -1 and -2. The shared
   coordinate grid has half-unit subdivisions. The upward parabola is labelled
   $y=x^2$ and touches the origin. The descending solid line is labelled
   $y=8-2x$, crosses the vertical axis at 8, and meets the parabola at A near
   $(-4,16)$ and B near $(2,4)$. Dashed vertical projections go to -4 and 2 on
   the horizontal axis. Both parabola branches, both intersections, grid,
   unit labels and axis names are visible. The worked example teaches reading
   **abscissae**, not the intersection ordinates.
2. Current durable `7a/editions/modern-us-neutral/figures/fig-58.svg` was
   attempted once with the local image viewer.
   SHA-256: `e6435c66458c89e6c525021500e92579b20cffd3779f088272b6b80e1d4539c8`.
   The tool returned `unable to process image: invalid or unsupported image data`.
   No SVG pixels were displayed, so **no visual inspection or approval of this
   SVG is claimed**. No retry or replacement image was loaded.

Current spec SHA-256:
`d9b94a16c553bb43293e3d3cf8b79317c09653deea007bc7989d86eb68041466`.
Its given correspondence agrees with the original pixels. This correspondence
check is not an independent authored-diagram gate or promotion.

## Task Inventory

All 17 written-source tasks are independently solved below:

| Source | Distinct tasks | Count |
| --- | --- | --- |
| 851 | Six coefficient triples and the complete monic classification | 7 |
| 852 | Equality, strict less-than, strict greater-than | 3 |
| 853 | Six complete graphical equations, a-f | 6 |
| 854 | Full rational-expression evaluation with validity conditions | 1 |

No source task is omitted in this checkpoint. This does not assert that the
unseen candidate covers them.

## 851: Coefficients and Monic Equations

Identify coefficients in the **displayed** $ax^2+bx+c=0$ equations.

| Task | Equation | $a$ | $b$ | $c$ |
| --- | --- | --- | --- | --- |
| 851a | $2x^2+17x+3=0$ | 2 | 17 | 3 |
| 851b | $5x^2-9x+4=0$ | 5 | -9 | 4 |
| 851c | $x^2-12x-6=0$ | 1 | -12 | -6 |
| 851d | $-x^2+x-2=0$ | -1 | 1 | -2 |
| 851e | $8x^2-7x=0$ | 8 | -7 | 0 |
| 851f | $x^2-81=0$ | 1 | 0 | -81 |

851-monic: **c and f only**, because their displayed leading coefficient is 1.
The leading coefficient -1 in d is not 1. A missing linear or constant term
means coefficient zero; it is not the definition of monic. Although one could
divide a nonmonic equation by its leading coefficient, that does not change
the requested coefficients of the original displayed equation. All six are
quadratic because all six leading coefficients are nonzero.

## 852: Equality and Both Strict Inequalities

Work on one coordinate plane with
$P:y=x^2$ and $L:y=x+2$, both defined on all of $\mathbb R$.
Line points include $(-2,0),(0,2),(2,4)$.
Parabola points include $(-2,4),(-1,1),(0,0),(1,1),(2,4),(3,9)$.

**852-equality:** The two crossings are $(-1,1)$ and $(2,4)$.
Project both vertically onto the horizontal axis. The complete root set is
$\{-1,2\}$, not the ordinate set $\{1,4\}$.

**852-less:** Between the crossings the parabola is below the line.
At $x=0$, their heights are 0 and 2. The entire projected interval is
$(-1,2)$, not just the sampled point. Both endpoints are excluded:
their curve heights are equal, not strictly ordered.

**852-greater:** The parabola is above the line on the two outer branches.
For example, at $x=-2$ their heights are 4 and 0, and at $x=3$ they are 9
and 5. The complete solution is
$(-\infty,-1)\cup(2,\infty)$.
Both finite endpoints are excluded. Both unbounded rays must be retained.

These conclusions apply to the full real axis, not merely a finite visible
window. As a supplementary completeness/sign check,
$P-L=x^2-x-2=(x+1)(x-2)$ has exactly the two stated zeros, is negative
between them, and is positive on both outer intervals. This check supports,
but does not replace, comparing the two graphs.

## 853: Six Graphical Equations

Use common axes for each line/parabola pair. Roots are all crossing
**abscissae**. Dividing **every** term by nonzero $a$ lets the six problems
reuse $y=x^2$. Both branches and a sufficiently large vertical range are
needed; otherwise a far-left or high crossing can disappear from view.

No new task diagrams were drawn or opened at Stage1. The graph descriptions,
construction data, intersections and comparisons below are independently
derived from the seed functions. They are not observations of unseen authored
diagrams. Algebra is supplementary verification, not a formula-only solution.

### 853a

Rewrite $x^2+3x-4=0$ as $x^2=4-3x$.
Draw $y=x^2$ and the decreasing line $y=4-3x$, for example through
$(0,4)$ and $(1,1)$.

Crossings: $(-4,16)$ and $(1,1)$.
Their horizontal projections give **$x=-4,1$**.
A near-origin-only window would miss the upper-left crossing.
The upward graph gap has its unique negative minimum at $x=-3/2$, with
positive tails, so the two crossings are complete.
Check: $(x+4)(x-1)=0$ verifies those abscissae.

### 853b

Rewrite $x^2-2x-5=0$ as $x^2=2x+5$.
Draw $y=x^2$ and the increasing line $y=2x+5$, through $(0,5),(1,7)$.

Crossings are near $(-1.45,2.10)$ and $(3.45,11.90)$.
Graphical horizontal readings give **$x\approx-1.45,3.45$**.
Refinement brackets for the vertical gap are:
$x\in(-1.45,-1.44)$, with gap $0.0025$ to $-0.0464$;
and $x\in(3.44,3.45)$, with gap $-0.0464$ to $0.0025$.
Reasonable graph precision depends on the available scale.

Exact supplementary check: $(x-1)^2=6$ gives
$x=1-\sqrt6,1+\sqrt6$, with ordinates $7-2\sqrt6,7+2\sqrt6$.
The gap decreases to its negative minimum at $x=1$, then increases to
positive infinity, so there is precisely one crossing on each side.

### 853c

Rewrite $x^2+2x+5=0$ as $x^2=-2x-5$.
Draw $y=x^2$ and the decreasing line $y=-2x-5$, through $(0,-5),(-1,-3)$.

There are **no real crossings and no real roots**.
This is not an inference from a finite plot having no visible crossing:
on the entire real axis the vertical gap is
$x^2-(-2x-5)=(x+1)^2+4\ge4$.
Its smallest separation occurs at $x=-1$, where the heights are 1 and -3.
Thus the line is always below the parabola. Complex roots are not part of the
real graphical task.

### 853d

Divide all terms of $2x^2-x-3=0$ by 2:
$x^2=x/2+3/2$.
Draw $y=x^2$ and the shallow increasing line $y=x/2+3/2$, for example through
$(-1,1),(0,1.5),(1,2)$.

Crossings: $(-1,1)$ and $(3/2,9/4)$.
Their projections give **$x=-1,3/2$**.
The unnormalized pair $y=2x^2$, $y=x+3$ is also valid and crosses at
$(-1,2),(3/2,9/2)$. It has the same root abscissae, not the same ordinates.
The normalized gap has one negative minimum at $x=1/4$ and positive tails,
so both crossings are all the real roots.
Check: $(2x-3)(x+1)=0$.

### 853e

Divide all terms of $3x^2+2x-5=0$ by 3:
$x^2=-2x/3+5/3$.
Draw $y=x^2$ and the decreasing line $y=-2x/3+5/3$, through
$(0,5/3),(1,1)$.

Crossings: $(-5/3,25/9)$ and $(1,1)$.
Their projections give **$x=-5/3,1$**; a graph may read the first as about -1.67.
The unnormalized pair $y=3x^2$, $y=-2x+5$ instead has ordinates $25/3$ and 3,
with the same horizontal roots. The fractional negative crossing must not be
omitted. The normalized gap has one negative minimum at $x=-1/3$ and positive
tails, so there are precisely these two crossings.
Check: $(3x+5)(x-1)=0$.

### 853f

Divide all terms of $5x^2+12x-10=0$ by 5:
$x^2=-12x/5+2$.
Draw $y=x^2$ and the decreasing line $y=-12x/5+2$, through $(0,2),(1,-0.4)$.

Crossings are near $(-3.05,9.33)$ and $(0.65,0.43)$.
Both horizontal projections give **$x\approx-3.05,0.65$**.
One crossing is high on the far-left branch; the other is low near the
vertex. A clipped or coarse graph must not silently drop either one.
Refinement brackets in the normalized vertical gap are
$(-3.06,-3.05)$ with values $0.0196,-0.0175$ and
$(0.65,0.66)$ with values $-0.0175,0.0196$.

Exact supplementary check: $(5x+6)^2=86$ gives
$x=(-6-\sqrt{86})/5,(-6+\sqrt{86})/5$.
The normalized ordinates are
$(122+12\sqrt{86})/25$ and $(122-12\sqrt{86})/25$.
The unnormalized pair $y=5x^2$, $y=-12x+10$ is valid, with those ordinates
multiplied by 5 and the same root abscissae.
The normalized gap is $(x+6/5)^2-86/25$, with one negative minimum and
positive tails, hence exactly the two stated real crossings.

## 854: Full Rational Expression

Let
$D=\frac{2xy}{y^2-x^2}+\frac{x}{x+y}-\frac{y}{y-x}$.
The original domain requires $x+y\ne0$ and $y-x\ne0$, because
$y^2-x^2=(y-x)(x+y)$.

On this domain,

$$
D=\frac{2xy+x(y-x)-y(x+y)}{(y-x)(x+y)}
 =\frac{2xy-x^2-y^2}{(y-x)(x+y)}
 =-\frac{y-x}{x+y}.
$$

This divisor is also nonzero under those conditions. Therefore the requested
whole expression simplifies, on its **original** domain, to

$$
\frac{(y-x)^2}{x+y}\div D
=\frac{(y-x)^2}{x+y}\left(-\frac{x+y}{y-x}\right)
=-(y-x)=x-y.
$$

For $x=8.4=42/5$ and $y=-0.6=-3/5$,
$x+y=39/5$, $y-x=-9$ and $y^2-x^2=-351/5$.
The inputs satisfy every denominator and divisor condition.
The result is **$8.4-(-0.6)=9$**.

Independent substitution check:
$2xy/(y^2-x^2)=28/195$,
$x/(x+y)=14/13$ and $y/(y-x)=1/15$,
so $D=28/195+14/13-1/15=15/13$.
The outer fraction is $81/(39/5)=135/13$.
Their quotient is exactly 9.
Cancellation does not make the original expression defined at $y=x$ or $y=-x$.

## Stop Boundary

All 17 source tasks are recorded without candidate disclosure. Graph tasks retain
their curve pairs, root abscissae, complete real domain and, for 852, both strict
intervals with excluded endpoints. The no-intersection case has a global
justification. Actual visible image evidence and the SVG decode failure are
kept distinct.

No task-fidelity, redundancy, leakage, per-option truth, new-figure approval or
candidate coverage verdict is issued before views. This is not the final
`s10y-choice-review-v1`. Freeze the two solution files and their input-bound hash
manifest as mode `0444`, then stop for the parent's Stage2 disclosure.
