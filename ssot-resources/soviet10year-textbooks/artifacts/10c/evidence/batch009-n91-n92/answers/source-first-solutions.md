# STEMROBIN-184 n91+n92: Independent Stage A

Date: 2026-11-16. Scope: all 33 unsolved printed tasks 261-293.
Status: source-first solutions, frozen before any candidate comparison.
Ownership: only this review directory; no durable content or code changes.

## Context and source basis

Task authority is the current `page.md` text, not an answer key or modern
candidate. All paths below are relative to
`ssot-resources/soviet10year-textbooks/artifacts/10c/`:

| Source | Physical / printed page | Used for |
| --- | --- | --- |
| `pages/0083/page.md` | 83 / 77 | n91 half-angle tangent formulas and domains |
| `pages/0084/page.md` | 84 / 78 | Tasks 261-265, closing n91 |
| `pages/0085/page.md` | 85 / 79 | n92 heading, addition formulas and sine-cosine product formula |
| `pages/0086/page.md` | 86 / 80 | Cosine-cosine and sine-sine formulas; sum-form instruction and tasks 266-271 |
| `pages/0087/page.md` | 87 / 81 | Tasks 272-293 and the later printed group instructions |

Source SHA-256, taken before writing these solutions:

```text
0083/page.md  08da834a8a94a3c7970da07dcdf8c73f78cfcdd14928a0c89b246d0b4584ff5a
0084/page.md  923be13f28c869d8e2bc73e458d2fdb95398b0909c0ef02241cf73c6d03928ad
0085/page.md  80b09b0a4a7bf658f58ca358d4e6bfab1e27b7396ed779c043b8261279b8d35b
0086/page.md  643c24419062a3623b9bc906d584396a860ab772392dbca4c31027da5774c0f8
0087/page.md  967cb26a5ccd59a5c9562d252425cf80e90a990c444b10d090f5de29783ba7c6
```

Before solution freeze, another worker added `count_exclusions` frontmatter to
0083 and 0086. Both allowed source pages were reread: their formulas, prose and
tasks were unchanged. Updated SHA-256 values are
`0083/page.md = 896948942024e1385b95f2d99a4ffced06ffb711f24a356fe3418dd1a8d1f85e`
and
`0086/page.md = f49300c36da2daba37337053c3b1a00370b65f0d89f86f156071acc6b710fd61`.
0084, 0085 and 0087 retained the hashes above. No source files were changed by
this reviewer.

The source frontmatter labels these page artifacts as source drafts. This review
solves their current task text; it does not certify transcription fidelity or
claim a source-finalize pass. The user has already confirmed the new source
readings 288 = $\sin^2 6x$ and 289 = $\cos^2 4x$; those are also the current text.
Task 262 really gives a condition on $x$ and asks for functions of $\alpha$;
there is no supplied relation between the variables.

Only these five source pages, the session router/project configuration, binding
product/engineering/operations charters, and `ld-s10y-answer` cap2/Gate2 were
read for content and rules. Printed worked examples were seen as exposition,
not counted as tasks or used as answer candidates. No parent derivations,
answer keys, choices, reviewer keys, candidate mathematics, old interactions,
or images were read. Zero task figures are expected and zero images were opened.

Printed groups are preserved: 266-277 ask for sums, 278-283 ask for exact
evaluation without tables, 284-289 ask for power reduction, 290-292 ask for
identity proofs, and 293 asks whether an equality holds. This is mathematical
review evidence, not a formal answer-key file. It does not certify grading or
runtime behavior. The requested later candidate scope is read-only/ungraded;
Stage B has not begun.

## Identities and domains

Write the printed `tg` and `ctg` as $\tan$ and $\cot$.
For finite $t=\tan(\theta/2)$, division of the double-angle formulas by
$\cos^2(\theta/2)$ gives

$$
\sin\theta=\frac{2t}{1+t^2},\qquad
\cos\theta=\frac{1-t^2}{1+t^2}.
$$

