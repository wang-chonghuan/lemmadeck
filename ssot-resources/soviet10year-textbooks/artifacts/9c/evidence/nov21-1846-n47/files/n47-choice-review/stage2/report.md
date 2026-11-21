# n47 Stage2 view-first review

Parent-agent dispatch continuation of delegated offline STEMROBIN-184/184-6.
This is not a new human instruction or final contract review.
Parent reports FULL Stage1 intake and all three frozen bindings checked:
`intake3f5431/control57751dba`. These identifiers are dispatch metadata only.
Original Stage1 remains frozen; neither its files nor seed were reopened,
rehash-verified, edited or subjected to a source/structural-proof rerun.

All executions explicitly use
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck` as cwd.
Only `.tmp/stemrobin-184-six/n47-choice-review/stage2` and its external
`stage2-manifest.json` are written during this stage.

## Input and independence

Sole new content, read in full:
`.tmp/stemrobin-184-six/n47-choice-release/stage2/views.json`.

- Raw SHA-256: `bcf892c29252d7e233c7573e354d7064cbc3c324ba2c7cc6795133f467839667`
- Canonical SHA-256: `fa306cbdf63e1bfc9a929597fde5c17d2e34cba1e9ddbc249de811e6b93c3711`
- Four visible questions; sixteen visible options; all are native `single`.
- No images or figure references.
- Retained Stage1 bindings and guidance are used from the same context, not
  from new reads. Exact retained bindings appear in `view-review.json`.
- No author intent, solution, misconception, correct set or coverage is exposed.

## Fidelity first

S2E04 persists this section and corresponding JSON findings **before** option
mathematics is started. Fidelity, redundancy and leakage remain separate from
the later mathematics gate.

| Question | Fidelity, redundancy and leakage findings |
| --- | --- |
| `n47-affine-positive` | Original function, all three ordered results and the `y` exclusion are retained. Whole-triple recognition requires derivative/evaluation judgment. A discriminating numeric entry can eliminate triples without independently writing every component. |
| `n47-affine-negative` | Both `g'(y)` and `g'(x)`, plus both numeric derivatives, are retained with separate exclusions. C and D differ specifically at the mixed `x` argument, so that distinction remains assessed. No other stem supplies the named quadruple. |
| `n47-quadratic-numerator` | The quadratic numerator and all three source slots remain. Every option gives zero at `h'(0)`, so this slot is covered but not independently discriminating. The symbolic derivative or `h'(1)` still requires mathematical judgment. |
| `n47-parameter-family` | Arbitrary real constants resolve the Stage1 implicit-parameter convention. Family identities and separate entry conditions preserve all zero/degenerate cases; no simultaneous nonzero requirement or hole extension is introduced. The domain rule is supplied, not separately tested. |

All twelve per-question fidelity/redundancy/leakage checks are `pass` with the
concrete recognition losses recorded, not silently treated as written production.
No option is marked correct; common domain language supplies applicability,
not numerator sign or denominator power. Source numbers are internal metadata.

The generic family overlaps the two affine examples. An established identity
can support them after coefficient/argument substitution, reducing repeated
derivation. This is mathematical transfer, not copying a premarked named answer.
The quadratic numerator remains distinct. All 14 source-result slots are visible;
tuple recognition and reasonable elimination do not by themselves fail fidelity.
These findings assert no option truth or author-key agreement.

## Independent option mathematics

S2E05 follows the persisted fidelity-first record. Independently solve the
released visible assertions using the retained supplied quotient theorem, not
an original-source rerun, author solution or symbolic service.

| Question | Independent derivative and complete true set |
| --- | --- |
| `n47-affine-positive` | `[2(1+3s)-3(1+2s)]/(1+3s)^2=-1/(1+3s)^2`; evaluations `-1,-1/16`. True set `{A}`. |
| `n47-affine-negative` | `[2(1-3s)-(2s-3)(-3)]/(1-3s)^2=-7/(1-3s)^2`; evaluations `-7,-7/4`. True set `{C}`. |
| `n47-quadratic-numerator` | `[2t(1+6t)-6t^2]/(1+6t)^2=(2t+6t^2)/(1+6t)^2`; evaluations `0,8/49`. True set `{B}`. |
| `n47-parameter-family` | `[a(cz+d)-c(az+b)]/(cz+d)^2=(ad-bc)/(cz+d)^2` on each entry's respective domain. True set `{D}` as a universal family identity. |

Every option is checked separately in JSON. Concrete checks for all sixteen:

| Question/option | Truth and evidence |
| --- | --- |
| positive A | True: formula and both numeric entries match. |
| positive B | False: positive values reverse the strictly negative derivative and both numeric signs. |
| positive C | False: first-power denominator agrees only at `y=0`; final `-1/4` differs from `-1/16`. |
| positive D | False: positive constant `2/3` cannot equal the derivative anywhere in the real domain. |
| negative A | False: both symbolic and numeric signs reverse the negative derivative. |
| negative B | False: numerator `11-12s` equals the required `-7` only at `s=3/2`; its numeric entries `11,-1/4` are not `-7,-7/4`. |
| negative C | True: both named argument formulas and both numeric values match. |
| negative D | False: three entries match but `g'(x)=0` fails at every permissible real `x`. |
| quadratic A | False: symbolic error is `12t^2/(1+6t)^2`; final `20/49` is not `8/49`. |
| quadratic B | True: expanded and factored correct numerators are equivalent on the original domain; both values match. |
| quadratic C | False: symbolic error is `12t^2(1+3t)/(1+6t)^2`; equality only at `0,-1/3` is not an identity; final `8/7` is not `8/49`. |
| quadratic D | False: at admissible `t=1`, `1/3` is not `8/49`; first-entry difference is `t(36t^2-6t-5)/[3(1+6t)^2]`. |
| family A | False universally: its difference from the derivative is `-2Delta/Q^2`; agrees only in determinant-zero members. |
| family B | False universally: its difference is `c(az+b)/Q^2`; some zero/linear members or individual numerator-zero inputs coincide, not the whole family. |
| family C | False universally: its difference is `Delta(Q-1)/Q^2`; determinant-zero or denominator-one coincidences are not universal validity. |
| family D | True: the quotient theorem yields every entry on its separate nonzero-denominator domain, including all allowed degenerate cases. |

