# n83 Original Written Tasks71-118: Author Source-Solve Freeze

Author: Dalton, STEMROBIN-184. Date: 2026-11-16.
Role: new source-based math/answer author preparation, NOT an independent
review or official answer artifact. n81 is stopped and untouched.
Disposition:48 task units covered,47 determinate derivations and101
conditional only. No single source parse or answer key is chosen for101.

## Original Inputs And Scope

Read the current faithful durable MD and JSON of physical40/41, folios34/35.
The authorized mathematical scope is all71-118 and their seven shared
instructions, ending before lesson84 body. No modern n83 text/template,
answer, old choice, parent math freeze/review, other author solution or
source-review report was read. No original pixels were opened or interpreted;
the source transcription's unresolved101 notation remains unresolved.
The assignment name n83 comes from the parent, not a new index/assembly
decision by this author. Source closure still belongs to the parent after
the separate physical40 metadata review.

Current raw input bindings, workspace
`/Users/yong/.codex/worktrees/a07e/lemmadeck`:

| File under `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/` | Bytes | Actual raw SHA-256 |
| --- | ---: | --- |
|`0040/page.md`|4144|`bdeb75009ff3212f141e2b518063fbdbc13ca0c7731eda035023712fb44b5202`|
|`0040/page.json`|12431|`46aab0bb078a5547e709a4aa76936578b2077de376f2fa86a176e4c574c48605`|
|`0041/page.md`|3481|`8ee796b41f8ea8c661b1ca95cd11582f7e343f069c595f76e1a813ef5576f6e3`|
|`0041/page.json`|6946|`a9d4042068c380444408c85dbbdc81f86a3164b90540ceb20f5292c612085e7a`|

The bounded original instruction/task stream contains55 objects:
7 exhead instructions plus48 ex objects, no missing/duplicated source
number. Its in-memory compact UTF-8 JSON serialization is5941 bytes,
SHA-256 `5829b085d1176251c732f35b2c290946238fbc6ce5d265cc0a5da5410fe51c89`.
Recipe: walk physical40 then41 blocks in original order, with one-based
refs; stop on h3 whose first `lines` entry begins `84.`; select ex and
exhead except the generic `习题` heading; retain ordered keys
`ref,kind,label,lines`; use ensure_ascii=False and separators `(',',':')`.
No serialized input or answer JSON file was written.

Boundary:118 is `p0041#13`; the next block `p0041#14` is
`84. 连续增(减)函数的反函数`, not task84. Physical40 contains38 tasks and
physical41 contributes10. MD/JSON actual task expressions agree.
No printed-row counter, audit, validator or source acceptance was run.
Page metadata names the common PDF hash
`47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`
and page-render hashes
`76cac42c4045ebd6e457fb8cc6f6b2ca71069fb8a5d4381a466154181d9da4e0`
and `93ef6af360bbf1136ec61fd934426ca4485cd6b6d2cb152520b76b3768a6ed8c`.
These are read metadata bindings, not new PDF/PNG byte or pixel checks.

Read-scope exception, preserved honestly: the first41 MD stop expression
did not match the actual84 title, so it also displayed the two following84
paragraphs and folio. The first JSON stop expression looked for `text`
instead of `lines` and displayed the same tail. The corrected structured
selection stops at `p0041#14`. That accidental84 tail is excluded from
the bounded stream and all derivations below; no84 problem, definition or
inverse-function result is authored. No further84 inspection occurred.

## Mathematical Working Definitions

These are the author's elementary working definitions, not fabricated
book quotations. For a real angle theta, sin/cos are the unit-circle
coordinates; `tg(theta)=sin(theta)/cos(theta)` requires cos(theta) nonzero,
and `ctg(theta)=cos(theta)/sin(theta)` requires sin(theta) nonzero.
Degrees and radians are not interchanged silently:180 degrees=pi radians,
and one degree=60 arcminutes. Primes in75/76/79/80 mean angle minutes,
not derivatives. In expressions mixing alpha with degree-marked constants,
alpha is a real degree angle; x/y with pi are real radian angles.

