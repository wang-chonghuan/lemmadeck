# C6 Supplement: Independent Mathematics Freeze, Phase A

STEMROBIN-184 / 184-6, same ongoing invocation, finish=review.
Scope: 10c / modern-us-neutral / ana10-c6-ex, exercises 335-391.
This is a source-first mathematical sidecar, not an answer-key authoring file,
source-approval receipt, candidate comparison, product gate, or lesson/course PASS.
Authored keys, author reports/manifests, previous solutions, choices, grading
keys, and prior reviews remain unseen. No Phase B has occurred.

## Source and Notation Binding

The modern `exercises.template.json` question text is semantic authority.
`bindings.json` retains all 57 exact modern questions, `source_text`, raw
questions, numbers, source numbers, and group identities, in original order.
The raw file supplies only literal/source/group context, not answers.
All four input hashes matched the delegated hashes; delegated paths/hashes are
not direct-human mathematical or source approval. Raw assembly and adaptation
preparation receipts are inherited, not rerun.

Source `tg`, `ctg`, `arctg`, `arcctg` correspond to modern `tan`, `cot`,
`arctan`, `arccot`. In 346, 347 and 378, source subparts Cyrillic a), b)
map in order to modern 1), 2). Mixed numbers are single numerical factors:
348: 2 2/3 = 8/3; 349: 1 2/3 = 5/3; 378(2): 3 3/7 = 24/7.
Decimals 1.5, -0.6, 0.3, 0.8 and 0.25 retain their given values.
338's low point in `2.3` is UNKNOWN, not assigned a numerical meaning here.
364's retained `\sin^2225^\circ` is normalized mathematically as
`\sin^2(225^\circ)`; no source-glyph approval is asserted.

Exact retained group/request ownership:

| Group | Numbers | Retained command |
| --- | --- | --- |
| g1 | 335-341 | 求下列函数的导函数： |
| g2 | 342-345 | 求极限： |
| g3 | 346-347 | 确定谐振动的振幅、周期和初相： |
| g4 | 348-350 | 利用导数讨论函数并作出它的图象： |
| g5 | 351-356 | 把下列各式写成谐振动方程： |
| g6 | 357-360 | 化简： |
| g7 | 361-362 | 证明恒等式： |
| g8 | 363-369 | 不查表计算： |
| g9 | 370-373 | 验证等式： |
| g10 | 374-378 | 证明恒等式： |
| g11 | 379-381 | 证明恒等式： |
| g12 | 382-387 | 解方程： |
| g13 | 388-391 | 把下列各式写成和的形式： |

The inherited g9 command ownership for 371-373 remains QUALIFIED. Their
retained equalities can be evaluated mathematically; doing so does not approve
the original source command's ownership. Self-contained requests in 350, 377,
378 and 381 are also preserved, not replaced by the group heading.

## Conventions

All angles are radians unless a degree sign is explicit. All variables and
constants are real; a and b in 337 are constants with respect to x.
Every k appearing below is an integer, independently of k in another item.
Inverse trigonometric functions use principal branches:
arcsin: [-pi/2, pi/2], arccos: [0, pi],
arctan: (-pi/2, pi/2), arccot: (0, pi).
The latter is the inverse of decreasing cot on (0, pi).

Harmonic convention throughout: y = A sin(omega x + phi), A > 0,
omega > 0, T = 2pi/omega; phi is reported modulo 2pi, with the
representative in (-pi, pi]. Equivalent cosine forms are intermediate steps,
not competing conventions. A graph request is answered with analytical graph
data and concrete plotting coordinates; no diagram was viewed or rendered.
Restrictions always refer to the original expression's domain, even if its
simplified expression has a removable extension.

## Independent Results

### 335

g1, derivative. For \(y=\sin(5x)\), the chain rule gives
\[
y'=5\cos(5x).
\]
Both the function and derivative have domain R.

### 336

g1, derivative. For \(y=\cos(6x+\pi/2)\),
\[
y'=-6\sin(6x+\pi/2)=-6\cos(6x).
\]
Domain R. The inner argument's derivative is 6, not 1.

### 337

g1, derivative. With \(u=ax+b\), a and b constant,
\[
\frac{d}{dx}\cos^2u=2\cos u(-\sin u)a
=-2a\sin(ax+b)\cos(ax+b)=-a\sin(2ax+2b).
\]
Domain R; this also includes a=0, for which the derivative is zero.

