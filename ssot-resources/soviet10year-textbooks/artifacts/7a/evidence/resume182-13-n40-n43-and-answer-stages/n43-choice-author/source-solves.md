# Frozen Source Solves

Author phase: source mathematics only, before any draft or alternatives exist.
Recorded at 2026-11-19T04:17:23Z; this file is to remain unchanged after freezing.
This is an author solve record, not an independent review or semantic approval.

Seed canonical SHA-256:
`80036151ec3156535f61689ffe76678e31406e3fba88e5e74a314882238d95d1`.

## Input Boundary

Exact checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.
Selected all three written originals: 855, 856, 857.
The only content input is the current modern n43 whitelist projection.
The preparation tool's four-file source trace is retained in `seed.json`.
There are no source figures, no required new figures, and no unresolved data.
No historical choices, answers, reviewer records, or ticket outputs were read.

Concept selection:

- Block 12 actually defines completing the square on the left of
  `a*x^2+b*x+c=0`, with `a != 0`.
- Block 28 is the generic instruction to divide both sides by the coefficient
  of `x^2`, preserving the solution set. Although located within the third
  example's exposition, this paragraph has no numerical worked equation,
  calculation, or solution. Only that method paragraph is selected.
- Numerical example derivations and their answers are not selected as concepts.
  In particular, the numerical demonstrations in blocks 3-11, 15-19, 22-25,
  and 29-36 are excluded. No separate general square-difference definition
  appears in the inventory; the identity needed below is derived independently.
- `--no-concepts` is not appropriate: an explicit relevant method definition
  and a general normalization instruction are present.

The equations are solved over the reals. A real square cannot be negative;
the case of square equal to zero has one distinct root, not two different roots.
The product proof is unchanged if the two numbers are interchanged.

## General Method Derived Independently

For `z^2+p*z+q=0`, move the constant and add `(p/2)^2` to both
sides:
`(z+p/2)^2 = p^2/4-q`.
Keep both signs when the right side is positive, one root when it is zero,
and no real roots when it is negative.
For a nonmonic equation, divide every term by the nonzero leading coefficient
before applying this method.

## 855(a): Negative Linear Coefficient

Task: solve `x^2-2*x-35=0` by completing the square, not just by guessing roots.

`x^2-2*x=35`.
Add 1 to both sides: `(x-1)^2=36`.
Thus `x-1=6` or `x-1=-6`; `x=7` or `x=-5`.
The real solution set is `{-5,7}`.

Exact substitution:
`49-14-35=0` and `25+10-35=0`.
Expansion of the square recovers the original equation:
`(x-1)^2-36=x^2-2*x-35`.

Distinction: the negative linear term determines a negative shift inside the
square, and both square-root signs are required.

## 855(b): Positive Linear Coefficient

Task: solve `x^2+8*x-20=0` by completing the square.

`x^2+8*x=20`.
Add 16 to both sides: `(x+4)^2=36`.
Thus `x+4=6` or `x+4=-6`; `x=2` or `x=-10`.
The real solution set is `{-10,2}`.

Exact substitution:
`4+16-20=0` and `100-80-20=0`.
`(x+4)^2-36=x^2+8*x-20`.

Distinction: compare the sign of the square's shift with 855(a), and balance
the square-completing constant on both sides.

## 855(c): Zero Right Side After Completing the Square

Task: solve `y^2+16*y+64=0` and account for the root case.

The left side is already `(y+8)^2`.
`(y+8)^2=0` implies `y+8=0`, hence `y=-8`.
The real solution set is `{-8}`. This is a repeated root, but only one
distinct real number.

Exact substitution: `64-128+64=0`.
In particular, `y=8` gives `64+128+64=256`, not zero.

Distinction: `+/-0` is the same number; a square-zero equation does not
produce two distinct roots or two opposite roots.

## 855(d): Negative Right Side After Completing the Square

Task: solve `x^2+14*x+50=0` over the reals.

`x^2+14*x=-50`.
Add 49 to both sides: `(x+7)^2=-1`.
No real square equals -1, so the real solution set is empty.
Equivalently, the original left side is `(x+7)^2+1`, which is at least 1.

Distinction: zero and negative squared right sides have different root cases.
There is no permission to change `-1` into `1` or introduce complex roots.

## 855(e): Negative Odd Linear Coefficient

Task: solve `y^2-7*y-8=0` by completing the square using exact fractions.

