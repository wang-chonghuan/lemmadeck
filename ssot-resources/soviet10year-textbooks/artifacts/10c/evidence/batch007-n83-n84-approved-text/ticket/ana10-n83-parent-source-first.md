# n83 Independent Parent Written-Mathematics Freeze

2026-11-16, STEMROBIN-184. Written before any n83 modern draft,
author solution, answer key or choice internals. Inputs are the actual
faithful physical40/41 exheads and all48 closed tasks71-118. Physical40
metadata has been repaired but its affected-only source gate is pending;
this mathematics is provisional input-bound reasoning, not source
approval or lesson completion. No original table/figure was opened here.

Input page JSON hashes:

- physical40:46aab0bb078a5547e709a4aa76936578b2077de376f2fa86a176e4c574c48605
- physical41:a9d4042068c380444408c85dbbdc81f86a3164b90540ceb20f5292c612085e7a

The seven actual shared tasks are: positive angle strictly below45deg
(71-76), acute-angle reduction(77-84), first-quadrant reduction(85-96),
smallest positive angle(97-108), identities(109-112), simplification
(113-116), and evaluation(117-118). These are48 independent exercises,
not48 subparts of a new shared question.

## Complete Reductions71-96

Here tan/cot stand for the source tg/ctg. The first six angles must be
positive and strictly below45deg, not merely acute. For the next groups,
alternative equivalent cofunction forms are possible; the forms below
preserve the requested sign and permitted acute/first-quadrant domain.

| Task | Independent result |
| --- | --- |
|71|sin1deg|
|72|cos19deg|
|73|cot22deg|
|74|tan43deg|
|75|cos41deg48min|
|76|sin0deg11min|
|77|-cos72deg|
|78|sin18deg|
|79|sin64deg48min|
|80|-cos0deg18min|
|81|-tan15deg|
|82|-tan76deg|
|83|-cot9deg|
|84|-cot12deg|
|85|sin(pi/4)|
|86|sin(pi/3)|
|87|-cos(pi/5)|
|88|-cos(pi/10)|
|89|-tan(pi/4)|
|90|-tan(3pi/10)|
|91|-cot(4pi/9)|
|92|-cot(pi/18)|
|93|sin8deg|
|94|-cos80deg|
|95|sin60deg|
|96|-cos45deg|

Complementary degree-minute subtraction uses90deg00min=89deg60min:
75 gives41deg48min and76 gives0deg11min; supplementary subtraction
for79 gives64deg48min and80 gives0deg18min. No decimal-degree
replacement or lost prime is allowed.

## Smallest Positive Angles97-108

Use periodicity, parity, supplementary and cofunction identities among
the four elementary source functions, allowing the necessary overall
minus sign. Merely reducing modulo a full period is insufficient when
the cofunction gives a smaller positive angle.

| Task | Independent least-angle form |
| --- | --- |
|97|cos(pi/12), not the larger sin(5pi/12)|
|98|sin(pi/6), not the larger cos(pi/3)|
|99|-tan(pi/5)|
|100|-tan(pi/6), not the larger -cot(pi/3)|
|101|HOLD: conditional branches below, no unconditional parse|
|102|cos(pi/10)|
|103|-cos39deg, not the larger -sin51deg|
|104|cos25deg|
|105|cot30deg, not the larger tan60deg|
|106|sin20deg|
|107|-cot25deg|
|108|cot18deg, not the larger tan72deg|

101 literally prints sin, then2 adjacent to a stacked1/7, thenpi.
Source review did not resolve its mathematical parsing. If it denotes
the mixed coefficient2+1/7, the result is sin(pi/7). If it denotes the
coefficient product2*(1/7), the result is cos(3pi/14), because2pi/7
is above45deg. These are explicitly conditional computations, not proof
of what the book meant. Do not normalize to15pi/7 or insert a product
mark in the faithful prompt, infer intent from a convenient value, or
claim one unconditional answer. Any future authored recognition item
must disclose its assumptions and record the unresolved original-task
interpretation; an independent gate decides whether its coverage is
adequate. No approval is preassigned here.

## Complete Proofs109-112

109: sin(45deg+a)=cos(90deg-(45deg+a))=cos(45deg-a).
110: cos(45deg+a)=sin(90deg-(45deg+a))=sin(45deg-a).
Both hold for all reala; the actual source variables arealpha.
The prior source review's initialx observation is not a math premise.

111: tan(180deg-a)=-tan a, and
cot(90deg+a)=(-sin a)/(cos a)=-tan a.
The common domain requires cos a nonzero.

112: tan(pi-x)=-tan x, cot(pi/2+x)=-tan x,
and tan(2pi-x)=-tan x. The left sum reduces to-tan x,
matching the right. All four terms have the same necessary
cos x nonzero condition. Retain proof production as a written task;
selecting a correct chain is not completing that production proof.

## Simplifications113-116 And Domains

113: tan(y-pi)=tan y and cot(y-3pi/2)=-tan y,
so2tan y-tan y-(-tan y)=2tan y.
Common domain cos y nonzero.

114: the three terms become-1, +1 and+1, so the result is1.
The second term has an explicit preceding subtraction; dropping it
changes the result. All source terms require sin a andcos a nonzero.
A constant simplified form does not expand the original domain.

115: numerator=(-tan a)(-cos a)(cot a)=cos a.
Denominator=(cos a)(-tan a)(-cot a)=cos a.
Result1 on the original domain sin a*cos a nonzero.
Do not silently evaluate at either zero factor.

116: tan(270deg-a)=cot a, sin130deg=sin50deg,
cos320deg=cos40deg=sin50deg, sin270deg=-1.
Numerator=-cot a*sin(50deg)^2.
Denominator=(-cot a)*cos50deg*(-cos50deg)*1
=cot a*cos(50deg)^2.
Result-tan(50deg)^2, equivalently-cot(40deg)^2.
Both sin a andcos a must be nonzero for the original expression.
The source fixed130/320/270/50/220/360 angles remain unchanged;
none is corrected to force a simpler numerical answer.

## Evaluations117-118

117:10*(-1)*(-sqrt(2)/2)*(sqrt(2)/2)=5.
118:8*(1/2)*(1/2)*sqrt(3)*sqrt(3)=6.
Signs/quadrants and both separate multiplication operations matter.

## Scope

47 task results are definite;101's mathematical reading remains
conditional. All48 tasks and seven shared task instructions are
covered in this freeze, including proof actions, angle constraints,
degree-minutes and original-domain restrictions. No modern text,
answers, choices, code, source formula, figure, validator, DB or Git
operation is authored or approved by this note.
