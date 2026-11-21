# N45 Independent Choice Review: Stage 1, Source Only

Status: OPEN awaiting parent full intake and separate stage-2 release.
This is an independent source solution, NOT semantic approval.

Seed: `.tmp/stemrobin-184-six/n45-choices/seed.json`
Seed bytes: 3705
Raw SHA-256: `7ffa1cecf4f86cfe0ec44e87a0114cc0533b8ac5c1ca5781b8b7ab716dc43086`
Selected sources: 367-374; selected definition blocks: 10 and 14.
Images authorized/opened: 0/0. The seed has no figures.

## Authorized Evidence Boundary

Read only the initial instruction, the authorized `review.md` and `contract.md`,
and the clean seed. No source trace target, original scan, screenshot, draft,
learner view, option, author solution, key, interaction, previous review, parent
mathematics, or parent progress/usage was read. No image skill or command receipt
helper was needed. All derivations below are independent of author material.
All execution uses the absolute authorized repository workdir.

## Selected Actual Definitions

### Block 10: Product Theorem

If both factors are defined and differentiable at the same point a, then
`(uv)'(a)=u'(a)v(a)+u(a)v'(a)`.

Independently split the difference quotient:

```text
[u(a+t)v(a+t)-u(a)v(a)]/t
= [(u(a+t)-u(a))/t]v(a+t)
  + u(a)[(v(a+t)-v(a))/t].
```

Differentiability implies continuity, so taking limits gives the asserted two
cross terms. Each term differentiates one factor and retains the other; the
derivative is not the product of the two derivatives. Repeated application gives
`(uvw)'=u'vw+uv'w+uvw'`, needed for 371 and the repeated factor in 372.

### Block 14: Constant Multiplier

For constant k and differentiable f, `(kf)'=kf'`. Its difference quotient is
`k[f(a+t)-f(a)]/t`, so the limit is `kf'(a)`. Alternatively, the product theorem
with the constant factor's derivative 0 gives `0*f+k*f'`.

Negative and fractional constants remain multipliers. The formula's premise
requires f' at the point in question; neither this rule nor algebraic
simplification silently adds points outside the original domain.

## Sources 367-373: Full Derivative Functions

All ten original functions and all ten derivative functions below have domain R.
The written learning task is to obtain each complete derivative function using
the differentiation formulas, not just evaluate a slope at one supplied point.

| Source | Original function | Independent full derivative |
| --- | --- | --- |
| 367a | `y(x)=x/5` | `y'(x)=1/5` |
| 367b | `h(x)=-3x/4` | `h'(x)=-3/4` |
| 368a | `y(x)=2x-5` | `y'(x)=2` |
| 368b | `u(x)=2-7x/2` | `u'(x)=-7/2` |
| 369a | `y(x)=(3/5)x(x-2)` | `y'(x)=(6x-6)/5` |
| 369b | `u(x)=((3x+2)(2x-3))/7` | `u'(x)=(12x-5)/7` |
| 370 | `g(x)=(2x-3)(3x+1)` | `g'(x)=12x-7` |
| 371 | `y(x)=(3x/5+1)(x/2-2)(x/3+3)` | `y'(x)=(9x^2+40x-83)/30` |
| 372 | `g(x)=(2x-3)^3` | `g'(x)=6(2x-3)^2` |
| 373 | `u(x)=3x^2(1-x^2)` | `u'(x)=6x-12x^3` |

### 367: Fractional Constant Slopes

`(x/5)'=(1/5)*1`, and `(-3x/4)'=(-3/4)*1`.
Learning tasks: retain both the fractional coefficient and negative sign; the
derivatives are constant functions on all of R.

### 368: Affine Functions

`(2x-5)'=2*1+0=2`; `(2-7x/2)'=0-(7/2)*1=-7/2`.
Learning tasks: distinguish the coefficient of x from the additive constant and
discard only the latter under differentiation.

### 369: Two Products with Constant Factors

```text
y'(x)=(3/5)[1*(x-2)+x*1]
     =(3/5)(2x-2)=(6x-6)/5.
y(x)=(3/5)x^2-(6/5)x independently gives the same derivative.

u'(x)=[3(2x-3)+2(3x+2)]/7
     =(6x-9+6x+4)/7=(12x-5)/7.
u(x)=(6x^2-5x-6)/7 independently gives the same derivative.
```

Learning tasks: use both cross terms, retain the outside coefficient, and combine
the signed constants correctly. Both subparts remain distinct source tasks.

### 370: Affine Slopes in Both Product Terms

```text
g(x)=6x^2-7x-3.
g'(x)=2(3x+1)+3(2x-3)
     =6x+2+6x-9=12x-7.
```

Learning tasks: retain slopes 2 and 3 and obtain the signed cross coefficient -7.

### 371: Three Factors, Exact Fractions

First multiply two factors:

