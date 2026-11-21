# Stage 1: Independent Source Mathematics

Ticket: STEMROBIN-184/184-6.
Lesson: ana9-c4-s2-n44 (book 9c).
Status: complete; source mathematics PASS; choice review not yet approved.
Reviewer: bounded independent agent in the same ongoing invocation.

## Input Boundary

The sole mathematical input was `source-seed.json` in this directory.
The required skill, review-order instructions, and contract were read first.
No question view, draft, author solution, answer key, previous output, binding
packet, product lesson, earlier exercise, or figure was opened.

Seed raw bytes: 2693.
Seed raw SHA-256:
`ebe828032681d2dbeee401d81f6035fdb250c641adc6250419a6853fc91a8be3`.
Seed canonical JSON SHA-256:
`6c973ae2b14ffa33c58cc6df92f8af945368567753b2864b7ab533a86f7e42f1`.

The selected definitions place the functions on a common interval and give
the sum theorem, $(u+v)'=u'+v'$. Repeated application handles three summands.
Although the source names earlier examples and exercises, the necessary
elementary derivatives are derived below; no missing reference is essential.

## Elementary Derivatives

Let $t$ be a nonzero increment tending to zero.

- A constant $c$ has quotient $(c-c)/t=0$ and derivative zero.
- The quotient of $x+c$ is $((x+t)+c-(x+c))/t=1$.
- The quotient of $x^2$ is $((x+t)^2-x^2)/t=2x+t$, tending to $2x$.
- For $x\ne0$, the quotient of $1/x$ is
  $(1/(x+t)-1/x)/t=-1/(x(x+t))$, tending to $-1/x^2$.
  Sufficiently small increments keep $x+t$ nonzero.
- For $x>0$, rationalization gives the quotient of $\sqrt{x}$ as
  $1/(\sqrt{x+t}+\sqrt{x})$, tending to $1/(2\sqrt{x})$.
  Sufficiently small increments keep $x+t>0$.

The seed never requires a square-root derivative at zero: the accompanying
reciprocal excludes that point from the last function's domain.

## Source 363

**Part a.** $f(x)=x+5$ has

$$f'(x)=1,\qquad x\in\mathbb R.$$

Its full difference quotient is $((x+t)+5-(x+5))/t=1$.

**Part b.** $g(x)=x^2+3$ has

$$g'(x)=2x,\qquad x\in\mathbb R.$$

The quadratic contributes $2x$ and the constant contributes zero.
Its full difference quotient is $2x+t$.

## Source 364

**Part a.** $h(x)=x^2+x$ has

$$h'(x)=2x+1,\qquad x\in\mathbb R.$$

The sum theorem adds the derivatives $2x$ and $1$.
Its full difference quotient is $2x+t+1$.

**Part b.** $u(x)=x^2+x+7$ has

$$u'(x)=2x+1,\qquad x\in\mathbb R.$$

The constant adds zero to the derivative, and its full difference quotient
is again $2x+t+1$. The two functions have the same derivative, not the same
function values.

## Source 365

**Part a.** $v(x)=x^2+1/x+5$ has real domain $x\ne0$ and

$$v'(x)=2x-\frac{1}{x^2},\qquad x\ne0.$$

Its full quotient is $2x+t-1/(x(x+t))$.
The reciprocal term has a negative derivative, and the constant contributes
zero.

**Part b.** $y(x)=x^2+1/x+\sqrt{x}$ has real domain $x>0$ and

$$y'(x)=2x-\frac{1}{x^2}+\frac{1}{2\sqrt{x}},\qquad x>0.$$

The domain is the intersection of $x\ne0$ with $x\ge0$.
Its full quotient, with the root term rationalized, is

$$2x+t-\frac{1}{x(x+t)}+\frac{1}{\sqrt{x+t}+\sqrt{x}}.$$

Taking its limit yields the derivative above. Zero and negative real inputs
are not domain points for this part.

## Source 366: Proof Task

Let $u$ and $v$ be defined on the same interval and differentiable at a common
point $x$. Define $w=u-v$. For sufficiently small nonzero increments allowed
by the interval,

$$
\frac{w(x+t)-w(x)}{t}
=\frac{u(x+t)-u(x)}{t}
-\frac{v(x+t)-v(x)}{t}.
$$

The two quotients on the right have finite limits $u'(x)$ and $v'(x)$.
The limit of their difference therefore exists and is $u'(x)-v'(x)$.
By the definition of derivative,

$$w'(x)=u'(x)-v'(x).$$

Because $x$ was arbitrary among common differentiability points, this proves
$(u-v)'=u'-v'$ throughout that set without assuming the rule being proved.
Equivalently, the quotient for $-v$ is the negative of the quotient for $v$,
so $(-v)'=-v'$; applying the selected sum theorem to $u+(-v)$ gives the same
result.

## Frozen Boundary

All six derivative parts and the proof task are independently solved.
No essential mathematical input remains unresolved.
There were zero image views and zero image decodes; allowance was zero.
The inherited parent image counters were not changed.

Task fidelity, redundancy, leakage, all twenty option checks, author-key
comparison, and package coverage are not evaluated in stage 1.
Stop for parent intake and explicit stage 2 release.
