# n34 Figures 46-49: Independent FIRST Visual Gate

Ticket: STEMROBIN-182. Date: 2026-11-18. Sole command cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

**Verdicts: fig-46 PASS; fig-47 REVISE; fig-48 PASS; fig-49 PASS.**

## Required Revision

**Fig-47: the repaired `-2` clears the curve but no longer has an unambiguous tick association.** In the CURRENT 640 px preview it sits northwest of the zero crossing and horizontally nearer the `x=-3` gridline than its own `x=-2` division. No tick/leader connects the displaced caption to the correct division. Existing offline layout evidence corroborates the observed placement: label center approximately 121.33 px, correct division 149.33 px, neighboring `x=-3` gridline 106.67 px. This is a scale-reading ambiguity, not the earlier collision.

Keep the exact curve, domain, zeros, endpoints and grid unchanged. Center `-2` on its own division with suitable vertical clearance, or explicitly connect a displaced caption to that tick as a declared typesetting addition. The repaired result requires a fresh bounded reviewer; this context has exhausted its image budget. No pass `review@1` is written for fig-47.

## Independent Observations

| Figure | Source and CURRENT preview observations | Verdict |
| --- | --- | --- |
| 46 | 36 x 14 unit cells; 37 vertical/15 horizontal lines. Solid curve retains (0,7), minimum (6,3), maximum (16,10), endpoint (24,6), broad trough/crest and the decrease/rise/decrease shape. Dashed projections only at 16/24. All source values and x/y are readable; no added units, formula or answer labels. | PASS |
| 47 | 12 x 12 unit cells. Domain [-3,7], endpoints (-3,-4)/(7,-3), zeros -2/6, y-intercept 3, descending (4,3), and maximum (2,4) preserved. Solid asymmetric curve, no extra turn/guide/endpoint circle. CURRENT repaired y=2 and 6 labels clear the curve. Displaced -2 has the tick-association issue above. | REVISE |
| 48 | 12 x 12 cells, TWO units per cell on each axis. Solid line is exactly y=x/3+2 through (-6,0), (0,2), (6,4), (12,6), bounded at x=-10/14 with heights -4/3 and 20/3. Horizontal formula above the line is correct and clear. | PASS |
| 49 | 12 x 12 ONE-unit cells. Solid y=-0.5x+1 through (-4,3), (-2,2), (0,1), (2,0), (4,-1), (6,-2), with boundary heights 3.5/-2.5 at x=-5/7. Formula below the line is exact. Moved x=4 value stays aligned to its division and clears the line. | PASS |

No answer key was consulted. No new answer-bearing annotation or cultural text/symbol was observed in any candidate. Current previews are the complete 640 px media, not crops or earlier failure images.

## Text And Hash Binding

All 42 current modern prose entries and all eight exercise entries were read before loading images. Registered `p0215-math-1` corrects the modern rising interval to `]6,16[`; the retained `source_text` and source snapshot still have raw `]0,16[`. Current cleaned prose[17], contiguous bold prose[23], Latin exercise labels and section boundaries do not change these figures' mathematics. Context/spec for 48/49 retain an earlier orphan asterisk in nearby prose; formulas remain identical. This layout-only difference is disclosed, with the full current text separately hashed.

- Current modern lesson SHA256: `203f46e1097f28784e8a6d3c0c205add59240f91e05a05f1c9f4fc8c30b2146e`.
- Current modern exercises SHA256: `b913c6c7ac477537ed3769c7d0cc939d855d8e2a675e078a01e46b58e99280dc`.
- Pre-open receipt SHA256: `393fb406892cbcb9a58c9e218ff32a9a3b0cf3d1e8ee98b63e6dbca09e797824`.

The JSON companion contains the requested `figures` array with each `id`, lowercase `pass`/`revise`, `source`, `spec`, `render`, `svg`, `preview` path/SHA256 pairs and `findings`. Pre-open hashes additionally bind each context, inventory and existing offline report. All 34 bound files were rehashed after observation and were unchanged; existing render/spec/SVG and offline-input bindings match.

## Image Receipt And Scope

**Actual observed: exactly 8 images in fresh context.** Order: 46 original/current, 47 original/current, 48 original/current, 49 original/current. Four source loads plus four current complete-preview loads; zero reopens, crops or earlier failed preview loads. Every image was hashed before loading. Image ordinals and hashes are in the reviewer-owned `image-load-ledger.json` receipt.

Only the two FIRST report files and reviewer-owned sibling receipts were written. No candidates/source/app/Git/env/network/DB/promotion actions. Previous failure history was not erased or overwritten. Successful mechanical/render/offline stages were read, not rerun; they do not override fig-47's independent visual failure. No formal `ld-s10y-image/review@1` file, promotion approval or live-product acceptance was produced. Any changed source/spec/render/SVG/preview invalidates the corresponding verdict.
