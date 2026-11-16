# Book 8p Physical Page 38: Sole FIRST Source Review

- Invocation: same STEMROBIN-180/C rolling OFFLINE batch30; sole page-38 FIRST source review.
- Workspace/base: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
- FIRST review decision: **BLOCKED**, one confirmed smallest-unit style difference. Review **1/1**, stopped, inflight **0**.
- Author FIRST finalize proof remains exit **0**, called **once**: 25 printed/tool/source rows, 12 blocks, 0 figures, 0 normalizations/errors.
- Author repair budget preserved: limit 1, used 0, unused 1; actual applied corrections 0. No author patch, prepare/finalize/checker/review rerun, promotion, publication, assembly, or next-page work.

## Independent Source Freeze

Only the original `.tmp/ld-s10y-lesson/source-author-8p-3738/current-38/source-page.png` and three own crops were observed before candidate, layout, template, author facts, or reports.

The complete independent facts were created exclusively and frozen mode `0444` before candidate exposure:

`.tmp/ld-s10y-lesson/source-review-8p38-first/sourcefacts.json`

Bytes: `16085`; SHA256: `233b7b76fc9f5d1b3ccd5de9e8e418b79bc7f3841bccdb32f15e353971075672`.

The inventory contains every printed row, word, mathematical glyph/sign/script/arrow, numeral, unit, punctuation style, bold/italic/underdot span, literal task, heading, continuation, and footer. No uncertain glyph/style was filled from the candidate. Solid-dot sentence stops are distinguished from hollow Chinese periods. Figure 27 is cited but not printed on this page.

Image ledger: `.tmp/ld-s10y-lesson/source-review-8p38-first/imageledger.json`. One fresh batch, 4 images total (original + 3 own crops), maximum 8/batch and 24/context, reopen 0, parent images 0, historical payloads 0. No images are attached to the return.

## Authority

Authority is exclusively the clean OBJECT manifest with 52 direct `files[].path` leaves, resolved against the explicit workspace base:

`.tmp/ld-s10y-lesson/source-author-8p-3738/page-38-manifest.json`

Bytes: `11593`; SHA256: `74591cdc3635a0e48a8366da22e14d5f1b80a0e2a90fbde1c3026d9f3ce24b8f`.

The manifest and direct leaves were bound once after the independent freeze. The leaves have exact bytes/SHA256 and own immutable copies under `source-review-8p38-first/bound/`. No historical manifest, receipt-stream origin, source-PDF pointer, or other nested pointer was followed. No mixed global report, mixed ledger, or page-36/37 body/image was read. The bound incoming artifact was used only for structural identities, never source prose or approval.

Page identity was checked at `current-page.json.meta.book = "8p"` and `.meta.page = 38`, with `.meta.printed_page = 26`, not at nonexistent top-level identity fields.

The bound actual FIRST finalize receipt, stdout/stderr stream identities, FIRST input-freeze receipt, and FIRST result-freeze receipt were reused without rerunning any pipeline. The FIRST result receipt embeds hashes equal to the clean current MD/JSON/audit. The earlier FIRST-input manifest identity remains a receipt claim; its historical leaves were deliberately not opened.

## Confirmed Difference

**8p38-FIRST-d001: Missing Bold Weight On Footer Numeral `26`**

Smallest unit: the single contiguous numeral span `26`, printed row 25. The frozen source facts record bold and italic; the candidate records italic only.

- Source facts: `sourcefacts.json#/rows/24/bold/0`; italic: `#/rows/24/italic/0`; literal: `#/rows/24/literal`; object: `#/objects/11`.
- Original image: `source-author-8p-3738/current-38/source-page.png`; own evidence crop: `source-review-8p38-first/bottom.png`, source box `[145,1740,1465,2340]`.
- Candidate MD: `source-author-8p-3738/current-38/current-page.md:82`, literal `· *26* ·`.
- Candidate JSON: `source-author-8p-3738/current-38/current-page.json#/blocks/11/lines/0`, zero-based character span `[3,5)`.
- Required source fidelity: bold plus italic on `26` only; flanking dots stay outside the numeral style span.
- Applied: **0**. This is not bundled with the correct italic, page number, footer role, or flanking dots.

The FIRST mechanical exit 0 is retained as mechanical evidence, not promoted to visual source approval. The independent FIRST decision is immutable and BLOCKED.

## Complete Row Address Map

`sourcefacts.json#/rows/<i>` is the source address below. Candidate addresses are in `current-page.json#/blocks/<b>/lines/<l>`; each row also has its exact MD line and component-level comparison in `row-comparisons.json`.

| Printed row | Source index | Candidate block/line | MD line | Result |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0/0 | 36 | Match |
| 2 | 1 | 0/1 | 37 | Match |
| 3 | 2 | 0/2 | 38 | Match |
| 4 | 3 | 0/3 | 39 | Match |
| 5 | 4 | 0/4 | 40 | Match |
| 6 | 5 | 1/0 | 43 | Match |
| 7 | 6 | 2/0 | 46 | Match |
| 8 | 7 | 3/0 | 49 | Match |
| 9 | 8 | 4/0 | 52 | Match |
| 10 | 9 | 4/1 | 53 | Match |
| 11 | 10 | 5/0 | 56 | Match |
| 12 | 11 | 6/0 | 59 | Match |
| 13 | 12 | 6/1 | 60 | Match |
| 14 | 13 | 6/2 | 61 | Match |
| 15 | 14 | 6/3 | 62 | Match |
| 16 | 15 | 7/0 | 65 | Match |
| 17 | 16 | 7/1 | 66 | Match |
| 18 | 17 | 7/2 | 67 | Match |
| 19 | 18 | 8/0 | 70 | Match |
| 20 | 19 | 9/0 | 73 | Match |
| 21 | 20 | 9/1 | 74 | Match |
| 22 | 21 | 9/2 | 75 | Match |
| 23 | 22 | 9/3 | 76 | Match |
| 24 | 23 | 10/0 | 79 | Match |
| 25 | 24 | 11/0 | 82 | Bold difference d001 only |

All literal tasks 1-6 are complete on this page. The inherited top prose starts literally at `度`, and section 7's second prose paragraph ends literally at `它` with `open: true`. These statements do not claim that either adjacent page is approved or that a lesson is assembled.

## Preserved Boundaries

Permanent incoming gaps remain exactly 17, 18, 20, 23, 24, 25, 26, 27, 29, 30, 33, 34, 35, 36, 37. Page 36 remains unresolved-style FIRST BLOCKED, budget 0/1. Page 37 remains budget debit 1/0 with actual applied 0. Those are supplied status facts, not results of reopening failed pages.

Book 8p10 remains approved with 0 entries and 0 complete modern objects; numbering remains UNSET. Page 38 receives no cross-gap assembly or source approval. No next page was read. No modern text, answers, choices, DB/backend, Git, network, environment/install, app/schema/shared-tool, publish/promote/deploy, handoff, supervision, or other-chat action was performed.

Machine report: `.tmp/ld-s10y-lesson/source-review-8p38-first/report.json`.

Immutable FIRST decision: `.tmp/ld-s10y-lesson/source-review-8p38-first/FIRST-decision.json`.

Flat existing-current-only evidence manifest: `.tmp/ld-s10y-lesson/source-review-8p38-first/manifest.json`; explicit workspace base; self excluded; no recursive historical-pointer expansion.
