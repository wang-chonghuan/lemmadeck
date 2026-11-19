# n34 Independent Source Solutions

Stage: solved and frozen before options. Formal seed preparation is waiting for
the parent's explicit adapt-finalize notice. No choices, key files, previous
choices, or historical answers were consulted. This is an internal author
artifact, not a learner payload or a semantic-review pass.

## Authority

The authorized current modern lesson and exercises are:

- `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s1-n34/lesson.json`
  SHA-256 `203f46e1097f28784e8a6d3c0c205add59240f91e05a05f1c9f4fc8c30b2146e`.
- `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s1-n34/exercises.json`
  SHA-256 `b913c6c7ac477537ed3769c7d0cc939d855d8e2a675e078a01e46b58e99280dc`.

The parent-corrected facts remain unchanged: page215 starts the rising interval
at6, page218 ends with the smaller-value definition wording, and page219
exercise751 uses $y=-6/x$.

Selected exercises: 746-753, all eight. Selected definition blocks:
8,12,14,15,23,28. These are general definitions/classifications, not solved
examples. No concept figure is selected.

Use the lesson's strict increasing/decreasing definitions. Source interval
notation $]a,b[$ is open. Transition points are reported separately in the
lesson's style; this reporting convention is not a claim that a continuous
monotone branch cannot also include its endpoint.

## 746

Read only the actual fig52 branch order, not an imagined formula. Its negative
branch decreases and its positive branch increases.

Since $-3.6<-2.1$, $f(-2.1)<f(-3.6)$.
Since $1.3<2.8$, $f(1.3)<f(2.8)$.
For $x_1<x_2<0$, $f(x_1)>f(x_2)$.
For $0<x_1<x_2$, $f(x_1)<f(x_2)$.

The decreasing input set is $]-\infty,0[$ and the increasing input set is
$]0,+\infty[$ in the lesson's reporting convention. No analytic equation,
exact intermediate height, or symmetry is inferred from fig52.

## 747

The graph is speed $v$ in m/s against time $t$ in seconds. The speed rises
from0 to6 seconds, stays at5 m/s from6 to14 seconds, and falls from14 to16
seconds. The displayed ride starts and ends at speed0.

With the source's transition-point reporting style:

- Increasing: $[0,6[$ seconds.
- Constant: $]6,14[$ seconds.
- Decreasing: $]14,16]$ seconds.

The plateau endpoints also have speed5. Do not assert exact intermediate
speeds, distance, or a ride segment after16. Keep the three trend judgments
together as one coherent native multiple-statement or interval-matching unit,
not three artificial standalone items.

## 748

For $y=17x-2$, plot $(0,-2)$ and $(1,15)$, then extend their line both ways.
The x-intercept is $2/17$. For $x_2>x_1$,
$f(x_2)-f(x_1)=17(x_2-x_1)>0$: increasing on the real domain.

For $y=-2.8x+1$, plot $(0,1)$ and $(1,-1.8)$, then extend their line both ways.
Since $-2.8=-14/5$, the x-intercept is $5/14$.
$f(x_2)-f(x_1)=(-14/5)(x_2-x_1)<0$: decreasing on the real domain.
Intercepts determine location, not trend.

Production loss: choosing a valid construction description cannot demonstrate
actually plotting, scaling, or drawing either graph.

## 749

For $y=kx+l$, the ordered-input output difference is $k(x_2-x_1)$.

- Increasing: $y=8x-5$, $y=0.01x$.
- Decreasing: $y=-3x+10$, $y=-49x+1000$, $y=-\frac1{12}x$.
- Neither strictly increasing nor strictly decreasing: $y=0x+5$, constantly5.

The intercept does not affect trend. The zero-slope case must remain covered,
and the six formulas should be classified in natural groups, not by a
one-slot-per-formula conveyor.

## 750

$y=x^2$ has points $(-2,4),(-1,1),(0,0),(1,1),(2,4)$, vertex $(0,0)$, and an
upward-opening smooth parabola. $y=-x^2$ reflects these points in the x-axis,
giving $(-2,-4),(-1,-1),(0,0),(1,-1),(2,-4)$ and a downward-opening parabola.

For ordered inputs,
$x_2^2-x_1^2=(x_2-x_1)(x_2+x_1)$.
On the negative branch the second factor is negative; on the positive branch
it is positive. Negation reverses the signs.

- $x^2$: decreases on $]-\infty,0[$; increases on $]0,+\infty[$.
- $-x^2$: increases on $]-\infty,0[$; decreases on $]0,+\infty[$.

Neither is strictly monotone on all real inputs. Zero is in the domain and is
the vertex, not a deleted input.

Production loss: text recognition of valid construction and interval
descriptions does not demonstrate drawing either parabola.

## 751

Use the corrected $y=-6/x$, not a positive-numerator replacement.
Both functions have domain $\mathbb R\setminus\{0\}$.
For ordered inputs within either same-sign branch,
$$
\frac{k}{x_2}-\frac{k}{x_1}
=\frac{-k(x_2-x_1)}{x_1x_2},
\qquad x_1x_2>0.
$$

$y=-6/x$ increases separately on $]-\infty,0[$ and $]0,+\infty[$.
It has branches in quadrantsII andIV. Plotting points:
$(-6,1),(-3,2),(-2,3),(-1,6),(1,-6),(2,-3),(3,-2),(6,-1)$.
Both axes are asymptotes, not intersections.

$y=4/x$ decreases separately on the same two intervals. It has branches in
quadrantsI andIII. Plotting points:
$(-4,-1),(-2,-2),(-1,-4),(1,4),(2,2),(4,1)$.
Again both axes are asymptotes.

Neither function is strictly monotone on its disconnected whole domain.
For $-6/x$, moving from $x=-1$ to $x=1$ changes the output from6 to-6,
contradicting global increase; same-branch increase contradicts global
decrease. For $4/x$ this crossing changes the output from-4 to4,
contradicting global decrease; same-branch decrease contradicts global
increase. Do not replace two interval judgments by a monotonicity claim on
their union. No nondegenerate branch interval decreases for $-6/x$, or
increases for $4/x$.

Production loss: choosing branch geometry and interval descriptions does not
demonstrate drawing the actual reciprocal graphs and their asymptotic approach.

## 752

One valid construction is the connected broken line through
$(-5,3),(-2,0),(4,6),(7,3)$, restricted to $[-5,7]$, with both outer endpoints
included and no extensions.

Equivalently:
$$
f(x)=
\begin{cases}
-x-2,&-5\le x\le-2,\\
x+2,&-2<x\le4,\\
10-x,&4<x\le7.
\end{cases}
$$

The adjacent branches agree at0 when $x=-2$ and at6 when $x=4$.
Its slopes are $-1,+1,-1$, proving the required decrease on $[-5,-2[$,
increase on $]-2,4[$, and decrease on $]4,7]$.

This example is not unique. Its heights and continuity are authored choices,
not source data. The original conditions require neither continuity nor these
particular heights. Although the trend intervals exclude-2 and4, the domain
requires one defined function value at both. Their heights and compulsory
local extrema for every admissible function cannot be inferred from the
source conditions alone.

Production loss: recognizing a valid proposed text construction loses
open-ended graph production, choice of shape/heights, and plotting execution.
Never claim that selecting an option draws the graph.

## 753

Use principal nonnegative square roots:
$$
\sqrt{0.16}=\sqrt{16/100}=2/5,\qquad \sqrt{225}=15.
$$
Thus
$$
3\sqrt{0.16}-0.1\sqrt{225}
=6/5-3/2=-3/10=-0.3.
$$

Also $\sqrt{900}=30$ and $\sqrt{1/9}=1/3$, so
$$
0.2\sqrt{900}+1.8\sqrt{1/9}
=6+3/5=33/5=6.6.
$$

## Boundary And Next Stage

Four images were opened once each: source fig52, source fig53, current modern
fig52 complete preview, and current modern fig53 complete preview. Their
hashes were recorded before viewing in `image-use.json`. No other figures,
pages, crops, or previews were opened. These observations are not independent
figure-review approval.

No new candidate images are presently necessary. Use faithful text
classifications or valid construction descriptions and record all drawing
losses. If an essential visual alternative arises, it must use a named
deterministic image-skill `source.authoredBasis` path with a new independent
parent-coordinated gate, never an old referenced figure name.

After the explicit parent adapt-finalize notice, prepare the formal seed and
author all options from this frozen mathematics. Every candidate must not
share a correct independent source-requested result or intermediate.
Run the structural checker first when the draft is complete. No self-review
or self-pass is authorized; the parent coordinates independent gates and
n35 integration/evidence.
