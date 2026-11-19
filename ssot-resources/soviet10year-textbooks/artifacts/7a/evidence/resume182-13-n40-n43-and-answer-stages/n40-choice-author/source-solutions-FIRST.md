# Independent original-source solutions FIRST

This record is written before constructing ANY alternatives. It contains no
candidate options or keys. Full source tasks are solved wherever the allowed
source determines them; unobserved table work is explicitly frozen, not solved
by an invented lookup. Root notation always means the nonnegative real root.
The original source prose remains authoritative in the prepared seed.

## 820: extract maximal square factors

12=4*3; 18=9*2; 50=25*2; 48=16*3; 125=25*5;
108=36*3; 363=121*3; 845=169*5.
Thus a-h respectively:
2sqrt(3), 3sqrt(2), 5sqrt(2), 4sqrt(3), 5sqrt(5),
6sqrt(3), 11sqrt(3), 13sqrt(5).
Every remaining positive integer radicand is square-free.
Distinction: extract the square ROOT of a square factor, not that factor itself.
Natural units: related radical simplifications; not eight separate answer clicks.

## 821: simplify the external coefficient too

a: (1/2)sqrt(24)=(1/2)*2sqrt(6)=sqrt(6).
b: (2/3)sqrt(45)=(2/3)*3sqrt(5)=2sqrt(5).
c: -(1/7)sqrt(147)=-(1/7)*7sqrt(3)=-sqrt(3).
d: -(1/5)sqrt(275)=-(1/5)*5sqrt(11)=-sqrt(11).
e: 20000=10000*2, so 0.1sqrt(20000)=10sqrt(2).
f: 28800=14400*2, so -0.05sqrt(28800)=-6sqrt(2).
Fractions and decimals require multiplication AFTER extraction; a negative
external coefficient stays negative. Natural units: fraction cancellation,
then an independent paired decimal-scale calculation.

## 822: move positive coefficients inside

For k>=0 and u>=0, ksqrt(u)=sqrt(k^2*u).
a: sqrt(49*10)=sqrt(490).
b: sqrt(25*3)=sqrt(75).
c: sqrt(25*6)=sqrt(150).
d: sqrt(100*5)=sqrt(500).
e: sqrt(36*(2/3))=sqrt(24).
f: sqrt(4*(3/2))=sqrt(6).
The source asks for simplified radicands, not re-extraction of these roots.
Distinction: square the OUTSIDE coefficient before multiplying the radicand.
Natural unit: judge coherent paired transformations across integer/fraction data.

## 823: signs and symbolic radicands

a sqrt(45); b -sqrt(50); c sqrt(28); d -sqrt(108).
e sqrt(25*a/5)=sqrt(5a), with the original real domain a>=0.
f -sqrt(144*c/2)=-sqrt(72c), with c>=0.
g sqrt((1/4)*6x)=sqrt(3x/2), with x>=0.
h -sqrt((4/9)*3y)=-sqrt(4y/3), with y>=0.
The domain restrictions for e-h are derived from the seed, not added to narrow
its task. Negatives cannot be swallowed into an arithmetic square root.
Natural units: constant sign preservation and symbolic/fraction coefficient
squaring; no per-expression single-choice fragment.

## 824: compare all ten pairs

Both entries of every pair are positive, so comparison of their squares is valid.
a: 27>12; hence 3sqrt(3)>sqrt(12).
b: 20<45; hence sqrt(20)<3sqrt(5).
c: 12<18; hence 2sqrt(3)<3sqrt(2).
d: 100>80; hence 5sqrt(4)>4sqrt(5).
e: (1/9)*54=6=(1/25)*150; both are sqrt(6).
f: 9*120=1080=4*270; both are 6sqrt(30).
g: 72>(1/4)*162=40.5; equivalently 6sqrt(2)>4.5sqrt(2).
h: 24=(1/9)*216; both are 2sqrt(6).
i: (1/4)*6=3/2<36*(1/2)=18.
j: (4/9)*72=32<49*(2/3)=98/3.
The ordered relation list a-j is >, <, <, >, =, =, >, =, <, <.
Distinction: compare the whole positive quantities, including external factors.
Natural units: basic coefficients, then fractions/decimals and equality cases.

