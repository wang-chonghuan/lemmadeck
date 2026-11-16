# n79 CHOICE Stage1: Peirce independent source freeze

## Authority, read order, and bindings

STEMROBIN-184; Stage1 source-only independent semantic reviewer, not the choice author. Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Read order was the official seed and current choice review/contract, then the permitted current modern lesson and written exercises. The modern files were read through prose/exercise projections, not answer or interaction objects. No choice draft, views, key, author notes/source-solve, standard answers, parent source freeze, or other reviewer report was opened. There are no seed figures or exercise figure references, so no image, screenshot, browser, or figure-review evidence is required for this stage. Body figures named in the full lesson were not treated as seed images.

The conclusions below were derived before any option access. This file is the Stage1 freeze, not a completed choice review or approval. Stage2 and Stage3 remain unauthorized at this handoff.

| Input | Raw SHA-256 |
| --- | --- |
| `.intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-choice-seed.json` | `d851d70bdfbfb58e2c076e6d015e07697661cd5990bab8ded0ebf1f2399b7960` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n79/lesson.json` | `8e355befa6b80102fb828d4258f1bc61272d9fe0a776355a6d091b2a7ad5b851` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n79/exercises.json` | `5b84bbff8fb4fe203b986fcc555d101408cc469ef88c383c84f1715262d399a3` |

Seed canonical digest, using the contract's sorted ASCII JSON serialization:

```text
2991cf9c5f035c1804151c289a764d246781fec8018fc2860c6103b7738f56b2
```

All six seed exercise texts exactly equal the current modern written texts. Selected concept blocks 0, 2, and 17 exactly equal their current modern paragraphs. The current modern lesson/exercise byte hashes equal their seed trace entries. No seed or source was changed.

## Definitions and boundary conventions

- `]a,b[` means the open interval `(a,b)`. Excluded finite endpoints are not extrema attained on that interval.
- `operatorname{tg}` denotes tangent. Its domain excludes `pi/2+k*pi`; these excluded points are not graph points or inflection points.
- The course explicitly calls `f''>0` **向下凸**, with the curve above its tangent lines, and `f''<0` **向上凸**, with the curve below its tangent lines. This naming is retained, not replaced by a different familiar convention.
- Increasing/decreasing comes from the sign of `f'`. Acceleration/deceleration of increase or decrease concerns `|f'|`, not merely the numerical sign of `f''`.
- An inflection conclusion here requires the actual change of convexity across a point on the curve. Merely obtaining `f''(x0)=0` is not a sufficient general argument. The tangent-crossing proofs below additionally establish the local geometry.
- The permitted full lesson supplies the tangent-side interpretation and a textbook inflection discussion. No external solution or choice key supplies the conclusions below.

## Source 46: sine on both requested intervals

The task is to use both derivative orders to discuss monotonicity, changing slope/speed, and convexity. Let `s(x)=sin x`. Independently differentiating gives

```latex
s'(x)=\cos x,\qquad s''(x)=-\sin x.
```

### 46(a): `(-pi,-pi/2)`

Throughout this interval, `cos x<0` and `sin x<0`, so `s'<0` and `s''>0`.

Therefore the function is strictly decreasing, but its negative derivative increases toward zero: `|s'|` decreases. This is decelerating decrease, not accelerating decrease. The graph is 向下凸 throughout.

At the excluded endpoints the limiting function values are `0` and `-1`, respectively. Thus the range is `(-1,0)` and neither endpoint value is attained. There is no stationary point or inflection point inside this interval. Its derivative increases from the limiting value `-1` to `0`.

### 46(b): `(-pi/2,pi/2)`

Here `cos x>0` everywhere, including `s'(0)=1`, so sine is strictly increasing on the entire interval. It does not stop increasing at zero.

Split only for the second-order properties:

| Subinterval/point | First derivative | Second derivative | Consequence |
| --- | --- | --- | --- |
| `(-pi/2,0)` | Positive | Positive | Accelerating increase; 向下凸 |
| `x=0` | `1` | `0` | Change of convexity; not a stationary point |
| `(0,pi/2)` | Positive | Negative | Decelerating increase; 向上凸 |

The slope increases from the limiting value `0` to `1`, then decreases toward the limiting value `0`. Its maximum is attained at zero. The function's range is `(-1,1)`; the values `-1` and `1` are not attained, so there is no maximum or minimum of the function on the requested interval.

The point `(0,0)` is an inflection point because `s''` changes from positive to negative across it. Source 48 below also proves that the curve crosses its tangent there. The entire interval cannot be assigned one strict convexity type.

## Source 47: tangent on all three requested intervals

