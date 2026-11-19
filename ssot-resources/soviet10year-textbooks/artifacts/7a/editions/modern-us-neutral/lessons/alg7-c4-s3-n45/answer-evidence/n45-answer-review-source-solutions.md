# N45 Independent Source Mathematics -- Stage 1 Freeze

Ticket: STEMROBIN-182. Book: 7a. Edition: modern-us-neutral.
Lesson: alg7-c4-s3-n45. Review identity: fresh independent source-math worker.
Date: 2026-11-19.

## Authority And Boundary

All mathematics below was derived from the current finalized staged lesson,
its 19 original exercises, and the four permitted images. Pixel observations
were recorded in pixel-observations.md BEFORE the specs were read. The later
spec read confirmed the queried figure constraints; it did not supply an answer
key. No answer key, book answer, choice view, choice key or author's solution
was consulted. The lesson's worked examples are instructional context, not
independently solved exercises; figure 59 was not opened.

The parent FIRST finalization receipt reports exit 0, finished
2026-11-19T07:08:46.917Z. This worker did not rerun it.

No grading slots, input specifications, answer-key schema, choices, promotion,
rendering, validation pipeline, network, DB, application, dependency, commit or
progress writes are included. Only this review directory is written.
This source-math freeze is to be reused for subsequent answers and choices.
Stage 2 comparison requires later parent authorization and does not re-solve it.

## Actual Inventory

There are 19 originals, numbered 873 through 891 without a gap.
Originals 873--888 contain exactly 44 explicit letter-labelled subparts:
14 originals with 2 each, 877 with 6, and 878 with 10.
Originals 889, 890 and 891 are additionally present and unlettered in the JSON.
Thus there are 47 printed top-level response units, NOT only 44 for the lesson.
For concrete coverage the latter three contain respectively 3 graph queries,
2 construction/function tasks, and 8 requested point placements across 2 panels.
The task ledger therefore contains 57 mathematical tasks: 44 + 3 + 2 + 8.
Multiple quantities requested within one lettered problem are retained together,
not converted into grading slots.

## Domain Conventions

All equation roots below are real. An algebraic root is retained only when it
satisfies the original denominator and contextual conditions.

- Explicit "natural numbers" in 873(a) and 875 yields the same positive answers
  whether zero belongs to the natural numbers or not.
- 873(b) says only "two numbers"; unlike (a), it does not require natural or
  positive numbers. Both the positive and negative factor pairs are solutions.
- 880 does not explicitly say that numerator and denominator must be positive.
  The complete signed-integer, nonzero-denominator solutions are recorded,
  together with the usual positive-fraction convention. In (b), 0/4 satisfies
  every stated equation if a zero numerator is permitted. It must not be silently
  rejected as an extraneous root. In (a), -5/-6 likewise satisfies the signed
  equation, but has no place under a positive-denominator/natural-component
  convention. Changing its written representation before applying the stated
  numerator/denominator modifications changes the problem.
- 890's current lesson does not specify whether its natural-number domain starts
  at 0 or 1. The complete graph for 1..20 is given, with the single extra point
  (0,0) if zero is included. Functionality is proved in both cases.

These are two source convention qualifiers (880 and 890), not unsolved
mathematical problems. All conditional cases have been solved.

## 873 -- source p0269#2

### a

Let the smaller natural number be n. Then n(n+6)=187, so
(n-11)(n+17)=0. Reject n=-17 as non-natural.
Answer: 11 and 17. Check: 11*17=187 and 17-11=6.

### b

Let the smaller number be u. Then u(u+2)=120, so
(u-10)(u+12)=0.
Answer: 120=10*12=(-12)*(-10).
Both pairs differ by 2; no positivity condition removes the negative pair.

## 874 -- source p0269#3

### a

Width w>0, length w+4, in cm. From w(w+4)=60 obtain
(w-6)(w+10)=0. Reject -10 cm.
Width 6 cm and length 10 cm; perimeter 2(6+10)=32 cm.

### b

For positive side lengths u,v in m, u+v=31 and uv=210.
u(31-u)=210 gives (u-10)(u-21)=0.
Answer: side lengths 10 m and 21 m, in either order.
Check: perimeter 62 m, area 210 m^2.

## 875 -- source p0269#4

### a

