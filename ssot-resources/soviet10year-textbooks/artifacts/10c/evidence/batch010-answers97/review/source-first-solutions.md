# Source-First Solutions: ana10-c7-s1-n97

## Frozen Stage A Boundary

- Ticket: STEMROBIN-184, continuation of the existing invocation.
- Role: INDEPENDENT STANDARD ANSWER REVIEWER.
- Stage: source-first Stage A only, independently solved before candidate disclosure.
- Record date: 2026-11-17, Europe/Dublin.
- Status: FROZEN STAGE A. Candidate verdict WITHHELD. WAIT for explicit Stage B.
- Write ownership: `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97-review/` only.
- Sole mathematical input: `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c7-s1-n97/exercises.json`.
- Input SHA-256: `153f222b103ba5e1b2e09bbb02f950bf70f0dddcc624dbb04ce91c8bd0f3ca5e`.
- Contract read, not executed: current `.claude/skills/ld-s10y-answer/SKILL.md`, cap2, SHA-256 `afc242003e5bc2f3165dfc5bee60e2e684ed85e2627c7d57ce3501cdd76bfc83`.
- Contract read, not executed: current `.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md`, SHA-256 `9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9`.

All mathematical conclusions below were derived from the input snapshot alone.
No answer/book-answer data, modern-lesson worked examples, candidate author
files/keys, choices, scans, or other lessons were consulted. No browser, images,
tests, production preparation, finalization, publication, DB, environment, app,
dependency, schema, Git, workflow refresh, SkillHost, grill, or other-chat
messaging actions were performed. These are reviewer scratch records, not
production answer keys or a claim that the complete cap2/gate2 pipeline passed.

The contract requires complete derivation when answers are derived, distinct
coverage of printed subparts, and explanatory reasons for proofs. This record
supplies that mathematical evidence. Candidate display/parts/expected/grading
and runtime input-chain judgments remain outside Stage A. No infinite-family
autograding decision is made.

## Interpretation and Coverage

The exact source snapshot below contains 10 exercises, numbered 392 through 401.
The six `g1` exercises each print Cyrillic labels `а)` and `б)`, giving 12 proof
obligations. The four `g2` exercises each have one primitive-finding obligation,
giving 16 independently solved units in total.

- Exact `g1` instruction: `习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：`
- Exact `g2` instruction: `求函数$f$在$R$上的原函数：`
- `]a,b[` means the open interval `(a,b)`. No excluded endpoint is asserted.
- A primitive on an interval means a differentiable real function with
  `F'(x)=f(x)` at every point of that interval.
- Cube roots denote the unique real cube root. On `x>0`,
  `\sqrt[3]{x}=x^{1/3}`, `\sqrt[3]{x^2}=x^{2/3}`, and
  `\sqrt[3]{x^4}=x^{4/3}`. Every fractional-power simplification below is used
  only on that stated positive interval.
- Square roots denote the nonnegative real square root. On `x>0`,
  `\sqrt{x^3}=x^{3/2}` and `\sqrt{x}=x^{1/2}`.
- `\operatorname{tg}x=\tan x=\sin x/\cos x` and
  `\operatorname{ctg}x=\cot x=\cos x/\sin x`; angles are in radians.
- The star printed in 397 is retained as a source marker; it does not remove
  either subpart or alter its mathematical task.
- In 401, `2\frac{1}{2}` is the mixed number `2+1/2=5/2`, not `2(1/2)=1`.

For 392-397, `F` is given, including its printed constants: the task is to prove
that very function is a primitive. No arbitrary `C` is appended to the given
`F`. For 398-401, the domain is the connected interval `R`; an arbitrary real
constant `C` gives all primitives, while `C=0` gives one primitive.

## Independent Solutions

### 392, First Printed Subpart `а)`

Given `F(x)=3\sqrt[3]{x}`, `f(x)=1/\sqrt[3]{x^2}`, `x>0`.
Both functions are real and defined there, and the denominator is positive.

