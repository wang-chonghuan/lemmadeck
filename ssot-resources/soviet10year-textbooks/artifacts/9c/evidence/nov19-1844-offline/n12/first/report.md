# N12 Offline Visual Review

Verdict: **FAIL**. Only this six-image offline visual batch is reviewed. Prior independent mathematics, content review and answer-runtime Gate2 are unchanged and were not replayed. Choice semantics remain **NOT_REVIEWED_AWAITING_FRANKLIN**; no whole-lesson PASS is declared.

## Findings

1. **F001 / P2 / blocking:** Mobile text's long equation `-117\frac{1}{3}=-117.3333\ldots=-118+\frac{2}{3}=\overline{118}.66666\ldots.` loses the final decimal tail in its default view. The single mobile screenshot shows the cutoff. Saved wrapper geometry is x=16, y=1524.758, width=343; clientWidth=328 versus scrollWidth=427. The actual recorded maximum internal scrollLeft is 99.5 and the far right is internally reachable, but that is not simultaneous visibility of all mathematical detail. No page-level horizontal overflow does not cure formula-level clipping.
2. **F002 / P3 / nonblocking:** Desktop and mobile writing views show short gray native scrollbar thumbs beside 113d/e/f fractions. All tokens remain readable; no glyph loss is established. This visible artifact was not caught by the horizontal DOM assertion. Vertical metrics were not captured, so its exact cause remains unproven.

No repair was applied. A later authorized fix for F001 should break the equality chain deliberately while preserving every token, integer-only bar scope and contracted font size. A later F002 investigation must not hide actual math ink.

## Six Views

| View | Original DOM | Single-open pixels | Native assertions |
| --- | --- | --- | --- |
| desktop text | FAIL | PASS | 16/17 |
| desktop exercises | PASS | PASS_WITH_FINDING | 18/18 |
| desktop choices | PASS | PASS | 56/56 |
| mobile text | FAIL | FAIL | 16/17 |
| mobile exercises | PASS | PASS_WITH_FINDING | 18/18 |
| mobile choices | PASS | PASS | 56/56 |

Desktop text's six approximately 2px subscript scroll-width warnings have no established corresponding painted-glyph loss in the inspected screenshot. The original native FAIL and exit 1 are preserved, not rewritten as PASS. Odd KaTeX line-box height alone is not treated as a font/em defect.

All 17 paragraphs, both writing exercises 113/114 with 6+4 labels, and all 10 choice questions / 38 options exist per viewport. Formula roots and mathematical ASCII labels use KaTeX_Main at 1.1em; used local font faces are loaded, KaTeX errors are zero and HTML images are zero. Option letters, radios, wrapped descriptions and last/rightmost options are visible with no observed collision or clipping. Full per-option geometry and formula strings are in `option-geometry.json`; this is presentation indexing, not an answer review.

The browser recorded 76 order-only native label clicks with one selected radio per group after every click. All six existing navigation links were clicked successfully. Screenshots were taken after navigation reset and intentionally show an unselected view. The writing view has no answer controls; no widgets or keys were added. No grading code ran.

## Native Evidence

Headed app-installed Playwright 1.61.1, Chromium 149.0.7827.55, succeeded without fallback. Context viewports were exactly 1440x960 and 390x844, deviceScaleFactor=1. Tall-page full-page PNG widths are 1425/375 because of the native 15px scrollbar gutter, not substituted viewport sizes.

The actual check exit is **1**, its stdout/stderr and script SHA remain bound by `check.native-exit.json`. Browser shutdown exit is **0**. GPU mailbox diagnostics are retained in actual browser stderr; no page JavaScript or console errors were recorded and no blank images were observed. The six HTML page requests were loopback-only with no external source URLs; this is not an OS packet-capture claim.

Browser PID 1913 and loopback port 49222 are closed. The final ps/lsof probes returned expected no-match exit 1 with empty stdout; full probe results are in `closure.json`. Artifact closeout utility exit is recorded separately and must not be substituted for the failed gate exit.

## Input SHA-256

- `text.html`: `3fd08b66b4a9bab84f115b0c1a559450e6bdaee2152865b3836cd0b902d81ba8` (433464 bytes)
- `exercises.html`: `bcc1f1540f905748c85bfdc2d474bef802e4be763eaed3a5c8a9a0a3229c6f42` (380939 bytes)
- `choices.html`: `d8bea6d6e3a93be49cd28e1d948920be38ba4794e665c306becfa2f4c9c52182` (504058 bytes)

Inputs were checked unchanged at capture completion and again at closeout. Screenshot bytes and dimensions were also verified without reopening any image.

## Pixel Budget

Prior opens 0; this batch captures 6, opens 6, each once; reopens/crops/additional captures 0. `images-ledger.json` binds each image and its observation. The original capture-phase ledger with opened=0 is preserved as historical capture state, not the final budget.

All six individual observations and inspection limitations are in `visual-observations.json`. Long full-page screenshots were opened once without independent magnified raster inspection; geometry supplements the visible evidence. No HTML, canonical, preview, source or candidate was changed; no generators, source mathematics, Gate2, browser replay, installation, DB, Git, publisher or peer messages were used during closeout. Only this child batch ends; parent production is unaffected. Await parent durable intake.

## Finalization

Closeout utility exit was 0; it only created artifacts and does not replace visual-check exit 1. Its original stdout's report hashes match preserved `report.preseal.json/md`. Before intake, two text-only description corrections were applied and rebound in the final report; `editorial-finalization.json` records them. No image, browser, source mathematics or gate was replayed.
