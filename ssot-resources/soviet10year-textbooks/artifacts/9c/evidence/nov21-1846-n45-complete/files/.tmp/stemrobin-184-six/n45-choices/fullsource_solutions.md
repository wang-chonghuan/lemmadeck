# n45 independent author solutions

Author-only, offline. These solutions were established from the official clean
inspect projection before constructing alternatives. No answer files, previous
choices, parent mathematical draft or independent reviews were consulted.
Selected sources: 367-374. Selected concept blocks: 10 (product rule) and 14
(constant-factor rule). Neither selected block is a solved example.

The original tasks ask for derivatives in 367-373 and for drawings of both
curves in 374. All functions and variables here are real. No source figure exists
or is required to determine either curve. This document is internal, not a view.

## 367: two proportional linear functions

Task: determine the entire derivative function, not its value at one point.

- y(x)=x/5=(1/5)x gives y'(x)=1/5 for every real x.
- h(x)=-3x/4=(-3/4)x gives h'(x)=-3/4 for every real x.

The coefficient of x is the constant slope; x does not survive differentiation.
The minus sign belongs to the coefficient and must be retained.

## 368: two affine functions

Task: determine both derivative functions.

- y(x)=2x-5 gives y'(x)=2 for every real x, since (-5)'=0.
- u(x)=2-7x/2 gives u'(x)=-7/2 for every real x, since 2'=0.

The added constants change intercepts but not slopes. Together with 367 these
four functions support one coherent constant-slope result rather than four
individual response cells.

## 369: constant multiples of two-factor products

Task: determine both derivative functions with their original scalar factors.

For y(x)=(3/5)x(x-2),

    y'(x)=(3/5)[1*(x-2)+x*1]
         =(3/5)(2x-2)
         =6(x-1)/5.

For u(x)=(3x+2)(2x-3)/7,

    u'(x)=[3(2x-3)+2(3x+2)]/7
         =(6x-9+6x+4)/7
         =(12x-5)/7.

Expansion provides the same full result:
y=(3x^2-6x)/5 and u=(6x^2-5x-6)/7. Both domains are R.
The distinction is between differentiating a product and multiplying the
derivatives, while preserving the constant multiplier.

## 370: another two-factor product

Task: determine the derivative of the specified product.

    g(x)=(2x-3)(3x+1)=6x^2-7x-3
    g'(x)=2(3x+1)+3(2x-3)=12x-7.

The domain is R. Both changing factors contribute a term; the two constant
terms in those derivative contributions are 2 and -9.

## 371: three nonconstant factors

Task: determine the full derivative of the three-factor polynomial.

Write A=3x/5+1, B=x/2-2 and C=x/3+3. Repeated application of
the product rule gives

    y'=A'BC+AB'C+ABC'
       =(3/5)BC+(1/2)AC+(1/3)AB.

The two-factor products are

    AB=(3/10)x^2-(7/10)x-2
    BC=(1/6)x^2+(5/6)x-6
    AC=(1/5)x^2+(32/15)x+3.

Thus the three contributions are

    A'BC=(1/10)x^2+(1/2)x-18/5
    AB'C=(1/10)x^2+(16/15)x+3/2
    ABC'=(1/10)x^2-(7/30)x-2/3.

Adding them yields

    y'=(3/10)x^2+(4/3)x-83/30
       =(9x^2+40x-83)/30.

The original polynomial expands to
y=(1/10)x^3+(2/3)x^2-(83/30)x-6, whose derivative is the same.
The domain is R. The essential distinction is accounting for changes in all
three factors, not differentiating only one factor or multiplying three slopes.

## 372: repeated linear factor

Task: determine the derivative of g(x)=(2x-3)^3 on R.

Regard the cube as three equal factors t=2x-3. Since t'=2,

    g'=2*t*t+t*2*t+t*t*2=6(2x-3)^2.

Equivalently,

    g=8x^3-36x^2+54x-27
    g'=24x^2-72x+54.

The factor 6 arises from three contributions, each containing the inner slope
2. No additional chain-rule definition is being imported into the seed.

## 373: product involving x squared

Task: determine the derivative of u(x)=3x^2(1-x^2) on R.

    u'=6x(1-x^2)+3x^2*(-2x)
       =6x-6x^3-6x^3
       =6x-12x^3
       =6x(1-2x^2).