Unit-circle reflection and a quarter-turn give, wherever quotients exist:

```text
sin(-t)=-sin t; cos(-t)=cos t; tg(-t)=-tg t; ctg(-t)=-ctg t.
sin(pi-t)=sin t; cos(pi-t)=-cos t.
tg(pi-t)=-tg t; ctg(pi-t)=-ctg t.
sin(pi/2-t)=cos t; cos(pi/2-t)=sin t.
tg(pi/2-t)=ctg t; ctg(pi/2-t)=tg t.
tg(pi/2+t)=-ctg t; ctg(pi/2+t)=-tg t.
sin/cos period2pi; tg/ctg periodpi.
```

The same identities use90/180/360 degrees in degree expressions. Hence
reference-angle substitutions preserve both magnitude and quadrant sign.
All fixed input functions71-108/117-118 are defined under each specified101
branch. Proof/simplification domains are stated individually below.

For97-108 I give both the least positive periodic representative and
the smaller positive reference angle obtained by reflection/cofunction
identities. The latter is the final small-angle reduction used here.
It means minimum within these ordinary induced-angle transformations
(sin/cos pair, tg/ctg pair), NOT arbitrary inverse-trig constructions or
a claim about the original book's unpublished answer format. If later
authoring requires only a least-positive periodic representative, the
separate column retains it without changing the original mathematics.

## G1:71-76

Original shared instruction `p0040#2`:

> 把下列三角函数值化成小于 $45^{\circ}$ 的正角三角函数值：

Use a complementary angle; every final angle is strictly positive and
strictly less than45 degrees. All six quantities are positive.

| Task / source ref | Original input | Complete reduction and resulting form |
| --- | --- | --- |
|71 /`p0040#3`|$\cos89^{\circ}$|$90^{\circ}-89^{\circ}=1^{\circ}$; $\cos89^{\circ}=\sin1^{\circ}$.|
|72 /`p0040#4`|$\sin71^{\circ}$|$90^{\circ}-71^{\circ}=19^{\circ}$; $\sin71^{\circ}=\cos19^{\circ}$.|
|73 /`p0040#5`|$\operatorname{tg}68^{\circ}$|$90^{\circ}-68^{\circ}=22^{\circ}$; $\operatorname{tg}68^{\circ}=\operatorname{ctg}22^{\circ}$.|
|74 /`p0040#6`|$\operatorname{ctg}47^{\circ}$|$90^{\circ}-47^{\circ}=43^{\circ}$; $\operatorname{ctg}47^{\circ}=\operatorname{tg}43^{\circ}$.|
|75 /`p0040#7`|$\sin48^{\circ}12'$|Borrow minutes: $90^{\circ}0'=89^{\circ}60'$; $89^{\circ}60'-48^{\circ}12'=41^{\circ}48'$; $\sin48^{\circ}12'=\cos41^{\circ}48'$.|
|76 /`p0040#8`|$\cos89^{\circ}49'$|$89^{\circ}60'-89^{\circ}49'=0^{\circ}11'$; $\cos89^{\circ}49'=\sin(0^{\circ}11')$. The answer angle is11 arcminutes, not11 degrees or zero.|

## G2:77-84

Original shared instruction `p0040#9`:

> 利用诱导公式用锐角三角函数值代替下列三角函数值：

Every original angle is in quadrantII. The reference angle is
180 degrees minus that angle; sin is positive, cos/tg/ctg negative.
Each resulting angle is acute, with no unnecessary less-than45 condition.

