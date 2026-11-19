# N44 Independent Source Calculations

Author-only, offline, 2026-11-19. Not semantic approval.
Exact checkout: /Users/yong/.codex/worktrees/d9b1/lemmadeck
Branch: codex/STEMROBIN-182-textbooks
Owned directory: .intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n44-choice-author/

This record was written and frozen BEFORE any alternatives were constructed.
The seed was prepared once, selecting all 15 original numbers 858--872.
Seed canonical SHA-256: ce8aa4653788e45f805bb5b329102f32e50f4bbdd0cd336fbd2b68e58ebd62fd.
Definition blocks: 2 (a != 0), 6 (general completing-square identity),
27 (general formula), 29 (discriminant definition), 30 (real-root counts),
52 (incomplete quadratic definition). No worked-example blocks selected.
All roots and parameters below are real. "Two roots" means distinct roots;
the two formula signs at D=0 give one root, not two.

## Source Boundary

Authority: the current modern n44 written prose, projected by prepare.py inspect.
Zero referenced lesson figures; zero source lesson image openings.
No old n44 choices, answer keys, keyboard/input configuration, author/reviewer
solutions or tests were consulted. No Git history, service, model, network, env,
DB, app, dependency, publication or commit operations were performed.

Supplementary reading was limited by purpose to frozen Bradis source-identification,
table transcription/capture and method records. Some older source records mix
literal source facts with derived calculations for OTHER lessons. Those ancillary
derived sections appeared in the raw output; they were not used as inputs to
solve n44, to construct its choices, or to infer its correct sets. No n44 solution
or source-only review output was read. Subsequent source projections use literal
source fields only.

Before the same-book route update, two Bradis page images were opened once each.
Their integer root cells agree with the independently observed same-book cells,
but are not the chosen 862 authority. No historical table equivalence is claimed.
The same-book original appendix was then opened once, with no crop or reopen:
.tmp/ld-s10y-lesson/7a/pages/0346/page.grid.png, printed page 340.
Its heading is the square-root table for natural numbers 1--99; tens are row
indices and units are column indices (the scan is sideways). The printed table
values have three decimal places. Needed literal entries and addresses are
separately frozen in table-source.json. Preparation success is NOT table-fidelity
approval, and this author's transcription is NOT independent approval.

## 858: Coefficients, Discriminant And Distinct Real Root Count

For the equations AS PRINTED, the tuple is (a,b,c,D,count).
These are not normalized to monic equations; coefficient signs must be retained.

| Part | Computation of D | Complete tuple |
| --- | --- | --- |
| a | 3^2 - 4(2)(1) = 9-8 = 1 | (2,3,1,1,2) |
| b | 7^2 - 4(3)(2) = 49-24 = 25 | (3,7,2,25,2) |
| c | 1^2 - 4(2)(1) = 1-8 = -7 | (2,1,1,-7,0) |
| d | 4^2 - 4(4)(1) = 16-16 = 0 | (4,4,1,0,1) |
| e | 5^2 - 4(1)(-6) = 25+24 = 49 | (1,5,-6,49,2) |
| f | 2^2 - 4(1)(2) = 4-8 = -4 | (1,2,2,-4,0) |
| g | (-6)^2 - 4(9)(1) = 36-36 = 0 | (9,-6,1,0,1) |
| h | (-7)^2 - 4(4)(-2) = 49+32 = 81 | (4,-7,-2,81,2) |

## 859: Required Quadratic-Formula Method

Every formula line includes BOTH signs; sets are complete.

| Part | D calculation | Formula substitution | Complete solution set |
| --- | --- | --- | --- |
| a | 49-48=1 | x=(7 +/- 1)/6 | {1,4/3} |
| b | 64-60=4 | x=(8 +/- 2)/10 | {3/5,1} |
| c | 169-168=1 | x=(13 +/- 1)/6 | {2,7/3} |
| d | 81-72=9 | y=(9 +/- 3)/4 | {3/2,3} |
| e | 36-20=16 | y=(6 +/- 4)/10 | {1/5,1} |
| f | 1+528=529=23^2 | x=(1 +/- 23)/8 | {-11/4,3} |
| g | 1024-960=64 | z=(-32 +/- 8)/6 | {-20/3,-4} |
| h | 49+240=289=17^2 | x=(-7 +/- 17)/2 | {-12,5} |
| i | 100+96=196=14^2 | y=(10 +/- 14)/2 | {-2,12} |
| j | 1+360=361=19^2 | p=(-1 +/- 19)/2 | {-10,9} |