\[
F'(x)=3\frac{d}{dx}x^{1/3}
     =3\cdot\frac13x^{-2/3}
     =x^{-2/3}
     =\frac1{x^{2/3}}
     =\frac1{\sqrt[3]{x^2}}=f(x).
\]

Independent root check: put `u=\sqrt[3]{x}>0`. Differentiating `u^3=x`
gives `3u^2u'=1`, so `(3u)'=1/u^2`; since `(u^2)^3=x^2`,
`u^2=\sqrt[3]{x^2}`.

Reverse check: starting from `f`, replace its denominator by `x^{2/3}`,
invert to `x^{-2/3}`, and recover `3(1/3)x^{1/3-1}`. All divisions use
positive nonzero factors. Thus this is the derivative of the printed `F`
at every point of `(0,\infty)`. Zero is excluded.

### 392, Second Printed Subpart `б)`

Given `F(x)=\sin x+3`, `f(x)=\cos x`, `x\in R`.

\[
F'(x)=(\sin x)'+(3)'=\cos x+0=\cos x=f(x).
\]

Sine and cosine are defined and differentiable on all of `R`; the printed
constant `3` has derivative zero. Reverse check:
`f(x)=\cos x=(\sin x)'+(3)'`, recovering the exact printed function.

### 393, First Printed Subpart `а)`

Given `F(x)=\frac32\sqrt[3]{x^2}-5`,
`f(x)=1/\sqrt[3]{x}`, `x>0`.
The cube root in the denominator is positive and nonzero.

\[
F'(x)=\frac32\frac{d}{dx}x^{2/3}-(5)'
     =\frac32\cdot\frac23x^{-1/3}-0
     =x^{-1/3}
     =\frac1{\sqrt[3]{x}}=f(x).
\]

Independent root/chain check: let `u=\sqrt[3]{x^2}>0`. From `u^3=x^2`,
`3u^2u'=2x`, so `(\frac32u-5)'=x/u^2`.
Since `u^2=x^{4/3}`, this is `x/x^{4/3}=x^{-1/3}` on `x>0`.

Reverse check: `1/\sqrt[3]{x}=x^{-1/3}
=(3/2)(2/3)x^{2/3-1}+(-5)'`. The printed `-5` is retained, and no
division by zero occurs on `(0,\infty)`.

### 393, Second Printed Subpart `б)`

Given `F(x)=4-\cos x`, `f(x)=\sin x`, `x\in R`.

\[
F'(x)=(4)'-(\cos x)'=0-(-\sin x)=\sin x=f(x).
\]

All expressions are defined and differentiable on `R`. The constant `4`
contributes zero, and both minus signs are necessary. Reverse check:
`f(x)=\sin x=0-(-\sin x)=(4)'-(\cos x)'`.

### 394, First Printed Subpart `а)`

Given `F(x)=\frac34\sqrt[3]{x^4}`, `f(x)=\sqrt[3]{x}`, `x>0`.

\[
F'(x)=\frac34\frac{d}{dx}x^{4/3}
     =\frac34\cdot\frac43x^{1/3}
     =x^{1/3}=\sqrt[3]{x}=f(x).
\]

Independent root/chain check: set `u=\sqrt[3]{x^4}>0`.
Differentiating `u^3=x^4` yields `3u^2u'=4x^3`; hence
`(\frac34u)'=x^3/u^2=x^3/x^{8/3}=x^{1/3}`.

Reverse check: `\sqrt[3]{x}=x^{1/3}
=(3/4)(4/3)x^{4/3-1}`. The chain-check division is valid since `u>0`.
The proof covers the printed interval `(0,\infty)` and asserts no extension.

### 394, Second Printed Subpart `б)`

Given `F(x)=\operatorname{tg}x-\sqrt2`,
`f(x)=1/\cos^2x`, `-\pi/2<x<\pi/2`.
Here `\cos x>0`, so tangent and the reciprocal square are defined.
The square root `\sqrt2` is a fixed positive real constant.