Let `t(x)=tan x`. On its domain,

```latex
t'(x)=\sec^2x=\frac{1}{\cos^2x}>0,
\qquad
t''(x)=2\tan x\sec^2x
       =\frac{2\sin x}{\cos^3x}.
```

In the principal branch `(-pi/2,pi/2)`, `cos x>0`, so the sign of `t''` is the sign of `x`.

### 47(a): `(-pi/2,0)`

`t'>0` and `t''<0`. The function strictly increases, its positive slope decreases, and the increase is decelerating. The graph is 向上凸. The range is `(-infinity,0)`. The derivative tends to `+infinity` at the left endpoint and to `1` at the right endpoint, neither endpoint belonging to this interval. There is no stationary or inflection point within it.

### 47(b): `(0,pi/2)`

`t'>0` and `t''>0`. The function strictly increases with increasing positive slope, hence accelerating increase. The graph is 向下凸. The range is `(0,infinity)`. The derivative tends from `1` to `+infinity`. Again there is no stationary or inflection point inside this open interval.

### 47(c): `(-pi/2,pi/2)`

The function is continuous and strictly increasing throughout the whole branch and has range `R`. It is not uniformly accelerating or uniformly decelerating: the change occurs at zero. The derivative has its minimum `1` at zero, not the value zero.

The graph is 向上凸 on the left half and 向下凸 on the right half, and `(0,0)` is an inflection point. The curve has no local extremum there. The endpoints `-pi/2` and `pi/2` are vertical asymptote locations, not inflection points. The whole branch has neither one global convexity type nor a finite function maximum/minimum.

## Source 48: both sine tangents and both inflection proofs

For a differentiable function, the tangent at `x=a` is

```latex
y=f(a)+f'(a)(x-a).
```

At `a=0`, `sin 0=0` and `cos 0=1`. The tangent is **`y=x`** at `(0,0)`.

At `a=pi`, `sin pi=0` and `cos pi=-1`. The tangent is **`y=pi-x`** at `(pi,0)`. A tangent with slope `-1` still needs the intercept `pi`; `y=-x` does not pass through this point.

At zero, `s''=-sin x` is positive immediately to the left and negative immediately to the right. The convexity changes from 向下凸 to 向上凸.

To check the tangent-side geometry without treating a zero second derivative as proof, put `h(u)=sin u-u`. Then `h(0)=0` and `h'(u)=cos u-1<0` for nonzero sufficiently small `u`. Consequently `h(u)>0` on the left and `h(u)<0` on the right. The sine curve crosses `y=x` from above to below.

At `pi`, write `u=x-pi`. The function value is `-sin u`, and the tangent value is `-u`. Their difference is `u-sin u=-h(u)`, negative on the left and positive on the right. Also `s''` changes from negative to positive. Thus `(pi,0)` is an inflection point with convexity changing from 向上凸 to 向下凸, and the curve crosses its tangent from below to above.

Both tangent equations and both sign-change explanations are required. The original task asks for equations and reasons, not production of a drawing.

## Source 49: both tangent tangents, inflection proofs, and drawing facts

At both `a=0` and `a=-pi`, `tan a=0` and `sec^2 a=1`. The two tangents are therefore:

```latex
\begin{array}{c|c|c}
a & \text{point} & \text{tangent}\\
0 & (0,0) & y=x\\
-\pi & (-\pi,0) & y=x+\pi
\end{array}
```

The two lines have the same slope but are distinct. Replacing the second tangent by `y=x-pi` misses the required point.

For either center `a`, set `u=x-a`. By the period `pi`, `tan x=tan u` within that branch. The curve-minus-tangent difference is `r(u)=tan u-u`. For `|u|<pi/2`,

```latex
r(0)=0,\qquad
r'(u)=\sec^2u-1=\tan^2u.
```

The derivative is positive away from zero. Hence `r(u)<0` on the left and `r(u)>0` on the right. Each curve branch crosses its tangent from below to above. Equivalently, `t''=2 tan u sec^2u` changes from negative to positive. Both `(0,0)` and `(-pi,0)` are inflection points: 向上凸 on their left, 向下凸 on their right. Neither is an extremum or a point with a horizontal tangent.

### Exact content required by the drawing subtask

The drawing is not just two unlocated slope-one lines. It must locate the function branches, tangent points, and tangents consistently:

- Principal branch: `x` in `(-pi/2,pi/2)`, increasing from `-infinity` to `+infinity`, through `(0,0)`, with tangent `y=x`.
- Adjacent branch centered at `-pi`: `x` in `(-3pi/2,-pi/2)`, increasing from `-infinity` to `+infinity`, through `(-pi,0)`, with tangent `y=x+pi`.
- Vertical asymptotes for these two displayed branches: `x=-3pi/2`, `x=-pi/2`, and `x=pi/2`. They are not parts of the graph.
- Each branch is below its own tangent immediately to the left of its center and above it immediately to the right.
- Derived optional plotting anchors, not extra source givens: `(-pi/4,-1)`, `(pi/4,1)`, `(-5pi/4,-1)`, and `(-3pi/4,1)`, obtained by evaluating tangent at offsets `+-pi/4`.

These facts completely specify the relevant mathematical drawing content. No new drawing was generated during this source-only review. The source explicitly requires autonomous drawing; a later choice task must not claim that recognition of equations, a supplied picture, or a sign table demonstrates this production skill.

## Source 50: both second derivatives and full real-line convexity proofs

For `f(x)=3-2x-x^2`,

```latex
f'(x)=-2-2x,\qquad f''(x)=-2<0
\quad (x\in\mathbb R).
```

For `g(x)=6x^2-3x+2`,

```latex
g'(x)=12x-3,\qquad g''(x)=12>0
\quad (x\in\mathbb R).
```

The supplied second-derivative criterion proves that `f` is 向上凸 and `g` is 向下凸 throughout `R`. The conclusion is unaffected by their first derivatives changing sign.

There is also a direct proof matching the lesson's tangent-side meaning. For any tangent abscissa `a` and any other `x`,

```latex
f(x)-[f(a)+f'(a)(x-a)]=-(x-a)^2<0,
```

whereas

```latex
g(x)-[g(a)+g'(a)(x-a)]=6(x-a)^2>0.
```

Thus the first graph lies strictly below every tangent except at its contact point, and the second lies strictly above. Both functions are defined and twice differentiable on the full requested real line. There are no inflection points, because the second derivatives never change sign.

Both differentiations and both global proofs belong to the task. Selecting only the pair `(-2,12)` would not by itself represent the requested convexity proof.

## Source 51: second derivative and both interval proofs

For `f(x)=3-3x^2+x^3`,

```latex
f'(x)=-6x+3x^2,\qquad
f''(x)=-6+6x=6(x-1).
```

On `(-infinity,1)`, `f''<0`, so the graph is 向上凸. On `(1,infinity)`, `f''>0`, so it is 向下凸. The intervals exclude `1`; neither assertion requires assigning a strict sign to `f''(1)=0`.

An exact tangent-side proof is available for the entire requested intervals. For any tangent abscissa `a`,

```latex
f(x)-[f(a)+f'(a)(x-a)]
=(x-a)^2(x+2a-3).
```

If both `x,a<1` and `x!=a`, this is negative; if both `x,a>1`, it is positive. This proves the below/above-tangent assertions, not merely a sketch-based guess.

As an additional boundary check, `f(1)=1` and `f'(1)=-3`. The tangent at `(1,1)` is `y=4-3x`; the exact residual is

```latex
f(x)-(4-3x)=(x-1)^3.
```

It changes from negative to positive across `1`, confirming that `(1,1)` is an inflection point, not a stationary point. This boundary fact supports the interval analysis, though the original task does not separately request its tangent equation.

One must not infer global increasing/decreasing on these intervals from convexity. Indeed `f'=3x(x-2)` changes sign at `0` and `2`, while convexity changes at `1`.

## Frozen source conclusions and later fidelity checks

All six written source tasks have determinate mathematical conclusions under the explicit supplied course convention. No missing premise blocks these source solves. This is not a verdict about the unseen choice package.

Required later checks, without constructing or anticipating any options:

- 46: preserve both source intervals and the change of second-order behavior inside the second interval, including the nonstationary point at zero.
- 47: preserve all three intervals; do not replace the whole-branch discussion by a single convexity/acceleration claim or treat excluded poles as curve points.
- 48: retain both fully located tangent equations and actual inflection reasoning.
- 49: retain both locations and tangent equations, both inflection explanations, and honestly account for the autonomous graph-production task.
- 50: retain both second derivatives and both global convexity proofs, not just derivative-value recognition.
- 51: retain the derivative, the dividing point, both unbounded intervals, and the sign/proof connection.

Native choice responses can assess mathematical recognition and reasoning but do not by themselves establish autonomous differentiation, proof composition, tangent-equation production, or drawing. The concrete losses and whether they defeat a question's purpose must be assessed against the actual Stage2 views, not assumed away here.

Only this Stage1 report was written. No seed/draft/source edits, options, structural validator, new figure, application/service, Git, DB, network, or other-chat operation was performed. Stop after hashing and handing off this immutable report; await separate view-only authorization.