## 860: Rearrange And Solve

| Part | Equivalent zero form | D | Formula and complete set |
| --- | --- | --- | --- |
| a | 5x^2-9x-2=0 | 81+40=121 | (9 +/- 11)/10; {-1/5,2} |
| b | x^2+5x-14=0 | 25+56=81 | (-5 +/- 9)/2; {-7,2} |
| c | x^2+6x+9=0 | 36-36=0 | -6/2=-3; {-3} |
| d | z^2-z-20=0 | 1+80=81 | (1 +/- 9)/2; {-4,5} |
| e | y^2-52y+576=0 | 2704-2304=400 | (52 +/- 20)/2; {16,36} |
| f | 15y^2-22y-37=0 | 484+2220=2704=52^2 | (22 +/- 52)/30; {-1,37/15} |
| g | 25p^2-10p+1=0 | 100-100=0 | 10/50=1/5; {1/5} |
| h | 2x^2+9x-486=0 | 81+3888=3969=63^2 | (-9 +/- 63)/4; {-18,27/2} |

## 861: Required Expansion, Zero Form And All Roots

a: (x+4)^2=x^2+8x+16. Subtract 3x+40:
x^2+5x-24=0. D=25+96=121. x=(-5 +/- 11)/2 gives {-8,3}.

b: (2x-3)^2=4x^2-12x+9. Subtract 11x-19:
4x^2-23x+28=0. D=529-448=81. x=(23 +/- 9)/8 gives {7/4,4}.

c: (x+1)^2=x^2+2x+1. Subtract 7918-2x:
x^2+4x-7917=0. D=16+31668=31684=178^2.
x=(-4 +/- 178)/2 gives {-91,87}.

d: (x+2)^2=x^2+4x+4. Subtract 3131-2x:
x^2+6x-3127=0. D=36+12508=12544=112^2.
x=(-6 +/- 112)/2 gives {-59,53}.

## 862: Same-Book Table Route, Not Calculator Proof

Read literal square-root values from printed340 / physical346:
sqrt(21) approximately 4.583 (tens2, units1);
sqrt(17) approximately 4.123 (tens1, units7);
sqrt(73) approximately 8.544 (tens7, units3);
sqrt(27) approximately 5.196 (tens2, units7).
All four are direct integer entries: no interpolation, correction column,
radicand preprocessing or historical exact-half convention is needed.

a: 5x^2-x-1=0 has D=1+20=21.
x=(1 +/- sqrt(21))/10.
Insert the READ cell: (1+4.583)/10=0.5583 and
(1-4.583)/10=-0.3583. To 0.01: { -0.36, 0.56 }.

b: 2x^2+7x+4=0 has D=49-32=17.
x=(-7 +/- sqrt(17))/4.
Table arithmetic: (-7+4.123)/4=-0.71925 and
(-7-4.123)/4=-2.78075. To 0.01: { -2.78, -0.72 }.

c: 3(y^2-2)-y=0 becomes 3y^2-y-6=0, D=1+72=73.
y=(1 +/- sqrt(73))/6.
Table arithmetic: 9.544/6=1.590666... and -7.544/6=-1.257333....
To 0.01: { -1.26, 1.59 }.

d: y^2+8(y-1)=3 becomes y^2+8y-11=0, D=64+44=108.
sqrt(108)=2sqrt(27) exactly, so y=-4 +/- sqrt(27).
READ table substitution: -4+5.196=1.196, -4-5.196=-9.196.
To 0.01: { -9.20, 1.20 }.
This conversion fits the actual 1--99 appendix; do not invent a cell for 108.

Printed precision is three decimal places, not a separately printed universal
error theorem or tie rule. Rounding stability can be established independently
with exact rational arithmetic: square the endpoints r-0.0005 and r+0.0005.
For each positive read r these squares bracket the integer radicand:

| N | Lower endpoint squared | Upper endpoint squared |
| --- | --- | --- |
| 21 | 4.5825^2=20.99930625 | 4.5835^2=21.00847225 |
| 17 | 4.1225^2=16.99500625 | 4.1235^2=17.00325225 |
| 73 | 8.5435^2=72.99139225 | 8.5445^2=73.00848025 |
| 27 | 5.1955^2=26.99322025 | 5.1965^2=27.00361225 |

