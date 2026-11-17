# STEMROBIN-184 / SessionB / 10c n103 / Stage1 Source-First

Status: FROZEN independent source reasoning, before any author/view/key disclosure.
This is an internal Stage1 record, not a final choice review or an approval.
Date: 2026-11-17 (Europe/Dublin).

## Authority and Boundaries

- Sole mathematical input: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103/seed.json`.
- Source selector: book `10c`, lesson `ana10-c7-s2-n103`.
- Independently computed canonical seed SHA-256: `02950a8ca7ca60681040fff0150972ef34adfb328918bdaeeedd9911934640cf`.
- Raw seed byte SHA-256: `103a6fda2ee82573be7af97b2f2906dccd7230334b5d6ee2b525ac645cad46da`.
- Read procedural rules only from `ld-s10y-choice/SKILL.md`, `references/review.md`, and `references/contract.md`.
- All four unsolved sources, 440-443, and definition blocks 0, 1, 4, 5 were read.
- Every source `figure_ids` list, `source.concept_figure_ids`, and `figures` is empty. ZERO images were opened, generated, or transmitted.
- No author draft, source-solutions file, standard answer, judging key, previous choice, interaction, or other ticket artifact was read.
- Calculations below were derived directly from the authorized prose. No answer engine, test, validator, prepare/refresh command, browser, database, publisher, application, edition edit, or Git operation was used.
- Seed `trace` entries are declared provenance only; their target files were not opened or rehashed.

## Definition Basis and Interpretation

The four supplied definitions state:

- Block 0: along a straight line, `v(t) = x'(t)` and `integral[t0,t] v(z) dz = x(t) - x(t0)`.
- Block 1: `x(t) = x0 + integral[t0,t] v(z) dz`; the initial coordinate is an independent datum.
- Block 4: acceleration `A(t) = v'(t)` and `integral[t0,t] A(z) dz = v(t) - v(t0)`.
- Block 5: `v(t) = v0 + integral[t0,t] A(z) dz`; the initial velocity is an independent datum.

These definitions distinguish signed coordinate velocity from nonnegative distance traveled. For a scalar coordinate velocity, distance is `integral |v(t)| dt`, not automatically `integral v(t) dt` or the absolute value of that final integral. Integrating a derivative recovers a coordinate difference unless an initial coordinate is specified.

Write `A(t)` for acceleration when necessary to avoid confusing it with the coefficient called `a` in source 442. Coefficients `R` and `a` in that source are treated as real constant parameters of the displayed law; no numerical values or signs are supplied.

The seed gives no explicit unit labels. Outputs retain the coordinate/time units of the stated laws. SI labels are conditional on SI input, not asserted source facts. In 440, `g approximately 9.8` is approximate physical input. Rational coefficients using `g_model = 49/5` are exact within that chosen numerical model, not claims that the actual acceleration is exactly `49/5`.

## Source 440

### Authorized Prose

> 440. 将石块上抛，如果忽略空气的阻力并且认为重力加速度$g\approx9.8$，求：
> 1) 石块上升的最大高度与初速度$v_0$的关系；
> 2) 石块在最高位置时的速度；
> 3) 经过多少时间石块落到地面？

### Tasks and Missing Conditions

There are three requested tasks: maximum ascent height versus initial velocity; velocity at the highest position; elapsed time until landing on the ground.

The launch height above the ground is not stated. Therefore returning to launch height and landing on the ground are not automatically the same event. Also, the literal phrase "上抛" does not explicitly specify a zero horizontal component. The selected definitions discuss straight-line motion, which supports considering a vertical one-dimensional model, but the source does not separately state that this stone has only vertical motion. The vertical model below is an explicitly labeled branch, not an invented source condition.

UNKNOWN from this seed alone:

- Launch height `h0` relative to the ground.
- Whether "maximum height" denotes ascent above the launch point or altitude above the ground.
- If the throw is not explicitly vertical: the initial vertical component and any horizontal component when `v0` means total initial speed.
- Explicit physical unit system.

### Independent Vertical-Model Solution

