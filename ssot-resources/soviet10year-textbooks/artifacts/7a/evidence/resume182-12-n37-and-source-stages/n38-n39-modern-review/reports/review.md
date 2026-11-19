# Independent Modern Text/Math Review

Scope: STEMROBIN-182, same invocation, finish review, offline. Every operation used
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`. Only this review's reports/probes were
written. Images opened/read/reviewed: **0**. Figure 55 approval: **not performed**.

## Verdicts

| Target | Verdict | Scope |
| --- | --- | --- |
| n38 finalized lesson | PASS | All 21 source-bound prose blocks, 22 final paragraphs |
| n38 finalized exercises | PASS | All 7 exercises, 799 through 805 |
| n39 frozen lesson template | REVISE | All 28 prose blocks read; precision claim R1 below |
| n39 frozen exercises template | PASS | All 14 exercises, 806 through 819; 819 text only |
| n39 Figure 55 placeholder | NOT REVIEWED | Metadata preserved; no figure approval |

## Finding R1

**[P2] n39's half-unit guarantee is too broad for its own retained correction example.**
Location: `lesson.template.json`, `/prose/10/text`, line 192; the associated
correction guarantee is `/prose/16/text`, line 294. Example 3 is `/prose/9/text`,
line 175. Source bindings: `p0238#4`, `p0238#5`, `p0238#11`.

The example faithfully adds three thousandths to 6.731, giving 6.734 for
`sqrt(45.34)`. However, the following general statement guarantees absolute error
at most half of the last retained unit, here 0.0005. The true error is about
0.000501652187, slightly larger. This is demonstrable without floating-point
rounding: `6.7335^2 = 45.34002225 > 45.34`, so the positive root is below 6.7335,
and its distance from 6.734 exceeds 0.0005 exactly.

This is an **inherited precision-claim inconsistency**, not formula/transcription
drift and not a newly registered erratum. 6.734 remains a valid approximate result
of the described table-correction workflow. No source edit, new erratum, or
replacement formula is proposed or authorized. Required revision is to clarify
the precision guarantee's scope in the modern explanation so it is not asserted
for that corrected result. Any clarification must be authorized within the
source-preserving contract and retain all source snapshots, identities, numerals,
and formulas. If the claim's scope cannot be clarified within that contract, the
parent must retain the explicit mathematical limitation instead of treating this
as an unqualified text/math PASS. Recheck only affected wording/anchors after an
actual change, not unchanged exercises or Figure 55.

## Independent Checks

Every prose block and every exercise was compared with current approved raw
source. `semantic-coverage.json` records a separate substantive assessment for
each of the 49 prose blocks and 21 exercises. `text-math-probe.json` supplies
current SHA-256 bindings and reproducible mechanical/arithmetic evidence.

- All 57 source/candidate/snapshot/receipt/tool bindings checked by the probe
  matched or were freshly recorded; no input drift during that probe.
- Raw source SHA bindings and embedded `source.data` match. `source_text`, source
  references, pages, lesson/exercise identities and prepared `lines` are intact.
  Prepared lines are compared to PREPARED snapshots, not to an invented reflow;
  differing raw print-layout lines remain intact inside `source.data`.
- All ordered formula arrays and both formula/non-formula numeral sequences match.
  The independent numeral scanner includes numbers followed by sentence periods.
  No numeric changes, math corrections, or errata were added.
- All Latin subparts are consecutive and isolated on their own lines, with formula
  ownership and order intact. 812's procedural methods remain 1) and 2).
- Real table-author/title context was neutralized under direct authorization;
  four-significant-digit arithmetic-table meaning and all lookup steps retained.
- Both lessons' four adjacent paragraph anchors resolve through the existing
  authoritative prose-flow command. n38: 2/8/12/16; n39: 7/10/12/27. Each marks an
  actual concept transition, not a count-based break through a worked example.
- n38 input-rounding example `8.4372^2 ~= 8.437^2 ~= 71.18` is faithfully retained.
  The source workflow rounds the input before lookup, so no additional 0.005
  output-error guarantee is inferred for the unrounded input.
- Already-correct source `sqrt(2.45) ~= 1.565` and 818(b)'s `1/(sqrt(z)+5)` retained.
  No p0239 erratum and no new domain/sign change.
- 819 retains closed domain `[-6,8]`, sign/zero requests and monotonicity requests.
  No graph values, intervals, source inventory, or pixel correctness were assessed.

## First Failure

n38 FIRST receipt and original streams remain byte-bound with exit **2**; recovery
receipt remains byte-bound with exit **0**. Original failure audit and candidate
snapshots are preserved read-only. Recovery changed only:

- lesson `/prose/6/text`, `/prose/9/text`, `/section_breaks/1/before`;
- exercise text for 799, 800, 802, only terminal ASCII-period compatibility;
- no figures, source objects, tools, formulas, numerals, or identity metadata.

Current n38 final lesson/exercises equal frozen templates except `draft -> ready`.
Recovery is mechanical evidence, not the basis for the independent PASS above.

## Parent Boundary

n39 final lesson folder is absent **as expected**, not missing source. It was not
created or finalized. Figure 55 requires its separate pixel/inventory/render/review
approval. n39's exercise text PASS is reusable while its text, identities and
source bindings remain unchanged; a figure-only change does not reopen unrelated
text. n39 currently has **no whole-lesson text PASS** because R1 remains unresolved.
After an authorized affected-only revision is approved, finalization is the
parent's separate action, gated by independent figure approval. No duplicate
producer/suite pass or whole-batch review was run here.

No DB, network, app, dependency, publishing, interaction/cap3/E, merge, deploy,
closure, Git write, agent, chat, answer-key, choice-work, or old-ticket operation
was performed.
