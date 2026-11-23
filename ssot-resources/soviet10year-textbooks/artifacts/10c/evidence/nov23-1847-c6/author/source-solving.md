# Independent source solving: 10c ana10-c6-ex, 335--391

Only the official seed and inspect projection were consulted. No existing
answers, interaction specifications, choices, checkpoints or reviewer keys
were read. All 57 source records below were solved before option construction.
The JSON companion copies the full authoritative conditions from the seed.
Angles without a degree symbol are radians; integers k range over Z.
Parameters a,b in 337 are real constants. Derivative identities hold on the
original function's domain. Inverse sine, cosine and tangent use their principal
ranges [-pi/2,pi/2], [0,pi], (-pi/2,pi/2). arcctg(1)=pi/4 under both common
principal conventions; none of these tasks depends on their difference.

Initial phase is representation-dependent. For 346--347 we solve both
positive-amplitude, positive-frequency sine and cosine representations.
An authored response may explicitly use y=A sin(omega x+phi),
A>0, omega>0, -pi<phi<=pi. This is a visible normalization, not a claim
that the empty lesson supplied a phase convention. No numerical data are added.
Graph recognition will not demonstrate independently producing a drawing.
Proof recognition will not demonstrate independently writing a proof.
These are capacity losses, not unresolved mathematical tasks.

## 335
Task: differentiate sin(5x), including the inner derivative.
Domain R. Let u=5x, u'=5. y'=5 cos(5x), all real x.
Distinction: chain rule versus treating the argument as x.

## 336
Task: differentiate cos(6x+pi/2).
Domain R. u'=6 and (cos u)'=-sin u, hence
y'=-6 sin(6x+pi/2)=-6 cos(6x).
Distinction: negative outer derivative and inner frequency both matter.

## 337
Task: differentiate cos^2(ax+b) for constant a,b.
Domain R, a,b in R, including a=0. With u=ax+b,
y'=2 cos u(-sin u)a=-2a sin u cos u=-a sin(2ax+2b).
The zero derivative for a=0 is included.
Distinction: both the square and the inner linear function must be differentiated.

## 338
Task: differentiate the entire difference of two products.
Domain R. The first product gives 2 sin x+2x cos x.
The second product's derivative, before the outer subtraction, is
2x cos(x+2)-(x^2-2.3)sin(x+2).
Therefore y'=2 sin x+2x cos x-2x cos(x+2)+(x^2-2.3)sin(x+2).
The decimal 2.3 is a constant, not a multiplication or exponent.
Distinction: product rules and the outer minus on the second product.

## 339
Task: differentiate (x^2+x+1)sin(3x).
Domain R. Product and chain rules give
y'=(2x+1)sin(3x)+3(x^2+x+1)cos(3x).
Distinction: differentiate both factors and retain the frequency 3.

## 340
Task: differentiate sin x cos x.
Domain R. y'=cos^2 x-sin^2 x=cos(2x).
Equivalently y=(1/2)sin(2x).
Distinction: product differentiation does not multiply the derivatives.

## 341
Task: differentiate tg x+(1+ctg x)cos x on its original domain.
Domain sin x cos x !=0, equivalently x!=k*pi/2.
y'=sec^2 x-cos x csc^2 x-(1+cot x)sin x
=1/cos^2 x-cos x/sin^2 x-sin x-cos x.
The original exclusions remain even if a rewriting has a larger apparent domain.
Distinction: cotangent has a negative derivative, and the product has two terms.

## 342
Task: compute the two-sided limit at pi/2.
Set t=pi/2-x. Then t->0, with either sign, and sin t/t->1.
The expression is undefined at the limiting point, which does not obstruct
the punctured-neighborhood limit. Result 1.
Distinction: a 0/0 substitution is not the limit.

## 343
Task: compute lim sin(3x)/(5x) at 0.
For x!=0 write (3/5)[sin(3x)/(3x)]. Result 3/5.
Distinction: argument scale and denominator scale both enter.

## 344
Task: compute lim sin(4x)/sin(7x) at 0.
In a sufficiently small punctured neighborhood the denominator is nonzero.
The expression is (4/7)[sin(4x)/(4x)]/[sin(7x)/(7x)].
Result 4/7.
Distinction: a quotient of small-angle limits has the frequency ratio.