Choose the upward coordinate as positive; let ground have height zero. Suppose the throw is vertical, `v0 > 0` is its initial upward coordinate velocity, `g > 0` is constant, and `h(0) = h0`. These are the named conditions of this calculation.

The gravitational coordinate acceleration is `A(t) = -g`. Blocks 5 and 1 give

```text
v(t) = v0 - g t,
h(t) = h0 + v0 t - (g/2) t^2.
```

For task 1, solve `v(t_peak) = 0`:

```text
t_peak = v0/g,
h_peak - h0 = v0(v0/g) - (g/2)(v0/g)^2 = v0^2/(2g),
h_peak = h0 + v0^2/(2g).
```

The second derivative `h''(t) = -g < 0` proves this is a maximum. Thus the maximum rise is `v0^2/(2g)`; maximum height above the ground additionally depends on `h0`.

For task 2, `v(t_peak) = 0`. In this explicitly vertical model, both signed velocity and speed are zero. Acceleration remains `-g`; it does not vanish at the peak.

For task 3, landing requires the ground equation, not merely the peak condition:

```text
0 = h0 + v0 t - (g/2) t^2,
t = (v0 +/- sqrt(v0^2 + 2g h0))/g.
```

For the launch-at-or-above-ground case `h0 >= 0`, the descending landing time is

```text
t_ground = (v0 + sqrt(v0^2 + 2g h0))/g.
```

If `h0 > 0`, the other root is negative. If `h0 = 0`, the roots are `0` and `2v0/g`; the former is the launch instant, and the latter is the positive return/landing time. Therefore

```text
t_ground = 2v0/g
```

is justified only after stating `h0 = 0` in this vertical model. It is not an unconditional ground-landing answer supported by the supplied prose.

Under the approximate numerical model `g_model = 49/5`, the corresponding exact model expressions are

```text
t_peak = 5v0/49,
maximum rise = 5v0^2/98,
h_peak = h0 + 5v0^2/98,
t_ground = (5/49)(v0 + sqrt(v0^2 + (98/5)h0)),
t_ground when h0 = 0 = 10v0/49.
```

### Nonvertical Branch and Limits

If the initial upward component is instead `u0 > 0`, replace `v0` by `u0` in the vertical-height and landing equations. At the apex, the vertical component is zero. A nonzero constant horizontal component is not eliminated by that condition; total speed need not be zero. If `v0` denotes total initial speed and the throw direction is unspecified, neither `u0` nor total apex speed is determined.

No direction angle, horizontal component, or launch height is supplied here. No numerical instance of those quantities is fabricated.

The vertical formulas use `v0 > 0`. With `v0 = 0`, a genuine upward ascent is absent; with `h0 = 0` the positive-return formula degenerates to zero. Negative upward coordinate velocity does not satisfy the stated upward launch branch.

### Response-Unit Distinction

The three mathematical tasks remain distinct even if a later visible response bundles them into one conditional triple. A response must distinguish rise from ground-relative height and distinguish return to launch height from landing. The peak equation, height integration, and ground intersection cannot be replaced by a single numerical slot or by an unstated launch-at-ground assumption.

## Source 441

### Authorized Prose

> 441. 如果质点的速度按$v=9.8t-0.003t^2$的规律变化，求由$t=0$到$t=5$的时间间隔内质点所通过的路程。
> 求质点在路程终点(就是当$t=5$时)的加速度。

### Independent Solution

There are two requested tasks: distance over `[0,5]` and acceleration at the stated endpoint `t = 5`. "终点" is explicitly temporal here, not a stopping time chosen by setting velocity to zero.

Retain the stated decimal coefficients as exact rational coefficients of the given law:

```text
v(t) = (49/5)t - (3/1000)t^2
     = t(9800 - 3t)/1000.
```

For `0 <= t <= 5`, `t >= 0` and `9800 - 3t >= 9785 > 0`. Hence `v(0) = 0` and `v(t) > 0` for `0 < t <= 5`. There is no reversal in this interval, so distance equals signed displacement in this particular task.

```text
F(t) = (49/10)t^2 - (1/1000)t^3,
S = integral[0,5] |v(t)| dt
  = F(5) - F(0)
  = (49/10)25 - 125/1000
  = 245/2 - 1/8
  = 979/8
  = 122.375.
```

