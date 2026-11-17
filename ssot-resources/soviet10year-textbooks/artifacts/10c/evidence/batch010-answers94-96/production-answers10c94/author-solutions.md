# STEMROBIN-184: independent standard-answer author reasoning

Role: AUTHOR only. Lessons: ana10-c6-s4-n94 and ana10-c6-s4-n96.
Workspace: /Users/yong/.codex/worktrees/a07e/lemmadeck.
Date: 2026-11-17.

This reasoning is saved before either formal answer-keys.json is written.
It is an independent derivation, not independent review or a gate result.
Do not expose it or the candidates to the independent reviewer until that
reviewer has saved an independent solution of all 15 equations.

## Inputs and boundary

Only the two modern edition exercises.json files and their already-prepared
answer-keys.template.json files supplied mathematical inputs. No original
worked examples, book answers, candidate choices, other lessons, or reviewer
work were read. Repository instructions, applicable charters, the IntentFold
skill entry, and ld-s10y-answer cap2/gate2 instructions were read as contracts;
no new workflow or capability was started.

The parent reports modern adaptation finalize PASS for both lessons and two
read-only validate_publish PASS results. Those preconditions were not rerun
or independently certified by this author. Prepared templates already exist;
this author does not repeat prepare.

Input file SHA-256:

- Modern n94 exercises.json:
  7f9cb7bbdd0f9302b2a3c07c383ae32408d18071b80073838723467ca9c11324
- Modern n96 exercises.json:
  1d187b06644b31a0d47ec7ed5693009ac31cc6cc47434ba9f256e0f84daff764
- Prepared n94 answer-keys.template.json:
  5914c7103961e08c6c5027b0ecd680eb5413367b8d87f230603a5b14654ad3f9
- Prepared n96 answer-keys.template.json:
  55f6bfa2de1f77395248fc24400625daae1b9ca97bbf13065962953be1ae1bc7

These are hashes of the modern input files themselves, not the embedded
source-snapshot hashes carried by those files.

## Conventions

All angles are in radians, x is real, and every k ranges independently over
the integers. A plus/minus sign specifies both families, not a single choice.
arctan takes its principal value in (-pi/2, pi/2); arcsin takes its principal
value in [-pi/2, pi/2]. Fractions and inverse trigonometric values are exact.
The displayed 2 1/2 in exercise 313 is 5/2; the displayed 2 1/3 in exercise
320 is 7/3. Neither is multiplication.

Each transformation below is reversible on its stated domain. All final
branches satisfy the original equation, and the range/domain exclusions are
explicit. No equation is squared and no nonzero branch is cancelled without
first establishing that it cannot vanish.

## 310

Equation: 1 + cos x + cos(2x) = 0.
Original domain: all real x.

Set c = cos x. Using cos(2x) = 2c^2 - 1, the equation becomes
c(2c + 1) = 0. Therefore c = 0 or c = -1/2. Both lie in [-1, 1].

Complete solution:

- x = pi/2 + pi k.
- x = 2pi/3 + 2pi k or x = -2pi/3 + 2pi k.

Either cosine value makes c(2c + 1) zero, hence satisfies the original.
The zero-cosine family is retained; no division by c was performed.

## 311

Equation: 3 - cos^2 x - 3 sin x = 0.
Original domain: all real x.

Set s = sin x and replace cos^2 x by 1 - s^2. Then
s^2 - 3s + 2 = (s - 1)(s - 2) = 0. The root s = 2 is impossible
because |sin x| <= 1. The remaining value s = 1 gives

x = pi/2 + 2pi k.

Here cos x = 0 and sin x = 1, so the original left side is 3 - 0 - 3 = 0.

## 312

Equation: 4 sin x = 4 - cos^2 x.
Original domain: all real x.

Set s = sin x. Then 4s = 3 + s^2, or
s^2 - 4s + 3 = (s - 1)(s - 3) = 0. Reject s = 3, outside [-1, 1].
The complete solution is

x = pi/2 + 2pi k.

