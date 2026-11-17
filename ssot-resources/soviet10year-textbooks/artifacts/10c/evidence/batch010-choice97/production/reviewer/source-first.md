# n97 Independent Source Mathematics: Stage1

Reviewer: independent choice reviewer n97, STEMROBIN-184, 2026-11-17.
Status: source-only solution frozen before any candidate exposure; WAIT.

## Input Binding

Sole mathematics input: `../seed.json`, book `10c`, lesson `ana10-c7-s1-n97`.
Canonical seed SHA-256: `54cb3765d97f5f74b7dc26cf5ff7cfd2e5c552f9545a0582412e5f28e67cf091`.
Raw seed byte SHA-256: `97df505324fbe5acb9cfb4c8f23f7c20c1580c4b92713bdf75c4fd09e2d15473`.
Only exercises 392-401 and definition blocks 10, 11, 12 were read as mathematical input.
Seed trace paths were not opened. No answers, worked examples, author material,
candidate views, other lessons, old questions, or images were consulted.

Definition references: `/concepts/0/text` (block 10), `/concepts/1/text` (block 11),
`/concepts/2/text` (block 12). Together they require $F'(x)=f(x)$ for every $x$
in the given interval. Checking isolated values is insufficient.

References below are exact seed JSON pointers plus the subpart marker where present.
The source task directions are those explicitly authorized in this invocation:
392-397 prove that the given $F$ is a primitive of the given $f$ on the stated
interval; 398-401 find primitives on $\mathbb R$.

## Independent Solutions: Given-Function Proofs

All roots are real. For the positive-$x$ radical tasks, powers below are used
only on $x>0$. Every displayed derivative equality holds throughout its stated
open interval, and both the given $F$ and $f$ are defined there.

| Task and seed reference | Interval | Independent derivative calculation |
| --- | --- | --- |
| 392.a: `/exercises/0/text`, a | $(0,\infty)$ | $(3x^{1/3})'=3(1/3)x^{-2/3}=1/\sqrt[3]{x^2}=f(x)$. |
| 392.b: `/exercises/0/text`, b | $\mathbb R$ | $(\sin x+3)'=\cos x+0=f(x)$. |
| 393.a: `/exercises/1/text`, a | $(0,\infty)$ | $((3/2)x^{2/3}-5)'=(3/2)(2/3)x^{-1/3}-0=1/\sqrt[3]{x}=f(x)$. |
| 393.b: `/exercises/1/text`, b | $\mathbb R$ | $(4-\cos x)'=0-(-\sin x)=\sin x=f(x)$. |
| 394.a: `/exercises/2/text`, a | $(0,\infty)$ | $((3/4)x^{4/3})'=(3/4)(4/3)x^{1/3}=\sqrt[3]{x}=f(x)$. |
| 394.b: `/exercises/2/text`, b | $(-\pi/2,\pi/2)$ | $(\tan x-\sqrt2)'=1/\cos^2x-0=f(x)$; $\cos x\ne0$ on this interval. |
| 395.a: `/exercises/3/text`, a | $(0,\infty)$ | $((2/3)x^{3/2})'=(2/3)(3/2)x^{1/2}=\sqrt x=f(x)$, using $\sqrt{x^3}=x^{3/2}$. |
| 395.b: `/exercises/3/text`, b | $(0,\pi)$ | $(3-\cot x)'=0-(-1/\sin^2x)=1/\sin^2x=f(x)$; $\sin x\ne0$ there. |
| 396.a: `/exercises/4/text`, a | $(-\infty,0)$ | $(14-x^{-1})'=0-(-x^{-2})=1/x^2=f(x)$, also for negative $x$. |
| 396.b: `/exercises/4/text`, b | $(0,\infty)$ | $(9-x^{-1})'=0-(-x^{-2})=1/x^2=f(x)$. |
| 397.a: `/exercises/5/text`, a | $(0,\infty)$ | $|x|=x$ throughout the interval, so $(|x|)'=1=f(x)$. |
| 397.b: `/exercises/5/text`, b | $(-\infty,0)$ | $|x|=-x$ throughout the interval, so $(|x|)'=-1=f(x)$. |

Thus each of these twelve given functions meets the primitive definition on
its own stated interval. The constants $3,-5,4,-\sqrt2,3,14,9$ contribute zero
derivative; they do not change the derivative signs. Here `tg` means $\tan$
and `ctg` means $\cot$.

Zero is excluded from every positive radical proof interval. In 392.a and
393.a the target has a zero denominator there. In both 396 tasks, $F$ and $f$
are undefined at zero. In 397, $|x|$ is not differentiable at zero: left and
right derivatives are $-1$ and $1$. The trigonometric interval endpoints are
poles and are not admissible. No statement here enlarges a source interval,
even if some individual function admits an extension.

## Independent Solutions: Find Primitives

| Task and seed reference | Complete primitive family on $\mathbb R$ | Derivative verification |
| --- | --- | --- |
| 398: `/exercises/6/text` | $F(x)=x^4/4+C$, $C\in\mathbb R$ | $F'(x)=(4/4)x^3+0=x^3$. |
| 399: `/exercises/7/text` | $F(x)=x^5/5+C$, $C\in\mathbb R$ | $F'(x)=(5/5)x^4+0=x^4$. |
| 400: `/exercises/8/text` | $F(x)=x^2/2+C$, $C\in\mathbb R$ | $F'(x)=(2/2)x+0=x$. |
| 401: `/exercises/9/text` | $F(x)=(5/2)x+C$, $C\in\mathbb R$ | The mixed numeral $2\frac12=2+\frac12=\frac52$ is constant; $F'(x)=5/2$. |

In 401 the mixed numeral is neither $2(1/2)=1$ nor $x^{5/2}$; integrating
this constant requires a linear function, not a power of $x$ or a constant
function. Every family above is defined and differentiable on all of
$\mathbb R$, including zero. Choosing $C=0$ supplies one primitive; the full
family has arbitrary additive $C$. Completeness follows because the difference
of any other primitive and the displayed one has derivative zero on the
connected interval $\mathbb R$ and hence is constant.

## Freeze Boundary

Ten source exercises and all sixteen mathematical tasks are independently
solved above. No source task is deferred. Figures: none; image count: 0.
Candidate task fidelity, redundancy, leakage, option truth sets, author
comparison, package coverage verdicts, and candidate verdicts are not assessed
in Stage1. Preserve this file unchanged. Await explicit views-only Stage2;
internal comparison belongs to Stage3 after the parent consumes Stage2.
