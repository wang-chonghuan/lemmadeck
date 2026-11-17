# Independent Source Solutions

Authority: the supplied `seed.json` only, with canonical SHA-256
`02950a8ca7ca60681040fff0150972ef34adfb328918bdaeeedd9911934640cf`.
Selected exercises: 440-443. Selected definition blocks: 0, 1, 4, 5.
No worked examples, images, answers, historical choices, or reviews were read.
This document records the full source mathematics before the draft is written.
It is an authoring record, not a semantic review.

The definitions identify velocity with the derivative of a coordinate,
displacement with the integral of that signed velocity, and acceleration with
the derivative of velocity. Consequently distance is the integral of the
absolute value of velocity; it equals displacement only when velocity is
nonnegative throughout the interval. The source does not label the units of
the numerical laws. Numerical results below use the corresponding compatible
coordinate and time units, without inventing a unit label.

## 440: Upward Throw, Turning Point, and Ground Contact

The learner must connect constant downward acceleration to velocity and height,
find the turning point, and determine the first subsequent ground-contact time.
The source gives an upward throw and gravitational acceleration approximately
9.8, but gives no launch height above the ground.

Use an upward vertical coordinate whose zero is the ground. Let the unknown
launch height be h0 >= 0 and the initial upward velocity component be u0 > 0.
These are parameters describing the initial state, not supplied numerical
conditions. Writing g = 9.8 for the source's approximate model gives

- Vertical velocity: u(t) = u0 - gt.
- Vertical coordinate: h(t) = h0 + u0*t - g*t^2/2.
- Turning time: t_peak = u0/g, because u(t_peak) = 0.
- Maximum rise relative to the launch point: H = u0^2/(2g) = u0^2/19.6.
- Maximum coordinate above ground: h_max = h0 + u0^2/19.6.
- Vertical velocity at maximum height: zero.

Ground contact satisfies g*T^2/2 - u0*T - h0 = 0. The descending,
subsequent contact time is

T = (u0 + sqrt(u0^2 + 2*g*h0))/g
  = (u0 + sqrt(u0^2 + 19.6*h0))/9.8.

For h0 > 0 the other root is negative. For h0 = 0 it is the launch instant
T = 0, not the subsequent landing; the subsequent root is 2*u0/g.
The value 2*u0/g therefore cannot be asserted for an unspecified launch height.
Even with u0 fixed, any two different nonnegative h0 give different subsequent
ground-contact times. An absolute maximum height is likewise not a function of
u0 alone, although the maximum rise is.

The supplied lesson concerns coordinate velocities in straight-line motion, so
a vertical throw uses u0 = v0. The source wording itself does not explicitly
specify vertical rather than oblique motion. Under an oblique interpretation,
write the initial components as (vx0, u0). The horizontal velocity remains
vx0, and the complete velocity at maximum height is (vx0, 0), not necessarily
the zero vector. If the source's scalar v0 instead denotes the total initial
speed, an unprovided launch angle is needed to obtain u0 from v0. No angle or
zero horizontal component is assumed to settle that alternative reading.

The meaningful invariant response will explicitly denote v0 as the initial
vertical component and ask for the vertical velocity at the highest point,
maximum rise from the launch point, and parameterized ground-contact time.
It will visibly retain h0 as unknown. This does not claim a uniquely determined
ground-contact time from v0 alone or a complete vector velocity under an
unresolved oblique reading.

Conceptual distinction: displacement reference versus absolute height,
turning point versus return to launch height, and a positive landing root
versus the launch instant or negative root.

Response unit: one complete triple of maximum rise, turning-point vertical
velocity, and landing time for the same trajectory. Recognition cannot
demonstrate independently integrating the equations or deriving the root.
The missing launch-height value and unresolved full-vector interpretation
remain limitations, not facts to be supplied by the author.

## 441: Distance and Endpoint Acceleration

The learner must integrate the given velocity on [0,5] after checking its sign,
and differentiate it to obtain acceleration at the endpoint.

v(t) = 9.8*t - 0.003*t^2 = t*(9.8 - 0.003*t).

For 0 <= t <= 5, the second factor is at least 9.785 > 0, so v(t) >= 0.
There is no reversal, and distance equals the integral of v:

S = [4.9*t^2 - 0.001*t^3] from 0 to 5
  = 122.5 - 0.125
  = 122.375
  = 979/8.

Acceleration is alpha(t) = 9.8 - 0.006*t, so

alpha(5) = 9.8 - 0.03 = 9.77 = 977/100.

For distinction, the endpoint velocity is
v(5) = 49 - 0.075 = 48.925; it is not the endpoint acceleration.
No initial coordinate is needed for distance on this interval.

Conceptual distinction: accumulated distance versus an endpoint product,
and a derivative at the endpoint versus velocity at the endpoint.

Response unit: one complete distance/endpoint-acceleration pair for the same
motion. The two operations must both be evaluated; independent production of
their derivations is not demonstrated by recognizing a pair.

## 442: Unrestricted Parameters and Possible Direction Reversal

The learner must determine distance on [0,4] and acceleration at t = 4 for
v(t) = R*t + a*sqrt(t). R and a are constants; the source supplies no sign
restrictions. The parameter a is not itself the acceleration. It would be
incorrect to silently assume either constant is nonnegative.

