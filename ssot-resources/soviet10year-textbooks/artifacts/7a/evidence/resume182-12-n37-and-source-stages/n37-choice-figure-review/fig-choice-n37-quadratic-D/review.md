# fig-choice-n37-quadratic-D

Verdict: pass. Scope: independent authored-figure review only.
Reviewer: independent_agent `01a1f199-5b64-7701-ad3f-af3234bccc9e`.
Image opens: 1 (batch ordinal 8/8), original 640x420.

## Observed Image

Opened the entire final 640x420 PNG once at original resolution. The y=1.73x^2 panel opens upward with vertex (160,210), endpoints (52,120),(268,120); y=-14.8x^2 opens downward with vertex (480,210), endpoints (372,300),(588,300). Independent substitution at x=+/-1 gives 1.73 and -14.8; at +/-1.5 it gives 3.8925 and -33.3. The actual vertical axes are titled y and show +/-5.19 and +/-44.4, respectively, 120 px from zero. Therefore different vertical units, 23.121387 and 2.702703 px per actual y unit, explain the equal screen silhouettes. Horizontal ticks are +/-1.5 with 72 px per x unit in both panels. The negative right y tick, rightmost x label and both bottom Origin (0,0) captions are visible; nothing is clipped or overlapped.

## Mathematical Binding

Independent numeric pair y=1.73x^2 and y=-14.8x^2, vertex (0,0), values at +/-1 are 1.73 and -14.8. Actual y axis ticks +/-5.19 and +/-44.4, respectively; panel vertical units 40/1.73 and 40/14.8. Both x units are 72 canvas units. Finite x window [-1.5,1.5]. Layout repair only: x tick labels are +/-1.5, y ticks are +/-3 vertical base units (numeric +/-5.19 or +/-44.4; normalized +/-3); Origin (0,0) is captioned below. All curve segment coordinates are unchanged.

Recomputed 130 polynomial nodes, 128 curve segments and their 384 endpoint/connectivity assertions. All 136 finite SVG segments (curves and ticks) match spec coordinates; four axis shafts plus materialized arrowheads preserve each full endpoint within 0.05 px. All 398 spec assertions passed the record_review.py rendered-stage validation. Canonical values and subpixel interpolation errors are retained in result.json. No answer-key comparison was performed.

## Layout And Display

At the declared scroll-media width 640 px, the inspected PNG is already the natural display size: the SVG has 20 px formula headings and 18 px axis titles, numeric labels and origin captions, all above the 16 px minimum. All 16 labels are visible and match the SVG text. The two origins are screen (160,210) and (480,210), and their captions are centered below at (160,395),(480,395); the captions identify coordinates, not a second plotted origin. The rightmost x title at (617,210), top headings at y=20 and bottom captions at y=395 have visible clearance from the 640x420 edge. No black raster, accidental text/curve overlap, clipping, missing arrowhead, missing right/bottom object, or cultural/foreign-language label is observed. The finite sampled x window [-1.5,1.5] is not a domain claim: axes extend beyond the curves and there are no filled endpoint markers or domain labels. No app, scroll interaction, alternative viewport screenshot or lesson surface was opened; display approval is limited to this declared 640 px figure contract.

## Current Byte Bindings

- spec: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-D/spec.json`
  SHA-256: `c0144d2373221781b7c5c58eee76035fe194b7acb9b8369bde7d46d2b1cfa359`
- render: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-D/render.json`
  SHA-256: `032d213a95d8eeccb8b34766dc2de01c2e65fe185fb5024cd9d08df28e5bf8c1`
- svg: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-D/figure.svg`
  SHA-256: `cbe48b29e3780c6a2966d112465446209c8830adcbd2ec57c8e8d37cc411e4f6`
- png: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-D/preview.png`
  SHA-256: `f79ead984f528a6026ee95a6b9f186f9a15bd302f1d66ddd47bbaadd79d93e5d`

- Review: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-figure-review/fig-choice-n37-quadratic-D/figure.review.json`
  SHA-256: `26e08646d0495b0f6b5be3c265868f3031a97bec6eeff4416b67d061cf956d60`

## Findings

No definite asset defect; no repair requested.
The repair1 array names preview.png rather than figure.png. The authoritative final path was opened; no substitute was generated.
Inputs were hash-checked before and after review. Original assets and FIRST files were untouched. No app or lesson approval is implied.