The endpoint acceleration is obtained by differentiating velocity, not by dividing final velocity by elapsed time:

```text
A(t) = 49/5 - (3/500)t,
A(5) = 49/5 - 15/500
     = 49/5 - 3/100
     = 977/100
     = 9.77.
```

For a direct endpoint consistency calculation, `v(5) = 49 - 3/40 = 1957/40 = 48.925`, which is still positive. This value is not a third requested response. Likewise, no initial position is needed for the distance; the absolute endpoint coordinate remains UNKNOWN without an initial coordinate, but is not requested.

Distance has coordinate-length units; acceleration has coordinate-length/time-squared units. No explicit `m` or `s` label is inferred from the seed.

### Response-Unit Distinction

Two mathematical outputs, `(S_[0,5], A(5))`, form a coherent motion-interval response unit if later bundled. They also can be assessed separately, provided both tasks remain covered. Neither the final velocity nor an average acceleration can substitute for endpoint acceleration. Sign checking explains why the integral is a distance here.

## Source 442

### Authorized Prose

> 442. 设动点的速度按$v=Rt+a\sqrt{t}$的规律变化。
> 求由$t=0$到$t=4$的时间间隔内这个动点所通过的路程和它在路程终点的加速度。

### Tasks, Domain, and Parameter Data

There are two requested tasks: distance over `[0,4]` and acceleration at `t = 4`. The coefficient `a` is not the acceleration function.

The square-root law has real time domain `t >= 0`. `R` and `a` are unspecified real constant coefficients. Their values and signs are UNKNOWN, so a numerical answer cannot be extracted. A complete symbolic, sign-conditioned solution is nevertheless available; missing signs must not be filled with `R >= 0` and `a >= 0`.

The supplied definition `v = x'` makes the displayed expression a signed coordinate velocity. Calling the output "路程" does not turn an arbitrary signed law into a nonnegative speed law.

### Displacement and Endpoint Acceleration

An antiderivative with zero value at zero is

```text
F(t) = (R/2)t^2 + (2a/3)t^(3/2).
```

Since `4^(3/2) = 8`,

```text
D = integral[0,4] v(t) dt = F(4) = 8R + (16/3)a.
```

This is displacement, not yet the distance for unspecified signs.

For `t > 0`,

```text
A(t) = v'(t) = R + a/(2sqrt(t)),
A(4) = R + a/4.
```

When `a != 0`, there is no finite right derivative of `v` at zero: the difference quotient is `R + a/sqrt(t)`. This does not obstruct either the continuous velocity's distance integral or the requested endpoint derivative at four. When `a = 0`, the right endpoint-zero derivative is `R`; an extension of the linear law has derivative `R` as well.

### Full Distance Solution

For positive time,

```text
v(t) = sqrt(t)(R sqrt(t) + a).
```

Set `u = sqrt(t)`. Over the interval, `u` runs from `0` to `2`, so the possible sign change is governed by the linear expression `Ru + a`, whose limiting/start and end values are `a` and `a + 2R`.

If `a(a + 2R) >= 0`, there is no interior sign change and

```text
S = integral[0,4] |v(t)| dt = |D|.
```

Boundary zeros at `t = 0` or `t = 4` do not introduce an interior reversal. In particular, `R = 0`, `a = 0`, and the zero-motion case are covered without division by zero.

If `a(a + 2R) < 0`, there is exactly one interior zero, and necessarily `R != 0`:

```text
u_star = -a/R,       0 < u_star < 2,
t_star = a^2/R^2,    0 < t_star < 4.
```

Using the positive square root `sqrt(t_star) = -a/R`,

```text
F(t_star)
  = (R/2)(a^4/R^4) + (2a/3)(-a/R)^3
  = a^4/(2R^3) - 2a^4/(3R^3)
  = -a^4/(6R^3).
```

The distance then sums the two monotone path lengths:

```text
S = |F(t_star)| + |D - F(t_star)|.
```

An explicit complete partition, with boundary equality placed in the no-crossing cases, is