All four math checks are `pass` with independently derived singleton true sets.
This is not a statement of agreement with the unreleased author key.

## Family identities and degeneracies

Write `Delta=ad-bc`, `Q(z)=cz+d`. The word **identities** quantifies over all
real constant parameter choices, and over each entry's own admissible input.
It does not ask which alternatives happen to match one chosen member, or
require all four denominators to be nonzero simultaneously.

One admissible witness distinguishes all alternatives, pairwise:
`a=2,b=1,c=1,d=2,x=2,y=3`. The respective denominators are `4,5,2,3`,
all nonzero, and `Delta=3`.

| Option | Witness tuple |
| --- | --- |
| A | `(-3/16,-3/25,-3/4,-1/3)` |
| B | `(1/2,2/5,1,2/3)` |
| C | `(3/4,3/5,3/2,1)` |
| D | `(3/16,3/25,3/4,1/3)` |

Thus every false alternative fails every entry at this admissible member.
Coincidences elsewhere do not make any two alternatives equivalent identities
for the whole family.

The complete parameter-domain partition is:

| Case | Actual derivative and candidate coincidences |
| --- | --- |
| `c=d=0` | Original domain empty; every derivative is undefined. No `0/0`, cancellation extension or vacuous-subfamily universal approval. |
| `c=0,d!=0` | Derivative `a/d`. A reduces to `-a/d`, B and D to `a/d`, C to `a`. All four coincide if `a=0`; C also agrees when `d=1`. |
| `c!=0,Delta=0` | Derivative zero on the punctured original domain. A,C,D coincide there; B equals them only if `a=0`, forcing `b=0`. The hole remains excluded. |
| `c!=0,Delta!=0` | Derivative nonzero on the punctured domain. A never agrees; B can agree only at an allowed numerator-zero input; C only at an input where `Q=1`. None supplies another whole-domain identity. |

Numeric applicability is also completely split:

| Case | `v'(0)` | `v'(1)` |
| --- | --- | --- |
| `d!=0,c+d!=0` | `Delta/d^2` | `Delta/(c+d)^2` |
| `d=0,c!=0` | Undefined | `-b/c` |
| `d!=0,c=-d` | `(a+b)/d` | Undefined |
| `c=d=0` | Undefined | Undefined |

For `d=0,c!=0,b=0`, A,C,D vanish only away from the excluded input 0;
B also vanishes if `a=0`. For `d!=0,c=-d,a+b=0`, the analogous hole is 1.
For `a=b=0`, all expressions vanish wherever applicable but no zero-denominator
input is restored. For `a=0,b!=0,c!=0`, B is zero while the actual derivative
is nonzero. Independent `x` and `y` may have different applicability.

These pointwise and subfamily equalities are explicitly distinguished from
universal identities. No author misconception derivation or key is consulted.

## Ledgers and closure

S2E01 reads the entire new view file. S2E02 computes only its raw/canonical hashes
and visible identifier/figure inventory. S2E03 successfully creates the owned,
previously absent Stage2 directory without redirect. S2E04 uses `apply_patch`
to persist fidelity-first records while mathematics is `not_started`.

S2E05 adds independent option mathematics after S2E04. S2E06 will check only the two new
Stage2 files, their new view binding, option accounting and byte hashes using
standard libraries, not rerun the original source proof. S2E07 will create the
bounded external manifest. S2E08 will verify and freeze both payloads and manifest
to `0444` and Stage2 tree to `0555`, then recheck hashes, modes and inventory.
The manifest is outside Stage2 to avoid self-hash recursion; its own hash and
actual freeze completion will be attested by the final text receipt.

Images `0/0`; no generated images, screenshots, crops or reopens.
No original source, answer/history/live file, author field, inspect/prepare/validate,
symbolic/math service, network/paid call, DB, publish, app change, credential read,
new chat/worktree or peer message was used. Structured ledgers and bindings
are in `view-review.json`.

STOP after frozen text-only Stage2 handoff. Parent FULL intake must precede
explicit same-context Stage3 release. No final contract review is written here.
