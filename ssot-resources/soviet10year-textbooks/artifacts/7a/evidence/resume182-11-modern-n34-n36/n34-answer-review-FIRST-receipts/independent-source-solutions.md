# N34 Independent Source Solutions

Frozen before reading answer-keys.json, the prepare template, parent
n34-answer-candidates, or choice-author reasoning. This file is immutable review
evidence, not a proposed production answer file.

Cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Scope: modern-us-neutral, alg7-c4-s1-n34, exercises 746-753.
Text, original figures, durable specs and current previews are bound in
`pre-open-hashes.json`; actual four once-only openings are in
`image-load-ledger.json`.

## 746

The original and current figure 52 fall on the negative arm and rise on the
positive arm. Since -3.6 < -2.1 < 0 and 0 < 1.3 < 2.8:

- a) f(-2.1) < f(-3.6).
- b) f(1.3) < f(2.8).
- c) For x1 < x2 < 0, f(x1) > f(x2).
- d) For 0 < x1 < x2, f(x1) < f(x2).
- Decreasing for x < 0; increasing for x > 0.

The problem states the domain is all real numbers. Do not infer an analytic
formula, exact ordinate, symmetry, or finite function domain from this sketch.
The conventional open half-lines answer the question; including the turning
point as an endpoint of a monotonic branch is not mandatory.

## 747

Both images show (t,v) = (0,0), (6,5), (14,5), (16,0), with time in seconds and
speed in m/s. Read height, not slope, as speed.

- a) Speed increases from 0 to 6 s.
- b) Speed decreases from 14 to 16 s.
- c) Speed stays at 5 m/s from 6 to 14 s.

These are [0,6], [14,16], [6,14] as closed monotonic/constant segments; interval
notation excluding transition instants for increasing/decreasing phases is also
acceptable if the same time ranges are clear. The axis beyond 16 is not data.
The source does not justify computing a distance with a fabricated straight-line
rise or drop, and none is requested.

## 748

Each graph is the unique straight line through two calculated points.

- a) y=17x-2: (0,-2), (1,15); slope 17 > 0, increasing on R.
  x-intercept 2/17, y-intercept -2.
- b) y=-2.8x+1: (0,1), (1,-1.8), or (5,-13);
  slope -2.8 = -14/5 < 0, decreasing on R.
  x-intercept 5/14, y-intercept 1.

Plot two correct points and join them by a straight line extending both ways.
Drawing is open/manual; do not force its graph into auto grading.

## 749

For y=kx+b, y(x2)-y(x1)=k(x2-x1) when x2>x1.

- Increasing: y=8x-5, y=0.01x.
- Decreasing: y=-3x+10, y=-49x+1000, y=-(1/12)x.
- y=0x+5=5 is constant, neither strictly increasing nor strictly decreasing.

All six functions must be covered; the zero-slope case must not be omitted or
called strictly monotonic.

## 750

- a) y=x^2: vertex (0,0), opens upward; plot (-2,4),(-1,1),(0,0),
  (1,1),(2,4) and join by a smooth parabola. Decreases on (-infinity,0);
  increases on (0,infinity). Maximal branches can include 0.
- b) y=-x^2: vertex (0,0), opens downward; reflected plotted ordinates
  -4,-1,0,-1,-4 at those same x values. Increases on (-infinity,0);
  decreases on (0,infinity). Maximal branches can include 0.

For two negative ordered x values, the square decreases; for two positive
ordered x values, it increases. Negating reverses this. Neither function is
globally monotonic on R. Open branch notation is sufficient.

## 751

Use the registered modern a) y=-6/x, not the preserved original x=-6/x.
The original equation would give x^2=-6 and no real solution; it is not the
modern function to graph. Both modern graphs have domain R excluding 0, two
branches and asymptotes x=0 and y=0; neither touches an axis.

- a) y=-6/x: branches in quadrants II and IV. Plot (-6,1),(-3,2),
  (-2,3),(-1,6),(1,-6),(2,-3),(3,-2),(6,-1).
  Increasing on each of (-infinity,0) and (0,infinity).
- b) y=4/x: branches in quadrants I and III. Plot (-4,-1),(-2,-2),
  (-1,-4),(1,4),(2,2),(4,1).
  Decreasing on each of (-infinity,0) and (0,infinity).

For y=a/x and same-sign x1<x2, the difference is
-a(x2-x1)/(x1*x2); its sign is positive for a=-6 and negative for a=4.
Branchwise monotonicity must not be called global monotonicity on the
disconnected domain: for -6/x, values at -1 and 1 are 6 and -6 (violating
global increase); for 4/x they are -4 and 4 (violating global decrease).

## 752

The domain is the full closed interval [-5,7], including -2 and 4 even though
they are excluded from the three stated monotonicity intervals:
decreasing [-5,-2), increasing (-2,4), decreasing (4,7].

A valid example is the continuous polygonal graph joining
(-5,3),(-2,0),(4,6),(7,3), with closed domain endpoints. Equivalently:

- f(x)=-x-2 for -5 <= x <= -2;
- f(x)=x+2 for -2 < x <= 4;
- f(x)=10-x for 4 < x <= 7.

Endpoint values are 3,0,6,3; adjacent formulas agree at -2 and 4, and slopes
are -1,+1,-1. This covers every domain point once and meets every requested
strict interval.

These chosen heights, continuity, a local minimum at -2 and a local maximum
at 4 belong to this example only. The prompt does not require them. Other
heights and discontinuous graphs with independently assigned f(-2),f(4) are
valid if they define a function on the entire domain and satisfy the intervals.
Do not demand extrema at the two excluded transition points.

## 753

All square roots are principal nonnegative roots.

- a) sqrt(0.16)=0.4 and sqrt(225)=15:
  3*0.4 - 0.1*15 = 1.2-1.5 = -0.3 = -3/10.
- b) sqrt(900)=30 and sqrt(1/9)=1/3:
  0.2*30 + 1.8/3 = 6+0.6 = 6.6 = 33/5.

Two numeric parts, labels a) and b), no units. Auto grading is appropriate
for these two finite real scalars.

## Independence And Limits

These solutions were derived before any candidate-answer read. No bookRaw has
yet been consumed; it will be checked against the prepare template, preserving
its exact string independently of whether the book answer is complete.
All intentionally ungraded answers and their empty parts are read-only.
No network, .env, DB, app, Git, publish, finalize or cap3 operations are
authorized or performed.