\[
F'(x)=\left(\frac{\sin x}{\cos x}\right)'-(\sqrt2)'
     =\frac{\cos x\cos x-\sin x(-\sin x)}{\cos^2x}-0
     =\frac{\cos^2x+\sin^2x}{\cos^2x}
     =\frac1{\cos^2x}=f(x).
\]

Reverse check: on the interval, multiply `1/\cos^2x` by the identity
`1=\cos^2x+\sin^2x`, giving the quotient-rule numerator above.
Recover `(tg x)'-(\sqrt2)'` without changing the fixed constant.
Both endpoints are excluded; their zero cosine cannot be divided by.

### 395, First Printed Subpart `а)`

Given `F(x)=\frac23\sqrt{x^3}`, `f(x)=\sqrt x`, `x>0`.
The square roots are principal nonnegative roots and are strictly positive
here; in particular the chain-rule denominator below is nonzero.

\[
F'(x)=\frac23\frac{d}{dx}x^{3/2}
     =\frac23\cdot\frac32x^{1/2}
     =x^{1/2}=\sqrt x=f(x).
\]

Independent square-root/chain check:
\[
\frac23(\sqrt{x^3})'
=\frac23\cdot\frac{3x^2}{2\sqrt{x^3}}
=\frac{x^2}{\sqrt{x^3}}
=\frac{x^2}{x\sqrt x}
=\sqrt x\qquad(x>0).
\]

The identity `\sqrt{x^3}=x\sqrt x` uses `x>0`, not an unrestricted
square-root identity for negative `x`. Reverse check:
`\sqrt x=x^{1/2}=(2/3)(3/2)x^{3/2-1}`;
equivalently `\sqrt x=x^2/\sqrt{x^3}` on this interval.
No assertion at zero or at negative arguments is needed.

### 395, Second Printed Subpart `б)`

Given `F(x)=3-\operatorname{ctg}x`,
`f(x)=1/\sin^2x`, `0<x<\pi`.
Here `\sin x>0`, so cotangent and the reciprocal square are defined.

\[
(\operatorname{ctg}x)'
=\left(\frac{\cos x}{\sin x}\right)'
=\frac{(-\sin x)\sin x-\cos x\cos x}{\sin^2x}
=-\frac1{\sin^2x}.
\]
\[
F'(x)=(3)'-(\operatorname{ctg}x)'
     =0-\left(-\frac1{\sin^2x}\right)
     =\frac1{\sin^2x}=f(x).
\]

Reverse check: `1/\sin^2x
=-[-(\sin^2x+\cos^2x)/\sin^2x]`, which recovers the negative of the
cotangent quotient derivative, plus `(3)'=0`. The printed minus sign and
constant `3` are preserved. Neither zero-sine endpoint belongs to the interval.

### 396, First Printed Subpart `а)`

Given `F(x)=14-1/x`, `f(x)=1/x^2`, `x<0`.
Negative `x` is allowed for the reciprocal; zero is excluded.

\[
F'(x)=(14)'-(x^{-1})'
     =0-(-x^{-2})
     =x^{-2}=\frac1{x^2}=f(x).
\]

Independent quotient check: `(1/x)'=(0\cdot x-1\cdot1)/x^2=-1/x^2`,
so the preceding minus sign gives `+1/x^2`.
Reverse check: `1/x^2=x^{-2}=0-(-x^{-2})=(14)'-(x^{-1})'`.
Both functions are differentiable on `(-\infty,0)`; the constant is exactly `14`.

### 396, Second Printed Subpart `б)`

Given `F(x)=9-1/x`, `f(x)=1/x^2`, `x>0`.

\[
F'(x)=(9)'-(x^{-1})'
     =0-(-x^{-2})
     =x^{-2}=\frac1{x^2}=f(x).
\]

