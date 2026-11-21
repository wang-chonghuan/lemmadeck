# n47 Stage3 key-last comparison

Parent-agent dispatch continuation of delegated offline STEMROBIN-184/184-6.
Parent reports FULL intake of both Stage2 payloads and external manifest with
all three frozen bindings checked: `intake0408a5/control d8026a42`.
No new ticket, backend workflow or peer message is involved.

All executions explicitly use
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck` as cwd.
Exclusive new writes are the owned Stage3 tree and external Stage3 manifest.
Original Stage1/Stage2 files remain frozen and were not reopened or changed.
Source solving and all-option mathematical review are reused, not replayed.

## New input binding

Sole new semantic content, read in full:
`.tmp/stemrobin-184-six/n47-choice-author/draft.json`.

- Raw SHA-256: `ee50c1a8e18e392e65ce13f197564a52145b3c60494b053af2b7e68e4794ae68`
- Canonical SHA-256: `830d747a358c42012b48cdde96b4a40cf09d990806eef4a80373f6936323d0c4`
- Seed digest claim: `0fb25f75af6cb074a20699b17b9abef4ffa4561f5d38093ca8a026c45bfbcdb9`
- Canonical view projection: `fa306cbdf63e1bfc9a929597fde5c17d2e34cba1e9ddbc249de811e6b93c3711`
- That view projection exactly matches the retained frozen Stage2 binding.
- Four complete intents, sixteen rationale/misconception records, four keys and
  four coverage entries were compared; `new_figures` is empty.

The embedded source solutions cite `independent-solutions.md`. That forbidden
file was not opened, hashed, checked for existence or used to verify author
provenance. Only the draft's embedded mathematical claims were compared against
the separate cold reviewer's already frozen results. Exact prior bindings and
comparison/read/execution/image ledgers are in `comparison-ledger.json`.

## Key and rationale comparison

All author sets agree with the frozen independent complete sets:

| Question | Independent | Author |
| --- | --- | --- |
| `n47-affine-positive` | `{A}` | `{A}` |
| `n47-affine-negative` | `{C}` | `{C}` |
| `n47-quadratic-numerator` | `{B}` | `{B}` |
| `n47-parameter-family` | `{D}` | `{D}` |

Only new rationale mechanisms are checked here; option truth is reused from
Stage2. Every false option remains false and every stated mechanism actually
generates the displayed alternative:

| Question/option | New rationale claim checked |
| --- | --- |
| positive A | Correct numerator `-1`, squared denominator and both evaluations agree. |
| positive B | Reversed subtraction gives numerator `1` and the entire positive triple. |
| positive C | Missing square gives the first-power formula and values `-1,-1/4`. |
| positive D | Ratio of derivatives `2/3` gives the repeated constant triple. |
| negative A | Reversed products give numerator `7` and positive evaluations. |
| negative B | Wrong denominator derivative `+3` gives `11-12s`, then `11,-1/4`. |
| negative C | Correct denominator derivative `-3` gives the true quadruple. |
| negative D | Wrong partial-derivative reading holding `y` fixed gives exactly the isolated `g'(x)=0`; other entries remain correctly computed. |
| quadratic A | Addition instead of subtraction gives `2t+18t^2`, then `0,20/49`. |
| quadratic B | Correct subtraction and square give the true triple. |
| quadratic C | Missing square gives the displayed formula and `0,8/7`. |
| quadratic D | Ratio `2t/6=t/3` gives the displayed formula and `0,1/3`. |
| family A | Reversal gives `bc-ad`. The claimed determinant-zero coincidence is true; wrongly generalizing that subfamily agreement is a selection error, not a new formula. |
| family B | Omitting `uv'` leaves `aQ/Q^2=a/Q` and every displayed substitution. |
| family C | Correct determinant with a first-power denominator generates the displayed tuple. |
| family D | Correct determinant cancellation, square and separately permissible substitutions agree for the whole family. |

Correct-option misconceptions are null. All twelve false-option mechanisms
are concrete and match their displayed results; none relies on importing an
unread answer or normalizing the independent truth to the author key.

## Units, coverage and retained losses

