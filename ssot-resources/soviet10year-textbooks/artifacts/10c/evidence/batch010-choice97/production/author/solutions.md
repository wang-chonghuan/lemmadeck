# n97 independent source solutions

Author-only record, completed before constructing any options.
Sole mathematical input: `../seed.json`, canonical SHA-256
`54cb3765d97f5f74b7dc26cf5ff7cfd2e5c552f9545a0582412e5f28e67cf091`.
Selected unsolved exercises: 392-401. Definition blocks 10, 11 and 12
together require differentiability and $F'(x)=f(x)$ for every point of the
given interval. The authorized group instructions require proving this for
both parts of 392-397 and finding primitives on $\mathbb R$ in 398-401.
No answers, worked owners, old choices, reviewer files or images were consulted.

## What must be established

For each of the first twelve tasks, differentiate the given $F$ independently,
retain its additive constant, justify every root/power identity on the stated
interval, and show equality to $f$ at every point there. For the final four,
construct a function on all of $\mathbb R$ and verify its derivative; arbitrary
additive constants give further primitives.

The conceptual distinctions are differentiation rather than comparison of
function values, coefficients versus additive constants, the sign in
trigonometric/reciprocal derivatives, and an interval-wide assertion rather than
an identity away from an excluded singularity or corner.

## 392a

