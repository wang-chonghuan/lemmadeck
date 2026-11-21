# n47 Stage1 independent source review

This is a **parent-agent dispatch checkpoint**, continuing delegated offline
STEMROBIN-184/184-6 production. It is not a new human instruction, a new ticket
or a final choice review. Stage2 and Stage3 have not been released.

Reviewer: SOLE cold independent n47 CHOICE REVIEWER, `independent_agent`.
All executions explicitly use
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck` as cwd.
Exclusive writes: `.tmp/stemrobin-184-six/n47-choice-review`.
The previously absent owned directory was successfully created without redirect.
No other agent's files were changed or reverted.

## Input binding

Sole mathematical authority, read in full:
`.tmp/stemrobin-184-six/n47-choice-release/stage1/seed.json`.

- Raw SHA-256: `9bdc14118ca1de9d478f6732bec9d4b454af806308039ebc9e1e89f3ad34fcec`
- Canonical SHA-256: `0fb25f75af6cb074a20699b17b9abef4ffa4561f5d38093ca8a026c45bfbcdb9`
- Book `9c`; lesson `ana9-c4-s2-n47`; exercises 378-381; concept block 0.
- Four exercises, 14 requested results, no figures or figure references.
- Embedded source trace is seed metadata only. No trace target, live lesson,
  source page, PDF, native source or historical math answer was opened.

Canonicalization follows the contract's sorted-key, ASCII-escaped, compact JSON
SHA-256 convention. The exact guidance bindings are in `source-review.json`.
Only the three allowed choice guidance files, the shared Image batches section
and the technical production-resume contract were read. The image skill was
located by headings, then read only at lines 30-46.

## Independent method

Use only the supplied theorem:
`(U/W)'=(U'W-UW')/W^2` where `W` is nonzero.
For a fixed linear expression, its difference quotient is its slope.
For a quadratic numerator,
`((s+q)^2-s^2)/q=2s+q`, whose limit is `2s`.
These elementary derivatives and the supplied theorem yield all results below.
No symbolic engine, math service, imported answer or author reasoning was used.

The input names of a function are dummy variables. A request such as `g'(x)`
means evaluate the derivative function at argument `x`; it does not mean
differentiate the displayed `g(y)` with respect to an unrelated symbol.
Differentiate first, then substitute or rename the argument.

## Source 378

`f(x)=(1+2x)/(1+3x)` has domain `x!=-1/3`.

At a permissible argument `s`,
`f'(s)=[2(1+3s)-3(1+2s)]/(1+3s)^2=-1/(1+3s)^2`.

| Request | Result | Condition |
| --- | --- | --- |
| `f'(y)` | `-1/(1+3y)^2` | `y!=-1/3` |
| `f'(0)` | `-1` | Defined |
| `f'(1)` | `-1/16` | Defined |

Preserve the quotient subtraction, squared denominator, explicit `y` argument
and both derivative evaluations. Evaluating `f` itself is a different task.

## Source 379

`g(y)=(2y-3)/(1-3y)` has domain `y!=1/3`.

At a permissible argument `s`,
`g'(s)=[2(1-3s)-(2s-3)(-3)]/(1-3s)^2`
`=(2-6s+6s-9)/(1-3s)^2=-7/(1-3s)^2`.

| Request | Result | Condition |
| --- | --- | --- |
| `g'(y)` | `-7/(1-3y)^2` | `y!=1/3` |
| `g'(x)` | `-7/(1-3x)^2` | `x!=1/3` |
| `g'(0)` | `-7` | Defined |
| `g'(1)` | `-7/4` | Defined |

Both named symbolic requests must remain covered even though they use the same
derivative map. Subtracting the negative denominator derivative matters.
At 1 the denominator is `-2`, but its square is positive 4.

## Source 380

`h(t)=t^2/(1+6t)` has domain `t!=-1/6`.

`h'(t)=[2t(1+6t)-6t^2]/(1+6t)^2`
`=(2t+6t^2)/(1+6t)^2=2t(1+3t)/(1+6t)^2`.

| Request | Result | Condition |
| --- | --- | --- |
| `h'(t)` | `2t(1+3t)/(1+6t)^2` | `t!=-1/6` |
| `h'(0)` | `0` | Defined; denominator is 1 |
| `h'(1)` | `8/49` | Defined; numerator is 8, denominator is 49 |

Factored and expanded numerator forms are equivalent on the original domain.
The `2t` term cannot be discarded. `h(1)=1/7` is not the requested derivative.

## Source 381

Interpret `a,b,c,d` as fixed real parameters, without assuming any is nonzero.
The seed does not explicitly declare this convention; its consequence is
recorded below. Use numerator `U` and denominator `W` to avoid confusing the
function named `v` with the theorem's denominator name.

`v'(s)=[a(cs+d)-c(as+b)]/(cs+d)^2`
`=(acs+ad-acs-bc)/(cs+d)^2=(ad-bc)/(cs+d)^2`.

