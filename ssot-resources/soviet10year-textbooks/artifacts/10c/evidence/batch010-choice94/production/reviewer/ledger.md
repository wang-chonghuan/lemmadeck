# STEMROBIN-184 Stage1 Independent Solution Ledger

## Frozen Boundary

Lesson: ana10-c6-s4-n94. Book: 10c. Date: 2026-11-17.
Role: independent choice reviewer, Stage1 ONLY.
All 15 written tasks were solved from the prepared seed before any author disclosure.
This ledger and `source-first.md` are frozen source evidence, not candidate approval.
Coverage, task fidelity, redundancy, answer leakage, visible-question mathematics,
option truth sets, author-key comparison, and aggregate gate outcome remain pending.

Sole mathematical input:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c94/seed.json`

Raw seed SHA-256:
`52df395359f23509b7c706ca07a0151db9a7fe3cb3360584e109b945d8c8966c`

Canonical seed SHA-256:
`598d5321a199d9f7e0cc424b1a5394b595976399d0c6f7431d476263bd9654d0`

Raw snapshot: 2862 UTF-8 bytes, final LF, reproduced exactly in `source-first.md`.
Canonicalization for the seed and each exercise object:
`json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode("utf-8")`.
The JSON objects below retain exact exercise numbers, source text, and empty figure lists;
their key ordering is canonical. Supplied provenance hashes are frozen with the full seed,
not independently refreshed. No other mathematical source was opened.

Global conventions: x in R; radians; each family has its own k in Z.
No finite interval is supplied or imposed. `tg = tan`, `ctg = cot`.
313 uses the mixed number 5/2; 320 uses the mixed number 7/3.
Inverse sine and inverse tangent use their principal real branches.
Concepts and figures are empty. Image usage remains 0; no reset;
permanent limit 8 and batch limit 24, with the existing context limit unchanged.

Every entry below includes the complete original real domain, an independent
equivalent reduction, all periodic solution families, and direct satisfaction evidence.
No entry assigns a candidate or semantic-gate verdict.

## 310

Exact source snapshot:
```json
{"figure_ids":[],"number":"310","text":"310. $1+\\cos x+\\cos2x=0$\u3002"}
```
Exercise canonical SHA-256: `af1dc981590b99dc511d54eb108befefd19113d56da653e16ea139cd7a765079`.

Domain: R.
Independent solution: c = cos(x) lies in [-1,1].
Using cos(2x) = 2c^2 - 1 gives `c(2c + 1) = 0`.
Thus c = 0 or -1/2, both admissible, with no divisions or lost roots.
Complete families: `pi/2 + k*pi`; `2*pi/3 + 2*k*pi`; `4*pi/3 + 2*k*pi`.
Original-expression verification: c = 0 gives `1 + 0 - 1 = 0`;
c = -1/2 gives `1 - 1/2 - 1/2 = 0`.
The cosine inverse images listed are exhaustive.

## 311

Exact source snapshot:
```json
{"figure_ids":[],"number":"311","text":"311. $3-\\cos^2x-3\\sin x=0$\u3002"}
```
Exercise canonical SHA-256: `cd32e6fbeff00347722b9c057e6742c87dc6392f1e1220720201ab1f3814578c`.

Domain: R.
Independent solution: s = sin(x) lies in [-1,1].
Replacing cos(x)^2 with 1 - s^2 gives
`s^2 - 3s + 2 = (s - 1)(s - 2) = 0`.
Reject s = 2 by its range; retain s = 1.
Complete family: `pi/2 + 2*k*pi`.
Original-expression verification: sin(x) = 1 and cos(x) = 0 give `3 - 0 - 3 = 0`.
No other real sine root remains.

## 312

Exact source snapshot:
```json
{"figure_ids":[],"number":"312","text":"312. $4\\sin x=4-\\cos^2x$\u3002"}
```
Exercise canonical SHA-256: `fb5a19346466e45eb44b8f23e77fc2da24390f650a40d3e72354f6cf3b935274`.

Domain: R.
Independent solution: s = sin(x) lies in [-1,1].
The equation becomes `4s = 3 + s^2`, hence
`(s - 1)(s - 3) = 0`.
Reject s = 3 by its range; retain s = 1.
Complete family: `pi/2 + 2*k*pi`.
Original-equation verification: `4 = 4 - 0`.
This equals 311's solution set, but the reduction and rejected root were checked independently.

## 313

Exact source snapshot:
```json
{"figure_ids":[],"number":"313","text":"313. $\\operatorname{tg}x+\\operatorname{ctg}x=2\\frac{1}{2}$\u3002"}
```
Exercise canonical SHA-256: `43c2f684fec3c8126dc2bc32aacf20d70296ebaf20bff520f8f143be88084875`.

Domain: `R \ {k*pi/2 : k in Z}`, because both sine and cosine must be nonzero.
Independent solution: with the mixed number 5/2 and nonzero finite t = tan(x),
`t + 1/t = 5/2` iff `(2t - 1)(t - 2) = 0`.
Thus t = 1/2 or 2, both allowed.
Complete families: `arctan(1/2) + k*pi`; `arctan(2) + k*pi`.
Original-equation verification: both sums equal `1/2 + 2 = 5/2`;
neither family contains an excluded point.
Equivalent exhaustive form: let a = arcsin(4/5).
The identity `tan(x) + cot(x) = 1/(sin(x)*cos(x))` gives `sin(2x) = 4/5`,
with families `a/2 + k*pi` and `(pi - a)/2 + k*pi`.
Keeping just one inverse-sine branch would lose solutions.

## 314

Exact source snapshot:
```json
{"figure_ids":[],"number":"314","text":"314. $\\cos\\frac{x}{2}=1+\\cos x$\u3002"}
```
Exercise canonical SHA-256: `9582b8cade1c3d482d589d790fc8a24891e1d8c3d34ec88e2dc699e4dfae0303`.

Domain: R.
Independent solution: u = cos(x/2) lies in [-1,1].
Since `1 + cos(x) = 2u^2`, the equation is `u(2u - 1) = 0`.
Retain u = 0 and u = 1/2; no division by u.
Complete families: `pi + 2*k*pi`; `2*pi/3 + 4*k*pi`; `-2*pi/3 + 4*k*pi`.
Original-equation verification: for u = 0 both sides are 0;
for u = 1/2 both sides are 1/2.
The latter two families require a 4*pi increment in x.
Adding 2*pi instead changes u to -1/2 and produces a false solution.

## 315

Exact source snapshot:
```json
{"figure_ids":[],"number":"315","text":"315. $\\operatorname{tg}x-\\operatorname{tg}\\left(\\frac{\\pi}{2}-x\\right)=1$\u3002"}
```
Exercise canonical SHA-256: `9da97a9c7f18b01fd9124c098dc4bf58eb9719d9e26302dbe762488f26be35e9`.

Domain: `R \ {k*pi/2 : k in Z}`.
Both cos(x) != 0 and sin(x) != 0 are required by the two original tangents.
Independent solution: `tan(pi/2 - x) = cot(x)` on this domain.
For finite nonzero t = tan(x), `t - 1/t = 1` iff `t^2 - t - 1 = 0`.
Roots: `(1 + sqrt(5))/2` and `(1 - sqrt(5))/2`.
Complete families: `arctan((1 + sqrt(5))/2) + k*pi`;
`arctan((1 - sqrt(5))/2) + k*pi`.
Original-equation verification: both nonzero roots satisfy `t - 1/t = 1`,
and both full angle families lie in the original domain.
Equivalent one-family form: `arctan((1 + sqrt(5))/2) + k*pi/2`,
because the second root is the negative reciprocal of the first and its
principal angle is the first principal angle minus pi/2.

## 316

Exact source snapshot:
```json
{"figure_ids":[],"number":"316","text":"316. $5\\cos x+12\\sin x=13$\u3002"}
```
Exercise canonical SHA-256: `626dc5164c1aba3fb9506457103b3810bed001965dbf7e47f50e6b0f857bd06f`.

Domain: R.
Independent solution: b = arctan(12/5) is in (0,pi/2),
with cos(b) = 5/13 and sin(b) = 12/13.
The equation is `13*cos(x - b) = 13`, hence `cos(x - b) = 1`.
Complete family: `arctan(12/5) + 2*k*pi`.
Original-equation verification: `5*(5/13) + 12*(12/13) = 13`.
The opposite vector yields -13, not 13; squaring must not introduce it.
The phase identity proves both necessity and sufficiency without squaring.

## 317

Exact source snapshot:
```json
{"figure_ids":[],"number":"317","text":"317. $\\sin x-\\sin2x=0$\u3002"}
```
Exercise canonical SHA-256: `4e43245e8e98624f9e1f11f2b1997daa7b9802c7b0cb83760b4e87814458360c`.

Domain: R.
Independent solution: the equation factors as
`sin(x)*(1 - 2*cos(x)) = 0`.
Retain both sin(x) = 0 and cos(x) = 1/2 without division.
Complete families: `k*pi`; `pi/3 + 2*k*pi`; `-pi/3 + 2*k*pi`.
Original-equation verification: the first family makes both sines zero;
the latter two give `sin(2x) = 2*sin(x)*(1/2) = sin(x)`.
The product's factors exhaust all possibilities; dividing by sine would lose the first family.

## 318

Exact source snapshot:
```json
{"figure_ids":[],"number":"318","text":"318. $1-\\cos x=2\\sin\\frac{x}{2}$\u3002"}
```
Exercise canonical SHA-256: `1a95db15614798fc00abd3491e343e1f338290589e324eefe8f8157a6656f981`.

Domain: R.
Independent solution: u = sin(x/2) lies in [-1,1],
and `1 - cos(x) = 2u^2` gives `u(u - 1) = 0`.
Retain u = 0 and u = 1.
Complete families: `2*k*pi`; `pi + 4*k*pi`.
Original-equation verification: u = 0 gives 0 = 0, and u = 1 gives 2 = 2.
The excluded algebraic non-root u = -1 gives 2 = -2;
specifically x = 3*pi is not a solution.
The odd branch must keep period 4*pi; the full union has that period.

## 319

Exact source snapshot:
```json
{"figure_ids":[],"number":"319","text":"319. $1+\\cos x=2\\cos\\frac{x}{2}$\u3002"}
```
Exercise canonical SHA-256: `e846a3f27dc9150ffbd09c3262ca2fb354357415bbb01e0c1451e44c41ee8c86`.

Domain: R.
Independent solution: u = cos(x/2) lies in [-1,1],
and `1 + cos(x) = 2u^2` gives `u(u - 1) = 0`.
Retain u = 0 and u = 1.
Complete families: `pi + 2*k*pi`; `4*k*pi`.
Original-equation verification: u = 0 gives 0 = 0, and u = 1 gives 2 = 2.
u = -1 fails; x = 2*pi gives 2 = -2.
The second branch must not become every even multiple of pi.
The full union has period 4*pi and is not the solution set of 314 or 318.

## 320

Exact source snapshot:
```json
{"figure_ids":[],"number":"320","text":"320. $\\cos2x=2\\frac{1}{3}\\sin x$\u3002"}
```
Exercise canonical SHA-256: `5e88095a4ea055baa8f50e34b914688b9f7d4437b5276c2aa14b34d65c037028`.

Domain: R.
Independent solution: interpret the mixed number as 7/3.
For s = sin(x) in [-1,1], `1 - 2s^2 = (7/3)s` gives
`6s^2 + 7s - 3 = (3s - 1)(2s + 3) = 0`.
Retain s = 1/3; reject s = -3/2.
Let a = arcsin(1/3). Complete families:
`a + 2*k*pi`; `pi - a + 2*k*pi`.
Original-equation verification: both sides are 7/9 on either family.
The sine-range rejection and the supplementary-angle family are both essential.

## 321

Exact source snapshot:
```json
{"figure_ids":[],"number":"321","text":"321. $\\sqrt{3}\\sin x-\\cos x=0$\u3002"}
```
Exercise canonical SHA-256: `4750f1d00f84a445c7a48d9e0e71322928fa1fc80e94c7339572748304abdf21`.

Domain: R.
Independent solution: the expression is `2*sin(x - pi/6)`,
so the equation is equivalent to `sin(x - pi/6) = 0`.
Complete family: `pi/6 + k*pi`.
Original-expression verification: cos(x) = `(-1)^k*sqrt(3)/2`
and sin(x) = `(-1)^k/2`, giving zero.
Cosine-zero angles cannot solve the original expression;
if a tangent reduction is used, its justified value is 1/sqrt(3).
There is no restriction to the principal angle.

## 322

Exact source snapshot:
```json
{"figure_ids":[],"number":"322","text":"322. $\\cos x+\\sin x=0$\u3002"}
```
Exercise canonical SHA-256: `84f6c6c902f517f161067c806f772fab372cdf3d0168381921cc57408f087a3c`.

Domain: R.
Independent solution: the expression is `sqrt(2)*sin(x + pi/4)`,
so `sin(x + pi/4) = 0`.
Complete family: `-pi/4 + k*pi`, equivalently `3*pi/4 + k*pi`.
Original-expression verification: sin(x) = -cos(x) throughout the family.
Cosine-zero angles cannot solve the original equation because sine is then +/-1.
Thus the alternative tangent reduction tan(x) = -1 is exhaustive when its division is justified.

## 323

Exact source snapshot:
```json
{"figure_ids":[],"number":"323","text":"323. $\\cos^2x-3\\sin x\\cos x=-1$\u3002"}
```
Exercise canonical SHA-256: `02b178e74b71f90cbd257360689c45feeb0aa026bdb47d886df5d679d6baf00c`.

Domain: R.
Independent solution: moving the constant and substituting
`1 = sin(x)^2 + cos(x)^2` yields
`(sin(x) - cos(x))*(sin(x) - 2*cos(x)) = 0`.
Cos(x) = 0 is not a solution of the original equation, which would read 0 = -1.
Justified division therefore gives tan(x) = 1 or 2,
equivalently `t^2 - 3t + 2 = 0`.
Complete families: `pi/4 + k*pi`; `arctan(2) + k*pi`.
Original-equation verification: `(1 - 3t)/(1 + t^2) = -1`
at each of t = 1 and t = 2.
The factorization and the cosine-zero check establish completeness.

## 324

Exact source snapshot:
```json
{"figure_ids":[],"number":"324","text":"324. $3\\cos^2x=4\\sin x\\cos x-\\sin^2x$\u3002"}
```
Exercise canonical SHA-256: `952663342962cb01bf1616abf4035ffd1ccab3607063cde644f8adadeefba5b7`.

Domain: R.
Independent solution: moving all terms yields
`(sin(x) - cos(x))*(sin(x) - 3*cos(x)) = 0`.
Cos(x) = 0 would make the original equation 0 = -1, not a solution.
Justified division therefore gives `3 = 4t - t^2`,
or `(t - 1)(t - 3) = 0`, with t = tan(x).
Complete families: `pi/4 + k*pi`; `arctan(3) + k*pi`.
Original-equation verification: at t = 1 both sides are 3/2;
at t = 3 both sides are 3/10.
Both roots are retained. The first family matches 323, but the second does not.

## Source-Only Relationships For Later Review

These are independently derived mathematical relationships, not findings about an undisclosed candidate.

- 311 and 312 have identical full solution sets; their rejected sine roots differ.
- 313 and 323 share the `arctan(2) + k*pi` family but do not have identical solution sets.
- 314 and 319 share the odd-pi family but differ on the other half-angle roots.
- 318 excludes x = 3*pi; 319 excludes x = 2*pi. Signed half-angle values matter.
- 323 and 324 share the `pi/4 + k*pi` family but their second tangent roots are 2 and 3.
- 315's two tangent roots form one pi/2-periodic family; a positive-root-only pi-periodic family is incomplete.
- Every selected written equation is retained here. No source task has been deferred or omitted from Stage1 solving.
- No finite interval, candidate question, option set, key, or claimed production limitation has been disclosed.

## Wait State

Stage1 source freeze complete. Stage2 has not begun.
Await explicit visible-only disclosure; at most the two authorized later view
screenshots may be opened after that instruction, within unchanged image/context limits.
Do not autonomously open author drafts, intents, keys, solutions, or other author material.
No candidate approval or semantic-gate pass is authorized by these source solutions.
