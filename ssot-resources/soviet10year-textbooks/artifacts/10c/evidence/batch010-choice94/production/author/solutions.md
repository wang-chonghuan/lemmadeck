# Independent Author Solutions

Role: CHOICE AUTHOR, existing STEMROBIN-184 offline production invocation.
Only mathematical input: ../seed.json.
Canonical seed SHA-256: 598d5321a199d9f7e0cc424b1a5394b595976399d0c6f7431d476263bd9654d0.

This record is saved before alternatives are constructed. No answers, worked
examples, scans, other choice outputs, historical outputs or reviewer material
were consulted. Angles are real and measured in radians. Throughout, k is any
integer. arctan has range (-pi/2, pi/2); arcsin has range [-pi/2, pi/2].
There are no seed concepts or figures. Images opened: 0; the parent's 24/24
image tally is unchanged and permanently exhausted.

## 310

Task: solve 1 + cos x + cos(2x) = 0 on all real x.
Set c = cos x, with -1 <= c <= 1. Using cos(2x) = 2c^2 - 1 gives
2c^2 + c = c(2c + 1) = 0. Both c = 0 and c = -1/2 are attainable.
The complete set is x = pi/2 + k*pi, or x = 2*pi/3 + 2*k*pi,
or x = -2*pi/3 + 2*k*pi. Substitution yields 0 in the source equation
for each branch; the factorization is equivalent, so there are no other roots.
Distinction: retain both factors and both cosine branches.

## 311

Task: solve 3 - cos^2 x - 3*sin x = 0 on all real x.
Set s = sin x. Substitute cos^2 x = 1 - s^2:
s^2 - 3s + 2 = (s - 1)(s - 2) = 0. The algebraic root 2 is
outside [-1,1], while 1 is attained. The complete set is
x = pi/2 + 2*k*pi. At these angles cos x = 0 and sin x = 1,
so the source left side is 3 - 0 - 3 = 0.
Distinction: reject the impossible algebraic root and preserve sine's sign.

## 312

Task: solve 4*sin x = 4 - cos^2 x on all real x.
With s = sin x, the equation becomes 4s = 3 + s^2, hence
s^2 - 4s + 3 = (s - 1)(s - 3) = 0. Only s = 1 is in [-1,1].
The complete set is x = pi/2 + 2*k*pi. Substitution gives 4 = 4.
Distinction: valid sine range, despite two real roots of the quadratic.
This is independent of 311: its source coefficients and algebraic rejected
root are different, although the final solution set happens to agree.

## 313

Task: solve tan x + cot x = 5/2; the source mixed number is 5/2,
not a product. Original domain: sin x != 0 and cos x != 0, equivalently
x is not n*pi/2 for any integer n.
Put t = tan x; t exists and is nonzero on this domain. Then
t + 1/t = 5/2 gives 2t^2 - 5t + 2 = (2t - 1)(t - 2) = 0.
Both t = 1/2 and t = 2 are finite and nonzero, so the complete set is
x = arctan(1/2) + k*pi, or x = arctan(2) + k*pi.
Both roots give t + 1/t = 5/2. Neither family touches excluded angles.
Distinction: two reciprocal tangent roots, complete pi periods, original
division domain; no sign ambiguity may be invented.

## 314

Task: solve cos(x/2) = 1 + cos x on all real x.
Put u = cos(x/2). The identity 1 + cos x = 2u^2 gives
u = 2u^2, or u(2u - 1) = 0. Both u = 0 and u = 1/2
are attainable. For u = 0, x/2 = pi/2 + k*pi gives
x = pi + 2*k*pi. For u = 1/2, x/2 = +/-pi/3 + 2*k*pi
gives x = +/-2*pi/3 + 4*k*pi.
At the first branch both sides are zero; at the other two both are 1/2.
All transformations are reversible without division.
Distinction: the zero factor survives, and doubling the angle doubles the
period for the nonzero cosine branches to 4*pi.

## 315

Task: solve tan x - tan(pi/2 - x) = 1.
Original domain: cos x != 0 and sin x != 0, so x is not n*pi/2.
On that domain tan(pi/2 - x) = cot x = 1/t for t = tan x != 0.
Thus t - 1/t = 1 gives t^2 - t - 1 = 0, with
t_plus = (1 + sqrt(5))/2 and t_minus = (1 - sqrt(5))/2.
Both are finite and nonzero. The complete set is
x = arctan(t_plus) + k*pi, or x = arctan(t_minus) + k*pi.
Each root satisfies t^2 - t = 1, hence t - 1/t = 1.
No solution meets an excluded angle.
Distinction: preserve the negative root, reciprocal minus sign, and both
native tangent periods, without introducing undefined points.

## 316

Task: solve 5*cos x + 12*sin x = 13 on all real x.
Let alpha = arctan(12/5), in the first quadrant. Since 5^2 + 12^2 = 13^2,
cos alpha = 5/13 and sin alpha = 12/13. The left side is
13*cos(x - alpha). Therefore cos(x - alpha) = 1 and the complete set is
x = alpha + 2*k*pi.
Equivalently, equality in the scalar-product bound forces
(cos x, sin x) = (5/13, 12/13), not its negative. Substitution gives
25/13 + 144/13 = 13.
Distinction: attaining the positive maximum fixes a single phase modulo
2*pi; pi shifts yield the negative maximum and are not solutions.