| Task / source ref | Original input | Complete reduction and resulting form |
| --- | --- | --- |
|77 /`p0040#10`|$\cos108^{\circ}$|$108^{\circ}=180^{\circ}-72^{\circ}$; $\cos108^{\circ}=-\cos72^{\circ}$. Also $-\sin18^{\circ}$ is equivalent.|
|78 /`p0040#11`|$\sin162^{\circ}$|$162^{\circ}=180^{\circ}-18^{\circ}$; $\sin162^{\circ}=\sin18^{\circ}$.|
|79 /`p0040#12`|$\sin115^{\circ}12'$|$180^{\circ}0'=179^{\circ}60'$; $179^{\circ}60'-115^{\circ}12'=64^{\circ}48'$; $\sin115^{\circ}12'=\sin64^{\circ}48'$.|
|80 /`p0040#13`|$\cos179^{\circ}42'$|$179^{\circ}60'-179^{\circ}42'=0^{\circ}18'$; $\cos179^{\circ}42'=-\cos(0^{\circ}18')$. The angle is18 arcminutes.|
|81 /`p0040#14`|$\operatorname{tg}165^{\circ}$|$165^{\circ}=180^{\circ}-15^{\circ}$; $\operatorname{tg}165^{\circ}=-\operatorname{tg}15^{\circ}$.|
|82 /`p0040#15`|$\operatorname{tg}104^{\circ}$|$104^{\circ}=180^{\circ}-76^{\circ}$; $\operatorname{tg}104^{\circ}=-\operatorname{tg}76^{\circ}$, equivalently $-\operatorname{ctg}14^{\circ}$.|
|83 /`p0040#16`|$\operatorname{ctg}171^{\circ}$|$171^{\circ}=180^{\circ}-9^{\circ}$; $\operatorname{ctg}171^{\circ}=-\operatorname{ctg}9^{\circ}$.|
|84 /`p0040#17`|$\operatorname{ctg}168^{\circ}$|$168^{\circ}=180^{\circ}-12^{\circ}$; $\operatorname{ctg}168^{\circ}=-\operatorname{ctg}12^{\circ}$.|

## G3:85-96

Original shared instruction `p0040#18`:

> 把下列三角函数值化成第一象限的角度的三角函数值：

Every original angle is again in quadrantII. In radians the reference
angle is pi minus the original; in degrees it is180 degrees minus it.
Minus signs stay outside the function. First-quadrant angles can exceed45.

| Task / source ref | Original input | Complete reduction and resulting form |
| --- | --- | --- |
|85 /`p0040#19`|$\sin\frac{3}{4}\pi$|$\frac{3\pi}{4}=\pi-\frac{\pi}{4}$; $\sin\frac{3\pi}{4}=\sin\frac{\pi}{4}=\frac{\sqrt2}{2}$.|
|86 /`p0040#20`|$\sin\frac{2}{3}\pi$|$\frac{2\pi}{3}=\pi-\frac{\pi}{3}$; $\sin\frac{2\pi}{3}=\sin\frac{\pi}{3}=\frac{\sqrt3}{2}$.|
|87 /`p0040#21`|$\cos\frac{4}{5}\pi$|$\frac{4\pi}{5}=\pi-\frac{\pi}{5}$; $\cos\frac{4\pi}{5}=-\cos\frac{\pi}{5}$.|
|88 /`p0040#22`|$\cos\frac{9}{10}\pi$|$\frac{9\pi}{10}=\pi-\frac{\pi}{10}$; $\cos\frac{9\pi}{10}=-\cos\frac{\pi}{10}$.|
|89 /`p0040#23`|$\operatorname{tg}\frac{3}{4}\pi$|$\frac{3\pi}{4}=\pi-\frac{\pi}{4}$; $\operatorname{tg}\frac{3\pi}{4}=-\operatorname{tg}\frac{\pi}{4}=-1$.|
|90 /`p0040#24`|$\operatorname{tg}\frac{7}{10}\pi$|$\frac{7\pi}{10}=\pi-\frac{3\pi}{10}$; $\operatorname{tg}\frac{7\pi}{10}=-\operatorname{tg}\frac{3\pi}{10}$.|
|91 /`p0040#25`|$\operatorname{ctg}\frac{5}{9}\pi$|$\frac{5\pi}{9}=\pi-\frac{4\pi}{9}$; $\operatorname{ctg}\frac{5\pi}{9}=-\operatorname{ctg}\frac{4\pi}{9}$.|
|92 /`p0040#26`|$\operatorname{ctg}\frac{17}{18}\pi$|$\frac{17\pi}{18}=\pi-\frac{\pi}{18}$; $\operatorname{ctg}\frac{17\pi}{18}=-\operatorname{ctg}\frac{\pi}{18}$.|
|93 /`p0040#27`|$\sin172^{\circ}$|$172^{\circ}=180^{\circ}-8^{\circ}$; $\sin172^{\circ}=\sin8^{\circ}$.|
|94 /`p0040#28`|$\cos100^{\circ}$|$100^{\circ}=180^{\circ}-80^{\circ}$; $\cos100^{\circ}=-\cos80^{\circ}$.|
|95 /`p0040#29`|$\sin120^{\circ}$|$120^{\circ}=180^{\circ}-60^{\circ}$; $\sin120^{\circ}=\sin60^{\circ}=\frac{\sqrt3}{2}$.|
|96 /`p0040#30`|$\cos135^{\circ}$|$135^{\circ}=180^{\circ}-45^{\circ}$; $\cos135^{\circ}=-\cos45^{\circ}=-\frac{\sqrt2}{2}$.|