### 338

g1. **HOLD / noanswer.**
Retained text contains the inner low point `2.3`. Its source meaning is
UNKNOWN: decimal-versus-multiplication has not been resolved. The observed
inner minus does not decide the low point. No meaning is selected, no answer
or derivative is derived, and no alternative candidate answers are offered.
This item remains within the 57-item scope but outside the 56 solved items.

### 339

g1, derivative. The product and chain rules give
\[
y'=(2x+1)\sin(3x)+3(x^2+x+1)\cos(3x).
\]
Domain R; the factor 3 multiplies the entire polynomial in the second term.

### 340

g1, derivative.
\[
y'=\cos^2x-\sin^2x=\cos(2x)
\]
by differentiating both factors of \(\sin x\cos x\). Domain R.

### 341

g1, derivative. Source tg/ctg become tan/cot, with no change in arguments.
The original domain requires \(\sin x\ne0\) and \(\cos x\ne0\),
equivalently \(x\ne k\pi/2\).
\[
y'=\sec^2x-\csc^2x\cos x-(1+\cot x)\sin x
=\sec^2x-\frac{\cos x}{\sin^2x}-\sin x-\cos x.
\]
Here \((\cot x)'=-\csc^2x\); the derivative of the final cosine factor
is also included. The simplified derivative retains the original domain.

### 342

g2, limit. Set \(t=\pi/2-x\), so t tends to zero from both sides.
\[
\lim_{x\to\pi/2}\frac{\sin(\pi/2-x)}{\pi/2-x}
=\lim_{t\to0}\frac{\sin t}{t}=1.
\]
The quotient is evaluated on a punctured neighborhood, not at its 0/0 point.

### 343

g2, limit.
\[
\frac{\sin3x}{5x}=\frac35\frac{\sin3x}{3x}\longrightarrow\frac35.
\]
This is the radian small-angle limit on x nonzero near zero.

### 344

g2, limit.
\[
\frac{\sin4x}{\sin7x}
=\frac47\frac{\sin4x/(4x)}{\sin7x/(7x)}
\longrightarrow\frac47.
\]
A sufficiently small punctured neighborhood of zero has no other denominator
zeros.

### 345

g2, limit. Since \(\tan3x=\sin3x/\cos3x\),
\[
\frac{\sin5x}{\tan3x}
=\frac53\frac{\sin5x/(5x)}{\sin3x/(3x)}\cos3x
\longrightarrow\frac53.
\]
Near zero omit x=0 and any points where the original tangent or denominator
is undefined or zero; no additional such points occur sufficiently near zero.

### 346

g3, both original subparts, modern 1), 2).

1. \(y=3\sin(2x-\pi/4)\): A=3, omega=2, \(T=\pi\),
   \(\phi=-\pi/4\).
2. Evenness gives \(2\cos(\pi/5-4x)=2\cos(4x-\pi/5)
   =2\sin(4x+3\pi/10)\). Thus A=2, omega=4,
   \(T=\pi/2\), \(\phi=3\pi/10\).

Both domains are R. The positive-frequency requirement is why the second
argument is first reversed using cosine's evenness.

### 347

g3, both original subparts, modern 1), 2).

1. \(-0.6\cos(x/2+0.3\pi)=0.6\sin(x/2-\pi/5)\).
   A=0.6=3/5, omega=1/2, \(T=4\pi\), \(\phi=-\pi/5\).
   Absorbing the negative sign into the phase is essential.
2. With \(u=x+1\),
   \((\sqrt3/2)\sin u+(1/2)\cos u=\sin(u+\pi/6)\).
   A=1, omega=1, \(T=2\pi\), \(\phi=1+\pi/6\).

Both domains are R; the constant 1 in the second argument is retained in
radians, not replaced by a degree or a multiple of pi.

### 348

g4, derivative-based analysis and graph data. Interpret the mixed number
as \(8/3\), so
\[
f(x)=\frac32\cos(8x/3+\pi/9),\qquad f'(x)=-4\sin(8x/3+\pi/9).
\]
Domain R; range [-3/2,3/2]; amplitude 3/2; fundamental period
\(T=3\pi/4\). Set \(h=-\pi/24\), so the phase is \((8/3)(x-h)\).
There is no vertical shift. Sine-convention phase is \(11\pi/18\).

