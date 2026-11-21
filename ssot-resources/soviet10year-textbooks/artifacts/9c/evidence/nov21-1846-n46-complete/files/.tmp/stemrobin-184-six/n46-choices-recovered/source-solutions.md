# Independent source solutions: ana9-c4-s2-n46

Internal author evidence, not a learner payload or semantic review.

## Authority and chronology

- Continuing STEMROBIN-184 / 184-6, finish=review. This is the explicitly
  authorized technical repair of the literal book selector, not a source switch.
- Historical failed inspect and its sealed manifest remain unchanged in
  `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n46-choices/`.
- Corrected FIRST inspect: stage
  `n46-choice-author-recovery-20261121-d4c19b-inspect`, exit 0,
  2026-11-21T04:07:49.596Z through 2026-11-21T04:07:49.626Z.
- Explicit selection: written seeds 375, 376, 377; paragraph blocks 0, 3, 4.
  Block 0 is the natural-power differentiation theorem; block 3 states that
  polynomials are differentiable everywhere; block 4 gives the general
  polynomial derivative formula. Proof blocks and solved examples are excluded.
- Preparation: stage `n46-choice-author-recovery-20261121-d4c19b-prepare`,
  exit 0, 2026-11-21T04:08:17.033Z through 2026-11-21T04:08:17.068Z.
- Seed canonical SHA-256:
  `edc4b88cfae718748f1383978dae4d60cd646a19fb40e34d4041de793a15cc8b`.
- This file records the complete independent analytical solutions before
  `draft.json` or `view-only.json` is created. The subsequent uniquely named
  `n46-choice-author-recovery-20261121-d4c19b-solutions-bound` receipt binds this
  file and records whether either options file already exists.
- No source answers, interactions, earlier choices, historical content outputs,
  images, model services or outside sources were consulted. No graph was drawn.
  The graph solutions below specify the full analytical construction basis;
  this does not claim execution of the written drawing task.

## Seed 375

### Task and distinctions

Determine the derivative of each of the three given functions for all real
inputs. The task combines the exponent multiplier and exponent decrement with
preservation of a horizontal translation inside the base.

### Full solution

1. For `f(x)=x^4`, the selected theorem gives `f'(x)=4x^3`.
2. For `g(x)=x^3`, the selected theorem gives `g'(x)=3x^2`.
3. For `h(x)=(x-4)^4`, expand without requiring a hidden chain-rule definition:
   `h(x)=x^4-16x^3+96x^2-256x+256`.
   Termwise differentiation gives
   `h'(x)=4x^3-48x^2+192x-256=4(x-4)^3`.
   The constant 256 differentiates to zero. The horizontal shift remains
   inside the derivative's cubic base.

All three functions and derivatives are defined for every real `x`. There are
no units or unresolved endpoint conventions.

## Seed 376

### Task and distinctions

Determine the full derivative of each polynomial. The first tests coefficient,
degree, missing-power, linear-term and constant-term handling. The second tests
combination of repeated powers with negative coefficients before, or after,
termwise differentiation. These are distinct algebraic demands, not response
units inferred merely from the printed letters.

### Full solution

1. `f(x)=2x^5-3x^4+7x^2-5x+9`:
   `(2x^5)'=10x^4`;
   `(-3x^4)'=-12x^3`;
   `(7x^2)'=14x`;
   `(-5x)'=-5`;
   `9'=0`.
   Thus `f'(x)=10x^4-12x^3+14x-5`.
2. `g(x)=7-2x^9+x^4-3x^9`:
   the two ninth-power terms sum to `-5x^9`, so
   `g(x)=7-5x^9+x^4`.
   Thus `g'(x)=-45x^8+4x^3`.
   Direct termwise differentiation independently gives
   `0-18x^8+4x^3-27x^8=-45x^8+4x^3`.

All expressions are polynomials on the whole real line. No restriction changes
either derivative.

## Seed 377

### Task and distinctions

Construct both complete real graphs. A construction must position intercepts,
stationary points and turning directions coherently, with appropriate tails
and curvature. The first cubic has a double root at a stationary intercept;
the second is odd with three simple roots and symmetric extrema. No referenced
source figures exist. Analytical specification is possible without generating
an image, but executing and recognizing a drawing are different abilities.

### Full analytical construction: `p(x)=x^2(x-2)`

- Expand: `p(x)=x^3-2x^2`. Domain is all real numbers.
- Intercepts: `p(x)=0` at `x=0` (multiplicity 2) and `x=2` (multiplicity 1).
  The y-intercept is `(0,0)`.
- Function sign: negative for `x<0` and `0<x<2`, zero at 0 and 2, positive
  for `x>2`. The graph touches the x-axis at `(0,0)` from below and crosses
  upward at `(2,0)`.
