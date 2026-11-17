# Independent written-seed solutions

Author record made before constructing options. This is not a semantic review.

Seed canonical SHA-256: `2356f2da49a97f71a47324bbcf806cf403c91c9ee2dd2d453517386f42d3e407`

Authority: the prepared whitelist seed for modern `10c`, `ana10-c6-s4-n91`.
Selected exercises: 261, 262, 263, 264, 265. Selected concept blocks: 1, 2, 3, 4.
No solved-example owner blocks, answers, previous choices, or figures were used.

## 261

Determine all four functions of alpha from t = tg(alpha/2) = 3.
The finite half-angle tangent excludes alpha = (2k+1)pi.
The denominators 1+t^2 = 10, 1-t^2 = -8, and 2t = 6 are nonzero.

sin(alpha) = 2t/(1+t^2) = 6/10 = 3/5.
cos(alpha) = (1-t^2)/(1+t^2) = -8/10 = -4/5.
tg(alpha) = 2t/(1-t^2) = 6/(-8) = -3/4.
ctg(alpha) = (1-t^2)/(2t) = -8/6 = -4/3.

The complete ordered response is (3/5, -4/5, -3/4, -4/3).
The distinction is between the half-angle parameter and the requested full-angle
functions, including signs and reciprocal directions.
Use one complete ordered quadruple, not four separate arithmetic clicks.

## 262

The literal premise is tg(x/2) = -2; the four requested functions are of alpha.
There is no stated relationship between x and alpha. Keep both variables exactly
as written. The condition constrains x only: x/2 = -arctan(2) + k*pi.
It supplies no restriction on alpha.

Even restricting examples to angles at which all four requested functions exist,
alpha = pi/6 gives
(sin(alpha), cos(alpha), tg(alpha), ctg(alpha))
= (1/2, sqrt(3)/2, 1/sqrt(3), sqrt(3)),
whereas alpha = pi/3 gives
(sqrt(3)/2, 1/2, sqrt(3), 1/sqrt(3)).
Either alpha can coexist with the same permitted x. Thus none of the four
requested numerical values is uniquely determined. Their definedness is not
guaranteed either: alpha = 0 makes ctg(alpha) undefined; alpha = pi/2 makes
tg(alpha) undefined.

The numerical written task is unavailable under its literal conditions.
The remaining meaningful response unit is recognition that those conditions do
not determine the requested alpha-values. Do not substitute alpha = x, and do
not repair the condition to tg(alpha/2) = -2.

## 263

Determine the four functions of 2alpha from t = tg(alpha) = 1/7.
tg(alpha) being finite supplies the required half-angle parameter for 2alpha.
The denominators are 1+t^2 = 50/49, 1-t^2 = 48/49, and 2t = 2/7;
all are nonzero.

sin(2alpha) = (2/7)/(50/49) = 7/25.
cos(2alpha) = (48/49)/(50/49) = 24/25.
tg(2alpha) = (2/7)/(48/49) = 7/24.
ctg(2alpha) = (48/49)/(2/7) = 24/7.

The complete ordered response is (7/25, 24/25, 7/24, 24/7).
The distinction is between functions of alpha and functions of 2alpha; the
quadrant of alpha is not needed because each double-angle value is invariant
under alpha -> alpha+pi. Use one complete quadruple.

## 264

Determine sin(4alpha) and cos(4alpha) from t = tg(2alpha) = 8.
Set beta = 2alpha solely as a calculation label, so 4alpha = 2beta.
The finite tg(beta) makes the half-angle parameter available, and 1+t^2 = 65.

sin(4alpha) = 2t/(1+t^2) = 16/65.
cos(4alpha) = (1-t^2)/(1+t^2) = -63/65.

The ordered pair is (16/65, -63/65), independently of which permitted beta is
chosen. The distinction is correct angle substitution and the negative cosine.
Use one complete sine/cosine pair.

## 265

Determine sin(4alpha) from t = tg(alpha) = 3.
The finite tangent allows the half-angle parameter formulas for 2alpha.

sin(2alpha) = 2t/(1+t^2) = 6/10 = 3/5.
cos(2alpha) = (1-t^2)/(1+t^2) = -8/10 = -4/5.
sin(4alpha) = 2*sin(2alpha)*cos(2alpha)
= 2*(3/5)*(-4/5) = -24/25.

Equivalently, sin(4alpha) = 4t(1-t^2)/(1+t^2)^2
= 12*(-8)/100 = -24/25. All denominators used are nonzero.
The distinction is two successive angle doublings, not one.
Use the final scalar result; choosing it cannot demonstrate a written derivation.