## G4:97-108

Original shared instruction `p0040#31`:

> 把下列各式化成最小正角的三角函数值：

Both periodic representatives and further induced small-angle forms are
shown. They are different but equivalent transformations, not different
source inputs. Row101 is not a determinate solution.

| Task / source ref | Original input | Least positive periodic representative | Further induction and final small-angle form |
| --- | --- | --- | --- |
|97 /`p0040#32`|$\sin\frac{29\pi}{12}$|$\frac{29\pi}{12}-2\pi=\frac{5\pi}{12}$|$\sin\frac{5\pi}{12}=\cos(\frac{\pi}{2}-\frac{5\pi}{12})=\cos\frac{\pi}{12}$; final angle15 degrees.|
|98 /`p0040#33`|$\cos(-\frac{7\pi}{3})$|$-\frac{7\pi}{3}+4\pi=\frac{5\pi}{3}$|$\cos\frac{5\pi}{3}=\cos(2\pi-\frac{\pi}{3})=\cos\frac{\pi}{3}=\sin\frac{\pi}{6}=\frac12$; final angle30 degrees.|
|99 /`p0040#34`|$\operatorname{tg}(-\frac{21\pi}{5})$|$-\frac{21\pi}{5}+5\pi=\frac{4\pi}{5}$, using tg periodpi|$\operatorname{tg}\frac{4\pi}{5}=\operatorname{tg}(\pi-\frac{\pi}{5})=-\operatorname{tg}\frac{\pi}{5}$; final angle36 degrees, negative sign.|
|100 /`p0040#35`|$\operatorname{ctg}(-\frac{16\pi}{3})$|$-\frac{16\pi}{3}+6\pi=\frac{2\pi}{3}$, using ctg periodpi|$\operatorname{ctg}\frac{2\pi}{3}=-\operatorname{ctg}\frac{\pi}{3}=-\operatorname{tg}\frac{\pi}{6}=-\frac{\sqrt3}{3}$; final angle30 degrees.|
|101 /`p0040#36`|$\sin2\frac{1}{7}\pi$|UNKNOWN literal adjacency; do not assign one angular input|BranchA gives $\sin\frac{\pi}{7}$; branchB gives $\cos\frac{3\pi}{14}$. Full conditional derivations below.|
|102 /`p0040#37`|$\cos2.1\pi$|$2.1\pi=\frac{21\pi}{10}$; subtract2pi to get $\frac{\pi}{10}$|$\cos2.1\pi=\cos\frac{\pi}{10}$; angle18 degrees. Decimal2.1 is not mixed-number notation.|
|103 /`p0040#38`|$\sin(-3729^{\circ})$|$-3729^{\circ}+11(360^{\circ})=231^{\circ}$|$\sin231^{\circ}=\sin(180^{\circ}+51^{\circ})=-\sin51^{\circ}=-\cos39^{\circ}$.|
|104 /`p0040#39`|$\cos1825^{\circ}$|$1825^{\circ}-5(360^{\circ})=25^{\circ}$|$\cos1825^{\circ}=\cos25^{\circ}$, positive.|
|105 /`p0040#40`|$\operatorname{tg}(-300^{\circ})$|$-300^{\circ}+2(180^{\circ})=60^{\circ}$|$\operatorname{tg}60^{\circ}=\operatorname{ctg}30^{\circ}=\sqrt3$, positive.|
|106 /`p0040#41`|$\sin1600^{\circ}$|$1600^{\circ}-4(360^{\circ})=160^{\circ}$|$\sin160^{\circ}=\sin(180^{\circ}-20^{\circ})=\sin20^{\circ}$, positive.|
|107 /`p0040#42`|$\operatorname{ctg}(-205^{\circ})$|$-205^{\circ}+2(180^{\circ})=155^{\circ}$|$\operatorname{ctg}155^{\circ}=\operatorname{ctg}(180^{\circ}-25^{\circ})=-\operatorname{ctg}25^{\circ}$.|
|108 /`p0040#43`|$\operatorname{tg}3672^{\circ}$|$3672^{\circ}-20(180^{\circ})=72^{\circ}$|$\operatorname{tg}72^{\circ}=\operatorname{ctg}18^{\circ}$, positive.|

