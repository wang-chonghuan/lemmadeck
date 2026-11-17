# STEMROBIN-184 SessionB: Frozen StageA Source-First Review

- Date: 2026-11-17.
- Scope: STANDARD ANSWER independent mathematical review, StageA only.
- Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
- Book / edition / lesson: `10c` / `modern-us-neutral` / `ana10-c7-s2-n103`.
- Exercise scope: exactly `440`, `441`, `442`, `443`.
- The request's token `n1034` is not used to select another lesson: the explicitly authorized path and all three source files identify `ana10-c7-s2-n103`.
- This document is frozen before any candidate comparison. It is evidence only, not a formal handoff or production answer key.
- All results below are independently derived. No book answer lookup was made; this does not assert that book answers are absent.
- No answer keys, scratch derivations, author drafts, choices, peer reports, or ticket reports were read.
- ZERO images: `lesson.figures`, the figure registry, and every exercise's `figure_refs` and `figures` are empty.

## Sole Content Authority

Actual SHA-256 hashes of the authorized edition files, not their embedded original-source hash fields:

| Absolute path | SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/lesson.json` | `29d12cf4190fdf1ce7b77d92cbc005fc1152b584a11e8449dae061922c8c5205` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/exercises.json` | `41e685e3e8284208a2b5b7187d04c010c187af92e32daa5e43491cc87ba157f7` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s2-n103/figures.json` | `2a6dc86f35e0bd70b6db5291ab7aa15f25e4fa6c19eba1633101b8f1621aa730` |

The modern top-level exercise texts are authoritative. Nested `source.data` and `source_text` were encountered within the same authorized files, but do not replace modern wording. No linked original file was opened.

The lesson supplies straight-line, signed coordinate-derivative conventions:

\[
v(t)=x'(t),\qquad A(t)=v'(t),\qquad
x(t)=x(t_0)+\int_{t_0}^{t}v(z)\,dz.
\]

It also supplies the constant-acceleration model with initial coordinate and velocity. Thus an initial coordinate must not silently be set to zero when an absolute height or ground contact depends on it. Distance traveled is \(\int |v(t)|\,dt\); the signed integral alone is displacement.

## Coverage and Requested Quantities

The declared lesson count, exercise-file count, and actual array length are all four. All exercises belong to `group_id=g1`, with matching modern and source numbers.

| Exercise | Source locator within authorized JSON | Requested quantities, preserving order |
| --- | --- | --- |
| 440 | `exercises[0]`, `p0123#5` | `1)` maximum upward height versus \(v_0\); `2)` velocity at the highest point; `3)` elapsed time to ground |
| 441 | `exercises[1]`, `p0123#6` | Unnumbered first request: distance on \([0,5]\); unnumbered second request: acceleration at \(t=5\) |
| 442 | `exercises[2]`, `p0123#7` | Unnumbered first request: distance on \([0,4]\); unnumbered second request: acceleration at \(t=4\) |
| 443 | `exercises[3]`, `p0124#1` | `a)` vertical-projection velocity and acceleration; `b)` vertical-projection velocity and acceleration |

Total: four exercises and eleven independently enumerated requested quantities. The two quantities in each unnumbered 441/442 prompt are separate outputs, not source-authored numbered subparts.

## Exercise 440

### Source Conditions and Missing Data

Given: a stone is thrown upward; air resistance is ignored; gravitational acceleration has magnitude \(g\approx9.8\); the initial velocity is denoted \(v_0\). The three source labels are `1)`, `2)`, `3)`.

The straight-line lesson and upward throw support the usual one-dimensional vertical model. Choose upward as positive and take the throw as \(t=0\); these are coordinate conventions, not added physical data. Then \(v_0>0\), \(g>0\), and vertical acceleration is \(-g\).

Missing or not explicitly specified:

1. The height of the launch point above the ground is not stated. Introduce \(h_0\ge0\) for the general ground-impact calculation; do not assert \(h_0=0\) as a source fact.
2. The numeric value of \(v_0\) is not supplied, intentionally allowing a symbolic answer.
3. The prompt does not explicitly attach units to \(g\), height, velocity, or time. Metres and seconds are a conditional SI interpretation of \(g\approx9.8\), not a quoted unit declaration.
4. Whether "maximum height" means rise above the launch point or absolute height above ground is not specified. Give both, with the distinction explicit.

### Independent Derivation

Integrating the constant downward acceleration gives

\[
v(t)=v_0-gt,\qquad
h(t)=h_0+v_0t-\frac{g}{2}t^2.
\]

At the highest point \(v(t_*)=0\), so

\[
t_*=\frac{v_0}{g},\qquad
h(t_*)-h_0=\frac{v_0^2}{2g}.
\]

The second derivative is \(-g<0\), so this is a maximum, not a minimum.

For ground contact, solve \(h(T)=0\). Its roots are

\[
T_\pm=\frac{v_0\pm\sqrt{v_0^2+2gh_0}}{g}.
\]

For \(h_0>0\), only \(T_+\) is positive. For \(h_0=0\), \(T_-=0\) is the launch instant and \(T_+=2v_0/g\) is the later return to ground.

