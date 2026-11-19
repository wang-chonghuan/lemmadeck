# n41 Independent Source Solve

Written before construction of any choice alternatives. Authority is the complete whitelist seed, canonical SHA-256 `f473dc822acb6a3e7d0141dcd55d63c93661dc32bd83b5dbbdf5b614e8bd6db0`. No n41 answer keys, answer-author solutions or prior choices read.

All variables are real unless stated otherwise; square roots are principal nonnegative roots. Domains below are those of the original expressions, not enlarged domains of their simplified forms. There are 17 originals / 80 tasks: 6+6+6+8+9+6+4+6+2+6+1+1+2+6+3+2+6.

## Radical Sums

- **834.a**: Extract squares: `sqrt75=5sqrt3`, `sqrt48=4sqrt3`, `sqrt300=10sqrt3`. Coefficient `5+4-10=-1`; result `-sqrt3`.
- **834.b**: `3sqrt8=6sqrt2`, `2sqrt18=6sqrt2`, `sqrt50=5sqrt2`. Coefficient `6+6-5=7`; result `7sqrt2`.
- **834.c**: `sqrt242=11sqrt2`, `sqrt200=10sqrt2`, `sqrt8=2sqrt2`. Result `(11-10+2)sqrt2=3sqrt2`.
- **834.d**: `sqrt54=3sqrt6`, `sqrt96=4sqrt6`, `sqrt150=5sqrt6`. Result `2sqrt6`.
- **834.e**: `sqrt(1/3)=sqrt3/3`; `6sqrt(1/3)=2sqrt3`, `sqrt12=2sqrt3`. Result `sqrt3`.
- **834.f**: `sqrt(2/5)=sqrt10/5`; the three terms are `8sqrt10`, `-10sqrt10`, `2sqrt10`. Result `0`.

## Simplify Then Lookup

Literal cell provenance, printed footers, source-image hashes, rule pointers and units are in `table-provenance.json`. These are inferred arithmetic results, not printed source strings.

- **835.a**: `(3+4-10)sqrt2=-3sqrt2`. Table IV row `2,0`, main column `0`, literal `1,414`; arithmetic `-3*1.414=-4.242`.
- **835.b**: `(2*6-5-2*2)sqrt2=3sqrt2`. Same cell; `3*1.414=4.242`.
- **835.c**: `(5+(1/3)*3-4)sqrt3=2sqrt3`. Row `3,0`, column `0`, literal `1,732`; `2*1.732=3.464`.
- **835.d**: `(4+(1/2)*2+3*3)sqrt5=14sqrt5`. Row `5,0`, column `0`, literal `2,236`; `14*2.236=31.304`.
- **835.e**: `(5-(1/10)*10-3)sqrt3=sqrt3`. Row `3,0`, column `0`, literal `1,732`; `1.732`.
- **835.f**: `(7-6+(1/2)*2)sqrt2=2sqrt2`. Row `2,0`, column `0`, literal `1,414`; `2*1.414=2.828`.

The inputs are exact expressions. No argument rounding, correction or power-of-100 scaling is needed after simplification. The authored numerical task will visibly require finite-decimal table arithmetic without intermediate rounding and three decimal places for its result. It will not claim that those three places have a guaranteed true-root accuracy. No final half-way rounding is encountered or attributed to Bradis.

## Distributed Products And Squares

- **836.a**: `15-2sqrt15+sqrt60=15-2sqrt15+2sqrt15=15`.
- **836.b**: `(3sqrt7-2sqrt3)sqrt7+sqrt84=21-2sqrt21+2sqrt21=21`.
- **836.c**: `(2sqrt3+6sqrt2)(sqrt2/2)-4sqrt6=sqrt6+6-4sqrt6=6-3sqrt6`.
- **836.d**: Distribute `2sqrt3`: `24-4sqrt18-2sqrt3=24-12sqrt2-2sqrt3`.
- **836.e**: `6+5+2sqrt30-sqrt120=11+2sqrt30-2sqrt30=11`.
- **836.f**: `14+18-6sqrt28+6sqrt28=32`. The cross term and added radical cancel.

