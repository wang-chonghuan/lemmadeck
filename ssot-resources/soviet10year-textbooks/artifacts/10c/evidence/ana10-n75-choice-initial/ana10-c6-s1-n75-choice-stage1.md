# ana10-c6-s1-n75 Independent Choice Review: Stage1

2026-11-15. Independent reviewer, not author Peirce.
Source-first mathematical freeze before learner views or author internals.
This is a source-solution record, not a choice approval or standard answer key.

## Scope And Input Binding

Read the current `ld-s10y-choice/SKILL.md` and its
`references/review.md` and `references/contract.md`, then the authorized
seed:
`.intentfold/tickets/STEMROBIN-184/tmp/ana10-c6-s1-n75-seed.json`.
The seed contains14 source exercises, one selected concept and no figures.
Every exercise `figure_ids` and `source.concept_figure_ids` is empty.
No image is needed by this seed. The already-reviewed lesson body figure1
was not reopened or independently re-reviewed.

```text
seed raw SHA-256
c691f6c9806042e48b4b4dc97bc6592f42803fdcc921827a94f094dbd3d02fa1
seed canonical SHA-256, contract JSON digest
808eea8a38ec142df7d48b7d421761f7a54f7a3989b86791194464ff7990ede5
```

All four allowed trace files were hashed without inspecting their prose,
answers or configurations; actual byte hashes match the seed:

```text
ssot-resources/soviet10year-textbooks/artifacts/10c/book.json
9fe3a6dc3bc940b4cca50769e3acfe932139875e664d6ccd84f0244977383154
ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s1-n75/lesson.json
b3b0e71ee6a387ea8302e4d321037ba5bb8fd78efd27c80df6556a57dd7edaa6
ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s1-n75/exercises.json
f9c375d9ba2029e23834de253a2e3f7c802ee221b1ffe0c5df9d55f0ae9176e1
ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s1-n75/figures.json
f244127cab84d73c9075dba9d200603008016d42357d70c4e2a803ea1a63fc64
```

No draft, author notes/source, internal intent/key, standard answers,
answer keys, interactions, old choices, history or tests were read.
No source/tool edit, validator, image production, browser, service, app,
dependency, database, publication, promotion or cross-chat action occurred.
Only this Stage1 report is written for this assignment.

## Definition Authority And Task Boundary

The sole selected concept is block1, literally:

```text
$\sin' x=\cos x^{*}$. (1)
```

The mathematical theorem used here is the ordinary real sine derivative
$(\sin x)'=\cos x$, in radians. The printed star cannot supply a new
operation, a new variable $x^{*}$ or a different derivative law; its
footnote contents are not supplied by this seed and are not imported.
Likewise `(1)` is a formula label, not an exercise condition.
Radians are consistent with the selected sine-derivative theorem;
switching to degrees would change derivatives by the angular conversion
factor and is not an equivalent task.

All14 functions are real-valued, defined and smooth on all of
$\mathbb R$. The different letters $x,t,u$ denote the differentiation
variable of their respective functions, not parameters held constant.
Exact finite decimals are retained: $3.5=7/2$, $3.6=18/5$.
Every integer family below uses $k\in\mathbb Z$, including negative
integers and zero. Infinite interval endpoints are not included points.

Standard trig identities, chain/product/power differentiation and the
mean value theorem are used as independent mathematical reasoning.
They are not falsely attributed to additional selected definition blocks.
For increasing/decreasing proofs, the stronger order statement is
proved: $a<b$ implies $F(a)<F(b)$ or $F(a)>F(b)$, respectively.
No selected definition authorizes the false converse that strict
increase requires a positive derivative at every point.

**Source-task wording checkpoint:** exercises1-10 contain only their
function formulas, with no common instruction in the seed. The selected
sine-derivative concept supports computing their derivatives, which are
frozen below, but does not prove that the omitted source instruction
asked only for differentiation. Their task-intent entries are therefore
conditional on confirming the common written instruction from authorized
source prose. This is an input-authority gap, not a guessed extra task or
a mathematical failure. No source instruction or additional graph/proof
requirement has been invented. Parent can supply the missing common
instruction without reopening author internals or changing these solutions.
Exercises11-14 have explicit task prose and are reviewed as such.

## Exercises1-10: Frozen Mathematics

The following derivatives hold for every real input. Algebraically
equivalent forms are recorded to prevent later rejection or acceptance
based only on superficial formula shape.

### Source1

Seed: $f(x)=\sin3x$.

$f'(x)=3\cos3x$: inner derivative $(3x)'=3$.
Conditional differentiation task: apply sine differentiation and retain
the inner factor3, not merely replace sine by cosine.