Since squaring is increasing for positive numbers, true square roots lie inside
these bounds. After the stated affine operations, the true roots lie in:
a: (0.55825,0.55835), (-0.35835,-0.35825);
b: (-0.719375,-0.719125), (-2.780875,-2.780625);
c: (1.5905833...,1.59075), (-1.2574166...,-1.25725);
d: (1.1955,1.1965), (-9.1965,-9.1955).
Every interval lies strictly inside the appropriate hundredth-rounding bin.
This checks stability of the ACTUAL table route; it does not replace table lookup
with a computed square root. No interval reaches a half-hundredth boundary.
Remaining obligation: separate source-only table-fidelity check of the original
page/cells, and later independent question review. No literal cell/address gap
was observed by this author.

## 863: Decimal And Fraction Coefficients

a: multiply by10: 7x^2-13x-20=0.
D=169+560=729=27^2; x=(13 +/- 27)/14 gives {-1,20/7}.
b: multiply by5 and rearrange: y^2+2y-35=0.
D=4+140=144; y=(-2 +/- 12)/2 gives {-7,5}.
c: multiply by25: 25x^2-40x-9=0.
D=1600+900=2500; x=(40 +/- 50)/50 gives {-1/5,9/5}.
d: z^2-2z+2.91=0, D=4-11.64=-7.64<0, no real root.
e: multiply by5: y^2-50y+625=0; D=2500-2500=0; {25}.
f: multiply by3: x^2+6x-27=0; D=36+108=144; {-9,3}.
Scaling by these nonzero constants preserves the complete solution sets.

## 864: Existence With Complete Witness Sets

a: 9a^2-3a-0.24=0. Multiplying by25/3 gives 75a^2-25a-2=0.
D=625+600=1225=35^2. a=(25 +/- 35)/150.
There ARE real values; all of them are {-1/15,2/5}.
b: 0.16a^2-0.4a+0.24=0. Multiply by25/2:
2a^2-5a+3=0. D=25-24=1; a=(5 +/- 1)/4.
There ARE real values; all of them are {1,3/2}.
Existence alone is asked, but retaining witnesses strengthens a checkable judgment.

## 865: Two Methods, Neither May Be Dropped

a: a=12,b=7,c=0, D=49.
Formula: x=(-7 +/- 7)/24, so {0,-7/12}.
Factorization: x(12x+7)=0, hence x=0 or x=-7/12.
Dividing by x before separating x=0 loses a root.
b: a=1,b=0,c=-25, D=100.
Formula: x=(0 +/- 10)/2 gives {-5,5}.
Factorization: (x-5)(x+5)=0 gives the same complete set.
The positive square root alone is insufficient.

## 866: Complete Sets For NO Real Roots

a: D=4-12t<0 exactly when t>1/3.
b: D=324-20t<0 exactly when t>81/5.
c: D=t^2-16<0 exactly when -4<t<4.
d: D=t^2+960>0 for every real t; requested set is empty.
Strict inequalities exclude zero-discriminant endpoints.

## 867: Complete Sets For TWO Distinct Real Roots

a: D=1600-40v>0 exactly when v<40.
b: D=v^2-144>0 exactly when v<-12 or v>12.
c: when v != 0, D=36-4v>0 exactly when v<9.
But v=0 gives -6x+1=0, ONE root 1/6, not a quadratic.
Complete set: (-infinity,0) union (0,9).
d: D=v^2+700>0, leading coefficient 7 never vanishes.
Complete set: all real v.

## 868: Complete Sets For EXACTLY ONE Real Root

a: k^2-576=0, so k in {-24,24}.
Root=-k/32, respectively 3/4 and -3/4.
b: D=8100-60k=0, so k=135; root=90/30=3.
c: for k != 0, D=10000-4k^2=0 gives k=-50 or50;
root=100/(2k)=50/k, respectively -1 or1.
For k=0, the equation is -100x=0, with exactly ONE root0.
Complete set: {-50,0,50}. The source asks about the equations, so the
degenerate linear equation must be included rather than silently excluded.
d: D=k^2-200=0, k in {-10sqrt(2),10sqrt(2)}.
Root=-k/50; respectively sqrt(2)/5 and -sqrt(2)/5.

## 869: Required Completing-Square Proofs

a: a^2+12a+40 = (a+6)^2+4. The square is >=0 for every
real a, so the expression is >=4>0. Minimum4 occurs at a=-6.
b: a^2-6a+13 = (a-3)^2+4 >=4. Equality occurs at a=3.
The source's second claim is non-strict; equality must not be excluded.

## 870: Coordinates, Primes, Direction, Mapping Proof And Range

