# STEMROBIN-184: independent source-first solutions, Stage A

Status: STAGE_A_FROZEN_AWAITING_STAGE_B_DISCLOSURE.
Candidate status: NOT_DISCLOSED / NOT_READ / NOT_REVIEWED.
Date: 2026-11-17.
Scope: book `10c`, lesson `ana10-c6-s4-n94`, written exercises 310-324 inclusive.
Coverage: all 15 exercises, one equation and one requested unknown per exercise; no
printed subparts. Every branch of each equation is included below.

## Authority and boundary

The sole mathematical input is:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s4-n94/exercises.json`

- Raw input: 5319 bytes, including its final newline.
- Raw input SHA-256:
  `b8d8345bf5afe58d0203e9a2ed649cfc3bc98c120e110ed2328c695ab710eb5b`.
- The exact raw JSON is preserved in the last section of this document.
- Each decoded exercise `text` is also quoted verbatim immediately before its
  solution. Its UTF-8 SHA-256, without an added newline, is in the companion ledger.
- All exercises have source group `习题解方程：`, group ID `g1`, and empty
  `figure_refs` and `figures` arrays.
- No answer keys, book answers, author candidates, choices, other lessons,
  worked lesson examples, scans, or other mathematical evidence were read.
- Future modern-edition wording or templates may alter layout only; the frozen
  formulas, coefficients, signs, fractions, and angle arguments remain unchanged.
- This is a standard display-answer review, not an autograding or choices task.
  There are no `expected`, judge, or grading decisions here.
- No candidate has been approved. Gate 2 was read as guidance, not executed or
  represented as passed. Finalization, publishing, and product verification are
  outside Stage A.
- Model images used: 0. Parent image allocation remains permanently 24/24.

## Interpretation frozen before disclosure

The shared source instruction is "solve the equations." No finite interval for
`x` is supplied. The following are therefore the complete real solution sets,
not solutions restricted to a principal interval. All angles are in radians;
every integer parameter below is arbitrary in \(\mathbb Z\).

The standard source notations `tg` and `ctg` mean tangent and cotangent.
The source mixed numbers \(2\frac12\) and \(2\frac13\) mean \(5/2\) and \(7/3\),
respectively, not products. `cos2x` and `sin2x` mean \(\cos(2x)\) and
\(\sin(2x)\), not squared functions. The explicit squares in other exercises
remain squares.

\(\arctan\) takes values in \((-\pi/2,\pi/2)\), and \(\arcsin\) in
\([-\pi/2,\pi/2]\). Every `+`/`-` branch written with \(\pm\) is included.
Separate families have independently arbitrary integer parameters; a repeated
letter `k` does not couple two different solution families.

No figure-dependent or missing numerical conditions occur in this input. The
absence of an interval must not be repaired by silently adding one. If a later
candidate changes a mathematical given or imposes an interval, it is not an
equivalent layout-only rendering of this frozen source.

## Exercise 310

Exact decoded source text:

```text
310. $1+\cos x+\cos2x=0$。
```

Given: \(1+\cos x+\cos(2x)=0\). Original domain: all real \(x\).

Use \(\cos(2x)=2\cos^2x-1\), and put \(c=\cos x\), where \(-1\leq c\leq1\).
The equation is equivalent to

\[
1+c+(2c^2-1)=0
\iff 2c^2+c=0
\iff c(2c+1)=0.
\]

Thus \(c=0\) or \(c=-1/2\); both satisfy the cosine range restriction.
The first gives \(x=\pi/2+k\pi\). The second gives
\(x=\pm2\pi/3+2k\pi\).

Complete answer:

\[
\boxed{x=\frac{\pi}{2}+k\pi
\quad\text{or}\quad x=\pm\frac{2\pi}{3}+2k\pi,\qquad k\in\mathbb Z.}
\]

Substitution: \(c=0\) gives \(\cos(2x)=-1\), so \(1+0-1=0\).
For \(c=-1/2\), \(\cos(2x)=2(1/4)-1=-1/2\), so
\(1-1/2-1/2=0\). The factorization used no division and lost no branch.

## Exercise 311

Exact decoded source text:

```text
311. $3-\cos^2x-3\sin x=0$。
```

Given: \(3-\cos^2x-3\sin x=0\). Original domain: all real \(x\).

Put \(s=\sin x\), \(-1\leq s\leq1\), and replace \(\cos^2x\) by \(1-s^2\):

\[
3-(1-s^2)-3s=0
\iff s^2-3s+2=0
\iff(s-1)(s-2)=0.
\]

The algebraic root \(s=2\) is outside the sine range and supplies no real angle.
The only admissible root is \(s=1\).

Complete answer:

\[
\boxed{x=\frac{\pi}{2}+2k\pi,\qquad k\in\mathbb Z.}
\]

Substitution: \(\sin x=1\), \(\cos^2x=0\), and \(3-0-3=0\).
The range rejection, rather than an unstated angle interval, removes \(s=2\).

## Exercise 312

Exact decoded source text:

```text
312. $4\sin x=4-\cos^2x$。
```

Given: \(4\sin x=4-\cos^2x\). Original domain: all real \(x\).

Put \(s=\sin x\), \(-1\leq s\leq1\). Then

\[
4s=4-(1-s^2)=3+s^2
\iff s^2-4s+3=0
\iff(s-1)(s-3)=0.
\]

The root \(s=3\) is impossible for a real sine. The admissible root \(s=1\)
gives the following complete answer:

\[
\boxed{x=\frac{\pi}{2}+2k\pi,\qquad k\in\mathbb Z.}
\]

Substitution: the two original sides are \(4\) and \(4-0=4\).
No division or squaring introduced or removed a solution.

## Exercise 313

Exact decoded source text:

```text
313. $\operatorname{tg}x+\operatorname{ctg}x=2\frac{1}{2}$。
```

Given: \(\tan x+\cot x=5/2\).
Original domain: both \(\sin x\ne0\) and \(\cos x\ne0\), equivalently
\(x\ne k\pi/2\) for every integer \(k\).

Put \(t=\tan x\). On this domain \(t\) is finite and nonzero, and
\(\cot x=1/t\). Multiplying by \(2t\) is therefore reversible:

\[
t+\frac1t=\frac52
\iff2t^2-5t+2=0
\iff(2t-1)(t-2)=0.
\]

Both \(t=1/2\) and \(t=2\) are finite and nonzero, so neither violates the
original domain.

Complete answer:

\[
\boxed{x=\arctan\frac12+k\pi
\quad\text{or}\quad x=\arctan2+k\pi,\qquad k\in\mathbb Z.}
\]

Substitution: \(1/2+2=5/2\) for either tangent root. Adding \(k\pi\)
preserves both tangent and cotangent. Values \(x=k\pi/2\) are undefined in the
original equation and cannot be included after clearing denominators.

## Exercise 314

Exact decoded source text:

```text
314. $\cos\frac{x}{2}=1+\cos x$。
```

Given: \(\cos(x/2)=1+\cos x\). Original domain: all real \(x\).

Put \(c=\cos(x/2)\), \(-1\leq c\leq1\). The half-angle identity gives
\(1+\cos x=2\cos^2(x/2)=2c^2\), so

\[
c=2c^2
\iff c(2c-1)=0.
\]

For \(c=0\), \(x/2=\pi/2+k\pi\), hence \(x=\pi+2k\pi\).
For \(c=1/2\), \(x/2=\pm\pi/3+2k\pi\), hence
\(x=\pm2\pi/3+4k\pi\). Both cosine roots are admissible.

Complete answer:

\[
\boxed{x=\pi+2k\pi
\quad\text{or}\quad x=\pm\frac{2\pi}{3}+4k\pi,\qquad k\in\mathbb Z.}
\]

Substitution: for \(c=0\), \(\cos x=-1\) and both sides are \(0\).
For \(c=1/2\), \(\cos x=-1/2\) and both sides are \(1/2\).
The \(c=1/2\) families require \(4\pi\) increments: adding \(2\pi\) changes
\(\cos(x/2)\) to \(-1/2\), which does not solve the equation.
Dividing by \(c\) would lose the entire zero-cosine family.

## Exercise 315

Exact decoded source text:

```text
315. $\operatorname{tg}x-\operatorname{tg}\left(\frac{\pi}{2}-x\right)=1$。
```

Given: \(\tan x-\tan(\pi/2-x)=1\).
Original domain: \(\cos x\ne0\) and \(\cos(\pi/2-x)=\sin x\ne0\);
thus \(x\ne k\pi/2\) for every integer \(k\).

On exactly this domain \(\tan(\pi/2-x)=\cot x=1/\tan x\).
Put \(t=\tan x\), finite and nonzero. Then

\[
t-\frac1t=1
\iff t^2-t-1=0
\iff t=\frac{1+\sqrt5}{2}
\quad\text{or}\quad t=\frac{1-\sqrt5}{2}.
\]

The two roots are nonzero and finite. They have opposite signs; the negative
root must not be discarded merely because its principal angle is negative.

Complete answer:

\[
\boxed{
x=\arctan\left(\frac{1+\sqrt5}{2}\right)+k\pi
\quad\text{or}\quad
x=\arctan\left(\frac{1-\sqrt5}{2}\right)+k\pi,
\qquad k\in\mathbb Z.}
\]

Substitution: for either root \(t^2=t+1\); division by its nonzero value gives
\(t-1/t=1\), the original expression. These families avoid every excluded
\(k\pi/2\). The multiplication by \(t\) was reversible on the original domain.

## Exercise 316

Exact decoded source text:

```text
316. $5\cos x+12\sin x=13$。
```

Given: \(5\cos x+12\sin x=13\). Original domain: all real \(x\).

Since \(5^2+12^2=13^2\), let the acute angle
\(\phi=\arctan(12/5)\). Its cosine and sine are \(5/13\) and \(12/13\).
The addition identity gives

\[
5\cos x+12\sin x
=13(\cos\phi\cos x+\sin\phi\sin x)
=13\cos(x-\phi).
\]

Thus the equation is equivalent to \(\cos(x-\phi)=1\), whose complete
solution is \(x-\phi=2k\pi\).

Complete answer:

\[
\boxed{x=\arctan\frac{12}{5}+2k\pi,\qquad k\in\mathbb Z.}
\]

Substitution: \(\cos x=5/13\), \(\sin x=12/13\), and the left side is
\((25+144)/13=13\).
Although tangent has period \(\pi\), the answer here has increments \(2\pi\):
\(x=\phi+(2k+1)\pi\) gives \(-13\), not \(13\).
Equivalently, the unit vector \((\cos x,\sin x)\) must point in the positive
direction \((5/13,12/13)\); the opposite direction is not a solution.

## Exercise 317

Exact decoded source text:

```text
317. $\sin x-\sin2x=0$。
```

Given: \(\sin x-\sin(2x)=0\). Original domain: all real \(x\).

Use \(\sin(2x)=2\sin x\cos x\) and factor without division:

\[
\sin x-2\sin x\cos x=0
\iff\sin x(1-2\cos x)=0.
\]

Hence \(\sin x=0\), giving \(x=k\pi\), or
\(\cos x=1/2\), giving \(x=\pm\pi/3+2k\pi\).

Complete answer:

\[
\boxed{x=k\pi
\quad\text{or}\quad x=\pm\frac{\pi}{3}+2k\pi,\qquad k\in\mathbb Z.}
\]

Substitution: the first family makes both sine terms zero. In the second,
\(\sin(2x)=2\sin x(1/2)=\sin x\).
Dividing by \(\sin x\) would incorrectly remove the first family.

## Exercise 318

Exact decoded source text:

```text
318. $1-\cos x=2\sin\frac{x}{2}$。
```

Given: \(1-\cos x=2\sin(x/2)\). Original domain: all real \(x\).

Put \(s=\sin(x/2)\), \(-1\leq s\leq1\), and use
\(1-\cos x=2\sin^2(x/2)\). Then

\[
2s^2=2s
\iff2s(s-1)=0.
\]

For \(s=0\), \(x/2=k\pi\), so \(x=2k\pi\).
For \(s=1\), \(x/2=\pi/2+2k\pi\), so \(x=\pi+4k\pi\).
Both roots are allowed.

Complete answer:

\[
\boxed{x=2k\pi
\quad\text{or}\quad x=\pi+4k\pi,\qquad k\in\mathbb Z.}
\]

Substitution: \(s=0\) gives \(\cos x=1\), so both sides are \(0\).
\(s=1\) gives \(\cos x=-1\), so both sides are \(2\).
The alternative odd multiples \(x=3\pi+4k\pi\) give \(s=-1\), with
left side \(2\) and right side \(-2\); they are not solutions.
No division by \(s\) or square-root sign choice is allowed to remove or expand
these branches.

## Exercise 319

Exact decoded source text:

```text
319. $1+\cos x=2\cos\frac{x}{2}$。
```

Given: \(1+\cos x=2\cos(x/2)\). Original domain: all real \(x\).

Put \(c=\cos(x/2)\), \(-1\leq c\leq1\). Then

\[
2c^2=2c
\iff2c(c-1)=0.
\]

For \(c=0\), \(x/2=\pi/2+k\pi\), hence \(x=\pi+2k\pi\).
For \(c=1\), \(x/2=2k\pi\), hence \(x=4k\pi\).

Complete answer:

\[
\boxed{x=\pi+2k\pi
\quad\text{or}\quad x=4k\pi,\qquad k\in\mathbb Z.}
\]

Substitution: \(c=0\) gives \(\cos x=-1\), so both sides are \(0\).
\(c=1\) gives \(\cos x=1\), so both sides are \(2\).
The excluded possibility \(x=2\pi+4k\pi\) gives \(c=-1\), so the left side
is \(2\) and the right side is \(-2\). Replacing the second family by all
\(2k\pi\) would be incorrect. Dividing by \(c\) would lose the first family.

## Exercise 320

Exact decoded source text:

```text
320. $\cos2x=2\frac{1}{3}\sin x$。
```

Given: \(\cos(2x)=(7/3)\sin x\). Original domain: all real \(x\).

Put \(s=\sin x\), \(-1\leq s\leq1\), and use \(\cos(2x)=1-2s^2\):

\[
1-2s^2=\frac73s
\iff6s^2+7s-3=0
\iff(3s-1)(2s+3)=0.
\]

The roots are \(s=1/3\) and \(s=-3/2\). The second is outside the real sine
range. Define \(\alpha=\arcsin(1/3)\), with \(0<\alpha<\pi/2\).
Both real-angle families for the retained sine value are necessary.

Complete answer:

\[
\boxed{x=\alpha+2k\pi
\quad\text{or}\quad x=\pi-\alpha+2k\pi,
\qquad\alpha=\arcsin\frac13,\quad k\in\mathbb Z.}
\]

Substitution: \(\sin x=1/3\) gives
\(\cos(2x)=1-2/9=7/9=(7/3)(1/3)\).
The second-quadrant family cannot be omitted; the value \(-3/2\) is rejected
by the range, not by choosing a principal inverse angle.

## Exercise 321

Exact decoded source text:

```text
321. $\sqrt{3}\sin x-\cos x=0$。
```

Given: \(\sqrt3\sin x-\cos x=0\). Original domain: all real \(x\).

The addition identity yields

\[
2\sin\left(x-\frac{\pi}{6}\right)
=2\left(\frac{\sqrt3}{2}\sin x-\frac12\cos x\right)
=\sqrt3\sin x-\cos x.
\]

Thus \(\sin(x-\pi/6)=0\), so \(x-\pi/6=k\pi\).

Complete answer:

\[
\boxed{x=\frac{\pi}{6}+k\pi,\qquad k\in\mathbb Z.}
\]

Substitution: \(\sin x=(-1)^k/2\), \(\cos x=(-1)^k\sqrt3/2\), and
the two terms cancel.
No division is required. If using \(\tan x=1/\sqrt3\) instead, first note
that \(\cos x=0\) makes the original left side \(\pm\sqrt3\), never zero.

## Exercise 322

Exact decoded source text:

```text
322. $\cos x+\sin x=0$。
```

Given: \(\cos x+\sin x=0\). Original domain: all real \(x\).

Use

\[
\sqrt2\sin\left(x+\frac{\pi}{4}\right)=\sin x+\cos x.
\]

Then \(\sin(x+\pi/4)=0\), giving \(x+\pi/4=k\pi\).

Complete answer:

\[
\boxed{x=-\frac{\pi}{4}+k\pi,\qquad k\in\mathbb Z.}
\]

This is exactly the same set as \(x=3\pi/4+k\pi\), by shifting the integer.
Substitution: \(\cos x=(-1)^k/\sqrt2\) and
\(\sin x=-(-1)^k/\sqrt2\), so their sum is zero.
If dividing by cosine in an alternative derivation, \(\cos x=0\) must first
be checked: its sine is \(\pm1\), so it is not a solution.

## Exercise 323

Exact decoded source text:

```text
323. $\cos^2x-3\sin x\cos x=-1$。
```

Given: \(\cos^2x-3\sin x\cos x=-1\). Original domain: all real \(x\).

Write \(c=\cos x\) and \(s=\sin x\). Moving the right side left and replacing
\(1\) by \(c^2+s^2\) are reversible:

\[
c^2-3sc+1=0
\iff2c^2-3sc+s^2=0
\iff(s-c)(s-2c)=0.
\]

Before interpreting tangent ratios, check \(c=0\): in the original equation
the left side is \(0\), not \(-1\). Thus no solution has \(c=0\).
The first factor gives \(s=c\), hence \(\tan x=1\);
the second gives \(s=2c\), hence \(\tan x=2\).

Complete answer:

\[
\boxed{x=\frac{\pi}{4}+k\pi
\quad\text{or}\quad x=\arctan2+k\pi,\qquad k\in\mathbb Z.}
\]

Substitution for \(\tan x=1\): \(c^2=1/2\) and \(sc=1/2\), so
\(c^2-3sc=1/2-3/2=-1\).
For \(\tan x=2\): \(c^2=1/5\) and \(sc=2/5\), so
\(c^2-3sc=1/5-6/5=-1\).
Both ratios give finite tangent, so the checked exclusion is respected.
The original domain is still all real numbers; excluding \(c=0\) here is
a conclusion about solutions, not a restriction supplied in the question.

## Exercise 324

Exact decoded source text:

```text
324. $3\cos^2x=4\sin x\cos x-\sin^2x$。
```

Given: \(3\cos^2x=4\sin x\cos x-\sin^2x\).
Original domain: all real \(x\).

Write \(c=\cos x\) and \(s=\sin x\), and factor the rearranged equation:

\[
3c^2-4sc+s^2=0
\iff(s-c)(s-3c)=0.
\]

If \(c=0\), then \(s^2=1\), and the original equation would be \(0=-1\).
It is not satisfied. Thus cosine is nonzero at every solution.
The two factors give \(s=c\) or \(s=3c\), hence \(\tan x=1\) or \(3\).

Complete answer:

\[
\boxed{x=\frac{\pi}{4}+k\pi
\quad\text{or}\quad x=\arctan3+k\pi,\qquad k\in\mathbb Z.}
\]

Substitution for \(\tan x=1\): \(c^2=s^2=sc=1/2\), so the original sides
are \(3/2\) and \(4(1/2)-1/2=3/2\).
For \(\tan x=3\): \(c^2=1/10\), \(sc=3/10\), \(s^2=9/10\), so the
sides are \(3/10\) and \(12/10-9/10=3/10\).
Factoring before dividing preserves completeness, and neither resulting
family contains a zero-cosine angle.

## Frozen Stage A conclusion

All 15 source equations have now been independently solved, with original
domains, admissible intermediate roots, complete periodic families, and
substitutions recorded before candidate disclosure. There is no unanswered
printed subpart. No condition or formula has been imported from a worked
example or an answer source.

This freezes an independent mathematical baseline only. It is not a verdict
on an unseen candidate and is not a release, product acceptance, or Gate 2
pass. Stage B requires explicit parent disclosure of the candidate and must
compare against this frozen baseline without silently changing its givens.
Until that disclosure, the candidate verdict is WITHHELD.

## Exact raw input snapshot

The content inside this JSON fence reproduces the complete original input,
including the final LF before the closing fence. JSON double backslashes are
retained as stored; the individual `text` quotations above are decoded strings.

```json
{
  "lesson": "ana10-c6-s4-n94",
  "count": 15,
  "exercises": [
    {
      "number": "310",
      "source_number": "310",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "310. $1+\\cos x+\\cos2x=0$。",
      "lines": [
        "310. $1+\\cos x+\\cos2x=0$。"
      ],
      "pages": [
        "p0095#3"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "311",
      "source_number": "311",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "311. $3-\\cos^2x-3\\sin x=0$。",
      "lines": [
        "311. $3-\\cos^2x-3\\sin x=0$。"
      ],
      "pages": [
        "p0095#4"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "312",
      "source_number": "312",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "312. $4\\sin x=4-\\cos^2x$。",
      "lines": [
        "312. $4\\sin x=4-\\cos^2x$。"
      ],
      "pages": [
        "p0095#5"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "313",
      "source_number": "313",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "313. $\\operatorname{tg}x+\\operatorname{ctg}x=2\\frac{1}{2}$。",
      "lines": [
        "313. $\\operatorname{tg}x+\\operatorname{ctg}x=2\\frac{1}{2}$。"
      ],
      "pages": [
        "p0095#6"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "314",
      "source_number": "314",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "314. $\\cos\\frac{x}{2}=1+\\cos x$。",
      "lines": [
        "314. $\\cos\\frac{x}{2}=1+\\cos x$。"
      ],
      "pages": [
        "p0095#7"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "315",
      "source_number": "315",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "315. $\\operatorname{tg}x-\\operatorname{tg}\\left(\\frac{\\pi}{2}-x\\right)=1$。",
      "lines": [
        "315. $\\operatorname{tg}x-\\operatorname{tg}\\left(\\frac{\\pi}{2}-x\\right)=1$。"
      ],
      "pages": [
        "p0095#8"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "316",
      "source_number": "316",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "316. $5\\cos x+12\\sin x=13$。",
      "lines": [
        "316. $5\\cos x+12\\sin x=13$。"
      ],
      "pages": [
        "p0095#9"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "317",
      "source_number": "317",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "317. $\\sin x-\\sin2x=0$。",
      "lines": [
        "317. $\\sin x-\\sin2x=0$。"
      ],
      "pages": [
        "p0095#10"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "318",
      "source_number": "318",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "318. $1-\\cos x=2\\sin\\frac{x}{2}$。",
      "lines": [
        "318. $1-\\cos x=2\\sin\\frac{x}{2}$。"
      ],
      "pages": [
        "p0095#11"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "319",
      "source_number": "319",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "319. $1+\\cos x=2\\cos\\frac{x}{2}$。",
      "lines": [
        "319. $1+\\cos x=2\\cos\\frac{x}{2}$。"
      ],
      "pages": [
        "p0095#12"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "320",
      "source_number": "320",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "320. $\\cos2x=2\\frac{1}{3}\\sin x$。",
      "lines": [
        "320. $\\cos2x=2\\frac{1}{3}\\sin x$。"
      ],
      "pages": [
        "p0095#13"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "321",
      "source_number": "321",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "321. $\\sqrt{3}\\sin x-\\cos x=0$。",
      "lines": [
        "321. $\\sqrt{3}\\sin x-\\cos x=0$。"
      ],
      "pages": [
        "p0095#14"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "322",
      "source_number": "322",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "322. $\\cos x+\\sin x=0$。",
      "lines": [
        "322. $\\cos x+\\sin x=0$。"
      ],
      "pages": [
        "p0095#15"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "323",
      "source_number": "323",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "323. $\\cos^2x-3\\sin x\\cos x=-1$。",
      "lines": [
        "323. $\\cos^2x-3\\sin x\\cos x=-1$。"
      ],
      "pages": [
        "p0095#16"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "324",
      "source_number": "324",
      "group": "习题解方程：",
      "group_id": "g1",
      "text": "324. $3\\cos^2x=4\\sin x\\cos x-\\sin^2x$。",
      "lines": [
        "324. $3\\cos^2x=4\\sin x\\cos x-\\sin^2x$。"
      ],
      "pages": [
        "p0095#17"
      ],
      "figure_refs": [],
      "figures": []
    }
  ]
}
```