Thus $\tan\theta=2t/(1-t^2)$ when $t^2\ne1$, and
$\cot\theta=(1-t^2)/(2t)$ when $t\ne0$. Finiteness of $t$ excludes
$\theta=(2k+1)\pi$; $1+t^2$ is always positive for real $t$.
For $q=\tan\phi$, the same derivation with $\theta=2\phi$ gives
$\sin2\phi=2q/(1+q^2)$ and $\cos2\phi=(1-q^2)/(1+q^2)$.
The given tangent conditions determine the doubled functions without an
additional quadrant assumption.

Adding/subtracting the source addition formulas gives

$$
\begin{aligned}
2\cos u\cos v&=\cos(u+v)+\cos(u-v),\\
2\sin u\sin v&=\cos(u-v)-\cos(u+v),\\
2\sin u\cos v&=\sin(u+v)+\sin(u-v).
\end{aligned}
$$

Also $\cos^2u=(1+\cos2u)/2$, $\sin^2u=(1-\cos2u)/2$,
$\cos(-u)=\cos u$, and $\sin(-u)=-\sin u$.
The identities below hold for all real free angles. Explicit degree marks
and radian fractions follow each printed task; $30'$ means half a degree.

## n91: Given tangents, tasks 261-265

### 261

Source: 0084. Given $\tan(\alpha/2)=3$; find $\sin\alpha$,
$\cos\alpha$, $\tan\alpha$, $\cot\alpha$, in that order.

$$
\sin\alpha=\frac{2\cdot3}{1+9}=\frac35,\quad
\cos\alpha=\frac{1-9}{1+9}=-\frac45,\quad
\tan\alpha=\frac{6}{1-9}=-\frac34,\quad
\cot\alpha=\frac{1-9}{6}=-\frac43.
$$

All four are defined: $t=3$ is finite, nonzero, and $t^2\ne1$.

### 262

Source: 0084. Given $\tan(x/2)=-2$; find $\sin\alpha$,
$\cos\alpha$, $\tan\alpha$, $\cot\alpha$.

The condition constrains only $x$:
$x=2\arctan(-2)+2k\pi$, $k\in\mathbb Z$. It says nothing about $\alpha$.
For any such fixed $x$, $\alpha$ remains an independent arbitrary real angle.
Consequently neither $\sin\alpha$ nor $\cos\alpha$ has a uniquely determined
value, and $\tan\alpha$ or $\cot\alpha$ need not even be defined.
**Insufficient information: none of the four requested values can be uniquely
determined from the printed condition.** Do not replace $x$ by $\alpha$, infer
$x=\alpha$, or supply answers to a corrected problem.

### 263

Source: 0084. Given $\tan\alpha=1/7$; find the four functions of $2\alpha$.
With $q=1/7$,

$$
\sin2\alpha=\frac{2/7}{1+1/49}=\frac7{25},\qquad
\cos2\alpha=\frac{1-1/49}{1+1/49}=\frac{24}{25}.
$$

Taking their quotient and reciprocal gives
$\tan2\alpha=7/24$ and $\cot2\alpha=24/7$.
Both sine and cosine are nonzero, so the requested quotients exist.

### 264

Source: 0084. Given $\tan2\alpha=8$; find $\sin4\alpha$ and $\cos4\alpha$.
Use $q=8$ and $\phi=2\alpha$:

$$
\sin4\alpha=\frac{16}{1+64}=\frac{16}{65},\qquad
\cos4\alpha=\frac{1-64}{1+64}=-\frac{63}{65}.
$$

The given tangent exists, and the denominator is positive.

### 265

Source: 0084. Given $\tan\alpha=3$; find $\sin4\alpha$.
First $\sin2\alpha=6/10=3/5$ and $\cos2\alpha=-8/10=-4/5$.
Then