The quotient calculation `(1/x)'=-1/x^2` is valid since `x\ne0`.
Reverse check: `1/x^2=x^{-2}=0-(-x^{-2})=(9)'-(x^{-1})'`.
The separate interval is `(0,\infty)`, and the separate printed constant is `9`,
not the `14` from the first subpart.

### 397, First Printed Subpart `а)` (Printed Star Retained)

Given `F(x)=|x|`, `f(x)=1`, `x>0`.
On precisely this interval, `|x|=x`.

\[
F'(x)=(|x|)'=(x)'=1=f(x)\qquad(x>0).
\]

Reverse check: for any fixed `x>0`, sufficiently small `h` also gives `x+h>0`;
the difference quotient is
`(|x+h|-|x|)/h=((x+h)-x)/h=1` for nonzero `h`.
Thus the derivative is `1`, and the interval identity recovers the printed `|x|`.
No differentiability at `0` is claimed.

### 397, Second Printed Subpart `б)`

Given `F(x)=|x|`, `f(x)=-1`, `x<0`.
On precisely this interval, `|x|=-x`.

\[
F'(x)=(|x|)'=(-x)'=-1=f(x)\qquad(x<0).
\]

Reverse check: for fixed `x<0`, sufficiently small `h` also gives `x+h<0`;
`(|x+h|-|x|)/h=(-(x+h)-(-x))/h=-1` for nonzero `h`.
The negative branch is essential. `|x|` has no two-sided derivative at zero,
but zero is absent from both printed intervals.

### 398 (Single Printed Task)

Given `f(x)=x^3` on `R`. A primitive is `F_0(x)=x^4/4`.
All primitives are
\[
F(x)=\frac{x^4}{4}+C,\qquad C\in R,\quad x\in R.
\]

Full derivative verification:
\[
F'(x)=\frac14(x^4)'+C'
     =\frac14\cdot4x^3+0=x^3=f(x).
\]

The polynomial is differentiable at every real `x`, including zero and negative
arguments. Reverse check: differentiating `a x^4` gives `4a x^3`;
matching the coefficient of the given `x^3` gives `4a=1`, hence `a=1/4`.
The constant is independent of `x`; taking `C=0` supplies one requested primitive.

### 399 (Single Printed Task)

Given `f(x)=x^4` on `R`. A primitive is `F_0(x)=x^5/5`.
All primitives are
\[
F(x)=\frac{x^5}{5}+C,\qquad C\in R,\quad x\in R.
\]

Full derivative verification:
\[
F'(x)=\frac15(x^5)'+C'
     =\frac15\cdot5x^4+0=x^4=f(x).
\]

There is no domain exclusion for this polynomial. Reverse check:
`(a x^5)'=5a x^4`, and `5a=1` gives `a=1/5`.
`C` is an arbitrary real constant; `C=0` gives one primitive.

### 400 (Single Printed Task)

Given `f(x)=x` on `R`. A primitive is `F_0(x)=x^2/2`.
All primitives are
\[
F(x)=\frac{x^2}{2}+C,\qquad C\in R,\quad x\in R.
\]

Full derivative verification:
\[
F'(x)=\frac12(x^2)'+C'
     =\frac12\cdot2x+0=x=f(x).
\]

The formula is differentiable on all of `R`. Reverse check:
`(a x^2)'=2a x`, so `2a=1` gives `a=1/2`.
The constant is arbitrary and real; `C=0` gives one primitive.

### 401 (Single Printed Task)

The printed `f(x)=2\frac12` is the constant
\[
2+\frac12=\frac42+\frac12=\frac52
\]
for every real `x`. A primitive is `F_0(x)=\frac52x`.
All primitives are
\[
F(x)=\frac52x+C,\qquad C\in R,\quad x\in R.
\]

Full derivative verification:
\[
F'(x)=\left(\frac52x\right)'+C'
     =\frac52\cdot(x)'+0=\frac52\cdot1=\frac52=f(x).
\]

