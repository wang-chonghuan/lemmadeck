# STEMROBIN-180: Sole FIRST Source Review, 8p Physical 40

Decision: **BLOCKED**. Sole FIRST review 1/1 in the same C rolling OFFLINE batch30 invocation. Source approval and promotion remain false. No source patch, replacement review, finalize rerun, supplementary finalizer checker, freshness restart, Grill restart or budget restart.

Workspace base: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

## Confirmed Smallest Correction

**C01, punctuation only:** `p0040#7`, printed row 2 (independent row `r13`; `page.json.blocks[6].lines[1]`) prints `在正方向上完成的位移. 其绝对值等于 2 米，而物体 4 在这`. Both current MD and JSON instead contain `在正方向上完成的位移，其绝对值等于 2 米，而物体 4 在这`.

Replace only the comma after `位移` with `. `, retaining the space before `其`. This is independently recorded in the frozen source facts and visible in the original-derived bottom crop, not inferred from grammar. The author source-facts copy also records the incorrect comma. The profile requires ASCII sentence periods. Row count, mathematics, numbers, units and other punctuation are unchanged. **Proposed only; actual applied source corrections: 0.**

## Separate Unresolved Certainty

**U01, footer typography:** independent row `r17` confirms printed `28` and two flanking dot glyphs, but the frozen inventory did not separately settle whether `28` is italic. Its empty row emphasis list must not be treated as affirmative evidence that the digits are upright. Current MD/JSON use `· *28* ·`; the author's italic claim is not independent source evidence. This is a reviewer style-completeness limitation, not a confirmed candidate defect. **BLOCKED**; do not remove italics or invent a corrected span. Frozen ownsourcefacts remain unchanged and are not backfilled from the candidate. No original, crop or final-figure reopen occurred.

## Source And Candidate Comparison

The original was read first, followed by three own original-derived crops, before any candidate, template, layout, author facts or author report was read. Own facts were created exclusively with mode `0444`: `.tmp/ld-s10y-lesson/source-review-8p40-first/ownsourcefacts.json`, 14726 bytes, SHA256 `ac84c0a4edf53272f457a5f6ab5424acdf1512df062795e610557459a1867670`.

Printed page 28: 15 prose rows + 1 separate FIG29 caption row + 1 footer row = **17**. Current MD/JSON and actual finalizer: **17/17 rows, 9 blocks, 1 figure**. Identity is `page.meta.book = "8p"` and `page.meta.page = 40`, not top-level page fields. Rows `r01` through `r12` and `r14` through `r16` agree in text and punctuation under declared math delimiters and fullwidth CJK parentheses. Row `r13` is C01; row `r17` has U01.

No new printed heading, exercise heading or literal exercise occurs. The initial anonymous prose is `p cont`, ends on this page, and has no independently assigned lesson identity. `p0040#3 open` joins `p0040#6 cont` through transparent FIG29 and caption blocks. The final two prose rows are `p open`; no page41 source was read. No block is `samerow`. The caption and footer are separate rows. Mathematical italic A, lowercase x in x=0, and the two uppercase X prose references agree. No independently marked Chinese bold, Chinese italic or underdot span was observed. U01 is not silently waived.

## FIG29

Actual final `.tmp/ld-s10y-lesson/source-author-8p-3940/current/0040/figures/fig-29.png` was inspected once: 11781 bytes, SHA256 `aaab14893fbd40683eeb37a953577393a8d46ef4641e0def71a2dbdc03328e1f`.

It preserves all four numbered solid lines and their `v1 = 3`, `v2 = 1.5`, `v3 = 0.5`, `v4 = -1` labels with 米/秒 units; lowercase x with 米 on the upward axis; t with 秒 on the rightward axis; both positive axis arrowheads; labelled 0, 2, 4, 6, 8 and vertical -2; visible minor ticks; and the unlabelled dashed horizontal guide at the common initial ordinate near 3. Number/velocity label attachments and the descending line's horizontal-axis crossing remain intact. Motion lines and dashed guide have no arrowheads. No invented point marker or grid was added. The caption stays below and outside the final graph crop. Final figure source fidelity: pass; page source decision still BLOCKED.

## Authority And Actual Proof

Only the clean authority `.tmp/ld-s10y-lesson/source-author-8p-3940/current/0040/manifest.json` was bound: **11159 bytes**, SHA256 `6d4b84c4f752f376cb34e4db811f0bc113847c508e95da1140af6a8dd6e43609`. It is an OBJECT with **47 direct `files` entries**, explicit workspace base, and workspace-relative flat paths. All 47 identities matched. Nested origin/history/source_path/declared_by references and paths printed inside receipts were not traversed.

Bound FIRST-result inspection stdout contains MD, JSON and audit identical to the clean current files. The existing `batch30-8p40-finalize-first.call.json` is the sole actual finalize proof: 2026-11-16T18:38:08.388Z through 18:38:08.823Z, exit **0**, one call, one success, stdout 174 bytes/SHA256 `66e00923ddecac355babdd771d5a82193b5c656fe385c9dd4c139fd79870dffa`, stderr 0 bytes. Audit has 17 printed / 17 MD rows, no errors, unknown characters, normalizations or KaTeX warnings. This mechanical pass does not repair C01 or resolve U01.

Bound profile SHA256 is `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`. Current lesson/image rules, blocks, layout, mathcheck, normalize, p2c, recorder and katex_check identities match their direct bound copies. Existing receipt streams are preserved and matched, not recreated. Original/current authority files retain actual mode `0444`; their direct review copies are exclusively created `0644`. Frozen ownsourcefacts, FIRSTreview and imageledger are exclusively created `0444`; no chmod.

## Structural Limits

Incoming `.intentfold/tickets/STEMROBIN-180/tmp/incoming-8p3940-structure.json` was read only after ownfacts froze, as structural text, and matches its bound tool copy. It cannot establish missing source-page approval. User-supplied current structural state is retained without reading page39 body/images or mixed global reports/ledgers: page38 FIRST pending; page39 BLOCKED, entrance-path mechanical repair 1/1, then 20 machine / 18 source rows, actual applied source corrections 0, FIG27 final unreviewed.

Permanent gaps: **17, 18, 20, 23, 24, 25, 26, 27, 29, 30, 33, 34, 35, 36, 37, 39**. 8p remains **10 approved source pages, 0 entries, 0 complete modern lessons, exercise numbering UNSET**. No cross-gap assembly or complete-lesson claim.

## Accounting And Delivery

Current page40 source budget remains **0/1 spent, 1 unused**, actual source corrections 0; one confirmed proposed correction is not an applied correction. Existing finalize calls 1, new finalize calls 0, source review 1/1.

Review images: **1 original + 3 own crops + 1 actual final FIG29 = 5/8 batch and 5/24 context**; own crops 3/4 maximum, reopens 0, parent images 0. The author's separate page40 ledger claims 4 images and is not added to this fresh review context. No author crop/grid was visually opened. No images are returned to a parent or final answer.

Immutable review files and preserved direct evidence live in `.tmp/ld-s10y-lesson/source-review-8p40-first/`. The explicit-base flat `manifest.json` contains only existing direct files and excludes itself; this report is already at the exact ticket path above. Recorder labels begin `batch30-8p40-first-review-`; each referenced call and its streams is actual, unique and preserved. Stop state: **inflight 0**.
