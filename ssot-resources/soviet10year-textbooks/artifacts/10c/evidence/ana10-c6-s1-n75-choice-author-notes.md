# ana10-c6-s1-n75 CHOICE Author Notes

Author-only offline work for STEMROBIN-184. No n75 standard answers, answer
templates, answer-author or answer-review files, interactions, old choices,
history, tests, app, environment, services, database or publisher were opened
for this assignment. No model call, installation or figure regeneration.

## Seed Selection

The existing whitelist inspect command was run first. Explicit preparation
selected every original written exercise 1 through 14 and only paragraph
index 1, the lesson's sine-derivative formula. The footnote marker in that
formula is retained verbatim. Paragraphs 11 through 13 are solved examples,
not selected definitions; the geometrical explanatory paragraph 7 and its
body figure are not needed for these exercise tasks and were not selected.
No figure assets are in the seed, and no new figures are proposed.

Seed: `ana10-c6-s1-n75-seed.json`

Canonical seed digest:
`808eea8a38ec142df7d48b7d421761f7a54f7a3989b86791194464ff7990ede5`.

The original collective task for the expression exercises is to find their
derivatives. The new visible stems make that task explicit, rather than
turning the expressions into answer slots. The selected sine-derivative
formula is the radian-normalized formula; no degree conversion or added
numerical angle is introduced.

## Source Solutions Frozen Before the Draft

These complete source conclusions were written before the options draft.
They are independent author derivations, not an independent review.

The selected formula gives (sin x)'=cos x. With the chain, product, power and
sum rules, cos x=sin(pi/2-x) also gives (cos x)'=-sin x. These elementary
calculus/trigonometric deductions do not use the book's solved examples.
All expression functions below have domain R.

### Source 1

For f(x)=sin(3x), the outer derivative is cos(3x) and the inner derivative
is 3, hence f'(x)=3cos(3x). The full chain factor, argument and sign must
be retained.

### Source 2

For g(x)=sin(x/2+pi), g'(x)=(1/2)cos(x/2+pi).
Since cos(v+pi)=-cos v, this equals -(1/2)cos(x/2). The phase shift is
not differentiated as a varying quantity.

### Source 3

h(x)=sin(pi/2-x)=cos x, so h'(x)=-sin x. Directly, the chain rule yields
-cos(pi/2-x)=-sin x. The inner derivative is -1, not +1.

### Source 4

Set u=2x-1. M(x)=3(sin u)^2. Then

```text
M'(x) = 3 * 2 sin u * cos u * 2
      = 12 sin(2x-1) cos(2x-1)
      = 6 sin(4x-2).
```

The outer factor 3, power factor 2, inner factor 2 and undifferentiated
sine factor all matter.

### Source 5

The sine-difference identity gives
sin(2t)cos t-sin t cos(2t)=sin(2t-t)=sin t, hence f'(t)=cos t.

Independent direct verification:

```text
f'(t) = 2cos(2t)cos t - sin(2t)sin t
        - cos t cos(2t) + 2sin t sin(2t)
      = cos(2t)cos t + sin(2t)sin t
      = cos(2t-t) = cos t.
```

### Source 6

sin(-x)=-sin x, hence f(x)=0 for every x and f'(x)=0.
Direct differentiation agrees:
-cos(-x)+cos x=-cos x+cos x=0.

### Source 7

sin(2x)=2sin x cos x, so g(x)=5 identically and g'(x)=0.
The product-rule verification is
2cos(2x)-2(cos^2 x-sin^2 x)=0. The retained constant 5 is the function
value, not its derivative.

### Source 8

h'(x)=2cos(2x-3.5)+2cos(2x).
Equivalently h(x)=2sin(2x-1.75)cos(1.75) and
h'(x)=4cos(1.75)cos(2x-1.75).
Both factors of 2 are inner derivatives. The decimals remain exactly
3.5=7/2 and 1.75=7/4, not rounded measurements or degrees.

### Source 9

Since sin(pi-x)=sin x,
M(x)=2x+3.6sin^5 x and M'(x)=2+18sin^4 x cos x.

The unreduced argument independently yields
2-18sin^4(pi-x)cos(pi-x); cos(pi-x)=-cos x gives the same result.
Here 3.6=18/5, so the coefficient 18 is exact. Neither the inner minus
sign nor the decrease of the sine power can be omitted.

### Source 10

cos(pi/2)=0 and sin(pi/2)=1, so f(u)=-sin(2u).
Thus f'(u)=-2cos(2u). Also
cos(2u)cos(pi/2)-sin(2u)sin(pi/2)=cos(2u+pi/2), whose derivative is
-2sin(2u+pi/2)=-2cos(2u).

### Source 11

F(x)=2x-sin x gives F'(x)=2-cos x.
From -1<=cos x<=1, 1<=F'(x)<=3. In particular the derivative is
strictly positive for every real x, including where cos x=1.

For arbitrary a<b, the mean value theorem gives
F(b)-F(a)=F'(c)(b-a)>=b-a>0 for some c in (a,b).
This proves strict increase on all of R, not only on an open interval
avoiding stationary points. There are no stationary points.