$$
\sin4\alpha=2\sin2\alpha\cos2\alpha
=2\cdot\frac35\cdot\left(-\frac45\right)=-\frac{24}{25}.
$$

## n92: Write as sums, tasks 266-277

### 266

Source: 0086.

$$
\cos40^\circ\cos50^\circ
=\frac12[\cos90^\circ+\cos(-10^\circ)]
=\frac12(\cos90^\circ+\cos10^\circ)
=\frac12\cos10^\circ.
$$

The displayed sum, with the zero term optionally removed, meets the instruction.

### 267

Source: 0086.

$$
\cos\frac{\pi}{12}\cos\frac{5\pi}{12}
=\frac12\left[\cos\frac{\pi}{2}+\cos\left(-\frac{\pi}{3}\right)\right]
=\frac12\left(\cos\frac{\pi}{2}+\cos\frac{\pi}{3}\right).
$$

This is the requested sum form; its optional exact simplification is $1/4$.

### 268

Source: 0086.

$$
\sin\frac{5\pi}{24}\sin\frac{\pi}{24}
=\frac12\left[\cos\frac{4\pi}{24}-\cos\frac{6\pi}{24}\right]
=\frac12\cos\frac{\pi}{6}-\frac12\cos\frac{\pi}{4}.
$$

Optional evaluation: $(\sqrt3-\sqrt2)/4$; the required answer is the sum form.

### 269

Source: 0086.

$$
\sin110^\circ\sin50^\circ
=\frac12[\cos60^\circ-\cos160^\circ]
=\frac12\cos60^\circ+\frac12\cos20^\circ,
$$

using $\cos160^\circ=-\cos20^\circ$.

### 270

Source: 0086. The two angles have difference $\pi/2$ and sum $2x$:

$$
\sin\left(x+\frac{\pi}{4}\right)\sin\left(x-\frac{\pi}{4}\right)
=\frac12\left(\cos\frac{\pi}{2}-\cos2x\right)
=-\frac12\cos2x.
$$

### 271

Source: 0086. The difference is $\pi/2$ and the sum is $2\alpha+\pi/6$:

$$
\sin\left(\alpha+\frac{\pi}{3}\right)\sin\left(\alpha-\frac{\pi}{6}\right)
=\frac12\left[\cos\frac{\pi}{2}-\cos\left(2\alpha+\frac{\pi}{6}\right)\right]
=-\frac12\cos\left(2\alpha+\frac{\pi}{6}\right).
$$

### 272

Source: 0087; group instruction inherited from 0086.

$$
\cos(x+\beta)\cos(x-\beta)
=\frac12[\cos(2x)+\cos(2\beta)]
=\frac12\cos2x+\frac12\cos2\beta.
$$

### 273

Source: 0087; group instruction inherited from 0086.

$$
\sin(x+\alpha)\sin(x-\alpha)
=\frac12[\cos(2\alpha)-\cos(2x)]
=\frac12\cos2\alpha-\frac12\cos2x.
$$

### 274

Source: 0087; still a sum-form task.
Since $\sin30^\circ=1/2$,

$$
4\sin30^\circ\sin20^\circ\sin10^\circ
=2\sin20^\circ\sin10^\circ
=\cos10^\circ-\cos30^\circ.
$$

### 275

Source: 0087. Since $\cos60^\circ=1/2$,

$$
4\cos60^\circ\cos20^\circ\cos10^\circ
=2\cos20^\circ\cos10^\circ
=\cos30^\circ+\cos10^\circ.
$$

### 276

Source: 0087. Apply sine-sine first, then cosine-cosine:

$$
\begin{aligned}
4\sin25^\circ\cos15^\circ\sin5^\circ
&=2(\cos20^\circ-\cos30^\circ)\cos15^\circ\\
&=(\cos35^\circ+\cos5^\circ)-(\cos45^\circ+\cos15^\circ).
\end{aligned}
$$

Thus the sum is $\cos35^\circ+\cos5^\circ-\cos45^\circ-\cos15^\circ$.

