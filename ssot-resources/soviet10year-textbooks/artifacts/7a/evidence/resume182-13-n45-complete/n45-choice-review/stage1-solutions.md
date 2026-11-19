# N45 Independent Source Solutions: Stage1

CWD: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`

Only the owned seed and four specified original/modern PNGs supplied mathematical
input. No view, option, key, answer, previous choice, or interaction schema was
disclosed. Figure metadata was projected only for asset path/hash binding, not
for geometry, source solutions, or previous review judgments.

Seed byte SHA-256: `f4874ba3f81eb0cfdc3e140566894f836335d18a05de64610e1cf62545b591e7`

Seed canonical SHA-256: `b70e5b9375e56a8aca27a42b717b4b1e7cdb40ef8b787c8f984563f660991f8e`

The actual seed has **no selected definition paragraphs** (`concepts: []`).
Where a convention is not supplied, the branches below remain explicit.

Coverage: 19 exercises; 51 subtask records; 57 requested tasks when each of the
eight point placements in 891 is counted separately. No task was left
uncomputed. Seventeen exercises have fully determined results. Exercises 880
and 890 have fully solved but convention-sensitive branches.

## 873

a) Let the smaller natural number be n. Then
`n(n+6)=187`, so `(n-11)(n+17)=0`. Reject -17 as nonnatural.
**11 and 17**, with product 187 and difference 6.

b) Let the smaller number be u. Then `u(u+2)=120`, so
`(u-10)(u+12)=0`. The source does not require positive or natural numbers here.
**(10,12) and (-12,-10)** both have product 120 and larger-minus-smaller
difference 2.

## 874

a) Positive width w satisfies `w(w+4)=60`, hence `(w-6)(w+10)=0`.
Reject -10. Width 6 cm, length 10 cm, **perimeter 32 cm**.

b) Positive sides have sum 31 m and product 210 m^2.
`s^2-31s+210=(s-10)(s-21)=0`. **Sides 10 m and 21 m**.

## 875

a) `n(n+1)-(2n+1)=109` gives `(n-11)(n+10)=0`.
Reject -10. **11 and 12**; `132-23=109`.

b) `(2n+1)^2-[n^2+(n+1)^2]=2n(n+1)=112` gives
`(n-7)(n+8)=0`. Reject -8. **7 and 8**;
`225-(49+64)=112`. Whether zero is natural does not change either answer.

## 876

a) Positive legs 8k,15k have hypotenuse 17k. `17k=6.8 m` gives k=0.4 m.
Legs are 3.2 m,6 m. **Area = (3.2*6)/2 = 9.6 m^2**.

b) Hypotenuse 13k, leg 12k give other leg 5k. `5k=15 cm` gives k=3 cm.
Sides 15 cm,36 cm,39 cm. **Perimeter 90 cm**.

## 877

All variables are real; denominators are nonzero constants. The reductions
are equivalent to the originals.

| Part | Reduced equation | Complete root set |
| --- | --- | --- |
| a | `(x-3)(x+1)=0` | `{-1,3}` |
| b | `(x-12)(x+1)=0` | `{-1,12}` |
| c | `(x+4)(x+2)=0` | `{-4,-2}` |
| d | `(x-12)(x+2)=0` | `{-2,12}` |
| e | `(y-5)(y+4)=0` | `{-4,5}` |
| f | `(5y-12)(y+2)=0` | `{-2,12/5}` |

For c the unsimplified equation is `12-x(x+2)=4x+20`;
for d it is `2(3x+4)-(x^2-4x-6)=-10`; for e it is
`(y+1)^2-3(7-y)=6y`; for f it is
`8(3-y)=10(y-2)+5(y-2)^2`.

## 878

Denominator exclusions are taken **before** clearing denominators.

| Part | Original exclusions | Cleared equation | Admissible root set |
| --- | --- | --- | --- |
| a | `x!=2` | `(2x-3)(x-2)=0` | `{3/2}` |
| b | `x!=5` | `(x-3)^2=14` | `{3-sqrt(14),3+sqrt(14)}` |
| c | `x!=-7,1` | `(x+27)(x+1)=0` | `{-27,-1}` |
| d | `y!=-1,0` | `2(2y+1)(y-1)=0` | `{-1/2,1}` |
| e | `x!=-2,2` | `(x+9)(x-2)=0` | `{-9}` |
| f | `x!=-2,2` | `(x-3)^2=5` | `{3-sqrt(5),3+sqrt(5)}` |
| g | `y!=-1/3,1/3` | `(3y-8)(y-1)=0` | `{1,8/3}` |
| h | `x!=-3,3` | `(x+9)(x-1)=0` | `{-9,1}` |
| i | `x!=-1/2,1/2` | `4(2x-1)^2=0` | empty set |
| j | `y!=0,-3,3` | `(2y+3)(y-3)=0` | `{-3/2}` |

Sign-sensitive intermediate checks:

- g: multiplying by `(3y-1)(3y+1)` gives
  `4-4(3y-1)+y(3y+1)=0`; the last sign comes from `1-3y=-(3y-1)`.
- h: first rearrange to `4/(x+3)+4/(x-3)+1=0`.
- i: numerator after multiplying by `7(2x-1)(2x+1)` is
  `7(2x+1)^2-3(2x-1)^2-56x=4(2x-1)^2`.
  Its sole zero is undefined in the original, not a valid root.
- j: the cleared numerator is
  `(2y-5)(y+3)-(y+2)(y-3)+y(y-5)=2y^2-3y-9`.

## 879

a) `y!=-5,5`. Sum equals product gives
`(y+1)(y+5)+10(y-5)=10(y+1)`, hence `(y+11)(y-5)=0`.
Reject 5. **y=-11**. Fractions 5/8 and -5/3 have both sum and
product -25/24.

b) `a!=4,-2`. The difference is first listed fraction minus second.
`6(a+2)-a(a-4)=6a` gives `(a-6)(a+2)=0`.
Reject -2. **a=6**. Fractions 3 and 3/4 have both difference and
product 9/4.

## 880

The numerator/denominator pair matters: reducing the fraction **before** the
specified changes would change the task. No positivity or zero-numerator
definition is in this seed.

a) Put denominator d and numerator d+1, with `d!=0,-18`.

`(d+4)/(d+18)=(d+1)/d-1=1/d` gives
`d(d+4)=d+18`, hence `(d-3)(d+6)=0`.

| Original pair | Original value | Changed pair/value | Check |
| --- | --- | --- | --- |
| `(4,3)` | `4/3` | `(7,21)`, `1/3` | decrease 1 |
| `(-5,-6)` | `5/6` | `(-2,12)`, `-1/6` | decrease 1 |

Both roots meet the explicit algebraic denominator conditions. Positive
denominator selects d=3; negative denominator allows d=-6. Zero denominator
and d=-18 are undefined. Replacing `(-5,-6)` with `(5,6)` would not preserve
the original numerator-minus-denominator relation or its prescribed changes.

b) Put denominator d and numerator d-4, with `d!=0,-5`.

`(d-7)/(d+5)=(d-4)/d-1/3=(2d-12)/(3d)` gives
`3d(d-7)=(2d-12)(d+5)`, hence `(d-4)(d-15)=0`.

| Original pair | Original value | Changed pair/value | Check |
| --- | --- | --- | --- |
| `(11,15)` | `11/15` | `(8,20)`, `2/5` | decrease `1/3` |
| `(0,4)` | `0` | `(-3,9)`, `-1/3` | decrease `1/3` |

Both denominator roots are positive; no negative-denominator root exists.
The d=4 branch has zero original numerator and negative changed numerator.
Only an **additional** strict positivity convention excludes it.

**Necessary missing source:** the convention restricting numerator/denominator
signs or zero numerator. All algebraic solutions are computed; selecting one
convention-dependent intended answer is not justified from this input.

## 881

a) First-leg speed v>0; last-leg speed v+2. First distance 40 km.
`40/v+27/(v+2)=4` gives `(v-16)(4v+5)=0`.
Reject -5/4. Speeds 16 km/h,18 km/h.
**Last-leg time 27/18=3/2 h=1 h 30 min**.
First time 5/2 h; total 4 h.

b) Outward speed v>0, return speed v+2. Six minutes=1/10 h.
`30/(v+2)-24/v=1/10` gives `(v-10)(v-48)=0`.
**Both roots are admissible**, with no source speed bound:

| Outward speed | Return speed requested | Outward time | Return time |
| --- | --- | --- | --- |
| 10 km/h | **12 km/h** | 2 h 24 min | 2 h 30 min |
| 48 km/h | **50 km/h** | 30 min | 36 min |

Each has speed increase 2 km/h and time increase 6 min.

## 882

a) Original speed v>0. `720/v-720/(v+10)=1` gives
`(v-80)(v+90)=0`. Reject -90. **80 km/h**; times 9 h and 8 h.

b) Slow speed v>0, fast speed v+4. Forty-eight minutes=4/5 h.
`33/v-33/(v+4)=4/5` gives `(v-11)(v+15)=0`.
Reject -15. Speeds 11 km/h,15 km/h.
**Slow time 3 h; fast time 11/5 h=2 h 12 min**.
Their difference is 48 min.

## 883

a) Lake speed v>0, downstream speed v+3.
`9/v+20/(v+3)=1` gives `(v-27)(v+1)=0`.
Reject -1. **27 km/h**. Lake time 20 min and downstream time 40 min.

b) Lake speed v>2, upstream speed v-2>0.
`15/v-6/(v-2)=1` gives `(v-5)(v-6)=0`.
**Both 5 km/h and 6 km/h** are admissible:

| Lake speed | Upstream speed | Lake time | Upstream time |
| --- | --- | --- | --- |
| 5 km/h | 3 km/h | 3 h | 2 h |
| 6 km/h | 4 km/h | 5/2 h | 3/2 h |

Each difference is 1 h; do not silently discard either positive branch.

## 884

a) Let upstream speed u>0; downstream speed u+4 because current is 2.
`45/(u+4)+22/u=5` gives `(u-11)(5u+8)=0`.
Reject -8/5. **Upstream speed 11 km/h**; still speed 13 km/h,
downstream 15 km/h. Times 3 h and 2 h.

b) Still-water speed is 20 km/h, not an increase *by* 20.
Current speed c has domain `0<=c<20`.
`36/(20-c)+22/(20+c)=3` gives `(3c+20)(c-2)=0`.
**c=2 km/h**. Reject negative c=-20/3: it reverses the stated
upstream/downstream assignment. At c=0, time is 29/10 h, not 3.
c=20 has zero upstream denominator; c>20 cannot make positive upstream
progress. Check: `36/18=2 h`, `22/22=1 h`.

## 885

a) Normalize field to one job. Let second solo time T>0, first T+8.
First works 12 h, second 8 h.
`12/(T+8)+8/T=1` gives `(T-16)(T+4)=0`.
Reject T=-4 despite first time then being positive.
**First alone 24 h, second alone 16 h**.
First 4 h complete 1/6 job; joint 8 h complete 5/6.

b) Normalize manuscript to one job. Let first solo time T>0,
second T+7/6. One h 10 min=7/6 h; one h 20 min=4/3 h.
First works 2 h, second works 10/3 h.
`2/T+(10/3)/(T+7/6)=1` gives `(2T+1)(3T-14)=0`.
Reject -1/2 even though second time would be positive.
**First 14/3 h=4 h 40 min; second 35/6 h=5 h 50 min**.
Joint 2 h complete 27/35 job; the remaining second-only 4/3 h complete 8/35.

## 886

a) Both denominators are nonzero because their product is `121-120=1`.

```text
1/(11+2sqrt(30)) + 1/(11-2sqrt(30))
= [(11-2sqrt(30))+(11+2sqrt(30))]/[121-120]
= 22.
```

b) Both denominators are nonzero because `sqrt(5)>2` and `5-4=1`.

```text
(sqrt(5)+2)/(sqrt(5)-2) + (sqrt(5)-2)/(sqrt(5)+2)
= [(sqrt(5)+2)^2+(sqrt(5)-2)^2]/(5-4)
= 2(5+4)/1
= 18.
```

These are the requested proofs, not merely reported values.

## 887

a) `xy=25-24=1`, `x+y=10!=0`. **xy/(x+y)=1/10**.

b) `xy=11-3=8!=0`, `x^2+y^2=2(11+3)=28`.
**(x^2+y^2)/(xy)=7/2**.

## 888

a) **x=t-7**, from `2(t/2-5)+3`. All real t, with no division by t.
At t=0, y=-5,x=-7. x is negative for t<7, zero at 7, positive for t>7.
y is zero at t=10.

b) **x=2t^2-1**, from `(y-1)(y+1)=y^2-1`. All real t.
At t=0, y=0,x=-1. Both signs of t are allowed and give the same x.
x is zero at `t=+/-1/sqrt(2)`, negative for `|t|<1/sqrt(2)`,
positive for `|t|>1/sqrt(2)`.

## 889

Actual original and modern fig-60 both show y=3 crossings at **x=0 and x=4**.
The curve is above y=3 near both domain ends and below between the crossings,
with the minimum near (2,1). The right boundary x=6, lower grid and axis are
visible. The source explicitly supplies the closed domain [-1.5,6].

- **f(x)=3:** `{0,4}`.
- **f(x)>3:** `[-1.5,0) union (4,6]`.
- **f(x)<3:** `(0,4)`.

Strict inequalities exclude 0 and 4. The above-level domain endpoints -1.5
and 6 are included; neither belongs to the below-level interval.

## 890

For positive natural n<=20, draw these **isolated** points:

```text
(1,1), (2,2), (3,3), (4,4), (5,5), (6,0),
(7,1), (8,2), (9,3), (10,4), (11,5), (12,0),
(13,1), (14,2), (15,3), (16,4), (17,5), (18,0),
(19,1), (20,2).
```

If zero is natural, add (0,0). The plot below includes that conditional point
as `?`; `o` marks every mandatory point. No segments join points.

```text
 r
 5 |                o                 o                 o
 4 |             o                 o                 o
 3 |          o                 o                 o
 2 |       o                 o                 o                 o
 1 |    o                 o                 o                 o
 0 | ?                 o                 o                 o
   +--------------------------------------------------------------- n
     0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
