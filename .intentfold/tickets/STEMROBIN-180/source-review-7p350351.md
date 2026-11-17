# Batch 45: independent SOURCE FIRST, physical 7p/350-351

Decision: **SOURCEBLOCKED for both pages; pair SOURCEBLOCKED.**
This is the sole fresh offline source review, not a rerun, repair, assembly,
ownership decision or promotion. All writes are confined to this report and
`tmp/source-first-7p350351/`. No other worker's files were changed.

## Source first and freeze

Opened each authorized full original once, then three original-only details.
Recorded complete independent inventories before reading any candidate or
clean-input details. The originals were hashed only at the initial freeze.

- `tmp/source-first-7p350351/source-inventory-0350.md`: 6539 bytes,
  SHA-256 `4994368708a8e3456d1476574ba30189b54ba293e24208efc0c2f7cd5ae269f0`.
- `tmp/source-first-7p350351/source-inventory-0351.md`: 6623 bytes,
  SHA-256 `31a62376edea3728c42f7769d3524de6d0535d78cd0d65f70068982e0f3c15e5`.
- `tmp/source-first-7p350351/source-freeze.json`, frozen
  `2026-11-17T00:16:22.253Z`: SHA-256
  `e364840fd91d9e4b2d745675c83ba5c0a8bb3fd1adb1816d5d6e460c9f2d873e`.

Original 0350: 66682 bytes, SHA-256
`19425bc23370b5a2f70421a8f26ed6ff8684b993f68e0829a8c55308bd8b841a`.
Original 0351: 68334 bytes, SHA-256
`d96cb07f43d9c16ac934d988ff0008e760c85d27d642133d37b249dc29d8b46d`.
Both are 1472 x 2161. Printed footers are 339 and 340.
Inventories and freeze were not altered after candidate access.

After freeze, read the supplied clean review input, both candidates'
`page.md`, `page.json` and `audit.json`, the separate current status, and all
three actual final table crops. Author inventories were read LAST.
No grids, prior reviewer reports or upstream/next-page content were opened.

## Confirmed Defect

**D350-caption1-inserted-dao:** source R02 / `p0350#2` says
`铜镍合金线的电阻`. Candidate says `铜镍合金导线的电阻`, inserting `导`.
This was already recorded correctly in the independent frozen source inventory.

- Candidate `artifacts/7p/pages/0350/page.md:75`.
- Candidate `artifacts/7p/pages/0350/page.json`, `/blocks/1/lines/0`.
- Author `inventory/0350.json:16`, `/rows/1/text`, repeats the insertion.