### Source2

Seed: $g(x)=\sin(x/2+\pi)$.

$g'(x)=\frac12\cos(x/2+\pi)=-\frac12\cos(x/2)$.
Independently, $\sin(x/2+\pi)=-\sin(x/2)$ gives the same derivative.
Conditional task retains both the phase-shift sign and inner factor1/2.

### Source3

Seed: $h(x)=\sin(\pi/2-x)$.

$h'(x)=-\cos(\pi/2-x)=-\sin x$.
Equivalently $h(x)=\cos x$ before differentiation.
The inner derivative is $-1$; changing the inner argument's sign without
the resulting outer minus is not equivalent.

### Source4

Seed: $M(x)=3\sin^2(2x-1)$.
Put $v=2x-1$:

$$M'(x)=3\cdot2\sin v\cos v\cdot2
       =12\sin(2x-1)\cos(2x-1)
       =6\sin(4x-2).$$

$\sin^2 v$ is $(\sin v)^2$, not $\sin(v^2)$.
Conditional task coordinates outer coefficient, square-power derivative
and inner derivative; a valid equivalent answer need not use the same form.

### Source5

Seed: $f(t)=\sin2t\cos t-\sin t\cos2t$.

The subtraction identity gives $f(t)=\sin(2t-t)=\sin t$, so
$f'(t)=\cos t$. Differentiating both products also gives

$$f'(t)=\cos2t\cos t+\sin2t\sin t=\cos t.$$

Conditional task allows a justified identity simplification or a correct
product-rule calculation, not a claim that the two original products cancel.

### Source6

Seed: $f(x)=\sin(-x)+\sin x$.

Oddness gives $f(x)=0$ identically and $f'(x)=0$ identically.
Directly, $-\cos(-x)+\cos x=0$ because cosine is even.
Cancellation is global, not restricted to particular roots.

### Source7

Seed: $g(x)=\sin2x-2\sin x\cos x+5$.

The double-angle identity gives $g(x)=5$ identically, hence
$g'(x)=0$. Directly,
$2\cos2x-2(\cos^2x-\sin^2x)=0$.
The function equals5; its derivative equals0. These facts are not
interchangeable.

### Source8

Seed: $h(x)=\sin(2x-3.5)+\sin2x$.

$$h'(x)=2\cos(2x-3.5)+2\cos2x
       =4\cos(7/4)\cos(2x-7/4).$$

The sum identity gives $h(x)=2\cos(7/4)\sin(2x-7/4)$ first.
Both original inner derivatives equal2. There is no identity making
this sum identically zero; the exact decimal shift is not rounded or
treated as a multiple of $\pi$.

### Source9

Seed: $M(x)=2x+3.6\sin^5(\pi-x)$.

$$M'(x)=2-18\sin^4(\pi-x)\cos(\pi-x)
       =2+18\sin^4x\cos x.$$

Here $\sin(\pi-x)=\sin x$ and $\cos(\pi-x)=-\cos x$.
The direct chain rule's minus and the supplementary-angle cosine minus
cancel in the simplified expression. The coefficient is
$3.6\cdot5=18$, the remaining sine power is4, and $(2x)'=2$.
No restriction to positive $x$ or a trigonometric period is introduced.

### Source10

Seed: $f(u)=\cos2u\cos(\pi/2)-\sin2u\sin(\pi/2)$.

$\cos(\pi/2)=0$ and $\sin(\pi/2)=1$, so $f(u)=-\sin2u$ and
$f'(u)=-2\cos2u$. Equivalently
$f(u)=\cos(2u+\pi/2)$.
The $\pi/2$ factors are constants; the differentiation variable is $u$.

## Source11: Positive Derivative And Proof

Seed asks to prove that $f(x)=2x-\sin x$ has positive derivative for
all $x$, and therefore increases on $\mathbb R$.

$$f'(x)=2-\cos x,\qquad 1\le f'(x)\le3.$$

Since the lower bound is strictly positive, for arbitrary $a<b$
the mean value theorem gives
$f(b)-f(a)=f'(c)(b-a)\ge b-a>0$ for some $c\in(a,b)$.
This proves strict increase on the entire domain.

Essential source tasks: obtain the derivative, justify a global positive
bound and connect it to the all-real order conclusion. Checking one point,
reporting only a derivative expression, or silently weakening the domain
does not cover the explicit proof.
Recognizing a complete valid argument may preserve these distinctions;
it does not demonstrate independent written-proof production and must
record that response-format loss.

## Source12: Zero Derivative, Strict Increase And Graph