```text
If a >= 0 and a + 2R >= 0:
    S = D = 8R + (16/3)a.

If a <= 0 and a + 2R <= 0:
    S = -D = -8R - (16/3)a.

If R > 0 and -2R < a < 0:
    S = D + a^4/(3R^3).

If R < 0 and 0 < a < -2R:
    S = -D - a^4/(3R^3).
```

The first two cases overlap only when `R = a = 0`, where both give zero. In the crossing cases a compact equivalent expression is

```text
S = sign(R) D + a^4/(3|R|^3).
```

### Exact Arithmetic Witnesses

These are source-derived calculations, not a run of tests or a consultation of answers:

- `R = 1, a = -1`: `t_star = 1`, `D = 8/3`, `F(t_star) = -1/6`, so `S = 1/6 + 17/6 = 3`, whereas `|D| = 8/3`. Endpoint acceleration is `3/4`.
- `R = -1, a = 1`: `D = -8/3`, `F(t_star) = 1/6`, so `S = 3` and endpoint acceleration is `-3/4`.
- `R = 0, a = -1`: no interior reversal; `D = -16/3`, `S = 16/3`, and `A(4) = -1/4`.
- `R = 1, a = -3/2`: `t_star = 9/4`, `D = 0`, `F(t_star) = -27/32`, and `S = 27/16`. Even `|D| = 0` can miss strictly positive distance.

Thus neither bare `D` nor universal `|D|` is a correct general distance formula. The familiar pair `(8R + 16a/3, R + a/4)` requires a nonnegative-velocity condition, such as `a >= 0` and `a + 2R >= 0`; those signs are not supplied.

### Response-Unit Distinction

The distance task contains a parameter/sign judgment as well as integration. A later coherent pair `(S_[0,4], A(4))` must include its parameter domain or a complete piecewise distance. The two outputs must not be confused with two isolated copied cells, and a newly added sign restriction would narrow the source's parameter coverage and must be disclosed. The absence of numerical parameters is not permission to invent them.

## Source 443

### Authorized Prose

> 443.
> a) 设质点沿抛物线$y=x^2-2x+3$运动，使得它在横轴上的投影具有恒定速度$v$。求这个质点在纵坐标轴上的投影的速度和加速度(用$x$表示)。
> b) 设质点沿函数$y=x^3-2x^2$的图像运动，使得它在横轴上的投影具有恒定速度$v$。求这个质点在纵坐标轴上的投影的速度和加速度。

### Common Chain-Rule Basis

There are two curve scenarios, each requesting two different outputs: vertical projection velocity and vertical projection acceleration. They are not requests for slope alone or total path speed.

Using the supplied signed coordinate-velocity definition, horizontal projection motion means

```text
dx/dt = v (constant),   d^2x/dt^2 = 0.
```

For a curve `y = f(x(t))`,

```text
v_y = dy/dt = f'(x) dx/dt = f'(x)v,
A_y = d/dt[f'(x)v]
    = f''(x)(dx/dt)v + f'(x)(dv/dt)
    = f''(x)v^2.
```

The factor in acceleration is `v^2`, not just `v`, because the derivative is with respect to time twice. Constant horizontal velocity does not imply constant vertical velocity or zero vertical acceleration.

No restriction `v > 0` is supplied. The coordinate-velocity reading permits either sign or zero. If "速度" were instead intended to mean only a speed magnitude, direction would have to be supplied to identify signed projection velocity. This record uses the authorized definition, not an invented positive direction.

### Part a: Parabola

```text
f(x) = x^2 - 2x + 3,
f'(x) = 2x - 2,
f''(x) = 2.

v_y(x) = (2x - 2)v = 2v(x - 1),
A_y(x) = 2v^2.
```

Both requested expressions are obtained. Although the acceleration is requested "用x表示", it happens to be independent of `x`; one must not force an artificial `x` factor.

For `v != 0`, vertical velocity vanishes at `x = 1`, yet vertical acceleration is strictly positive there and everywhere else. For `v > 0`, vertical velocity is negative when `x < 1` and positive when `x > 1`; a negative `v` reverses those signs. If `v = 0`, both outputs are zero.

The constant term `3` changes height but not either derivative. No initial position is required for the requested `x`-based expressions.

### Part b: Cubic

