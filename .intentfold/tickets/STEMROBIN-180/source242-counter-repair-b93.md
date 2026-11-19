# SOURCE7p242 B93 Isolated Counter Candidate

**Candidate PASS only. No production patch applied; no official finalize or source approval.**

Working directory for every command:
`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.
Ownership is limited to this report and the ticket's
`tmp/resume-180-4/source242-counter-fix/{candidatecode,tests,receipts}`.
The existing parent `run-stage.mjs` records unique `source242-counter-candidate-*`
calls; no replacement wrapper was made. SOURCE author files were not read or changed.

## Authority And Exact Bytes

The current lesson skill, `references/production-resume.md`, current checkpoint,
`source-review-7p-240-244.md` and `source-repair-7p-242.md` supplied the contract.
Ramanujan's completed content PASS is reused, not reviewed again. The parent's
`tmp/resume-180-4/source242-current-diagnosis.json` supplied the already-executed
baseline diagnosis: 22 rows, merged q2 `(1012,1143)`, full q3 `(1148,1238)`.
No additional production-counter diagnosis was run.

Prepared source:
`.tmp/ld-s10y-lesson/resume-180-4-source239242/work/7p/pages/0242/page.png`,
SHA256 `6e9bd9cd4db3940c3497de0100d6207285fdbe46af260f28d191c055960e914d`.
Visual image opens/crops are **0/1 and 0**. Mechanical candidate tests load that
same exact PNG; they are not source-content review.

The dirty production `layout.py` was copied exactly into isolated baseline and
candidate files before editing. Its before/after SHA256 remains
`ed49a122e5f4579c9f553fa6da3d17bee6e4620502097be9fcd9f2dc12effc3c`.
Final candidate SHA256:
`f861ee2e32536b627ace3a4444a726355633527b9982067368c5342aba170f4a`.
Every manual code/test/report edit used `apply_patch`.

## Logical Repair

`_single_fraction_row` now checks existing `_row_fragments` and bounded body
components outside the rule columns. Two sufficiently separated complete body
fragments veto a single fraction, without requiring a wide pooled-ink peak or
horizontal column alignment.

For a close compact row independently separated from a preceding tall fraction,
`line_bands` retains its original detected projection rather than expanding it
with recovered glyph tails. That independent-row identity survives both merge
passes, preventing the short row from joining the following fraction numerator.
The next fraction retains its complete numerator/rule/denominator band.
The original numeral-recovery rule, helpers and global constants are unchanged.

No page-number/book/coordinate branch, threshold relaxation, fabricated line
marker, `samerow`, deleted line, source-text change or count-only acceptance.
Existing tests were neither read nor modified. New tests were written after the
candidate implementation, from reviewed geometry and synthetic ink.

## Frozen Attempts And Counts

Each attempt's exact candidate, tests, stdout, stderr, call and manifest are
preserved under `receipts/attempt-01` through `attempt-04`.

| Attempt | Focused Results | Actual Defect / Outcome |
|---|---|---|
| 01 | 11 tests: 8 PASS, 3 FAIL | 23 rows and intact q3, but short row began 1106; two synthetic rectangle fixtures had fraction-like borders. |
| 02 | 12 tests: 11 PASS, 1 FAIL | Exact targets and all synthetics passed, but a broad overlap guard shifted unrelated bands. |
| 03 | 12 tests: 11 PASS, 1 FAIL | Recovery restored; target and synthetics passed, but q4 began 1269 instead of 1268. |
| 04 | 12 tests: 12 PASS, 0 FAIL | Exact targets, 23 rows, all 20 unaffected page bands unchanged. |

Attempt 02 repaired the synthetic glyph construction, leaving expected results
unchanged, and added a partial-body projection test. Attempt 03 removed the
broad recovery change. Attempt 04 limited preservation to a genuinely close
merge candidate. No failed receipt or assertion was erased or weakened.

Historical Volta **1/1, 8 tests / 7 PASS / 1 FAIL, BLOCKED** is unchanged.
Historical source239/source242 **1/1** and original FIRST finalize failure remain.
This authorized isolated repair adds **4 candidate/content-mechanical repair
attempts**, not zero; cumulative source242 mechanical attempts including Volta
are **5**. New focused executions total **47 tests / 42 PASS / 5 FAIL**.
Source text repairs in this scope are 0.

## Actual Final Proof

Final call:
`node .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/run-stage.mjs source242-counter-candidate-focused-04 env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/source242-counter-fix/tests/test_candidate.py`

Exit **0**, 12/12 PASS. Actual affected bands:

```text
(1012,1099)
(1113,1143)
(1148,1238)
23 rows total; all 20 unaffected bands exactly equal the parent baseline.
```

Tests cover actual q2 single/combined and q3 single fraction at line heights
40/41; exact full-page target and unaffected geometry; synthetic single fraction,
offset complete body row, partial body ink, nearby denominator-only,
detached denominator-only, scrambled fragments, adjacent next complete fraction,
and adjacent full fractions. The candidate is imported by file path; production
is not used as the test loader. No whole-project or existing suite was run.

## Frozen Delivery And Stop

Patch text for parent integration:
`tmp/resume-180-4/source242-counter-fix/receipts/production.patch`.
This is a unified delta against the exact dirty baseline, not an applied patch.
The parent recorder's diff exit 1 means differences found, not a failed test.

Final raw-byte bindings and counts:
`tmp/resume-180-4/source242-counter-fix/receipts/manifest.json`.
Its raw SHA256 is returned by the final recorder call and
`receipts/freeze-receipt.json`. The manifest binds this report, baseline,
candidate, delta, source hash, authority reports, parent diagnosis, all four
attempts and available uniquely labelled parent call receipts.

No production-tool application, prepare/finalize/vectorize/render/assemble,
promotion, modern/choice/answer/app/environment/DB/backend/service/network/browser,
Git, old-chat, lock or other-agent operation occurred. No independent affected
SOURCE approval is claimed. Parent integration remains contingent on candidate
proof **and the separate baseline SOURCE stage finishing**; this report does not
assert that stage has finished. Stop at the frozen manifest/report.