- Derivative: `p'(x)=3x^2-4x=x(3x-4)`. Stationary abscissae are 0 and `4/3`.
- Derivative signs: positive on `(-infinity,0)`, negative on `(0,4/3)`,
  positive on `(4/3,infinity)`.
- Consequently the graph increases, then decreases, then increases on those
  respective open intervals.
- Local maximum: `(0,0)`. Local minimum:
  `p(4/3)=(16/9)(-2/3)=-32/27`, hence `(4/3,-32/27)`.
  These are local, not global, extrema.
- Leading term is positive `x^3`: the left tail tends to negative infinity
  and the right tail to positive infinity. Continuity and these limits give
  range equal to all real numbers. There are no polynomial asymptotes.
- Second derivative: `p''(x)=6x-4`. The graph is concave down for `x<2/3`
  and concave up for `x>2/3`.
- Inflection point: `p(2/3)=(4/9)(-4/3)=-16/27`, hence `(2/3,-16/27)`.
  Its slope is `p'(2/3)=4/3-8/3=-4/3`.
- There is no origin or y-axis symmetry. Writing `x=2/3+t` gives
  `p(2/3+t)=t^3-(4/3)t-16/27`, which does give point symmetry about the
  inflection point `(2/3,-16/27)`.

These coordinates, signs, monotonic intervals, curvature and tails uniquely
specify the intended qualitative cubic construction. No rendered drawing or
manual plotting performance is asserted.

### Full analytical construction: `q(x)=x^3-6x`

- Domain is all real numbers. Factor:
  `q(x)=x(x^2-6)`.
- Intercepts: `(-sqrt(6),0)`, `(0,0)`, `(sqrt(6),0)`, all simple roots.
  The graph crosses the axis at all three. The y-intercept is `(0,0)`.
- Function sign: negative on `(-infinity,-sqrt(6))`, positive on
  `(-sqrt(6),0)`, negative on `(0,sqrt(6))`, positive on
  `(sqrt(6),infinity)`.
- Oddness: `q(-x)=-q(x)`, so the graph is symmetric about the origin.
- Derivative: `q'(x)=3x^2-6=3(x^2-2)`. Stationary abscissae are
  `-sqrt(2)` and `sqrt(2)`, not the nonzero intercepts `+/-sqrt(6)`.
- Derivative is positive outside `[-sqrt(2),sqrt(2)]` and negative inside.
  The graph increases on `(-infinity,-sqrt(2))` and
  `(sqrt(2),infinity)`, and decreases on `(-sqrt(2),sqrt(2))`.
- Local maximum:
  `q(-sqrt(2))=-2sqrt(2)+6sqrt(2)=4sqrt(2)`,
  hence `(-sqrt(2),4sqrt(2))`.
- Local minimum:
  `q(sqrt(2))=2sqrt(2)-6sqrt(2)=-4sqrt(2)`,
  hence `(sqrt(2),-4sqrt(2))`.
  Neither is a global extremum.
- Positive leading cubic term: left tail tends to negative infinity and
  right tail to positive infinity. The range is all real numbers by
  continuity. There are no polynomial asymptotes.
- Second derivative `q''(x)=6x`: concave down on `(-infinity,0)`, concave
  up on `(0,infinity)`, inflection point `(0,0)` with slope `q'(0)=-6`.

The required order of x-coordinates is
`-sqrt(6) < -sqrt(2) < 0 < sqrt(2) < sqrt(6)`.
Together with the extrema, crossing signs and tails, this provides the complete
analytical basis for the graph. No image was created or viewed.

## Pre-option response-unit decision and limitations

- Seed 375: one complete three-derivative result, rather than three near-duplicate
  exponent clicks. This keeps the unshifted and shifted bases together.
- Seed 376: two full-polynomial results because coefficient/linear/constant
  handling and repeated-power simplification are distinct substantive tasks.
- Seed 377: one native multiple-response property task for each analytically
  different cubic. These are not per-property yes/no questions or pair-code
  alternatives. They retain intercepts, turning structure and tail judgments.
- No arbitrary target question count is imposed; the above task analysis yields
  five response units.
- Derivative choices do not demonstrate unaided written derivation.
- Text graph-property choices do not replace producing either written graph,
  choosing scales, plotting coordinates or connecting a coherent curve.
- Curvature, inflection coordinates/slopes, the first cubic's point symmetry,
  explicit domain/range statements and exhaustive function-sign intervals will
  not all be separately assessed by the graph choices. Their solutions are
  nevertheless recorded above before authoring alternatives.
- No semantic review is performed here. Independent review remains PENDING.
