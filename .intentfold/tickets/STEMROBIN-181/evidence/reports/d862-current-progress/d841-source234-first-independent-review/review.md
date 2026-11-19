# SOURCE234 FIRST Independent Review

## Decision

- **SOURCE: HOLD**, exactly two necessary trailing ASCII join spaces.
- **RAW204: FAIL**, neighboring prose and caption ink in both frozen PNG and SVG.
- **FIRST-native: PASS as recorded**, finalize 26/26 and vectorize exit 0.
  No producer was rerun. Native execution/count success does not approve SOURCE
  or RAW; close PNG/SVG agreement does not make a contaminated crop clean.
- No candidate or source repair, canonical promotion, assembly, counter/core
  change, meter/index change, Git mutation, DB/publish action, paid call, new
  branch/worktree, or other-chat action was performed.

All review outputs are beneath:
`/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d841-source234-first-independent-review/`.
All commands used explicit workdir `/Users/yong/.codex/worktrees/00b1/lemmadeck`.
The checkout is shared; this review does not claim other workers left it unchanged.

## Independent Order

1. Read lesson, image-batch, and production-resume rules, plus project entry rules.
2. Locate hashes through author `inputs.json` and `freeze.json`, not report prose.
3. Verify and open original SOURCE234 `page.png`; write `source-first-inventory.md`.
4. Only then read candidate page/layout/audit/native receipts and open RAW PNG.
5. Produce reviewer-only source enlargements and rasterize the frozen SVG.
   Record `independent-findings-before-author-report.json` before reading report
   semantics.
6. Read the author report only to compare independently recorded findings.
   Check approved source233 through d836 and its hash-matching tail text; no
   source233 image or source235 content is opened.

All 23 files in the author's freeze match; all four preparation source/copy
bindings match. `frozen-inspection.json` records exact paths, sizes and SHA256s.
SOURCE234 is 1536 x 2337, physical page 234, folio 224.

## SOURCE

The final exact inventory is `source-row-inventory.json`: 25 prose rows, one
folio row, and one caption sharing prose row 21, hence 27 text records / 26
distinct physical rows. The nine blocks are six prose fragments, fig, cap,
and foot. No heading, exercise, table, or real formula wrap is present.

`p0234#1 p cont` correctly joins approved `p0233#7 p open`:
`另一屏幕` + `上的小孔$A$`. The incoming paragraph closes at row 7.
The bold `菲涅耳学说` lead-in belongs to the existing prose row/paragraph.
`p0234#5 p open` correctly joins `p0234#8 p cont` across transparent
fig/cap blocks: `球` + `形波面`. `图　204` uniquely belongs to fig-204 and
is a separate `cap samerow`, not figure geometry or another physical row.

Necessary future text repairs, **not performed**:

| Ref / Printed Row | Exact Necessary Change |
| --- | --- |
| `p0234#2`, line 1 / row 8 | Append one ASCII space after `顶峰.`: `顶峰.在实验中` -> `顶峰. 在实验中` |
| `p0234#8`, line 2 / row 23 | Append one ASCII space after `发射光.`: `发射光.分布在` -> `发射光. 分布在` |

These are authoring/layout joins, not missing sentences, scientific mistakes,
new printed rows, or grounds to modify the counter. No other candidate
transcription/ownership repair was found.

The first source-only inventory mistakenly claimed the final period was absent.
The original record is retained, not rewritten. `source234-bottom-review.png`
shows it; the period is at source `[1288,2011,8,7]` with 36 ink pixels.
Row 25 ends `即直线传播.` and there is **no outgoing open object**. Do not add
tail `open` or remove that period. `source-row-inventory.json` is the corrected
final inventory.

Source233 now has d836 durable approval, as the user stated. Its page JSON hash
matches `79eda68d93c523cc7e8a96c051b2c0d07252a8ec1c133c92031e5c75bd179f35`.
The author's frozen "source233 pending" note is historical context, not a reason
to rerun or re-review source233 and not a current approval assertion.

## RAW204

Original schematic inventory: source/star `S`, observation dot `B`, straight
S-B line, full visible partial spherical wavefront, oblique radius with `R`
and its arrow/endpoint, and emphasized patch with lowercase `a`/`b`. No extra
panel, grid, full circle, numeric value, or invented label belongs to the source.
All required figure geometry and five labels are present in the frozen output.