- Strictly decreasing on \((h+3k\pi/4,\ h+3\pi/8+3k\pi/4)\).
- Strictly increasing on \((h+3\pi/8+3k\pi/4,\ h+3\pi/4+3k\pi/4)\).
- Global maxima 3/2 at \(x=-\pi/24+3k\pi/4\).
- Global minima -3/2 at \(x=\pi/3+3k\pi/4\).
- Zeros \(x=7\pi/48+3k\pi/8\).
- y-intercept \(f(0)=(3/2)\cos(\pi/9)\).

One complete period's plotting coordinates, in increasing x order:
\[
(-\pi/24,3/2),\ (7\pi/48,0),\ (\pi/3,-3/2),\
(25\pi/48,0),\ (17\pi/24,3/2).
\]
Repeat horizontally by \(3\pi/4\). The derivative signs supply the
monotonicity and turning points; coordinates specify the actual curve.

### 349

g4, derivative-based analysis and graph data. Interpret the mixed number
as \(5/3\):
\[
g(x)=3\cos(5x/3+\pi/12),\qquad g'(x)=-5\sin(5x/3+\pi/12).
\]
Domain R; range [-3,3]; amplitude 3; fundamental period \(T=6\pi/5\).
Set \(h=-\pi/20\); the phase is \((5/3)(x-h)\).
No vertical shift. Sine-convention phase is \(7\pi/12\).

- Strictly decreasing on \((h+6k\pi/5,\ h+3\pi/5+6k\pi/5)\).
- Strictly increasing on \((h+3\pi/5+6k\pi/5,\ h+6\pi/5+6k\pi/5)\).
- Global maxima 3 at \(x=-\pi/20+6k\pi/5\).
- Global minima -3 at \(x=11\pi/20+6k\pi/5\).
- Zeros \(x=\pi/4+3k\pi/5\).
- y-intercept \(g(0)=3\cos(\pi/12)=3(\sqrt6+\sqrt2)/4\).

One period's plotting coordinates:
\[
(-\pi/20,3),\ (\pi/4,0),\ (11\pi/20,-3),\
(17\pi/20,0),\ (23\pi/20,3).
\]
Repeat horizontally by \(6\pi/5\).

### 350

g4 is retained; the item's explicit request asks whether the function solves
the differential equation. For \(\theta=2x-\pi/4\),
\[
y'=-2\sin\theta,\qquad y''=-4\cos\theta=-4y.
\]
**Yes**, \(y=\cos(2x-\pi/4)\) solves \(y''=-4y\) for every real x.

To preserve the retained group's analysis/graph request as well: domain R,
range [-1,1], amplitude 1, fundamental period pi, sine-convention phase
pi/4. Maxima 1 occur at \(x=\pi/8+k\pi\), minima -1 at
\(x=5\pi/8+k\pi\), and zeros at \(x=3\pi/8+k\pi/2\).
It decreases on \((\pi/8+k\pi,5\pi/8+k\pi)\) and increases on
\((5\pi/8+k\pi,9\pi/8+k\pi)\).
The y-intercept is \(\sqrt2/2\). One period's plotting coordinates:
\[
(\pi/8,1),\ (3\pi/8,0),\ (5\pi/8,-1),\
(7\pi/8,0),\ (9\pi/8,1).
\]
This does not reclassify its source ownership.

### 351

g5, harmonic form. The cosine-difference identity gives
\[
y=2\cos(2x-\pi/4)=2\sin(2x+\pi/4).
\]
Hence A=2, omega=2, \(T=\pi\), \(\phi=\pi/4\); domain R.
Both original products remain accounted for.

### 352

g5, harmonic form. Put \(u=3x+\pi/12\) and
\(\delta=\arctan(3/4)\in(0,\pi/2)\). Then
\(\cos\delta=4/5,\ \sin\delta=3/5\), so
\[
3\cos u+4\sin u=5\sin(u+\delta).
\]
A=5, omega=3, \(T=2\pi/3\),
\(\phi=\pi/12+\arctan(3/4)\); domain R. Expanding the final sine
recovers the exact coefficients 3 and 4.

### 353

g5, harmonic form.
\[
y=\tfrac12(\cos x-\sin x)
=\frac{\sqrt2}{2}\sin(x+3\pi/4).
\]
A=\(\sqrt2/2\), omega=1, \(T=2\pi\), \(\phi=3\pi/4\);
domain R. The sine coefficient is -1/2, not +1/2.

