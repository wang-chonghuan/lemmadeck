# 10c Unit75 Answer Review: Source-First Freeze

2026-11-15. Parent reviewer, not answer author Ptolemy. Read the
allowed modern exercises1--14 and unit prose before seeing any current
answer draft or author solution. No standard-answer file was opened.
No exercises reference a figure; body figure1 is not required for these
derivative/monotonicity tasks. No old choices/interactions, DB or model
service consulted.

## Independent Solutions

| Exercise | Independent calculation |
| --- | --- |
| 1 | Chain rule gives3 cos(3x). |
| 2 | (1/2)cos(x/2+pi), equivalently-(1/2)cos(x/2). |
| 3 | -cos(pi/2-x)=-sin x. Inner derivative is-1. |
| 4 | 3*2 sin(2x-1)cos(2x-1)*2=12 sin(2x-1)cos(2x-1)=6 sin(4x-2). |
| 5 | sin(2t)cos t-sin t cos(2t)=sin t. Derivative cos t. Product-rule expansion gives cos(2t)cos t+sin(2t)sin t=cos t, agreeing. |
| 6 | sin(-x)=-sin x, so function and derivative are0. |
| 7 | sin(2x)=2 sin x cos x, so function5 and derivative0. |
| 8 | 2cos(2x-3.5)+2cos(2x). Both inner derivatives are2. |
| 9 | 2-18 sin^4(pi-x)cos(pi-x)=2+18 sin^4 x cos x. Minus from inner derivative-1; coefficient3.6*5=18. |
| 10 | cos(pi/2)=0 and sin(pi/2)=1, so f(u)=-sin(2u), f'(u)=-2cos(2u). |
| 11 | f'=2-cos x>=1>0 everywhere. Mean-value theorem gives f(b)-f(a)>=b-a>0 for a<b. |
| 12 | g'=1-cos x>=0, with zero set{2pi k:k integer}. Nonnegative derivative establishes nondecreasing, not by itself strictness. In every nonempty interval there is an interior subinterval avoiding this discrete zero set, on which derivative is positive. Combine its strictly positive increase with nondecreasing on the remaining pieces to obtain g(b)>g(a). Equivalently integrate1-cos x: continuous nonnegative integrand is positive on some subinterval, so integral>0. |
| 13 | h'=1-2cos x. Derivative zero at2pi k+/-pi/3. Negative on(2pi k-pi/3,2pi k+pi/3), positive on(2pi k+pi/3,2pi(k+1)-pi/3). Local maximum at2pi k-pi/3, value2pi k-pi/3+sqrt3; local minimum at2pi k+pi/3, value2pi k+pi/3-sqrt3. Domain/range R, odd, h(x+2pi)=h(x)+2pi rather than periodic. Bound x-2<=h(x)<=x+2 gives limits+/-infinity, no global extrema. |
| 14 | g'=2cos(2x-5)-3<=-1<0 on all R, so strict decrease on the specified open interval]-infinity,infinity[. |

## Exercise12 Graph Capacity

The requested graph is not an automatic-judging task. The correct
read-only standard solution must supply the curve's character, not
claim a selected answer draws it. The graph is odd, strictly increasing,
passes through(pi k,pi k), lies between y=x-1 and y=x+1, and satisfies
g(x+2pi)=g(x)+2pi. Horizontal tangents at(2pi k,2pi k) are stationary
inflection points, not extrema. g''=sin x changes sign at every pi k;
g(x)=0 only at0. These data uniquely support the standard construction
of y=x-sin x. Explicit independent drawing remains the written task.

## Exercise13 Additional Discussion

For a complete discussion, h''=2sin x gives upward curvature on
(2pi k,(2k+1)pi), downward on((2k-1)pi,2pi k), with inflection points
(pi k,pi k). Bounds restrict any zero to[-2,2]. On(0,pi/3), h
strictly decreases from0; on(pi/3,2), it increases from a negative
local minimum to2-2sin2>0. Thus exactly one positive zero r exists,
and oddness gives exactly three zeros-r,0,r. r is defined by
r=2sin r (approximately1.8955, approximation not a closed form).
This is consistent with the local interval analysis; no new source
condition or finite-window restriction is introduced.

## Expected Grading Boundary

Exercises1--10 may use reliable expression/numeric keys. Exercises
11--14 require proof, graph construction or full discussion and should
remain ungraded with visible standard solutions. This source freeze
does not yet approve a current answer JSON, key parser or finalization.