At these angles, both original sides equal 4.

## 313

Equation: tan x + cot x = 5/2.
Original domain: sin x != 0 and cos x != 0, equivalently x != k pi/2.

On that domain, let t = tan x, so t is finite and nonzero and cot x = 1/t.
Multiplying t + 1/t = 5/2 by the nonzero quantity 2t gives
2t^2 - 5t + 2 = (2t - 1)(t - 2) = 0.

Complete solution:

- x = arctan(1/2) + pi k.
- x = arctan(2) + pi k.

Both tangent values are finite and nonzero, so neither sine nor cosine
vanishes. Direct substitution gives 1/2 + 2 = 5/2 in both branches.
Equivalently, sin x cos x = 2/5 and sin(2x) = 4/5.
With alpha = arcsin(4/5) in (0, pi/2), the same solution set is
x = alpha/2 + pi k or x = pi/2 - alpha/2 + pi k.
The complementary inverse-tangent angles account for both branches.

## 314

Equation: cos(x/2) = 1 + cos x.
Original domain: all real x.

Let u = cos(x/2). The double-angle identity gives 1 + cos x = 2u^2.
Thus u(2u - 1) = 0, yielding u = 0 or u = 1/2.

Complete solution:

- x = pi + 2pi k.
- x = 2pi/3 + 4pi k or x = -2pi/3 + 4pi k.

The half-angle cosine is respectively 0 or 1/2, and u = 2u^2 holds.
Do not replace 4pi by 2pi in the second pair: adding 2pi changes
cos(x/2) from 1/2 to -1/2 and does not satisfy the equation.

## 315

Equation: tan x - tan(pi/2 - x) = 1.
Original domain: cos x != 0 and sin x != 0, equivalently x != k pi/2.

The second tangent equals cot x on this domain. With t = tan x != 0,
t - 1/t = 1 is equivalent to t^2 - t - 1 = 0.
The two roots t = (1 + sqrt(5))/2 and t = (1 - sqrt(5))/2 are real,
finite, and nonzero.

Complete solution:

- x = arctan((1 + sqrt(5))/2) + pi k.
- x = arctan((1 - sqrt(5))/2) + pi k.

For either root, t^2 - t = 1 implies t - 1/t = 1.
Both trigonometric denominators are nonzero. The negative root is a
separate valid branch; it is not discarded.

## 316

Equation: 5 cos x + 12 sin x = 13.
Original domain: all real x.

Let phi = arctan(12/5), which lies in (0, pi/2).
Then cos phi = 5/13 and sin phi = 12/13. Consequently the equation
is equivalent to 13 cos(x - phi) = 13.
The maximum cosine value 1 is attained only at x - phi = 2pi k.

Complete solution:

x = arctan(12/5) + 2pi k.

These angles have (cos x, sin x) = (5/13, 12/13), so the original
left side is (25 + 144)/13 = 13. A pi-periodic extension is invalid,
because it would also include the value -13.

## 317

Equation: sin x - sin(2x) = 0.
Original domain: all real x.

Factor using sin(2x) = 2 sin x cos x:
sin x (1 - 2 cos x) = 0. Thus sin x = 0 or cos x = 1/2.

Complete solution:

- x = pi k.
- x = pi/3 + 2pi k or x = -pi/3 + 2pi k.

Either factor vanishes in the original equivalent product.
The sin x = 0 family is retained rather than lost by division.

## 318

Equation: 1 - cos x = 2 sin(x/2).
Original domain: all real x.

Let u = sin(x/2). Since 1 - cos x = 2u^2, the equation is
u(u - 1) = 0. Hence u = 0 or u = 1.

Complete solution:

- x = 2pi k.
- x = pi + 4pi k.

For u = 0 the two original sides are 0; for u = 1 they are 2.
The value u = -1 is not a root: it would give 2 = -2.
Thus the odd-multiple family must have period 4pi, not 2pi.

## 319

Equation: 1 + cos x = 2 cos(x/2).
Original domain: all real x.