### 354

g5, harmonic form. The retained \(y=3\sin2x\) is already in the stated
convention. A=3, omega=2, \(T=\pi\), \(\phi=0\); domain R.
No rewriting of its source task is needed.

### 355

g5, harmonic form. Using \(2\cos^2x=1+\cos2x\),
\[
4-8\cos^2x=-4\cos2x=4\sin(2x-\pi/2).
\]
A=4, omega=2, \(T=\pi\), \(\phi=-\pi/2\); domain R.
The apparent constant offset cancels exactly, leaving zero mean.

### 356

g5, harmonic form. Coefficients -2 and \(-4\sqrt3\) give
\(A=\sqrt{4+48}=2\sqrt{13}\). Choose
\(\phi=-\pi+\arctan(2\sqrt3)\in(-\pi,-\pi/2)\).
Then \(\cos\phi=-1/\sqrt{13}\) and
\(\sin\phi=-2\sqrt3/\sqrt{13}\), hence
\[
y=2\sqrt{13}\sin(x-\pi+\arctan(2\sqrt3)).
\]
omega=1, \(T=2\pi\); domain R. Expanding gives both original negative
coefficients, so a first-quadrant phase without the pi adjustment is invalid.

### 357

g6, simplify. Original domain: \(\cos\alpha\ne0\), or
\(\alpha\ne\pi/2+k\pi\). On it,
\[
\cos(\pi-\alpha)\cot(\pi/2-\alpha)
=(-\cos\alpha)\tan\alpha=-\sin\alpha.
\]
Although the final sine is defined everywhere, excluded original points stay
excluded.

### 358

g6, simplify. Require \(\cos\alpha\ne0,\ \sin\alpha\ne0,\
\cos\beta\ne0\); equivalently \(\alpha\ne k\pi/2\),
\(\beta\ne\pi/2+k\pi\). The first tangent must exist, and the original
fraction's denominator must also be nonzero.
\[
\frac{\tan\alpha(-\cos\beta)}
{(-\cos\beta)(-\tan\alpha)}=-1.
\]
The cancellation does not admit any excluded values of alpha or beta.

### 359

g6, simplify. Since \(\sin(3\pi/2+x)=-\cos x\) and
\(\sin(\pi+x)=-\sin x\),
\[
\frac{1-\sin^2(3\pi/2+x)}{1-\sin^2(\pi+x)}
=\frac{\sin^2x}{\cos^2x}=\tan^2x.
\]
Original domain: \(x\ne\pi/2+k\pi\).

### 360

g6, simplify. \(\cos(\pi-\alpha)=-\cos\alpha\) and
\(\cos(3\pi/2-\alpha)=-\sin\alpha\), therefore
\[
\frac{\cos^2\alpha}{1+\sin\alpha}
=\frac{(1-\sin\alpha)(1+\sin\alpha)}{1+\sin\alpha}
=1-\sin\alpha.
\]
Original domain: \(\sin\alpha\ne-1\), or
\(\alpha\ne-\pi/2+2k\pi\). Do not fill in those removable points.

### 361

g7, prove identity. Original common domain:
\(x\ne\pi/2+k\pi\), which makes all three tangents/cotangents defined.
\[
\tan(\pi-x)=-\tan x,\quad
\cot(\pi/2+x)=-\tan x,\quad
\tan(2\pi-x)=-\tan x.
\]
The left side is \(\tan x-\tan x-\tan x=-\tan x\), equal to
the right side on precisely that domain.

### 362

g7, prove identity; y is in degrees. Require \(\cos y\ne0\), i.e.
\(y\ne90^\circ+180^\circ k\), for both original cotangents.
Both sides have factors \(\cos y,\ -\cos y,\ -\tan y\):
\[
\sin(90^\circ+y)=\sin(90^\circ-y)=\cos y,
\]
\[
\cos(180^\circ-y)=\sin(270^\circ-y)=-\cos y,
\quad \cot(270^\circ+y)=\cot(90^\circ+y)=-\tan y.
\]
Each side is \(\cos^2y\tan y=\sin y\cos y\) on the original domain.

### 363

g8, evaluate without tables.
\[
10\cot135^\circ\sin210^\circ\cos225^\circ
=10(-1)(-1/2)(-\sqrt2/2)=-\frac{5\sqrt2}{2}.
\]
The three negative factors leave a negative product; cot135 is defined.