## Factorization

- **837.a**: `sqrt14-sqrt7=sqrt7(sqrt2-1)`.
- **837.b**: `sqrt33+sqrt22=sqrt11(sqrt3+sqrt2)`.
- **837.c**: `sqrt15-sqrt6=sqrt3(sqrt5-sqrt2)`.
- **837.d**: `3+sqrt3=sqrt3(sqrt3+1)`.
- **837.e**: `10-2sqrt10=2sqrt10(sqrt10-1)`.
- **837.f**: `a-5sqrt a=sqrt a(sqrt a-5)`, original real domain `a>=0`.
- **837.g**: `b-3sqrt b=sqrt b(sqrt b-3)`, domain `b>=0`.
- **837.h**: `b-sqrt(3b)=sqrt b(sqrt b-sqrt3)`, domain `b>=0`.

## Fraction Reduction

- **838.a**: `(sqrt2+2)/sqrt2=1+2/sqrt2=1+sqrt2`. Fixed positive denominator.
- **838.b**: `(5+sqrt10)/sqrt10=1+5sqrt10/10=1+sqrt10/2`.
- **838.c**: `(2sqrt3-3)/(5sqrt3)=(2-sqrt3)/5`.
- **838.d**: `a,b>=0` for the separate roots and `sqrt(ab)!=0`; hence exactly `a>0,b>0`. Divide `a sqrt b` and `b sqrt a` by `sqrt a sqrt b` to obtain `sqrt a+sqrt b`.
- **838.e**: `sqrt x` in a nonzero denominator forces `x>0` and `a!=0`; `ax>=0` then forces `a>0`. Factor numerator as `sqrt x(sqrt x-sqrt a)` and denominator as `a sqrt x`; result `(sqrt x-sqrt a)/a`, on `a>0,x>0` only.
- **838.f**: `y>=0`, `b sqrt y!=0` give `y>0,b!=0`. Factor numerator `sqrt y(sqrt y+b)`; result `1+sqrt y/b`. Negative nonzero b is permitted.
- **838.g**: `2+sqrt2=sqrt2(sqrt2+1)`; divide by `1+sqrt2` to obtain `sqrt2`.
- **838.h**: Numerator `sqrt5(sqrt3-1)`; denominator `-(sqrt3-1)`; result `-sqrt5`.
- **838.i**: Numerator `sqrt3(2-sqrt2)=sqrt6(sqrt2-1)`; denominator `sqrt8-2=2(sqrt2-1)`; result `sqrt6/2`.

## Cancellation And Original Domains

- **839.a**: Original domain `x>=0,y>=0,(x,y)!=(0,0)`. Numerator `sqrt x(sqrt x+sqrt y)` and denominator `sqrt x+sqrt y`; result `sqrt x`. Boundary `x=0,y>0` is included.
- **839.b**: Original domain `x>=0,x!=1`. Numerator `sqrt x(sqrt x-1)`; result `sqrt x`. Cancellation does not restore `x=1`; `x=0` is valid.
- **839.c**: Domain `a>=0`; denominator `6+sqrt(6a)>0`. Factor numerator `sqrt a(sqrt a+sqrt6)` and denominator `sqrt6(sqrt6+sqrt a)`; result `sqrt a/sqrt6=sqrt(a/6)`. Includes `a=0`.
- **839.d**: Domain `p>=0,p!=4`. Factor numerator `sqrt p(sqrt p-2)`, denominator `2(sqrt p-2)`; result `sqrt p/2`.
- **839.e**: Domain `a>=0,a!=4`. Numerator `(sqrt a-2)(sqrt a+2)`; result `sqrt a+2`.
- **839.f**: Domain `b>=0`; denominator `sqrt b+3>0`. Numerator `(sqrt b-3)(sqrt b+3)`; result `sqrt b-3`, including `b=9`.

## Exact Comparisons