### 101: Conditional Only, No Parse Selection

Preserve the actual faithful literal exactly:
`101. $\sin2\frac{1}{7}\pi$.`
The source note says2 follows sin and is adjacent to the stacked1/7 before
pi; mixed-number versus product meaning remains undecided. Neither TeX
adjacency nor a convenient outcome settles the printed semantic input.

**BranchA, IF the angle is the mixed number times pi:**

$$
\theta=\left(2+\frac17\right)\pi=\frac{15\pi}{7}
=2\pi+\frac{\pi}{7},\qquad
\sin\theta=\sin\frac{\pi}{7}.
$$

Here $0<\frac{\pi}{7}<\frac{\pi}{4}$, so pi/7 is already the smaller
positive reference angle within the sin/cos induction pair.

**BranchB, IF the angle is the product inside sin:**

$$
\theta=2\cdot\frac17\cdot\pi=\frac{2\pi}{7},\qquad
\sin\theta=\cos\left(\frac{\pi}{2}-\frac{2\pi}{7}\right)
=\cos\frac{3\pi}{14}.
$$

Here $\frac{\pi}{4}<\frac{2\pi}{7}<\frac{\pi}{2}$ and
$0<\frac{3\pi}{14}<\frac{\pi}{4}$, so3pi/14 is the smaller cofunction
angle. Both branch values are positive. They are genuinely different:
$0<\pi/7<2\pi/7<\pi/2$, and sin is strictly increasing on that interval.
Thus a single key or unconditional final answer would silently choose
source semantics. These branches are conditional reasoning, not source
parse approval, source repair, erratum or an exhaustive typography claim.
No superscript2 or squared-sine input is fabricated from the baseline2.

## G5:109-112, Complete Identity Proofs

Original shared instruction `p0041#1`:

> 证明恒等式：

### 109 / p0041#2

Original:
$\sin(45^{\circ}+\alpha)=\cos(45^{\circ}-\alpha)$.

For every real degree angle alpha, the cofunction identity gives

$$
\sin(45^{\circ}+\alpha)
=\cos\bigl(90^{\circ}-(45^{\circ}+\alpha)\bigr)
=\cos(45^{\circ}-\alpha).
$$

Both sides are defined for all real alpha; no acute-alpha restriction.
The stored alpha and its source ink-wear note are retained; this algebra
does not independently certify a scanned glyph by making an identity work.

### 110 / p0041#3

