# STEMROBIN-188 n38 Affected Review7

Status: **PASS, affected six mobile formula endpoints only**. Finish: review.
Date: 2026-11-23.

Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Owned directory: `.intentfold/tickets/STEMROBIN-188/tmp/n38-exercises-display-independent7`.

## Evidence And Bindings

The one complete contact sheet was opened exactly once. No original screenshot was reopened, no individual window image was loaded, and no browser or capture was run by this reviewer.

- Affected manifest: `ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/display7/exercises-six-mobile-formula-windows7.json`; SHA256 `466da4f9e9db58b2b817f0cd2f31dae7705f4d9090fe2789c7d191f2a7053e7e`.
- Contact sheet in the same directory: `exercises-six-mobile-formula-windows7.png`; SHA256 `43d28137c2a3305a7599bbdcf2d8deb6809dc0765ca9e8995dd4b232a0302852`; 1420 x 1000 px, six labeled rows containing twelve original-scale window tiles.
- Original display manifest: SHA256 `7befdf4734ae35a41decf78686543eb920d1ee7c54515ebcdb24616338e23f75`, unchanged.
- Original local and parent-retained HOLD JSON: SHA256 `9b5429d29ea4bc095beaf4fd9279f3ecf1412ffab7addd1fb0f102986e2c0c5d`, both unchanged and 0444.
- Original local HOLD Markdown: SHA256 `6ca0eb87285e9663238bc19749e84b86bf4c77fd80aabfb5c17467d98e67cdc5`, unchanged and 0444.
- Endpoint helper `.intentfold/tickets/STEMROBIN-188/tmp/endpoints-n38-7.mjs`: SHA256 `a32d7c250f470804f0b73adf25000b30e3712886dcb4338e9a98b027217cb75b`; read only to confirm specific target, scroll-window and contact-sheet bindings, not executed.

Actual hashes match the supplied bindings. Current canonical hashes were checked without a content re-review:

- `lesson.json`: `43f85928254712341e9145eaa60eb05ecbfbe0305fa8a1553a2c5b1e70887af4`.
- `exercises.json`: `b413044f460c6231b4a1e1658126033273b0d35e4bd939570cf9e903beae6a25`.
- `answer-keys.json`: `13bd707a4cb35e03937bef472e914cb9fe892f27688fd090853c5eb9ebcab68e`.
- `figures.json`: `b2396f54d51986a5ca3ddab4e8230f241fd6a8d8063861f587c215a9176d2556`, matching original review inventory; neither display manifest supplies a figures.json binding.
- Original HTML: `eec26ead41a0f8970cbb19817ce3093132a66aadad331a363d666d4bcc8504d5`.

The helper selects exactly one actual `.sr-nb` by each original UNKNOWN's exact TeX and captures that element at overlapping scroll positions through its reachable end. Its tiles are not scaled in the contact sheet. Parent-reported native execution first7 exited 0; manifest says browser closed. Original overlay/CSS equivalence is the explicit parent authorization and bound manifest fact, not a newly performed comparison against another author/reviewer.

## Six Conclusions

All windows have client width 310 px (actual wrapper width 310.015625 px). Intervals below describe content coordinates; each second window actually reached its reported terminal scroll position.

| Original UNKNOWN | Windows / continuous coverage | Newly observed terminal portion |
|---|---|---|
| `mobile-489-chain-end` | scroll 0,26; [0,310] + [26,336]; overlap 284 px | Final equality, primed gamma and period are clear. Primed alpha/beta and intervening signs remain legible across the overlap. |
| `mobile-490-vertices-end` | scroll 0,84; [0,310] + [84,394]; overlap 226 px | Complete `Z=l_A intersection l_B` and period are clear. X/Y definitions, subscripts and intersection symbols are continuously covered. |
| `mobile-490-box-end` | scroll 0,11; [0,310] + [11,321]; overlap 299 px | Right vertical box border, its top/bottom joins, 87-degree term and period outside the box are clear. Initial window preserves the left border. |
| `mobile-491-chain-end` | scroll 0,20; [0,310] + [20,330]; overlap 290 px | Full final 180-degree value and period are clear. Six angle terms and signs are continuously covered; the second tile's intentionally cropped opening is in the first tile. |
| `mobile-505-A-exterior-chain-end` | scroll 0,289; [0,310] + [289,599]; overlap 21 px | Repeated `q)` connects the windows. `+(q-p)=270-degree-(x+p)=180-degree` and final period are clear; parentheses and signs are intact. |
| `mobile-505-B-exterior-chain-end` | scroll 0,287; [0,310] + [287,597]; overlap 23 px | Repeated `y)` connects the windows. `+(q-p)=270-degree-(y+p)=180-degree` and final period are clear; no uncovered middle span. |

Each row is **affected PASS**. The initial-window clipping is real and remains documented in the original HOLD, but the companion reachable-end window now supplies the previously missing visual evidence. No symbol, border, degree mark or punctuation loss, vertical crop or incoherent overlap was observed in the combined coverage.

The manifest's `overlapPx=20` is a minimum-overlap step parameter, not the actual overlap of each pair. Actual overlaps are 284, 226, 299, 290, 21 and 23 px. Their union covers each full scroll width with zero gap.

Recorded KaTeX root size is 19.36 px, with unchanged original math scale. This is not an assertion that every superscript/subscript has that size. The terminal ink is visibly legible. Tail bounding boxes differ from wrapper right by +0.15625, -0.25, +0.328125, +0.453125, +0.203125 and +0.421875 px, within the native helper's 1 px rounding tolerance; no actual terminal ink clipping is visible.

## Preserved Review

Original review7.json and review7.md remain byte-for-byte unchanged, 0444, with their original HOLD status and all original observations. This supplement resolves only their six missing-evidence UNKNOWNs; it does not erase the initial clipping observations.

Reuse unchanged original display observations/PASS regions: all 18 prompts and 18 standards regions in both viewports; line/paragraph/subtask layout; tables absence; full 499 figure; original desktop formulas; seams; last 505 and both bottom edges; observed static absence of answer-entry/submission controls. None were reopened or retested.

495/505 numbering findings remain observations, not repaired: number cells `495.*` / `505.*`, with an extra leading `. ` in the body, instead of canonical `495*.` / `505*.`. Affected PASS does not imply those findings are fixed or authorize a text/math change. Original literal 493 UNKNOWN labels and their observations are also unchanged.

Scientific/content and modern fig-238 PASS are reused under the original explicit authorization. There is no new scientific, mathematical, source or figure review.

## Counters And Limits

One cumulative image batch: original 7 + this one contact sheet = **8/8 batch, 8/24 context**. Zero original reopens. One additional endpoint-image allowance used, no allowance remaining in this batch. Twelve tiles are contained in the one loaded image; no separate tile loads. Parent image loads reported: 0.

Reviewer browser launches this repair: 0; cumulative reviewer browser launches remain 1 from the original prompt-only inspection. Parent native endpoint execution reused: 1. Reviewer captures this repair: 0. No paid call, install, canonical/shared edit, content revision, product start/functionality test, source/math/figure re-review, .env/DB access, Git, freshness, agent/message, timer/automation or promotion. Counters were not reset.

This is headless offline equivalent-overlay endpoint evidence, not headed product acceptance or a new full-page capture. Deliberate clipping in each individual tile is covered by its companion, not falsely called complete in isolation. The historical prompt-only HTML limitation remains true; the new bound overlay evidence supplies what that file alone did not.

Only affected-review7.json and this supplement are created in the owned directory and sealed 0444. Stop at review: no promotion, publication, source/math change or scope expansion.