## 345
Task: compute lim sin(5x)/tg(3x) at 0.
Rewrite as sin(5x)cos(3x)/sin(3x); normalize by 5x and 3x.
The cosine factor tends to 1. Result 5/3.
Distinction: tangent's small-angle factor is 3, not its reciprocal.

## 346
Tasks: amplitude, least positive period and initial phase for each of two
independent oscillations.
a) A=3, omega=2, T=pi. Sine phase -pi/4 modulo 2pi.
Cosine phase -3pi/4 modulo 2pi.
b) cos(pi/5-4x)=cos(4x-pi/5). A=2, omega=4, T=pi/2.
Cosine phase -pi/5; sine phase -pi/5+pi/2=3pi/10.
The positive-frequency convention is essential: the written negative
coefficient of x is not a negative physical period.
Under the explicit sine normalization the phases are -pi/4 and 3pi/10.
Distinction: amplitude is nonnegative; period is 2pi/|omega|;
phase and horizontal shift are different numbers.

## 347
Tasks: amplitude, period and phase after sign normalization / combining terms.
a) -0.6 cos(x/2+3pi/10)=0.6 cos(x/2+13pi/10)
=0.6 sin(x/2+9pi/5)=0.6 sin(x/2-pi/5).
A=3/5, T=4pi, normalized sine phase -pi/5.
Cosine phase -7pi/10 modulo 2pi.
b) Let u=x+1. (sqrt(3)/2)sin u+(1/2)cos u=sin(u+pi/6).
A=1, T=2pi, sine phase 1+pi/6 (inside (-pi,pi]).
Cosine phase 1-pi/3. The amplitudes do not add arithmetically.
Distinction: absorbing a negative coefficient changes phase by pi;
coefficient-vector length gives combined amplitude.

## 348
Task: derivative analysis and graph of f=(3/2)cos((8/3)x+pi/9).
Set h=-pi/24, t=x-h=x+pi/24, T=3pi/4.
Domain R; range [-3/2,3/2]; least positive period T.
f'=-4 sin(8t/3), f''=-(32/3)cos(8t/3)=-(64/9)f.
Maxima: x=h+kT, value 3/2. Minima: x=h+T/2+kT, value -3/2.
Zeros: x=h+T/4+kT/2=7pi/48+3kpi/8.
Decreasing: (h+kT,h+T/2+kT).
Increasing: (h+T/2+kT,h+T+kT).
Concave down: (h-T/4+kT,h+T/4+kT);
concave up: (h+T/4+kT,h+3T/4+kT).
Inflections are all the zeros. f(0)=(3/2)cos(pi/9).
Vertical reflection axes: x=h+kT/2; half-turn centers: all zero crossings.
Neither even nor odd about x=0.
One cycle's quarter points: (h,3/2), (h+T/4,0),
(h+T/2,-3/2), (h+3T/4,0), (h+T,3/2).
These data determine the translated cosine graph; recognizing them cannot
demonstrate producing a graph by hand.
Distinction: 2 2/3=8/3, phase shift is divided by frequency.

## 349
Task: derivative analysis and graph of g=3 cos((5/3)x+pi/12).
Set h=-pi/20, t=x-h=x+pi/20, T=6pi/5.
Domain R; range [-3,3]; least positive period T.
g'=-5 sin(5t/3), g''=-(25/3)cos(5t/3)=-(25/9)g.
Maxima: h+kT, value 3; minima: h+T/2+kT, value -3.
Zeros: h+T/4+kT/2=pi/4+3kpi/5.
Decreasing: (h+kT,h+T/2+kT).
Increasing: (h+T/2+kT,h+T+kT).
Concave down: (h-T/4+kT,h+T/4+kT);
concave up: (h+T/4+kT,h+3T/4+kT).
Inflections are zeros. g(0)=3cos(pi/12)=3(sqrt(6)+sqrt(2))/4.
Reflection axes h+kT/2; half-turn centers all zero crossings;
neither even nor odd about 0.
Quarter points: (h,3),(h+T/4,0),(h+T/2,-3),
(h+3T/4,0),(h+T,3).
Graph production is lost in recognition.
Distinction: 1 2/3=5/3 and the least period is 2pi divided by 5/3.