## 825: sort both complete collections

a squares in source order: 27,24,29,32.
Increasing order: 2sqrt(6)<3sqrt(3)<sqrt(29)<4sqrt(2).
b squares in source order: 72,58,63,56.
Increasing order: 2sqrt(14)<sqrt(58)<3sqrt(7)<6sqrt(2).
All are positive. Sorting coefficients or radicands alone cannot settle either
list. These are two independent complete ordering tasks, not eight value slots.

## 826: extract monomial factors with signs

a sqrt(7a^2)=|a|sqrt(7)=a sqrt(7), since a>=0.
b sqrt(10y^2)=|y|sqrt(10)=-y sqrt(10), since y<0.
c 16x^3=(4x)^2*x, x>0: 4x sqrt(x).
d 0.01b^5=(0.1b^2)^2*b, b>=0: 0.1b^2 sqrt(b).
e 50a^7=(5a^3)^2*(2a), a>0: 5a^3 sqrt(2a).
f 27c^6=(3c^3)^2*3, c<0: |3c^3|sqrt(3)=-3c^3 sqrt(3).
At a=0 or b=0 the permitted endpoint still satisfies its identity.
Distinctions: absolute value for even powers; square extraction leaves one
factor for odd powers. Natural units: sign-sensitive identities and odd powers.

## 827: determine both full equality-satisfying sets

a: sqrt(3x^2)=|x|sqrt(3). Equality requires x=|x|, i.e. x>=0.
Intersecting with {2,3,-5,-10} gives exactly {2,3}.
b: -sqrt(5c^2)=-|c|sqrt(5). Equality requires c=-|c|, i.e. c<=0.
Intersecting with {-3,1,4,10,-10} gives exactly {-3,-10}.
Zero is not offered in either original set. Natural unit: the two complete
sets together, revealing opposite sign branches rather than per-number clicks.

## 828: move monomials inside, first derive implicit domains

a>=0: a sqrt(3)=sqrt(3a^2).
a<0: a sqrt(3)=-sqrt(3a^2).
c: x sqrt(2/x) requires x!=0 and 2/x>=0, hence x>0.
Its rewrite is sqrt(x^2*2/x)=sqrt(2x).
d: x sqrt(-2/x) requires x!=0 and -2/x>=0, hence x<0.
Its rewrite is -sqrt(x^2*(-2/x))=-sqrt(-2x).
Zero is excluded in c,d despite the final roots admitting it in isolation.
Natural unit: sign-branch and original-domain preservation as a linked task.

## 829: exact method comparison; TWO lookup tasks frozen

The exact expression E=6sqrt(1/3) has E^2=36/3=12 and E>=0.
Thus E=sqrt(12)=2sqrt(3).
Route 1 replaces 1/3 by 0.3333=3333/10000, a smaller number.
Its pre-table expression F=6sqrt(0.3333)=sqrt(11.9988)<E.
E^2-F^2=0.0012, so E-F=0.0012/(sqrt(12)+sqrt(11.9988)).
Both roots exceed 3; therefore 0<E-F<0.0002.
This is an EXACT truncation comparison, not a claim about printed table digits.
Route 2 keeps the radicand 12 exact and avoids the post-lookup multiplication by
6. It is more convenient on those explicit grounds. No observed cell evidence
permits asserting which actual rounded-table answer has the smaller total error.

Deferred source task 829.route1:
Read the actual source-table output for sqrt(0.3333), including normalization
sqrt(0.3333)=0.1sqrt(33.33), the observed base and correction entries, and their
last-place units; then multiply the OBSERVED output by 6.
Deferred source task 829.route2:
Read the actual source-table output for sqrt(12), including any source-specific
row/column and displayed precision, and compare the two OBSERVED route outputs.
The table layout teaching alone does not supply either cell. Calculator
rounding is not an observation of a Bradis cell or its correction arithmetic.
Retained task: exact transformations, pre-rounding truncation direction, and
convenience comparison. Lost: carrying out the two numerical lookups and their
actual rounded-output/error comparison.