For consecutive natural numbers n,n+1,
n(n+1)-(2n+1)=109.
Thus n^2-n-110=(n-11)(n+10)=0.
Reject -10; answer 11 and 12.
Check: 132-23=109.

### b

(2n+1)^2-[n^2+(n+1)^2]=2n(n+1)=112.
Thus (n-7)(n+8)=0; reject -8.
Answer: 7 and 8. Check: 15^2-(7^2+8^2)=112.

## 876 -- source p0269#5

### a

Let the legs be 8k,15k with k>0. The hypotenuse is 17k
by the Pythagorean theorem, hence k=6.8/17=0.4 m.
The legs are 3.2 m and 6 m.
Answer: area (3.2*6)/2=9.6 m^2.

### b

Let hypotenuse c=13k and the specified leg a=12k, k>0.
The other leg is sqrt((13k)^2-(12k)^2)=5k=15 cm, so k=3 cm.
Sides: 15 cm, 36 cm, 39 cm.
Answer: perimeter 90 cm.

## 877 -- sources p0269#6, p0270#1

All denominators are nonzero constants. Domain R in every subpart.
The operations below multiply only by such constants, so introduce no roots.

### a

(x^2+1)/2-x=2 -> x^2-2x-3=(x-3)(x+1)=0.
Answer: x in {-1,3}.

### b

x(x+1)/6-2x=2 -> x^2-11x-12=(x-12)(x+1)=0.
Answer: x in {-1,12}. The outside factor x multiplies the whole fraction.

### c

3-x(x+2)/4=x+5 -> x^2+6x+8=(x+2)(x+4)=0.
Answer: x in {-4,-2}.

### d

Multiplying by 10 gives
2(3x+4)-(x^2-4x-6)=-10.
Thus x^2-10x-24=(x-12)(x+2)=0.
Answer: x in {-2,12}.

### e

Multiplying by 12 gives
(y+1)^2-3(7-y)=6y.
Thus y^2-y-20=(y-5)(y+4)=0.
Answer: y in {-4,5}.

### f

Multiplying by 40 gives
8(3-y)=10(y-2)+5(y-2)^2.
Thus 5y^2-2y-24=(5y-12)(y+2)=0.
Answer: y in {-2,12/5}.

## 878 -- source p0270#2

Every displayed reduction is equivalent to the original equation ON the stated
domain. Roots at excluded denominators are extraneous to the original equation.

### a

Domain x != 2. Equal-denominator equation gives
2x^2-7x+6=(2x-3)(x-2)=0.
Discard x=2. Answer: {3/2}.

### b

Domain x != 5. Obtain x^2-6x-5=0.
Answer: {3-sqrt(14),3+sqrt(14)}.
Neither is 5: inserting 5 in the polynomial gives -10.

### c

Domain x != -7,1.
(2x-1)(x-1)=(3x+4)(x+7) gives
x^2+28x+27=(x+1)(x+27)=0.
Answer: {-27,-1}; neither is excluded.

### d

Domain y != -1,0.
y(5y+1)=(y+2)(y+1) gives
4y^2-2y-2=2(2y+1)(y-1)=0.
Answer: {-1/2,1}; neither is excluded.

### e

Domain x != -2,2.
x(x+2)+5(x-2)=8 gives
x^2+7x-18=(x+9)(x-2)=0.
Discard x=2. Answer: {-9}.

### f

Domain x != -2,2.
(3x+1)(x-2)-(x-1)(x+2)=x^2-4 gives
x^2-6x+4=0.
Answer: {3-sqrt(5),3+sqrt(5)}.
At excluded values -2,2 the polynomial is respectively 20,-4, not zero.

### g

Domain y != -1/3,1/3.
In particular -y/(1-3y)=+y/(3y-1).
Multiplying by (3y-1)(3y+1) gives
4-4(3y-1)+y(3y+1)=3y^2-11y+8=(3y-8)(y-1)=0.
Answer: {1,8/3}; neither is excluded.

### h

Domain x != -3,3.
Since -5/(3-x)=5/(x-3), the equation becomes
4/(x+3)+4/(x-3)+1=0.
Its numerator is x^2+8x-9=(x+9)(x-1).
Answer: {-9,1}; neither is excluded.

### i

