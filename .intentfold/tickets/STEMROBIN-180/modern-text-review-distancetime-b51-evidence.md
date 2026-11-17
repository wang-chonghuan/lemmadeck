# Distance/time b51 evidence-only addendum

**Verdict: TEXT PASS for the three frozen candidates below. Missing-evidence HOLD resolved.**

On 2026-11-17, inspected the recovered original execution excerpts only, then compared current file SHA-256 values with the existing freeze. Reused the completed independent semantic PASS for all 10 prose blocks and 8 tasks; no second semantic review or new gate execution occurred.

The original `modern-text-review-distancetime-b51.md` remains unchanged as the first-review BLOCK record. This addendum supersedes only its missing-evidence disposition. The substantive semantic PASS and the independently derived 8/8 source-only solutions are retained, not rewritten or promoted.

## Recovered Evidence

Provenance: the main session recovered completed executions from author chat `01a1e73c-041b-7f40-aa29-59ad4c88609e` through `read_thread` with outputs. Inspected `.intentfold/tickets/STEMROBIN-180/tmp/distancetime-b51-original-command-excerpt.md`, SHA-256 `18759ff2c483ea205aade569ae0445cf30b782a6575bd9e010fb01e12a027228`. The substantive evidence and decision are preserved here, so the disposition does not rely on the scratch excerpt remaining available.

| Original evidence | Result and significance |
|---|---|
| Normalization execution | Actual exit 0; `Normalization calls: lesson=1, exercises=1; prose= 10 ; tasks= 8`. |
| `call_pM9uFJzlKd6rwFTxvg3E2fsP` | Original `prose_flow.mjs` exit 0, with all 11 final paragraphs. Both selected adjacent anchors are present in the recovered output and original anchor patch `call_2t9hqS0fNOYbVWls9nWom9tA`. |
| `call_cgnmH4vt0Hn9jpHEoz5tSK9n` | Original focused TEXT source/math/layout check actually exited 1. Output reports 10 blocks, 8 tasks, 11 paragraphs, breaks `[4,8]`, no KaTeX warnings, and exactly one error: `lesson.prose[4]` undeclared non-formula number signature `want=['1.5','3'], got=['1.5','3','3000']`. |
| `call_OMCvtMnnVStVEBqVGvmtIeq0` | Completed original `apply_patch`; sole template delta replaced `也就是 3000 米` with `也就是3000米` in `lesson.prose[4].text`. Author report updated to repair used 1 / unused 0. |
| `call_HAcdlR1NjnAesRdJRmx9WaHz` | Actual affected-only `validate_text` exit 0; output `status: PASS`, `errors: []`, repair used 1 / unused 0, and all three final hashes matching the current freeze. The original execution then froze the templates read-only. |

The focused execution covered schemas, draft/edition/source snapshots, source bindings, identity, errata, all prose/tasks, literal formulas, `validate_text`, subpart layout, prohibited answer fields, punctuation, KaTeX, shared paragraph/boundary resolution, and original PNG hashes. Its reported sole failure was the numeric-token adjacency, not a formula, physics, source-binding, identity, declaration, or flow failure. FIG production gates were excluded.

The affected-only call evaluated the current block's `source_text`, `text`, `changes`, `numeric_changes`, profile forbidden terms/person names, and `historical_entities`. Thus it directly settles the one reported failure without repeating successful checks.

## Evidence Resolution

The original failed lesson SHA was `b7b516c8541f438ab430702a0e4a4c21630e71feaa6043047362e3c73ad85e63`. Failed bytes were not saved; this addendum does not claim byte-level reconstruction or a new execution of that failed candidate. The actual failed hash/output, exact completed patch, affected-only PASS, and final hash binding sufficiently establish the repair chain.

The patch changes only spaces surrounding an already present quantity. It changes no number value, formula, source snapshot/ref, task identity, declaration, figure reference, newline, or section anchor. Its paragraph is not one of the two selected boundary anchors. Therefore the prior successful unaffected mechanics remain applicable, and the actual affected-block PASS resolves the outstanding token-signature check.

This is a composed review verdict using original unaffected results plus the original successful delta and the previously completed independent semantic review. The first full focused execution remains FAIL/exit 1; there was no successful second full execution, and none is implied.

## Frozen Binding

Candidate root: `.tmp/ld-s10y-lesson/text-author-distancetime-b51/lessons/phy6-c3-s5/`.

| Candidate | Current / original delta-result SHA-256 |
|---|---|
| lesson.template.json | `bc828629d4e55f090d923af8dddaeeaf94585cb7f14f78e0eda2a5778bdd1cae` |
| exercises.template.json | `b3c2cd60f882a6df86567d37e96a78fc1f72dca3b3286a4cca6c42974a3b61c6` |
| figures.template.json | `2b275ce8dd08694060b42eeb44bddc5ffe3da376a315d6259a18b2c9a9cff347` |

Preserved artifact hashes observed before writing this addendum:

- Original BLOCK report: `52d1234fa5f6f0863a3422d8a65db1cbf28031cd1b2d0cacea6c6302278342db`.
- `answer-source-distancetime-b51.md`: `9c59d5b0ebc1cf2c466cfbce9688779d4630314dc3b91b12252f8eab000a6c79`.
- `.tmp/ld-s10y-lesson/text-review-distancetime-b51/source-only.json`: `cd4e618e4f84b40ebe13a2e27c89529cde474b05792e3892266bb6cd7ecf3d64`.

Only this addendum was created. Author repair allowance remains **used 1/1, unused 0**; reviewer repairs 0. New images/reopens 0, normalization/prose-flow/TEXT/math/SOURCE/FIG gate reruns 0. No app, dependencies, Git, DB, services, figure production, final keys, autograding, or promotion actions. TEXT PASS is not FIG approval or publication approval.