## 830: complete exact lookup plans; FOUR lookup tasks frozen

a 4sqrt(5)=sqrt(80).
b 15sqrt(2)=sqrt(450)=10sqrt(4.5).
c 14sqrt(1/7)=sqrt(196/7)=sqrt(28)=2sqrt(7).
d 12sqrt(5/6)=sqrt(144*5/6)=sqrt(120)=10sqrt(1.2).
All planned table arguments 80,4.5,28,1.2 are within [1,100).
The normalization multiplier is 10, not 100, for radicand scaling by 100.

Deferred source tasks 830.a-d:
Observe the relevant actual table entries and precision/corrections for the
four original expressions, whether using their external-factor routes or
these exact normalized routes; perform the indicated multiplications. These
are four distinct unobserved numerical outputs, not a generic lesson HOLD.
Retained task: deriving and recognizing the COMPLETE exact table-ready plan.
Lost: the printed-cell observations, resulting rounded numbers, and numerical
lookup execution. No guessed values or claimed printed-cell keys are recorded.

## 831: solve radius formula and scaling; TWO lookup tasks frozen

For a nondegenerate circle r>0 and S>0 (r=0 if degeneracy is allowed),
S=pi*r^2 implies r=sqrt(S/pi), selecting the nonnegative length.
With the seed approximation pi~=3.14:
a 12.5/3.14=1250/314=625/157; r~=sqrt(625/157) cm.
b 8.24/3.14=824/314=412/157; r~=sqrt(412/157) cm.
The squared-radius quotients lie between 3 and 4, and between 2 and 3,
respectively. Thus the first radius is larger; both numerical arguments are
inside the taught table interval. No decimal root is claimed as a table output.
S' = 4S gives r'=sqrt(4)*r=2r.
S' = S/25 gives r'=sqrt(1/25)*r=r/5.
Area units are cm^2; radius units are cm.

Deferred source tasks 831.a-b:
Follow the actual source-table procedure for each quotient 625/157 and 412/157,
including its quotient/input rounding choice, relevant base/correction cell
observations, and reported approximate radius precision. Those choices and
cells are not supplied by the seed or the accessed teaching.
Retained: complete inverse formula, both exact approximate-data radicands,
correct units, and both area-to-radius scaling deductions.
Lost: numerical radii produced by the actual lookup procedure.

## 832: solve both real domains

a requires (2x-6)/5>=0; since 5>0, x>=3.
Domain: [3,infinity).
b requires x!=1 and (x-2)/(x-1)>=0.
For x<1 both numerator/denominator are negative, hence quotient positive.
For 1<x<2 the signs differ, hence quotient negative.
At x=2 the quotient is 0, permitted.
For x>2 the quotient is positive.
Domain: (-infinity,1) union [2,infinity).
Distinction: radicand zero is allowed; denominator zero never is.
Natural unit: a complete pair of domains, including the sign chart's boundary.

## 833: count integer OUTPUTS, not integer inputs

x belongs to the real interval [0,10]. y=x^2/3 is continuous and increasing
there, with range [0,100/3]. The distinct integer outputs are exactly
0,1,2,...,33: 34 values.
Every k in that set is attained at x=sqrt(3k), which is in [0,10].
34 is not attained because its needed input sqrt(102)>10.
Restricting x to integers would instead produce only the integer outputs
0,3,12,27 (at x=0,3,6,9), but that is NOT the source task.
Distinction: count distinct integer range values over a real interval and include
the zero endpoint. Natural unit: one range-and-cardinality conclusion.

## Whole-source accounting before options

All 14 originals are retained. The full algebraic work for 820-828 and 832-833
is solved above. For 829-831 the exact available tasks are solved and EACH
missing original lookup is frozen with its concrete data dependency.
No source figure or authored figure is needed.
Choice format loses unprompted production of the transformations, sort orders,
sets, domains and range proof; this will be recorded per source in coverage.
This file is author evidence, NOT an independent review or approval.