`y^2-7*y=8`.
Add `49/4` to both sides:
`(y-7/2)^2=8+49/4=81/4`.
Thus `y-7/2=9/2` or `y-7/2=-9/2`.
`y=(7+9)/2=8` or `y=(7-9)/2=-1`.
The real solution set is `{-1,8}`.

Exact substitution:
`64-56-8=0` and `1+7-8=0`.
`(y-7/2)^2-81/4=y^2-7*y-8`.

Distinction: use half the linear coefficient, not the entire coefficient,
and square that half before balancing.

## 855(f): Positive Odd Linear Coefficient

Task: solve `x^2+x-2=0` by completing the square using exact fractions.

`x^2+x=2`.
Add `1/4` to both sides:
`(x+1/2)^2=2+1/4=9/4`.
Thus `x+1/2=3/2` or `x+1/2=-3/2`.
`x=(-1+3)/2=1` or `x=(-1-3)/2=-2`.
The real solution set is `{-2,1}`.

Exact substitution:
`1+1-2=0` and `4-2-2=0`.
`(x+1/2)^2-9/4=x^2+x-2`.

Distinction: after finding the square-root branches, undo the positive shift
by subtraction, not addition.

## 856(a): Normalize a Leading Coefficient of 2

Task: solve `2*x^2-9*x+10=0` without discarding the leading coefficient.

Divide every term by 2:
`x^2-(9/2)*x+5=0`.
Move the constant and add `81/16` to both sides:
`(x-9/4)^2=-5+81/16=1/16`.
Thus `x-9/4=1/4` or `x-9/4=-1/4`.
`x=10/4=5/2` or `x=8/4=2`.
The real solution set is `{2,5/2}`.

Exact substitution:
`8-18+10=0` and `25/2-45/2+10=0`.
`2*((x-9/4)^2-1/16)=2*x^2-9*x+10`.

Distinction: normalization changes the linear coefficient and constant too;
halving comes after dividing by the leading coefficient.

## 856(b): Normalize a Leading Coefficient of 5

Task: solve `5*x^2+3*x-8=0` with the sign of every normalized term preserved.

Divide every term by 5:
`x^2+(3/5)*x-8/5=0`.
Move the constant and add `9/100` to both sides:
`(x+3/10)^2=8/5+9/100=169/100`.
Thus `x+3/10=13/10` or `x+3/10=-13/10`.
`x=(-3+13)/10=1` or `x=(-3-13)/10=-8/5`.
The real solution set is `{-8/5,1}`.

Exact substitution:
`5+3-8=0` and `64/5-24/5-8=0`.
`5*((x+3/10)^2-169/100)=5*x^2+3*x-8`.

Distinction: dividing the constant as well as the variable terms is essential;
the resulting fractions retain the original signs.

## 857: Product Proof from Sum and Difference

Task: prove the product is 1 from sum `sqrt(10)` and difference `sqrt(6)`,
rather than merely report the product.

Let the two real numbers be `u` and `v`, with
`u+v=sqrt(10)` and `u-v=sqrt(6)`.

Expand independently:
`(u+v)^2=u^2+2*u*v+v^2`,
`(u-v)^2=u^2-2*u*v+v^2`.
Subtract the second expansion from the first:
`(u+v)^2-(u-v)^2=4*u*v`.
Use both given conditions:
`4*u*v=10-6=4`, so `u*v=1`.

An exact cross-check obtains the actual two numbers:
`u=(sqrt(10)+sqrt(6))/2`,
`v=(sqrt(10)-sqrt(6))/2`.
Their product is `(10-6)/4=1` by the difference-of-squares identity.
Their sum and difference recover the supplied values exactly.
If the source uses difference in the opposite order, the labels swap but the
product and the squared-difference proof stay unchanged.

Distinction: subtraction cancels the pure square terms while the two cross
terms contribute `4*u*v`, not `2*u*v`. The sum of the two squared
expressions and the product of the original sum/difference are different
quantities. The learner must connect the hypotheses to a justified proof.

## Full-Task Inventory

Nine independently solved source tasks: 855(a)-(f), 856(a)-(b), and 857.
No source subtask is mathematically unresolved.
Choice responses will not demonstrate generating transformations or writing a
proof independently; those production losses must be recorded in the draft's
limitations and coverage, not hidden by a numerical answer.
Question count is not prescribed by the nine tasks or their printed letters.