### 277

Source: 0087. Repeatedly apply $2\cos u\cos v=\cos(u+v)+\cos(u-v)$:

$$
\begin{aligned}
8\cos1^\circ\cos2^\circ\cos4^\circ\cos8^\circ
&=4(\cos3^\circ+\cos1^\circ)\cos4^\circ\cos8^\circ\\
&=2(\cos7^\circ+\cos1^\circ+\cos5^\circ+\cos3^\circ)\cos8^\circ\\
&=\cos15^\circ+\cos1^\circ+\cos9^\circ+\cos7^\circ\\
&\quad+\cos13^\circ+\cos3^\circ+\cos11^\circ+\cos5^\circ.
\end{aligned}
$$

In increasing order the required sum is
$\cos1^\circ+\cos3^\circ+\cos5^\circ+\cos7^\circ+
\cos9^\circ+\cos11^\circ+\cos13^\circ+\cos15^\circ$.

## Exact evaluation without tables, tasks 278-283

### 278

Source: 0087. $22^\circ30'+7^\circ30'=30^\circ$ and their difference is
$15^\circ$. Also
$\sin15^\circ=\sin(45^\circ-30^\circ)
=(\sqrt6-\sqrt2)/4$. Hence

$$
2\sin22^\circ30'\cos7^\circ30'
=\sin30^\circ+\sin15^\circ
=\frac{2+\sqrt6-\sqrt2}{4}.
$$

### 279

Source: 0087.

$$
\cos45^\circ\cos15^\circ
=\frac12(\cos60^\circ+\cos30^\circ)
=\frac12\left(\frac12+\frac{\sqrt3}{2}\right)
=\frac{1+\sqrt3}{4}.
$$

### 280

Source: 0087. The difference is $45^\circ$ and the sum is $60^\circ$:

$$
\sin52^\circ30'\sin7^\circ30'
=\frac12(\cos45^\circ-\cos60^\circ)
=\frac12\left(\frac{\sqrt2}{2}-\frac12\right)
=\frac{\sqrt2-1}{4}.
$$

### 281

Source: 0087.

$$
\sin\frac{\pi}{4}\sin\frac{\pi}{12}
=\frac12\left(\cos\frac{\pi}{6}-\cos\frac{\pi}{3}\right)
=\frac12\left(\frac{\sqrt3}{2}-\frac12\right)
=\frac{\sqrt3-1}{4}.
$$

### 282

Source: 0087.

$$
\cos\frac{\pi}{12}\cos\frac{\pi}{4}
=\frac12\left[\cos\frac{\pi}{3}+\cos\left(-\frac{\pi}{6}\right)\right]
=\frac12\left(\frac12+\frac{\sqrt3}{2}\right)
=\frac{1+\sqrt3}{4}.
$$

### 283

Source: 0087; printed starred task. Use $\cos60^\circ=1/2$ and
$\cos110^\circ=-\cos70^\circ$:

$$
\begin{aligned}
8\cos10^\circ\cos50^\circ\cos70^\circ
&=4(\cos60^\circ+\cos40^\circ)\cos70^\circ\\
&=2\cos70^\circ+2(\cos110^\circ+\cos30^\circ)\\
&=2\cos70^\circ-2\cos70^\circ+2\cos30^\circ
=\sqrt3.
\end{aligned}
$$

## Power reduction, tasks 284-289

### 284

Source: 0087. From $\cos2x=2\cos^2x-1$,

$$
2\cos^2x=1+\cos2x.
$$

The remaining trigonometric function is first degree.

### 285

Source: 0087. Apply $\cos2u=1-2\sin^2u$ with $u=2x$:

$$
2\sin^2 2x=1-\cos4x.
$$

### 286

Source: 0087. Reduce both successive squares:

$$
2\cos^2x\cos2x
=(1+\cos2x)\cos2x
=\cos2x+\cos^2 2x
=\frac12+\cos2x+\frac12\cos4x.
$$