### Source 12

g(x)=x-sin x.

```text
g'(x) = 1-cos x >= 0;
g'(x)=0 iff x=2k*pi, k in Z;
g''(x)=sin x.
```

Strict increase requires more than citing a nonnegative derivative. For any
a<b choose a closed nondegenerate [c,d] inside (a,b) that avoids the discrete
set 2pi Z. Such a choice exists in every open interval. On [c,d],
g'>0; on all other intervals g'>=0. The mean value theorem therefore gives
g(d)>g(c), g(c)>=g(a), and g(b)>=g(d), so g(b)>g(a).
This proves strict increase despite the isolated zero derivatives.

Graph construction facts:

- Domain R, odd function, g(0)=0. Strict increase makes 0 its only zero;
  g has the sign of x.
- x-1<=g(x)<=x+1. Hence the limits at +/-infinity are +/-infinity, the
  range is R, and there are no absolute or local extrema.
- g(k*pi)=k*pi. At even k the tangent there is horizontal; at odd k its
  slope is 2. The even-k stationary points are horizontal inflection
  points, not maxima/minima and not horizontal intervals.
- g''>0 on (2k*pi,(2k+1)*pi) and g''<0 on
  ((2k-1)*pi,2k*pi). Every (k*pi,k*pi) is an inflection point.
- g(x+2pi)=g(x)+2pi. Draw the arc from (0,0) to (pi,pi), bending with
  positive second derivative, then the arc to (2pi,2pi), bending with
  negative second derivative. Extend by translation (2pi,2pi) and oddness.
  These join into one strictly increasing curve within the stated band.
- y=x is not an asymptote: g(x)-x=-sin x takes -1 and +1 along unbounded
  sequences. A bounded difference is not a difference tending to zero.

A text-based choice can inspect this complete graph blueprint and proof,
but cannot establish that a learner can independently draw the curve.
The original graph-construction task remains a declared production loss.

### Source 13

h(x)=x-2sin x is defined on R and is odd.

```text
h'(x) = 1-2cos x;
h''(x) = 2sin x.
```

Let a_k=2k*pi-pi/3 and b_k=2k*pi+pi/3, k in Z.

- h'=0 exactly at a_k and b_k.
- h'<0 on (a_k,b_k), because cos x>1/2 there.
- h'>0 on (b_k,a_(k+1)), because cos x<1/2 there.
- Therefore h strictly decreases on (a_k,b_k) and strictly increases on
  (b_k,a_(k+1)); the monotonic statements extend continuously to their
  finite endpoints.
- At a_k the derivative changes + to -, so there is a local maximum
  h(a_k)=2k*pi-pi/3+sqrt(3).
- At b_k the derivative changes - to +, so there is a local minimum
  h(b_k)=2k*pi+pi/3-sqrt(3).
- x-2<=h(x)<=x+2, so its limits are +/-infinity, range R, with no
  absolute maximum/minimum. It is neither globally increasing nor globally
  decreasing: h'(0)=-1 and h'(pi)=3.
- h'' has the same signs and zeros as g'' in source 12. Inflection points
  are (k*pi,k*pi). Their tangent slopes are 1-2(-1)^k: -1 for even k,
  3 for odd k. No inflection point is stationary.
- h(x+2pi)=h(x)+2pi; it is not periodic. The bounded oscillation
  h(x)-x=-2sin x does not tend to zero or any constant, so y=x is not an
  asymptote.

Zeros and signs require an additional argument rather than oddness alone.
The equation h(x)=0 is x=2sin x, so any nonzero zero satisfies |x|<=2.
On (0,pi/3), h decreases from h(0)=0 and stays negative.
It increases on (pi/3,2), but
h(pi/2)=pi/2-2<0 and h(2)=2-2sin 2>0.
Thus exactly one positive root alpha occurs in (pi/2,2); monotonicity makes
it unique. For x>2, h(x)>=x-2>0. Oddness gives the complete zero set
{-alpha,0,alpha}. It also gives:

```text
h(x)>0 on (-alpha,0) union (alpha,+infinity);
h(x)<0 on (-infinity,-alpha) union (0,alpha).
```

This supplies an exact implicit root description, not an invented
closed form or a numerical answer taken from a key. The turning points,
inflections, roots, translation and band above determine a graph blueprint.
Choosing a complete study record is not autonomous function discussion or
curve construction.

### Source 14

G(x)=sin(2x-5)-3x gives G'(x)=2cos(2x-5)-3.
The cosine bound yields -5<=G'(x)<=-1, hence strict negativity everywhere.
For any a<b, the mean value theorem gives
G(b)-G(a)=G'(c)(b-a)<=-(b-a)<0.
This proves strict decrease on the entire given interval R, without
changing its endpoints or relying on isolated sampled values.

## Capacity Boundary Before Options

For the derivative tasks, choice can assess the complete derivative and
essential chain/product/identity decisions, but not production of an
unprompted derivation. For sources 11/14 it can assess a complete uniform-bound
and mean-value proof, but not writing that proof independently.