### 364

g8, evaluate without tables. Read the retained exponent/argument notation as
\(\sin^2(225^\circ)\); this is a notation normalization, not a new glyph
approval.
\[
2(-\sqrt2/2)^2-(-\sqrt3)(1)=1+\sqrt3,
\]
because \(\cot330^\circ=-\sqrt3\), \(\tan405^\circ=1\).
All original functions at these angles are defined.

### 365

g8, principal inverse-trigonometric values.
\[
\arcsin(\sqrt3/2)+\arcsin(1/2)=\pi/3+\pi/6=\pi/2.
\]
Both values lie in arcsin's [-pi/2,pi/2] branch.

### 366

g8.
\[
\arccos(1/2)+\arccos(\sqrt2/2)=\pi/3+\pi/4=7\pi/12.
\]
Both principal values lie in [0,pi].

### 367

g8.
\[
\arcsin(-1/2)+\arccos(-\sqrt3/2)
=-\pi/6+5\pi/6=2\pi/3.
\]
The negative arcsin and second-quadrant arccos follow their distinct principal
branches.

### 368

g8.
\[
\arctan(-1)+\arctan1=-\pi/4+\pi/4=0.
\]
Both principal values lie in (-pi/2,pi/2).

### 369

g8. Source arctg/arcctg correspond to arctan/arccot.
\[
\arctan\sqrt3+\operatorname{arccot}1
=\pi/3+\pi/4=7\pi/12.
\]
The arccot value pi/4 is on (0,pi), with cot(pi/4)=1.

### 370

g9, verify the retained equality.
\[
\arccos0+\arcsin(\sqrt2/2)=\pi/2+\pi/4=3\pi/4.
\]
The retained right side is \((3/4)\pi\); equality holds under the stated
principal branches.

### 371

g9 **QUALIFIED inherited command ownership**, not newly source-approved.
Mathematical verification of the retained equality:
\[
\arccos(-1)+\arccos1=\pi+0=\pi.
\]
Both endpoint values are within the arccos branch [0,pi].
This verifies only that literal equality, not its source group attribution.

### 372

g9 **QUALIFIED inherited command ownership**, not newly source-approved.
\[
\arcsin(-\sqrt2/2)+\arcsin(\sqrt2/2)=-\pi/4+\pi/4=0.
\]
Both values are in [-pi/2,pi/2]. The literal equality holds; source group
attribution remains qualified.

### 373

g9 **QUALIFIED inherited command ownership**, not newly source-approved.
\[
\arctan(-1)+\operatorname{arccot}1=-\pi/4+\pi/4=0.
\]
These use arctan in (-pi/2,pi/2) and arccot in (0,pi).
The retained equality holds; no new source ownership approval follows.

### 374

g10, prove identity. Write \(c=\cos\alpha,\ s=\sin\alpha\).
The original common domain is \(c+s\ne0\), equivalently
\(\alpha\ne-\pi/4+k\pi\), since \(1+\sin2\alpha=(c+s)^2\).
\[
\frac{\cos2\alpha}{1+\sin2\alpha}
=\frac{(c-s)(c+s)}{(c+s)^2}=\frac{c-s}{c+s}.
\]
Cancellation is valid only on this domain.

### 375

g10, prove identity. Set \(u=\pi/4+\alpha\). Original tangent exists when
\(\alpha\ne\pi/4+k\pi\). Its squared value plus 1 cannot vanish for real
alpha. On this domain,
\[
\frac{\tan^2u-1}{\tan^2u+1}
=\frac{\sin^2u-\cos^2u}{\sin^2u+\cos^2u}
=-\cos2u=-\cos(\pi/2+2\alpha)=\sin2\alpha.
\]

### 376

g10, prove identity. With \(s=\sin\alpha,\ c=\cos\alpha\), numerator
and denominator factor as \(2s(s+c)\) and \(2c(c+s)\).
The original domain requires \(c\ne0,\ c+s\ne0\), namely
\(\alpha\ne\pi/2+k\pi\) and \(\alpha\ne-\pi/4+k\pi\).
\[
\frac{1-\cos2\alpha+\sin2\alpha}{1+\cos2\alpha+\sin2\alpha}
=\frac{2s(s+c)}{2c(c+s)}=\frac{s}{c}=\tan\alpha.
\]
The additional denominator zeros are not erased by cancellation.

