# N45 Stage2: View-Only Review

**Outcome: revise.** No author solution, rationale or key has been read.

View byte SHA-256: `c41d618a14402fbc29a345e43d0941ccc6559d95932f0939666d6d603f149977`

View canonical SHA-256: `e722d73fd687cd93412c25f2f3d89d7283cdd8520c7a8ebfbfd01bebc928c475`

## Findings

1. **S2-F-001 / q886a:** the proof target is 22, and only option A ends
   with 22. B ends 1/11 and C ends 22/241. Terminal-value matching selects
   A without judging the common denominator or conjugate multiplication.
2. **S2-F-002 / q886b:** the proof target is 18, and only A ends with 18.
   B ends 2sqrt(5), C ends 2. The numerator-squaring and conjugate-product
   proof task can be bypassed in the same way.
3. **S2-F-003 / q889:** all four alternatives give `f(x)=3` as `{0,4}`.
   The source's equation/intersection-reading answer is supplied rather
   than assessed. Domain and strictness eliminate A/C using that given row.
   B versus D still requires reading above/below the actual curve, so this
   is not a claim that the entire graph task can be answered without it.

For the proof items, competing calculations should claim the same target
conclusion and require judging their intermediate algebra. For q889, use
different possible intersection sets with coherent complete-table alternatives
so reading the actual crossings remains necessary.

## Completed Checks

- Fidelity/leakage were recorded and frozen before option mathematics:
  45 questions pass, 3 require revision; all 48 redundancy checks pass.
- Independently solved all 48 visible questions and checked all 152 options:
  **53 true, 99 false**, no unresolved mathematical alternative.
- All 43 native single questions have exactly one true option.
- All 5 native multiple questions have complete two-option truth sets:
  `q873b A,C`; `q880a C,D`; `q880b B,D`; `q881b B,D`; `q883b B,D`.
- Source mapping covers all 19 exercises and 57 requested tasks. Coverage
  requires revision for sources 886 and 889 due to the concrete losses above;
  no source exercise has silently disappeared.
- The two positive branches in 881b and 883b are retained. Original rational
  denominator exclusions, the empty set in 878i, all real parameter signs
  and constrained positive-motion domains were checked.
- Reused the frozen four image observations. **Zero new figure reads,
  image opens or rerenders.** No app/DB/dependency/Git/external operation.

Mathematics pass does not rescue fidelity/leakage revision.

## Conventions And Losses

`q880a` expressly permits negative integer numerator/denominator components.
`q880b` expressly permits zero/negative numerators. Their domains produce all
Stage1 algebraic original pairs, including `(-5,-6)` and `(0,4)`; integer
restriction eliminates no computed root. Pair recognition preserves the
representation-sensitive operations, but supplying symbolic equations loses
unassisted prose-to-model production.

`q890` expressly defines natural numbers as `{0,1,2,...}` and therefore
includes `(0,0)` and all 21 isolated graph points. This is a disclosed view
convention, not evidence of the original seed's missing definition. Whole-table
recognition loses plotting production but retains every coordinate, remainder
and function-classification distinction. Reasonable example-based elimination
is not automatically a failure.

`q891a/b` use the actual distinct panels and all four additional coordinates
per panel. Full-order recognition does not demonstrate drawing the points or
the metric reflection of -x. It retains all eight approximate side/order tasks
without assigning a fictitious numeric x to schematic spacing.

All choices lose unprompted written solution production. That alone is not a
rejection criterion. The proof items and q889 fail for the specific mathematical
tasks they allow learners to bypass, not merely because they are choices.

## Package Relationships

Reviewer-inferred mapping splits 877/878 into their independent equations,
consolidates 889's three level sets and 890's graph/classification, and splits
891 by its genuine `x>1` versus `0<x<1` panels. No cross-source merge is visible.
Shared candidate roots and opposite-panel order alternatives are not marked
correct by another question. No app feedback, author key or hidden schema is
assumed. Author source mappings and recorded limitations remain Stage3 checks.

## Frozen Records

- `stage2-view-binding.json`
- `stage2-fidelity.json`
- `stage2-mathematics.json`
- `stage2-truth-sets.json`
- `stage2-package-relationships.json`
- `stage2-report.md`
- `stage2-freeze.json`
- `stage2-frozen-files.sha256`

All new records are frozen `0444`; Stage1 and the disclosed view are preserved.
The hash manifest binds only owned input/output files and the inherited image
ledger, without rereading the figure assets.

**Hold for explicit Stage3 author-key disclosure.** No canonical review or
canonical validator has been created/run in Stage2.
