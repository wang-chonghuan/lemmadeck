# n43 Independent Choice Review: Stage1 Source Freeze

Ticket: STEMROBIN-182. Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.
Reviewer: independent Codex n43 choices reviewer, not the author.

Only mathematical input:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n43-choice-author/seed.json`.
No author notes, draft, views, solves, coverage, draft/view hashes, answer keys
or old outputs were opened. Review instructions and shared image/recovery
rules were read. The seed contains originals 855-857, nine tasks, concept
blocks 12 and 28, and no figures. Images opened: zero.

Seed canonical SHA-256:
`80036151ec3156535f61689ffe76678e31406e3fba88e5e74a314882238d95d1`.
Seed file-byte SHA-256:
`88cac35c07a09d09805ddeb550a8a9375aa529846034873e13af1c4b5c6e25a6`.
Canonical means Python-compatible sorted-key JSON with ASCII escaping and
compact separators, encoded as UTF-8.

This is a source-only staging artifact, not a completed
`s10y-choice-review-v1`. No question-level verdict, key comparison, package
coverage verdict or approval has been issued. Stop after freezing this
document, its JSON companion and their checksum file.

## Selected Concepts

Block 12 introduces solving quadratics by completing a binomial square.
For a monic quadratic,

```text
z^2+pz+q=0
z^2+pz=-q
z^2+pz+p^2/4=p^2/4-q
(z+p/2)^2=p^2/4-q.
```

For real solutions, a positive square value yields two branches, zero yields
one distinct repeated root, and a negative value yields no roots. Exercise
855 expressly requires completing the square, so its required mathematical
judgment includes this relationship, not merely a final root list.

Block 28 states that division by the coefficient of the squared variable
produces an equivalent monic equation. For a nonzero leading coefficient,

```text
az^2+bz+c=0
z^2+(b/a)z+c/a=0
(z+b/(2a))^2=(b^2-4ac)/(4a^2).
```

Every coefficient must be divided by `a`. This applies to both equations in
856. Their source instruction only says to solve, so a valid alternative
method is not itself a fidelity defect.

## 855: Six Completing-Square Tasks

### 855a

```text
x^2-2x-35=0
x^2-2x=35
x^2-2x+1=36
(x-1)^2=36
x-1=+6 or -6
x=7 or -5.
```

Complete real solution set: `{-5,7}`. Substitution gives
`49-14-35=0` and `25+10-35=0`. The equivalent positive square equation
has exactly those two branches.

Fidelity needs: preserve both original signs, the addition of 1, the
completed-square relationship and both roots. The center 1 is not a root.
A supplied root alone does not establish the required method.

### 855b

```text
x^2+8x-20=0
x^2+8x=20
x^2+8x+16=36
(x+4)^2=36
x+4=+6 or -6
x=2 or -10.
```

Complete real solution set: `{-10,2}`. Substitution gives
`4+16-20=0` and `100-80-20=0`. Both square-root branches are required.

Fidelity needs: retain addition of 16 and the plus sign in `x+4`. Do not
confuse the shifted values `+6,-6` with the roots. The square value matches
855a, but the shifts and solution sets do not.

### 855c

```text
y^2+16y+64=0
(y+8)^2=0
y+8=0
y=-8.
```

Complete distinct real solution set: `{-8}`. This is a double root because
the polynomial is `(y+8)(y+8)`. Substitution gives `64-128+64=0`.
The two signs of the square root of zero coincide.

Fidelity needs: preserve `y`, recognition of the already complete square,
and the distinction between one distinct solution and multiplicity two.
`+8` is not a second root.

### 855d

```text
x^2+14x+50=0
x^2+14x=-50
x^2+14x+49=-1
(x+7)^2=-1.
```

For real `x`, a square cannot be negative. The complete real solution set is
empty. Equivalently, the original polynomial is `(x+7)^2+1`, which is at
least 1 on the reals, including value 1 at `x=-7`.

The seed does not explicitly name a number domain. If complex solutions
are requested, `x+7=+i` or `-i`, hence the complete complex solution set is
`{-7-i,-7+i}`. Both give `(x+7)^2+1=-1+1=0`.
These conclusions are conditional on the domain; no domain-dependent key
has been assumed before views disclosure.

Fidelity needs: retain the constant 50, addition of 49 and square value
`-1`. Replacing 50 with 49 erases the no-real-root case. Later visible root
claims must be compatible with their stated or justified domain.

### 855e

```text
y^2-7y-8=0
y^2-7y=8
y^2-7y+49/4=8+49/4=81/4
(y-7/2)^2=81/4
y-7/2=+9/2 or -9/2
y=8 or -1.
```

Complete real solution set: `{-1,8}`. Substitution gives
`64-56-8=0` and `1+7-8=0`. The equivalent positive square equation has
exactly two branches.

Fidelity needs: retain `y`, the negative linear coefficient, fractional
half-coefficient `-7/2`, its square `49/4` and both signs of `9/2`.
Do not round or substitute 49 for `49/4`.

### 855f

```text
x^2+x-2=0
x^2+x=2
x^2+x+1/4=2+1/4=9/4
(x+1/2)^2=9/4
x+1/2=+3/2 or -3/2
x=1 or -2.
```

Complete real solution set: `{-2,1}`. Substitution gives
`1+1-2=0` and `4-2-2=0`. The two signs exhaust the square equation.

Fidelity needs: recognize the implicit coefficient 1, its half `1/2`,
the addition of `1/4`, the positive shift and both roots. Do not import
the shift or roots of 855e merely because both have odd coefficients.

## 856: Two Nonmonic Quadratics

### 856a

```text
2x^2-9x+10=0
x^2-(9/2)x+5=0                    [divide every term by 2]
x^2-(9/2)x=-5
(x-9/4)^2=-5+81/16=1/16
x-9/4=+1/4 or -1/4
x=5/2 or 2.
```

Complete real solution set: `{2,5/2}`. Division by 2 preserves all roots,
and both branches of the square equation are included. Substitution gives
`8-18+10=0` and `25/2-45/2+10=0`. Independent factorization:
`(2x-5)(x-2)=2x^2-9x+10`.

Fidelity needs: preserve the non-unit coefficient and complete root set,
including `5/2`. If normalization is tested, both -9 and 10 must also be
divided by 2. The source does not make completing the square compulsory.

### 856b

```text
5x^2+3x-8=0
x^2+(3/5)x-8/5=0                 [divide every term by 5]
x^2+(3/5)x=8/5
(x+3/10)^2=8/5+9/100=169/100
x+3/10=+13/10 or -13/10
x=1 or -8/5.
```

Complete real solution set: `{-8/5,1}`. Division by 5 preserves all roots,
and both square-root branches are retained. Substitution gives
`5+3-8=0` and `64/5-24/5-8=0`. Independent factorization:
`(5x+8)(x-1)=5x^2+3x-8`.

Fidelity needs: preserve all divided coefficients and the constant's sign.
If completion is tested, distinguish `3/5`, its half `3/10`, and square
`9/100`. Retain the negative fractional root. Other valid solving methods
can satisfy the source instruction.

## 857: Product Proof

Label the larger number `u` and the smaller `v`. The givens are
`u+v=sqrt(10)` and `u-v=sqrt(6)`. Expanding and subtracting gives

```text
(u+v)^2 = u^2+2uv+v^2
(u-v)^2 = u^2-2uv+v^2
(u+v)^2-(u-v)^2 = 4uv
10-6 = 4uv
uv = 1.
```

An independent alternative solves the two linear equations:

```text
u=(sqrt(10)+sqrt(6))/2
v=(sqrt(10)-sqrt(6))/2
uv=((sqrt(10)+sqrt(6))(sqrt(10)-sqrt(6)))/4
  =(10-6)/4
  =1.