Original:
$\cos(45^{\circ}+\alpha)=\sin(45^{\circ}-\alpha)$.

For every real degree angle alpha,

$$
\cos(45^{\circ}+\alpha)
=\sin\bigl(90^{\circ}-(45^{\circ}+\alpha)\bigr)
=\sin(45^{\circ}-\alpha).
$$

Both sides are defined for all real alpha.

### 111 / p0041#4

Original:
$\operatorname{tg}(180^{\circ}-\alpha)
=\operatorname{ctg}(90^{\circ}+\alpha)$.

The left denominator is cos(180-alpha)=-cos alpha; the right denominator
is sin(90+alpha)=cos alpha. Thus the exact common domain is
$\cos\alpha\ne0$, equivalently
$\alpha\ne90^{\circ}+180^{\circ}k$, $k\in\mathbb Z$.
On this domain,

$$
\operatorname{tg}(180^{\circ}-\alpha)
=\frac{\sin\alpha}{-\cos\alpha}
=-\operatorname{tg}\alpha,\qquad
\operatorname{ctg}(90^{\circ}+\alpha)
=\frac{-\sin\alpha}{\cos\alpha}
=-\operatorname{tg}\alpha.
$$

Hence both sides agree. There is no extra sin-alpha nonzero condition:
alpha=0 and other integer multiples of180 degrees are allowed.

### 112 / p0041#5

Original:
$\operatorname{tg}x+\operatorname{tg}(\pi-x)
+\operatorname{ctg}(\frac{\pi}{2}+x)
=\operatorname{tg}(2\pi-x)$.

Every tangent denominator equals plus/minus cos x, and the cotangent
denominator sin(pi/2+x)=cos x. The exact common domain is
$\cos x\ne0$, or $x\ne\frac{\pi}{2}+k\pi$, $k\in\mathbb Z$.
All variables remain x, as in the original.

$$
\begin{aligned}
\operatorname{tg}x+\operatorname{tg}(\pi-x)
+\operatorname{ctg}\left(\frac{\pi}{2}+x\right)
&=\operatorname{tg}x-\operatorname{tg}x-\operatorname{tg}x\\
&=-\operatorname{tg}x\\
&=\operatorname{tg}(-x)
=\operatorname{tg}(2\pi-x).
\end{aligned}
$$

In particular x=kpi is allowed; sin x need not be nonzero.

## G6:113-116, Complete Simplifications With Domains

Original shared instruction `p0041#6`:

> 化简：

### 113 / p0041#7

Original:
$2\operatorname{tg}y-\operatorname{tg}(y-\pi)
-\operatorname{ctg}(y-\frac{3\pi}{2})$.

The tangent terms require cos y nonzero. Since
sin(y-3pi/2)=cos y, the cotangent imposes precisely the same requirement:
$y\ne\frac{\pi}{2}+k\pi$, $k\in\mathbb Z$.
Periodicity gives tg(y-pi)=tg y. Directly,

$$
\operatorname{ctg}\left(y-\frac{3\pi}{2}\right)
=\frac{-\sin y}{\cos y}=-\operatorname{tg}y.
$$

Consequently, on the original domain,

$$
2\operatorname{tg}y-\operatorname{tg}y-(-\operatorname{tg}y)
=2\operatorname{tg}y.
$$

Standard result: $2\operatorname{tg}y$ with cos y nonzero.

### 114 / p0041#8

Original:

$$
\frac{\sin(-\alpha)}{\sin(180^{\circ}-\alpha)}
-\frac{\operatorname{tg}(90^{\circ}+\alpha)}{\operatorname{ctg}\alpha}
+\frac{\cos\alpha}{\sin(90^{\circ}+\alpha)}.
$$

The first denominator requires sin alpha nonzero. The middle tangent and
ctg alpha must exist, and ctg alpha is also a divisor, so both sin alpha
and cos alpha must be nonzero. The third denominator is cos alpha.
Exact original domain:
$\sin\alpha\ne0$ AND $\cos\alpha\ne0$, equivalently
$\alpha\ne90^{\circ}k$, $k\in\mathbb Z$.

