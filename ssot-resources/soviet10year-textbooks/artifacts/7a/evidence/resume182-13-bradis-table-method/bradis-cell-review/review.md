# Bradis Targeted-Cell Independent Review

STEMROBIN-182 OFFLINE, 2026-11-19. Exact cwd
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`, branch
`codex/STEMROBIN-182-textbooks`, HEAD
`e16207d939526da0ebb2cfc528f084f0c3791afb`.
Writes exclusively in this `resume182-13/bradis-cell-review/` directory.

**Stage2 verdict: REWORK_REQUIRED_EXISTING_TRANSCRIPTION.**
Independent capture is complete, frozen and readable. There are **3 cell
transcription errors**, **2 source-rule transcription errors**, and **1 actual
printed footer scaling error**. No blurry-reading HOLD is necessary.

## Cell Discrepancies

| Request | Exact Source Address | Author String | Independent Printed String | Consequence From Read Cells Only |
|---|---|---|---|---|
| 799.c2 | III; image 33 / printed 32; row `4,3`; correction column `5` | `4` | `5` | Unit 0.01: 18.66 + 0.05 = **18.71**, not the author's 18.70. |
| r60.37 | IV; image 39 / printed 38; row `60,`; correction column `7` | `5` | `4` | Unit 0.001, lesson add route: 7.765 + 0.004 = **7.769**, not the author's 7.770. |
| r6.52 | IV; image 37 / printed 36; row `6,5`; main column `2` | `2,554` | `2,553` | The reported scale exponents 0 and 1 give **2.553 / 25.53** from this printed main cell. |

These are actual legible source-cell readings, not values inferred from an
answer key or high-precision mathematics. Existing transcription, derived
reports and answers were **not edited**. Dependent numbers above are finite
arithmetic on the frozen cell strings, not additional printed cells.

## Source Text And Error

1. Image 35 / printed 34 says **`девять столбцов поправок`**, nine correction
   columns. The author's ten-versus-nine allegation is a transcription error,
   not a misprint in the source; both prose and grid have nine.
2. The same page prints **`0,01507²`**, coefficient **`1,507`**, and its square
   exponent. The author's `0.015072` / `1.5072` interpretation folds a
   superscript `2` into the argument. Remove that alleged five-digit coefficient
   example; it does not establish any over-resolution preprocessing convention.
3. Image 40 / printed 39 really repeats **`886,3`** inside the first right
   radical multiplied by `10²`, then uses **`8,863`** on the next line. This is
   a confirmed printed scaling-coefficient inconsistency. The even-power
   normalization would require `8,863` in that first right radical. The frozen
   capture preserves the printed error; no source correction was performed.
   The author's normalized line silently corrects it, although its accompanying
   note already mentions the apparent inconsistency.

All titles, repeated headers, printed page numbers **32-39**, and relevant
footer prose/formulas were independently captured. Prose line-end hyphenation
is joined where declared; editorial parentheses denote radical-overbar scope.

## Route Compatibility

The bound existing identification establishes V. M. Bradis, *Four-figure
Mathematical Tables*, 13th stereotype edition, Drofa, Moscow, **2010**,
ISBN 978-5-358-07433-0. The PDF SHA256 is
`249b865dc7ae985ecfa6604531efb5e8b7896c481db1a5e2f4170940f4033656`.
This review does **not** claim it is the historical textbook's identical
edition. No additional human historical-edition approval is required for this
authorized task. Prior report language imposing that gate is inapplicable.

All **8 n38** and **6 n39** selected worked-example cell requests agree with
the independent source and the current lesson lookup/scaling route. These
are narrow compatibility observations, not a new whole-lesson content gate.
III corrections count units of the main result's last printed digit: 0.001
or 0.01 at the requested bases. The split `3,1` row's column `4` reads
`9,860` on the upper physical line. IV corrections are 0.001 in the root,
not its different argument increments. Decimal shifts are square `k -> 2k`
and root `2k -> k`.

Keep **lesson add-correction** and **III next-main-minus-complement above 5**
as distinct valid approximation methods. Requested pairs differ for 799.c3
(52.40 / 52.41), 799.c4 (66.04 / 66.05) and 801.h (97.54 / 97.53 before
scaling). This is not an identity failure. The 8.437 and 4.327 worked-example
routes happen to agree. IV explicitly demonstrates addition for digits 6 and
8, with one subtraction alternative; do not impose III's threshold on IV.
The IV requested alternatives 66.38, 53.49 and 37.68 also differ after
rounded corrections and are kept separate in the verdict.

Current n38 prose itself supplies `8.4372 -> 8.437`; it is not a newly printed
III general rule. Current n39 correctly limits its half-last-unit statement
to directly rounded main cells and excludes corrected results from that
guarantee. No universal tie, over-resolution or guard-digit rule was invented
from these eight pages. Wider preprocessing/final-answer decisions are outside
this review, not another source-identity approval gate.

## Actual Counts And Freeze

- Images: **0 -> 8**, exactly image 33 through 40 once each, original detail.
  Reopens **0**, crops **0**, extras **0**.
- Requests: **84**; main occurrences **84**, correction occurrences **49**,
  next-main occurrences **9**; total **142**.
- Unique source-cell addresses **139**. Matching occurrences **139**,
  discrepant occurrences **3**; matching unique addresses **136**.
  Fully matching requests **81**, address mismatches **0**, blurry HOLDs **0**.
- All independent captures and the address-order record were hashed and frozen
  **before** the first author-transcription/source-report/source-rules read.
  `independent-freeze.json` SHA256:
  `f7a1dfdfed44fe5bf7d0b6c961fc091d88a76ce40f658d5a22075db2cab54e1d`.
- The existing author transcription matches the request's expected SHA256:
  `2afbd789fa418d36427c673f17ab253219eb63717b94ff91b467b436aedebbad`.

## Evidence And Stop

`independent-address-order.md` contains every requested printed numeric string
in the exact request group/index/correction order. `capture-33.json` through
`capture-40.json` retain each first-opening page's cell strings and footer
observations. `image-ledger.json` records every transition from 0 to 8.
`independent-freeze.json` freezes those bytes and then authorizes Stage2.
`stage2-verdict.json` supplies exact discrepancy pointers, units, scale
consequences, method distinctions and verdict. `bindings.json` binds all input
files, current lesson routes and counts. `output-hashes.sha256` binds the
completed review outputs, excluding the manifest itself.

This is **one author capture plus one independent targeted-cell source review**.
No repeated content gate is added. No new OCR, render, browser, network, DB,
app, tests, tool files, promotion, answer read/edit, or pipeline state change
occurred. Other agents' changes remain untouched. Stop after these reports.
