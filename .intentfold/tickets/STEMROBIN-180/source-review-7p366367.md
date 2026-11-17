# FIRST Independent SOURCE Review: 7p Physical 366/367

Frozen verdict: **0366 BLOCK; 0367 BLOCK**. Date: 2026-11-17.
Fresh reviewer; source author closed by the user. Candidate remains untouched.
This is page-specific SOURCE review, not assembly, promotion, or course approval.

## Findings

1. **F367-01 / P1 / missing text:** `p0367#9`, candidate MD line 77.
   The source question (1) first row ends `通过这段电路`; candidate ends
   `通过这段`, then starts the next row `的电量之间有什么关系？`.
   The two characters `电路` are missing from both MD and JSON.
   Confirmed from original image 2 and source questions crop image 6.
2. **F367-02 / P2 / changed word:** `p0367#4`, candidate MD line 60.
   The source example starts `如某电动机`; candidate writes `如果电动机`.
   Confirmed from original image 2 and source example-stem crop image 5.
   This is faithful-layer substitution, not an authorized edition change.
3. **F366-01 / P2 / changed emphasis:** `p0366#3`, candidate MD line 43.
   The source bold rule starts at `要求出`; preceding `因此，` remains
   regular weight. Candidate opens `**` before `因此，`.
   Confirmed by source first-rule crop image 4; JSON repeats the same defect.
4. **F366-02 / P2 / changed separators:** `p0366#13`, candidate MD line 77.
   The source last prose row has `电压以伏特、电流强度以安培、时间`.
   Candidate substitutes commas: `电压以伏特，电流强度以安培，时间`.
   Original image 1 shows the source enumeration separators.

Current candidate MD files:

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-366367/artifacts/7p/pages/0366/page.md`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-366367/artifacts/7p/pages/0367/page.md`

## Independently Verified Facts

| Physical / Printed | Text Rows | Blocks | Tasks | Table Bands | SOURCE |
|---|---:|---:|---:|---:|---|
| 0366 / 355 | 21 | 14 | 0 | 0 | BLOCK |
| 0367 / 356 | 16 | 11 | 2 | 8 | BLOCK |

Counts include headings, standalone formulas, and footers. Table bands are
excluded from the 16 text rows on 0367. Both questions are structurally closed.
The 0366 final prose block is `open`; 0367 first prose block is `cont`.
These are local observations, not approval of inherited/unseen structure.

Full current MD parsed with the existing `blocks` module equals full current
JSON on both pages, including every block, line, flag, metadata item, and
derived figure id. Both current MD/JSON/audit triples are byte-identical to
their FIRST-finalize snapshots. Actual original PNG hashes match metadata.
The actual source PDF and profile hashes also match their declared bindings.

Actual receipts, not report claims:

- `source366-first-finalize`: exit 0, 14 blocks / 21 rows, zero audit errors.
- `source367-first-finalize`: exit 0, 11 blocks / 16 rows, zero audit errors.
- `source367-first-vectorize`: exit 0, only `tbl-p0367-01`, stdout `0.004%`.
- All three stderr streams are empty. Receipt paths and exact hashes are
  included in the frozen manifest.

These successes do not detect missing characters, changed words, or weight
boundaries; they therefore do not reverse either SOURCE BLOCK.

## Actual Final Table

`tbl-p0367-01` fidelity only: **PASS**.
Original page, actual final PNG, and actual current SVG render were inspected.
Two unequal-height columns, eight text bands, `已知/解`, the full divider,
efficiency underline, `A_1=?`, crosses, unit-product dots, approximation sign,
all numbers/formulas, and the last right-column line are retained.
No outer rectangle or fabricated row grid. Two formula rows below the table
remain separate text; no independent caption is present.

Exact box `[239,856,1065,549]`; final PNG `1089x573` has blank 12px padding.
A read-only pixel comparison confirms that its interior is exactly the
original crop and the padding is white.

Existing SVG rasterized using the already-installed Resvg, without tracing
or running vectorize. Current PNG versus that raster, using the existing
threshold 128 and 1px edge-tolerance metric:
53,263 original ink pixels; 2 missing; 0 extra; mismatch
`0.003754951842742617%`, below 2%, agreeing with rounded receipt `0.004%`.

## Uncertainties

- The first small exponent below the table was initially unresolved. Source
  calculation crop image 3 resolves it as 6; the second is 3. No arithmetic
  inference was used as glyph proof.
- Initial whole-page inventory read 0366 row 7 as `流过`; image 4 resolves
  `通过`. Candidate agrees. This inventory correction is explicitly recorded
  and is not a defect or repair.
- Candidate bolds `怎样计算电流的功？`, but the source has no clear
  contrastive bold there. This is a caution, not another proven blocking
  finding. The visible `因此，` boundary independently supports F366-01.
- Small round terminal marks do not prove ASCII versus CJK code points.
  Profile punctuation normalization and footer ornaments are not glyph errors.
- Incoming boundary supplies structure only, not TOC or source approval.
  No whole-course, subsequent-page, or inherited-source verdict is claimed.

## Evidence and Ownership

Exactly **8 images loaded / maximum 8 / context limit 24; parent payload 0**.
The ordered absolute image paths and literal source inventories are in:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p366367/source-inventory.md`

Machine verdict:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p366367/review.json`

Exact current SHA-256 bindings, timestamps, file sizes, and review evidence:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p366367/hash-bindings.json`

Read routed AGENTS/readme/project/charter, SOURCE lesson contract, image-batch
rules, and source profile. Originals were opened individually and inventoried
before candidate/author text. Only the explicitly supplied incoming pure
structure and this batch's author report/receipts were read afterward.
No neighboring images/reports/HOLDs/answers or author inventories were read.

Wrote only the owned review directory and this ticket scratch report.
No repair, prepare/finalize/vectorize invocation, assembly, promotion, backend,
DB, Git, global test, app, dependency, or new pipeline operation.
FIRST verdict is frozen for the bound inputs; any changed candidate requires
a separately identified review, not overwriting this FIRST result.
