# STEMROBIN-184 / n91 / Independent Choice Review / Stage 1

Status: source-first solution frozen before any candidate disclosure.
Reviewer: fresh independent choice reviewer n91.
Scope: five unsolved source exercises, 261-265.

## Input Boundary And Snapshot

Only mathematical input read:
`.intentfold/tickets/STEMROBIN-184/tmp/production-choice-n91/seed.json`.

Review rules read:
`.agents/skills/ld-s10y-choice/SKILL.md`,
`.agents/skills/ld-s10y-choice/references/review.md`, and
`.agents/skills/ld-s10y-choice/references/contract.md`.
Repository entry and engineering/workflow rules were read as procedural rules,
not as mathematical evidence.

No author draft, view, notes, answers, derivations, solved examples, or earlier
review was read. The author directory was not enumerated. The seed's trace
paths were not opened. No source outside the seed was used to repair its text.

Seed canonical SHA-256:
`2356f2da49a97f71a47324bbcf806cf403c91c9ee2dd2d453517386f42d3e407`.

Seed file-bytes SHA-256:
`1eceb01ba851136f3261f0c11889711c3c940ae6f6923911628a9430d3566cd1`.

Canonical digest uses the contract's sorted-key, ASCII-escaped, compact JSON
serialization and was obtained with `prepare.py digest` on the seed only.

Seed identity: book `10c`, lesson `ana10-c6-s4-n91`.
Selected definition blocks: 1, 2, 3, 4.
All exercise `figure_ids`, `concept_figure_ids`, and seed `figures` are empty.
Images opened: 0. No figures or screenshots are required for this stage.

## Selected Definitions Copied Verbatim From The Seed

These are the seed's general identities and domain statements. No solved
exercise example has been added to this definition copy.

### Block 1

这里选用函数$f(x)=\operatorname{tg}\frac{x}{2}$，也就是半角的正切，来表示各三角函数的值。
推导从倍角公式开始。

因为$\sin x=2\sin\frac{x}{2}\cos\frac{x}{2}$，$\cos x=\cos^2\frac{x}{2}-\sin^2\frac{x}{2}$，要得到只含$\operatorname{tg}\frac{x}{2}$的式子，可以把右边除以$\sin^2\frac{x}{2}+\cos^2\frac{x}{2}=1$。
于是得到：
$\sin x=\frac{2\sin\frac{x}{2}\cos\frac{x}{2}}{\sin^2\frac{x}{2}+\cos^2\frac{x}{2}}$，
$\cos x=\frac{\cos^2\frac{x}{2}-\sin^2\frac{x}{2}}{\sin^2\frac{x}{2}+\cos^2\frac{x}{2}}$。

再把分子、分母都除以$\cos^2\frac{x}{2}$，得到以下两个公式。
公式(1)：
$\sin x=\frac{2\operatorname{tg}\frac{x}{2}}{1+\operatorname{tg}^2\frac{x}{2}}$。

公式(2)：
$\cos x=\frac{1-\operatorname{tg}^2\frac{x}{2}}{1+\operatorname{tg}^2\frac{x}{2}}$。

### Block 2

使用这些表示式时，原函数和分式都必须有定义。
因此要求$x\ne(2k+1)\pi$，$k\in Z$。

### Block 3

利用正切的倍角公式，还可以用$\operatorname{tg}\frac{x}{2}$表示正切和余切。
公式(3)：
$\operatorname{tg}x=\frac{2\operatorname{tg}\frac{x}{2}}{1-\operatorname{tg}^2\frac{x}{2}}$。

公式(4)：
$\operatorname{ctg}x=\frac{1-\operatorname{tg}^2\frac{x}{2}}{2\operatorname{tg}\frac{x}{2}}$。

### Block 4

这些等式也有定义域限制。
当$x=\frac{\pi}{2}+\pi k\ (k\in Z)$或$x=\pi+2\pi l\ (l\in Z)$时，(3)式失去意义。
当$x=\pi k\ (k\in Z)$时，(4)式失去意义。

## Independent Source Solutions

For a target angle $\theta$, set $t=\operatorname{tg}(\theta/2)$.
The copied definitions give
$\sin\theta=2t/(1+t^2)$ and
$\cos\theta=(1-t^2)/(1+t^2)$.
When $1-t^2\ne0$, $\operatorname{tg}\theta=2t/(1-t^2)$.
When $t\ne0$, $\operatorname{ctg}\theta=(1-t^2)/(2t)$.
A finite given half-angle tangent already ensures that half-angle tangent is
defined; the additional denominators must still be checked.

### 261

Literal seed:

261. 如果$\operatorname{tg}\frac{\alpha}{2}=3$，求$\sin\alpha$，$\cos\alpha$，$\operatorname{tg}\alpha$和$\operatorname{ctg}\alpha$。

Set $\theta=\alpha$, $t=3$. Then $1+t^2=10$, $1-t^2=-8$,
and $2t=6$:

- $\sin\alpha=6/10=3/5$.
- $\cos\alpha=-8/10=-4/5$.
- $\operatorname{tg}\alpha=6/(-8)=-3/4$.
- $\operatorname{ctg}\alpha=-8/6=-4/3$.

All four quantities are defined: neither the computed sine nor cosine is zero.
Checks: $(3/5)^2+(-4/5)^2=1$; sine divided by cosine is $-3/4$;
tangent and cotangent multiply to 1. No quadrant choice or extra sign is needed.
The source task is to recover all four full-angle functions from a half-angle
tangent, including their signs and reciprocal relationship.

### 262

Literal seed:

262. 已知$\operatorname{tg}\frac{x}{2}=-2$，求$\sin\alpha$，$\cos\alpha$，$\operatorname{tg}\alpha$和$\operatorname{ctg}\alpha$。