Seed has three explicit tasks for $g(x)=x-\sin x$:
find all inputs where its derivative is zero; prove increase on
$\mathbb R$; draw its graph.

### Exact Stationary Set And Proof

$$g'(x)=1-\cos x=2\sin^2(x/2)\ge0,$$

and $g'(x)=0$ if and only if $x=2k\pi$, $k\in\mathbb Z$.
The zero set is not all $k\pi$, not just nonnegative multiples and not
just $x=0$. Equality at these points does not make $g$ constant.

Nonnegative derivative alone yields nondecrease. For strict increase,
take arbitrary $a<b$. There exist $a<u<v<b$ in an interval avoiding
the discrete set $2\pi\mathbb Z$. Thus $g'>0$ throughout $[u,v]$;
the mean value theorem gives $g(v)>g(u)$. Nondecrease on the full
domain gives

$$g(a)\le g(u)<g(v)\le g(b),$$

so $g(a)<g(b)$. This does not incorrectly apply the strictly-positive-
everywhere criterion to a function whose derivative actually has zeros.

### Frozen Graph Relationships

- Domain and range are both $\mathbb R$; $g$ is odd and has the unique
  zero $(0,0)$.
- $g(x)-x=-\sin x$, so $x-1\le g(x)\le x+1$.
  It oscillates relative to the line $y=x$ while remaining strictly
  increasing; the graph itself is not a periodic bounded sine wave.
- $g(k\pi)=k\pi$ for every integer $k$.
  At $x=2k\pi$, the graph has horizontal tangent $y=2k\pi$.
  These are stationary inflection points, not local maxima/minima or
  constant intervals.
- $g''(x)=\sin x$: second derivative positive on
  $(2k\pi,(2k+1)\pi)$ and negative on
  $((2k-1)\pi,2k\pi)$. Every $k\pi$ is an inflection input.
  At odd multiples $(2k+1)\pi$ the tangent slope is2, not0.
- $g(x+2\pi)=g(x)+2\pi$; the profile repeats by simultaneous horizontal
  and vertical translation, not by horizontal periodicity.
- $g(x)\to-\infty$ as $x\to-\infty$ and $g(x)\to+\infty$ as
  $x\to+\infty$. A finite-window depiction is a view of this global
  graph, not a new finite source domain.

Capacity checkpoint: a choice conversion needs to preserve the discrete
stationary set, the legitimate strict-increase reasoning and graph
distinctions. A full graph-recognition task can be meaningful, but it
does not demonstrate constructing/drawing the graph from scratch.
That loss must be explicit. A derivative-only conversion would silently
omit the proof and graph tasks; an isolated correct stationary value
cannot stand in for the complete all-real family.

## Source13: Full Qualitative Discussion

Seed asks to discuss $h(x)=x-2\sin x$. It does not explicitly state
an additional drawing command or supply a definition enumerating the
required discussion components. The following is the frozen independent
qualitative solution, not a newly imposed source checklist.

### Domain, Derivative And Order Structure

$h$ is smooth on $\mathbb R$, odd, unbounded in both directions, with
range $\mathbb R$. Also $x-2\le h(x)\le x+2$ and
$h(x+2\pi)=h(x)+2\pi$; it is not periodic.

$$h'(x)=1-2\cos x.$$

The complete stationary set is
$x=2k\pi-\pi/3$ or $x=2k\pi+\pi/3$.
For every integer $k$:

| Input interval | Derivative sign | Behavior |
| --- | --- | --- |
| $(2k\pi-\pi/3,2k\pi+\pi/3)$ | Negative | Strictly decreasing |
| $(2k\pi+\pi/3,2(k+1)\pi-\pi/3)$ | Positive | Strictly increasing |

The same strict order properties hold when finite stationary endpoints
are attached to each interval. Endpoints have derivative zero, not
positive/negative derivative. $h$ is neither globally increasing nor
globally decreasing.

At $x=2k\pi-\pi/3$, the derivative changes from positive to negative:
local maximum value

$$2k\pi-\pi/3+\sqrt3.$$

At $x=2k\pi+\pi/3$, the derivative changes from negative to positive:
local minimum value

$$2k\pi+\pi/3-\sqrt3.$$

These are local, not global extrema: the values drift with $2k\pi$
and the function is unbounded. Merely discussing $[0,2\pi]$ without
the integer translations loses negative inputs and the full real domain.

### Graph, Curvature And Zeros