### Exact Answers

1. Rise above the launch point:
   \[
   \Delta h_{\max}=\frac{v_0^2}{2g}.
   \]
   Absolute peak height above ground:
   \[
   h_{\max}=h_0+\frac{v_0^2}{2g}.
   \]
   Substituting the approximate supplied \(g\) gives \(\Delta h_{\max}\approx v_0^2/19.6=5v_0^2/98\). The rational coefficient is exact for the adopted numerical model \(g=9.8\), not an exact physical value of gravity.
2. Velocity at the highest point: \(0\).
3. Time from launch until subsequent ground impact:
   \[
   T=\frac{v_0+\sqrt{v_0^2+2gh_0}}{g}.
   \]
   No single expression in \(v_0\) alone is determined without launch height. Under the extra ground-launch assumption \(h_0=0\),
   \[
   T=\frac{2v_0}{g}\approx\frac{v_0}{4.9}=\frac{10v_0}{49}.
   \]

Analytical substitution checks: \(v(t_*)=0\), \(h(t_*)=h_0+v_0^2/(2g)\), and \(h(T_+)=0\). The equation for \(T_+\) follows directly from \(gT_+^2-2v_0T_+-2h_0=0\).

## Exercise 441

### Source Conditions and Missing Data

Given: \(v(t)=9.8t-0.003t^2\); the distance interval is exactly \(0\le t\le5\); endpoint acceleration means precisely \(t=5\).

No initial coordinate is given, but none is needed for distance or acceleration. Units are not explicitly stated; the answers are in the length and length/time-squared units induced by the supplied velocity/time units. Metres and \(\mathrm{m/s^2}\) require an SI convention.

### Independent Derivation and Exact Answers

Use the supplied finite decimals exactly:

\[
9.8=\frac{49}{5},\qquad 0.003=\frac{3}{1000},\qquad
v(t)=t\left(\frac{49}{5}-\frac{3t}{1000}\right).
\]

On \([0,5]\), the factor in parentheses is at least \(9.8-0.015=9.785>0\). Hence \(v(0)=0\) and \(v(t)>0\) for \(0<t\le5\). There is no reversal, and distance equals displacement on this interval.

First requested quantity, distance:

\[
S=\int_0^5|v(t)|\,dt
=\left[\frac{49}{10}t^2-\frac{t^3}{1000}\right]_0^5
=\frac{245}{2}-\frac18
=\frac{979}{8}=122.375.
\]

Second requested quantity, endpoint acceleration:

\[
A(t)=v'(t)=\frac{49}{5}-\frac{3t}{500},\qquad
A(5)=\frac{49}{5}-\frac{3}{100}
=\frac{977}{100}=9.77.
\]

Analytical check: differentiating the distance primitive returns the exact supplied velocity. At \(t=5\), velocity is \(48.925>0\), consistent with the no-reversal argument.

## Exercise 442

### Source Conditions and Missing Data

Given: \(v(t)=Rt+a\sqrt t\); the interval is exactly \(0\le t\le4\); both distance and endpoint acceleration are requested.

The usual mathematical reading treats \(R,a\) as fixed real coefficients. They are not supplied numerically, and their signs or a no-reversal condition are NOT stated. The lesson defines velocity as a signed coordinate derivative, so positivity must not be silently inferred from the word "velocity."

The coefficient named \(a\) is not itself the particle's acceleration; denote acceleration here by \(A(t)\). No initial coordinate is needed. Units are not explicitly given. The square root has the real domain \(t\ge0\). If \(a\ne0\), acceleration is singular at \(t=0\), but the requested endpoint is \(t=4>0\), where the derivative exists.

### Primitive, Displacement, and Endpoint Acceleration

\[
v(t)=\sqrt t\,(R\sqrt t+a),\qquad
F(t)=\frac{R}{2}t^2+\frac{2a}{3}t^{3/2},\qquad F(0)=0.
\]