Alternatively u=3x^2-3x^4. Both nonconstant factors must be differentiated
through the sum of product-rule contributions. The result is an odd cubic,
not a quadratic obtained by multiplying two derivatives.

## 374(a): y=x+1/x

Task: construct the whole real graph, including both branches.

Domain: R excluding 0. The equation y=0 becomes x^2+1=0 and has no real
solution. There is no y-axis intersection because x=0 is outside the domain.

    y' = 1-1/x^2 = (x^2-1)/x^2.

The denominator is positive on the domain, so the derivative is positive on
(-infinity,-1) and (1,infinity), and negative on (-1,0) and (0,1).
Stationary points are (-1,-2), a local maximum on the negative branch, and
(1,2), a local minimum on the positive branch. Neither is a global extremum
of the function on its entire domain.

Limits:

    x -> -infinity: y -> -infinity
    x -> 0-:        y -> -infinity
    x -> 0+:        y -> +infinity
    x -> +infinity: y -> +infinity.

The line x=0 is a vertical asymptote. Since y-x=1/x tends to zero at both
infinite ends, y=x is an oblique asymptote. On x<0 the graph lies below this
line; on x>0 it lies above it.

The negative branch rises from -infinity to (-1,-2), then falls to -infinity;
its range is (-infinity,-2]. The positive branch falls from +infinity to
(1,2), then rises to +infinity; its range is [2,infinity). The full range is
(-infinity,-2] union [2,infinity). There are no points with -2<y<2.

The function is odd, so the two branches are related by rotation through
180 degrees about the origin. Also y''=2/x^3: the negative branch is concave
down and the positive branch concave up. There is no inflection point at
x=0 because that point is not on the graph.

Sketch specification: two disconnected branches, both avoiding the axes,
with the stated stationary points, signs, directions and asymptotes. This
fully determines the qualitative drawing without an original figure.

## 374(b): y=x^2+2/x

Task: construct the whole real graph, including both branches.

Domain: R excluding 0. The equation y=0 is x^3+2=0, so the only x-axis
intersection is (-cube_root(2),0). There is no y-axis intersection.

    y' = 2x-2/x^2 = 2(x^3-1)/x^2.

Since x^2>0 on the domain, the derivative is negative on (-infinity,0)
and (0,1), and positive on (1,infinity). The sole stationary point is
(1,3), a local minimum and the absolute minimum of the positive branch.
The negative branch has no stationary point. The entire function has
neither a global minimum nor a global maximum.

Limits:

    x -> -infinity: y -> +infinity
    x -> 0-:        y -> -infinity
    x -> 0+:        y -> +infinity
    x -> +infinity: y -> +infinity.

The line x=0 is a vertical asymptote. At infinite ends y-x^2=2/x tends to
zero: the graph approaches the parabola y=x^2, below it for x<0 and above
it for x>0. There is no horizontal or oblique straight-line asymptote at
infinity; the quadratic term cannot be canceled by a line.

The negative branch decreases continuously from +infinity to -infinity,
crossing the x-axis at -cube_root(2). It alone has range R. The positive
branch decreases from +infinity to (1,3), then increases to +infinity;
its range is [3,infinity). The full graph therefore has range R.
The function is neither even nor odd.

For curvature,

    y''=2+4/x^3=2(x^3+2)/x^3.

This is positive on (-infinity,-cube_root(2)) and (0,infinity), and negative
on (-cube_root(2),0). The negative branch has an inflection point at its
x-axis crossing (-cube_root(2),0); the positive branch is concave up.

Sketch specification: a negative-x branch descending from the upper left,
crossing the axis and bending toward -infinity at 0-, plus a positive-x
branch descending from +infinity at 0+ to (1,3) and rising toward the
parabola. The two branches and their different ranges must both be retained.

## Response capacity boundary

Choice responses can recognize complete derivative results or substantive
graph properties. They do not demonstrate independently writing the
derivation or constructing either graph. Original 374 remains a drawing
task; any choice items here are additional practice, not a replacement or
evidence of drawing production. Drawing both curves is a recorded omission
of the response format, not an omitted mathematical analysis.

Authoring is not semantic review. A separate staged reviewer must judge the
source fidelity, every option, equivalence, keys and capacity losses.