## 350
Task: decide whether y=cos(2x-pi/4) solves y''=-4y.
Domain R, twice differentiable. y'=-2sin(2x-pi/4);
y''=-4cos(2x-pi/4)=-4y, for every real x, not only at roots.
The specific exercise asks differential-equation verification under a
shared derivative/graph heading. Ancillary graph facts, if needed:
h=pi/8, T=pi, range [-1,1], maxima h+kpi,
minima h+pi/2+kpi, zeros h+pi/4+kpi/2.
Decreasing (h+kpi,h+pi/2+kpi), increasing next half-cycle.
Concavity is opposite the sign of y. y(0)=sqrt(2)/2.
Distinction: two chain derivatives square the frequency and change sign.

## 351
Task: combine the expression into one harmonic function.
Cosine subtraction gives y=2cos(2x-pi/4)=2sin(2x+pi/4).
A=2, T=pi. All x; no domain restriction.
Distinction: cos(U-V)=cos U cos V+sin U sin V.

## 352
Task: combine 3cos u+4sin u, u=3x+pi/12.
Let delta=arctan(3/4) in (0,pi/2).
5sin(u+delta)=5cos delta sin u+5sin delta cos u
=4sin u+3cos u. A=5, T=2pi/3.
Equivalent cosine form 5cos(u-arctan(4/3)).
Distinction: norm sqrt(3^2+4^2)=5 and correct coefficient-to-phase assignment.

## 353
Task: write (cos x-sin x)/2 in one harmonic form.
y=(sqrt(2)/2)cos(x+pi/4)
=(sqrt(2)/2)sin(x+3pi/4), all R.
A=sqrt(2)/2, T=2pi.
Distinction: the two equal-magnitude coefficients form a vector, not a scalar sum.

## 354
Task: express 3sin(2x) as a harmonic equation.
Already sine form A=3, omega=2, phase 0, T=pi.
Equivalent positive-amplitude cosine form 3cos(2x-pi/2).
Distinction: a sine-to-cosine phase shift leaves frequency and amplitude intact.

## 355
Task: remove the squared cosine and exhibit one harmonic term.
cos^2 x=(1+cos 2x)/2 gives 4-4(1+cos 2x)=-4cos 2x
=4cos(2x+pi)=4sin(2x-pi/2).
No constant offset remains; A=4, T=pi.
Distinction: apply the factor 1/2 to both the constant and doubled-angle term.

## 356
Task: combine -2sin x-4sqrt(3)cos x.
A=sqrt(4+48)=2sqrt(13).
Let delta=arctan(2sqrt(3)) in (0,pi/2).
cos delta=1/sqrt(13), sin delta=2sqrt(3)/sqrt(13).
y=-2sqrt(13)sin(x+delta)
=2sqrt(13)sin(x+delta-pi), phase delta-pi in (-pi,-pi/2).
T=2pi; the quadrant realizes both negative coefficients.
Distinction: amplitude is positive and the phase must have both sine and cosine
negative when expressing the original in positive-amplitude sine form.

## 357
Task: simplify while preserving the original domain.
cos(pi-alpha)=-cos alpha; cot(pi/2-alpha)=tan alpha
requires cos alpha!=0. Product=-sin alpha on that domain.
The sine expression extends beyond the original domain but is not identical
as a function with domain R.
Distinction: cofunction identity, sign and domain preservation.

## 358
Task: simplify quotient with all denominator exclusions.
cot(pi/2-alpha)=tan alpha; sin(beta-pi/2)=-cos beta;
cos(pi-beta)=-cos beta; tan(-alpha)=-tan alpha.
Numerator=-tan alpha cos beta; denominator=tan alpha cos beta.
Original domain: cos alpha!=0, sin alpha!=0, cos beta!=0.
Result -1 exactly on that domain. At removed points cancellation does not
make the original quotient defined.
Distinction: count three sign changes and do not cancel zero/undefined factors.