### 287

Source: 0087. Since $\sin2x=2\sin x\cos x$,

$$
\cos^2x\sin^2x
=\frac14\sin^2 2x
=\frac14\cdot\frac{1-\cos4x}{2}
=\frac{1-\cos4x}{8}.
$$

### 288

Source: current 0087, confirmed square (not fourth power).
From $\cos2u=1-2\sin^2u$ with $u=6x$,

$$
\sin^2 6x=\frac{1-\cos12x}{2}.
$$

### 289

Source: current 0087, confirmed square (not fourth power).
From $\cos2u=2\cos^2u-1$ with $u=4x$,

$$
\cos^2 4x=\frac{1+\cos8x}{2}.
$$

## Identity proofs, tasks 290-292

### 290

Source: 0087. For every real $x$, transform the left side:

$$
2\sin4x\sin2x+\cos6x
=\cos(4x-2x)-\cos(4x+2x)+\cos6x
=\cos2x-\cos6x+\cos6x
=\cos2x.
$$

This proves the printed identity without division or domain exclusions.

### 291

Source: 0087. For every real $x$,

$$
\begin{aligned}
\sin^3x\cos^2x
&=\sin x\,(\sin^2x\cos^2x)
=\frac18\sin x(1-\cos4x)\\
&=\frac18\sin x-\frac1{16}[\sin(x+4x)+\sin(x-4x)]\\
&=\frac18\sin x-\frac1{16}\sin5x+\frac1{16}\sin3x.
\end{aligned}
$$

The first reduction follows from the double-angle formula as derived in 287;
the last sign follows from $\sin(-3x)=-\sin3x$. This is the printed right side.

### 292

Source: 0087. The printed line break before $-\sin4x$ does not change grouping.
For every real $x$,

$$
\begin{aligned}
\sin5x\cos3x\cos6x
&=\frac12\sin5x[\cos9x+\cos(-3x)]\\
&=\frac12\sin5x(\cos9x+\cos3x)\\
&=\frac14[\sin14x+\sin(-4x)+\sin8x+\sin2x]\\
&=\frac14(\sin14x+\sin2x+\sin8x-\sin4x).
\end{aligned}
$$

This proves the identity, including the factor, all four frequencies, and the
negative sign. No numerical substitutions or extra conditions are needed.

## Equality question, task 293

### 293

Source: 0087. Does
$\sin20^\circ\sin40^\circ\sin60^\circ\sin80^\circ=3/16$ hold?
First derive the three-factor product:

$$
\begin{aligned}
4\sin20^\circ\sin40^\circ\sin80^\circ
&=2(\cos20^\circ-\cos60^\circ)\sin80^\circ\\
&=2\sin80^\circ\cos20^\circ-\sin80^\circ\\
&=\sin100^\circ+\sin60^\circ-\sin80^\circ\\
&=\sin60^\circ.
\end{aligned}
$$

Here $\cos60^\circ=1/2$ and
$\sin100^\circ=\sin(180^\circ-80^\circ)=\sin80^\circ$.
Therefore

$$
\sin20^\circ\sin40^\circ\sin60^\circ\sin80^\circ
=\frac14\sin^2 60^\circ
=\frac14\left(\frac{\sqrt3}{2}\right)^2
=\frac3{16}.
$$

**Yes, the equality holds**, by the exact derivation above.

## Freeze boundary

All 33 printed tasks have their own source-linked derivation or, for 262,
an explicit insufficiency conclusion. Four requested quantities in 261/263
and two in 264 are individually answered in source order.
No candidate comparison, source repair, finalization, rendering, browser use,
database access, Git operation, publishing, model-service call, binder/archive
creation, or test execution was performed.
The companion `source-first-solutions.sha256` freezes this file's exact bytes.
Stop here: Stage B requires the parent's explicit authorization and designated
modern prose/templates plus the new 33-task formal answer candidate.