Let u = cos(x/2). The equation becomes 2u^2 = 2u, or
u(u - 1) = 0, so u = 0 or u = 1.

Complete solution:

- x = pi + 2pi k.
- x = 4pi k.

The two sides are respectively 0 or 2. The value u = -1 is not a
root, so x = 2pi + 4pi k must not be added to the second family.

## 320

Equation: cos(2x) = (7/3) sin x.
Original domain: all real x.

Set s = sin x. The equation is 1 - 2s^2 = (7/3)s, equivalent to
6s^2 + 7s - 3 = (3s - 1)(2s + 3) = 0.
Its roots are 1/3 and -3/2; reject -3/2 because it is outside [-1, 1].

Let alpha = arcsin(1/3), so alpha lies in (0, pi/2).
Complete solution:

- x = alpha + 2pi k.
- x = pi - alpha + 2pi k.

For sin x = 1/3, the original sides are 1 - 2/9 = 7/9 and
(7/3)(1/3) = 7/9. No decimal approximation is used.

## 321

Equation: sqrt(3) sin x - cos x = 0.
Original domain: all real x.

The left side is exactly 2 sin(x - pi/6). Thus

x = pi/6 + pi k.

The identity is reversible everywhere and includes all zeros.
No division by cos x is needed. In particular cos x = 0 would leave
the nonzero value +/-sqrt(3), so it contributes no separate solution.

## 322

Equation: cos x + sin x = 0.
Original domain: all real x.

The left side is sqrt(2) sin(x + pi/4), giving

x = -pi/4 + pi k.

These and only these angles have sin x = -cos x.
There is no denominator or extra domain restriction.

## 323

Equation: cos^2 x - 3 sin x cos x = -1.
Original domain: all real x.

Write s = sin x and c = cos x. Adding 1 = s^2 + c^2 gives
s^2 - 3sc + 2c^2 = (s - c)(s - 2c) = 0.
If c = 0, the original equation reads 0 = -1, so such angles
are not solutions. In either factor branch c is nonzero, because
c = 0 would also force s = 0, contradicting s^2 + c^2 = 1.
The branches therefore give tan x = 1 or tan x = 2.

Complete solution:

- x = pi/4 + pi k.
- x = arctan(2) + pi k.

For t = 1 or t = 2, the original left side is
(1 - 3t)/(1 + t^2), respectively -2/2 or -5/5, hence -1.
The original domain remains all real x; c != 0 is an established
property of solutions, not a new restriction on the original equation.

## 324

Equation: 3 cos^2 x = 4 sin x cos x - sin^2 x.
Original domain: all real x.

With s = sin x and c = cos x, rearrangement gives
s^2 - 4sc + 3c^2 = (s - c)(s - 3c) = 0.
For c = 0 the original equation would read 0 = -1, so no such
angle is a solution. Each factor branch thus has nonzero c and
gives tan x = 1 or tan x = 3.

Complete solution:

- x = pi/4 + pi k.
- x = arctan(3) + pi k.

For either root, t^2 - 4t + 3 = 0 implies 4t - t^2 = 3.
Dividing the two original sides by the known nonzero c^2 therefore
gives the same value 3. No solution is lost or introduced.

## n96 and candidate contract

The modern ana10-c6-s4-n96 exercises.json has count 0 and exercises [].
Its legitimate answer key has answers []; no exercise is invented.

For n94, preserve the prepared schema and exercise identities and provide
15 nonempty displayAnswer values. Retain the unchanged prompt,
figureEvidence [], and historical_entities [] from each template item.
Every item has source "derived", grading "ungraded", and parts [].
bookRaw is absent. Notes explain that these are general periodic solution
sets and runtime set-equivalence judging is not certified in this offline
ticket. No fake expected or judge field is supplied.

Both top-level statuses remain "draft". Writing candidates does not mean
gate2 PASS, finalize PASS, publication, database insertion, or autojudging.
The parent owns independent Stage B, gate/finalize, and any later authorized
action. The author stops after the two formal candidates and handoff.
