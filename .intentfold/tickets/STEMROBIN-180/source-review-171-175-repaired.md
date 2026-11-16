# Source171–175 Affected-Only Independent Review

Date: 2026-11-16. Identity: `independent_agent`, current Codex reviewer, not Wegener and not the author or repairer of these source pages. The s15 answer-author task is complete and is not part of this source review.

**Verdict: PASS for all six repaired source units.** Combined with the unchanged substantive conclusions from the first full review, the five pages in the exact repair-1 copy are eligible for main's source promotion. This does not approve the original defective freeze, any subsequent page, modern content or an assembly.

## Authority and Preserved First Failure

Current repair root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-171-175-repair-1`

Author handoff: `author-handoff.json`, 29354 bytes, SHA256 `07eced6e1719bf4151c18f94f1d198b6c2c796a3081c91bb175f1c68f789f121`.

Author manifest: `manifest.json`, 17401 bytes, SHA256 `2f8f7ab6122acd8f75aad9d370c044bdc06cb556f7b7041f14b30935b1653656`, exactly matching main's notification. All 64 distinct listed files were checked against actual byte counts and SHA256; zero mismatches.

The original full report remains unchanged:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-171-175.md`

Its 18336 bytes and SHA256 `d8a1453ee8dc9fcbd7d71c870b361d15618b292cbb312d786290f3d1677d481d` also match the preserved copy at `first-failures/independent-review-1/source-review-171-175.md` under the repair root. That first FAIL is not overwritten or relabelled PASS.

The original author manifest remains 24081 bytes, SHA256 `744afca4d6ea94b1a8b8f7e76b8e7f8db7923622f8a23591097ef38de558fa6f`; its original handoff remains 56062 bytes, SHA256 `bb5959fa7c02dd6a63a360395e24dd59c2dc9cfe6d4058dffa77d59e128cf9e2`. All 92 original manifest files remain exact; zero mismatches.

## Six Actual Source Comparisons

Each affected area was displayed individually from the existing original ungridded `work/6p/pages/NNNN/page.png` in the original frozen root, without writing an image or opening a browser. The repair-copy full-page PNGs are byte-identical to those originals.

| Finding | Stable unit / repaired MD line | Actual source and repaired MD/JSON | Result |
| --- | --- | --- | --- |
| B171-F | `p0171#12`, line100 | Round dot before160 and round dot after160; `· 160 ·` | PASS |
| B172-F | `p0172#8`, line78 | Round dot before161 and round dot after161; `· 161 ·` | PASS |
| B173-F | `p0173#10`, line82 | Round dot before162 and round dot after162; `· 162 ·` | PASS |
| B174-F | `p0174#11`, line105 | Round dot before163 and round dot after163; `· 163 ·` | PASS |
| B175-F | `p0175#13`, line94 | Round dot before164 and round dot after164; `· 164 ·` | PASS |
| B175-1 | `p0175#12`, line91 | Original character is **浮**; repaired line preserves “分别浮在” | PASS |

The dot-pair encoding uses U+00B7 with spacing while preserving both visible signs, their order and each page number. These are the actual printed footer marks, not scan specks, extra body rows or replacement plain enumeration. The `printed_page` values160–164 and foot-block identities remain unchanged.

Actual original-pixel view rectangles, using half-open x/y endpoints:

- 171 footer: `(0,2010,1472,2172)`.
- 172 complete footer: `(1100,1970,1400,2070)`. The initial `(0,2010,1472,2161)` view clipped the top edge of the digits; the same footer was reframed to show the complete signs. This was only an in-memory inspection viewport adjustment, not a candidate repair or gate rerun.
- 173/174/175 footer: `(0,1970,1472,2110)` for each respective original.
- 175 verb and visible sentence tail: `(590,1915,1350,1985)`.

The corrected complete MD/JSON source line is:

> （3）图169所示的是同一个物体分别浮在两种不同的液体中的情