```text
(3x/5+1)(x/2-2)=(3/10)x^2-(7/10)x-2.
y(x)=[(3/10)x^2-(7/10)x-2](x/3+3)
    =(1/10)x^3+(2/3)x^2-(83/30)x-6.
y'(x)=(3/10)x^2+(4/3)x-83/30
     =(9x^2+40x-83)/30.
```

The middle coefficients are exact:
`9/10-7/30=2/3` and `-21/10-2/3=-83/30`.
An independent repeated-product calculation gives

```text
y'(x)=(3/5)(x/2-2)(x/3+3)
      +(1/2)(3x/5+1)(x/3+3)
      +(1/3)(3x/5+1)(x/2-2).
```

Learning tasks: one derivative term per factor, retention of every fractional
slope, and a complete quadratic derivative rather than a partial product term.

### 372: Cube of an Affine Factor

Let `A=2x-3`. Repeated products give
`(A^3)'=A'A^2+AA'A+A^2A'=3*2*A^2=6(2x-3)^2`.

Expansion independently gives
`g(x)=8x^3-36x^2+54x-27`, hence
`g'(x)=24x^2-72x+54=6(2x-3)^2`.
Learning tasks: retain the affine slope 2 as well as the three identical product
contributions; a chain-rule assertion is not needed to solve this from block 10.

### 373: Two Nonconstant Factors and a Negative Power Term

```text
u'(x)=3[2x(1-x^2)+x^2(-2x)]
     =6x-6x^3-6x^3=6x-12x^3=6x(1-2x^2).
u(x)=3x^2-3x^4 independently gives the same derivative.
```

Learning tasks: differentiate both factors, preserve constant 3, and retain the
minus sign from differentiating `1-x^2`.

## Source 374a: Complete Graph of f(x)=x+1/x

Domain: `D=(-infinity,0) union (0,infinity)`. There is no point at x=0.

```text
f'(x)=1-1/x^2=(x^2-1)/x^2, domain D.
f''(x)=2/x^3, domain D.
```

| Interval or point | Derivative | Graph behavior |
| --- | --- | --- |
| `(-infinity,-1)` | positive | strictly increasing |
| `x=-1` | zero | local maximum `(-1,-2)` |
| `(-1,0)` | negative | strictly decreasing |
| `x=0` | undefined | excluded, vertical asymptote |
| `(0,1)` | negative | strictly decreasing |
| `x=1` | zero | local minimum `(1,2)` |
| `(1,infinity)` | positive | strictly increasing |

The negative branch has absolute maximum -2 on that component; the positive
branch has absolute minimum 2 on that component. There is neither a global
maximum nor a global minimum on the full disconnected domain.

Ranges: negative branch `(-infinity,-2]`; positive branch `[2,infinity)`;
full range `(-infinity,-2] union [2,infinity)`.

Curvature: concave down for x<0 because `f''<0`; convex/concave up for x>0
because `f''>0`. There are no inflection points. In particular, the curvature
change across excluded x=0 is not an inflection point.

Symmetry: `f(-x)=-f(x)`, so the graph has origin rotational symmetry, not
y-axis reflection symmetry.

Intercepts: no x-intercept, since `f=0` would imply `x^2+1=0`; no y-intercept
because x=0 is excluded.

Limits and asymptotes:

| Limit | Value |
| --- | --- |
| `x -> 0-` | `f -> -infinity` |
| `x -> 0+` | `f -> +infinity` |
| `x -> -infinity` | `f -> -infinity`, `f-x -> 0-` |
| `x -> +infinity` | `f -> +infinity`, `f-x -> 0+` |

Vertical asymptote: `x=0`. Straight oblique asymptote at both infinite ends:
`y=x`, since `f-x=1/x -> 0`. There is no horizontal asymptote.
For every negative x the graph is below `y=x`; for every positive x it is above
that line. The graph never meets it at finite x.

Exact drawing anchors:
`(-2,-5/2), (-1,-2), (-1/2,-5/2), (1/2,5/2), (1,2), (2,5/2)`.

Complete drawing specification: indicate the coordinate axes and dashed line
`y=x`, treating `x=0` as a vertical asymptote rather than a graph segment.
Draw two smooth, disconnected branches. The negative branch is entirely in
quadrant III, concave down and below `y=x`; it rises from the lower-left infinite
end to a horizontal top at `(-1,-2)`, then falls to negative infinity as x
approaches 0 from the left. The positive branch is entirely in quadrant I,
convex and above `y=x`; it descends from positive infinity near 0 from the right
to a horizontal bottom at `(1,2)`, then rises toward the upper-right infinite
end. Both distant ends approach `y=x` from their specified sides. Label both
extrema and retain origin symmetry. Do not connect the branches, cross an axis,
or put graph points at any y strictly between -2 and 2.

## Source 374b: Complete Graph of h(x)=x^2+2/x

Domain: `D=(-infinity,0) union (0,infinity)`. Let `c=cuberoot(2)>0`, so `c^3=2`.

```text
h'(x)=2x-2/x^2=2(x^3-1)/x^2, domain D.
h''(x)=2+4/x^3=2(x^3+2)/x^3, domain D.
```