The linear formula is differentiable everywhere on `R`. Reverse check:
`(a x)'=a`, so the constant derivative must have `a=5/2`;
converting back gives `5/2=2+1/2`, exactly the printed mixed number.
The derivative of `C` is zero, and `C=0` gives one requested primitive.

### Completeness of the Constants in 398-401

For each of these four exercises, the displayed `F_0` differentiates to the
given `f` on all of `R`. If `G` is any other primitive on `R`, then
`H=G-F_0` is differentiable and `H'=G'-F_0'=f-f=0` everywhere.
For arbitrary real `a<b`, the mean value theorem applies to `H` on `[a,b]`
and gives `H(b)-H(a)=H'(c)(b-a)=0` for some `c\in(a,b)`.
Thus `H` is a single real constant on the connected domain `R`.
Conversely every real constant has zero derivative, so every `F_0+C` works.
This is mathematical completeness only, not a decision about how an infinite
answer family should be automatically graded.

## Exact Mathematical Source Snapshot

The contents of the following JSON fence are the entire source file, including
group heads, printed labels, line splits, page anchors, empty figure fields,
indentation, and its final newline. Its UTF-8 bytes must reproduce SHA-256
`153f222b103ba5e1b2e09bbb02f950bf70f0dddcc624dbb04ce91c8bd0f3ca5e`.
Page anchors are transcribed provenance only; no page or scan was opened.

