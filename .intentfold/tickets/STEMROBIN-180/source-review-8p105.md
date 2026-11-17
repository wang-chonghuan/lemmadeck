# SOURCE 8p Physical 105: Independent FIRST Review

Verdict: **105 BLOCK**. Reviewed pages **1**; **PASS 0 / BLOCK 1**. One blocking source-style finding. Printed page **93**. Page 106 is outside review scope; its source, candidate, images and receipts were not opened or repaired.

## Finding

**F01: Definition emphasis omitted.** The original's final defined term “动力学” in “分力学，叫做动力学” is visibly italic. This was frozen as certain emphasis in source object S07, printed row 15, before the candidate or author report was read. Candidate `page.md:62` and `page.json` `/blocks/6/lines/1` both leave it plain. Mechanical 18/18 does not establish style fidelity. No repair was performed after BLOCK.

Original-only evidence: `.tmp/ld-s10y-lesson/source-review-8p105/FIRST/definition-tail-detail.png`. Its SHA-256 is `4d22e7a5b75a66477715021624e7075153bb83e526a838659b632aad2f87e0c4`.

## FIRST Method

The original `source-author-8p-105106/work/8p/pages/0105/page.png` was the first content observation. Two original-only crops settled visible details; then the complete literal line/style/symbol/object/flag inventory was saved as `FIRST/source-inventory.freeze.json`. Only afterward were all three 105 candidate files and the permitted normal author report read. The author inventory was not read.

Only incoming: this ticket's `tmp/incoming-8p105106-structure.json`, used as structure only. No predecessor prose, neighbor, HOLD/history, answers, inferred raw numbering, or assembly identity.

## Full Comparison

Independently counted source **18 rows / 10 objects / 0 figures**; candidate MD and JSON **18 rows / 10 objects / 0 figures**; existing audit **18/18**. The block row counts are `1,1,1,3,6,1,2,1,1,1`: four headings, five paragraphs and footer. Zero captions, tables, exercises, exercise groups, formulas and footnotes.

All 18 rows' wording and actual wraps were compared. Bold “动力学”, “引言” and the full numbered title are preserved. No separator is invented between “环境” and “牛顿”. The final paragraph ends literally at “但”, with `open=true`; all other blocks are closed, with zero `cont` or `samerow`. Footer 93 and its two dots are preserved. There are no missing figures or textual objects. F01 is the only asserted source defect.

Uncertainties remain explicit: other body-glyph inclinations do not justify guessed exact italic boundaries, including the earlier row-13 “动力学”; pixels do not establish punctuation Unicode widths/codepoints. The freeze's semicolon notation after “是十分重要的” is not an exact encoding claim: the already-observed source has a low full-stop dot, and the candidate period is accepted. The frozen inventory remains unchanged. These uncertainties do not establish or remove F01. PDF bytes were not reopened; binding is to the actual supplied original PNG.

## Existing Receipts And Budgets

Read and hashed only the three 105 call receipts and six streams in this ticket's `tmp/commands/`:

- `batch52-source8p105-first-prepare.*`: **exit 2**, argparse rejected `--artifacts` before content.
- `batch52-source8p105-prepare-sole-arg-correction.*`: **exit 0**; the sole argument delta is `--artifacts` to `--root`.
- `batch52-source8p105-first-finalize-author105106.*`: **exit 0**, reports 18/18 rows and 0 figures; not SOURCE approval.

All six current stream hashes match the recorded receipts. Preserve original mechanical repair **1/1 used**, actual SOURCE repair **0**, remaining **0**. Reviewer prepare/finalize/gates/repairs **0**.

Image reads: **3/8 task, 3/24 context, inherited 0, parent reopens 0**: one original whole page and two original-only crops, all before freeze. No images were loaded after freeze or BLOCK.

An optional read-only Node consistency probe exited 1 on a syntax error before execution and was not retried. It changed no content and is not a gate, pipeline receipt or SOURCE repair. Direct inspection supplied the comparison; direct hashing supplied the receipt evidence.

## Narrow Current Hashes

Exact paths, byte counts and all nine receipt-file hashes are in `.tmp/ld-s10y-lesson/source-review-8p105/current-hashes.json`.

| Evidence | SHA-256 |
|---|---|
| Actual original 105 PNG | `d537c86b84495e7b483429d64f505425f0273344a3e5d28f4e30f88380011252` |
| Current 105 page.md | `41adb3686f34491062f11c98babe7212f93582e4db55d24ae9ac8b353a248ecd` |
| Current 105 page.json | `2d9fbb18aa7486e26ab46e46ff8365ea8cb602156a0b7172e099bf63fff8f5fa` |
| Current 105 audit.json | `6cc840cbebabe8e93744ddf8bf675d2eae5e2b4b938755ff6c4f2cf60fee1b7f` |
| Independent FIRST frozen inventory | `584276a9fa3cc334f4240b23a4359fbf636c50bfd5aec4e6b4f3cd5449f8a21d` |

FIRST verdict, findings, uncertainties and the full object comparison: `.tmp/ld-s10y-lesson/source-review-8p105/FIRST/verdict.json`.

The report is in the **normal ticket directory**, not ticket `tmp/`. Writes were confined to this report and the owned review root. Candidate, author files and others' work were preserved. No SOURCE approval, promotion, prepare/finalize, gates, repairs, neighbor work, answers, numbering inference, assembly, backend/DB/Git, global tests, app, dependencies or new pipeline.
