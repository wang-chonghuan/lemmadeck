# Bradis III/IV Source Investigation

STEMROBIN-182 OFFLINE, 2026-11-19. Exact checkout
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`, branch
`codex/STEMROBIN-182-textbooks`, observed HEAD
`e16207d939526da0ebb2cfc528f084f0c3791afb`.

**Candidate table evidence obtained; no HOLD released.** Read only the eight
existing PDF-page images 33-40, once each at original detail, image count
**0 -> 8**. All actual footers read printed 32-39 in sequence. No front/back,
old textbook images, crops, reopens, OCR, rendering, network, browser, database,
author keys, source-answer edits, tool changes, promotion or unrelated
arithmetic review. Writes are exclusively in this review directory.

## Source And Layout

The existing identification names V. M. Bradis, *Four-figure Mathematical
Tables*, 13th stereotype edition, Drofa, Moscow, 2010. PDF SHA-256 was rechecked:
`249b865dc7ae985ecfa6604531efb5e8b7896c481db1a5e2f4170940f4033656`.
That bibliographic identity does **not** prove historical equivalence.

Actual headings confirm III **Squares** and IV **Square Roots**. The ToC-only
data ranges were incomplete: III occupies printed **32-34 / PDF 33-35**,
with final rows 8.5-9.9 above its instructions on 34; IV occupies printed
**35-39 / PDF 36-40**, with final rows 80-99 above its instructions on 39.
No following-table image was opened.

Both grids have N, ten main columns **0-9**, nine italic correction columns
**1-9**, and repeated top/bottom headers. III has 90 nominal rows 1.0-9.9;
row 3.1 is physically split across the thousandth/hundredth result boundary.
IV has 180 rows: 1.0-9.9 by 0.1, then 10-99 by 1. Main argument steps are
0.01 below 10, and 0.1 above 10 for IV; correction steps are 0.001 and 0.01.
No main endpoint cell 10 (III) or 100 (IV) is printed. III's instruction text
says ten correction columns despite nine being visible; this is preserved.

## Rules And Lesson Alignment

III corrections are last-result-place units: add for fourth digit <=5;
above 5 take the next main entry and subtract the complement-to-10 correction.
IV explicitly illustrates **addition even for digits 6 and 8**, plus one
alternative next-main subtraction. Do not automatically transfer III's
threshold to IV. Decimal shifts are 1:2 for squares, 2:1 for roots.
Main results have four significant digits.

Selected n38 worked values all match the candidate cells: 4.840, 11.56,
36.00, 53.88, 5.476 + correction 9 -> 5.485, 71.18, 12.74, and 18.72.
For 8.437 and 4.327 both additive and III next-main routes happen to agree.
This agreement does not erase the method difference. The lesson's
8.4372 -> 8.437 preprocessing is not explicitly established here.

All selected n39 worked cells match: 2.366, 4.848, 6.731 + 3 -> 6.734,
2.796, 1.565, and 7.503 + 3 -> 7.506. Its additive correction/scaling
scheme is supported at these examples. The half-last-unit guarantee must
remain limited to directly rounded main cells, not corrected results.

Neither table-specific instruction page supplies a general >4-digit
preprocessing, rounding-tie, guard-digit, approximate-input, or table-first
sum/product/difference rounding rule. Existing identification claims about
general rules are secondary evidence, not newly inspected pixels. Printed
scaling examples contain details that must not be silently regularized:
III uses 1.5072 without explicit preprocessing; IV's first 886.3 scaling
line appears inconsistent with the 8.863 line that follows.

## HOLD Mapping

All numbers below are **operations on recorded read cells**, not newly read
result cells or high-precision roots/squares. Full row/header/unit/confidence
bindings are in `transcriptions.json`.

| HOLD | Candidate evidence and remaining boundary |
| --- | --- |
| n38 799c, six outputs | All six base/correction requests legible. Lesson additive results: **1.545, 18.70, 52.40, 66.04, 43.17, 81.79**. III's required >5 route instead gives **52.41** for c3 and **66.05** for c4. c2/c5 also differ from prior direct references 18.71/43.18. Actual cells replace hypothetical increments, but not historical provenance. |
| n38 800, eight outputs | Read normalized 5.243 -> **27.49** and 1.315 -> **1.729**, with corrections 3 and 13 respectively. Read scaling rule addresses all eight exponent routes. Historical substitution remains unapproved. |
| n38 801e-h, four outputs | Read additive/scaled results **0.3471, 548.1, 0.004609, 9.754e11**. III's prescribed next-main route changes h to **9.753e11**; g happens to agree. Do not replace the existing direct references or answer source. |
| n39 HOLD_TABLE_EXPLICIT, 45 outputs | Legible evidence covers all **44 root requests** in the dependency document (40 distinct normalized arguments), plus 814's product. Required scale/header routes are preserved. This supplies candidate-edition cell provenance, not historical-equivalence approval. |
| n39 HOLD_813_B_TABLE_PROCESS | Row **13,**, main **9** reads **3,728**; correction **5** reads **7**. Additive lookup gives **3.735**, then **3.74** at 0.01 using ordinary final half-up rounding. Prior direct **3.73** remains a different reference, not a table value. These pages do not independently define a rounding tie policy. |
| n39 HOLD_TABLE_CONTEXT, 12 outputs | 810: all eight normalized roots read. 811: all four component roots read; retain table-first expressions, not direct final references. 816: all four square cells and conditional root targets read. Final guard-digit procedure remains unevidenced here. |
| n39 HOLD_PREPROCESSING, five overlapping outputs | 806d: cells for proposed **1.006, 6.833, 20.16** yield conditional **1.003, 2.614, 4.490**, but the original-input rounding rule is absent. 816: four-digit table squares give radicands **1720.4 / 1443.4**, not nominal direct **1720.37 / 1443.13**; conditional guard-digit targets **17.20 / 14.43** are readable but not approved preprocessing. |
| n39 814 and 815 details | Read factors **4.243, 1.414** give finite table-factor product **5.999602**. Read **2.498, 8.426**, rounded per the lesson's 815 hint, give **2.50, 8.4**. These are derived processes, not extra printed table cells. |

IV next-main alternatives need care: read cells give additive/subtractive
results **8.147/8.148** for 66.38, **7.314/7.313** for 53.49, and
**6.139/6.138** for 37.68. The source's one agreeing dual-route example
does not prove universal equivalence. The lesson's explicit additive route
is the route used for the primary IV observations here.

## Next Narrow Targets

1. Resolve whether this 2010 edition may serve as the historical source, or
   obtain the contemporaneous table edition. Focus on III 7.239, 8.127,
   9.876 and IV 66.38, 53.49, 37.68; no broad arithmetic re-review.
2. In a separately authorized fresh batch, verify general calculation rules
   at projected PDF **5 / printed 4** and relevant interpolation explanations
   at projected PDF **86-91 / printed 85-90** (seven images total). Those
   locations remain projections; confirm actual footers first. Target >4-digit
   input handling, reserve-digit policy, correction error, and rounding ties.
   No need to reopen already inspected PDF4/front/back.
3. Once those decisions are resolved, use this hash-bound cell evidence for
   only the existing n38/n39 HOLDs. Do not automatically substitute source
   answers, promote, or rerun unrelated gates.

All targeted cells recorded here were legible at the supplied 200-dpi scale
(1103x1637 PNGs); no crop need was identified for them. Unrecorded cells and
the rest of the book were not certified. `image-ledger.json`,
`source-rules.json`, `transcriptions.json`, and `hashes.json` preserve scope,
rules, exact printed cells, derived operations, and byte bindings. Stop here.