### 377

g10 retained; explicit item request asks if the equality holds.
**Yes**:
\[
\sin15^\circ\cos15^\circ=\frac12\sin30^\circ=\frac14.
\]
No domain exclusion is needed for these fixed angles.

### 378

g10 retained; explicit request asks for three half-angle values in each of two
subparts. Source a), b) map to modern 1), 2), without changing the hypotheses.

1. \(\sin\alpha=0.8=4/5,\ 0<\alpha<\pi/2\).
   Thus \(\cos\alpha=3/5\), and \(\alpha/2\) is in the first quadrant.
   \[
   \sin(\alpha/2)=\sqrt{\frac{1-3/5}{2}}=\frac{\sqrt5}{5},\quad
   \cos(\alpha/2)=\sqrt{\frac{1+3/5}{2}}=\frac{2\sqrt5}{5},\quad
   \tan(\alpha/2)=\frac12.
   \]
2. \(\tan\alpha=3\,3/7=24/7,\ 180^\circ<\alpha<270^\circ\).
   The 7-24-25 triangle and third quadrant give
   \(\cos\alpha=-7/25,\ \sin\alpha=-24/25\).
   Now \(90^\circ<\alpha/2<135^\circ\); sine is positive and cosine
   negative, so
   \[
   \sin(\alpha/2)=\sqrt{\frac{1+7/25}{2}}=\frac45,\quad
   \cos(\alpha/2)=-\sqrt{\frac{1-7/25}{2}}=-\frac35,\quad
   \tan(\alpha/2)=-\frac43.
   \]

All six requested values are provided. Neither allowed interval contains a
pole of the requested half-angle tangent.

### 379

g11, prove identity. Set \(c=\cos(\beta/2),\ s=\sin(\beta/2)\).
The common original domain is \(\cos\beta\ne0\), equivalently
\(\beta\ne\pi/2+k\pi\); it also implies \(c+s\ne0\) and \(c-s\ne0\).
\[
\frac{c-s}{c+s}
=\frac{(c-s)^2}{c^2-s^2}
=\frac{1-\sin\beta}{\cos\beta}
=\frac1{\cos\beta}-\tan\beta.
\]
The multiplication by \(c-s\) is justified by the stated domain, and no
extension through a right-side pole is asserted.

### 380

g11, prove identity. Original common domain:
\(\sin\alpha\ne0\), or \(\alpha\ne k\pi\); this ensures both half-angle
sine and cosine are nonzero.
\[
\cot(\alpha/2)-\tan(\alpha/2)
=\frac{\cos^2(\alpha/2)-\sin^2(\alpha/2)}
{\sin(\alpha/2)\cos(\alpha/2)}
=\frac{\cos\alpha}{\tfrac12\sin\alpha}=2\cot\alpha.
\]

### 381

g11 retained; explicit request asks for expressions in the half-angle tangent
and for three numerical values. Given \(\cos\alpha=-1/2\) and
\(\pi<\alpha<3\pi/2\), necessarily \(\alpha=4\pi/3\).
Let \(t=\tan(\alpha/2)\); then \(t=\tan(2\pi/3)=-\sqrt3\).
\[
\sin\alpha=\frac{2t}{1+t^2}=-\frac{\sqrt3}{2},\qquad
\tan\alpha=\frac{2t}{1-t^2}=\sqrt3,\qquad
\cot\alpha=\frac{1-t^2}{2t}=\frac{\sqrt3}{3}.
\]
These formulas use finite t; the tangent formula requires \(t\ne\pm1\),
and the cotangent formula requires \(t\ne0\). The given t satisfies all
restrictions. All three representations and values retain the variable alpha.

### 382

g12, solve over R. Factoring the fourth powers,
\[
\sin^4(x/2)-\cos^4(x/2)
=(\sin^2(x/2)-\cos^2(x/2))\cdot1=-\cos x.
\]
Thus \(\cos x=-1/4\). Complete solution:
\[
x=\pm\arccos(-1/4)+2k\pi,\qquad k\in\mathbb Z.
\]
The arccos value is principal in (pi/2,pi). Original domain R; no poles or
additional exclusions.

### 383