- **840.a**: Both positive. Difference of squares is `5/2-(5+2sqrt6)/4=(5-2sqrt6)/4=(sqrt3-sqrt2)^2/4>0`. Thus `sqrt2.5>(sqrt2+sqrt3)/2`.
- **840.b**: `(sqrt5+sqrt7)^2=12+2sqrt35>11`; hence `sqrt5+sqrt7>sqrt11>sqrt11-1`. Left expression is smaller.
- **840.c**: Compare `sqrt7` with `sqrt2+1`; both positive, and `7-(sqrt2+1)^2=4-2sqrt2>0`. Thus `sqrt2+sqrt7>2sqrt2+1`.
- **840.d**: Both sums positive. Their squared difference is `2sqrt35-6sqrt3>0`, because `35>27`. Thus `sqrt5+sqrt7>3+sqrt3`.

## Conjugate Products

- **841.a**: `3-1=2`.
- **841.b**: `11-9=2`.
- **841.c**: Reorder first factor; `(7+sqrt10)(7-sqrt10)=49-10=39`.
- **841.d**: `(2sqrt5)^2-(sqrt19)^2=20-19=1`.
- **841.e**: `(5sqrt7)^2-13^2=175-169=6`.
- **841.f**: Reorder to `(sqrt3+sqrt14/2)(sqrt3-sqrt14/2)=3-14/4=-1/2`.

## Proof Of Rationality

- **842.a**: Denominators are nonzero since `18!=16`. Common denominator `(3sqrt2-4)(3sqrt2+4)=18-16=2`; numerator `(3sqrt2+4)-(3sqrt2-4)=8`. Therefore the value is `8/2=4`, a rational number.
- **842.b**: Denominators are nonzero since `25!=24`. Common denominator `(5+2sqrt6)(5-2sqrt6)=25-24=1`; numerator `(5-2sqrt6)+(5+2sqrt6)=10`. Value `10/1=10`, rational.

## Rationalize Then Lookup

Use exact conjugate algebra BEFORE finite table substitution. Reciprocal evaluation from approximate denominators is not an interchangeable table route, particularly after cancellation.

- **843.a**: Multiply by `sqrt5+sqrt3`; denominator `5-3=2`, giving `sqrt5+sqrt3`. Lookup rows `5,0` and `3,0`, col `0`, strings `2,236` and `1,732`; finite arithmetic `2.236+1.732=3.968`.
- **843.b**: Multiply by `sqrt10-sqrt7`; denominator `10-7=3`, giving `sqrt10-sqrt7`. Rows `10,` and `7,0`, col `0`, strings `3,162` and `2,646`; `3.162-2.646=0.516`.
- **843.c**: Conjugate `sqrt5+2`; denominator `5-4=1`, result `sqrt5+2`; `2.236+2=4.236`.
- **843.d**: Conjugate `3-sqrt7`; denominator `9-7=2`, result `6-2sqrt7`; `6-2*2.646=0.708`.
- **843.e**: Conjugate `9+4sqrt5`; denominator `81-80=1`, result `9+4sqrt5`; `9+4*2.236=17.944`.
- **843.f**: Conjugate `5sqrt2+7`; denominator `50-49=1`, result `7+5sqrt2`; `7+5*1.414=14.070`.

All six original denominators are nonzero by the displayed unequal squared terms. These derived decimals are not printed table cells, guaranteed physical true values, or historically equivalent editions' answers. All used main-column digits are 0; all correction fields remain not-required nulls.

## Inequality Proofs

- **844**: For `a,b>=0`, both sides `L=sqrt((a+b)/2)` and `R=(sqrt a+sqrt b)/2` are nonnegative. `L^2-R^2=(a+b-2sqrt(ab))/4=(sqrt a-sqrt b)^2/4>=0`. Squaring preserves their order because both are nonnegative, proving `L>=R`. Equality exactly when `sqrt a=sqrt b`, that is `a=b`, including both zero.
- **845**: For `a,b>=0`, `(a+b)/2-sqrt(ab)=(sqrt a-sqrt b)^2/2>=0`. Therefore arithmetic mean is at least geometric mean, with equality exactly `a=b`. This is exact, not a numerical approximation or an assumption of strict positivity.

## Formula Rearrangement With Exceptions