Domain x != -1/2,1/2.
Multiplying by 7(2x-1)(2x+1) gives
7(2x+1)^2-3(2x-1)^2-56x
=16x^2-16x+4=4(2x-1)^2=0.
The sole polynomial root is 1/2, which is forbidden.
Answer: empty set.
Equivalently, on the original domain the left side simplifies to
4(2x-1)/[7(2x+1)], whose possible zero is still forbidden.

### j

Domain y != -3,0,3.
Multiplying by y(y-3)(y+3) gives
(2y-5)(y+3)-(y+2)(y-3)+y(y-5)
=2y^2-3y-9=(2y+3)(y-3)=0.
Discard y=3. Answer: {-3/2}.

## 879 -- source p0270#3

### a

Domain y != -5,5.
Sum = product gives
(y+1)(y+5)+10(y-5)=10(y+1), hence
y^2+6y-55=(y+11)(y-5)=0.
Discard y=5. Answer: y=-11.
Check: the fractions are 5/8 and -5/3, and both their sum and
product equal -25/24.

### b

Domain a != 4,-2. "Difference" means the first fraction minus the second.
6(a+2)-a(a-4)=6a gives
a^2-4a-12=(a-6)(a+2)=0.
Discard a=-2. Answer: a=6.
Check: 3-3/4=3*(3/4)=9/4.

## 880 -- source p0271#1

The written numerator and denominator matter, not just the reduced rational
value; modifying a reduced representation instead would be a different task.

### a

Let denominator d and numerator d+1. Domain d != 0,-18.
(d+4)/(d+18)=(d+1)/d-1=1/d gives
d^2+3d-18=(d-3)(d+6)=0.

- d=3 gives the fraction 4/3. Modified fraction 7/21=1/3, exactly 1 less.
- d=-6 gives the signed representation -5/-6. Modified fraction -2/12=-1/6,
  exactly 1 less than 5/6. It is not a denominator-extraneous root.

Answer under the usual positive-component convention: 4/3.
Complete signed-integer answer: 4/3 and -5/-6.
With positive denominator required, d=-6 is context-inadmissible.

### b

Let denominator d and numerator d-4. Domain d != 0,-5.
(d-7)/(d+5)=(d-4)/d-1/3 gives
d^2-19d+60=(d-15)(d-4)=0.

- d=15 gives 11/15. Modified fraction 8/20=2/5, and 11/15-2/5=1/3.
- d=4 gives 0/4. Modified fraction -3/9=-1/3, and 0-(-1/3)=1/3.
  Neither original nor modified denominator vanishes.

Answer with strictly positive numerator required: 11/15.
Complete answer when a zero numerator is allowed: 11/15 and 0/4.
The text supplies no explicit condition ruling out the latter.

## 881 -- source p0271#2

### a

First distance 67-27=40 km. Let first speed v>0 km/h; final speed v+2.
40/v+27/(v+2)=4 gives
4v^2-59v-80=(v-16)(4v+5)=0.
Reject v=-5/4. Speeds: 16 and 18 km/h.
Answer asked for: last-segment time 27/18=3/2 h = 1 h 30 min.
Check: 40/16+27/18=5/2+3/2=4 h.

### b

Let outbound speed v>0 km/h. Return speed v+2.
Six minutes is 1/10 h, NOT 0.6 h.
30/(v+2)-24/v=1/10 gives
v^2-58v+480=(v-10)(v-48)=0.
Both roots are admissible.
Answer: return speed 12 km/h OR 50 km/h.
Checks: 30/12-24/10=2.5-2.4=0.1 h;
30/50-24/48=0.6-0.5=0.1 h.
There is no stated speed bound allowing either solution to be discarded.

## 882 -- source p0271#3

### a

Original speed v>0 km/h.
720/v-720/(v+10)=1 gives
v^2+10v-7200=(v-80)(v+90)=0.
Reject -90. Answer: 80 km/h.
Check: 720/80=9 h, 720/90=8 h.

### b

Slow speed v>0 km/h; fast speed v+4.
48 min = 4/5 h. From 33/v-33/(v+4)=4/5 obtain
v^2+4v-165=(v-11)(v+15)=0.
Reject -15. Speeds: 11 and 15 km/h.
Answer: slow rider 3 h; fast rider 11/5 h = 2 h 12 min.
Check: 3-11/5=4/5 h.

## 883 -- sources p0271#4, p0272#1

### a

