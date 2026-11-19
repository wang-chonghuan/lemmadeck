# D861 SOURCE234 / RAW204 Affected Review

**SCOPED PASS**: precisely the two SOURCE234 join spaces and the approved
RAW204 crop-copy exclusion. No whole-page re-review, promotion, production
advance, or approval of unrelated work.

## Findings

- SOURCE234 affected text: PASS. `p0234#2` line 1 / printed row 8 adds
  exactly one trailing ASCII `0x20` before the next line beginning
  `在实验中`. `p0234#8` line 2 / printed row 23 adds exactly one trailing
  ASCII `0x20` before `分布在`. There are exactly two added body bytes.
- All other Markdown body bytes and all other JSON block/text/ownership
  fields are identical to FIRST. Its unaffected SOURCE findings remain
  retained PASS; the corrected row inventory, final period, joins and
  source233 historical note were not re-reviewed or rewritten.
- Crop contract: PASS for this authorized application only. Padding is 8;
  the sole `exclude_text_regions` item binds source block 4 / line 3 to
  exact unchanged text `涉决定了空间中所研究的点上的振幅.` and source XYWH
  `[798,1417,80,16]`. No invented figure exclusion, interior mask or changed
  counter is used.
- The original scan, prepared render/grid/template/layout and source metadata
  hashes are unchanged. Native counter/audit remains 26/26; coarse box
  `[795,1425,490,255]`, snapped box `[806,1425,467,256]` and native nine-component
  geometry provenance are unchanged. Only crop provenance was added to audit.
- RAW204 PNG: PASS. Size 483 x 272; source exclusive XYXY
  `[798,1417,1281,1689]`. Every RGB pixel equals that source rectangle except
  the authorized white copy-only rectangle. It removes exactly 547 prose-ink
  pixels and zero figure pixels. All 7086 substantive source figure pixels
  and two isolated source specks remain. Neighboring prose and caption ink
  are both zero; L/T/R/B white margins are 8/13/8/8 px.
- Independent connected-component measurement: PASS. Removed/retained source
  component sets are disjoint; no connected stroke is severed.
- RAW204 SVG: PASS. Source-first visual comparison of original page/region,
  repaired PNG and reviewer-only SVG raster confirms unchanged S, R, a, b, B,
  star, complete visible arc, radius arrow, emphasized patch and horizontal
  S-to-B ray/dot. Both outputs contain zero neighboring prose/caption.
- SVG representation is not pixel-identical: 1 missing ink pixel, 0 extra
  beyond 1 px tolerance, 0.014108352144469526% mismatch. The missing pixel is
  source `[818,1570]`, a singleton background speck. All 7086 substantive
  figure pixels are supported within vector tolerance; no figure stroke or
  label is the mismatch. Do not describe vector rasterization as lossless.

## Retained Evidence

FIRST was read before the repaired report: `d841` review, final source-row
inventory and pixel inspection. Original SOURCE234 was opened before the
repaired author report; repaired PNG was then opened directly. The source-region
enlargement and repaired SVG raster were inspected after reviewer measurements.

All 23 `d834` author-freeze entries and all 19 `d841` review-freeze entries
hash-match, including the original SOURCE HOLD / RAW FAIL and the retained
first reviewer measurement failure. Four preparation source/copy bindings and
all d857 supplied input/tool/output/receipt hashes match. The 74 distinct
bound inputs are in `inputhashes.json`; final freeze rechecks each.

Native necessary retry2 is reused, not replayed: finalize exit 0 / 26 of 26,
vectorize exit 0 / recorded 0.014%. All 15 existing focused crop-contract
checks, including actual-source connected-component protection, are retained
PASS and were not rerun. This is no new general p2c core validation.

## Usage And Boundary

Current image loads: **4**, one batch, limit 8; context payloads **4**, limit 24.
They are original SOURCE234, repaired PNG, original-source region crop/enlargement,
and repaired SVG review raster. Crop loads 1; SVG raster loads 1; direct reopens 0;
previous/next-page image loads 0. Numerical image decoding does not send image
payloads into context. Historical d841 loads 5 and d857 parent loads 1 remain
historical; they are not reset or included in this fresh review's context count.

Current repair rounds/candidate edits/core edits/producer calls/focused-check
replays/full tests/builds/paid calls/canonical writes/shared-index or meter
writes/modern work/DB/publish/deploy/Git/Plane/chat actions/new branches or
worktrees: **0**. The already recorded d857 ordinary content repair remains
one historical round. Current reviewer SVG rasterizations 1, reviewer crops
generated 1, independent reviewer scripts 2 (both first runs PASS), targeted
read-only singleton diagnostic 1, freeze helper invocation 1.
No technical reviewer measurement failed.
The initial existence probe reported the owned output directory absent;
creation occurred only through reviewer file additions.

Every shell command used explicit workdir
`/Users/yong/.codex/worktrees/00b1/lemmadeck`. All review writes are exclusively
under this d861 directory. Registered global IntentFold instructions were
read without invoking a capability. An initial reference-only image-skill
read used the registry's primary-checkout path, then the active R copy was
read; no task/candidate input from another checkout was used and nothing
there was written. This reference-read deviation is recorded, not concealed.

The shared checkout is not claimed globally unchanged. Input hashes are
checked rather than assuming other workers stopped. This report and its
inputs are frozen read-only with `freeze.json`; no original failure,
candidate, core, index or meter is edited. Stop after this scoped review.