Put $s=\sin\alpha$, $c=\cos\alpha$, with $sc\ne0$. Then

$$
\sin(-\alpha)=-s,\quad \sin(180^{\circ}-\alpha)=s,\quad
\operatorname{tg}(90^{\circ}+\alpha)=-\frac cs,\quad
\operatorname{ctg}\alpha=\frac cs,\quad
\sin(90^{\circ}+\alpha)=c.
$$

The full expression therefore becomes

$$
\frac{-s}{s}-\frac{-c/s}{c/s}+\frac{c}{c}
=-1-(-1)+1=1.
$$

Standard result:1 only on the original domain. The constant result does
not remove any excluded angle or define the original0/0 expressions.

### 115 / p0041#9

Original:

$$
\frac{\operatorname{tg}(180^{\circ}-\alpha)
\cos(180^{\circ}-\alpha)\operatorname{tg}(90^{\circ}-\alpha)}
{\sin(90^{\circ}+\alpha)\operatorname{ctg}(90^{\circ}+\alpha)
\operatorname{tg}(90^{\circ}+\alpha)}.
$$

tg(180-alpha) and ctg(90+alpha) require cos alpha nonzero;
tg(90-alpha) and tg(90+alpha) require sin alpha nonzero.
With both nonzero, the entire denominator is also nonzero.
Hence the exact original domain is again
$\sin\alpha\cos\alpha\ne0$, or $\alpha\ne90^{\circ}k$.

With $s=\sin\alpha$, $c=\cos\alpha$ and $sc\ne0$, the individual factors are

$$
\operatorname{tg}(180^{\circ}-\alpha)=-s/c,\quad
\cos(180^{\circ}-\alpha)=-c,\quad
\operatorname{tg}(90^{\circ}-\alpha)=c/s,
$$

$$
\sin(90^{\circ}+\alpha)=c,\quad
\operatorname{ctg}(90^{\circ}+\alpha)=-s/c,\quad
\operatorname{tg}(90^{\circ}+\alpha)=-c/s.
$$

Do not shorten the quotient before checking all factors. Its numerator is
$(-s/c)(-c)(c/s)=c$; its denominator is
$c(-s/c)(-c/s)=c\ne0$. Therefore the complete quotient is $c/c=1$.
Standard result:1 with the original excluded angles retained.

### 116 / p0041#10

Original:

$$
\frac{\operatorname{tg}(270^{\circ}-\alpha)\sin130^{\circ}
\cos320^{\circ}\sin270^{\circ}}
{\operatorname{ctg}(180^{\circ}-\alpha)\cos50^{\circ}
\sin220^{\circ}\cos360^{\circ}}.
$$

tg(270-alpha) has denominator -sin alpha, and ctg(180-alpha) has
denominator sin alpha, so sin alpha must be nonzero. Because ctg(180-alpha)
is a factor of the whole quotient's denominator, cos alpha must also be
nonzero. The fixed cos50 and sin220 factors are nonzero.
Exact original domain: $\sin\alpha\cos\alpha\ne0$, or
$\alpha\ne90^{\circ}k$, $k\in\mathbb Z$.

All factors reduce as follows, including both negative fixed factors:

$$
\begin{aligned}
\operatorname{tg}(270^{\circ}-\alpha)
&=\operatorname{tg}(90^{\circ}-\alpha)=\operatorname{ctg}\alpha,\\
\operatorname{ctg}(180^{\circ}-\alpha)&=-\operatorname{ctg}\alpha,\\
\sin130^{\circ}&=\sin50^{\circ}=\cos40^{\circ},\\
\cos320^{\circ}&=\cos40^{\circ},\qquad \sin270^{\circ}=-1,\\
\cos50^{\circ}&=\sin40^{\circ},\qquad
\sin220^{\circ}=-\sin40^{\circ},\qquad \cos360^{\circ}=1.
\end{aligned}
$$

