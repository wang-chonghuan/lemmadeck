# STEMROBIN-182 Numbering Start-Order Affected Review

Verdict: **PASS** for the sole remaining edition start-order defect. No remaining finding in this narrowly affected scope. Offline, same invocation, `finish: review`.
Every operation cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

## Concrete Evidence

- `edition.py:202-206` is exactly the five-line ordered-ref guard. Removing only these lines in memory restores the prior full edition SHA256 `a8131148d5afdca7d4c1471ad4a8925bc33573eaee4b73f6f24614a27c1e3102`; no other edition change is present relative to that review.
- Current isolated actual786 retains `number=786`, `source_number=736`, and the exact authoritative numbering record starting at `p0231#8`. Its approved refs are `[p0231#8,p0232#1]`; the first block is an exercise/non-continuation, and `p0232#1` is a continuation. Candidate and page JSON hashes still match the inherited FIRST bindings; no source/candidate content re-review.
- Changing only refs to `[p0232#1,p0231#8]` preserves their set and numbering record, but now raises the ordered-source-ref error: **one authority call, zero authority returns, zero set-map comparisons**. Duplicate same-set refs and continuation-only refs also reject there.
- Correct ordered refs are accepted. Deliberately missing `pages` and empty `pages=[]` are accepted and reconstruct both authoritative refs in order. Six scoped cases PASS; these are helper probes, not suite tests.
- A single in-memory deletion of the guard makes the identical reversed-ref input return `[]` again, confirming this exact repair closes the reproduced defect.
- The new focused test at `test_exercise_numbering_errata.py:163` covers correct, reversed, duplicate, truncated, and missing refs. Supplied `numbering-start-order-tests-affected` **8 PASS** and `numbering-start-order-edition-tests-affected` **51 PASS** receipts have exit 0, matching start records and verified stdout/stderr hashes. Neither suite was rerun.

## Hash Binding

- Current `edition.py`: `1cfe6ab03f41d9911cfbb06c40b3e139d9e264902c5fdde0e72f18407b3c150e`.
- Current `test_exercise_numbering_errata.py`: `f9d4486ea5069ef9953b5e1217f9282f0db1a86e506437fa09f55e123f51d87c`.
- Summary JSON: `24fdd48ab2d54ef3fa2754543253559d7a522de1d313eefd1ce7c7f0d83af60f`.
- Prior report verified unchanged: `8a08684b21378ac279764077ef641194350167d4335bc88d614e1420bfdaf95b`.

Full input, test-function, receipt/stream, script, and preservation bindings are in `numbering-start-order-affected-review.json`; final MD/JSON hashes are in `report-hashes.json`. Receipts contain no code digests: current hashes bind this review, not cryptographically the suite-time code identity.

## Inheritance And Limits

Inherit P1 and numbering-only early-return **PASS**; do not rerun or re-review unchanged P1 helpers. Preserve FIRST reports, scripts, outputs, and external snapshots unchanged, with hashes verified before/after the probes.

Execution uses AST-extracted current edition helpers and the exact authority binding tail with inherited approved candidate structure, plus current pages231/232 for `source_errata`. No producer imports or upstream assembly/figure reconstruction. This does not approve mathematical content, the full lesson, candidate promotion, or ticket closure.

Only this directory's scoped probe and reports were written. **Image opens: 0**. No reverts, suites/pipelines, DB, network, Git writes, app/dependencies, publication/interaction, cap3/E, merge/deploy/closure, agents, or chats.