- **846.a**: Original restriction `b!=a`. Multiplication by `a-b` gives `s(a-b)=m(a+b)`, so `(s+m)b=a(s-m)`.
  - If `s+m!=0`, the only algebraic candidate is `b=a(s-m)/(s+m)`. Its difference from a is `-2am/(s+m)`, so it is valid exactly when `am!=0`. If `am=0`, there is no valid solution.
  - If `s+m=0`, the equation requires `-2am=0`. For `am=0`, every real `b!=a` solves the original equation; for `am!=0`, none do.
  - These conditions include a=0 and m=0 without silently dividing by them or enlarging the original domain.
- **846.b**: Original restriction `R!=0`. Expand only on that domain: `d^2=2Rh+h^2`, so `2Rh=d^2-h^2`.
  - If `h!=0`, candidate `R=(d^2-h^2)/(2h)` is valid exactly when `d^2!=h^2`, to retain `R!=0`. If `d^2=h^2`, none do.
  - If `h=0`, the original right side is 0. For `d=0`, all nonzero real R work; for `d!=0`, no R works.
  - No physical positivity assumptions are present in the source prose; this is a real-algebra classification.

## Real Equations

- **847.a**: `x(x-27)=0`; solutions `{0,27}`. Dividing by x would lose 0.
- **847.b**: `y(3y-7)=0`; solutions `{0,7/3}`.
- **847.c**: `16y^2=1`; `y^2=1/16`; solutions `{-1/4,1/4}`.
- **847.d**: `4x^2=-1` contradicts `x^2>=0`; no real solutions.
- **847.e**: `x^2=5`; solutions `{-sqrt5,sqrt5}`.
- **847.f**: `x^2=0.9/3=0.3`; solutions `{-sqrt30/10,sqrt30/10}`.

## Graph Correspondence And Equations

Pixels observed once each; see `image-observations.json`. Do not derive geometry from a spec or an old answer.

- **848.a-line**: Line a rises through `(0,2)` and `(2,5)`, slope `3/2`; matches `y=1.5x+2`.
- **848.b-line**: Line b descends through `(0,2)` and `(1,0)`, slope `-2`; matches `y=-2x+2`.
- **848.c-line**: Line c through `(0,-3)` and `(-4,-2)` has slope `(-2+3)/(-4)=-1/4`; matches `y=-x/4-3`.
- **849.a-line**: Actual fig57 line a through `(0,-2)` and `(10,0)` has slope `(0+2)/10=1/5`; equation `y=x/5-2`.
- **849.b-line**: Actual fig57 line b through `(0,1)` and `(2,-3)` has slope `(-3-1)/2=-2`; equation `y=-2x+1`.

Recognizing a complete correspondence/equation pair can preserve the coordinate reasoning but does not demonstrate independently writing equations or drawing graphs. Reuse current durable fig56 independent approval and repaired fig57 ASSOCIATION-2 exact binding without reissuing a figure PASS.

## Extrema And Attainment

- **850.a.1**: Domain all real x. `x^2>=0`; `x^2+1>=1`, minimum `1`, attained exactly at `x=0`.
- **850.a.2**: Domain all real x. `x^2-5>=-5`, minimum `-5`, attained exactly at `x=0`.
- **850.a.3**: Domain `x>=0`; `sqrt x>=0`, minimum `0`, attained exactly at `x=0`.
- **850.b.1**: Domain all real x. `-(x+4)^2<=0`, maximum `0`, attained exactly at `x=-4`.
- **850.b.2**: Domain `x>=0`; `sqrt x+2>=2>0`, so `10/(sqrt x+2)<=5`, maximum `5`, attained exactly at `x=0`.
- **850.b.3**: Domain all real x; `x^2+7>=7>0`, so `1/(x^2+7)<=1/7`, maximum `1/7`, attained exactly at `x=0`.

## Freeze Boundary

All 80 tasks have an independent solution above, including the proof and parameter exceptions. The next step is a byte-hash receipt of this document, seed, figure observations and table provenance; choice alternatives must be constructed only after that receipt exists. No answer-key comparison or semantic approval is part of this author task.