Thus the full numerator is
$-\operatorname{ctg}\alpha\cos^2 40^{\circ}$, and the full denominator is
$+\operatorname{ctg}\alpha\sin^2 40^{\circ}$.
Only now cancel the nonzero ctg alpha:

$$
\frac{-\operatorname{ctg}\alpha\cos^2 40^{\circ}}
{\operatorname{ctg}\alpha\sin^2 40^{\circ}}
=-\frac{\cos^2 40^{\circ}}{\sin^2 40^{\circ}}
=-\operatorname{ctg}^{2}40^{\circ}
=-\operatorname{tg}^{2}50^{\circ}.
$$

Standard result: $-\operatorname{ctg}^{2}40^{\circ}$
(equivalently $-\operatorname{tg}^{2}50^{\circ}$), independent of alpha
only on the original domain. In particular the sign is negative, and
alpha where ctg alpha=0 is NOT allowed even though cancellation would
give a finite constant.

## G7:117-118, Exact Numerical Values

Original shared instruction `p0041#11`:

> 计算：

### 117 / p0041#12

Original:
$10\operatorname{ctg}135^{\circ}\cdot\sin225^{\circ}\cdot\cos315^{\circ}$.

Use the quadrant signs and45-degree reference values:

$$
\operatorname{ctg}135^{\circ}=-\operatorname{ctg}45^{\circ}=-1,\quad
\sin225^{\circ}=-\sin45^{\circ}=-\frac{\sqrt2}{2},\quad
\cos315^{\circ}=\cos45^{\circ}=\frac{\sqrt2}{2}.
$$

All fixed factors are defined. Hence

$$
10(-1)\left(-\frac{\sqrt2}{2}\right)
\left(\frac{\sqrt2}{2}\right)
=10\frac24=5.
$$

Standard value:5.

### 118 / p0041#13

Original:
$8\sin\frac{\pi}{6}\cdot\cos\frac{\pi}{3}
\cdot\operatorname{tg}240^{\circ}\cdot\operatorname{ctg}210^{\circ}$.

Respect the mixed radian/degree notation without conflating their units:

$$
\sin\frac{\pi}{6}=\frac12,\quad
\cos\frac{\pi}{3}=\frac12,\quad
\operatorname{tg}240^{\circ}=\operatorname{tg}60^{\circ}=\sqrt3,\quad
\operatorname{ctg}210^{\circ}=\operatorname{ctg}30^{\circ}=\sqrt3.
$$

The last two are positive in quadrantIII and defined. Therefore

$$
8\cdot\frac12\cdot\frac12\cdot\sqrt3\cdot\sqrt3=6.
$$

Standard value:6.

## Coverage And Handoff Limits

All48 numbered units71-118 have their original input, stable page/block
ref, shared instruction, derivation, and determinate or conditional
result. The group sizes are6,8,12,12,4,4,2, respectively.
There is no dropped task, silent101 exclusion, guessed superscript or
single101 key. Four identities and four simplifications carry exact
original domains; angle minutes and all long-quotient factors are retained.
No book answer value or bookRaw is invented.

For later authoring, equality of values alone does not replace each
group's requested output form: G1 needs positive angle below45; G2 acute;
G3 first quadrant; G4's two explicitly separated reduction conventions
must not be conflated. For109-112 a proof, not just a boolean assertion,
is necessary. For113-116 preserve the original domain even for constant
outputs.101 remains semantic UNKNOWN pending a separately authorized
source/edition decision; these computations give no permission to register
an erratum or select a source parse.

Only this scratch prose file was written with apply_patch. Source MD/JSON,
metadata, text, formal answerJSON, choices, diagrams, tools, indices and
closed n81 evidence are untouched. No prepare/finalize/render, production
validator/counter, Git, DB, network, browser or other-chat action occurred.
No parent independent math report was consulted, and no author result here
is labelled independent PASS. STOP at the immutable author freeze for the
parent's once-only comparison.