```json
{
  "lesson": "ana10-c7-s1-n97",
  "count": 10,
  "exercises": [
    {
      "number": "392",
      "source_number": "392",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "392. а) $F(x)=3\\sqrt[3]{x}$，$f(x)=\\frac{1}{\\sqrt[3]{x^2}}$，$x\\in]0,\\infty[$；б) $F(x)=\\sin x+3$，$f(x)=\\cos x$，$x\\in]-\\infty,\\infty[$.",
      "lines": [
        "392. а) $F(x)=3\\sqrt[3]{x}$，$f(x)=\\frac{1}{\\sqrt[3]{x^2}}$，$x\\in]0,\\infty[$；",
        "б) $F(x)=\\sin x+3$，$f(x)=\\cos x$，$x\\in]-\\infty,\\infty[$."
      ],
      "pages": [
        "p0105#7"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "393",
      "source_number": "393",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "393. а) $F(x)=\\frac{3}{2}\\sqrt[3]{x^2}-5,\\ f(x)=\\frac{1}{\\sqrt[3]{x}},\\ x\\in]0,\\infty[;$ б) $F(x)=4-\\cos x,\\ f(x)=\\sin x;\\ x\\in]-\\infty,\\infty[.$",
      "lines": [
        "393. а) $F(x)=\\frac{3}{2}\\sqrt[3]{x^2}-5,\\ f(x)=\\frac{1}{\\sqrt[3]{x}},\\ x\\in]0,\\infty[;$ ",
        "б) $F(x)=4-\\cos x,\\ f(x)=\\sin x;\\ x\\in]-\\infty,\\infty[.$"
      ],
      "pages": [
        "p0106#1"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "394",
      "source_number": "394",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "394. а) $F(x)=\\frac{3}{4}\\sqrt[3]{x^4},\\ f(x)=\\sqrt[3]{x},\\ x\\in]0,\\infty[;$ б) $F(x)=\\operatorname{tg}x-\\sqrt{2},\\ f(x)=\\frac{1}{\\cos^2 x},\\ x\\in]-\\frac{\\pi}{2},\\frac{\\pi}{2}[.$",
      "lines": [
        "394. а) $F(x)=\\frac{3}{4}\\sqrt[3]{x^4},\\ f(x)=\\sqrt[3]{x},\\ x\\in]0,\\infty[;$ ",
        "б) $F(x)=\\operatorname{tg}x-\\sqrt{2},\\ f(x)=\\frac{1}{\\cos^2 x},\\ x\\in]-\\frac{\\pi}{2},\\frac{\\pi}{2}[.$"
      ],
      "pages": [
        "p0106#2"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "395",
      "source_number": "395",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "395. а) $F(x)=\\frac{2}{3}\\sqrt{x^3},\\ f(x)=\\sqrt{x},\\ x\\in]0,\\infty[;$ б) $F(x)=3-\\operatorname{ctg}x,\\ f(x)=\\frac{1}{\\sin^2 x},\\ x\\in]0,\\pi[.$",
      "lines": [
        "395. а) $F(x)=\\frac{2}{3}\\sqrt{x^3},\\ f(x)=\\sqrt{x},\\ x\\in]0,\\infty[;$ ",
        "б) $F(x)=3-\\operatorname{ctg}x,\\ f(x)=\\frac{1}{\\sin^2 x},\\ x\\in]0,\\pi[.$"
      ],
      "pages": [
        "p0106#3"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "396",
      "source_number": "396",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "396. а) $F(x)=14-\\frac{1}{x},\\ f(x)=\\frac{1}{x^2},\\ x\\in]-\\infty,0[;$ б) $F(x)=9-\\frac{1}{x},\\ f(x)=\\frac{1}{x^2},\\ x\\in]0,\\infty[.$",
      "lines": [
        "396. а) $F(x)=14-\\frac{1}{x},\\ f(x)=\\frac{1}{x^2},\\ x\\in]-\\infty,0[;$ ",
        "б) $F(x)=9-\\frac{1}{x},\\ f(x)=\\frac{1}{x^2},\\ x\\in]0,\\infty[.$"
      ],
      "pages": [
        "p0106#4"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "397",
      "source_number": "397",
      "group": "习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：",
      "group_id": "g1",
      "text": "397. * а) $F(x)=|x|,\\ f(x)=1,\\ x\\in]0,\\infty[;$ б) $F(x)=|x|,\\ f(x)=-1,\\ x\\in]-\\infty,0[.$",
      "lines": [
        "397. * а) $F(x)=|x|,\\ f(x)=1,\\ x\\in]0,\\infty[;$ ",
        "б) $F(x)=|x|,\\ f(x)=-1,\\ x\\in]-\\infty,0[.$"
      ],
      "pages": [
        "p0106#5"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "398",
      "source_number": "398",
      "group": "求函数$f$在$R$上的原函数：",
      "group_id": "g2",
      "text": "398. $f(x)=x^3.$",
      "lines": [
        "398. $f(x)=x^3.$"
      ],
      "pages": [
        "p0106#7"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "399",
      "source_number": "399",
      "group": "求函数$f$在$R$上的原函数：",
      "group_id": "g2",
      "text": "399. $f(x)=x^4.$",
      "lines": [
        "399. $f(x)=x^4.$"
      ],
      "pages": [
        "p0106#8"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "400",
      "source_number": "400",
      "group": "求函数$f$在$R$上的原函数：",
      "group_id": "g2",
      "text": "400. $f(x)=x.$",
      "lines": [
        "400. $f(x)=x.$"
      ],
      "pages": [
        "p0106#9"
      ],
      "figure_refs": [],
      "figures": []
    },
    {
      "number": "401",
      "source_number": "401",
      "group": "求函数$f$在$R$上的原函数：",
      "group_id": "g2",
      "text": "401. $f(x)=2\\frac{1}{2}.$",
      "lines": [
        "401. $f(x)=2\\frac{1}{2}.$"
      ],
      "pages": [
        "p0106#10"
      ],
      "figure_refs": [],
      "figures": []
    }
  ]
}
```

## Freeze Rule

Do not replace this source-first record with candidate-derived calculations.
Its final artifact SHA-256 is returned separately and pinned in the companion
ledger; a file cannot carry its own whole-file hash without self-reference.
Explicit Stage B authorization is required before candidate disclosure or
comparison. Candidate verdict remains WITHHELD.