Differentiation gives \(F'(t)=v(t)\). Signed displacement is always

\[
D=F(4)=8R+\frac{16a}{3}.
\]

For \(t>0\),

\[
A(t)=R+\frac{a}{2\sqrt t},\qquad
A(4)=R+\frac a4.
\]

Thus the second requested quantity is unconditionally \(R+a/4\), for fixed real coefficients.

### Full Exact Distance for All Fixed Real Coefficients

The first requested quantity is

\[
S=\int_0^4|Rt+a\sqrt t|\,dt,
\]

not unconditionally \(D\) and not unconditionally \(|D|\).

Set \(u=\sqrt t\), so the sign for \(t>0\) is the sign of the linear expression \(Ru+a\) on \(0<u\le2\). There can be at most one interior sign change.

When \(R\ne0\) and \(Ra<0\), a potential nonzero zero is

\[
\sqrt{\tau}=-\frac aR,\qquad \tau=\frac{a^2}{R^2}.
\]

It is interior exactly when \(0<-a/R<2\), equivalently \(Ra<0\) and \(|a|<2|R|\). Merely solving the squared equation without the sign condition introduces spurious zeros.

At an actual interior zero,

\[
F(\tau)=\frac{a^4}{2R^3}-\frac{2a^4}{3R^3}
=-\frac{a^4}{6R^3}.
\]

The complete, explicit distance is

\[
S=
\begin{cases}
D,&a\ge0\ \text{and}\ a+2R\ge0,\\
-D,&a\le0\ \text{and}\ a+2R\le0,\\
D+\dfrac{a^4}{3R^3},&a<0<a+2R\quad(R>0),\\
-D-\dfrac{a^4}{3R^3},&a>0>a+2R\quad(R<0).
\end{cases}
\]

The first two branches overlap only for \(R=a=0\), when both give zero. The four branches cover all real coefficient pairs, including zeros and endpoint zeros.

Equivalently: without an interior sign change, \(S=|D|\). With an interior sign change,

\[
S=|F(\tau)|+|D-F(\tau)|
=\operatorname{sgn}(R)D+\frac{a^4}{3|R|^3}.
\]

The two absolute values add the distances before and after reversal. The explicit four-branch form avoids an unevaluated absolute-value integral.

### Conditional Simplification and Analytical Checks

If \(a\ge0\) and \(a+2R\ge0\), velocity is nonnegative throughout the interval and \(S=8R+16a/3\). In particular \(R\ge0,a\ge0\) is sufficient, but neither individual nonnegativity is supplied by the source.

Boundary cases:

- \(R=0\): \(S=16|a|/3\).
- \(a=0\): \(S=8|R|\).
- \(R=a=0\): \(S=0\), \(A(4)=0\).
- \(a=-2R\): a zero occurs at \(t=4\), not an interior reversal; \(S=|D|=8|R|/3\).

Concrete analytical falsification of the unconditional displacement answer: take \(R=1,a=-1\). Then \(\tau=1\), \(F(1)=-1/6\), and \(D=8/3\), but

\[
S=\frac16+\left(\frac83+\frac16\right)=3.
\]

This also disproves an unconditional \(|8R+16a/3|\) answer. These coefficient choices illustrate the source's unrestricted parameter space; they are not extra given data.

## Exercise 443

### Source Conditions and Missing Data

Source `a)`: the particle follows \(y=x^2-2x+3\), and its horizontal projection has constant velocity \(v\). Find vertical-projection velocity and acceleration, explicitly as functions of \(x\).

Source `b)`: the particle follows \(y=x^3-2x^2\), again with horizontal-projection velocity \(v\) constant. Find vertical-projection velocity and acceleration.

The constant-velocity condition means \(\dot x=v\), \(\ddot x=0\). Neither the numerical value nor the sign of \(v\) is specified; the formulas are valid also for \(v=0\). Initial coordinate and initial time are unspecified, but not needed for answers expressed in \(x\). A unique time-only trajectory would need those constants. Units and an interval or range of \(x\) are not specified, and none is needed for these polynomial identities.

The requested quantities are coordinate velocities and accelerations of the vertical projection, not total speed along the curve. If one separately asks for the nonnegative speed of the vertical projection, it is the absolute value of the derived signed vertical velocity.

### Chain Rule and Exact Answers

For either \(y=f(x)\),

\[
\dot y=f'(x)\dot x=f'(x)v,\qquad
\ddot y=f''(x)(\dot x)^2+f'(x)\ddot x=f''(x)v^2.
\]

1. `a)` vertical-projection velocity:
   \[
   v_y=(2x-2)v=2v(x-1).
   \]
2. `a)` vertical-projection acceleration:
   \[
   A_y=2v^2.
   \]
3. `b)` vertical-projection velocity:
   \[
   v_y=(3x^2-4x)v=x(3x-4)v.
   \]
4. `b)` vertical-projection acceleration:
   \[
   A_y=(6x-4)v^2=2(3x-2)v^2.
   \]

For `b)`, using \(x\) is a complete answer without inventing initial conditions. If a time form is later required, substitute \(x=x_0+v(t-t_0)\) while retaining the unspecified \(x_0,t_0\).

Analytical checks: the derivatives of the two curves are respectively \(2x-2\), \(2\), and \(3x^2-4x\), \(6x-4\). Differentiating each stated \(v_y\) with \(\dot x=v\) yields the stated \(A_y\), including the required second factor of \(v\).

## Frozen StageA Conclusions

All four exercises and all eleven quantities are independently solved. No figures or external data were needed.

The source limitations requiring explicit treatment are:

- 440: absolute peak height and time to ground depend on the unstated launch height; the familiar \(2v_0/g\) time assumes ground launch.
- 442: a single displacement expression is not an unconditional distance answer without a sign/no-reversal condition; the complete parameter-dependent distance is given above.
- Units are not explicitly declared in the prompts. Do not promote a conditional SI interpretation into a source fact.

Gate 2's mathematical coverage and explanatory requirements informed this review. This is NOT a Gate 2 pass: no production key inspection, candidate comparison, grading-contract verification, real MathLive input check, finalize, or publication was performed.

Status: `STAGEA_FROZEN_AWAITING_PARENT_AUTHORIZATION_FOR_CANDIDATE_COMPARISON`.