```

Their sum and larger-minus-smaller difference recover the givens. Both
numbers are positive since `sqrt(10)>sqrt(6)>0`. The ordered pair is unique;
if "difference" means absolute difference, swapping names is the only
alternative and cannot change the product. Finding the individual numbers
is auxiliary reasoning, not another compulsory source task.

Fidelity needs: preserve both exact radical givens, the difference-of-squares
factor 4 or equivalent conjugate-product denominator 4, and a justification
of the conclusion. The source already states product 1 as the claim to
prove, so selecting 1 alone can be data-copying rather than proving it.
Proof recognition is not automatically a failure, but lost independent
proof production must be recorded.

## Later Review Requirements

1. Account for all nine tasks: six in 855, two in 856 and one proof in 857.
   A justified grouping need not yield exactly nine visible questions.
2. Preserve the key distinctions: positive, zero and negative square values;
   odd coefficients; nonmonic normalization; exact roots; and proof from
   both givens. Common numerical values do not establish redundancy.
3. Review visible fidelity, redundancy and leakage before author internals.
   Do not claim that final-root recognition alone demonstrates the method
   expressly required in 855.
4. Complete-table or proof recognition and reasonable elimination can be
   faithful. Record concrete production losses and fail actual copying,
   absent mathematical judgment or loss of an essential task.
5. Check cross-question cues after views disclosure. No question should give
   away another task's required relationship or complete solution without
   the intended mathematical judgment.
6. No omission decision, complete package verdict or approval is made here.

## Offline Verification

Node.js built-ins checked all eight completed-square polynomial identities
with exact integer cross-multiplication. Every listed real root was checked
by exact substitution into both the original and square equations. The
zero-square and negative-square cases have the explicit arguments above.
The product proof was independently derived symbolically, with exact
arithmetic `(10-6)/4=1`.

No database, network, paid call, dependency installation, application action,
durable content write, finalization or commit was performed. Only the owned
review directory receives files. The JSON and this Markdown are write-once
evidence; their byte hashes will be stored in `source-solutions.sha256`,
and all three files will be set to mode `0444` before any views disclosure.