| Binding | Exact Value |
| --- | --- |
| Author coarse box, XYWH | `[795,1425,490,255]` |
| Native snapped box, XYWH | `[806,1425,467,256]` |
| Default padding | 12 px |
| Frozen PNG size | 491 x 280 |
| PNG source rectangle, exclusive XYXY | `[794,1413,1285,1693]` |
| PNG SHA256 | `b38ec8fd8d798ef592e14a1bec0373becd6ac3cbd849fc9f17052e53d84fc5e8` |
| SVG SHA256 | `7092174eba106ef632b969d680ca5286ce0eb09844e7a99486ff41b65d742cff` |

PNG pixels equal that exact source rectangle. At threshold 128 it includes
**732 prose-ink pixels** at upper left from source row 17 and **74 caption-ink
pixels** at the bottom. Top prose extends through y=1432; the caption starts at
y=1689. These are retained in `raw204-frozen-svg-review.png`, not only the PNG.

The source-derived figure-only union is `[806,1430,467,251]`; its six substantive
connected components contain 7086 ink pixels. `sourceComponentsInROI` in
`pixel-inspection.json` records each figure and neighboring-text component.
The native count of nine components is not a semantic inventory.

Frozen SVG vs frozen PNG: 7894 source ink pixels, 3 missing, 0 extra, 1 px
tolerance, **0.038003547%** mismatch. This agrees with native vectorize's
displayed 0.038% and is below its 2% limit. This is a **representation PASS**,
not a RAW source-cleanliness PASS.

## Crop Recommendation

**No scalar padding from 0 through 12 makes this frozen box clean.**
The padding-only diagnostics are reviewer evidence, not new production candidates.

| Padding | Upper Prose Ink | Caption Ink |
| --- | --- | --- |
| 0 | 234 | 0 |
| 2 | 302 | 0 |
| 8 | 547 | 0 |
| 9 | 592 | 2 |
| 12 | 732 | 74 |

`padding0-diagnostic-only.png` visibly retains prose and has zero white margin
at all four edges. A 2 px suggestion is also insufficient. Padding 0-8 excludes
the caption; 9-12 captures it. Moving the top crop boundary to y=1433 to omit
the prose would remove **22 figure-ink pixels**, clipping the wavefront tip.
Do not shrink/crop off legitimate geometry, hand-edit SVG paths, or adjust the
source row counter to conceal this.

If a future repair separately authorizes a precise **crop-copy-only prose
exclusion**, preserving the original source and all figure ink, a measured option
is: retain this exact box, choose **8 px** as the largest caption-free padding,
and exclude source-relative rectangle `[798,1417,878,1433]` (exclusive XYXY).
That rectangle contains 547 unwanted prose pixels and **0 figure pixels**.
The hypothetical crop rectangle is `[798,1417,1281,1689]`, size 483 x 272;
numeric simulation leaves L/T/R/B white margins **8/13/8/8 px** and all 7086
substantive figure pixels, plus two source specks. No repaired PNG/SVG was saved.

This is a recommendation, **not an authorized or approved repair**.
The existing `figure_crops.padding_px` contract alone cannot accomplish it.
`exclude_figures` is restricted to actual neighboring figures; do not invent a
figure ID for prose, misuse that contract, or silently implement masking/core
changes. A supported, narrowly authorized nonfigure-ink exclusion mechanism
and affected RAW review would be needed before any RAW approval.

## FIRST, Failures, And Scope

Original d834 author input, candidate text/PNG/SVG defects, FIRST started/stdout/
stderr/receipts, and the author's HOLD remain at their original frozen hashes.
No execution failure existed in d834: finalize and vectorize both exited 0.
No passed producer stage was rerun and no revised FIRST receipt was invented.
D836's previous verification failure is retained in its durable receipt location;
source233 approval was reused as text context, not reset.

Reviewer diagnostic first failure is retained as `measurement-first-failure.json`
and byte-identical `measure-recommendation.first.py`. Its exact failed assumption
was corrected using component bounding-box identity, and only that reviewer
numeric measurement was rerun. The rejected first recovery patch is recorded
there too. These are technical review-tool failures, not scientific verdicts
or native producer failures.

One scope deviation occurred: an initial **read-only `git status --short`**
was run before narrowing fully to this review. It was unnecessary under the
user's no-Git restriction; no Git state was changed and no further Git command
was used. No claim of full no-Git-command compliance is made.

Images loaded into context: **5 / one batch**, under 8 batch / 24 context limits:
original SOURCE234 page, frozen RAW PNG, source-bottom enlargement, frozen-SVG
review raster, and padding-0 diagnostic. Generated but not opened evidence images
do not add image payloads to this context. Prior-page image loads: **0**.
Producer reruns, candidate edits, paid calls, new approvals, and production
advances: **0**. All review writes remain within the authorized directory.

Freeze this directory and stop. This review does not complete a lesson/card,
approve source234, advance the production meter, or authorize a repair.