$h''(x)=2\sin x$ is positive on
$(2k\pi,(2k+1)\pi)$ and negative on $((2k-1)\pi,2k\pi)$.
Inflection points are $(k\pi,k\pi)$, with slope
$1-2(-1)^k$: slope $-1$ at even multiples and3 at odd multiples.
In particular the origin is a nonstationary inflection point, not a
local extremum or a horizontal flat point.

The complete real zero set is $\{-r,0,r\}$, where $r$ is the unique
positive solution of $r=2\sin r$, with $\pi/3<r<2$.
Indeed a zero must satisfy $|x|\le2$; on $(0,\pi/3]$ the function is
strictly decreasing from0 and negative, while on $[\pi/3,2]$ it is
strictly increasing with
$h(\pi/3)=\pi/3-\sqrt3<0$ and $h(2)=2-2\sin2>0$.
For $x>2$, $h(x)\ge x-2>0$. Oddness gives exactly one negative
nonzero root and no others.
Signs are negative on $(-\infty,-r)$ and $(0,r)$, positive on
$(-r,0)$ and $(r,\infty)$.

Task/capacity checkpoint: the essential all-real order and local-extremum
relationships distinguish this function from sources11/12.
Reporting only $1-2\cos x$ does not constitute a substantive discussion.
Meaningful recognition of a complete sign/extremum analysis need not
prove independent production of a full discussion; that production loss
must be recorded. The seed does not justify insisting that every optional
second-derivative detail be a separate question, nor does it justify
replacing the global discussion by a single sampled value.

## Source14: Global Decrease Proof

Seed asks to prove that $g(x)=\sin(2x-5)-3x$ decreases on the
French-notation interval $]-\infty,\infty[=\mathbb R$.

$$g'(x)=2\cos(2x-5)-3,\qquad -5\le g'(x)\le-1<0.$$

For arbitrary $a<b$, the mean value theorem gives
$g(b)-g(a)=g'(c)(b-a)\le-(b-a)<0$.
Thus $g$ is strictly decreasing on the whole specified domain.
There are no derivative zeros and no local stationary extrema.

Essential task: retain the inner derivative factor2 and the linear
derivative $-3$, use the uniform negative bound and conclude global
decrease. The apparent sinusoidal term does not make the whole function
periodic or alternate increasing/decreasing. Neither checking only one
period nor treating infinities as attained endpoints is faithful.
Recognition of a complete valid proof may preserve the mathematical
judgment but does not demonstrate independent written-proof production.

## Stage1 Freeze And Next Gate

All14 source functions have frozen independent mathematics above:
ten derivative computations and the explicit proofs/graph/discussion
tasks11-14. No learner question or option has been inspected, solved or
assigned a true set. No key, native mode, distractor or package coverage
has been inferred.

The only current source-task authority checkpoint is the missing common
instruction for formula-only exercises1-10. Their derivative identities
are complete and do not need re-solving; unconditional claims about the
source task await that allowed instruction. No extra selected definition,
star convention or source figure was invented to close the gap.

Freeze this report before Stage2. Only after parent authorizes
learner-only views should task fidelity/redundancy/leakage and all option
truth sets be reviewed. Author intent, rationales, keys and coverage remain
unopened until Stage2 itself is frozen and Stage3 is separately authorized.

## Authorized Written-Heading Confirmation

2026-11-15. Subsequent source-only authorization resolves the task-wording
checkpoint without revisiting the mathematics. Read only the
`{number, group, text}` projection of exercises[0..9] from:

```text
ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s1-n75/exercises.json
SHA-256: f9c375d9ba2029e23834de253a2e3f7c802ee221b1ffe0c5df9d55f0ae9176e1
```

Actual file bytes match the existing seed trace. Projected numbers are
exactly1-10, each formula agrees with its frozen seed text, and all ten
projected `group` values are literally **`习题求下列函数的导函数：`**.
This is original written task prose from the allowed modern exercise
file, not an answer, author intent or configuration.

Thus sources1-10 unconditionally ask for the derivative functions.
Their task boundaries are the full differentiation computations already
frozen above, with their original real domains and variables. No graph,
monotonicity proof or general function-discussion task is added to1-10
by this heading. The explicit additional tasks in11-14 remain distinct.
The earlier conditional wording is retained as the initial observation;
this appendix closes that authority gap, not a mathematical repair.

Initial Stage1 report SHA-256 before this append:
`98770dc5e5df64b279ccd8bf12c5c8ab92fc0ba422ae7fccc1c60bc8f448a387`.
The seed is unchanged, and no extra seed field/schema or source was
created. No solution was recomputed; no source data, answer/interaction
fields, draft, notes, learner views or internal key was inspected.
Stage2 remains pending parent's authorized learner-only view snapshot.