Lake speed v>0 km/h; downstream speed v+3.
9/v+20/(v+3)=1 gives
v^2-26v-27=(v-27)(v+1)=0.
Reject -1. Answer: lake speed 27 km/h.
Check: 9/27+20/30=1/3+2/3=1 h.

### b

Lake speed v>2 km/h; upstream speed v-2.
15/v-6/(v-2)=1 gives
v^2-11v+30=(v-5)(v-6)=0.
Both satisfy v>2.
Answer: lake speed 5 km/h OR 6 km/h.
Checks: for 5, times 3 h and 2 h; for 6, times 5/2 h and 3/2 h.
Each lake segment takes exactly 1 h longer. No unique-speed premise exists.

## 884 -- source p0272#2

### a

Let upstream speed u>0 km/h. Downstream speed is u+4, not u+2.
45/(u+4)+22/u=5 gives
5u^2-47u-88=(u-11)(5u+8)=0.
Reject -8/5. Answer: upstream speed 11 km/h.
Check: 45/15+22/11=3+2=5 h; still-water speed 13 km/h.

### b

Let c be the nonnegative current speed. Domain 0 <= c < 20 km/h;
both travel directions must have positive speed.
36/(20-c)+22/(20+c)=3 gives
3c^2+14c-40=(c-2)(3c+20)=0.
Reject c=-20/3 because current speed is a magnitude, not a signed variable.
Answer: current speed 2 km/h.
Check: 36/18+22/22=2+1=3 h.

## 885 -- source p0272#3

### a

Let first machine's solo completion time T>8 h. The second's is T-8 h.
The first works 4+8=12 h; the second works 8 h.
12/T+8/(T-8)=1 gives
T^2-28T+96=(T-24)(T-4)=0.
Reject T=4 since it makes the second time -4 h.
Answer: first machine 24 h, second machine 16 h.
Check: 12/24+8/16=1.

### b

Let the first typist's solo time t>0 h; the second's is t+7/6 h,
since 1 h 10 min = 7/6 h.
First works 2 h; second works 2+4/3=10/3 h.
2/t+(10/3)/(t+7/6)=1 gives
6t^2-25t-14=(3t-14)(2t+1)=0.
Reject -1/2 h.
Answer: first typist 14/3 h = 4 h 40 min;
second typist 35/6 h = 5 h 50 min.
Check: 2/(14/3)+(10/3)/(35/6)=3/7+4/7=1.

## 886 -- source p0272#5 -- Standard Proofs

### a

Both denominators are nonzero because
(11+2sqrt(30))(11-2sqrt(30))=121-120=1.
Adding with this common denominator yields
[11-2sqrt(30)+11+2sqrt(30)]/1=22.
This proves the stated identity, not merely its numeric assertion.

### b

(sqrt(5)-2)(sqrt(5)+2)=5-4=1, so neither denominator vanishes.
The common-denominator numerator is
(sqrt(5)+2)^2+(sqrt(5)-2)^2=2(5+4)=18.
Dividing by 1 proves the stated identity.

## 887 -- sources p0272#6, p0273#1

### a

xy=(5+2sqrt(6))(5-2sqrt(6))=25-24=1,
x+y=10 != 0.
Answer: xy/(x+y)=1/10.

### b

xy=11-3=8 != 0 and x+y=2sqrt(11).
x^2+y^2=(x+y)^2-2xy=44-16=28.
Answer: (x^2+y^2)/(xy)=28/8=7/2.

## 888 -- source p0273#2

### a

Substitution for any real t:
x=2(t/2-5)+3=t-7.
Answer: x=t-7; domain t in R.

### b

Substitution for any real t:
x=(y-1)(y+1)=y^2-1=(t sqrt(2))^2-1=2t^2-1.
Answer: x=2t^2-1; domain t in R.

## 889 -- source p0273#3 -- Figure 60

The actual curve and its y=3 crossings were observed before reading the spec.
The relevant spec objects subsequently confirm f60-cross-0=(0,3),
f60-cross-4=(4,3), and endpoints at x=-1.5 and 6.
The spec represents a nonanalytic traced curve; it is not license to infer a
parabola or use the lesson's figure-59 projectile example as a function law.

Three complete standard answers:

1. f(x)=3: x in {0,4}.
2. f(x)>3: x in [-3/2,0) union (4,6].
3. f(x)<3: x in (0,4).