| Request | Result | Condition |
| --- | --- | --- |
| `v'(x)` | `(ad-bc)/(cx+d)^2` | `cx+d!=0` |
| `v'(y)` | `(ad-bc)/(cy+d)^2` | `cy+d!=0` |
| `v'(0)` | `(ad-bc)/d^2` | `d!=0`; otherwise undefined |
| `v'(1)` | `(ad-bc)/(c+d)^2` | `c+d!=0`; otherwise undefined |

The original domain and derivative domain are both
`{s in R : cs+d!=0}`. Complete parameter classification:

| Parameters | Domain | Derivative |
| --- | --- | --- |
| `c=d=0` | Empty | No derivative at any argument, even if `a=b=0` |
| `c=0,d!=0` | All real inputs | `a/d` everywhere |
| `c!=0,ad-bc=0` | All real inputs except `-d/c` | Zero on this punctured domain only |
| `c!=0,ad-bc!=0` | All real inputs except `-d/c` | `(ad-bc)/(cs+d)^2`, nonzero there |

In the determinant-zero case, `b=ad/c` and
`as+b=(a/c)(cs+d)`. This proves constancy on the domain, but does not supply a
value or derivative at its hole. A cancelled expression is not a newly
authorized extended function.

The two numeric evaluations also need all cases:

| Parameters | `v'(0)` | `v'(1)` |
| --- | --- | --- |
| `d!=0,c+d!=0` | `(ad-bc)/d^2` | `(ad-bc)/(c+d)^2` |
| `d=0,c!=0` | Undefined | `-b/c` |
| `d!=0,c=-d` | `(a+b)/d` | Undefined |
| `c=d=0` | Undefined | Undefined |

For `d=0,c!=0,b=0`, the derivative is zero away from 0, not at 0.
For `d!=0,c=-d,a+b=0`, the derivative is zero away from 1, not at 1.
If `a=b=0`, zero numerator still does not make a zero denominator permissible.
Undefined is neither zero nor infinity.

## Coverage and conventions

All 14 original requested results are independently solved: counts 3, 4, 3, 4.
No source result is omitted. Actual choice-package coverage remains unassessed
because no visible question has been released.

Stage2 obligations are bound now: preserve every mixed argument request,
derivative-vs-function evaluation, quotient sign and square, domain exclusion,
and the parameter/domain cases of 381. A visible parameter narrowing must account
for what source coverage it loses; the seed supplies no blanket `c!=0`, `d!=0`,
`c+d!=0` or `ad-bc!=0` assumption. Equivalent algebraic expressions remain valid
only with the original domain.

Unresolved explicit wording: 381 does not state the type or constancy of
`a,b,c,d`. The standard fixed-real-parameter convention is used openly.
If instead any letter denotes an input-dependent function, its derivatives and
domain are missing; these results cannot be asserted under that interpretation.
No arithmetic, argument-renaming or hole-filling ambiguity remains under the
recorded convention.

No choice-mode, task-fidelity, redundancy, leakage, option-truth, key comparison
or package-approval verdict is issued at Stage1. Recognition alone is not an
automatic failure; future capacity loss must be recorded and judged from the
actual visible task.

## Read, execution and image ledger

The structured ledger in `source-review.json` records E01-E13, their successful
exit codes, each input extent and its binding. These cover ROOT confirmation,
the allowed reads/hashes, seed-only metadata computation and the two exclusive
directory creations. No technical failure or directory redirect occurred.

Manual artifact creation uses `apply_patch` only. Closing execution is separately
attested in the bounded manifest and final text receipt:

1. E14 verifies the two Stage1 files, JSON structure, all 14 request records,
   recorded input digests and byte hashes using Node standard libraries only.
2. E15 creates `../stage1-manifest.json` with the exact two-file Stage1 inventory,
   hashes, sizes and E14 receipt. Keeping it outside Stage1 avoids a self-hash
   recursion while listing every file in the Stage1 tree.
3. E16 verifies that manifest and the unchanged seed binding, freezes both
   payloads and the manifest to `0444`, freezes the Stage1 directory to `0555`,
   then rechecks all hashes, exact inventory and modes and prints the receipt.

There are zero image opens out of a zero image budget, zero generated images,
screenshots, crops or reopens. The seed contains no figures. Parent-only image
exhaustion `24/24` does not transfer usage or authorize additional images.
No network, symbolic/math service, paid call, inspect/prepare/validate, live lesson,
answer key, author derivation, previous choice, forbidden directory or peer
message was used.

## Parent consume gate

The parent must verify the bounded manifest and consume **both frozen Stage1
payloads before releasing any visible questions**. The manifest covers the
entire two-file Stage1 tree and is itself bound by the final text SHA-256 receipt.
Future options or keys must not rewrite this independent source solution.

STOP after text-only Stage1 handoff. Await an explicit Stage2 VIEW-FIRST release
in this same context. Stage3 key-last comparison is also unreleased.
