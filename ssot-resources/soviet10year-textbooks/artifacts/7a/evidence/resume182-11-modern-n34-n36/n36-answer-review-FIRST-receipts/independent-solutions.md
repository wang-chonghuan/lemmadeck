# STEMROBIN-182 n36 FIRST independent solutions

This receipt was authored from the current modern lesson and exercises BEFORE
opening candidate answer-keys.json, its prepare template, parent author math,
or any other answer/review. It will not be amended after candidate inspection.
The reviewer independently solved every exercise 761-776 and every subpart.

Scope: offline cap2 answer-content gate only, book 7a, modern-us-neutral,
alg7-c4-s2-n36. Sole operation cwd:
/Users/yong/.codex/worktrees/d9b1/lemmadeck.
No images opened or generated; no network, .env, DB, app, Git, publish, finalize,
or cap3. All candidate answers are authorized to remain ungraded with parts=[].
This exception does not waive complete display answers or mathematical checks.

## Input binding

Modern directory:
ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n36/

- lesson.json SHA-256: 9491dea5575ade5261d12d308bd3c1ce58908d35e769246761017bc5f9c92463
- exercises.json SHA-256: a2915f4c5936f022629e2c48dc3f09662b9408a33402166075c7b7673b0b1abb
- figures.json SHA-256: 5cb365752bc66957456663151a6be872b1903bfb8b223e0d412ba51d6c1c8688

The modern and embedded source titles are exactly `恒 等 式`; printed title is
`36. 恒 等 式`. This is preserved source typography, not an answer defect.
Modern figures.json, lesson.figures, exercise.figures and exercise.figure_refs
are all empty. Exercise numbers are exactly 761 through 776, once each.
Modern prose establishes the real principal-root identity sqrt(u^2)=|u|,
including zero, and the examples 0.2|-24.5|=4.9, |x-5|=5-x for x<5,
and (1/2)sqrt(a^8)=(1/2)a^4 for all real a.

## Independent derivations

### 761 (a-b)

sqrt(x^2)=x iff x>=0. Intersecting with the actual list gives a) {3,0,10}.
sqrt(a^2)=-a iff a<=0. The second actual list contains only -6 and -8 among
nonpositive values, so b) {-6,-8}. Zero is not in that second list.

### 762 (a-i)

Apply sqrt(u^2)=|u| separately, retaining order:
a) 0.1; b) 0.4; c) 0.8; d) 1.7; e) 1.9; f) 2.4;
g) 23; h) 52; i) 61. Negative inputs give positive roots, never negative roots.

### 763 (a-c, eight substitutions)

a) For x=22,-35,-1 2/3,0, respectively: 22,35,5/3,0.
The negative mixed number is -(1+2/3), not -1+2/3.
b) For a=-7,12: 2|a|=14,24, respectively.
c) For y=-15,37: 0.1|y|=1.5,3.7, respectively.
All eight requested values are necessary in the display answer.

### 764 (a-d)

For all real variables:
a) |p|; b) |y|; c) 3|b|; d) -0.2|x|.
No sign assumptions were supplied; dropping bars would fail for negative input.
The external negative coefficient in d) remains negative.

### 765 (a-f)

a) c, on c>=0; b) a, on a>0; c) -x, on x<0;
d) 4a, on a>=0; e) -2b, on b<0; f) 1.5x, on x<0.
For f), -1.5|x|=-1.5(-x)=1.5x (negative on the specified domain).
The actual source and modern 765b both say a>0, NOT a>=0.
Zero is included only in a) and d), not in b), c), e), f).

### 766 (a-d)

a) |a-1|; b) |c+2|; c) |x+1|; d) |2y-1|, for all real variables.
c) uses x^2+2x+1=(x+1)^2;
d) uses 4y^2-4y+1=(2y-1)^2.
Each radicand is nonnegative everywhere; no domain deletion is needed.
The absolute values cannot be replaced by one signed branch without conditions.

### 767 (a-f)

a) x-4 for x>=4 (includes x=4 -> 0).
b) 2-a for a<2 (endpoint excluded).
c) m-3 for m>=3, since 3-m<=0 (includes m=3 -> 0).
d) -7-y for y<-7 (endpoint excluded).
e) 10+c for c>=-10 (includes c=-10 -> 0).
f) -n-4 for n<-4 (endpoint excluded).
These are the correct branches of the corresponding absolute values.

### 768 (a-h, square representation AND value)

The task explicitly asks for the radicand as a monomial square, not only a number.
a) 2^4=(2^2)^2=4^2; sqrt=4.
b) 3^6=(3^3)^2=27^2; sqrt=27.
c) (-5)^4=((-5)^2)^2=25^2; sqrt=25.
d) (-2)^8=((-2)^4)^2=16^2; sqrt=16.
e) same radicand 16^2; 3sqrt=48.
f) (-10)^4=((-10)^2)^2=100^2; -2sqrt=-200.
g) (-3)^8=((-3)^4)^2=81^2; 0.1sqrt=8.1.
h) (0.1)^10=((0.1)^5)^2=(0.00001)^2;
   100sqrt=100*0.00001=0.001.
External coefficients are not squared or absorbed into the original radicand.