The changed JSON location is `/blocks/11/lines/0`, corresponding to `p0175#12`, Exercise32/3. The source distinguishes floating from immersion; “浮” is now faithful. The existing `ex 3 open`, `open:true`, numbering, figure reference and terminal “情” all remain unchanged. The new handoff's `current_last_open` matches this line, but the actual original pixels, not the handoff, establish the source reading. No176 continuation or fig169 pixels were read or inferred.

## Bounded Delta and Mechanical Evidence

Read-only complete-file comparisons establish exactly six MD source-line changes and the corresponding six JSON line changes, with no additional source edits. This is integrity checking of the affected copy, not a repeated substantive review of all body text.

For each page, replacing only the original numeric foot line with `· number ·` reproduces the complete repaired MD byte content. For175 only, the one additional `分别浸在` → `分别浮在` replacement reproduces its complete repaired MD. The paired JSON comparison likewise changes only five foot-line values and175 `/blocks/11/lines/0`; all other blocks, lines, metadata, source bindings, owners, notes, errata and open/cont/samerow fields are equal.

Every audit is byte-identical to the first reviewed audit. Existing official repair finalize records were inspected, not rerun:

| Page | Blocks | Existing printed/MD rows | Recorded repair finalize invocations / exit | Audit |
| --- | --- | --- | --- | --- |
|171|12|27/27|1 / 0|unchanged|
|172|8|26/26|1 / 0|unchanged|
|173|10|25/25|1 / 0|unchanged|
|174|11|22/22|1 / 0|unchanged|
|175|13|19/19|1 / 0|unchanged|

Totals remain54 blocks and119 rows. All five audits have empty normalization, unknown-character, KaTeX-warning and error arrays. Correct row counts alone are not the basis of the source PASS; the six actual source comparisons above are.

Each recorded finalize argv identifies the repair artifact/work roots and correct page. Its input-MD path, byte count and SHA256 match the current candidate. All recorded stdout/stderr hashes match actual files, stdout agrees with the unchanged audit and stderr is empty. Each call records stable before/after tool hashes, including `layout.py` `c64ba63bdb73b29cf984f3d63438ab78b5f16d179b8c800c9d3917ced0bd7271`. Historical original-stage tool provenance is retained as recorded; current tools were not rerun, edited or treated as the source witness.

Of the repair candidate's artifact/work files, 33 files excluding the ten intentionally changed MD/JSON files are byte-identical to their original counterparts: five audits, five layouts, five templates, five ungridded PNGs, five grid PNGs, four crop PNGs and four SVGs. No source geometry, crop pixels, SVG or existing provenance content was changed. The unchanged page JSON source bindings retain the original source-PDF provenance, rather than inventing a new source for the copy.

## Explicit Reuse, Not Re-review

The first full review's checked conclusions for all54 blocks/119 rows, all four actual crops, exact source-box interiors, vector XML/contracts and existing vector mismatch evidence are reused. No complete body, crop or SVG visual review was repeated.

The already checked caption/ownership/continuation and source-uncertainty conclusions remain applicable because their bytes and fields are unchanged. In particular, the source's first `图168，б` reference remains Cyrillic and is not silently corrected; its documented source-print issue remains. The withdrawn171 preliminary “圆柱体” concern is not reopened or converted into a defect. No new answer, missing continuation or source correction was inferred.

## Approved Binding and Disposition

The approved exact-file manifest is:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-171-175-repaired/approved-manifest.json`

It binds this independent report, the exact repair author manifest/handoff, all15 repaired page MD/JSON/audit files, all eight unchanged crop PNG/SVG assets and the original-source/first-failure provenance. Approval applies only to those repair-root page artifacts and unchanged figure assets, using the reused full review plus this affected-only PASS. The author's handoff remains `independent_affected_review: pending` as frozen; this separate reviewer record supplies the decision without modifying it.

Reviewer calls: prepare0, finalize0, vectorize0, rendering/gates0, assembly0, promotion0, author edits0, browser0, model/service0, Git0, DB0, network0. Original-pixel strips were emitted in memory only; no image/evidence file was created.

**PASS; hand back to main for promotion/assembly.** No action on176+ or any other cohort is authorized by this record.