For sources 12/13 it must retain the distinction between isolated stationary
points and strict monotonicity, the entire turning-point/inflection/zero
structure and graph blueprint. Independent drawing and an independently
organized written discussion are still lost. These are to be recorded in
both question limitations and source coverage, never silently treated as
fulfilled by recognition. The independent reviewer will decide whether this
remaining production loss defeats the intended task.

## Draft and Gate

The first author pass is written as `ana10-c6-s1-n75-draft.json`:
14 source exercises, one concept paragraph, 11 questions, 49 options,
9 native single-choice questions and 2 native multiple-choice questions.
There are no seed or new figures.

Response units:

- Sources 1, 2, 3, 4, 5, 8, 9 and 10 retain independent complete derivative
  or function-and-derivative tasks.
- Sources 6/7 form one coherent comparison of trig identities that turn
  expressions into different constant functions. Candidate records disagree
  on both f and g, so g=5 is not simply common text in every alternative.
- Sources 11/14 form one uniform derivative-bound and mean-value proof task,
  contrasting positive and negative margins on the whole real domain.
- Sources 12/13 form one full study of x-a sin x at amplitudes 1 and 2:
  the threshold changes stationary points from horizontal inflections to
  local extrema. Derivatives alone do not settle the task. Proof, turning
  points, graph curvature/tangents, domains/ranges, parity, translation,
  zeros/signs and asymptotic judgment are all included.

All 49 options have explicit internal derivations. False records arise from
specific operations or inference errors; none is an arbitrary nearby number.
The proof questions distinguish an actual correct derivation from a true
conclusion reached after a false derivative formula. No self semantic PASS
or review artifact was produced.

### Single Structural Check: Rejected

Exactly this one structural validation was executed:

```bash
python3 .agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo . \
  --seed .intentfold/tickets/STEMROBIN-184/tmp/ana10-c6-s1-n75-seed.json \
  --draft .intentfold/tickets/STEMROBIN-184/tmp/ana10-c6-s1-n75-draft.json
```

Actual result: exit 2.

```text
contract error: option.text: embedded media/HTML/URL
```

The affected visible string is
`amplitude-and-function-study / option b`
(`questions[10].view.options[1].text`). Its mathematical text begins with
`$a<b$` and later contains `g(d)>g(c)`. Read-only inspection of
`validate.py:55-59` shows the HTML guard
`</?[A-Za-z][^>]*>` matches from the raw `<b` to that later raw `>`.
There is no actual HTML/media/URL in this option: this is the literal
comparison notation colliding with the guard.

The smallest draft-only correction would encode the mathematical comparisons
as `a\lt b` and `g(d)\gt g(c)` inside math. No source, rule, key, misconception,
coverage, graph or tool change is needed. However, the current first draft
is preserved unchanged: no second check or unsolicited repair was made.
The parent agent delegated exactly one author structural check and reserves the
bounded repair for independent findings. This rejection and proposed
encoding change are handed off honestly for that authorization.

The checker stopped at this visible-text error; other structural checks
must not be claimed to have passed. Independent source-first and view-first
semantic review is still pending. The later reviewer should not read these
author solutions or keys before freezing their own source/view conclusions.

### Current Snapshot

| Artifact | Canonical digest |
| --- | --- |
| Seed | `808eea8a38ec142df7d48b7d421761f7a54f7a3989b86791194464ff7990ede5` |
| Draft | `fbd3c5296afb64e2c952daa4420c8acb7da73c673049fda04966daf79c633c9a` |

| Artifact | File SHA-256 |
| --- | --- |
| Seed | `c691f6c9806042e48b4b4dc97bc6592f42803fdcc921827a94f094dbd3d02fa1` |
| Draft | `60b8e6de1225bbd5bc818a3b512182d9b24986a949298324f8353382d07d50e5` |

Only the three assigned author files were written. No browser, figure
recheck, promotion, commit, standard-answer access or publication took place.

## Authorized Common-Heading Confirmation

After the independent Stage1 reviewer identified that the seed projection
omits the common heading, the parent agent delegated a read-only
`{number, group, text}` projection of the first ten current modern exercise
records. Only those three fields were inspected; no answers, answer
configuration, interactions or history were consulted.

Actual allowed source:
`ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s1-n75/exercises.json`.

Every projected record numbered 1 through 10 has exactly this written heading:

```text
习题求下列函数的导函数：
```

All ten projected texts also exactly match their existing seed exercise
texts. The current whole-file SHA-256 is
`f9c375d9ba2029e23834de253a2e3f7c802ee221b1ffe0c5df9d55f0ae9176e1`,
which exactly matches the exercises-file entry already in `seed.trace`.

Thus the derivative instruction for sources 1 through 10 is grounded in
this actual original-written common heading, not inferred merely from the
lesson filename or its sine-derivative theorem. The existing source solves
and derivative intents remain coherent with that explicit instruction.
This confirms input task authority; it does not confer semantic approval.

No seed, draft, schema or preparation/validation tool was changed. No source
solve, figure observation or structural validation was repeated. Only this
author-note confirmation was appended; the prior exit-2 result and frozen
seed/draft snapshots remain preserved.