These relative input paths are under
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-350351/`.
The MD and JSON are two representations of one candidate defect, not two roots.
The inventory repetition is one inventory defect sharing that same source root.
No other text substitution, math-value error or crop defect was independently
confirmed. No repair was attempted.

## Comparison Coverage

| Observation | 350 | 351 |
|---|---:|---:|
| Independent printed rows, including footer | 15 | 21 |
| Candidate rows / existing audit printed and MD rows | 15 / 15 / 15 | 21 / 21 / 21 |
| Candidate blocks | 15 | 14 |
| Tables / populated cells | 3 / 22 | 0 / 0 |
| Confirmed candidate defects | 1 | 0 |
| Confirmed final-crop defects | 0 | 0 |
| Confirmed author-inventory defects | 1 | 0 |
| Distinct confirmed source roots | 1 | 0 |
| Independent reviewer-confidence HOLD records / roots | 15 / 5 | 7 / 3 |
| Author unknowns, context only | 4 | 3 |

All three actual final crops retain every source cell and paired column:
table 1 has length `1, 2, 3` against resistance `0.4, 0.8, 1.2`;
table 2 has area `0.4, 0.8, 1.2` against resistance `1, 0.5, 0.33`;
table 3 has `铜镍合金, 镍铬合金` against `0.4, 1.1`.
All labels, parentheses, raised square exponent, internal dividers, top/bottom
rules and absent side rules match. Captions/conclusions are not baked into
the crops. The inventory's table dimensions, material identities and cell
relations also match; the caption insertion is outside the crop.

On 351, rho/l/S/R roles, the inline product and fraction, all four standalone
formula rows, multiplication-dot versus multiplication-cross roles, numerator/
denominator words, unit `1 (欧姆·毫米²)/米`, temperature `20°C`, parentheses,
quotation around `柔`, formula-final comma and sentence dots are preserved.
No formula was corrected or given altered. Existing clean audits were read
as bookkeeping only; no checker or validator was run, and their empty error
lists are not source-fidelity approval.

The locally supported transition is only 350's `导体的` to 351's `电阻`.
350's first paragraph is closed; 350's final main paragraph is open; 351's
first paragraph continues and closes; 351's final paragraph is closed.
351's literal `下表` reference is preserved, but the table is unseen.
No next-table binding, gN, lesson/section ownership, numbering or full-course
approval follows from this bounded pair.

## Independent Confidence Holds

Detailed object-level records are in
`tmp/source-first-7p350351/review-metrics.json`. They were judged independently,
not copied as a rejection count from the author's 4/3 unknowns.

350 has 15 records over 5 roots: the three table-conclusion punctuation spans
(8 records), the two-row general-conclusion punctuation (3), definition-prefix
font boundary (1), definition-terminal-dot weight (1), and footer weight/
bullet-style coverage (2). Punctuation is present; unresolved independent
weight is not counted as missing text or a confirmed bold defect.

In particular, the frozen reviewer inventory's R13 wording includes `叫做`
in the selected-heavy phrase. That stronger lexical-boundary assertion is
not independently established: native stroke weight remains plausible.
It is explicitly downgraded here to H350-12, a reviewer-confidence limit,
not a confirmed missing-bold candidate defect or author-inventory defect.
The frozen bytes remain untouched. Selected emphasis on `电阻率` is clear.

351 has 7 records over 3 roots: independent weight of the inline rho-dot-l/
nearby italic glyphs (1), unit-expression dot/exponent/rule/terminal-dot weight
(4), and footer numeral weight/bullet-style coverage (2). The leading `1`
and Chinese unit words show selected heavy type; their native or math-font
stroke differences do not authorize additional bold defects.

Pair totals: **candidate 1, crops 0, author inventory 1, distinct confirmed
source roots 1; reviewer-confidence HOLDs 22 records over 8 separate roots.**
The HOLDs are not confirmed defect roots. Page 351 has zero confirmed defects
but is not PASS: full source typography fidelity remains unestablished.

## Budgets And Scope

One image batch: **8/8 actual images, 8/24 context images** =
2 full originals + 3 original details + 3 final crops. Reopens 0, grids 0,
parent images 0, forwarded image payload 0. No more images were opened.
Original-detail crops used only the specified existing Python runtime with
`-B`; nothing was installed.

Each page: repair limit 1, **actual used 0, unused 1, source actual repair 0,
FIRST failure debit 0**. Author FIRST0 and row counts are context, neither
independent rejection nor approval. The sole source review does not debit a
repair. No SOURCE rerun/replacement, repair, checker, validator, prepare,
finalize, vectorize, assembly or promotion was performed.

Input: 11 current new leaves, already Main38-bound per supplied metadata;
their leaf metadata was reused without rehashing. Eight preexisting prepared
leaves remain excluded from the author output manifest and were not
reprepared. No parent-original rehash or input-tree hash was performed.
No input files or original images are included in the output manifest.

Latest separate status read:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/batch45-current-after350351-andreviews-status.json`.
Reported baseline retained without mutation: approved 7p/8p **68/14**,
raw pages/entries/tasks **54/21/85**, committed 7p modern **9**, modernAdded **0**,
8p entries **0**, modern **0**, numbering **UNSET**.
No DB, app, backend, Git, publish, automation, merge, deploy, handoff,
full-project operation or user-window takeover. No payload. **Inflight 0.**

Output flat manifest:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/source-first-7p350351/manifest.json`.
It contains exactly workspace and files, with path/bytes/SHA-256 for the new
owned leaves and this report only, excluding the manifest itself.