### 769 (a-f)

a) |y^3|=y^3 for y>=0 (includes zero).
b) |m^2|=m^2 for every real m (including negative m and zero).
c) |x^5|=-x^5 for x<0; x^5 is negative there.
d) 5|a^4|=5a^4 for a<0; an even fourth power stays nonnegative.
e) (1/3)|c^6|=(1/3)c^6 for c>=0 (includes zero).
f) 1.5|z^9|=-1.5z^9 for z<0; the simplified value is positive there.
Odd inner powers c), f) need sign reversal; even inner powers b), d), e) do not.

### 770 (a-d)

Compare the nonnegative square roots before removing bars:
a) sqrt(2)-1>0 -> sqrt(2)-1.
b) 1-sqrt(3)<0 -> sqrt(3)-1.
c) sqrt(11)-sqrt(10)>0 -> sqrt(11)-sqrt(10).
d) sqrt(5)-sqrt(8)<0 -> sqrt(8)-sqrt(5)=2sqrt(2)-sqrt(5).
All four answers are positive; no +/- belongs to a principal square root.

### 771 (a-d)

All original radicands are squares, so original real domains are all R.
a) |x|=4 -> x=-4 or 4; substitution gives root 4 for each.
b) |x|+1>=1 -> no real solution (cannot equal zero).
c) |x-1|=1 -> x=0 or 2; both give root 1.
d) |x+7|=3 -> x=-10 or -4; both give root 3.
No squaring of b) can legitimize a negative principal root.

### 772 (a-d)

Use |u|<=k iff -k<=u<=k, with all endpoints included:
a) -4<=x-2<=4 -> x in [-2,6].
b) -2.5<=5-x<=2.5 -> x in [2.5,7.5].
   Both inequalities reverse when multiplying by -1.
c) -1<=x+15<=1 -> x in [-16,-14].
d) -6<=x+7<=6 -> x in [-13,-1].
At the two endpoints the roots equal 4,2.5,1,6 respectively, so the endpoints
are not open. Values just outside each interval violate the bound.

### 773 (graph production and increasing set)

y=sqrt(x^2)=|x| on all real x. Draw the two rays meeting at (0,0):
y=-x for x<0, extending left/up; y=x for x>=0, extending right/up.
Mark (-2,2),(-1,1),(0,0),(1,1),(2,2), and extend the straight rays.
Range is [0,+infinity). The function is strictly increasing on [0,+infinity),
including its vertex as an endpoint, and decreasing on (-infinity,0].
It is not increasing on all R. A textual standard answer can specify this
construction without creating an image; graph work remains ungraded.

### 774 (a-b, graph method AND solutions)

a) On one coordinate system draw y=sqrt(x) for x>=0 through
(0,0),(1,1),(4,2),(9,3), and line y=6-x through (0,6),(6,0).
They intersect at (4,2), giving x=4. The root curve increases while the line
decreases, so the intersection is unique. Original equation additionally needs
6-x>=0, hence 0<=x<=6. Algebraic verification:
x=(6-x)^2 -> (x-4)(x-9)=0; x=9 is extraneous because 3!=-3.

b) Draw y=sqrt(x) and the positive branch y=6/x on x>0 in one coordinate
system. Useful hyperbola points: (1,6),(2,3),(3,2),(4,1.5),(6,1).
The square-root curve lies below it at x=3 and above it at x=4, so plot/read
the unique intersection near (3.302,1.817). The first curve increases and the
second decreases on x>0. Exact verification x*sqrt(x)=6, with t=sqrt(x)>0:
t^3=6 -> t=cuberoot(6), x=cuberoot(36)=6^(2/3), about 3.301927.
Zero is excluded by the denominator; negative x is excluded by sqrt(x).
Numerical graph reading is approximate, not an exact equality to 3.302.
An algebra-only answer would not satisfy the explicit graph-method request.

### 775 (a-f)

a) Domain x>=0; sqrt(x)=9 -> x=81; substitution gives 9.
b) Domain x>=0; sqrt(x)=1/3 -> x=1/9; substitution gives 1/3.
c) Domain x>=-1; sqrt(x+1)>=0 cannot equal -2 -> no real solution.
   Squaring would propose x=3, but sqrt(4)=2, not -2, so reject it.
d) Domain x>=-1; x+1=1 -> x=0; substitution gives 1.
e) Domain x>=1/2; 6x-3=25 -> x=14/3; substitution gives 5.
f) Domain x>=-7/10; 10x+7=0 -> x=-7/10, at the included radicand-zero
   endpoint; substitution gives 0. A strict-domain test would wrongly reject it.

### 776 (both closed endpoints)

-1<=x/3-8<=1 -> 7<=x/3<=9 -> 21<=x<=27.
The multiplier 3 is positive; inequality directions are unchanged.
At x=21, y=-1; at x=27, y=1. Both endpoints belong to the requested interval.
The original linear function is defined on all R; no additional exclusions.

## Independence boundary

No candidate/parent answer bytes have been read at receipt authorship.
After this file is hashed and marked read-only, candidate comparison may begin.
Later findings must be written separately; this receipt stays unchanged.