## 359
Task: simplify shifted sine squares.
sin(3pi/2+x)=-cos x; sin(pi+x)=-sin x.
Quotient=(1-cos^2 x)/(1-sin^2 x)=sin^2 x/cos^2 x=tan^2 x.
Domain cos x!=0. No restriction sin x!=0 is needed.
Distinction: numerator and denominator exchange complementary squares.

## 360
Task: simplify and preserve exceptional endpoints.
cos(pi-alpha)=-cos alpha; cos(3pi/2-alpha)=-sin alpha.
Quotient=cos^2 alpha/(1+sin alpha)=1-sin alpha,
provided sin alpha!=-1. At sin alpha=1 it is defined and equals 0;
at sin alpha=-1 it is undefined.
Distinction: subtracting a negative sine gives 1+sin alpha.

## 361
Task: prove equality using reductions of shifted tangent/cotangent.
Domain cos x!=0. tan(pi-x)=-tan x;
cot(pi/2+x)=(-sin x)/cos x=-tan x;
tan(2pi-x)=-tan x. LHS=tan x-tan x-tan x=-tan x=RHS.
Distinction: cot(pi/2+x) is negative tangent, not positive tangent.

## 362
Task: prove a degree-angle product identity.
Domain cos y!=0 (both cotangents have sine denominators +/-cos y).
sin(90+y)=cos y; cos(180-y)=-cos y;
cot(270+y)=-tan y. LHS=cos^2 y tan y=sin y cos y.
sin(90-y)=cos y; sin(270-y)=-cos y;
cot(90+y)=-tan y. RHS=sin y cos y as well.
sin y=0 is allowed, cos y=0 is not.
Distinction: period 180 degrees for cotangent and quadrant signs.

## 363
Task: exact evaluation without a table.
cot135=-1, sin210=-1/2, cos225=-sqrt(2)/2.
10(-1)(-1/2)(-sqrt(2)/2)=-5sqrt(2)/2.
Distinction: three negative factors give a negative result.

## 364
Task: exact evaluation including squared sine and wrapped tangent.
sin225=-sqrt(2)/2, so 2sin^2 225=1.
cot330=-sqrt(3); tan405=tan45=1.
Result 1-(-sqrt(3))=1+sqrt(3).
Distinction: square removes one sign; the outer subtraction removes another.

## 365
Task: add principal inverse-sine values.
arcsin(sqrt(3)/2)=pi/3, arcsin(1/2)=pi/6, sum pi/2.
Distinction: inverse of each term, not inverse of the sum.

## 366
Task: add principal inverse-cosine values.
arccos(1/2)=pi/3, arccos(sqrt(2)/2)=pi/4; sum 7pi/12.
Distinction: cosine values fix first-quadrant principal angles.

## 367
Task: principal values at two negative arguments.
arcsin(-1/2)=-pi/6; arccos(-sqrt(3)/2)=5pi/6;
sum 2pi/3.
Distinction: arcsin is odd, arccos is not odd.

## 368
Task: add principal inverse tangents.
arctan(-1)=-pi/4, arctan 1=pi/4, sum 0.
Distinction: principal inverse tangent is odd, not a quadrant-II angle.

## 369
Task: exact sum of inverse tangent and inverse cotangent.
arctan sqrt(3)=pi/3; arccot1=pi/4; sum 7pi/12.
The value at positive argument 1 agrees in the common arccot conventions.
Distinction: cotangent and tangent do not have the same value at sqrt(3).

## 370
Task: verify the displayed equality through the principal values.
arccos0=pi/2; arcsin(sqrt(2)/2)=pi/4; sum 3pi/4.
Equality true. A proof response must judge the angle-range reasoning, not
copy the displayed right side.
Distinction: arcsin's second-quadrant alternative is outside its principal range.

## 371
Task: verify equality including inverse-cosine endpoints.
arccos(-1)=pi, arccos1=0; sum pi, so equality true.
Both endpoints belong to [0,pi].
Distinction: cos(theta)=-1 does not give a negative principal arccos value.

## 372
Task: verify cancellation of principal inverse sines.
arcsin(-sqrt(2)/2)=-pi/4; arcsin(sqrt(2)/2)=pi/4.
Sum 0, equality true. Oddness is valid throughout [-1,1].
Distinction: negative sine's positive supplementary angle is not principal.