For t > 0,

alpha(t) = R + a/(2*sqrt(t)),
alpha(4) = R + a/4.

When a != 0, the right derivative of velocity at t = 0 is not finite.
This creates no obstacle: the source asks for acceleration at t = 4, and
the velocity is continuous and integrable on the full distance interval.

Define the signed-displacement primitive with F(0) = 0:

F(t) = R*t^2/2 + (2*a/3)*t^(3/2),
D = F(4) = 8*R + 16*a/3.

The requested distance is S = integral from 0 to 4 of |v(t)| dt.
To establish all cases, put u = sqrt(t) in the sign analysis:
v(t) = sqrt(t)*(R*sqrt(t) + a), and 0 <= u <= 2.
The affine factor R*u + a has endpoint values a and a + 2*R.

### No Interior Reversal

If a*(a + 2*R) >= 0, the affine factor has no strict sign reversal in
(0,2); zeros at either endpoint do not change this conclusion. Velocity is
entirely nonnegative, entirely nonpositive, or identically zero. Therefore

S = |D| = |8*R + 16*a/3|.

This includes R = 0, a = 0, and a = -2*R. It does not justify S = D
without also establishing a nonnegative velocity. For instance R = 0,
a = -1 gives S = 16/3 but D = -16/3.

### Interior Reversal

If a*(a + 2*R) < 0, then R != 0 and

u_star = -a/R lies strictly between 0 and 2,
t_star = a^2/R^2 lies strictly between 0 and 4.

Using the positive square root u_star = -a/R,

J = F(t_star)
  = a^4/(2*R^3) - 2*a^4/(3*R^3)
  = -a^4/(6*R^3).

The distance is the sum of the magnitudes of the two signed legs:

S = |J| + |D - J|.

For R > 0 the initial velocity is negative and the final velocity positive;
J < 0 and D - J > 0, so S = D - 2*J.
For R < 0 the signs are reversed; J > 0 and D - J < 0, so
S = 2*J - D. Thus an equivalent closed form in the reversal case is

S = sign(R)*(D + a^4/(3*R^3))
  = |8*R + 16*a/3 + a^4/(3*R^3)|.

The expression inside the last absolute value has sign R: in the positive-R
case it equals a strictly positive distance, and the negative-R case gives
its negative. The split-integral derivation, not a guessed absolute value,
establishes this equivalence.

The two sign conditions are exhaustive, and acceleration is R + a/4 in
both cases. For a concrete reversal check, R = 1, a = -1 gives t_star = 1,
D = 8/3, J = -1/6, S = 3, and alpha(4) = 3/4.
The source has a full symbolic solution with sign cases, but not one
unconditional polynomial distance expression obtained by dropping |v|.

Conceptual distinction: signed displacement versus distance, detecting an
interior reversal rather than merely checking the endpoint, and separating
the parameter a from the derivative of velocity.

Response unit: one native multiple-selection question judging the complete
distance case split and endpoint-acceleration formula. Each assertion is
universally quantified over the parameters satisfying its stated condition;
coincidental equality for a special parameter value cannot make a false
general identity correct. Independent construction of the case split is lost
in recognition, but neither sign regime is omitted.

## 443: Projection Velocities and Accelerations on Both Curves

The learner must use the constant horizontal coordinate velocity to apply
the chain rule to each curve, then differentiate once more in time.
The definition of velocity as a coordinate derivative fixes the signed
interpretation: dx/dt = v is constant, possibly negative or zero.
Thus d^2x/dt^2 = 0.

For any supplied curve y = f(x),

v_y = dy/dt = f'(x)*v,
alpha_y = d(v_y)/dt
        = f''(x)*v^2 + f'(x)*dv/dt
        = f''(x)*v^2.

For part a, f(x) = x^2 - 2*x + 3:

f'(x) = 2*x - 2,
f''(x) = 2,
v_y = (2*x - 2)*v,
alpha_y = 2*v^2.

For part b, f(x) = x^3 - 2*x^2:

f'(x) = 3*x^2 - 4*x,
f''(x) = 6*x - 4,
v_y = (3*x^2 - 4*x)*v,
alpha_y = (6*x - 4)*v^2.

These give both projections' velocity and acceleration in terms of x and
the supplied constant v. No initial x value is needed. If an explicit
time expression were required, an unspecified initial x0 would remain:
x(t) = x0 + v*t after choosing t = 0 as the initial instant.
The source instead permits the coordinate expressions above.

Negative vertical coordinate velocities are allowed. Replacing v_y by
|v_y| would answer a speed question, not the signed-coordinate-velocity
question defined in block 0. Constant horizontal velocity does not imply
constant vertical velocity or zero vertical acceleration.

Conceptual distinction: differentiating with respect to x versus time,
the additional factor dx/dt in each chain-rule application, and constant
horizontal velocity versus the changing vertical projection.

Response unit: one complete table with the velocity/acceleration pair for
each of the two curves. The shared time-to-coordinate chain rule and the
contrasting second derivatives form one coherent comparison. Both curves
remain visible. Choice recognition cannot demonstrate independently
constructing both derivations.