The condition constrains $x$, but every requested function has argument
$\alpha$. The seed gives no equality or other relationship between those
variables. Consequently none of the four requested values is uniquely
determined.

Concrete counterexample: fix the same
$x=2\arctan(-2)$, which satisfies $\operatorname{tg}(x/2)=-2$.
Both of the following choices of $\alpha$ satisfy every stated condition:

- $\alpha=\pi/4$ gives
  $(\sin\alpha,\cos\alpha,\operatorname{tg}\alpha,\operatorname{ctg}\alpha)
  =(\sqrt2/2,\sqrt2/2,1,1)$.
- $\alpha=\pi/3$ gives
  $(\sin\alpha,\cos\alpha,\operatorname{tg}\alpha,\operatorname{ctg}\alpha)
  =(\sqrt3/2,1/2,\sqrt3,1/\sqrt3)$.

Each requested coordinate differs between these valid assignments, so even
restricting attention to angles where all four functions exist does not give
a unique tuple. The condition also does not guarantee existence of every
requested function: $\alpha=\pi/2$ makes tangent undefined; $\alpha=0$ makes
cotangent undefined.

For distinction only, applying the formulas to the variable actually constrained,
with $\theta=x$ and $t=-2$, yields
$\sin x=-4/5$, $\cos x=-3/5$, $\operatorname{tg}x=4/3$,
and $\operatorname{ctg}x=3/4$.
These are values at $x$, not answers at $\alpha$. They would answer a repaired
statement only if an additional relation such as $\alpha=x$ were supplied.
No such repair is authorized or assumed in this review.

Literal source result: insufficient information to determine the requested
functions of $\alpha$. A numerical full-angle tuple for $\alpha$ is blocked by
the missing variable relationship. This diagnosis is a completed source analysis,
not a silently omitted exercise or a guess about intended wording.

### 263

Literal seed:

263. 如果$\operatorname{tg}\alpha=\frac{1}{7}$，求$\sin2\alpha$，$\cos2\alpha$，$\operatorname{tg}2\alpha$和$\operatorname{ctg}2\alpha$。

Set $\theta=2\alpha$, so the half-angle tangent is
$t=\operatorname{tg}\alpha=1/7$.
Then $1+t^2=50/49$, $1-t^2=48/49$, and $2t=2/7$:

- $\sin2\alpha=(2/7)/(50/49)=7/25$.
- $\cos2\alpha=(48/49)/(50/49)=24/25$.
- $\operatorname{tg}2\alpha=(2/7)/(48/49)=7/24$.
- $\operatorname{ctg}2\alpha=(48/49)/(2/7)=24/7$.

All four quantities exist. Checks: $7^2+24^2=25^2$; the sine/cosine
ratio and reciprocal produce the stated tangent and cotangent.
Although $\alpha$ is only fixed modulo $\pi$, $2\alpha$ is consequently
fixed modulo $2\pi$, so these results have no remaining sign ambiguity.
The task requires recognizing that the given tangent is the half-angle
parameter for the requested double-angle functions.

### 264

Literal seed:

264. 如果$\operatorname{tg}2\alpha=8$，求$\sin4\alpha$和$\cos4\alpha$的值。

Set $\theta=4\alpha$, so $t=\operatorname{tg}2\alpha=8$.
Then $1+t^2=65$ and $1-t^2=-63$:

- $\sin4\alpha=16/65$.
- $\cos4\alpha=-63/65$.

The denominator is nonzero and $16^2+63^2=65^2$.
The cosine is negative despite the positive given tangent; retaining that sign
requires the correct numerator $1-t^2$.
The task is to treat $2\alpha$ as the half-angle of $4\alpha$, not to
substitute the given tangent as a sine or to confuse the target with $2\alpha$.

### 265

Literal seed:

265. 如果$\operatorname{tg}\alpha=3$，求$\sin4\alpha$。

First recover the double-angle functions from $t=\operatorname{tg}\alpha=3$:
$\sin2\alpha=2(3)/(1+3^2)=3/5$ and
$\cos2\alpha=(1-3^2)/(1+3^2)=-4/5$.
Then use the double-angle identity a second time:

$$
\sin4\alpha=2\sin2\alpha\cos2\alpha
=2(3/5)(-4/5)=-24/25.
$$

Independent algebraic check: for $u=\operatorname{tg}\alpha$,
$\sin4\alpha=4u(1-u^2)/(1+u^2)^2$; at $u=3$ this is
$4(3)(-8)/100=-24/25$.
Its magnitude is less than 1 and the negative sign follows from the positive
$\sin2\alpha$ and negative $\cos2\alpha$.
The source's requested value is $\sin4\alpha$, not the intermediate $3/5$.
The task requires two angle-doubling steps or their equivalent combined identity.

## Frozen Conclusions And Handoff Boundary

| Source | Independent literal result |
| --- | --- |
| 261 | $(3/5,-4/5,-3/4,-4/3)$ in the requested sine, cosine, tangent, cotangent order |
| 262 | Not determined: the given concerns $x$, the requests concern unrelated $\alpha$ |
| 263 | $(7/25,24/25,7/24,24/7)$ in the requested order |
| 264 | $(16/65,-63/65)$ in sine, cosine order |
| 265 | $\sin4\alpha=-24/25$ |

All five source tasks have a concrete independent solution or a demonstrated
literal insufficiency. No candidate question, option, key, rationale, coverage
record, or author interpretation has been consulted.

This file is frozen at the reported file hash. It will not be amended after
candidate disclosure. Stage 2 must be a separate record based on Parent's
explicit view-only disclosure. Task fidelity, redundancy, and answer leakage
will be judged before any author key/internal comparison.

No candidate verdict or package approval is asserted at Stage 1. Await Parent.