The complete triples/quadruples are meaningful linked-result units, not isolated
click conversions. The negative denominator and mixed argument names distinguish
379; the surviving quadratic term distinguishes 380; universal symbolic
parameters and separately conditional evaluations distinguish 381.
All 14 source outputs are represented, with exact one-source/one-unit coverage
mapping and no silently deferred derivative expression or evaluation.

These losses remain part of the review:

- Recognition does not demonstrate independently writing the derivation,
  simplification, renamed expressions or substitutions. One discriminating
  component can select a whole tuple.
- `h'(0)=0` is in every alternative, so it is represented but has no independent
  discriminating power. The author's representation claim is not promoted to
  separate assessment of that evaluation.
- Domain exclusions and the undefined/no-extension convention are supplied,
  not independently discovered.
- Special parameter cases are covered by conditional applicability, not
  elicited as separate learner response units.
- A solved family identity can reduce repeated affine derivation after genuine
  coefficient/argument substitution. This is mathematical transfer, not a
  premarked answer; the quadratic task remains distinct.

The parameter-family quantifier is universal over arbitrary real constants.
Special-member coincidences of A,C,D when `ad-bc=0`, B,D when `c=0`, or all
four for zero-derivative members do not make false alternatives family identities.
The retained Stage2 witness `a=2,b=1,c=1,d=2,x=2,y=3` distinguishes every pair.

Every original parameter case is preserved: empty domain `c=d=0`; linear/constant
case `c=0,d!=0`; determinant-zero punctured domain; nonzero-determinant punctured
domain. At the numeric inputs, both values can exist; only 0 can fail
(`d=0,c!=0`); only 1 can fail (`d!=0,c=-d`); or both fail (`c=d=0`).
No zero numerator or cancellation fills a hole, and the x/y conditions are
independent. No global `c!=0`, `d!=0`, `c+d!=0` or determinant-nonzero assumption
is imposed. The source's implicit fixed-real-parameter convention is explicit
in the unchanged view.

Semantic contract outcome: **pass**, with the above capacity limitations.
No semantic discrepancy requiring revise/blocked was found in the released
author rationale, intent or coverage claims. This does not establish provenance
of the unread author citation or imply independent written learner production.

## Authorized official validation

Exactly one first official with-review validation is authorized:

```text
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .tmp/stemrobin-184-six/n47-choice-release/stage1/seed.json --draft .tmp/stemrobin-184-six/n47-choice-author/draft.json --review .tmp/stemrobin-184-six/n47-choice-review/stage3/review.json
```

The command was executed exactly once with the exact argv from the comparison
ledger, using standard-library process capture to keep stdout and stderr separate.
Its authorized live-source projection/freshness refresh is mechanical evidence,
not new semantic authority or permission to manually inspect live files.
Actual stdout, stderr, exit and signal are recorded in
`validation-receipt.json`; no inspect/prepare or no-review replay is run.

Actual first capture, S3E05:

```text
stdout: mechanical checks passed; declared semantic review: pass (not automatically proved)
stderr: ""
exit: 0
signal: null
spawn_error: null
```

Stdout contains one terminating newline, preserved exactly in the JSON receipt.
The wrapper also exited 0. Exactly one official with-review run occurred; no
technical failure, recovery or rerun. Semantic review outcome remains **pass**;
mechanical validation passed but does not automatically prove the mathematics.
The contract review was not changed after this successful validation.

## Ledger and freeze

S3E01 reads only the full draft. S3E02 binds its hashes and checks the exact visible
projection against the retained Stage2 digest. S3E03 creates the exclusive new
directory. S3E04 manually creates the contract review and records by `apply_patch`.
The exact validation receipt, bounded four-file Stage3 manifest and final text
receipt will attest remaining execution, hashes and modes without self-hash
recursion. All new files and external manifest will be `0444`, Stage3 tree `0555`.

Images `0/0`. No new images, screenshots, crops, reopens, symbolic/math service,
other author file, answer/history, source168 record, credentials, network/paid
call, DB/publish/app change, new chat/worktree or peer message was used.
No semantic source refresh or option-truth replay was performed.

STOP after frozen text-only handoff. Parent FULL intake and actual close remain
parent-owned; this reviewer performs no further backend, ticket or close action.
