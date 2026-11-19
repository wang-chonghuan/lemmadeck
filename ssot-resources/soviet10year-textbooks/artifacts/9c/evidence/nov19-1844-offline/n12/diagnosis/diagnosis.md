# N12 Targeted Layout Diagnosis

**COMPLETE_RECOMMENDATION_ONLY.** Original visual FAIL / check exit 1 remain unchanged. This diagnostic's actual exit is 0; it is not repaired visual or semantic acceptance. Franklin semantics still await parent intake.

## F002 Cause

The three short fraction wrappers in 113d/e/f compute `overflow-x:auto; overflow-y:auto`. Their rounded vertical sizes are scrollHeight/clientHeight **33/32**, but their actual maximum scrollTop is **2px**, producing a **15px** native vertical scrollbar gutter. Horizontal scrollWidth equals clientWidth and maximum scrollLeft is zero. Thus the local problem is small vertical scrollable-layout overflow plus cross-axis auto overflow, not a wide fraction or incorrect mathematical font sizing.

Range rectangles and font-outline ink estimates keep the numerator, denominator, rules, minus signs and final punctuation inside the wrapper. Nonpainting positioned KaTeX layout helpers have unusual extents; no specific anonymous box or rounding contribution was individually removed/isolated, so that deeper attribution remains limited.

## Smallest Measured F002 Repair

Only for the three matched fraction wrappers, add **`overflow-y:hidden`**, retaining `overflow-x:auto`. An illustrative scoped selector is `#ex-113 .body .nb:has(.mfrac)`; no selector, CSS or HTML change was persisted.

| View/subpart | Before scroll/client height | Before max scrollTop | Removed wrapper/gutter width | After estimated ink bottom margin |
| --- | --- | --- | --- | --- |
| 1440 d | 33/32 | 2 | 15.000 | 3.305 |
| 1440 e | 33/32 | 2 | 15.000 | 3.304 |
| 1440 f | 33/32 | 2 | 15.000 | 3.023 |
| 390 d | 33/32 | 2 | 15.000 | 3.305 |
| 390 e | 33/32 | 2 | 15.000 | 3.304 |
| 390 f | 33/32 | 2 | 15.000 | 3.023 |

The parent body remains non-scrollable, font stays KaTeX_Main **18.304px / 1.1em**, relative mathematical baseline offset stays 5px, all annotation/rendered characters/punctuation are unchanged, and estimated ink bottom margin exceeds 3px. Hidden overflow remains programmatically scrollable by 2px; the candidate removes UI scrollbar/gutter, not the underlying scrollHeight.

Rejected alternative: `overflow-x:visible` makes both axes visible locally but transfers overflow to the outer question body: max scrollTop 1.5px, scrollHeight/clientHeight 244/242, and a 15px loss of parent client width at both viewports. It is not the smallest adequate repair.

Do not apply this hidden overflow to all formulas or alter KaTeX internals/font/em. Only these three fraction types were measured, with font-ink estimates rather than new pixels.

## F001 Deliberate Break

Reuse the original bound failure. Keep one original annotation/MathML and place a single visual line break **before the second equality sign**:

```tex
-117\frac{1}{3}=-117.3333\ldots
=-118+\frac{2}{3}=\overline{118}.66666\ldots.
```

Concatenating the two lines reconstructs the source TeX exactly. The isolated clone reused existing KaTeX DOM nodes; no renderer or math engine ran. Client/scroll width changed from **328/427**, max scrollLeft **99.5px**, to **234/234**, max scrollLeft **0**. Both line containers are about **233.953px**, within the 343px content column.

Root font remains KaTeX_Main **1.1em**. The overline payload is still exactly **118**, and its rule width remains **27.984px**. Keep overflow visible on this two-line wrapper; do not reuse the fraction-only hidden-overflow repair here. Estimated ink has a 0.038px bottom overhang and the paragraph includes nonpainting scroll-height extent; neither is new pixel clipping evidence. Adjacent full-lesson blocks, other mobile widths and an eventual production implementation were not tested.

## Evidence And Closure

One headed Chromium 149.0.7827.55 launch using app Playwright 1.61.1. Only the exercises target at 1440x960 and 390x844, and the bound long formula at 390x844 were measured. Exactly three loopback HTML requests; no choice page, navigation, screenshots, crops, image opens or renderer replay.

Native `diagnose.native-exit.json` binds script and unaltered stdout/stderr, actual exit **0**. Browser PID 27787 closed with native exit **0**; port 52590 is closed. Final ps/lsof probes return expected no-match exit **1** with empty stdout. Full records are in `closure.json`.

The native raw unchanged-clone heuristic said PASS because `scrollHeight > clientHeight + 1` misses 33/32 after rounding. That raw result and streams remain unchanged. The final diagnosis uses recorded **nonzero maximumScrollTop plus computed auto overflow**, giving before FAIL, `overflow-x:visible` FAIL and `overflow-y:hidden` PASS_HYPOTHESIS_METRICS at both viewports. This is data adjudication, not a browser rerun or a false visual PASS.

All necessary durable inputs were hash-checked unchanged again. Original target DOMs were untouched; only disposable in-memory iframe clones changed. Cumulative image opens remain **6/6**, this batch **0**. Font-outline TextMetrics were measured without canvas drawing or raster inspection.

The original first-review bundle, HTML, canonical, generator and prior source/math/Gate2 results remain unchanged. Full lesson and choice semantics were not reviewed. Wait for parent durable intake and Franklin final before any input modifications.
