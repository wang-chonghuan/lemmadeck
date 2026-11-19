# Independent Source Solutions

Assignment: STEMROBIN-184 / worker184-3; 10c / ana10-c6-s2-n80;
written exercises 52-59. This file was authored before constructing any
alternatives. It is internal evidence, not learner-facing content or an answer
pipeline input.

Authority: prepare.py inspect and the prepared whitelist seed only. Selected
definition paragraphs: 13, 14, 15, 16, 18, 19, 23. No answers, previous choices,
interactions, tests, original-source files, figure-review inputs or ticket
outputs were read. Every exercise has an empty figure list; no definition
requiring figure 10 or 11 was selected. No images are needed or authorized.

The supplied definition is f(t)=A cos(omega t+phi), with A>=0,
omega=sqrt(c)>0 and phi in [0,2pi). For A>0 the least positive period is
T=2pi/omega. Here frequency means angular frequency, not 1/T.
Twice differentiating gives f'=-A omega sin(omega t+phi) and
f''=-A omega^2 cos(omega t+phi)=-omega^2 f.

## 52

Task: construct the entire oscillation formula from amplitude 3.5, period
3pi/2 and initial phase pi/3, and determine angular frequency.

A=3.5=7/2 and omega=2pi/(3pi/2)=4/3. Therefore

    y(t)=(7/2) cos((4/3)t+pi/3).

Its least positive period is 2pi/(4/3)=3pi/2; its cosine initial phase
pi/3 belongs to the prescribed range. The formula and angular frequency must
be judged together, not as isolated number slots.

Conceptual distinction: angular frequency is 2pi/T, and the initial phase is
the constant in the supplied cosine convention.

## 53

Task: determine period, amplitude, cosine-based initial phase and angular
frequency of y(t)=0.8 sin(t/3+pi).

Using sin(u)=cos(u-pi/2),

    y(t)=(4/5) cos(t/3+pi/2).
    (T,A,phi,omega)=(6pi,4/5,pi/2,1/3).

The printed sine offset pi is not the lesson's cosine initial phase.
The phase pi/2 is already in [0,2pi). As a direct check, y(0)=0 and
y'(0)=(4/15)cos(pi)=-4/15; the converted cosine has the same initial
value and derivative. There is no convention uncertainty here.

Conceptual distinction: convert the sine expression before reporting initial
phase; distinguish angular frequency from the period and ordinary frequency.

## 54

Task: transform the full right-hand side into A cos(omega x+phi) and
determine all four oscillation parameters.

sin(pi/6)=1/2 and cos(pi/6)=sqrt(3)/2, so

    y=cos(x)+sqrt(3)sin(x)
     =2sin(x+pi/6)
     =2cos(x-pi/3)
     =2cos(x+5pi/3).
    (T,A,phi,omega)=(2pi,2,5pi/3,1).

Expanding the final cosine yields cos(x)+sqrt(3)sin(x), because
cos(5pi/3)=1/2 and sin(5pi/3)=-sqrt(3)/2. The equivalent phase
-pi/3 lies outside the required canonical interval and must be normalized
to 5pi/3 when naming the parameters.

Conceptual distinction: the sine coefficient is -A sin(phi) in the cosine
expansion, and an equivalent negative phase is not the requested normalized
initial phase.

## 55: Local Source HOLD

Task: rewrite the expression as one harmonic oscillation and give its
parameters. The allowed text is exactly

    y=3\frac{1}{2}\cos2x+3\frac{\sqrt{3}}{2}\sin2x.

The whitelist defines the cosine phase convention but does not disambiguate
these integer-fraction juxtapositions. No explicit multiplication symbol,
parentheses, or admissible prose statement fixes the coefficients. The
irrational numerator alone is not enough authority to silently repair the
notation. The following are conditional calculations, not a chosen reading.

If both juxtaposed coefficients mean multiplication:

    a=3/2, b=3sqrt(3)/2.
    A=sqrt(a^2+b^2)=3.
    omega=2, T=pi.
    cos(phi)=a/A=1/2, sin(phi)=-b/A=-sqrt(3)/2.
    phi=5pi/3.
    y=3cos(2x+5pi/3).

If both integer-fraction strings instead denote an additive mixed expression:

    a=3+1/2=7/2, b=3+sqrt(3)/2=(6+sqrt(3))/2.
    A=sqrt(a^2+b^2)=sqrt(22+3sqrt(3)).
    omega=2, T=pi.
    phi=2pi-arctan((6+sqrt(3))/7).
    y=sqrt(22+3sqrt(3))cos(2x+phi).

These are examples of the ambiguity, not a claim that exactly two readings
exhaust every possibility. They produce different amplitudes and phases.
For positive nonzero constant coefficients the argument 2x does fix omega=2
and T=pi, but it does not fix the requested whole result. No keyed choice
will be authored for this source. Its complete transformation and parameter
task remains on local HOLD, pending explicit coefficient clarification in
the authorized modern text. Other independently solved sources remain usable.

Conceptual distinction: extracting amplitude and phase requires definite
coefficients; a plausible familiar pattern is not source authority.

## 56

Task: find any solution of y''=-25y that is not identically zero.

omega^2=25, hence omega=5. One valid constructed solution is y(t)=cos(5t):
y'=-5sin(5t), y''=-25cos(5t)=-25y, and y(0)=1 ensures y is not
identically zero.

More generally, y=C cos(5t)+D sin(5t) with (C,D)!=(0,0) gives
nonzero solutions. Equivalently y=A cos(5t+phi), A>0, phi in
[0,2pi). The zero function solves the differential equation but fails the
source's explicit exclusion. An arbitrary phase or nonzero amplitude does
not change the coefficient -25.

Conceptual distinction: take the square root of the ODE coefficient and
honor the nonzero-solution condition, which is not the condition y(t)!=0
at every point.

## 57

Task: check whether the entire function x(t)=3cos(2t+pi) satisfies
x''=-4x on the real domain.

    x'(t)=-6sin(2t+pi).
    x''(t)=-12cos(2t+pi)=-4[3cos(2t+pi)]=-4x(t).

The identity holds for every t. The answer is yes; both chain-rule factors
are necessary, and the phase pi does not change the multiplier -4.

Conceptual distinction: verifying an ODE requires a functional identity,
not a check at one point or a first-derivative calculation.

## 58

Task: prove x(t)=2cos(4t) satisfies x''=-16x.

    x'(t)=-8sin(4t).
    x''(t)=-32cos(4t)=-16[2cos(4t)]=-16x(t).

The displayed chain proves the required identity for every t. The amplitude
2 remains in the second derivative but cancels when expressing its ratio
to the original function; it does not change the coefficient 16.

Conceptual distinction: the angular frequency is squared under two
differentiations; amplitude is not an additional ODE coefficient.

## 59

Task: determine whether x(t)=7cos(3t+5) satisfies x''=-9x.

    x'(t)=-21sin(3t+5).
    x''(t)=-63cos(3t+5)=-9[7cos(3t+5)]=-9x(t).

The identity holds for every t, so this is a solution. The constant phase
5 has derivative zero and does not contribute to the frequency factor.

Conceptual distinction: the ODE coefficient depends on the squared rate
3^2, not on amplitude 7 or phase 5.

## Planned Capacity Accounting

Choice recognition does not demonstrate independently writing a formula,
constructing an arbitrary solution, or producing a differentiation proof.
Those losses must be recorded in each affected question and source coverage.
The full mathematical results of 52, 53, 54, 56, 57, 58 and 59 are settled.
The full result of 55 is not settled by permitted inputs and remains a local
source blocker. No semantic approval has been performed or claimed.