## 373
Task: verify a mixed inverse-function equality.
arctan(-1)=-pi/4; arccot1=pi/4, sum0, equality true.
This uses the functions' actual values, not an incorrect claim that tangent
and cotangent inverses are equal at every argument.
Distinction: their equality at 1 does not license a general oddness statement
for arccot with range (0,pi).

## 374
Task: prove double-angle quotient identity and settle domain.
Let c=cos alpha,s=sin alpha.
cos2alpha=(c-s)(c+s); 1+sin2alpha=(c+s)^2.
Thus cancel c+s only when c+s!=0, obtaining (c-s)/(c+s).
Both sides' common domain is c+s!=0, alpha!=-pi/4+kpi.
Distinction: the denominator is a square, and cancellation has a condition.

## 375
Task: prove identity using tangent-to-sine/cosine reduction.
Let u=pi/4+alpha, with cos u!=0 (the source's tangent domain).
(tan^2 u-1)/(tan^2 u+1)
=(sin^2 u-cos^2 u)/(sin^2 u+cos^2 u)=-cos2u
=-cos(pi/2+2alpha)=sin2alpha.
Domain alpha!=pi/4+kpi. The denominator tan^2 u+1 is always positive
where tangent exists. Multiplication by cos^2 u is valid there.
Distinction: numerator order is sine square minus cosine square.

## 376
Task: prove quotient identity with canceled-factor exclusions.
Let s=sin alpha,c=cos alpha.
Numerator 2s^2+2sc=2s(s+c);
denominator 2c^2+2sc=2c(s+c).
Common domain c!=0 and s+c!=0. Cancel s+c, obtaining s/c.
Neither canceled-factor roots nor cosine roots solve the original identity
as a defined equation.
Distinction: the numerator includes sin^2, not cos^2.

## 377
Task: decide exact equality and justify it.
2sin15 cos15=sin30=1/2; therefore product=1/4.
Equality true; no table or approximation is needed.
Distinction: the double-angle factor is 2, not 1.

## 378
Tasks: all three half-angle functions in each of two independent quadrants.
a) sin alpha=4/5, alpha in quadrant I, so cos alpha=3/5,
alpha/2 in (0,pi/4).
sin(alpha/2)=sqrt((1-3/5)/2)=1/sqrt(5)=sqrt(5)/5.
cos(alpha/2)=sqrt((1+3/5)/2)=2/sqrt(5)=2sqrt(5)/5.
tan(alpha/2)=1/2.
b) tan alpha=24/7, alpha in (pi,3pi/2), so
cos alpha=-7/25, sin alpha=-24/25.
alpha/2 in (pi/2,3pi/4), sine positive, cosine negative.
sin(alpha/2)=4/5; cos(alpha/2)=-3/5; tan(alpha/2)=-4/3.
Distinction: square roots require the half-angle quadrant, not original
angle's quadrant or blanket positive roots.

## 379
Task: prove the half-angle quotient identity on its common domain.
Let c=cos(beta/2),s=sin(beta/2).
RHS=(1-sin beta)/cos beta=(c-s)^2/[(c-s)(c+s)].
On cos beta!=0, both c-s and c+s are nonzero; cancel c-s to get LHS.
Common domain cos beta!=0. LHS alone is also defined at beta=pi/2+2kpi
(where c-s=0), but RHS is not, so do not extend the identity there.
Distinction: multiplying by a conjugate and canceling require nonzero factors.

## 380
Task: prove cot-half minus tan-half identity.
Let t=alpha/2. LHS=(cos^2 t-sin^2 t)/(sin t cos t)
=cos alpha/[(1/2)sin alpha]=2cot alpha.
Common domain sin alpha!=0, equivalently alpha!=kpi.
This exactly means both sin t and cos t are nonzero.
Distinction: denominator sin t cos t equals half of sin alpha.

## 381
Tasks: half-angle parameter, three rational formulas, three numerical values.
cos alpha=-1/2, pi<alpha<3pi/2 gives alpha=4pi/3,
sin alpha=-sqrt(3)/2. Let t=tan(alpha/2)=tan(2pi/3)=-sqrt(3).
sin alpha=2t/(1+t^2)=-sqrt(3)/2.
tan alpha=2t/(1-t^2)=sqrt(3).
cot alpha=(1-t^2)/(2t)=sqrt(3)/3.
Here t is finite, t!=0, t^2!=1; every formula's denominator is nonzero.
Distinction: the half angle is quadrant II, not quadrant III.

