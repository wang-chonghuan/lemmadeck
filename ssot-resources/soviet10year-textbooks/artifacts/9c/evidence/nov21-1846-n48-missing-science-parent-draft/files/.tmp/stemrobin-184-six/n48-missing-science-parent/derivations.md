# Missing n48 scientific work: draft, not independent approval

Same STEMROBIN-184/184-6 invocation; finish=review. This new parent-authored
TEXT draft addresses only missing exercise386 interpretation and exercise387
graph shape/answer work after their complete source text was assembled.
No source observation, old mathematical proof, native stage, or assembly is
replayed. Previously accepted algebra/domain/range evidence is not rerun.
All original HOLD/FAIL/UNKNOWN remain historical and unchanged. This draft
does not approve a lesson, choose a source glyph, or authorize publication.

## Exercise386: separate derivative existence from evaluating formula(1)

The assembled theorem supplies formula(1), `(x^n)' = n x^(n-1)`, and its
printed restrictions: all x for integer n>=2, x!=0 for n<=1. The exercise
asks about the point x=0. These are two different questions.

For positive integers n, the polynomial x^n is defined at zero. Its derivative
at zero is the limit h^n/h = h^(n-1): it equals 1 for n=1 and 0 for n>=2.
For n>=2 the literal right side n*0^(n-1) is also defined and equals zero.
For n=1, derivative existence does not justify evaluating the literal
0^0 in that right side. Under an undefined-0^0 convention, the printed
formula cannot be evaluated at zero, even though the derivative is 1.

For negative integers, x^n is not defined at zero and has no derivative there.
For n=0, the source restriction alone does not establish whether x^0 denotes
the punctured-domain expression or the everywhere-defined constant function.
If x^0 is defined only for x!=0, it has no derivative at zero. If the function
is explicitly defined to be the constant 1 on all reals, its derivative at
zero is 0. This latter definition is an extra stated convention, not source
ink or an inferred textbook decision. In neither case can an undefined
0^(-1) be made defined by multiplication by zero in the literal formula.

Proposed answer handling: ungraded conditional explanation, preserving the
source request. Do not assert one unconditional n=0 set or rewrite the source.
The source's Z/asterisk/font and historical conventions remain UNKNOWN.

## Exercise387(a): y = 2x + 1/x^2

The previously reviewed domain R\\{0} is reused. For graph construction,
the derivative is 2 - 2/x^3 = 2(x^3-1)/x^3. Its sign is positive for x<0,
negative for 0<x<1, zero at x=1, and positive for x>1. Thus the left branch
is strictly increasing; the right branch decreases to (1,3), then increases.
The minimum on the positive branch is 3, not a global minimum on the domain.

As x approaches zero from either side, 1/x^2 dominates and y approaches
positive infinity. The vertical asymptote is x=0. Since y-2x = 1/x^2
approaches zero as x approaches either infinity, y=2x is an oblique asymptote,
approached from above. The left branch crosses the x-axis at the unique
negative solution of 2x^3+1=0, x=-cuberoot(1/2). There is no y-intercept.
Together the branch intervals, critical point, intercept and asymptotes
determine the intended qualitative graph. No cancelled hole is filled.

## Exercise387(b): y = 2x/(1+x^2)

The previously reviewed everywhere-real domain is reused; the function is
odd and passes through the origin. The derivative is
2(1-x^2)/(1+x^2)^2. It is negative outside [-1,1], positive inside (-1,1),
and zero at -1 and 1. The graph decreases to (-1,-1), increases to (1,1),
then decreases. Both extrema are attained. The already reviewed range
[-1,1] is reused, not re-proved by this task.

At negative infinity the graph tends to 0 from below; at positive infinity
it tends to 0 from above. The horizontal asymptote is y=0. No vertical
asymptote or excluded real denominator zero exists. These intervals,
extrema, symmetry, intercept and asymptote supply the qualitative graph.

Proposed answer handling for387: an ungraded graph-construction explanation,
not an expression-only automatic key and not an invented source diagram.
Actual graphical rendering and independent answer comparison are not done.

## Bounded Arithmetic Check

The accompanying preregistered exact rational cases guard the newly used
graph coordinates and slopes; they do not prove universal monotonicity or
limits by sampling. The algebraic sign/limit arguments above carry that work.
The n=0 source convention is not tested into existence. Independent review
and modern lesson/answer stages remain pending.