a: f(x)=x-3. Unprimed point coordinates are INPUTS; primed are OUTPUTS.
C(-8) -> C'(-11), D(6.5) -> D'(3.5), E(7) -> E'(4).
F'(0) has preimage F(3), since x-3=0.
For each real x, x-3 is a unique real output: a mapping R->R.
For any real output y, input y+3 maps to it, so its range is all R.

b: g(x)=2x.
B(5.5) -> B'(11), C(-8.25) -> C'(-16.5).
D'(10) has preimage D(5), E'(-15) has preimage E(-7.5).
For each real x there is a unique real2x; every real y has input y/2.
Thus g maps R onto R. Fixed points satisfy 2x=x, so only x=0.

c: h(x)=x^2.
A(1.5) -> A'(2.25), B(-1.5) -> B'(2.25).
C'(-1) has no real preimage because squares are nonnegative.
For each real x there is a unique x^2, so it is a mapping.
Its full image is [0,infinity): every y>=0 has input sqrt(y)
(and -sqrt(y) when y>0). Not injective: the two given inputs share an
output. This does not prevent being a mapping; mapping means unique OUTPUT
for each input, not unique preimage for every output.
No new diagram is necessary to express these complete coordinate relations.

## 871: Simplification, Not Unevaluated Products

a: distribute sqrt(7)/7:
sqrt(147)/7 + sqrt(98)/7 - 2sqrt(245)/7 + sqrt(20)
= sqrt(3)+sqrt(2)-2sqrt(5)+2sqrt(5)
= sqrt(3)+sqrt(2).
b: (sqrt(5)+sqrt(3))(sqrt(5)-sqrt(3)) = 5-3=2.
The remaining product is -sqrt(15)sqrt(5)+sqrt(15)sqrt(3)
= -sqrt(75)+sqrt(45) = -5sqrt(3)+3sqrt(5).
Adding sqrt(75) cancels -5sqrt(3). Final: 2+3sqrt(5).

## 872: Strict Proof With Nonzero Domain

For real a != 0,
(a+1/a)^2-a^2 = a^2+2+1/a^2-a^2 = 2+1/a^2.
Since a^2>0, 1/a^2>0, hence the result is strictly greater than2.
The cross term is2, not2a or zero. Equality cannot occur at any finite
nonzero a; a=0 is undefined and is not an equality case.

## Frozen Response-Unit And Coverage Plan

All 15 originals are selected. The 64 printed letter-level tasks include
additional internal mapping queries/proofs in870 and two methods per865 part.
Do not use64 as a claim that each internal task has been counted individually.

| Source | Planned question IDs | Preserved distinctions |
| --- | --- | --- |
| 858 | q858-abcd, q858-efgh | all8 full (a,b,c,D,count) tuples |
| 859 | q859-ab, q859-cd, q859-ef, q859-gh, q859-ij | all10 formula substitutions and complete sets |
| 860 | q860-ab, q860-cd, q860-ef, q860-gh | all8 rearrangements and complete sets, including repeated roots |
| 861 | q861-ab, q861-cd | all4 expansion/zero-form chains and complete sets |
| 862 | q862-ab, q862-cd | all4 actual same-book table routes and0.01, sqrt108 conversion |
| 863 | q863-ab, q863-cd, q863-ef | all6 nonzero scalings, real existence and complete sets |
| 864 | q864 | both existence claims with all witnesses |
| 865 | q865-a, q865-b | each different incomplete type checked by formula AND factorization |
| 866 | q866-ab, q866-cd | all4 complete no-root parameter sets, strict endpoints and empty set |
| 867 | q867-ab, q867-cd | all4 complete two-root sets, leading-zero exclusion |
| 868 | q868-ad, q868-bc | all4 complete one-root sets, leading-zero inclusion |
| 869 | q869 | both completing-square proofs with equality cases |
| 870 | q870-a, q870-b, q870-c | every coordinate, prime, inverse direction, mapping proof, fixed point and range |
| 871 | q871 | both distributive/cancellation simplifications |
| 872 | q872 | full strict proof with nonzero domain |

Planned total33 meaningful units. Grouping follows a shared operation/judgment,
not one click per printed blank. Two865 units are justified by distinct incomplete
quadratic structures, each comparing BOTH requested methods.
Capacity losses throughout: recognition does not demonstrate independently
writing calculations, constructing derivations or producing proofs.
For862, a visible literal table excerpt enables table-based root evaluation
without a new figure but does not test independent physical table search.
For870, correspondence recognition does not test drawing an arrow diagram
(the source does not explicitly require drawing). No mathematical source
subtask is intentionally removed. Independent source/question review is pending.