## 382
Task: all real solutions.
sin^4(x/2)-cos^4(x/2)
=(sin^2(x/2)-cos^2(x/2))(sin^2(x/2)+cos^2(x/2))
=-cos x. Hence cos x=-1/4.
Solutions x=+/-arccos(-1/4)+2kpi, k in Z.
Equivalently pi+/-arccos(1/4)+2kpi; no restrictions are lost.
Distinction: difference of fourth powers uses the sum-of-squares factor 1.

## 383
Task: all real solutions without losing zero-factor possibilities.
2sin2x=4sin x cos x. Move terms:
cos^2 x-4sin x cos x+4sin^2 x=(cos x-2sin x)^2=0.
sin x=0 cannot satisfy this (cos^2 x=1).
cos x=0 cannot satisfy this (4sin^2 x=4).
Thus tan x=1/2 and x=arctan(1/2)+kpi.
Distinction: perfect square and tangent's period pi.

## 384
Task: all real solutions including the branch removed by division.
Let c=cos(x/2), so 1+cos x=2c^2, sin^2(x/2)=1-c^2.
8c^2=3(1-c^2)c, or c(3c^2+8c-3)=0.
3c^2+8c-3=(3c-1)(c+3).
Possible roots c=0,1/3,-3; -3 is outside [-1,1].
c=0 gives x=pi+2kpi.
c=1/3 gives x=+/-2arccos(1/3)+4kpi.
The original equation has half-angle cosine, so the latter branches use 4pi;
shifting them by 2pi changes c to -1/3 and fails.
Distinction: retain c=0 and reject c=-3 by cosine range.

## 385
Task: all real solutions.
sin x+sin3x=2sin2x cos x=0.
sin2x=0 gives x=kpi/2; cos x=0 gives x=pi/2+kpi,
already contained in the first family. Union simplifies to x=kpi/2.
Distinction: factorization preserves both factors and remove duplicate families.

## 386
Task: all real solutions.
cos2x-cos6x=-2sin4x sin(-2x)=2sin4x sin2x.
sin4x=0 gives x=kpi/4; sin2x=0 gives x=kpi/2,
contained in the first family. Complete set x=kpi/4.
Distinction: the average/difference angles are 4x and -2x.

## 387
Task: all real solutions of a sine difference.
Difference=2cos(pi/6)sin x=sqrt(3)sin x.
Therefore sin x=1/sqrt(3)=sqrt(3)/3.
Let theta=arcsin(sqrt(3)/3) in (0,pi/2).
Solutions x=theta+2kpi or x=pi-theta+2kpi.
Distinction: include both sine branches; cosine of pi/6 is not sine of pi/6.

## 388
Task: write the product as a sum of harmonic terms.
sin A cos B=(1/2)[sin(A+B)+sin(A-B)].
A=2x+y, B=x+2y, so
(1/2)[sin(3x+3y)+sin(x-y)], for all real x,y.
Distinction: subtraction applies to both terms in B.

## 389
Task: write cosine product as a sum.
cos A cos B=(1/2)[cos(A+B)+cos(A-B)].
A=2alpha-beta, B=2alpha+beta.
Result (1/2)[cos4alpha+cos2beta], since cosine is even.
All real alpha,beta.
Distinction: a difference angle -2beta becomes +2beta only because cosine is even.

## 390
Task: write sine product as a sum.
sin A sin B=(1/2)[cos(A-B)-cos(A+B)].
A=2x-y, B=x+2y.
Result (1/2)[cos(x-3y)-cos(3x+y)], all real x,y.
Distinction: order of the two cosine terms is decisive.

## 391
Task: remove the product of squared half-angle functions in favor of a sum.
4cos^2(x/2)sin^2(x/2)=[2sin(x/2)cos(x/2)]^2
=sin^2 x=(1-cos2x)/2, all real x.
Distinction: after doubling the half angle, a second double-angle identity
is needed to remove the square.