```text
f(x) = x^3 - 2x^2,
f'(x) = 3x^2 - 4x,
f''(x) = 6x - 4.

v_y(x) = (3x^2 - 4x)v = vx(3x - 4),
A_y(x) = (6x - 4)v^2.
```

For `v != 0`, vertical velocity vanishes at `x = 0` and `x = 4/3`. For `v > 0`, its sign is positive for `x < 0` or `x > 4/3` and negative for `0 < x < 4/3`; a negative `v` reverses these signs.

For `v != 0`, vertical acceleration vanishes at `x = 2/3`, is negative below that point, and positive above it. The acceleration zero is not a velocity zero. If `v = 0`, both outputs vanish identically.

Part b does not explicitly repeat the instruction to express results in `x`, but these symbolic expressions follow directly from the stated graph and constant horizontal velocity. To demand explicit functions of elapsed time instead, one would additionally need a reference coordinate/time or leave it symbolic:

```text
x(t) = x0 + v(t - t0).
```

Neither `x0` nor `t0` is supplied. They are not needed for the expressions above; no numerical trajectory is inferred.

### Projection Versus Magnitude and Response Units

The magnitude of the vertical projection speed would be `|f'(x)v|`. Total planar speed would be `|v|sqrt(1 + [f'(x)]^2)`. Neither is the signed vertical projection velocity defined by the lesson. Acceleration in this solution is the signed vertical coordinate acceleration, not a derivative of a speed magnitude.

A natural response unit is the pair `(v_y, A_y)` for one curve. The two source parts therefore contain four mathematical output tasks, potentially grouped as two coherent curve-wise units. A later combined response could cover both, but one curve cannot silently stand in for the other. Omitting a chain-rule factor or treating `v` as the total speed changes the mathematics.

## Frozen Task Inventory

| Source | Mathematical output task | Independently established result and condition |
| --- | --- | --- |
| 440.1 | Maximum ascent height versus initial velocity | Vertical branch: rise `v0^2/(2g)`; ground-relative peak `h0 + v0^2/(2g)`. Direction and height-reference qualifications remain explicit. |
| 440.2 | Velocity at the highest position | Vertical component zero; total velocity zero only in the purely vertical branch. |
| 440.3 | Ground landing time | Vertical, `v0 > 0`, `h0 >= 0`: `(v0 + sqrt(v0^2 + 2g h0))/g`; `2v0/g` additionally requires `h0 = 0`. |
| 441.1 | Distance on `[0,5]` | `979/8`, after proving velocity nonnegative on the interval. |
| 441.2 | Acceleration at `t = 5` | `977/100`. |
| 442.1 | Distance on `[0,4]` | Complete sign partition above; `D = 8R + 16a/3` is only displacement without conditions. |
| 442.2 | Acceleration at `t = 4` | `R + a/4`, for the displayed constant-parameter law. |
| 443.a.1 | Parabola's vertical projection velocity | `(2x - 2)v`, with `dx/dt = v`. |
| 443.a.2 | Parabola's vertical projection acceleration | `2v^2`. |
| 443.b.1 | Cubic's vertical projection velocity | `(3x^2 - 4x)v`, with `dx/dt = v`. |
| 443.b.2 | Cubic's vertical projection acceleration | `(6x - 4)v^2`. |

Count: four source exercises, eleven requested mathematical output tasks. This is not an instruction to construct eleven choices, eleven questions, or eleven answer slots. Conditions, sign reasoning, and chain-rule relationships are part of task fidelity rather than additional numbered tasks.

## Stage1 Closure

All four source tasks have been independently solved to the extent supported by the seed, including exact arithmetic, full parameter cases, and explicitly conditional branches where source data are missing.

No candidate option, complete true option set, key agreement, task-fidelity verdict, redundancy verdict, leakage verdict, package-coverage verdict, or final outcome has been assigned.

This record is frozen at its returned byte SHA-256. Later discoveries belong in separate Stage2/Stage3 records; do not retrospectively edit this source-first record after disclosure.

Next authorized action: WAIT for the sole Stage2 view-only disclosure. Stage3 internal comparison remains pending after Stage2. No final review exists at this freeze.