```

The defining calculation is `n=6q+r`, with integer `0<=r<6`.
Zero remainders occur at 6,12,18, and conditionally 0.
The endpoint n=20 is included and maps to 2.
Negative numbers and noninteger inputs are outside both possible domains.

**Yes, this is a function** under either convention: every admitted n has
exactly one remainder. Several n mapping to the same r is permitted.

**Necessary missing source:** no supplied definition settles whether zero
is natural. Thus the graph has either 20 or 21 points; all other graph
details and the function verdict are settled.

## 891

Both full original/modern panels show their origins, labeled A/B points and
rightward arrows. The bottom panel and far-right arrows are visible.
Named open/filled points are locations, not function-domain exclusion marks.
The drawing gives inequalities, not a calibrated numerical x.

a) Actual order `0<A(x)<B(x^2)` implies **x>1**:

```text
-x < 0 < 1/x < 1 < sqrt(x) < A(x) < B(x^2)
```

- 1 is between 0 and A.
- -x is the reflection of A to the left of 0, at equal distance from 0.
- 1/x is between 0 and 1.
- sqrt(x) is between 1 and A.

Derivation: divide `0<x<x^2` by x>0; then `1<x`, `0<1/x<1`,
and `1<sqrt(x)<x`.

b) Actual order `0<B(x^2)<A(x)` implies **0<x<1**:

```text
-x < 0 < B(x^2) < A(x) < sqrt(x) < 1 < 1/x
```

- 1 is to the right of A and sqrt(x).
- -x is the reflection of A to the left of 0, at equal distance from 0.
- 1/x is to the right of 1.
- sqrt(x) is between A and 1.

Derivation: `0<x^2<x` with positive x gives `0<x<1`; hence
`x<sqrt(x)<1` and `1/x>1`.

In both panels x=0, x=1 and negative x contradict the distinct positive
positions. Both reciprocals and square roots are therefore defined.
All eight requested positions are determined without inventing numeric x.

## Verification And Hold

Forty-five candidate substitutions into the original equations were checked
locally with no dependencies. Maximum absolute floating-point residual:
`3.9968028886505635e-15`. Completeness rests on the displayed algebra,
not numerical sampling; each original denominator/physical-domain exclusion
is recorded. The graph tasks and proof tasks are retained.

This is a frozen independent source solution, **not** a fidelity, option, key,
or package approval. Hold for explicit **STAGE2 view-only** disclosure.