Proof from the graph: the curve is above y=3 before the first crossing and after
the second, and below it between them. Both outer domain endpoints are included
and are above 3. Strict inequalities exclude 0 and 4. The three sets are
disjoint and partition the stated domain [-3/2,6].

## 890 -- sources p0273#5, p0273#7 -- Graph Construction And Function Proof

Let r(n)=n-6 floor(n/6), the unique integer remainder in {0,1,2,3,4,5}.
For the positive-natural convention, draw exactly these isolated points:

| n | r(n) | n | r(n) |
|---|---|---|---|
| 1 | 1 | 11 | 5 |
| 2 | 2 | 12 | 0 |
| 3 | 3 | 13 | 1 |
| 4 | 4 | 14 | 2 |
| 5 | 5 | 15 | 3 |
| 6 | 0 | 16 | 4 |
| 7 | 1 | 17 | 5 |
| 8 | 2 | 18 | 0 |
| 9 | 3 | 19 | 1 |
| 10 | 4 | 20 | 2 |

Construction: horizontal coordinate is the input n, vertical coordinate is its
remainder. Mark all 20 listed lattice points on axes with integer ticks.
Do not connect adjacent points into line segments: the domain is discrete.
If zero is a natural number, add (0,0), giving 21 isolated points.

Answer to "is this a function?": YES in either convention.
Every admissible n has exactly one remainder on division by 6. To prove
uniqueness, if n=6q+r=6q'+r' with 0<=r,r'<6, then
r-r'=6(q'-q); since -6<r-r'<6, that multiple of 6 must be zero.
Therefore r=r'. Distinct inputs may share the same output (e.g. 1 and 7),
but that does not violate the definition of a function.

## 891 -- source p0273#8 -- Figure 61

Source and modern preview supply two schematic orders, not numerical x values.
FigureSpec confirms its coordinates are screen offsets only. Do not treat an
offset ratio as a measured x or place 1 by assuming x=2 or x=1/2.
The requests are qualitative placements on the given number lines.
Both panels imply x>0, so reciprocal and real square root are defined.

### Panel a: 0 < x < x^2

Dividing x^2>x by positive x gives x>1.
The full order is

    -x < 0 < 1/x < 1 < sqrt(x) < x < x^2.

The four requested placements:

- 1: between O and A, with the reciprocal still to its left.
- -x: to the left of O, at the reflection of A across O.
- 1/x: between O and the point 1.
- sqrt(x): between 1 and A.

Proof: x>1 gives 0<1/x<1. Also 1<sqrt(x)<x, since squaring the positive
comparison sqrt(x)<x is equivalent to x<x^2.

### Panel b: 0 < x^2 < x

Dividing x^2<x by positive x gives 0<x<1.
The full order is

    -x < 0 < x^2 < x < sqrt(x) < 1 < 1/x.

The four requested placements:

- 1: to the right of A, beyond sqrt(x).
- -x: to the left of O, at the reflection of A across O.
- 1/x: to the right of 1.
- sqrt(x): between A and 1.

Proof: 0<x<1 gives 1/x>1. Also x<sqrt(x)<1, since x^2<x and all quantities
in the square-root comparison are positive.

### Valid Construction Description

The ordering answers suffice for "approximate positions". For an accurately
scaled realization of the supplied coordinates, let a=OA>0 and b=OB>0 in
physical length units. If O1=u is the unit length, a=u*x and b=u*x^2,
so u=a^2/b. Use similar triangles to construct the fourth proportional
b:a = a:u; this constructs the point 1.
Construct the reciprocal coordinate at distance u^2/a to the right of O,
again by similar triangles. Reflect A through O for -x.
Construct the geometric mean sqrt(u*a) (e.g. an altitude in a semicircle
of diameter u+a) for the distance to sqrt(x).
These relations prescribe a consistent realization; they do not turn the
unscaled preview's screen distances into numerical source givens.

## Freeze Outcome

Solved: all 19 originals, all 44 explicit lettered subparts, and all 13 tasks
within the 3 unlettered originals (57 ledger tasks in total).
Unsolved mathematical tasks: 0.
Unreadable/missing figure inputs: 0.
Convention qualifiers: 880 and 890, exhaustively covered above.
Later answer/choice comparison: not authorized, not performed.
No semantic choice approval, answer-author approval or mechanical gate result
is claimed by this Stage 1 freeze.