## 317

Task: solve sin x - sin(2x) = 0 on all real x.
Factor sin x - 2*sin x*cos x = sin x*(1 - 2*cos x) = 0.
The first factor gives x = k*pi; the other gives cos x = 1/2,
or x = +/-pi/3 + 2*k*pi. These three branches form the complete set.
The cosine branches have nonzero sine, so neither belongs to x = k*pi.
All factor roots satisfy the original equation.
Distinction: cancellation of sin x loses a genuine family; both cosine
preimages must be retained.

## 318

Task: solve 1 - cos x = 2*sin(x/2) on all real x.
Let v = sin(x/2). Then 2v^2 = 2v gives v(v - 1) = 0.
For v = 0, x/2 = k*pi gives x = 2*k*pi.
For v = 1, x/2 = pi/2 + 2*k*pi gives x = pi + 4*k*pi.
These are the complete families. Substitution gives 0 = 0 and 2 = 2,
respectively. x = 3*pi is not a solution: its sides are 2 and -2.
Distinction: zero family plus positive sine endpoint; the endpoint branch
has period 4*pi in x, not 2*pi.

## 319

Task: solve 1 + cos x = 2*cos(x/2) on all real x.
Let u = cos(x/2). Then 2u^2 = 2u, or u(u - 1) = 0.
For u = 0, x = pi + 2*k*pi. For u = 1, x = 4*k*pi.
These are the complete families. The original sides are both 0 or both 2.
x = 2*pi is not a solution: its sides are 2 and -2.
Distinction: retain the zero branch and avoid shortening the positive
cosine-endpoint branch's period from 4*pi to 2*pi.

## 320

Task: solve cos(2x) = (7/3)*sin x; the source mixed number is 7/3.
Original domain: all real x. Let s = sin x. Then
1 - 2s^2 = (7/3)s, or 6s^2 + 7s - 3 = (3s - 1)(2s + 3) = 0.
The root -3/2 is impossible for sine; the only feasible root is 1/3.
Let alpha = arcsin(1/3), so 0 < alpha < pi/2.
The complete set is x = alpha + 2*k*pi, or x = pi - alpha + 2*k*pi.
For either branch cos(2x) = 1 - 2/9 = 7/9, matching (7/3)*(1/3).
Distinction: reject the out-of-range root and retain both positive-sine
branches rather than a cosine-style plus/minus pair.

## 321

Task: solve sqrt(3)*sin x - cos x = 0 on all real x.
First check cos x = 0: then sin x = +/-1, so the source left side
is +/-sqrt(3), not zero. Division by cos x is therefore safe for solutions.
It gives tan x = 1/sqrt(3); the complete set is x = pi/6 + k*pi.
At these angles sqrt(3)*sin x = cos x, including the pi-shifted signs.
Distinction: positive tangent slope, pi-periodic homogeneous equality,
and explicit exclusion before division.

## 322

Task: solve cos x + sin x = 0 on all real x.
If cos x = 0, then sin x = +/-1 and the equation fails.
For cos x != 0, divide to obtain 1 + tan x = 0, so tan x = -1.
The complete set is x = -pi/4 + k*pi.
Both sides cancel at every pi shift; these are all tangent preimages.
Distinction: negative tangent direction and full pi period, not a single
principal inverse angle.

## 323

Task: solve cos^2 x - 3*sin x*cos x = -1 on all real x.
At cos x = 0, the left side is 0, which is not -1, so no solution is lost
by dividing by cos^2 x. For t = tan x, sec^2 x = 1 + t^2:
1 - 3t = -(1 + t^2), or t^2 - 3t + 2 = (t - 1)(t - 2) = 0.
The complete set is x = pi/4 + k*pi, or x = arctan(2) + k*pi.
For t = 1, (1 - 3t)/(1 + t^2) = -2/2 = -1;
for t = 2, it is -5/5 = -1. Both are finite, distinct tangent values.
Distinction: right side becomes negative secant squared, not negative one;
two valid tangent branches and the original zero-denominator check.

## 324

Task: solve 3*cos^2 x = 4*sin x*cos x - sin^2 x on all real x.
At cos x = 0, sin^2 x = 1 gives 0 = -1, which is false.
Dividing by cos^2 x for candidate solutions gives 3 = 4t - t^2,
or t^2 - 4t + 3 = (t - 1)(t - 3) = 0.
The complete set is x = pi/4 + k*pi, or x = arctan(3) + k*pi.
For t = 1 and 3 respectively, 4t - t^2 equals 3; neither tangent value
is undefined. Thus both families satisfy the source and exhaust it.
Distinction: preserve both factors after homogeneous reduction and retain
pi shifts, without assuming a squared term creates plus/minus roots.

## Response-Unit Decision

Each source is its own equation on x, with no shared unknown constraint
linking it to another equation. Use one complete solution-set recognition
unit per source. Do not split one factor, root, sign branch or period into
separate clicks. No new identities or supplied method will appear in a stem.
Recognition retains complete-set distinctions but cannot demonstrate
independently producing the reduction, proving exhaustiveness, rejecting
inadmissible roots or constructing periodic families. Those production losses
must be stated in each question's internal limitations and source coverage.
