# Stage 2: Independent Visible-Question Review

Ticket: STEMROBIN-184/184-6.
Lesson: ana9-c4-s2-n44.
Reviewer: bounded independent agent in the same ongoing invocation.

## Order and Input Boundary

Read the frozen stage1-source.json, then only view-only.json.
Visible input: five questions, twenty options, zero figures; 3739 raw bytes.
Visible raw SHA-256:
`265ab48227f78682469e74c815c0d01ec0ebf05b905dc081e7b5edadc117d00d`.
Frozen stage 1 raw SHA-256 remains
`b8c786604c2ba520bf5c9df1b0630156ffb5f71846d8a24e44b8888db1c8818c`.

The following fidelity, redundancy, and leakage findings are recorded before
the independent option mathematics. No full draft, author intent, author key,
author rationale, earlier review, answer file, packet binding, or product file
was opened. Generic instructions were retained from the ongoing invocation
without any new instruction-file reads.

## Pre-Mathematics Findings

| Question | Fidelity | Redundancy | Leakage |
| --- | --- | --- | --- |
| linear-quadratic | PASS | PASS | PASS |
| constant-shift | PASS | PASS | PASS |
| reciprocal-term | PASS | PASS | PASS |
| square-root-term | PASS | PASS | PASS |
| difference-proof | PASS | PASS | PASS |

**linear-quadratic.** Both source 363 functions are unchanged. Complete
derivative pairs retain both subparts; the linear and quadratic components
are different tasks. The stem gives function values, not derivative values.
No other view gives this complete pair as established information.

**constant-shift.** Both source 364 functions and the all-real-x quantifier
are retained. Separate equations concern different functions; the constant
shift is the source relationship, not a duplicated task. Reusing elementary
rules from another question requires legitimate mathematical transfer.
Matching two candidate expressions does not establish their truth.

**reciprocal-term.** Source 365a is unchanged, including x!=0. The response
concerns all three terms. Candidate differences involve reciprocal sign,
exponent, and treatment of the constant. Repeated negative reciprocal
prefixes in the root question are a weak cue, not an announced correct
answer or a unique logical solution.

**square-root-term.** Source 365b is unchanged, and x>0 preserves its real
domain. It differs from the preceding task by the root contribution.
Even a solved preceding task leaves multiple root candidates. Conversely,
the two candidates with the same root expression differ in reciprocal sign.
Common prefixes do not uniquely establish a selection.

**difference-proof.** The same-interval differentiability assumption,
w=u-v, and arbitrary-function quantifier are preserved. The quotient identity
and the finite-limit inference retain the algebra-and-limit proof chain.
They perform different roles and are not redundant. Minus-sign matching can
assist elimination, but the necessary expression w=u-v is source data and
the displayed proof steps concern distinct mathematical relationships.
No other view states this general proof.

**Visible package.** Every question defines its own functions and relevant
domain; none depends on an earlier selection. The proof's arbitrary u and v
are local variables, not prescribed reuse of preceding concrete functions.
Shared elementary derivatives permit transfer without exposing a labeled
key. Visible source alignment is apparent, but unseen coverage declarations
remain unreviewed.

## Observed Capacity Losses

- Expression recognition does not demonstrate independently producing and
  simplifying a derivative in writing.
- Proof-step recognition does not demonstrate independently constructing
  and writing a proof.
- Selecting pairs or equations does not expose intermediate calculations.

These are recognition-versus-production limitations; the visible questions
retain the source's mathematical distinctions. Whether the author records
these limitations and accounts for coverage remains reserved for stage 3.

## Independent Mathematics

The pre-mathematics JSON was 8409 bytes with raw SHA-256
`4309a1088916984540ccb489242469366a85fe2470dade7e307e6fa39179204b`.
The pre-mathematics Markdown was 4038 bytes with raw SHA-256
`b0710ab6058a09143311b7cfdfac683219d0fc0e5c166ed5f7ab77beb84c1758`.
The unchanged fidelity/package/capacity-loss field projection has canonical
SHA-256
`f1de95d5a32af148833f2cfb5d09a7c2a45b7240ff120f15fb5fb27ad74354a5`.
These were recorded before adding the following independently solved option
mathematics.

### linear-quadratic

The visible functions have increment quotients 1 and $2x+t$, respectively.
Thus $f'=1$ and $g'=2x$ for every real $x$.
Complete true set: **A**. Mode: single. Mathematics: PASS.

- A: correct. Both derivative expressions equal their quotient limits;
  the constants contribute zero.
