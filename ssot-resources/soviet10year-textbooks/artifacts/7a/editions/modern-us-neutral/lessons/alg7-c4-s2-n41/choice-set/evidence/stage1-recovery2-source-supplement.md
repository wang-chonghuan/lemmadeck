# n41 Stage1 Recovery2: Direct 843.b Lookup Complete

Ticket: STEMROBIN-182.
Checkout: /Users/yong/.codex/worktrees/d9b1/lemmadeck.
Recorded: 2026-11-19T05:24:09Z.
Affected scope: ONLY the missing direct root-10 cell and finite-cell subtraction
for 843.b. No image is opened and no completed source solution is repeated.

## Preserved Evidence

Initial source solution freeze:
`source-solutions.md`,
SHA-256 3aa82b9397e58105bdc6460ae0690394795ecf11caaf49d5f6dd95cf39bf735c.

Initial BLOCKED receipt:
`stage1-receipt.json`,
SHA-256 e41466a3330a89376dd65ab4147f3d732eee108af8c1100b02f125be6166c1b4.

RECOVERY1 receipt:
`stage1-recovery-receipt.json`,
SHA-256 436dece8f23ebcbf67777c5dd200dc93eb0c7072bd4ce52cb8fd62c2fa5e967a.

RECOVERY1 current-image ledger:
`stage1-recovery-image-ledger.json`,
SHA-256 270e935b8acb79b0df3a2680fa969e555416d95e30b790aee1c7aae799fb4031.

All nine files from the initial and RECOVERY1 freezes remain unchanged and
0444. Their initial blocked states, actual tool failures, and contained
non-rule metadata exposure limitation are preserved, not rewritten.
The limitation is disclosed; per the parent's direction it is NOT a permanent
approval gate. No non-rule packet reference is opened.

## Actual New Source Capture

Parent-authorized source-only input:
`.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/bradis-cell-review/capture-38.json`

- Bytes: 3850.
- SHA-256: b784dc5059c147378f9d5dd15bc8fecbf1d9a1e7730819838d33712a61dc9c07.
- Stage declared by the capture: independent-pixels-only.
- Table: "IV"; PDF image: 38; printed page: "37".
- Literal row string: "10,". The trailing decimal comma is preserved, not
  replaced with the parent's shorthand "10".
- Literal main column: "0".
- Literal printed main value: "3,162".
- Corrections: [].
- next_main: null.
- Status: "READ".

The main column zero appended to the row's decimal comma gives argument
10.0. This is an exact main-table address, so no interpolation or correction
is needed. The printed root string is read from the ACTUAL file, not taken
from the parent's assertion or computed by a square-root evaluator.
Other cell records in the allowed capture supply no algebra or key and are
not used to solve another task.

## Only the Affected Finite-Cell Subtraction

Reuse the already frozen exact result for 843.b: sqrt(10)-sqrt(7).
Do not rationalize it again.

Reuse the already frozen root-7 binding from `source-bindings.json`:

- Capture: n41-table-cell-source/capture-37.json.
- Capture SHA-256:
  974f211b10f15ca84037706e0a2ace0d237da8b7361419b7e3472889e907859c.
- Table IV, row "7,0", main column "0", printed "2,646".
- No correction; null correction cells are not asserted to be printed zeroes.

New direct table arithmetic, performed in integer thousandths:

3162 - 2646 = 516.

Thus the direct table evaluation of the frozen exact expression is
3.162 - 2.646 = **0.516**.

This is the finite-cell table approximation, not the exact radical value.
Under the already admitted direct-main-entry half-last-unit rule, each root
has error <=0.0005, so the difference has absolute error <=0.001.
No guarantee that 0.516 is the correctly rounded true result to three decimals
is inferred. No new rounding rule, reciprocal of a rounded denominator,
optional alternative route, or remembered missing cell is substituted.

## Completed Source Freeze and Boundary

Effective Stage1 evidence is the immutable initial freeze plus RECOVERY1 plus
this affected-only RECOVERY2 supplement:

- Source exercises: 17.
- Independent exact task solutions: 80/80 retained; repeated in Recovery2: 0.
- Direct literal table obligations: 11 retained + 1 new = 12/12 complete.
- Current full hash-bound graph views: 2/2 retained from RECOVERY1.
- Successful image opens: 4 cumulative; Recovery2 opens: 0.
- Missing source cells and current-view gaps: 0.
- Choices, learner views, author solution/key reads, canonical comparisons: 0.

The SVG display failure was already resolved by the parent's authorized current
PNG views in RECOVERY1. Neither those PNGs nor the original raw images are
opened again, and no figure source-fidelity gate or full review/test is repeated.

Stage1 source evidence is now COMPLETE and frozen before any choice disclosure.
This is NOT a semantic choice-review approval or a self-independent approval.
STOP before Stage2. Await direct parent authorization for learner-view review;
Stage3 author/key comparison remains separately unauthorized.