| Interval or point | Derivative | Graph behavior |
| --- | --- | --- |
| `(-infinity,0)` | negative | strictly decreasing, no extremum |
| `x=0` | undefined | excluded, vertical asymptote |
| `(0,1)` | negative | strictly decreasing |
| `x=1` | zero | local minimum `(1,3)` |
| `(1,infinity)` | positive | strictly increasing |

The minimum `(1,3)` is absolute only on the positive component. It is not a
global minimum of h on D. The full function has no global maximum or minimum.

Ranges: the negative component decreases continuously from positive infinity
to negative infinity, so its range is R. The positive component's range is
`[3,infinity)`. Therefore the full range is R, not `[3,infinity)`.

| Interval | Second derivative | Curvature |
| --- | --- | --- |
| `(-infinity,-c)` | positive | convex / concave up |
| `(-c,0)` | negative | concave down |
| `(0,infinity)` | positive | convex / concave up |

The negative branch has inflection point `(-c,0)`, because `h''(-c)=0` and
the sign changes from positive to negative. Its y-coordinate is exactly
`c^2-2/c=0`. Its slope is `h'(-c)=-3c`, so this is not a turning point.
Its tangent is `y=-3c(x+c)`. Again x=0 is not an inflection point.

Symmetry: `h(-x)=x^2-2/x` is neither h(x) nor -h(x); there is no y-axis
reflection symmetry or origin rotational symmetry. The identity
`h(x)+h(-x)=2x^2` positions opposite-side points relative to a reference
parabola but does not make the graph even or odd.

Intercepts: the unique x-intercept is `(-cuberoot(2),0)`, since multiplying
`h=0` by nonzero x gives `x^3+2=0`. It coincides with the inflection point.
There is no y-intercept.

Limits and asymptotes:

| Limit | Value |
| --- | --- |
| `x -> 0-` | `h -> -infinity` |
| `x -> 0+` | `h -> +infinity` |
| `x -> -infinity` | `h -> +infinity`, `h-x^2 -> 0-` |
| `x -> +infinity` | `h -> +infinity`, `h-x^2 -> 0+` |

Vertical asymptote: `x=0`. Quadratic asymptotic reference curve at both infinite
ends: `y=x^2`, since `h-x^2=2/x -> 0`. This is a curvilinear asymptote if
that term includes curves, not a straight oblique asymptote. Under a
straight-line-only convention, call it the asymptotic reference parabola.
There is no horizontal or straight oblique asymptote: subtracting any `mx+b`
still leaves quadratic growth.

The negative branch lies below `y=x^2` for every negative x; the positive branch
lies above it for every positive x. Neither intersects the parabola at finite x.
For `x<-c`, h is positive, so the negative branch is in quadrant II; after the
intercept, for `-c<x<0`, it is in quadrant III. The positive branch lies wholly
in quadrant I.

Exact drawing anchors:
`(-2,3), (-c,0), (-1,-1), (-1/2,-15/4), (1/2,17/4), (1,3), (2,5)`.

Complete drawing specification: indicate coordinate axes, vertical asymptote
`x=0`, and a distinct dashed reference parabola `y=x^2`. Draw two smooth,
disconnected branches. At the far left the negative branch starts high in
quadrant II just below the parabola, decreases while convex to `(-c,0)`,
crosses the axis there with nonhorizontal tangent, changes to concave down,
then falls through quadrant III to negative infinity at 0 from the left.
The positive branch descends from positive infinity at 0 from the right,
stays convex and above the parabola, reaches a horizontal bottom at `(1,3)`,
then rises toward positive infinity with difference from `x^2` tending to 0
from above. Label the negative inflection/intercept and positive local minimum.
There is no negative turning point and no y-intercept. Do not connect the
branches or generate one by reflecting the other.

## Source Learning-Task Inventory

Eight written exercises contain ten complete derivative-function tasks and two
complete graph constructions. Both selected definitions are independently
accounted for. The central relationships are constant versus additive terms,
all product terms, affine slopes, exact fractions, and the coordinated geometry
of both branches of each rational function.

The drawing task is not just a request for a derivative or an isolated extremum.
It requires integrating the domain, branch behavior, and asymptotic positions
into two complete graphs. Branch-local extrema must not be reported as extrema
on the full domain. For 374a, preserve the range gap and origin symmetry; for
374b, preserve the decreasing negative branch, its inflection/intercept, the
full range R, and the quadratic rather than straight-line asymptotic behavior.

These source tasks request learner production. A later choice conversion must
record any lost production capacity and be judged on whether its mathematical
distinctions and coverage survive. No option design, fidelity verdict,
redundancy verdict, leakage verdict, complete option true set, key comparison,
or coverage approval is made in stage 1.

No source blocker was found in the supplied text. Any first author failure
remains unassessed, not passed. STOP OPEN after the frozen receipt; await parent
full intake and explicit stage-2 release. Stage 3 remains key-last and separately
authorized. Do not self-edit author drafts.
