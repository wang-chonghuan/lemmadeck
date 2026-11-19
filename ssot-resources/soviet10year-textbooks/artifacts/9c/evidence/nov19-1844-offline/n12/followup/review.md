# N12 Actual Layout Followup

**Scoped Actual PASS**, native check exit **0**. This applies only to repaired F001/F002 and their immediately adjacent block geometry. It is not a new screenshot or whole-lesson visual/semantic/Gate2 PASS. Original first visual FAIL, native exit 1, all pixels and 2px subscript advisories remain frozen.

## Actual Targets

| Actual view | Verdict | Assertions | Previous / next estimated ink gap, px |
| --- | --- | --- | --- |
| 1440x960 text | PASS | 16/16 | 25.112 / 26.059 |
| 1440x960 exercises | PASS | 32/32 | 39.582 / 39.697 |
| 390x844 text | PASS | 16/16 | 33.834 / 26.060 |
| 390x844 exercises | PASS | 32/32 | 39.582 / 39.697 |

96 target assertions, 0 failures. The observation used actual changed HTML, not hypothetical clones.

F001: Two deliberate lines, each about **233.953px**, have client/scroll width **234/234** and maximum horizontal scroll **0**. They fit the actual content columns at both viewports, with no hidden horizontal ancestor. A single original annotation and MathML remain exact; original visible tokens are unchanged, second line begins the second equality, KaTeX_Main stays **1.1em**, and the bar covers only **118**, width **27.984px**.

Each line's font-outline estimate extends about 0.037px below its box, with visible overflow and a positive estimated ink-to-ink gap between lines. Neither this internal box overhang nor unused scroll-height extent is treated as a pixel defect or font-size error.

F002: Only the actual 113d/e/f fraction wrappers have `overflow-y:hidden`. Their innerHTML, annotation, minus signs and final punctuation match the preserved before-fragments. Root font stays **1.1em**. Estimated ink bottom margins are **3.305 / 3.305 / 3.022px**, with positive numerator/denominator/rule/side margins. The measured gutter estimate is under 1px rounding tolerance, not the former 15px native scrollbar gutter; no auto vertical scrollbar condition or parent body scroll condition remains.

The hidden wrappers still report scrollHeight/clientHeight **33/32** and a programmatic maximum scrollTop **2px**. UI scrollbar suppression is not described as elimination of the underlying scrollable layout extent.

Immediately neighboring paragraph/exercise boxes do not overlap and estimated ink clearance is positive. 113/114 row border boxes touch without collision; their estimated ink remains about 39.697px apart.

## Bindings And Reuse

The changed files match the parent repair receipt exactly: one text wrapper and three fraction wrappers, with every other HTML byte unchanged. Choices were hash-checked only; no choice HTML navigation or semantic/control review was replayed.

- `text.html`: `ae3ad1b4a16c4ba66df3183abd110c0b776afd1797648f5c1cb6426fd5ba0418`
- `exercises.html`: `ab8e99c2ee041f442e54a8efdb8de1eab0725c37d6bfb4db0d6cd659c9007a38`
- `choices.html`: `d8bea6d6e3a93be49cd28e1d948920be38ba4794e665c306becfa2f4c9c52182`

Input hashes also bind the repair script/receipt, durable original reports/HTML and diagnosis. Other layout/control PASS evidence is reused for unchanged regions only. Original first FAIL and all native/pixel evidence remain unchanged. The human reports retained Franklin final semantic PASS; this reviewer did not re-review it. No source mathematics, Gate2 or renderer rerun.

## Native Closure

One headed Chromium 149.0.7827.55 launch using app Playwright 1.61.1; four loopback page loads at **1440x960 / 390x844**. No fallback, clones, screenshots, crops, controls, external requests or image opens.

Actual native stdout/stderr and exit are bound by `check.native-exit.json`. Browser PID 39052 closed with native exit **0**, and loopback port 55267 is closed. Final ps/lsof probes returned expected no-match exit **1** with empty stdout; exact outputs are in `closure.json`.

## Limits

This is DOM/computed-style/font-outline evidence on the actual changed HTML, with estimated baselines and 1px line-box tolerance. There is **no fresh painted-pixel proof**. Cumulative opens stay **6/6**, this followup **0**. No HTML, canonical, generator or prior report was modified by this reviewer. Return paths/hashes for parent intake and stop this scoped task.