g12, solve over R. Since \(2\sin2x=4\sin x\cos x\),
\[
\cos^2x+4\sin^2x-4\sin x\cos x=(\cos x-2\sin x)^2=0.
\]
Hence \(\cos x=2\sin x\). Points with \(\cos x=0\) do not solve this
equation, so dividing by cosine loses no solutions. Complete solution:
\[
x=\arctan(1/2)+k\pi,\qquad k\in\mathbb Z.
\]
Original domain R and no original poles; the introduced tangent poles
\(x=\pi/2+k\pi\) have explicitly been tested and excluded as non-solutions.

### 384

g12, solve over R; the single factor \(\cos(x/2)\) retains its sign.
Let \(c=\cos(x/2)\). Since \(1+\cos x=2c^2\) and
\(\sin^2(x/2)=1-c^2\), the equation becomes
\[
8c^2=3(1-c^2)c,\qquad
c(3c^2+8c-3)=c(3c-1)(c+3)=0.
\]
The allowable cosine values are 0 and 1/3; c=-3 is impossible.
The complete solution is the union
\[
x=\pi+2k\pi
\quad\text{or}\quad
x=\pm2\arccos(1/3)+4k\pi,\qquad k\in\mathbb Z.
\]
The arccos value is principal in (0,pi/2). Original domain R, no poles.
No division by c was performed, so the first family was not lost.
The second family's period is 4pi, not 2pi: a 2pi shift reverses the
original unsquared half-angle cosine.

### 385

g12, solve over R.
\[
\sin x+\sin3x=2\sin2x\cos x=0.
\]
The two factor families are \(x=k\pi/2\) and \(x=\pi/2+k\pi\);
the latter is contained in the former. Complete solution:
\[
x=k\pi/2,\qquad k\in\mathbb Z.
\]
Original domain R, no poles; no division by either factor is used.

### 386

g12, solve over R.
\[
\cos2x-\cos6x=2\sin4x\sin2x=0.
\]
The factor families are \(x=k\pi/4\) and \(x=k\pi/2\), with the second
contained in the first. Complete solution:
\[
x=k\pi/4,\qquad k\in\mathbb Z.
\]
Original domain R, no poles.

### 387

g12, solve over R. The sine-difference identity gives
\[
\sin(\pi/6+x)-\sin(\pi/6-x)=2\cos(\pi/6)\sin x=\sqrt3\sin x.
\]
Set \(\theta=\arcsin(1/\sqrt3)\in(0,\pi/2)\).
Complete solution:
\[
x=\theta+2k\pi\quad\text{or}\quad
x=\pi-\theta+2k\pi,\qquad k\in\mathbb Z.
\]
Original domain R, no poles.

### 388

g13, product to sum; x and y are retained independent real variables.
Using \(2\sin A\cos B=\sin(A+B)+\sin(A-B)\) with
A=2x+y, B=x+2y,
\[
\sin(2x+y)\cos(x+2y)
=\tfrac12\sin(3x+3y)+\tfrac12\sin(x-y).
\]
Domain all real (x,y); no exclusions.

### 389

g13, product to sum. With A=2alpha-beta, B=2alpha+beta,
\[
\cos(2\alpha-\beta)\cos(2\alpha+\beta)
=\tfrac12\cos(4\alpha)+\tfrac12\cos(2\beta).
\]
The difference argument is -2beta, changed to 2beta by cosine evenness.
Domain all real (alpha,beta); no exclusions.

### 390

g13, product to sum. With A=2x-y, B=x+2y,
\[
\sin(2x-y)\sin(x+2y)
=\tfrac12\cos(x-3y)-\tfrac12\cos(3x+y).
\]
The minus sign belongs to the cosine of the sum. Domain all real (x,y);
no exclusions.

### 391

g13, write as a sum. The full coefficient 4 is retained:
\[
4\cos^2(x/2)\sin^2(x/2)
=(2\sin(x/2)\cos(x/2))^2
=\sin^2x=\tfrac12-\tfrac12\cos2x.
\]
Domain R; no exclusions.

## Freeze Boundary

Coverage is exactly 57 scoped items, 56 independently solved readable items,
and 338 HOLD/noanswer. There are 60 scoped leaf requests, of which 59 are solved,
when each numbered subpart in 346, 347 and 378 is counted separately (378's three requested
values per subpart are all included). No inherited source ambiguity is
resolved by algebra. 371-373 retain qualified group ownership.
This completed Phase A must be consumed before a separate explicit candidate
release can authorize Phase B. Stop here; no candidate comparison or downstream
answer finalization is authorized by this document.