$F(x)=3\sqrt[3]{x}$, $f(x)=1/\sqrt[3]{x^2}$, $x\in]0,\infty[$.
On this interval $F(x)=3x^{1/3}$ and
$F'(x)=3(1/3)x^{-2/3}=x^{-2/3}=1/\sqrt[3]{x^2}=f(x)$.
Every positive $x$ permits the power derivative and has a nonzero denominator.
Zero is not in the interval: the derivative quotient there would be
$3h^{1/3}/h=3/|h|^{2/3}$ and has no finite limit.

## 392b

$F(x)=\sin x+3$, $f(x)=\cos x$, $x\in]-\infty,\infty[$.
$F'(x)=(\sin x)'+3'=\cos x+0=\cos x=f(x)$ for every real $x$.
The constant changes the function values, not the derivative.

## 393a

$F(x)=(3/2)\sqrt[3]{x^2}-5$, $f(x)=1/\sqrt[3]{x}$,
$x\in]0,\infty[$. On the positive interval $\sqrt[3]{x^2}=x^{2/3}$, so
$F'(x)=(3/2)(2/3)x^{-1/3}-0=x^{-1/3}=1/\sqrt[3]{x}=f(x)$.
Equivalently, differentiating the inner $x^2$ supplies the factor $2x$.
The constant $-5$ differentiates to zero and the denominator is nonzero.

## 393b

$F(x)=4-\cos x$, $f(x)=\sin x$, $x\in]-\infty,\infty[$.
$F'(x)=0-(-\sin x)=\sin x=f(x)$ everywhere on $\mathbb R$.
The outside minus and the derivative of cosine both matter.

## 394a

$F(x)=(3/4)\sqrt[3]{x^4}$, $f(x)=\sqrt[3]{x}$,
$x\in]0,\infty[$. Here $\sqrt[3]{x^4}=x^{4/3}$ and
$F'(x)=(3/4)(4/3)x^{1/3}=x^{1/3}=\sqrt[3]{x}=f(x)$.
One can also obtain
$(3/4)(1/3)(x^4)^{-2/3}(4x^3)=x^{1/3}$ for positive $x$.
The root index stays three; it is not a square root.

## 394b

$F(x)=\operatorname{tg}x-\sqrt2$, $f(x)=1/\cos^2x$,
$x\in]-\pi/2,\pi/2[$. Since $\operatorname{tg}x=\sin x/\cos x$,
$F'(x)=(\cos^2x+\sin^2x)/\cos^2x-0=1/\cos^2x=f(x)$.
For every point strictly between the endpoints, $\cos x>0$, so both the
function and quotient derivative are defined. At either endpoint $\cos x=0$;
the interval cannot be replaced by the closed interval.

## 395a

$F(x)=(2/3)\sqrt{x^3}$, $f(x)=\sqrt x$, $x\in]0,\infty[$.
Positivity gives $\sqrt{x^3}=x^{3/2}$, hence
$F'(x)=(2/3)(3/2)x^{1/2}=\sqrt x=f(x)$.
Directly the derivative is $(2/3)(3x^2)/(2\sqrt{x^3})=\sqrt x$.
The stipulated interval excludes zero and contains no negative square-root
arguments. No larger interval is silently substituted.

## 395b

$F(x)=3-\operatorname{ctg}x$, $f(x)=1/\sin^2x$,
$x\in]0,\pi[$. With $\operatorname{ctg}x=\cos x/\sin x$,
$F'(x)=0-(-\sin^2x-\cos^2x)/\sin^2x=1/\sin^2x=f(x)$.
Every $x$ in the open interval has $\sin x>0$; neither endpoint is admitted
because $\sin0=\sin\pi=0$. The leading minus reverses the negative cotangent
derivative.

## 396a

$F(x)=14-1/x$, $f(x)=1/x^2$, $x\in]-\infty,0[$.
$F'(x)=0-(-1)x^{-2}=1/x^2=f(x)$ for every negative $x$.
This derivative is positive even though $x<0$: $x^{-2}$ has even exponent.
The constant $14$ contributes zero and $x=0$ is excluded.

## 396b

$F(x)=9-1/x$, $f(x)=1/x^2$, $x\in]0,\infty[$.
$F'(x)=0-(-1)x^{-2}=1/x^2=f(x)$ for every positive $x$.
The constant $9$ contributes zero. The two given $F$ expressions differ by $5$
where both formulas can be evaluated, but their designated proof intervals
remain distinct. Neither formula defines a primitive on an interval containing
zero.

## 397a

$F(x)=|x|$, $f(x)=1$, $x\in]0,\infty[$.
On exactly this interval $|x|=x$, so $F'(x)=1=f(x)$ at every point.
Nonnegativity of a function alone would not determine its derivative.

## 397b

$F(x)=|x|$, $f(x)=-1$, $x\in]-\infty,0[$.
On exactly this interval $|x|=-x$, so $F'(x)=-1=f(x)$ at every point.
At zero the difference quotient $|h|/h$ equals $1$ for $h>0$ and $-1$ for
$h<0$; the two-sided derivative does not exist. The proofs on the two open
half-lines do not prove differentiability at zero.

## 398

$f(x)=x^3$ on $\mathbb R$. Increasing the exponent by one and choosing
coefficient $1/4$ gives $F(x)=x^4/4$, with $F'(x)=(4/4)x^3=x^3$ everywhere.
More generally $F(x)=x^4/4+C$, $C\in\mathbb R$.
Any other primitive differs from this one by a constant: the difference has
zero derivative on $\mathbb R$, so the mean value theorem makes it constant.
This theorem is used internally to describe the full family, not presented as
an additional seed definition.

## 399

$f(x)=x^4$ on $\mathbb R$. $F(x)=x^5/5$ satisfies
$F'(x)=(5/5)x^4=x^4$ at every real $x$, including zero.
The full family is $F(x)=x^5/5+C$, $C\in\mathbb R$; the difference argument
above applies. Oddness of this particular primitive is not required:
nonzero additive constants also give primitives.

## 400

$f(x)=x$ on $\mathbb R$. $F(x)=x^2/2$ has $F'(x)=(2/2)x=x$ everywhere.
The full family is $F(x)=x^2/2+C$, $C\in\mathbb R$.
A term linear in $x$ added to this family changes its derivative; an
$x$-independent constant does not.

## 401

The source $2\frac12$ is the mixed number $2+1/2=5/2$, not $2(1/2)$ and not
the variable power $x^{5/2}$. For the constant function $f(x)=5/2$ on
$\mathbb R$, choose $F(x)=(5/2)x$; its derivative is $5/2$ for every real $x$.
The full family is $F(x)=(5/2)x+C$, $C\in\mathbb R$.
Thus a primitive is affine, whereas the constant function $F(x)=5/2$ itself
has derivative zero.

## Coverage and capacity boundary

All 16 source tasks are solved above; none is mathematically deferred.
Choice response units will preserve interval-wide derivative judgments for
392-397 and the construction target on $\mathbb R$ for 398-401.
Recognizing a supplied decisive derivation is not evidence that a learner can
write an independent proof. Recognizing primitive candidates is not evidence
that the learner can construct one without supplied alternatives or state a
complete family unaided. These are genuine production losses and must appear
in the draft coverage, not be counted as fully retained skills.