- B: incorrect. The second expression is right, but $f'$ is 1, not 0.
- C: incorrect. The first expression is right, but the constant 3 cannot
  remain in $g'$. At $x=0$, the actual $g'$ is 0 and the candidate is 3.
- D: incorrect. It copies the two functions. At $x=0$, the actual derivative
  pair is $(1,0)$, while the candidate pair is $(5,3)$.

### constant-shift

Expansion gives the full quotient $2x+t+1$ for each of the two visible
functions. Consequently $h'=u'=2x+1$ for every real $x$.
Complete true set: **A, C**. Mode: multiple. Mathematics: PASS.

- A: correct. The square contributes $2x$ and the linear term contributes 1.
- B: incorrect. It drops the derivative of the linear term. At $x=0$,
  actual $h'=1$, while the candidate is 0.
- C: correct. Adding 7 changes no increment, so its derivative contribution
  is zero and $u'=2x+1$.
- D: incorrect. The claimed extra 7 is not a derivative contribution.
  At $x=0$, actual $u'=1$, while the candidate is 8.

### reciprocal-term

For the visible $v$ at $x\ne0$, the full quotient is
$2x+t-1/(x(x+t))$. Its limit is $v'=2x-1/x^2$.
Complete true set: **B**. Mode: single. Mathematics: PASS.

- A: incorrect. It reverses the reciprocal sign. At $x=1$, the actual
  derivative is 1 and this expression is 3.
- B: correct. It combines $2x$, $-1/x^2$, and the constant's zero derivative
  throughout $x\ne0$.
- C: incorrect. The reciprocal exponent must be 2. At $x=2$, the actual
  derivative is $15/4$ and the candidate is $7/2$. Equality at $x=1$ alone
  cannot establish this derivative formula.
- D: incorrect. It retains the constant 5. At $x=1$, actual $v'=1$, while
  the candidate is 6.

### square-root-term

For the visible $y$ at $x>0$, rationalization gives the full quotient

$$2x+t-\frac{1}{x(x+t)}+\frac{1}{\sqrt{x+t}+\sqrt{x}}.$$

Its limit is $y'=2x-1/x^2+1/(2\sqrt{x})$.
Complete true set: **A**. Mode: single. Mathematics: PASS.

- A: correct. Each of the three contributions equals its quotient limit
  and is defined on $x>0$.
- B: incorrect. The root is not its own derivative. At $x=1$, actual
  $y'=3/2$, while the candidate gives 2. The two root expressions coincide
  at $x=1/2$ only, not throughout the domain.
- C: incorrect. It omits the factor $1/2$ in the root derivative.
  At $x=1$, actual $y'=3/2$, while this candidate gives 2.
- D: incorrect. The reciprocal derivative has the wrong sign.
  At $x=1$, actual $y'=3/2$, while this candidate gives $7/2$.

### difference-proof

For arbitrary differentiable $u,v$, the identity $w=u-v$ implies
$\Delta w=\Delta u-\Delta v$. Division by a common nonzero admissible
increment gives A. The two derivative quotients have finite limits, so the
limit of their difference exists and is $u'-v'$. This supplies B and proves
both differentiability and the desired derivative formula.
Complete true set: **A, B**. Mode: multiple. Mathematics: PASS.

- A: correct. It follows directly by subtracting the values defining $w$
  and then dividing the resulting increment identity.
- B: correct. In the stated context, the quotient identity and finite
  limits justify $w'=\lim(\Delta u/\Delta x)-\lim(\Delta v/\Delta x)=u'-v'$.
  It does not assume the derivative rule being proved.
- C: incorrect. For $u(x)=0$ and $v(x)=x$, actual $w'=-1$, while the
  proposed sum is 1. This defeats the arbitrary-function quantifier.
- D: incorrect. For $u(x)=v(x)=x$, actual $w'=0$, while the proposed
  product is 1. This too defeats the arbitrary-function quantifier.

## Stage 2 Result and Stop

Stage 2 complete: visible fidelity, redundancy, leakage, package dependency,
and independent mathematics PASS. All twenty options checked; no essential
input is unresolved. Complete sets, in visible question order:
**A; A,C; B; A; A,B**.

Stage 1 remains unchanged. Zero image views, zero image decodes, and zero
figure checks; inherited parent counters remain unchanged.
No official validator, render, draft repair, or later input was used.
No author-key agreement or coverage approval is claimed.

Stop after frozen stage 2 for full parent intake and explicit stage 3/key-last
release.
